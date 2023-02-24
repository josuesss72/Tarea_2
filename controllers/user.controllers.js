const User = require('../models/users.model');
const { catchAsync } = require('../utils/catchAsync');
const {encryptPassword} = require('../utils/jwt');

// ____----> USER CONTROLLER <----____

// GET TODOS LOS USERS
exports.findAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    attributes: ['id', 'name', 'email'],
    where: {
      status: 'available',
    },
  });

  return res.status(200).json({
    status: 'success',
    message: 'Users found',
    users,
  });
});

// GET UN USER
exports.findOneUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  return res.status(200).json({
    status: 'success',
    message: 'User Found',
    user,
  });
});

// ACTUALIZAR USUARIO
exports.updateUser = catchAsync(async (req, res, next) => {
  const { name, email } = req.body;
  const { user } = req;

  await user.update({ name, email });

  return res.status(200).json({
    status: 'success',
    message: 'User updated successfully',
  });
});

// ELIMINAR USUARIO
exports.deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: 'disabled' });

  res.status(200).json({
    status: 'success',
    message: 'User deleted successfully',
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { newPassword } = req.body;
  const { user } = req

  const passwordEncripted = await encryptPassword(newPassword)
  
  await user.update({
    password: passwordEncripted,
    passwordChangedAt: new Date()
  })

  res.status(200).json({
    status: 'success',
    message: 'Password updated successfully',
    user: {
      email: user.email,
      date: user.passwordChangedAt
    }
  })
})
