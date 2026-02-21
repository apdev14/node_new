const express = require('express')
const session = require('express-session')
const { doubleCsrf } = require("csrf-csrf");
const bcrypt = require('bcryptjs')

const app = express()
const port = 3000

app.use(express.json());

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

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
