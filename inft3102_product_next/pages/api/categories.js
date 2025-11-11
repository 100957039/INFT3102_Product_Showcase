export default async function handler(req, res) {

    const { method } = req.method;

    if(method !== 'GET') {
        return res.status(405).json({error: 'Method Not Allowed'});
    }

    const {category} = req.query;
    if (!category) {
        return res.status(405).json({error: 'Missing required category'});
    }

    const url = `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${process.env.CONTENTFUL_ENV}/entries?content_type=post&access_token=${process.env.CONTENTFUL_ACCESS_TOKEN}&fields.category=${encodeURIComponent(category)}`;

    try{
        console.log('Fetching posts by category');
        const response = await fetch(url);

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error('Failed to fetch posts: ' + errorBody);
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

        res.status(200).json(posts);

    } catch(error) {
        console.error('Error fetching posts by category', error.message);
        res.status(500).json({error: 'Failed to fetch posts: ' + error.message});
    }

}