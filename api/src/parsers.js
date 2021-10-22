/**
 * Defines parsers for Patient and Treatment
 */

import {Patient, Treatment} from "./models.js";
import moment from "moment";

const USStatesMap = {
    "Alabama": "AL",
    "Alaska": "AK",
    "American Samoa": "AS",
    "Arizona": "AZ",
    "Arkansas": "AR",
    "California": "CA",
    "Colorado": "CO",
    "Connecticut": "CT",
    "Delaware": "DE",
    "District Of Columbia": "DC",
    "Federated States Of Micronesia": "FM",
    "Florida": "FL",
    "Georgia": "GA",
    "Guam": "GU",
    "Hawaii": "HI",
    "Idaho": "ID",
    "Illinois": "IL",
    "Indiana": "IN",
    "Iowa": "IA",
    "Kansas": "KS",
    "Kentucky": "KY",
    "Louisiana": "LA",
    "Maine": "ME",
    "Marshall Islands": "MH",
    "Maryland": "MD",
    "Massachusetts": "MA",
    "Michigan": "MI",
    "Minnesota": "MN",
    "Mississippi": "MS",
    "Missouri": "MO",
    "Montana": "MT",
    "Nebraska": "NE",
    "Nevada": "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    "Northern Mariana Islands": "MP",
    "Ohio": "OH",
    "Oklahoma": "OK",
    "Oregon": "OR",
    "Palau": "PW",
    "Pennsylvania": "PA",
    "Puerto Rico": "PR",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    "Tennessee": "TN",
    "Texas": "TX",
    "Utah": "UT",
    "Vermont": "VT",
    "Virgin Islands": "VI",
    "Virginia": "VA",
    "Washington": "WA",
    "West Virginia": "WV",
    "Wisconsin": "WI",
    "Wyoming": "WY"
}


const trimKeyWhiteSpace = (source) => {
    return Object.keys(source).reduce((dest, key) => {
        dest[key.trim()] = source[key];
        return dest;
    }, {});
}

const PatientMapping = {
    "hospital_1": {
        fields: {
            address_city: "City",
            address_line: "Address",
            address_state: "State",
            date_of_birth: {
                field_name: "PatientDOB",
                data_type: "date",
                format: "MM/DD/YYYY"
            },
            date_of_death: {
                field_name: "DOD_TS",
                data_type: "date",
                format: "MM/DD/YYYY"
            },
            first_name: "FirstName",
            gender: "Gender",
            id: "PatientID",
            last_name: "LastName",
            mrn: "MRN",
            zip_code: "ZipCode",
            sex: data => {
                const value = data["Sex"];
                if (value === "Male") {
                    return Patient.SEX.MALE;
                } else if (value === "Female") {
                    return Patient.SEX.FEMALE;
                }
                return null;
            },
            state: data => {
                const value = data["IsDeceased"];
                if (value === "Active") {
                    return Patient.STATE.ACTIVE;
                } else if (value === "Deceased") {
                    return Patient.STATE.DECEASED;
                } else if (value === "Hospice") {
                    return Patient.STATE.HOSPICE;
                }
                return null;
            }
        }
    },
    "hospital_2": {
        fields: {
            address_city: "AddressCity",
            address_line: "AddressLine",
            date_of_birth: {
                field_name: "PatientDOB",
                data_type: "date",
                format: "MM/DD/YYYY"
            },
            date_of_death: {
                field_name: "DeathDate",
                data_type: "date",
                format: "MM/DD/YYYY"
            },
            first_name: "FirstName",
            gender: "Gender",
            id: "PatientId",
            last_name: "LastName",
            mrn: "MRN",
            zip_code: "AddressZipCode",
            sex: data => {
                const value = data["Sex"];
                if (value === "Male") {
                    return Patient.SEX.MALE;
                } else if (value === "Female") {
                    return Patient.SEX.FEMALE;
                }
                return null;
            },
            state: data => {
                const value = data["IsPatientDeceased"];
                if (value === "N") {
                    return Patient.STATE.ACTIVE;
                } else if (value === "Y") {
                    return Patient.STATE.DECEASED;
                }
                return null;
            },
            address_state: data => {
                const value = data["AddressState"];
                if (!USStatesMap[value])
                    return null;

                return USStatesMap[value]
            },
        },
    }
}

