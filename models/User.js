const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true, minlength: 2 },
    email: { type: String, required: true, unique: true, match: [/\S+@\S+\.\S+/, 'is invalid'] },
    password: { type: String, required: true, minlength: 8 }
});

UserSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);
