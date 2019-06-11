const express = require('express')

const router = express.Router()

const NoticiaModels = require('../models/noticia')

router.get('/', (req, res) => {
    res.send('Noticias router')
    console.log('Noticias router')
})

module.exports = router