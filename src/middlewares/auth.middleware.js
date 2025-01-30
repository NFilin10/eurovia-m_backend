const jwt = require("jsonwebtoken");
const secret = process.env.SECRET

const authenticate = async (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ error: "Authentication required" });
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.userId = decoded.id;
        next(); // Call the next middleware
    } catch (err) {
        console.error('Authentication error:', err.message);
        return res.status(403).json({ error: "Invalid token" });
    }
};

module.exports = authenticate;