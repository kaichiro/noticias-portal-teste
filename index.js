const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const bodyParser = require('body-parser')

const UserModel = require('./models/user')

const NoticiasRoute = require('./routes/noticias')
const RestritoRoute = require('./routes/restrito')

const app = express()
const port = process.env.PORT || 3075
const mongo = process.env.MONGODB || 'mongodb://localhost/noticias'

const createInitialUser = async () => {
  const total = await UserModel.countDocuments({ username: 'admin' })
  if (0 === total) {
    const user = new UserModel({
      username: 'admin',
      password: 'abc123',
    })
    await user.save((err, doc) => {
      if (err) {
        console.log('Error to try create doc:', err)
      } else {
        console.log('User admin created!', doc)
      }
    })
  } else {
    console.log('User admin already exists!')
  }
}

mongoose.Promise = global.Promise

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({ secret: 'fullstack-master' }))

app.use(express.static('public'))

app.get('/', (req, res) => res.render('index'))

app.use('/restrito', (req, res, next) => {
  if ('user' in req.session) {
    console.log('usuário logado')
    return next()
  }
  console.log('usuário não logado')
  res.redirect('/login')
})
app.use('/noticias', NoticiasRoute)
app.use('/restrito', RestritoRoute)

app.get('/login', (req, res) => {
  res.render('login')
})
app.post('/login', async (req, res) => {
  const user = await UserModel.findOne({ username: req.body.username })
  const isValid = await user.checkPassword(req.body.password)

  if (isValid) {
    req.session.user = user
    res.redirect('/restrito/noticias')
  } else {
    res.redirect('/login')
  }
})

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
