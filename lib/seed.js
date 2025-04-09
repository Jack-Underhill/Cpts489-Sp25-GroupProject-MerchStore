const fs = require('fs');
const path = require('path');
const sequelize = require('./db');
const Product = require('./models/Product');
const Attribute = require('./models/Attribute');

Product.belongsToMany(Attribute, { through: 'ProductAttributes', foreignKey: 'productId' });
Attribute.belongsToMany(Product, { through: 'ProductAttributes', foreignKey: 'attributeId' });

const productDataPath = path.join(__dirname, '../js/products.json');

(async () => {
    try {
        await sequelize.sync({ force: true }); // Drops and recreates all tables (For testing)
        // await sequelize.sync({ alter: true }); // Preserve data

        const rawData = fs.readFileSync(productDataPath);
        const productsRaw = JSON.parse(rawData);

        for (const p of productsRaw) {
            const product = await Product.create({
                name: p.name,
                description: p.description,
                price: p.price,
                imageUrl: p.image,
            });

            for (const attrName of p.attributes || []) {
                const [attribute] = await Attribute.findOrCreate({
                    where: {
                        name: attrName,
                        type: 'tag'
                    }
                });

                await product.addAttribute(attribute);
            }
        }

        console.log(`Seeded ${productsRaw.length} products.`);
    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        await sequelize.close();
    }
})();