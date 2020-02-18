const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

// User model
const User = require('../../models/User');

// @route   POST api/users
// @desc    Register new user
// @access  Public
router.post('/', (req, res) => {
  const { name, email, password } = req.body;

  // Simple validation
  if(!name || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' })
  }

  // Check for existing user
  User.findOne({ email })
      .then(user => {
        // If user exists, return a 400
        if(user) return res.status(400).json({ msg: 'User already exists' });

        // If user does not exist, create a User object
        const newUser = new User({
          name,
          email,
          password
        });

        // Generate a salt & hash
        //  genSalt()'s first param is the rounds it runs on the password. The higher it is the more secure, but the longer it takes. The second param is a callback.
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save()
                   .then(user => {

                     // Signing the token to send whatever we want
                     jwt.sign(
                       { id: user.id},
                       config.get('jwtSecret'),
                       { expiresIn: 3600 },
                       (err, token) => {
                         if(err) throw err;
                         res.json({
                          token,
                          user: {
                            id: user.id,
                            name: user.name,
                            email: user.email
                          }
                        })
                       }
                     )                     
                   })
                   .catch(err => res.status(400).json({ msg: 'Something went wrong with saving the user' }));
          })
        });
      })
});

module.exports = router;