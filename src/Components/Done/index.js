import React, { Component } from "react";
import { Icon, Table, Empty, Button } from "antd";
import "./index.css";
import { db, Auth } from "../../config";
import { auth } from "firebase";

export default class Done extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: "",
            data: [],
        }
    }

    componentDidMount() {
        this.getDoneData();
    }

    getUsername = (userId) => {
        var name = "";
        db.ref('users').child(userId).on("value", (data) => {
            name = data.val().displayName;
        })
        return name;
    }

    getDoneData = () => {
        Auth.onAuthStateChanged((user) => {
            if (user) {
                const list = [];
                var that = this;
                db.ref('store')
                    .child('orders')
                    .child('done')
                    .on("value", (data) => {
                        data.forEach((child) => {
                            var item = {
                                user: child.val().user,
                                description: child.val().description,
                                mobile: child.val().mobile,
                                status: child.val().status,
                                urls: child.val().urls,
                                timestamp: child.val().timestamp,
                                key: child.key,
                            }
                            list.push(item);
                            that.setState({ data: list })
                        })
                    })
            } else {
                this.props.history.push("/");
            }
        })
    }

    expandedRowRender = (data, i) => {
        return (
            <div key={i} className="oneRow" style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ margin: "2vw 0vw", display: "flex", flexDirection: "row", justifyContent: "flex-start" }}>
                    <div>{i}</div>
                    <div style={{ marginLeft: "2vw" }}>{data.color}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start" }}>
                    <div>Type</div>
                    <div style={{ marginLeft: "4vw" }}>{data.type}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start" }}>
                    <div>URL</div>
                    <div style={{ marginLeft: "4vw" }}><a style={{ color: "black" }} href={data.url} >Download File</a></div>
                </div>
            </div>
        )
    }

    render() {
        var that = this;
        const columns = [{
            title: 'User',
            key: 'user',
            width: '300',
            render: (record) => {
                var name = that.getUsername(record.user);
                return <div>{name}</div>
            }
        }, {
            title: 'Mobile',
            dataIndex: 'mobile',
            key: 'mobile',
            width: '300',
        }, {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: '400',
        }, {
            title: 'Time Stamp',
            dataIndex: 'timestamp',
            key: 'timestamp',
            width: '400',
        }, {
            title: 'Address',
            key: 'address',
            width: '400',
            render: (record) => {
                return (
                    <div>{record.address1},{record.address2}</div>
                )
            }
        }, {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: '400',
        }];

        return (
            <div className="homeMainDiv">
                <Table
                    dataSource={this.state.data}
                    pagination={false}
                    expandedRowRender={record => (
                        <div>{record.urls ? record.urls.map(this.expandedRowRender, this) : <Empty />}</div>
                    )}
                    columns={columns}
                />
            </div>
        );
    }
}
