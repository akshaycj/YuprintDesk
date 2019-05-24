import React from "react";
import "./index.css";
import Active from "../Active";
import Done from "../Done";
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;


export default class Home extends React.Component {
    render() {
        return (
            <div>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Active" key="1">
                        <Active />
                    </TabPane>
                    <TabPane tab="Done" key="2">
                        <Done />
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}