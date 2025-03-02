const router = require('express').Router();
const mw_verify_token = require('../middleware/verify_token');

router.get('/', [mw_verify_token], async (req, res) => {

    const user = req.user;

    res.send({ response: "Retrieved profile.", user: user });
});

module.exports = router;