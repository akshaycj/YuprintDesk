import React, { Component } from "react";
import { Table, Empty, Button, Popconfirm, message } from "antd";
import "./index.css";



const Active = (props) =>{
    const new_colums = JSON.parse(JSON.stringify(props.columns)) //deep copy dont touch
    new_colums.push({
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (record) => <Button style={{color:'green'}} onClick={()=>props.onClickActiveButton(record)}>Active</Button>,
    })    
    return (
      <div className="homeMainDiv">
        <Table
          dataSource={props.active_table_data}
          pagination={false}
          rowClassName="data-row"
          expandedRowRender={record => (
            <div>{record.urls ? record.urls.map(props.expandedRowRender) : <Empty />}</div>
          )}
          columns={new_colums}
        />
      </div>
    );
  }

export default Active;