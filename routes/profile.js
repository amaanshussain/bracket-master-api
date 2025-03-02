const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');

router.post('/new', (req, res) => {

    const uid = uuidv4();

    const user = {
        uid: uid,
        name: 'John Doe'
    }

    res.send({ response: "User created", user: user });
});

module.exports = router;