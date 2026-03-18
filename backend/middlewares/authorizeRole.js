import { User } from "../models/user.model.js";

const authorizeRole = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.id);
            if (!user) {
                return res.status(401).json({ message: "User not found.", success: false });
            }
            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({
                    message: "Access denied. You are not authorized to perform this action.",
                    success: false
                });
            }
            next();
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error.", success: false });
        }
    };
};

export default authorizeRole;
