import Sequelize from 'sequelize';
import {MAX_CONNECTION_ATTEMPTS, DATABASE_ADDRESS, DATABASE_DB, DATABASE_PASSWORD, DATABASE_USER} from "./config.js"


async function delay(timeout) {
    await new Promise(resolve => setTimeout(resolve, timeout));
}

async function dbWaiter() {
    let attempt_count = 0
    let isReady = false;
    while (!isReady && attempt_count < MAX_CONNECTION_ATTEMPTS) {
        try {
            await sequelize.authenticate();
            console.log('Connection to the database has been established successfully.');
            isReady = true;
        } catch (error) {
            console.error(`Unable to connect to the database (attempt ${attempt_count}):`, error);
            await delay(5000)
            attempt_count += 1
        }
    }

    if (!isReady) {
        console.error('Unable to connect to the database');
        return false
    }

    return true
}

const sequelize = new Sequelize(DATABASE_DB, DATABASE_USER, DATABASE_PASSWORD, {
    host: DATABASE_ADDRESS,
    dialect: 'mysql'
});

await dbWaiter()

// Models
export const Favorites = sequelize.define('favorites', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    city: {
        type: Sequelize.STRING,
        unique: true
    },
},{
    freezeTableName: true,
    timestamps: false
});

await sequelize.sync();
console.log("All models were synchronized successfully.");

export default Favorites