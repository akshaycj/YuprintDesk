import React, { Component } from "react";
import { Icon, Table, Empty, Button } from "antd";
import "./index.css";
import { db, Auth } from "../../config";
import { auth } from "firebase";



   
   
 const Processing = (props) =>{
    const new_columns = JSON.parse(JSON.stringify(props.columns)) //deep copy dont touch
    new_columns.push({
        title: 'ETA',
      dataIndex: '',
      key: 'y',
      render:(record)=>{console.log(record.pages);
        var Eta = Math.round((((props.estimate_pages_for_time-Number(record.pages))*0.5)/(60))*100)/100
          return(<div>{Eta}</div>)}
    },{
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (record) => <Button style={{color:'yellow'}} onClick={()=>{props.onClickDoneButton(record)}}>Done</Button>,
    })    
        return (
            <div className="homeMainDiv">
                <Table
                    dataSource={props.processing_table_data}
                    pagination={false}
                    rowClassName="data-row"
                    expandedRowRender={record => {
                        console.log(record)
                        return(
                        <div>{record.urls ? record.urls.map(props.expandedRowRender) : <Empty />}</div>
                     )}}
                    columns={new_columns}
                />
            </div>
        );
    }

export default Processing