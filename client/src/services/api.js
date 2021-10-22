import {apiBaseUrl} from "../config";
import axios from "axios";


export class API {
    static baseURL = apiBaseUrl;

    static createImportTask = async (hospital, importType, file, onUploadProgressCallback) => {
        let formData = new FormData();

        formData.append("file", file);
        formData.append("hospital", hospital);
        formData.append("importType", importType);

        return axios.post(`${this.baseURL}/import_task`, formData, {
            onUploadProgress: onUploadProgressCallback,
            headers: {
                "content-type": "multipart/form-data",
            },
        }).then(response => {
            return response.data;
        });
    }

    static getImportTaskById = async (id) => {
        return axios.get(`${this.baseURL}/import_task/${id}`
        ).then(response => {
            return response.data;
        }).catch(err => {
            return null;
        });
    }

    static getImportTaskList = async (page = 0, size = 10) => {
        return axios.get(`${this.baseURL}/import_task`, {
            params: {
                page: page, size: size,
            }
        }).then(response => {
            return response.data;
        }).catch(err => {
            return [];
        });
    }

    static getPatientById = async (id) => {
        return axios.get(`${this.baseURL}/patient/${id}`
        ).then(response => {
            return response.data;
        }).catch(err => {
            return null;
        });
    }

    static getPatientList = async (page = 0, size = 10) => {
        return axios.get(`${this.baseURL}/patient`, {
            params: {
                page: page, size: size,
            }
        }).then(response => {
            return response.data;
        }).catch(err => {
            return [];
        });
    }

    static getTreatmentById = async (id) => {
        return axios.get(`${this.baseURL}/treatment/${id}`
        ).then(response => {
            return response.data;
        }).catch(err => {
            return null;
        });
    }

    static getTreatmentList = async (page = 0, size = 10) => {
        return axios.get(`${this.baseURL}/treatment`, {
            params: {
                page: page, size: size,
            }
        }).then(response => {
            return response.data;
        }).catch(err => {
            return [];
        });
    }

    static getHospitalList = async (page = 0, size = 999) => {
        return axios.get(`${this.baseURL}/hospital`, {
            params: {
                page: page, size: size,
            }
        }).then(response => {
            return response.data;
        }).catch(err => {
            return [];
        });
    }
}
