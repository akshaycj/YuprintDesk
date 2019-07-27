import React from 'react'
import './index.css'
import Active from '../Active'
import { db, Auth } from '../../config'
import Done from '../Done'
import Processing from '../Processing'
import { Tabs, Icon, Modal, Input, message } from 'antd'
const TabPane = Tabs.TabPane

export default class Home extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      active_table_data: [],
      processing_table_data: [],
      done_table_data: [],
      selected_id: '',
      show_modal: false,
      modal_data: {},
      total_number_of_pages: '',
      estimate_pages_for_time: 0
    }
  }
  componentDidMount () {
    var that = this
    Auth.onAuthStateChanged(user => {
      if (user) {
        db.ref('store/orders').on('value', function (data) {
          const active_table_data = []
          const processing_table_data = []
          const done_table_data = []
          var estimate_pages_for_time = 0
          console.log(data)
          if (data.val()) {
            if (data.val().active) {
              Object.keys(data.val().active).map(iter => {
                var item = { ...data.val().active[iter], ...{ key: iter } }
                active_table_data.push(item)
              })
            }
            if (data.val().processing) {
              Object.keys(data.val().processing).map(iter => {
                estimate_pages_for_time =
                  estimate_pages_for_time +
                  Number(data.val().processing[iter].pages)
                var item = { ...data.val().processing[iter], ...{ key: iter } }
                processing_table_data.push(item)
              })
            }
            if (data.val().done) {
              Object.keys(data.val().done).forEach(iter => {
                var item = { ...data.val().done[iter], ...{ key: iter } }
                done_table_data.push(item)
              })
            }
          }
          that.setState({
            active_table_data,
            processing_table_data,
            done_table_data,
            estimate_pages_for_time
          })
        })
      } else {
        that.props.history.push('/')
      }
    })
  }
  getUsername = user_id => {
    db.ref('users')
      .child(user_id)
      .on('value', data => {
        return data.val().displayName
      })
  }
  onClickActiveButton = record => {
    this.setState({ show_modal: true, modal_data: record })
  }
  onClickDoneButton = record => {
    db.ref('store/orders')
      .child(`done/${record.key}`)
      .set({ ...record, ...{ status: 'done' } })
      .then(err => {
        if (err) console.log(err)
        else {
          db.ref('store/orders')
            .child(`processing/${record.key}`)
            .remove()
            .then(message.success('Process completed'))
        }
      })
  }
  onChangeInputInModal = e => {
    this.setState({ total_number_of_pages: e.target.value })
  }
  handleOk = () => {
    var that = this
    if (this.state.total_number_of_pages === '') {
      message.error('Enter Number of Pages')
    } else {
      db.ref('store/orders')
        .child(`processing/${that.state.modal_data.key}`)
        .set({
          ...this.state.modal_data,
          ...{ pages: this.state.total_number_of_pages }
        })
        .then(function (err) {
          if (err) console.log(err)
          else {
            db.ref('store/orders')
              .child(`active/${that.state.modal_data.key}`)
              .remove()
            that.setState({ show_modal: false, total_number_of_pages: '' })
          }
        })
    }
  }
  handleCancel = () => {
    this.setState({ show_modal: false, total_number_of_pages: '' })
  }
  expandedRowRender = (data, i) => {
    return (
      <div
        key={i}
        className='oneRow'
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <div
          style={{
            margin: '2vw 0vw',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start'
          }}
        >
          <div>{i}</div>
          <div style={{ marginLeft: '2vw' }}>{data.color}</div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start'
          }}
        >
          <div>Type</div>
          <div style={{ marginLeft: '4vw' }}>{data.type}</div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start'
          }}
        >
          <div>URL</div>
          <div style={{ marginLeft: '4vw' }}>
            <a style={{ color: 'black' }} href={data.url}>
              Download File
            </a>
          </div>
        </div>
      </div>
    )
  }

  render () {
    const columns = [
      {
        title: 'User',
        key: 'user',
        width: '300',
        render: record => {
          var name = this.getUsername(record.user)
          return <div>{name}</div>
        }
      },
      {
        title: 'Mobile',
        dataIndex: 'mobile',
        key: 'mobile',
        width: '300'
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        width: '400'
      },
      {
        title: 'Time Stamp',
        dataIndex: 'timestamp',
        key: 'timestamp',
        width: '400'
      },
      {
        title: 'Address',
        key: 'address',
        width: '400',
        render: record => {
          return (
            <div>
              {record.address1},{record.address2}
            </div>
          )
        }
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '400'
      }
    ]
    return (
      <div>
        <Tabs defaultActiveKey='1'>
          <TabPane tab='Active' key='1'>
            <Active
              active_table_data={this.state.active_table_data}
              columns={columns}
              expandedRowRender={this.expandedRowRender}
              onClickActiveButton={this.onClickActiveButton}
            />
          </TabPane>
          <TabPane tab='Processing' key='2'>
            <Processing
              processing_table_data={this.state.processing_table_data}
              columns={columns}
              estimate_pages_for_time={this.state.estimate_pages_for_time}
              expandedRowRender={this.expandedRowRender}
              onClickDoneButton={this.onClickDoneButton}
            />
          </TabPane>
          <TabPane tab='Done' key='3'>
            <Done
              done_table_data={this.state.done_table_data}
              columns={columns}
              expandedRowRender={this.expandedRowRender}
            />
          </TabPane>
        </Tabs>
        <Modal
          title='Basic Modal'
          visible={this.state.show_modal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          {this.state.modal_data['urls']
            ? this.state.modal_data['urls'].map((point, index) => (
              <a href={point} key={index}>
                {index}.<Icon type='file' style={{ fontSize: '25px' }} />
              </a>
            ))
            : null}
          <Input
            placeholder='Number of pages'
            onChange={this.onChangeInputInModal}
            type='number'
          />
        </Modal>
      </div>
    )
  }
}
