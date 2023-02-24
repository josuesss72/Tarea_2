const User = require('../models/users.model');
const { catchAsync } = require('../utils/catchAsync');
const bcryptjs = require('bcryptjs');
const {generateJWT} = require('../utils/jwt');
const AppError = require('../utils/appError');

//____----> AUTH CONTROLLER <----____

// CREATE UN USUARIO
exports.createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // CREA UNA INSTANCIA DE CLASE USER
  const user = new User({
    name,
    email,
    password,
    role,
  });

  // ENCRIPTAR CONTRASENA
  const salt = await bcryptjs.genSalt(10);
  user.password = await bcryptjs.hash(password, salt);

  // GUARDAMOS LOS DATOS EN LA BASE DE DATOS
  await user.save();

  // GENERAMOS JWT
  const token = await generateJWT(user.id);

  return res.status(201).json({
    status: 'success',
    message: 'User created',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { password } = req.body;
  const { user } = req;

  // COMPARAMOS LAS CONTRASENAS
  if (!(await bcryptjs.compare(password, user.password))) {
    return next(new AppError('Incorrect password or email', 401));
  }

  // GENERAMOS UN TOKEN
  const token = await generateJWT(user.id);

  // ENVIAMOS RESPUESTA
  res.status(200).json({
    status: 'success',
    message: 'logged successfully',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});
