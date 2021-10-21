import React from "react";
import {API} from "../services/api";
import {RemoteTable} from "../components/table";


export class TreatmentsPage extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [{
            dataField: 'id',
            text: 'ID',
        }, {
            dataField: 'patient_id',
            text: 'Patient ID'
        }, {
            dataField: 'state',
            text: 'State'
        }, {
            dataField: 'protocol_id',
            text: 'Protocol ID'
        }, {
            dataField: 'date_start',
            text: 'Start Date'
        }, {
            dataField: 'date_end',
            text: 'End Date'
        }, {
            dataField: 'display_name',
            text: 'Display Name'
        }, {
            dataField: 'diagnoses',
            text: 'Diagnoses'
        }, {
            dataField: 'cycle_per_days',
            text: 'Cycle X Days'
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
        API.getTreatmentList(page - 1, size).then(data => {
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
                <h3>Treatments</h3>
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
