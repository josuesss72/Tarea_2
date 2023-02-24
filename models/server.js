const express = require('express');
const cors = require('cors');
const { db } = require('../database/db');
const { userRouter } = require('../routes/user.routes');
const { repairRouter } = require('../routes/repair.routes');
const AppError = require('../utils/appError');
const globalErrorHandler = require('../controllers/error.controllers');
const initModel = require('./init.models');
const { authRoutes } = require('../routes/auth.routes');
const morgan = require('morgan');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;

    //Path Routes
    this.paths = {
      repairs: '/api/v1/repairs',
      users: '/api/v1/users',
      auth: '/api/v1/auth'
    };

    //Connect to db
    this.database();

    //Middlewares
    this.middlewares();

    //Routes
    this.routes();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());

    // MORGAN: MUESTRA EN CONSOLA LA PETICION
    if(process.env.NODE_ENV === 'development') {
      console.log('In Development 🎡')
      this.app.use(morgan('dev'))
    }else {
      console.log('In Production 🎉')
    }
  }

  routes() {
    this.app.use(this.paths.users, userRouter);
    this.app.use(this.paths.repairs, repairRouter);
    this.app.use(this.paths.auth, authRoutes)

    // ----> HANDLE ERROR <----
    this.app.all('*', (req, res, next) => {
      return next(
        new AppError(`Cant find ${req.originalUrl} on this server!`, 404)
      );
    });
    this.app.use(globalErrorHandler);
  }

  database() {
    db.authenticate()
      .then(() => console.log('Database authenticated 😁'))
      .catch(err => console.log(err));

    //relations
    initModel()

    db.sync()
      .then(() => console.log('Database synced 😁'))
      .catch(err => console.log(err));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Server Running On Port 😁', this.port);
    });
  }
}

module.exports = Server;
