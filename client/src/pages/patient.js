import React from "react";
import {API} from "../services/api";
import {RemoteTable} from "../components/table";


export class PatientsPage extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [{
            dataField: 'id',
            text: 'ID',
        }, {
            dataField: 'mrn',
            text: 'MRN'
        }, {
            dataField: 'state',
            text: 'State'
        }, {
            dataField: 'first_name',
            text: 'First Name'
        }, {
            dataField: 'last_name',
            text: 'Last Name'
        }, {
            dataField: 'gender',
            text: 'Gender'
        }, {
            dataField: 'sex',
            text: 'Sex'
        }, {
            dataField: 'date_of_birth',
            text: 'Date of birth'
        }, {
            dataField: 'date_of_death',
            text: 'Date of death'
        }, {
            dataField: 'address_line',
            text: 'Address line'
        }, {
            dataField: 'address_city',
            text: 'Address city'
        }, {
            dataField: 'address_state',
            text: 'Address state'
        }, {
            dataField: 'zip_code',
            text: 'Zip Code'
        }];

        this.state = {
            data: [],
            totalItems: 0,
            page: 1,
            sizePerPage: 10,
        }
    }

    componentDidMount = async () => {
        this.load(this.state.page, this.state.sizePerPage);
    }

    load(page , size) {
        API.getPatientList(page - 1, size).then(data => {
            this.setState({
                totalItems: data.totalItems,
                data: data.rows,
                page: page,
                sizePerPage: size,
            });
        });
    }

    handleTableChange = (type, {page, sizePerPage}) => {
        this.load(page, sizePerPage);
    }

    render() {
        return (
            <>
                <h3>Patients</h3>
                <RemoteTable
                    columns={this.columns}
                    data={this.state.data}
                    page={this.state.page}
                    sizePerPage={this.state.sizePerPage}
                    totalSize={this.state.totalItems}
                    onTableChange={this.handleTableChange}
                />
            </>
        );
    }
}
