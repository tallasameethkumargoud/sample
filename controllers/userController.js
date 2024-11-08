const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const bcrypt= require('bcrypt');

// Multer config
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp
    }
});

const imageFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file format'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: imageFilter });

exports.createUser = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        console.log(req.body);
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ fullName, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    const { email, fullName, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (fullName) user.fullName = fullName;
        if (password) user.password = await bcrypt.hash(password, 12);
        await user.save();
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await User.findOneAndDelete({ email });
        if (result) {
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.uploadImage = (req, res) => {
    upload.single('image')(req, res, function(err) {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ message: 'Image uploaded successfully', path: req.file.path });
    });
};
