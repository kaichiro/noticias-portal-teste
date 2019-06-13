const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: [String],
        enum: ['restrito', 'admin'],
    },
})

UserSchema.pre('save', function (next) {
    const user = this
    if (!user.isModified('password')) {
        console.log('não foi modificado a senha...')
        return next()
    }

    bcrypt.genSalt((err, salt) => {
        bcrypt.hash(user.password, salt, (error, hash) => {
            console.log('senha atual.:', user.password)
            user.password = hash
            console.log('nova senha..:', user.password)
            next()
        })
    })
})

UserSchema.methods.checkPassword = function (password) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, this.password, (err, isMatch) => {
            if (err) {
                reject(err)
            } else {
                resolve(isMatch)
            }
        })
    })
}

const User = mongoose.model('User', UserSchema)

module.exports = User