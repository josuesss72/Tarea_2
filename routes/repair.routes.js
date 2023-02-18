const { Router } = require('express');
const { check } = require('express-validator');
const {
  findAllRepairs,
  findOneRepair,
  createRepair,
  updateRepair,
  deleteRepair,
} = require('../controllers/repair.controller');
const { validRepairsById } = require('../middlewares/repair.middlewares');
const { validateField } = require('../middlewares/validateField.middlewares');

const router = Router();

router.get('/', findAllRepairs);
router.get('/:id', validRepairsById, findOneRepair);

router.post(
  '/',
  [
    check('date', 'Date is required').not().isEmpty(),
    check('motorsNumber', 'motorsNumber is required').not().isEmpty(),
    check('description', 'description is required').not().isEmpty(),
    check('userId', 'userId is required').not().isEmpty(),
    validateField,
  ],
  createRepair
);

router.patch(
  '/:id',
  [check('status', 'status is required').not().isEmpty(), validateField],
  validRepairsById,
  updateRepair
);

router.delete('/:id', validRepairsById, deleteRepair);

module.exports = {
  repairRouter: router,
};
