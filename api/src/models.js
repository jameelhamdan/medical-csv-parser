/**
 * Defines database connection and models
 */


import {dbConnection} from "./config/index.js";
import Sequelize from "sequelize";
import {readFile} from 'fs/promises';

const sequelize = new Sequelize.Sequelize({
    database: dbConnection.database,
    username: dbConnection.username,
    host: dbConnection.host,
    port: dbConnection.port,
    password: dbConnection.password,
    dialect: dbConnection.dialect,
    operatorsAliases: false,
    define: {
        freezeTableName: true
    },
    logging: false
});

class Hospital extends Sequelize.Model {
}

Hospital.init({
    id: {
        type: Sequelize.DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: Sequelize.DataTypes.STRING,
    },
    code: {
        // Internal Code for mapping
        type: Sequelize.DataTypes.STRING,
        unique: true
    }
}, {
    sequelize,
    timestamps: true,
    modelName: 'Hospital',
    tableName: 'hospital',
});

class Patient extends Sequelize.Model {
}

Patient.init({
    id: {
        type: Sequelize.DataTypes.STRING,
        primaryKey: true,
    },
    mrn: {
        type: Sequelize.DataTypes.BIGINT,
        unique: true,
    },
    state: {
        // state the patient is currently in (A = Active, D = Deceased, H = Hospice)
        type: Sequelize.DataTypes.CHAR(1),
    },
    first_name: {
        type: Sequelize.DataTypes.STRING,
    },
    last_name: {
        type: Sequelize.DataTypes.STRING,
    },
    gender: {
        // wtf
        type: Sequelize.DataTypes.STRING,
        allowNull: true
    },
    sex: {
        // M = Male, F = Female
        type: Sequelize.DataTypes.CHAR(1)
    },
    date_of_birth: {
        type: Sequelize.DataTypes.DATEONLY,
    },
    date_of_death: {
        type: Sequelize.DataTypes.DATEONLY,
        allowNull: true,
    },
    address_line: {
        type: Sequelize.DataTypes.TEXT,
    },
    address_city: {
        type: Sequelize.DataTypes.STRING,
    },
    address_state: {
        // two letter abbreviation of state name
        type: Sequelize.DataTypes.CHAR(2),
    },
    zip_code: {
        type: Sequelize.DataTypes.STRING
    }
}, {
    sequelize,
    timestamps: true,
    modelName: 'Patient',
    tableName: 'patient',
});

class Treatment extends Sequelize.Model {
}

Treatment.init({
    id: {
        type: Sequelize.DataTypes.STRING,
        primaryKey: true,
    },
    patient_id: {
        type: Sequelize.DataTypes.STRING,
        references: {
            model: Patient,
            key: 'id',
        },
    },
    state: {
        // state the patient is currently in (A = Active, O = Ordered)
        type: Sequelize.DataTypes.CHAR(1),
    },
    protocol_id: {
        type: Sequelize.DataTypes.STRING,
    },
    date_start: {
        type: Sequelize.DataTypes.DATEONLY,
    },
    date_end: {
        type: Sequelize.DataTypes.DATEONLY,
        allowNull: true
    },
    display_name: {
        type: Sequelize.DataTypes.STRING,
    },
    diagnoses: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
    },
    cycle_per_days: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true
    },
}, {
    sequelize,
    timestamps: true,
    modelName: 'Treatment',
    tableName: 'treatment',
});


class ImportTask extends Sequelize.Model {
}

ImportTask.init({
    id: {
        type: Sequelize.DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    state: {
        // state the patient is currently in (1 = Success, 0 = Failure)
        type: Sequelize.DataTypes.SMALLINT,
    },
    path: {
        type: Sequelize.DataTypes.STRING,
    },
    start_on: {
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.DataTypes.NOW
    },
    finish_on: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true
    },
}, {
    sequelize,
    timestamps: true,
    modelName: 'ImportTask',
    tableName: 'import_task',
});


// TODO: use a migration/seeds libs later
const initializeDatabase = async () => {
    console.log("Initializing Database...");
    await sequelize.sync();

    console.log("Adding Fixtures..");
    const hospitalsData = JSON.parse(
        await readFile(
            new URL("./fixtures/hospitals_fixtures.json", import.meta.url)
        )
    );

    await Promise.allSettled(
        hospitalsData.map(hospital =>
            Hospital.findOrCreate({
                where: {code: hospital.code},
                defaults: {...hospital}
            })
        )
    );

    console.log("Finished Initializing Database.");
}

export {
    initializeDatabase,
    Hospital,
    Patient,
    Treatment,
    ImportTask
}
