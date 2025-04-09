const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

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