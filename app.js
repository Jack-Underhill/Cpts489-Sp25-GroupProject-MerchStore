const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const { Product, Attribute, Order, OrderItem, CartItem, User } = require('./lib/associations');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/products');
    },
    filename: function(req, file, cb) {
        const originalExt = path.extname(file.originalname);
        const rawName = req.body.name || 'product';
        const safeName = rawName.trim().replace(/\s+/g, '-');
        const filename = `${safeName}${originalExt}`;
        cb(null, filename);
    }
});
const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/home.html'));
});

app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.findAll({
            include: {
                model: Attribute,
                through: { attributes: [] },
            }
        });

        const formatted = products.map(p => ({
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

app.post('/api/products', async (req, res) => {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    try {
        const form = multer({ storage: storage }).single('image');

        form(req, res, async (err) => {
            if(err) {
                console.error('Multer error:', err);
                return res.status(400).json({ error: 'A product with this name already exists.' });
            }
            
            const { name, price, description, attributes } = req.body;
            
            const existing = await Product.findOne({ where: { name } });
            if(existing) {
                if (req.file) {
                    const fs = require('fs');
                    const imagePath = path.join(__dirname, 'public/images/products', req.file.filename);
                    fs.unlink(imagePath, (err) => {
                        if(err) console.warn('Failed to delete duplicate image:', err);
                    });
                }
                return res.status(400).json({ error: 'A product with this name already exists.' });
            }
            
            let imageUrl;
            
            if(req.file) {
                const ext = path.extname(req.file.originalname);
                const safeName = name.trim().replace(/\s+/g, '-');
                const newFilename = `${safeName}${ext}`;

                const fs = require('fs');
                const oldPath = req.file.path;
                const newPath = path.join(__dirname, 'public/images/products', newFilename);

                fs.renameSync(oldPath, newPath);
                imageUrl = `/images/products/${newFilename}`;
            } else {
                const fs = require('fs');
                const ext = '.png';
                const safeName = name.trim().replace(/\s+/g, '-');
                const newFilename = `${safeName}${ext}`;

                const srcPath = path.join(__dirname, 'public/images/placeholder.png');
                const dstPath = path.join(__dirname, 'public/images/products', newFilename);

                fs.copyFileSync(srcPath, dstPath);
                imageUrl = `/images/products/${newFilename}`;
            }

            const product = await Product.create({
                name,
                price: parseFloat(price),
                description,
                imageUrl,
            });
            
            if(attributes) {
                const attrList = attributes.split(',').map(attr => attr.trim());
                for(const attrName of attrList) {
                    const [attribute] = await Attribute.findOrCreate({
                        where: { name: attrName, type: 'tag' },
                    });
                    await product.addAttribute(attribute);
                }
            }
            
            const fullProduct = await Product.findByPk(product.id, {
                include: {
                    model: Attribute,
                    through: { attributes: [] },
                }
            });

            res.status(201).json(fullProduct);
        });
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

app.put('/api/products', upload.single("image"), async (req, res) => {
    try {
        const { id, name, price, description, attributes } = req.body;
        console.log("BODY", req.body);
        console.log("FILE:", req.file);

        const product = await Product.findByPk(id);
        if(!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        product.name = name;
        product.price = parseFloat(price);
        product.description = description;

        if(req.file) {
            const ext = path.extname(req.file.originalname);
            const safeName = name.trim().replace(/\s+/g, '-');
            product.imageUrl = `/images/products/${safeName}${ext}`
        }

        await product.save();

        if(attributes) {
            const attrList = attributes.split(',').map(attr => attr.trim());

            const foundAttrs = await Promise.all(attrList.map(async (attrName) => {
                const [attribute] = await Attribute.findOrCreate({
                    where: { name: attrName, type: 'tag' },
                });

                return attribute;
            }));

            await product.setAttributes(foundAttrs);
        }
            
        const fullProduct = await Product.findByPk(product.id, {
            include: {
                model: Attribute,
                through: { attributes: [] },
            }
        });

        res.status(200).json(fullProduct);
    } catch (err) {
        console.error('Error  product:', err);
        res.status(500).json({ error: 'Failed to ' });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findByPk(id);
        
        if(!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        
        const fs = require('fs');
        const rawImageUrl = product.imageUrl || '';
        const cleanImagePath = rawImageUrl.replace(/^\/+/, '');
        const imagePath = path.resolve(__dirname, 'public', cleanImagePath);

        if(fs.existsSync(imagePath)) {
            fs.unlink(imagePath, err => {
                if(err) {
                    console.warn("Failed to delete image file:", err);
                }
            });
        }

        await product.destroy();
        res.json({ success: true });
    } catch (err) {
        console.error('Error  product:', err);
        res.status(500).json({ error: 'Failed to ' });
    }
});

// Route to any page
app.get('/:page', (req, res) => {
    const page = req.params.page;
    res.sendFile(path.join(__dirname, `public/pages/${page}.html`), err => {
        if (err) res.status(404).send('Page not found');
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});