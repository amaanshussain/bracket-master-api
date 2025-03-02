const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');

router.post('/new', (req, res) => {

    const tid = uuidv4();

    const team = {
        tid: tid,
        name: 'Dallas Mavericks',
        owner: '',
        members: []
    }

    res.send({ response: "Team created", team: team });
});

module.exports = router;