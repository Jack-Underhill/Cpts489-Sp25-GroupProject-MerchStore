const { Product, Attribute, Order, OrderItem, CartItem, User } = require('./associations');
const sequelize = require('./db');

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