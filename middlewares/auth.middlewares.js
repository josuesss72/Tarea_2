const User = require('../models/users.model');
const AppError = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

// ----> PROTECT
exports.protect = catchAsync(async (req, res, next) => {
  // VERIFICAR EL TOKEN VENGA POR LOS HEDERS
  let token = req.headers.authorization;
  const keySecret = process.env.SECRET_JWT_SEED;

  if (token && token.startsWith('Bearer')) {
    token = token.split(' ')[1];
  }

  // VERIFICAR QUE EL TOKEN SEA EL CORRECTO
  const userDecoded = await promisify(jwt.verify)(token, keySecret);

  // VERIFICAR SI EXISTE EL USUARIO CON EL TOKEN
  const user = await User.findOne({
    where: {
      id: userDecoded.id,
      status: 'available',
    },
  });

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (!token) {
    return next(new AppError('Not Authorization, you are not logged', 401));
  }

  //VERIFICAMOS SI EL USUARIO CAMBIO SU PASSWORD DESPUES QUE ALLA GENERADO EL TOKEN
  if (user.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10
    );

    if (userDecoded.iat < changedTimeStamp) {
      next(new AppError('The user recently changed password', 401));
    }
  }

  req.seccionUser = user;
  next();
});

// ----> VERIFICA EL USUARIO EN SECCION
exports.protectAccountOwner = catchAsync(async (req, res, next) => {
  const { user, seccionUser } = req;

  if (user.id !== seccionUser.id) {
    return next(new AppError('the user is not the user in section', 401));
  }

  req.user = user;
  next();
});

// RESIVE LOS ROLES
exports.restricTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.seccionUser.role)) {
      return next(
        new AppError('You do not have permission to perform the operation', 403)
      );
    }

    next();
  };
};