const TreatmentMapping = {
    "hospital_1": {
        fields: {
            cycle_per_days: "CyclesXDays",
            diagnoses: "Diagnoses",
            display_name: "DisplayName",
            date_end: {
                field_name: "EndDate",
                data_type: "date",
                format: "MM/DD/YYYY"
            },
            date_start: {
                field_name: "StartDate",
                data_type: "date",
                format: "MM/DD/YYYY"
            },
            patient_id: "PatientID",
            id: "TreatmentID",
            treatment_line: "TreatmentLine",
            state: data => {
                const value = data["Active"];

                if (value === "Ordered") {
                    return Treatment.STATE.ORDERED;
                } else if (value === "Active") {
                    return Treatment.STATE.ACTIVE;
                }
                return null;
            },
        },
    },
    "hospital_2": {
        fields: {
            date_end: {
                field_name: "EndDate",
                data_type: "date",
                format: "MM/DD/YYYY"
            },
            date_start: {
                field_name: "StartDate",
                data_type: "date",
                format: "MM/DD/YYYY"
            },
            diagnoses: "AssociatedDiagnoses",
            display_name: "DisplayName",
            id: "TreatmentId",
            patient_id: "PatientId",
            protocol_id: "ProtocolID",
            state: data => {
                const value = data["Status"];

                if (value === "Ordered") {
                    return Treatment.STATE.ORDERED;
                } else if (value === "Active") {
                    return Treatment.STATE.ACTIVE;
                }
                return null;
            },
            cycle_per_days: (data, result) => {
                let date_start = result["date_start"];
                let date_end = result["date_end"];
                let number_of_cycles = data["NumberOfCycles"];

                if (!date_start || !date_end || !number_of_cycles) return null;

                const days = date_start.diff(date_end, 'days')
                return `${number_of_cycles}X${days}`;
            },
        },
    },
};

class BaseParser {
    parse(data) {
        data = trimKeyWhiteSpace(data);
        let result = {};

        for (const [target, src] of Object.entries(this.mapping.fields)) {
            let value = null;
            if (typeof src === "object") {
                if (src.data_type === "date") {
                    value = data[src.field_name];
                    if (!value || value === '' || value === 'NULL') {
                        value = null;
                    } else {
                        value = moment(value, src.format)
                    }
                }
            } else if (typeof src === "function") {
                value = src(data, result)
            } else {
                value = data[src];
                if (value === 'NULL') value = null;
            }
            result[target.trim()] = value;
        }

        return result;
    }
}

export class PatientParser extends BaseParser {
    constructor(hospitalCode) {
        super();
        this.mapping = PatientMapping[hospitalCode];
    }

    async validate(data) {
        data = trimKeyWhiteSpace(data);
        const fields = this.mapping.fields;
        let errors = [];

        let id = data[fields["id"]];
        let mrn = data[fields["mrn"]];

        if (id) {
            let idDuplicate = await Patient.count({where: {id: id}});
            if (idDuplicate !== 0) errors.push(["Patient ID already exists."])
        } else {
            errors.push(["Patient ID is required."])
        }

        if (mrn) {
            let mrnDuplicate = await Patient.count({where: {mrn: mrn}});
            if (mrnDuplicate !== 0) errors.push(["MRN already exists."]);
        } else {
            errors.push(["MRN is required."])
        }
        return errors;
    }
}

export class TreatmentParser extends BaseParser {
    constructor(hospitalCode) {
        super();
        this.mapping = TreatmentMapping[hospitalCode];
    }

    async validate(data) {
        data = trimKeyWhiteSpace(data);
        const fields = this.mapping.fields;

        let errors = [];

        let id = data[fields["id"]];
        let patient_id = data[fields["patient_id"]];
        let start_date = data[fields["date_start"].field_name];
        let display_name = data[fields["display_name"]];

        if (id) {
            let IdDuplicate = await Treatment.count({where: {id: id}});
            if (IdDuplicate !== 0) errors.push(["Treatment ID already exists."])
        } else {
            errors.push(["Treatment ID is required."])
        }

        if (patient_id) {
            let patientIdDuplicate = await Patient.count({where: {id: patient_id}});
            if (patientIdDuplicate === 0) {
                errors.push(["Patient ID does not exist."])
            } else {
                console.log(patient_id, start_date, display_name);
                if (start_date && display_name) {
                    let recordDuplicate = await Treatment.count({
                        where: {
                            patient_id: patient_id,
                            date_start: moment(start_date, fields["date_start"].format),
                            display_name: display_name
                        }
                    });
                    if (recordDuplicate !== 0) errors.push(["Treatment Duplicate (PatientID, StartDate, and DisplayName) matches with another row."])
                }
            }
        } else {
            errors.push(["Patient ID is required."])
        }

        return errors;
    }
}
