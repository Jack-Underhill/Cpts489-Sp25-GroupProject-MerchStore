const express = require('express');
const router = express.Router();

const { Product, Attribute, Order, OrderItem, CartItem, User } = require('../lib/associations');
const productHelpers = require('../backend/productHelpers');

const upload = productHelpers.getProductImageUpload();

router.get('/', async (req, res) => {
    try {
        const products = await Product.findAll();
        const productsWithAttributes = await Promise.all(
            products.map(p => productHelpers.fetchProductWithAttributes(p.id))
        );

        const formatted = productsWithAttributes.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            description: p.description,
            imageUrl: p.imageUrl,
            attributes: p.Attributes.map(attr => attr.name),
        }));

        res.json(formatted);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get product by ID
router.get('/id/:id', async (req, res) => {
    try {
        const productId = req.params.id;

        const product = await Product.findByPk(productId, {
            include: {
                model: Attribute,
                through: { attributes: [] }
            }
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        res.json({
            id: product.id,
            name: product.name,
            price: product.price,
            description: product.description,
            imageUrl: product.imageUrl,
            attributes: product.Attributes.map(attr => attr.name)
        });

    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

router.post('/', async (req, res) => {
    try {
        const form = upload.single('image');

        form(req, res, async (err) => {
            if(err) {
                console.error('Multer error:', err);
                return res.status(400).json({ error: 'A product with this name already exists.' });
            }
            
            const { name, price, description, attributes } = req.body;
            
            if(await productHelpers.isProductNameTaken(name)) {
                productHelpers.deleteUploadedFile(req.file);
                return res.status(400).json({ error: 'A product with this name already exists.' });
            }

            const product = await productHelpers.prepareAndPersistProduct({
                req,
                name,
                price,
                description
            });
            const fullProduct = await productHelpers.finalizeProductWithAttributes(product, attributes, false);
            
            res.status(201).json(fullProduct);
        });
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

router.put('/', upload.single("image"), async (req, res) => {
    try {
        const { id, name, price, description, attributes } = req.body;
        const existingProduct = await Product.findByPk(id);

        if(!existingProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        if(await productHelpers.isProductNameTaken(name, id)) {
            productHelpers.deleteUploadedFile(req.file);
            return res.status(400).json({ error: 'A product with this name already exists.' });
        }

        const updatedProduct = await productHelpers.prepareAndPersistProduct({
            req,
            name,
            price,
            description,
            existingProduct
        });
        const fullProduct = await productHelpers.finalizeProductWithAttributes(updatedProduct, attributes, true);

        res.status(200).json(fullProduct);
    } catch (err) {
        console.error('Error  product:', err);
        res.status(500).json({ error: 'Failed to edit product' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findByPk(id);
        
        if(!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        
        productHelpers.deleteProductImage(product.imageUrl);
        await product.destroy();

        res.json({ success: true });
    } catch (err) {
        console.error('Error  product:', err);
        res.status(500).json({ error: 'Failed to ' });
    }
});

module.exports = router;