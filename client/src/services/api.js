import {apiBaseUrl} from "../config";
import axios from "axios";


export default class API {
    static baseURL = apiBaseUrl;

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
}
