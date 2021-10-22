import React from "react";
import {API} from "../services/api";
import {RemoteTable} from "../components/table";
import {Button} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";


export class ImportTasksPage extends React.Component {
    constructor(props) {
        super(props);
        const STATE = {
            2: "Pending",
            1: "Success",
            0: "Failure"
        }

        const TYPE = {
            "P": "Patient",
            "T": "Treatment",
        }

        this.columns = [{
            dataField: 'id',
            text: 'ID',
        }, {
            dataField: 'Hospital.name',
            text: 'Hospital Name'
        }, {
            dataField: 'state',
            text: 'State',
            formatter: (cell) => STATE[cell],
        }, {
            dataField: 'type',
            text: 'Type',
            formatter: (cell) => TYPE[cell],
        }, {
            dataField: 'path',
            text: 'File',
            formatter: (cell) => cell.replace(/^.*[\\]/, ''),
        }, {
            dataField: 'start_on',
            text: 'Started on'
        }, {
            dataField: 'finish_on',
            text: 'Finished on'
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
        API.getImportTaskList(page - 1, size).then(data => {
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
                <div className="d-flex justify-content-between mb-2">
                    <h3>Tasks</h3>
                    <LinkContainer to="/upload">
                        <Button variant="outline-success">+ Upload</Button>
                    </LinkContainer>
                </div>
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
