const crypto = require('crypto');
const fs = require('fs');
const { querydb } = require('./database');

function hash_pass(password) {
    const SALT = fs.readFileSync('secrets/SALT', 'utf8');
    const hpass = crypto.createHash('sha256', SALT)
        .update(password)
        .digest('hex');
    return hpass;
}

function generate_token(uid) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 168);
    return {
        uid: uid,
        token: token,
        expires_at: expiration
    };
}

async function get_user_from_token(token) {
    const auth = await querydb('SELECT * FROM token WHERE token = ?', [token]);
    console.log(auth)
    if (auth.length == 0) {
        return null;
    }

    const user = await querydb('SELECT uid, name, email FROM user WHERE uid = ?', [auth[0].uid]);
    if (user.length < 0) {
        return null;
    }

    return user[0];

}

module.exports = { hash_pass, generate_token, get_user_from_token };