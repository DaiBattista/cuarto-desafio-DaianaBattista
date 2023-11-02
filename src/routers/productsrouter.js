const { Router } = require('express');
const { v4: uuidV4 } = require('uuid');
const encoding = 'utf-8';
const products = require('../products.json');
const router = Router();

// Ruta raíz GET /products
router.route('/products')
    .get((req, res) => {
    })
    .post((req, res) => {
        const { body } = req;
        const { title, description, code, price, stock, category } = body;
        const status = body.status !== undefined ? body.status : true;
        const thumbnails = body.thumbnails || [];

        io.emit('productCreated', newProduct);

        // Validar campos obligatorios
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({
                message: 'Se requieren campos esenciales: title, description, code, price, stock, category.',
            });
        }

        // Validar que el código no esté duplicado
        const isCodeDuplicate = products.some((product) => product.code === code);
        if (isCodeDuplicate) {
            return res.status(400).json({
                message: 'El código del producto ya existe. Debe ser único.',
            });
        }

        const newProduct = {
            id: uuidV4(),
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails,
        };

        products.push(newProduct);

        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.status(201).json(newProduct);
    });

// Ruta GET /products/:pid
router.get('/products/:pid', (req, res) => {
    const pid = req.params.pid;
    const product = products.find((product) => product.id === pid);

    if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(200).json(product);
});

// Ruta PUT /products/:pid
router.put('/products/:pid', (req, res) => {
    const pid = req.params.pid;
    const product = products.find((product) => product.id === pid);

    if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }

    for (const key in req.body) {
        if (key !== 'id') {
            product[key] = req.body[key];
        }
    }

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(200).json(product);
});

// Ruta DELETE /products/:pid
router.delete('/products/:pid', (req, res) => {
    const pid = req.params.pid;
    const productIndex = products.findIndex((product) => product.id === pid);

    if (productIndex === -1) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }

    products.splice(productIndex, 1);

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(200).json({ message: 'Producto eliminado' });

    io.emit('productDeleted', { productId: pid });
    
});

module.exports = router;