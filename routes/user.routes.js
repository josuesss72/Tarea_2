const { Router } = require('express');
const { check } = require('express-validator');
const {
  findAllUsers,
  findOneUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/user.controllers');
const {
  validUserById,
  validUserByEmail,
} = require('../middlewares/users.middlewares');
const {validateField} = require('../middlewares/validateField.middlewares');

const router = Router();

router.get('/', findAllUsers);
router.get('/:id', validUserById, findOneUser);

router.post(
  '/',
  [
    check('name', 'The username is required').not().isEmpty(),
    check('email', 'The email is required').not().isEmpty(),
    check('email', 'The email must meet a specific format').isEmail(),
    check('password', 'The password is required').not().isEmpty(),
    check('password', 'Password must have a minimum of 4 characters').isLength({
      min: 4,
    }),
    validateField,
  ],
  validUserByEmail,
  createUser
);

router.patch('/:id', [
  check('name', 'The username is required').not().isEmpty(),
  check('email', 'The email is required').not().isEmpty(),
  check('email', 'The email must meet a specific format').isEmail(),
  validateField
],validUserById, updateUser);

router.delete('/:id', validUserById, deleteUser);

module.exports = {
  userRouter: router,
};
