// module imports
const router = require('express').Router()
const { 
  checkUsernameFree, 
  checkUsernameExists, 
  checkPasswordLength 
} = require('./auth-middleware')
const bcrypt = require('bcryptjs')
const User = require('../users/users-model')


// post - register as a new user
router.post('/register', checkUsernameFree, checkPasswordLength, async (req, res, next) => {
  const { username, password } = req.body
  
  const hash = bcrypt.hashSync(password, 8 )

  User.add({username, password: hash})
    .then(([user]) => {
      res.status(201).json(user)
    })
    .catch(err => {
      next(err)
    })
})


/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */

router.post('/login', checkUsernameExists, (req, res, next) => {
  const { username } = req.body

  res.json({
    message: `Welcome back, ${username}`
  })
  // note, we are not handling any errors here because the middleware is doing that for us
})


/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */
router.get('/logout', (req, res, next) => {
  if (req.session.user) {
    req.session.destroy(err => {
      if (err) {
        res.json({
          message: `sorry, but you cannot leave just yet`
        })
      } else {
        res.status(200).json({
          message: 'logged out'
        })
      }
    })
  } else {
    res.status(200).json({
      message: 'no session'
    })
  }
})

// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router