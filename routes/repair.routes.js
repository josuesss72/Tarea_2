const { Router } = require('express');
const { check } = require('express-validator');
const {
  findAllRepairs,
  findOneRepair,
  createRepair,
  updateRepair,
  deleteRepair,
} = require('../controllers/repair.controller');
const {
  protect,
  restricTo,
  protectAccountOwner,
} = require('../middlewares/auth.middlewares');
const { validRepairsById } = require('../middlewares/repair.middlewares');
const { validateField } = require('../middlewares/validateField.middlewares');

const router = Router();

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

// ROUTES PROTECT
router.use(protect);

router.get('/', restricTo('employee'), findAllRepairs);
router.get('/:id', restricTo('employee'), validRepairsById, findOneRepair);

router.patch(
  '/:id',
  [check('status', 'status is required').not().isEmpty(), validateField],
  restricTo('employee'),
  validRepairsById,
  updateRepair
);

router.delete('/:id', restricTo('employee'), validRepairsById,  deleteRepair);

module.exports = {
  repairRouter: router,
};
