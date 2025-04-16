const express = require('express');
const router = express.Router();

const { Product, Attribute, Order, OrderItem, CartItem, User } = require('../lib/associations');

router.post('/add', async (req, res) => {
    try {
        const user = req.session.user;
        if (!user) return res.status(401).json({ error: "Not logged in" });

        const { productId, quantity } = req.body;

        const existing = await CartItem.findOne({
            where: { userId: user.id, productId }
        });

        if (existing) {
            existing.quantity += Number(quantity || 1);
            await existing.save();
        } else {
            await CartItem.create({
                userId: user.id,
                productId,
                quantity: quantity || 1
            });
        }

        res.json({ success: true, message: 'Added to cart.' });
    } catch (err) {
        console.error('Error adding to cart:', err);
        res.status(500).json({ error: 'Failed to add item to cart.' });
    }
});

router.get('/', async (req, res) => {
    try {
        const userId = req.session?.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Not logged in' });
        }

        const cartItems = await CartItem.findAll({
            where: { userId },
            include: [{
                model: Product,
                attributes: ['id', 'name', 'price', 'imageUrl']
            }]
        });

        const formatted = cartItems.map(item => ({
            quantity: item.quantity,
            product: item.Product
        }));

        res.json(formatted);

    } catch (err) {
        console.error('Error fetching cart:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;