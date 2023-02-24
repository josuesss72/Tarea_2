const User = require('../models/users.model');
const AppError = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');
const bcryptjs = require('bcryptjs')

// ____----> USER MIDDLEWARES <----____

// VALIDA POR EL ID
exports.validUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({
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
  
  if(!req.body.name){
    if(!user){
      return next(new AppError('User not found', 404))
    }
  }

  if(user && user.status === 'disabled'){
    const userUpdated = await user.update({status: 'available'}) 
    return res.status(200).json({
      status: 'success',
      message: 'user created successfully',
      user: userUpdated
    })
  }

  if(req.body.name){
    if (user) {
      return next(new AppError('User was exists in database', 409));
    }
  } 

  req.user = user;
  next();
});

// VALIDA LA PASSWORD
exports.validPassword = catchAsync(async (req, res, next) => {
  const { user } = req
  const { password } = req.body

  if(!(await bcryptjs.compare(password, user.password))){
    return next(new AppError('Incorrect password or email', 401));
  }

  req.user = user
  next()
})
