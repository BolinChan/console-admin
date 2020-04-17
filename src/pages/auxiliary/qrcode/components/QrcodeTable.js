import { Table, Button, Modal, Popconfirm } from "antd"
import AddForm from "./AddForm"
import { Component } from "react"
// import SelectColor from "./SelectColor"
import styles from "../page.css"
class QrcodeTable extends Component {
    state = { visible: false }
    showModal = () => {
        this.props.dispatch({
            type: "auxiliary/fetchQrcode",
            payload: { gid: this.props.record.id },
        })
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
    deleteConfirm = (id) => {
        this.props.dispatch({
            type: "auxiliary/deleteQrcode",
            payload: { id },
        })
    }
    render () {
        let { loading, list, dispatch, record } = this.props
        list = list && list.filter((item) => item.group_id === record.id)
        const showTotal = () => (
            <span style={{ marginTop: 5, color: "rgba(0,0,0,0.5)", display: "block" }}>总数{list && list.length}条</span>
        )
        const paginationConfig = {
            total: list && list.length,
            defaultPageSize: 20,
            showTotal,
        }
        const columns = [
            { title: "二维码", dataIndex: "qr_url", render: (img) => <img src={img} alt="" style={{ maxWidth: "100px" }} /> },
            { title: "名称", dataIndex: "qrcode_name" },
            { title: "总数", dataIndex: "total" },
            { title: "使用数量", dataIndex: "use_num" },
            {
                title: "创建时间",
                dataIndex: "addtime",
            },
            {
                title: "操作",
                dataIndex: "id",
                render: (id, record) => (
                    <div>
                        <AddForm record={record} dispatch={dispatch} isqrcode={true} action="updateQrcode">
                            修改二维码
                        </AddForm>
                        <Popconfirm title="确定要删除吗？" onConfirm={() => this.deleteConfirm(record.id)}>
                            <Button className="mar5" type="danger">删除</Button>
                        </Popconfirm>
                    </div>
                ),
            },
        ]

        return (
            <span>
                <Button className="mar5" type="primary" onClick={this.showModal}>
                    二维码管理
                </Button>
                <Modal
                    title={record && record.code_name}
                    footer={null}
                    width={1000}
                    style={{ height: "85%", top: "5%", overflow: "hidden", padding: 0 }}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    wrapClassName={styles.wrapStyle}
                    bodyStyle={{ height: "calc(100% - 55px)", overflow: "auto", padding: "10px" }}
                    destroyOnClose={true}
                >
                    <div>
                        <div className={styles.tableStyle}>
                            <Table dataSource={list} bordered={true} pagination={paginationConfig} rowKey="id" columns={columns} simple loading={loading} />
                        </div>
                    </div>
                </Modal>
            </span>
        )
    }
}
export default QrcodeTable
