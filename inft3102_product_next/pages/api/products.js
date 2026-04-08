export default async function handler(req, res) {

    const SPACE = process.env.CONTENTFUL_SPACE_ID;
    const CDA_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
    const ENV = 'master';


    if (req.method !== 'GET') {

        try {
            const {category} = req.query;
            const filter = category ? `&fields.category[match]=${encodeURIComponent(category)}` : '';

            const response = await fetch(
                `https://cdn.contentful.com/spaces/${SPACE}/environments/${ENV}/entries?content_type=product${filter}`,
                {
                    headers: {
                        Authorization: `Bearer ${CDA_TOKEN}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch Contentful products: ' + response.statusText);
            }

            const data = await response.json();
            const products = (data.items || []).map(item => ({
                id: item.sys.id,
                name: item.fields.name,
                price: item.fields.price,
                vendor: item.fields.vendor,
                description: item.fields.description,
                category: item.fields.category,
                image: item.fields.image?.fields?.file?.url || null
            }));

            return res.status(200).json(products);

        } catch (error) {
            return res.status(500).json({error: 'Failed to fetch products: ' + error.message});
        }
    }

    return res.status(405).json({error: 'Method not allowed'});

}