const router = require('express').Router()

const UserModel = require('../models/user')

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})

router.post('/login', async (req, res) => {
    const user = await UserModel.findOne({ username: req.body.username })
    const isValid = await user.checkPassword(req.body.password)

    if (isValid) {
        req.session.user = user
        res.redirect('/restrito/noticias')
    } else {
        res.redirect('/login')
    }
})

module.exports = router