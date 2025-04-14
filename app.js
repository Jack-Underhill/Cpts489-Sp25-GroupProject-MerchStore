const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const productRoutes = require('./routes/products.js');
const userRoutes = require('./routes/users.js');
const cartRoutes = require('./routes/carts.js');

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
app.use('/api', userRoutes);
app.use('/api/cart', cartRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/home.html'));
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