const Repair = require('../models/repairs.models');
const AppError = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

exports.validRepairsById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const repair = await Repair.findOne({
    where: {
      status: 'pending',
      id,
    },
  });

  if (!repair) {
    return next(new AppError('Repair not found', 404));
  }

  req.repair = repair;
  next();
});
