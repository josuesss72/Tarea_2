const Repair = require('../models/repairs.models');
const User = require('../models/users.model');
const { catchAsync } = require('../utils/catchAsync');

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

// CREATE UN USUARIO
exports.createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  return res.status(201).json({
    status: 'success',
    message: 'User created',
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
