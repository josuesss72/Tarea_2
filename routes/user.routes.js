const { Router } = require('express');
const { check } = require('express-validator');
const {
  findAllUsers,
  findOneUser,
  updateUser,
  deleteUser,
  updatePassword,
} = require('../controllers/user.controllers');
const { protect, protectAccountOwner } = require('../middlewares/auth.middlewares');
const { validUserById, validPassword } = require('../middlewares/users.middlewares');
const { validateField } = require('../middlewares/validateField.middlewares');

const router = Router();

router.get('/', findAllUsers);
router.get('/:id', validUserById, findOneUser);

// RUTAS PROTEGIDAS
router.use(protect);

router.patch(
  '/:id',
  [
    check('name', 'The username is required').not().isEmpty(),
    check('email', 'The email is required').not().isEmpty(),
    check('email', 'The email must meet a specific format').isEmail(),
    validateField,
  ],
  validUserById,
  protectAccountOwner,
  updateUser
);

router.patch('/password/:id', [
  check('password', 'The password is requered').not().isEmpty(),
  check('newPassword', 'The new password is requered').not().isEmpty(),
  validateField
],
  validUserById,
  protectAccountOwner,
  validPassword,
  updatePassword
)

router.delete('/:id', validUserById, protectAccountOwner, deleteUser);

module.exports = {
  userRouter: router,
};
