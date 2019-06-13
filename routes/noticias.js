const router = require('express').Router()

const NoticiaModels = require('../models/noticia')

router.get('/', async (req, res) => {
    // let conditions = {}
    // if (!('user' in req.session)) {
    //     conditions = {
    //         category: 'public',
    //     }
    // }
    const conditions = { category: 'public' }
    const noticias = await NoticiaModels.find(conditions)
    res.render('noticias/index', { noticias, })
})

module.exports = router