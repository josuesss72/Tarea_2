const Repair = require('../models/repairs.models');
const User = require('../models/users.model');
const { catchAsync } = require('../utils/catchAsync');

// ____----> REPAIR MIDDLEWARES <----____

// GET ALL REPAIRS
exports.findAllRepairs = catchAsync(async (req, res, next) => {
  const repairs = await Repair.findAll({
    attributes: ['id', 'date', 'userId'],
    where: {
      status: 'pending',
    },
    include: [
      { 
        model: User,
        where: {
          status: 'available'
        },
        attributes: ['id', 'name', 'email']
      }
    ]
  });

  return res.status(200).json({
    status: 'success',
    repairs,
  });
});

// GET ONE REPAIR BY ID
exports.findOneRepair = catchAsync(async (req, res, next) => {
  const { repair } = req;

  return res.status(200).json({
    status: 'success',
    repair,
  });
});

// CREAR UNA REPARACION DEL USUARIO
exports.createRepair = catchAsync(async (req, res, next) => {
  const { date, userId, motorsNumber, description } = req.body;

  const repair = await Repair.create({ 
    date, 
    userId,
    motorsNumber,
    description
  });

  return res.status(201).json({
    status: 'success',
    message: 'Created Repair',
    repair,
  });
});

// ACTIALIZA UNA REPARACION
exports.updateRepair = catchAsync(async (req, res, next) => {
  const { status, motorsNumber, description } = req.body;
  const { repair } = req;

  await repair.update({ status, motorsNumber, description });

  return res.status(200).json({
    status: 'success',
    message: 'Repair updated successfully',
  });
});

// CANCELA UNA REPARACION
exports.deleteRepair = catchAsync(async (req, res, next) => {
  const { repair } = req;

  await repair.update({ status: 'cancelled' });

  return res.status(200).json({
    status: 'success',
  });
});
