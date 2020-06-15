const Sequelize = require('sequelize');
const Model = Sequelize.Model;


// Option 1: Passing parameters separately
const sequelize = new Sequelize('bibliu-rfd', 'root', 'password', {
  host: 'localhost',
  dialect: 'mysql',
  pool:{
    max:5,
    min:0,
    idle:1,
  },
  logging:false,
  retry  : {
		match: [
			/ETIMEDOUT/,
			/EHOSTUNREACH/,
			/ECONNRESET/,
			/ECONNREFUSED/,
			/ETIMEDOUT/,
			/ESOCKETTIMEDOUT/,
			/EHOSTUNREACH/,
			/EPIPE/,
			/EAI_AGAIN/,
			/SequelizeConnectionError/,
			/SequelizeConnectionRefusedError/,
			/SequelizeHostNotFoundError/,
			/SequelizeHostNotReachableError/,
			/SequelizeInvalidConnectionError/,
			/SequelizeConnectionTimedOutError/
		],
		max  : 5
	},
});

module.exports =sequelize;