const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');

const User = require('../classes/user');
const { querydb } = require('../js/database');
const { hash_pass, generate_token } = require('../js/utils');
const mw_verify_token = require('../middleware/verify_token');

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

    // create token
    const token = generate_token(uid);
    await querydb('INSERT INTO token SET ?', token);
    res.cookie('token', token.token, { expires: token.expires_at });

    res.send({ response: "User created", user: newuser });
});

router.post('/signin', [mw_verify_token], async (req, res) => {

    const { email, password } = req.body;

    // check if user is already signed in
    if (req.user && req.user.email == email) {
        res.send({ response: "User signed in", user: req.user });
        return;
    }

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

    // create token
    const token = generate_token(user.uid);
    await querydb('INSERT INTO token SET ?', token);
    res.cookie('token', token.token, { expires: token.expires_at });

    delete user.hpass;
    res.send({ response: "User signed in", user: user });
});

router.post('/signout', async (req, res) => {
    if (req.cookies.token) {
        await querydb('DELETE FROM token WHERE token = ?', req.cookies.token);
        res.cookie('token', '', { expires: new Date(0) });
        res.send({ response: "User signed out" });
    } else {
        res.status(401).send({ response: "User not signed in." });
    }
});

module.exports = router;