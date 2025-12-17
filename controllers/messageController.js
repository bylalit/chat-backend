const Message = require('../models/Messages.model');
const User = require("../models/User.model");

const index = async(req, res) => {
    try {
        // const messages = await Message.find();
        const users = await User.find();
        // console.log(users);
        res.json(users);
    } catch (error) {
      res.status(500).json({message: error.message})
    }
}


// Get all messages between 2 users
const getMessages = async (req, res) => {
    try {
        const { senderId, receiverId } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ createdAt: 1 });  // oldest → newest

        res.status(200).json({ success: true, messages });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



// Save new message
const sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, message } = req.body;

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });

        res.status(201).json({ success: true, message: newMessage });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


module.exports = {
    index,
    getMessages,
    sendMessage
};
