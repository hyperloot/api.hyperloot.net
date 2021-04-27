'use strict';

module.exports = {
  hlapi: {
    connector: 'postgresql',
    name: 'hlapi',
    url: process.env.DATABASE_URL,
    ssl: true
  }
};
