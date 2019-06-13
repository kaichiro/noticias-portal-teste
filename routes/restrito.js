const router = require('express').Router()

const Noticia = require('../models/noticia')

router.use((req, res, next) => {
    if ('user' in req.session) {
        if (req.session.user.roles.indexOf('restrito') >= 0) {
            return next()
        } else {
            res.redirect('/')
        }
    }
    res.redirect('/login')
})


router.get('/', (req, res) => {
    res.send('restrito')
})

router.get('/noticias', async (req, res) => {
    const conditions = { category: 'private' }
    const noticias = await Noticia.find(conditions)
    res.render('noticias/restrito', {
        noticias,
    })
})

module.exports = router