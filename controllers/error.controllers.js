const AppError = require('../utils/appError');

// ____----> ERROR CONTROLLER <----____

// ----> HANDLE CUSTOM ERRORS
const handleCastError22P02 = () =>
  new AppError('Some type of data send does not match was expected', 400);

//----> RESPUESTAS DE ERRORS
const sendErrorDev = (err, res) => {
  console.log('ERR 💣 =>', err);
  res.status(err.statusCode).json({
    name: err.name,
    status: err.status,
    message: err.message,
    stack: err.stack,
    err: err.statusCode,
  });
};

const sendErrorProd = (err, res) => {
  // SI EL ERROR ES OPERACIONAL
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log('ERR 💣 =>', err);
    res.status(500).json({
      status: 'fail',
      message: 'Something went very wrong!',
    });
  }
};

// ----> GLOBAL ERRORS
const globalErrorHandler = (err, req, res, next) => {
  // ASIGNAMOS AL ERROR COMO INTERNAL
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';

  // SI ESTAMOS EJECUTANDO EN DESARROLLO
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }

  // SI ESTAMOS EJECUTANDO EN PRODUCTION
  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (!error.parent?.code) {
      error = err;
    }

    // CUSTOM ERRORS
    if (error.parent?.code === '22P02') error = handleCastError22P02();

    sendErrorProd(error, res);
  }
};

module.exports = globalErrorHandler;
