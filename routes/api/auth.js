const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

// User model
const User = require('../../models/User');

// @route   POST api/auth
// @desc    Register new user
// @access  Public
router.post('/', (req, res) => {
  const { name, email, password } = req.body;

  // Simple validation
  if(!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' })
  }

  // Check for existing user
  User.findOne({ email })
      .then(user => {
        // If user exists, return a 400
        if(!user) return res.status(400).json({ msg: 'User doesn\'t exists' });

        // Validate password
        bcrypt.compare(password, user.password)
              .then(isMatch => {
                if(!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

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
        
      })
});

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', auth, (req, res) => {
  User.findById(req.user.id)
      .select('-password')
      .then(user => res.json(user));
});

module.exports = router;