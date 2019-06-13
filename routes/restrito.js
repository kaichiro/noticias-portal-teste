const router = require('express').Router()

const Noticia = require('../models/noticia')

router.use((req, res, next) => {
    if ('user' in req.session) {
        console.log('usuário logado')
        return next()
    }
    console.log('usuário não logado')
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