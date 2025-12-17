const User = require("../models/User.model");
const bcrypt = require('bcryptjs');
const generateToken = require("../utils/token");
// const cloudinary = require("../utils/cloudinary");
const cloudinary = require("../utils/cloudinary");


// Singup a new user
const singup = async (req, res)=> {
    const { name, email, password } = req.body;
    // console.log(name, email, password);
    try {
        if(!name || !email || !password) {
            return res.json({success: false, message: "Missing Details"})
        }

        const user = await User.findOne({email});
        if(user){
            return res.json({success: false, message: "Account already exists."})
        }

        const salt = await bcrypt.genSalt(10);
        const hasPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name, email, password:hasPassword
        });

        const token = generateToken(newUser._id);
        // console.log(token)

        res.json({success: true, userData: newUser, token, message: "Account cerated Succefully."});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

// Controller to login user
const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const userData = await User.findOne({email});

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);

        if(!isPasswordCorrect){
            return res.json({success: false, message: "Invalid credentials."});
        }

        const token = generateToken(userData._id);
        res.json({success: true, userData: userData, token, message: "Login Succefully."});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}


// Controller to check if user is authenticated
const checkAuth = (req, res) => {
    res.json({success: true, user: req.user});
}


// Controller to update user profile details

const updateProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;
    const userId = req.user._id;

    let updateData = { name, bio };

    // 🔹 Agar image aayi hai
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "chat_image"
      });

      updateData.image = upload.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      user: updatedUser
    });

  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message
    });
  }
};



module.exports = {
    singup,
    login,
    checkAuth,
    updateProfile
}