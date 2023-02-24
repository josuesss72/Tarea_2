const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs')

// ____----> JWT <----____

const generateJWT = id => {
  return new Promise((resolve, reject) => {
    const payload = { id };

    //FIRMA
    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED,
      {
        expiresIn: process.env.JWT_EXPIRE_IN,
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject(err);
        }

        resolve(token);
      }
    );
  });
};

// ----> ENCRIPTA LA PASSWORD
const encryptPassword = async(password) => { 
  const salt = await bcryptjs.genSalt(10)
  const passwordEncripted = await bcryptjs.hash(password, salt)
  return passwordEncripted 
}

module.exports = {
  generateJWT,
  encryptPassword
};
