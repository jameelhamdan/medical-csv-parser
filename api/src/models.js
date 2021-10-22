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
    operatorsAliases: 1,
    define: {
        freezeTableName: true
    },
    logging: true
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
    static STATE = {
        ACTIVE: "A",
        DECEASED: "D",
        HOSPICE: "H",
    }

    static SEX = {
        MALE: "M",
        FEMALE: "F",
    }
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
    static STATE = {
        ACTIVE: "A",
        ORDERED: "O",
    }
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
    treatment_line: {
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


Treatment.belongsTo(Patient, {
    foreignKey: 'patient_id'
});


class ImportTask extends Sequelize.Model {
    static STATE = {
        PENDING: 2,
        SUCCESS: 1,
        FAILURE: 0,
    }

    static TYPE = {
        PATIENT: "P",
        TREATMENT: "T",
    }
}

ImportTask.init({
    id: {
        type: Sequelize.DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    state: {
        // state the patient is currently in (2 = Pending, 1 = Success, 0 = Failure)
        type: Sequelize.DataTypes.SMALLINT,
        defaultValue: 2,
    },
    hospital_id: {
        type: Sequelize.DataTypes.BIGINT,
        references: {
            model: Hospital,
            key: 'id',
        },
    },
    type: {
        // state the patient is currently in (P = Patient, T = Treatment)
        type: Sequelize.DataTypes.CHAR(1),
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

ImportTask.belongsTo(Hospital, {
    foreignKey: 'hospital_id'
});

class ImportTaskError extends Sequelize.Model {}

ImportTaskError.init({
    id: {
        type: Sequelize.DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    row_count: {
        type: Sequelize.DataTypes.BIGINT,
    },
    import_task_id: {
        type: Sequelize.DataTypes.BIGINT,
        references: {
            model: ImportTask,
            key: 'id',
        },
    },
    errors: {
        type: Sequelize.DataTypes.TEXT,
    },
}, {
    sequelize,
    timestamps: true,
    modelName: 'ImportTaskError',
    tableName: 'import_task_error',
});

ImportTaskError.belongsTo(ImportTask, {
    foreignKey: 'import_task_id'
});


// TODO: use a migration/seeds libs later
const initializeDatabase = async () => {
    console.log("Initializing Database...");
    await sequelize.sync({force: false});

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
    sequelize,
    Hospital,
    Patient,
    Treatment,
    ImportTask,
    ImportTaskError,
}
