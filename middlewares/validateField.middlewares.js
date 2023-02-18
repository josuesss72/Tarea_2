const { validationResult } = require('express-validator');

// ____----> VALIDATE FIELD <----____

// CAPTURA LOS ERRORES QUE VIENEN DE LOS CHECKS Y ENVIA LOS ERRORES MAPEADOS
exports.validateField = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.mapped(),
    });
  }

  next();
};
