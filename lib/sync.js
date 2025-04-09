const User = require('./models/User');
const Product = require('./models/Product');
const Attribute = require('./models/Attribute');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');
const CartItem = require('./models/CartItem');
const sequelize = require('./db');

Order.belongsToMany(Product, { through: OrderItem, foreignKey: 'orderId' });
Product.belongsToMany(Order, { through: OrderItem, foreignKey: 'productId' });

User.belongsToMany(Product, { through: CartItem, foreignKey: 'userId' });
Product.belongsToMany(User, { through: CartItem, foreignKey: 'productId' });

Product.belongsToMany(Attribute, { through: 'ProductAttributes', foreignKey: 'productId' });
Attribute.belongsToMany(Product, { through: 'ProductAttributes', foreignKey: 'attributeId' });

(async () => {
    try {
        await sequelize.sync({ force: true }); // Drops and recreates all tables (For testing)
        // await sequelize.sync({ alter: true }); // Preserve data
        
        console.log('Database synced successfully.');
    } catch (err) {
        console.error('Error syncing database:', err);
    } finally {
        await sequelize.close();
    }
})();