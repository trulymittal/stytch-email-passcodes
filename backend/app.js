const express = require('express')
const createError = require('http-errors')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const stytch = require('stytch')
const cookieParser = require('cookie-parser')

const client = new stytch.Client({
  project_id: process.env.PROJECT_ID,
  secret: process.env.PROJECT_SECRET,
  env: stytch.envs.test,
})

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })
)
app.use(cookieParser(process.env.COOKIE_SECRET))

app.get('/', async (req, res, next) => {
  res.send({ message: 'Awesome it works 🐻' })
})

app.post('/send-email', async (req, res, next) => {
  try {
    const { email } = req.body
    const params = { email }
    const response = await client.otps.email.loginOrCreate(params)
    res.json(response)
  } catch (error) {
    next(error)
  }
})

app.post('/verify-otp', async (req, res, next) => {
  try {
    const { method_id, code } = req.body
    const response = await client.otps.authenticate({
      method_id,
      code,
      session_duration_minutes: 15 * 24 * 60,
    })
    console.log(response)
    const { session_token, user_id } = response
    res.cookie('x-stytch-token', session_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      signed: true,
      maxAge: 15 * 24 * 60 * 60 * 1000,
    })
    res.json({ user_id })
  } catch (error) {
    next(error)
  }
})

app.get('/profile', verifyToken, async (req, res, next) => {
  try {
    const user = await client.users.get(req.user_id)
    res.json(user)
  } catch (error) {
    next(error)
  }
})

app.delete('/logout', async (req, res, next) => {
  try {
    const session_token = req.signedCookies['x-stytch-token']
    const response = await client.sessions.revoke({ session_token })
    res.clearCookie('x-stytch-token', {})
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})

async function verifyToken(req, res, next) {
  try {
    const session_token = req.signedCookies['x-stytch-token']
    console.log(session_token)
    const response = await client.sessions.authenticate({
      session_token: session_token,
    })
    req.user_id = response.session.user_id
    next()
  } catch (error) {
    next(new createError.Unauthorized())
  }
}

app.use((req, res, next) => {
  next(new createError.NotFound())
})

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    status: err.status || 500,
    message: err.message,
  })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`))
