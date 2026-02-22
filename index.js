const express = require('express')
const session = require('express-session')
const cors = require('cors')
const { doubleCsrf } = require("csrf-csrf");
const cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs')

const app = express()
const port = 3000

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'x-csrf-token'],
}));

app.use(session({
  secret: 'session-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 24,
  },
}));

app.use(cookieParser('cookie-parser-secret-key'))

const { doubleCsrfProtection, generateCsrfToken } = doubleCsrf({
  getSecret: () => 'csrf-secret-key',
  getSessionIdentifier: (req) => req.sessionID,
  getTokenFromRequest: (req) => req.headers['x-csrf-token'],
  cookieName: 'x-csrf-token',
  cookieOptions: {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  },
})

const users = []

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' })
})

app.get('/csrf-token', (req, res) => {
  const token = generateCsrfToken (req, res)
  res.json({ token })
})

app.post('/debug', (req, res) => {
  console.log('Headers:', req.headers)
  console.log('Cookies:', req.cookies)
  console.log('SessionID:', req.sessionID)
  res.json({ 
    cookies: req.cookies,
    sessionID: req.sessionID,
    csrfHeader: req.headers['x-csrf-token']
  })
})

app.post('/register', doubleCsrfProtection, async (req, res) => {
  res.status(201).json({ message: 'User registered' })
})

app.post('/login', doubleCsrfProtection, async (req, res) => {
  res.json({ message: 'Logged in' })
})

app.get('/protected', (req, res) => {
  res.json({ message: 'Protected route' })
})

app.post('/logout', doubleCsrfProtection, (req, res) => {
  res.json({ message: 'Logged out' })
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})