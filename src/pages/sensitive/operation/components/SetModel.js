import { Table, Button, Modal, Switch } from "antd"
import { Component } from "react"
import SelectColor from "./SelectColor"
import styles from "../page.css"
class SetModel extends Component {
    state = { visible: false }
    showModal = () => {
        this.setState({
            visible: true,
        })
    }
    handleOk = (e) => {
        e.stopPropagation()
        this.setState({
            visible: false,
        })
        if (this.props.onOk) {
            this.props.onOk(this.state.selectedRowKeys)
        }
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        })
    }
    ChangeExcept = (record) => (is) => {
        this.props.dispatch({
            type: "auxiliary/updateActions",
            payload: { id: record.id, is_exception: is ? "2" : "1", color: record.color },
        })
    }
    render () {
        let { loading, list, dispatch } = this.props
        const showTotal = () => (
            <span style={{ marginTop: 5, color: "rgba(0,0,0,0.5)", display: "block" }}>总数{list && list.length}条</span>
        )
        const paginationConfig = {
            total: list && list.length,
            defaultPageSize: 20,
            showTotal,
        }
        const columns = [
            {
                title: "敏感行为",
                dataIndex: "action_name",
                render: (name, row) => (
                    <span className="pad10" style={{ color: row.color }}>
                        {name}
                    </span>
                ),
            },
            // { title: "是否默认正常", dataIndex: "is_exception", render: (exception, record) => <CheckExcept exception={exception} record={record} dispatch={dispatch} isCheck={true} /> },
            {
                title: "默认正常",
                dataIndex: "is_exception",
                render: (exception, record) => <Switch onChange={this.ChangeExcept(record)} checkedChildren="正常" unCheckedChildren="异常" defaultChecked={exception === "2"} />,
            },
            {
                title: "显示颜色",
                dataIndex: "color",
                render: (color, record) => <SelectColor dispatch={dispatch} color={color} record={record} />,
            },
            // {
            //     title: "操作",
            //     dataIndex: "action_type",
            //     render: (id) => <CheckExcept isButton={true} />,
            // },
        ]

        return (
            <span>
                <Button type="primary" onClick={this.showModal}>
                    敏感设置
                </Button>
                <Modal
                    title="敏感操作设置"
                    footer={null}
                    width={900}
                    style={{ height: "85%", top: "5%", overflow: "hidden", padding: 0 }}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    wrapClassName={styles.wrapStyle}
                    bodyStyle={{ height: "calc(100% - 55px)", overflow: "auto", padding: "10px" }}
                    destroyOnClose={true}
                >
                    <div className="pad20">
                        <Table dataSource={list} bordered={true} pagination={paginationConfig} rowKey="action_type" columns={columns} simple loading={loading} />
                    </div>
                </Modal>
            </span>
        )
    }
}
export default SetModel
