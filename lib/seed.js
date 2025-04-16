const fs = require('fs');
const path = require('path');
const sequelize = require('./db');

const { Product, Attribute, Order, OrderItem, CartItem, User } = require('./associations');

const productDataPath = path.join(__dirname, '../public/js/products.json');
const userDataPath = path.join(__dirname, '../public/js/users.json');

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

        const usersRaw = JSON.parse(fs.readFileSync(userDataPath));
        for(const u of usersRaw) {
            await User.create({
                username: u.username,
                email: u.email,
                password: u.password,
                role: u.role
            });
        }
        console.log(`Seeded ${usersRaw.length} users.`);

        const adminUser = usersRaw.find(u => u.role === 'admin');
        if(adminUser) {
            console.log(`Admin credentials -> email: ${adminUser.email} | password: ${adminUser.password}`);
        }
    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        await sequelize.close();
    }
})();