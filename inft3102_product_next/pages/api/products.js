import content from "*.bmp";


export default async function handler(req, res) {

    const SPACE = process.env.CONTENTFUL_SPACE_ID;
    const CDA_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
    const CMA_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
    const ENV = 'master';


    if (req.method !== 'GET') {

        try {
            const {author} = req.query;
            const filter = author ? `&fields.author[match]=${encodeURIComponent(author)}` : '';

            const response = await fetch(
                `https://cdn.contentful.com/spaces/${SPACE}/environments/${ENV}/entries?content_type=post${filter}`,
                {
                    headers: {
                        Authorization: `Bearer ${CDA_TOKEN}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch Contentful posts: ' + response.statusText);
            }

            const data = await response.json();
            const posts = (data.items || []).map(item => ({
                id: item.sys.id,
                title: item.fields.title,
                content: item.fields.body,
                author: item.fields.author,
                category: item.fields.category,
                image: item.fields.image?.fields?.file?.url || null
            }));

            return res.status(200).json(posts);

        } catch (error) {
            return res.status(500).json({error: 'Failed to fetch posts: ' + error.message});
        }
    }

    if (req.method === 'POST') {

        try{
            const {title, body, author, category} = req.body || {};
            if (!title || !body || !author || !category) {
                return res.status(400).json({error: 'Missing required fields: title, body, author'});
            }

            const createResponse = await fetch(
                `https://api.contentful.com/spaces/${SPACE}/environments/${ENV}/entries`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${CDA_TOKEN}`,
                        'Content-Type': 'application/vnd.contentful.management.v1+json',
                        'X-Contentful-Content-Type': 'post'
                    },
                    body: JSON.stringify({
                        fields: {
                            title: {title},
                            body: {body},
                            author: {author},
                            category: {category}
                        }
                    })
                }
            );

            if(!createResponse.ok) {
                const text = await createResponse.text();
                throw new Error(`Failed to create post entry: ${createResponse.status} ${text}`);
            }

            const created = await createResponse.json();
            const entryId = created.sys.id;
            const version = created.sys.version;

            const publishResponse = await fetch(
                `https://api.contentful.com/spaces/${SPACE}/environments/${ENV}/entries/${entryId}/published`,
                {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${CDA_TOKEN}`,
                        'X-Contentful-Version': String(version),
                    }
                }
            );

            if(!publishResponse.ok) {
                const text = await publishResponse.text();
                throw new Error(`Failed to publish post entry: ${publishResponse.status} ${text}`);
            }

            return res.status(201).json({
                id: entryId,
                title,
                body,
                author,
                category,
                published: true,
                message: 'Post created and published successfully'
            });

        } catch(error) {
            console.error('Error creating post: ' + error.message);
            return res.status(500).json({error: 'Failed to create post: ' + error.message});
        }
    }

    return res.status(405).json({error: 'Method not allowed'});

}