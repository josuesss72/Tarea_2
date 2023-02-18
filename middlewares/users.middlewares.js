const User = require('../models/users.model');
const AppError = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

// ____----> USER MIDDLEWARES <----____

// VALIDA POR EL ID
exports.validUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({
    attributes: ['id', 'name', 'email'],
    where: {
      id,
      status: 'available',
    },
  });

  if (!user) {
    return next(new AppError('User not Found', 404));
  }

  req.user = user;
  next();
});

// VALIDA POR EL EMAIL
exports.validUserByEmail = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (user) {
    return next(new AppError('User was exists in database', 409));
  }

  next();
});
