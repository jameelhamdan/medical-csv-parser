import React from "react";
import {API} from "../services/api";
import {RemoteTable} from "../components/table";


export class HospitalsPage extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [{
            dataField: 'id',
            text: 'ID',
        }, {
            dataField: 'code',
            text: 'code'
        }, {
            dataField: 'name',
            text: 'Name'
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

    load(page, size) {
        API.getHospitalList(page - 1, size).then(data => {
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
                <h3>Hospitals</h3>
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
