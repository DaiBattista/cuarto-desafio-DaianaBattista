const express = require('express');
const uuid = require('uuid');
const fs = require('fs');
const carts = require('../carts.json');

const router = express.Router();

router.get('/api/carts', (req, res) => {
    res.json(carts);
});

router.post('/api/carts', (req, res) => {
    const newCart = {
        id: uuid.v4(),
        products: [],
    };
    carts.push(newCart);
    saveCarts();
    res.status(201).json(newCart);
});

router.get('/api/carts/:cid', (req, res) => {
    const cartId = req.params.cid;
    const cart = carts.find((cart) => cart.id === cartId);

    if (!cart) {
        return res.status(404).json({
            message: `El carrito con ID ${cartId} no existe.`,
        });
    }
    res.json(cart);
});

router.post('/api/carts/:cid/products/:pid', (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    const cart = carts.find((cart) => cart.id === cartId);

    if (!cart) {
        return res.status(404).json({
            message: `El carrito con ID ${cartId} no existe.`,
        });
    }

    // Verificar si el producto ya está en el carrito
    const existingProduct = cart.products.find((product) => product.id === productId);

    if (!existingProduct) {
        // Si el producto no existe en el carrito, mostrar mensaje de error
        return res.status(404).json({
            message: `El producto con ID ${productId} no existe en el carrito.`,
        });
    }

    // Si el producto ya está en el carrito, incrementa la cantidad
    existingProduct.quantity += quantity;

    saveCarts();

    res.json(cart);
});

function saveCarts() {
    const data = JSON.stringify(carts);

    fs.writeFile('../carts.json', data, (err) => {
        if (err) {
            console.error('Error writing carts.json:', err);
        } else {
            console.log('Carts saved successfully.');
        }
    });
}

module.exports = router;