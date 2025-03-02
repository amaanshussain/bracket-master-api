const { querydb } = require('../js/database');
const { hash_pass } = require('../js/utils');

class User {
    constructor(email) {
        this.email = email;
        this.uid;
        this.name;
        this.hpass;

    }

    async findUser() {
        const user = await querydb('SELECT * FROM user WHERE email = ?', [this.email]);
        if (user.length > 0) {
            this.uid = user[0].uid;
            this.name = user[0].name;
            this.hpass = user[0].hpass;
        }
    }

    async getUser() {
        await this.findUser();

        return this.uid ? {
            email: this.email,
            name: this.name,
            uid: this.uid
        } : null;
    }

    async verifyAuth(password) {
        const hpass = hash_pass(password);
        return this.hpass === hpass;
    }
}

module.exports = User;