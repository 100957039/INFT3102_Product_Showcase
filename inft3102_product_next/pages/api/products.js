import {verifyToken} from "@/lib/auth";
import {version} from "react";

export default async function handler(req, res) {

    const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
    const CDA_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
    const CMA_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
    const ENV = 'master';
    const LOCALE = 'en-US';

    function requireAuth(handler) {
        return async (req, res) => {
            const token = req.cookies?.token;
            const payload = verifyToken(token);
            if (!payload) return res.status(401).json({error: "Authentication Required"});
            req.user = payload;
            return handler(req, res);
        };
    }

    if (req.method !== 'GET') {

        try {
            const url = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/${ENV}/entries?content_type=product&access_token=${CDA_TOKEN}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to fetch Contentful products: ' + response.statusText);
            }

            const products = data.items.slice(0, 5).map((item) => {
                const imageId = item.fields.image?.sys?.id;
                const asset = data.includes?.Asset?.find(a => a.sys.id === imageId);

                return {
                    id: item.sys.id,
                    name: item.fields.name,
                    price: item.fields.price,
                    vendor: item.fields.vendor,
                    description: item.fields.description,
                    category: item.fields.category,
                    image: `https:${asset.fields.file.url}` || null
                };
            });

            return res.status(200).json(products);

        } catch (error) {
            return res.status(500).json({error: 'Failed to fetch products: ' + error.message});
        }
    }
    
    if (req.method === 'POST') {

        return requireAuth(async (req, res) => {
            const {name, price, description, vendor, category} = req.body || {};
            if (!name || !price || !description || !vendor || !category) {
                return res.status(400).json({error: 'Missing required fields: name, price, description, vendor'});
            }

            try {
                const createResponse = await fetch(
                    `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENV}/entries`,
                    {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${CMA_TOKEN}`,
                            'Content-Type': 'application/vnd.contentful.management.v1+json',
                            'X-Contentful-Content-Type': 'product',
                        },
                        body: JSON.stringify({
                                content_type_id: 'product',
                                fields: {
                                    name: {[LOCALE]: name},
                                    price: {[LOCALE]: price},
                                    description: {[LOCALE]: description},
                                    vendor: {[LOCALE]: vendor},
                                    category: {[LOCALE]: category}
                                }
                            }
                        )
                    }
                );

                if (!createResponse.ok) {
                    const text = await createResponse.text();
                    throw new Error(`Failed to create product entry: ${createResponse.status} ${text}`);
                }

                const created = await createResponse.json();
                const entryId = created.sys.id;
                const version = created.sys.version;

                const publishResponse = await fetch(
                    `https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENV}/entries/${entryId}/published`,
                    {
                        method: 'PUT',
                        headers: {
                            Authorization: `Bearer ${CMA_TOKEN}`,
                            'X-Contentful-Version': String(version)
                        }
                    },
                );

                if (!publishResponse.ok) {
                    const text = await publishResponse.text();
                    throw new Error(`Failed to publish product entry: ${publishResponse.status} ${text}`);
                }

                return res.status(201).json({
                    id: entryId,
                    name,
                    price,
                    description,
                    vendor,
                    category,
                    published: true,
                    message: 'Product created and published successfully'
                });
            } catch (error) {
                console.error('Error creating product: ' + error.message);
                return res.status(500).json({error: 'Failed to create product: ' + error.message});
            }

        })(req, res);
    }

    if (req.method === 'PUT') {
        return requireAuth(async (req, res) => {
            const {id, name, price, description, vendor, category} = req.body || {};
            if (!id || !name || !price|| !description || !vendor || !category) {
                return res.status(400).json({error: 'Missing required fields: name, price, description, vendor'});
            }

            try{
                const entryRep = await fetch(`https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENV}/entries/${id}`, {
                    headers: {
                        Authorization: `Bearer ${CMA_TOKEN}`,
                        'Content-Type': 'application/vnd.contentful.management.v1+json',
                    }
                });

                if(!entryRep.ok){
                    const err = await entryRep.text();
                    throw new Error(`Failed to create product: ${err}`);
                }

                const entry = await entryRep.json();
                const currentVersion = entry.sys.version;

                if(entry.fields.vendor?.[LOCALE] !== req.user.email && req.user.role !== 'admin'){
                    return res.status(403).json({error: 'Forbidden'})
                }

                const updateRes = await fetch(`https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENV}/entries/${id}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${CMA_TOKEN}`,
                        'Content-Type': 'application/vnd.contentful.management.v1+json',
                        'X-Contentful-Version': String(currentVersion)
                    },
                    body: JSON.stringify({
                        fields: {
                            name: {[LOCALE]: name},
                            price: {[LOCALE]: price},
                            description: {[LOCALE]: description},
                            vendor: {[LOCALE]: vendor},
                            category: {[LOCALE]: category},
                        }
                    })
                });

                if(!updateRes.ok){
                    const err = await updateRes.text();
                    throw new Error(`Failed to create product: ${err}`);
                }

                const updated = await updateRes.json();

                const publishRes = await fetch(`https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENV}/entries/${id}/published`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${CMA_TOKEN}`,
                        'Content-Type': 'application/vnd.contentful.management.v1+json',
                        'X-Contentful-Version': String(updated.sys.version)
                    }
                });

                if(!publishRes.ok){
                    const err = await publishRes.text();
                    throw new Error(`Failed Publish product: ${err}`);
                }

                res.status(204).json({success: true});

            }catch(err){
                console.error('Error Editing Product: ' + err);
                res.status(500).json({error: err.message});
            }

        })(req, res);
    }

    if (req.method === 'DELETE') {
        return requireAuth(async (req, res) => {

            const { id } = req.query;
            if(!id) return res.status(400).json({error: 'Id is Required'});

            try{
                const getResponse = await(`http://localhost:3000/api/products`);
                const products = await getResponse.json();
                const product = products.find(p => p.id === id);
                if(!product) return res.status(404).json({error: 'No product found with id '});

                if(product.vendor !== req.user.email && req.user.role !== 'admin'){
                    return res.status(403).json({error: 'Forbidden'})
                }

                await fetch(`https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENV}/entries/${id}/published`, {
                    method: 'DELETE', headers: { Authorization: `Bearer ${CMA_TOKEN}` }
                });

                await fetch(`https://api.contentful.com/spaces/${SPACE_ID}/environments/${ENV}/entries/${id}`, {
                    method: 'DELETE', headers: { Authorization: `Bearer ${CMA_TOKEN}` }
                });

                res.status(200).json({success: true});

            }catch(err){
                console.error('Error Deleting product: ' + err);
                res.status(500).json({error: err.message});
            }

        })(req, res);
    }


    // Catch any remaining incoming requests
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    return res.status(405).json({error: 'Method not allowed'});
}