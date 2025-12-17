const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

// Middleware to protect routes
const protectRoute = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }
        const token = authHeader.split(" ")[1];
        // console.log(token)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");

        if(!user) return res.json({ success:false, message: "User not found." });

        req.user = user;
        next();
    } catch (error) {
        console.log(error.message);
        res.json({ success:false, message: error.message });
    }
}

module.exports = protectRoute

