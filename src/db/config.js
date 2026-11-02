import { config } from '../../config/config.js';


const dbConfig = {
  development: {
    url: config.db.url,
    dialect: 'postgres',
  },
  production: {
    url: config.db.url,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};

export default dbConfig;
