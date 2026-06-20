const jwt = require("jsonwebtoken");
function authenticateToken(req, res, next) {
   

    const token = req.cookies.token;

    if (!token) {
        res.status(403).send({
            message: "You are not loggged in"
        });
        return;
    }

    const decoded = jwt.verify(token, "harshit123");
    const userId = decoded.userId;
    
    if (!userId) {
        res.status(403).json({
            message: "malformed token"
        })
        return;
    }

    req.userId = userId;

    next();
}

module.exports = {
    authenticateToken
}

