const { get_user_from_token } = require("../js/utils");

const mw_verify_token = async (req, res, next) => {

    req.user = null;

    const token = req.cookies.token;
    if (!token) {
        res.status(401).send({ response: "No authorization token found." });
        return;
    }

    const user = await get_user_from_token(token);
    if (!user) {
        res.status(401).send({ response: "Token is not valid." });
        return;
    }

    req.user = user;
    next();
}

module.exports = mw_verify_token;