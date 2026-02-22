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
  credentials: true,                // allows cookies to be sent cross-origin
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'x-csrf-token'],
}));

app.options('*', cors())

app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,    // set to true in production (requires HTTPS)
      maxAge: 1000 * 60 * 60 * 24, // 24 hours in milliseconds
    },
  })
);

app.use(cookieParser('cookie-parser-secret-key'))

const { doubleCsrfProtection, generateToken } = doubleCsrf({
  getSecret: () => 'csrf-secret-key',
  cookieName: 'x-csrf-token',
  cookieOptions: {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  },
})


app.get('/', (req, res) => {
  res.json({ message: 'Server is running' })
})

app.get('/csrf-token', (req, res) => {
  const token = generateToken(req, res)
  res.json({ token })
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

// ─── Start server ─────────────────────────────────────────────

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

