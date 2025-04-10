const Product = require('./models/Product');
const Attribute = require('./models/Attribute');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');
const CartItem = require('./models/CartItem');
const User = require('./models/User');

Order.belongsToMany(Product, { through: OrderItem, foreignKey: 'orderId' });
Product.belongsToMany(Order, { through: OrderItem, foreignKey: 'productId' });

User.belongsToMany(Product, { through: CartItem, foreignKey: 'userId' });
Product.belongsToMany(User, { through: CartItem, foreignKey: 'productId' });

Product.belongsToMany(Attribute, { through: 'ProductAttributes', foreignKey: 'productId' });
Attribute.belongsToMany(Product, { through: 'ProductAttributes', foreignKey: 'attributeId' });

module.exports = {
    Product,
    Attribute,
    Order,
    OrderItem,
    CartItem,
    User
};