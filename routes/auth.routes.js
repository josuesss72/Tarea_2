const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, login } = require('../controllers/auth.controller');
const { validUserByEmail } = require('../middlewares/users.middlewares');
const { validateField } = require('../middlewares/validateField.middlewares');

const router = Router();

router.post(
  '/signup',
  [
    check('name', 'The username is required').not().isEmpty(),
    check('email', 'The email is required').not().isEmpty(),
    check('email', 'The email must meet a specific format').isEmail(),
    check('password', 'The password is required').not().isEmpty(),
    check('password', 'Password must have a minimum of 4 characters').isLength({
      min: 4,
    }),
    check('role', 'user role is client or employee').custom(x => {
      if(x === 'employee') return true;
      if(x === 'client') return true;
      return false;
    }),
    validateField,
  ],
  validUserByEmail,
  createUser
);

router.post(
  '/login',
  [
    check('email', 'email is required').not().isEmpty(),
    check('email', 'email most be format').isEmail(),
    check('password', 'password is required').not().isEmpty(),
    validateField,
  ],
  validUserByEmail,
  login
);

module.exports = {
  authRoutes: router,
};
