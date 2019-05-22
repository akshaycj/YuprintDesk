import React, { Component } from "react";
import { Icon, Table, Empty, Button } from "antd";
import "./index.css";
import { db, Auth } from "../../config";
import { auth } from "firebase";

export default class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: "",
      data: [],
      allUrls: [],
    }
  }

  componentDidMount() {
    this.getActiveData();
  }

  getActiveData = () => {
    Auth.onAuthStateChanged((user) => {
      if (user) {
        const list = [];
        var that = this;
        db.ref('store')
          .child('orders')
          .child('active')
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
                address1: child.val().address1,
                address2: child.val().address2
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
          <div style={{ marginLeft: "4vw" }}><a style={{ color: "black" }} href={data.urls} >Download File</a></div>
        </div>
      </div>
    )
  }

  onAcceptOrder = (record) => {
    record.urls ? db.ref('store')
      .child('orders')
      .child('active')
      .child(record.key).set({
        description: record.description,
        mobile: record.mobile,
        status: "processing",
        urls: record.urls,
        timestamp: record.timestamp,
        user: record.user,
        address1: record.address1,
        address2: record.address2
      }) : db.ref('store')
        .child('orders')
        .child('active')
        .child(record.key).set({
          description: record.description,
          mobile: record.mobile,
          status: "processing",
          timestamp: record.timestamp,
          user: record.user,
          address1: record.address1,
          address2: record.address2
        });

    this.getActiveData();
  }

  onDone = (record) => {
    record.urls ? db.ref('store')
      .child('orders')
      .child('done')
      .child(record.key).set({
        description: record.description,
        mobile: record.mobile,
        status: "done",
        timestamp: record.timestamp,
        urls: record.urls,
        user: record.user
      }) : db.ref('store')
        .child('orders')
        .child('done')
        .child(record.key).set({
          description: record.description,
          mobile: record.mobile,
          status: "done",
          timestamp: record.timestamp,
          user: record.user
        });

    db.ref('store')
      .child('orders')
      .child('active')
      .child(record.key).remove();
    this.getActiveData();
  }

  render() {

    const columns = [{
      title: 'User',
      dataIndex: 'user',
      key: 'user',
    }, {
      title: 'Mobile',
      dataIndex: 'mobile',
      key: 'mobile',
    }, {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    }, {
      title: 'Time Stamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
    }, {
      title: 'Address',
      key: 'address',
      render: (record) => {
        return (
          <div>{record.address1},{record.address2}</div>
        )
      }
    }, {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    }, {
      title: 'Action',
      key: 'action',
      render: (record) => {
        return (
          record.status === "active" ?
            <Button onClick={() => { this.onAcceptOrder(record) }}>Accept Order</Button> :
            <Button onClick={() => { this.onDone(record) }}>Done</Button>
        )
      }
    }];

    return (
      <div className="homeMainDiv">
        <h1 style={{ display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900" }}>Home Page.</h1>
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
