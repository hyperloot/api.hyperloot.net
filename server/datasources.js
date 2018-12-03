'use strict';

module.exports = {
  hlapi: {
    connector: 'mongodb',
    user: process.env.MONGODB_USER,
    password: process.env.MONGODB_PASSWORD,
    url: process.env.MONGODB_URI,
  }
};
