const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const productRoutes = require('./routes/products.js');

const { User, Product, CartItem } = require('./lib/associations');

// Session middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/home.html'));
});

// Sign-in endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const user = await User.findOne({ where: { email } });

        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        // Save user details to session
        req.session.user = {
            id: user.id,
            email: user.email,
            role: user.role
        };

        res.json({ success: true, message: 'Logged in successfully.' });

    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Endpoint to check current logged-in user
app.get('/api/current-user', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Could not log out.' });
        }
        res.json({ success: true });
    });
});

// New registration endpoint to store user data
app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate that both email and password are provided.
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        // Use the email as the username if no separate username field is provided.
        const username = email;

        // Check whether a user with the given email already exists.
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists.' });
        }

        // Create a new user with the provided data (no password encryption is applied).
        const newUser = await User.create({ username, email, password });
        res.status(201).json({
            success: true,
            message: 'User registered successfully!',
            user: newUser
        });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ error: 'Failed to register user.' });
    }
});

app.post('/api/cart/add', async (req, res) => {
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
app.get('/api/cart', async (req, res) => {
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