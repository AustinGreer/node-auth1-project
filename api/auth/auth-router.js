// module imports
const router = require('express').Router()
const { 
  checkUsernameFree, 
  checkUsernameExists, 
  checkPasswordLength 
} = require('./auth-middleware')
const bcrypt = require('bcryptjs')
const Users = require('../users/users-model')


// post - register as a new user
router.post('/register', checkUsernameFree, checkPasswordLength, async (req, res, next) => {
  const { username, password } = req.body
  
  const hash = bcrypt.hashSync(password, 8 )

  Users.add({username, password: hash})
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
  res.json({message: 'user login'})
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
  res.json({message: 'user logout'})
})

// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router