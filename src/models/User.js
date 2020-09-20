const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
})

UserSchema.methods.encryptPass = async password => {
    const salt = await bcrypt.genSalt(10);
    const hashPass = bcrypt.hash(password, salt);
    return hashPass;
}

UserSchema.methods.matchPass = async function (password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);