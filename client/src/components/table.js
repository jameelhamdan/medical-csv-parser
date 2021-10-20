import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import React from "react";

export const RemoteTable = ({columns, data, page, sizePerPage, onTableChange, totalSize}) => (
    <>
        <BootstrapTable
            remote
            keyField="id"
            data={data}
            columns={columns}
            pagination={paginationFactory({page, sizePerPage, totalSize})}
            onTableChange={onTableChange}
        />
    </>
);
