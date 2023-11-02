const { Router } = require('express')
const router = Router();

router.get('/', (req, res) => {
    res.status(200).json({ message: 'Bienvenidos a Pintier: Para todos los deportes un solo nombre'});
});

module.exports = router;