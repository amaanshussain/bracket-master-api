const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');

router.post('/new', (req, res) => {

    const bid = uuidv4();

    const bracket = {
        bid: bid,
        visibility: 'public',
        type: 'single',
        name: 'New Bracket',
        participants: [],
        matches: []
    }

    res.send({ response: "Bracket created", bracket: bracket });
});

module.exports = router;