const asyncHandler = require("express-async-handler");
const UserProfile = require("../models/UserSchema");

const allUsers = asyncHandler(async (req, res) => {
    try {
        const keyword = req.query.search
          ? {
              $or: [
                { "User.Personal_info.Username": { $regex: req.query.search, $options: "i" } },
                { "User.Personal_info.Email": { $regex: req.query.search, $options: "i" } }
              ],
            }
          : {};
      
        console.log('Search keyword:', keyword);

        const users = await UserProfile.find(keyword).select("-User.Personal_info.Password");
        
        console.log('Users found:', users.length);

        if (users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }
        
        res.status(200).json(users);
    } catch (error) {
        console.error('Error in allUsers:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = { allUsers };