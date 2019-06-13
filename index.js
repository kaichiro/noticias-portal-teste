const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const bodyParser = require('body-parser')

const UserModel = require('./models/user')
const NoticiaModel = require('./models/noticia')

const NoticiasRoute = require('./routes/noticias')
const RestritoRoute = require('./routes/restrito')
const AuthRoute = require('./routes/auth')
const PagesRoute = require('./routes/pages')
const AdminRoute = require('./routes/admin')

const app = express()
const port = process.env.PORT || 3075
const mongo = process.env.MONGODB || 'mongodb://localhost/noticias'

const createInitialUser = async () => {
  const total = await UserModel.countDocuments({ username: 'admin' })
  if (0 === total) {
    const user = new UserModel({
      username: 'admin',
      password: 'abc123',
      roles: ['restrito', 'admin'],
    })

    const userRestrito = new UserModel({
      username: 'user',
      password: 'abc123',
      roles: ['restrito'],
    })
    await userRestrito.save()

    await user.save((err, doc) => {
      if (err) {
        console.log('Error to try create doc:', err)
      } else {
        console.log('User admin created!', doc)
      }
    })
  }

  // const noticia = new NoticiaModel({
  //   title: `Notícia Pública ${new Date().getTime()}`,
  //   content: `content`,
  //   category: `public`,
  // })
  // await noticia.save()

  // const noticia2 = new NoticiaModel({
  //   title: `Notícia Privada ${new Date().getTime()}`,
  //   content: `other content`,
  //   category: `private`,
  // })
  // await noticia2.save()
}

mongoose.Promise = global.Promise

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({ secret: 'fullstack-master' }))

app.use(express.static('public'))

app.use('/', AuthRoute)
app.use('/', PagesRoute)
app.use('/noticias', NoticiasRoute)
app.use('/restrito', RestritoRoute)
app.use('/admin', AdminRoute)

mongoose
  .connect(mongo, { useNewUrlParser: true })
  .then(() => {
    app.listen(port, err => {
      if (err) {
        console.log(`App doesn't work: ${err}`)
      } else {
        createInitialUser();
        console.log(`App works at http://localhost:${port}`)
      }
    })
  })
  .catch(err => {
    console.log('Error:', err)
  })


// const UserModel = require('./models/user')
// const User = new UserModel({
//   username: 'admin',
//   password: 'abc123',
// })

// User.save(()=>console.log('User salved!'))
