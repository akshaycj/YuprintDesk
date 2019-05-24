import React, { Component } from "react";
import { Table, Empty, Button, Popconfirm, message } from "antd";
import "./index.css";
import { db, Auth } from "../../config";
import { auth } from "firebase";

const acceptText = 'Are you sure to Accept this order?';
const doneText = 'Are you sure are done with this order?';

export default class Active extends Component {
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

  confirmAccept = (record) => {
    console.log("recccc", record)
    this.onAcceptOrder(record)
  }

  confirmDone = (record) => {
    this.onDone(record)
  }

  getUsername = (userId) => {
    var name = "";
    db.ref('users').child(userId).on("value", (data) => {
      name = data.val().displayName;
    })
    return name;
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
          <div style={{ marginLeft: "4vw" }}><a style={{ color: "black" }} href={data.url} >Download File</a></div>
        </div>
      </div>
    )
  }

  onAcceptOrder = (record) => {
    console.log("record", record)
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
          address1: record.address1,
          address2: record.address2,
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
    }, {
      title: 'Action',
      key: 'action',
      width: '400',
      render: (record) => {
        return (
          record.status === "active" ?
            <Popconfirm placement="left" title={acceptText} onConfirm={this.confirmAccept.bind(this, record)} okText="Yes" cancelText="No">
              <Button>Accept Order</Button>
            </Popconfirm> :
            <Popconfirm placement="left" title={doneText} onConfirm={this.confirmDone.bind(this, record)} okText="Yes" cancelText="No">
              <Button>Done</Button>
            </Popconfirm>
        )
      }
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
