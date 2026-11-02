import { Sequelize } from "sequelize";
import {config} from '../../config/config.js';     
import setupModels from '../db/models/index.js';

const sequelize = new Sequelize(config.db.url, {
    dialect: 'postgres',
    logging: false,
    pool: {
        max: 50,
        min: 0,
        acquire: 30000, // maximum time, in milliseconds, that pool will try to get connection before throwing error
        idle: 10000 // maximum time, in milliseconds, that a connection can be idle before being released
    }
});

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


        setupModels(sequelize);

        // export named `models` so other modules can import { models }
export const models = sequelize.models;


export default sequelize;