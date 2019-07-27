import React, { Component } from "react";
import { Icon, Table, Empty, Button } from "antd";
import "./index.css";
import { db, Auth } from "../../config";
import { auth } from "firebase";



   
   
 const Done = (props) =>{
    const new_colums = JSON.parse(JSON.stringify(props.columns)) //deep copy dont touch
    new_colums.push({
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: () => <Button style={{color:'red'}} disabled>Completed</Button>,
    })    
        return (
            <div className="homeMainDiv">
                <Table
                    dataSource={props.done_table_data}
                    pagination={false}
                    rowClassName="data-row"
                    expandedRowRender={record => {
                        console.log(record)
                        return(
                        <div>{record.urls ? record.urls.map(props.expandedRowRender) : <Empty />}</div>
                     )}}
                    columns={props.columns}
                />
            </div>
        );
    }

export default Done;
