import React from "react";
import API from "../services/api";
import {RemoteTable} from "../components/table";


export class ImportTasksPage extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [{
            dataField: 'id',
            text: 'ID',
        }, {
            dataField: 'state',
            text: 'State'
        }, {
            dataField: 'path',
            text: 'path'
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

    load(page , size) {
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
                <h3>Tasks</h3>
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
