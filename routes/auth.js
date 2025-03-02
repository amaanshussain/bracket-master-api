const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');

const User = require('../classes/user');
const { querydb } = require('../js/database');
const { hash_pass, generate_token } = require('../js/utils');

router.post('/signup', async (req, res) => {

    const { name, email, password } = req.body;
    
    // check if user exists
    const user = new User(email);
    const userExists = await user.getUser();
    if (userExists) {
        res.status(409).send({ response: "User already exists." });
        return;
    }
    
    // create user
    const uid = uuidv4();
    const hpass = hash_pass(password);
    const newuser = {
        uid: uid,
        name: name,
        email: email,
        hpass: hpass
    }
    await querydb('INSERT INTO user SET ?', newuser);
    delete newuser.hpass;

    const token = generate_token(uid);
    await querydb('INSERT INTO token SET ?', token);
    res.cookie('token', token.token, { expires: token.expires_at });

    res.send({ response: "User created", user: newuser });
});

router.post('/signin', async (req, res) => {

    const { email, password } = req.body;

    // check if user exists
    const user = new User(email);
    const userExists = await user.getUser();
    if (!userExists) {
        res.status(401).send({ response: "User does not exist." });
        return;
    }

    // verify password
    const isAuth = await user.verifyAuth(password);
    if (!isAuth) {
        res.status(401).send({ response: "Invalid password." });
        return;
    }

    const token = generate_token(user.uid);
    await querydb('INSERT INTO token SET ?', token);
    res.cookie('token', token.token, { expires: token.expires_at });

    res.send({ response: "User signed in" });
});


module.exports = router;