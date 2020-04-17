import { Table, Button, Modal, Avatar, Message } from "antd"
import { Component } from "react"
import styles from "../page.css"
import SelectForm from "./SelectForm"
const columns = [
    {
        title: "昵称",
        dataIndex: "nick",
        render: (nick, row) => (
            <div>
                <Avatar shape="square" icon="user" src={row.headImg} />
                <span className="pad10">{nick || row.remark || row.wxid}</span>
            </div>
        ),
    },
    { title: "备注", dataIndex: "remark", render: (remark) => remark || "无" },
    { title: "所属微信", dataIndex: "kefu_wxid" },
    {
        title: "性别",
        dataIndex: "sex",
        render: (sex) => {
            if (sex === "1") {
                return "男"
            }
            if (sex === "2") {
                return "女"
            } else {
                return "未知"
            }
        },
    },
    { title: "城市", dataIndex: "city", render: (city) => (city ? city : "未知") },
    { title: "上次执行时间", dataIndex: "reg_time" },
]
let ids = []
class TargetUser extends Component {
    state = { visible: false, selectedRowKeys: [], searchV: {} }
    showModal = async () => {
        const { dispatch, kefu_wxid} = this.props
        this.setState({
            visible: true,
            current: 1,
            searchV: {},
            currentTotal: 0,
            selectedRowKeys: ids,
        })
        dispatch({ type: "vertisy/fetchContactList", payload: { page: 1, kefu_wxid} })
    }
    // 搜索
    onSubmit = (values) => {
        const { dispatch, kefu_wxid} = this.props
        dispatch({ type: "vertisy/fetchContactList", payload: {...values, page: 1, kefu_wxid} })
        this.setState({ current: 1, searchV: values, selectedRowKeys: [] })
    }
    // 选择群发搜索对象
    handleTarget=(values) => {
        // if (this.props.onChange) {
        //     this.props.onChange({condition: values})
        // }
        this.handleCancel()
    }
    // 确认选择的对象selectedRowKeys
    handleOk = (e) => {
        e.stopPropagation()
        this.setState({
            visible: false,
        })
        if (this.props.onChange) {
            this.props.onChange(this.state.selectedRowKeys)
            ids = this.state.selectedRowKeys
        }
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
            Targetvisible: false,
        })
    }
    showTarget=() => {
        this.setState({Targetvisible: true})
    }
    // 选择table项
    onSelectChange = (selectedRowKeys) => {
        if (selectedRowKeys.length > 200) {
            return Message.error("最多可选择200个好友")
        }
        this.setState({ selectedRowKeys })
    }
    pageChangeHandler = (page) => {
        const { dispatch, kefu_wxid } = this.props
        dispatch({ type: "vertisy/fetchContactList", payload: { ...this.state.searchV, page, kefu_wxid } })
        this.setState({ current: page })
    }
    render () {
        let { weChatList, kefu_wxid, loading, allTotal, allContacts} = this.props
        let { selectedRowKeys, current, Targetvisible} = this.state
        const paginationConfig = {
            total: allTotal || 0,
            defaultPageSize: 20,
            hideOnSinglePage: true,
            onChange: this.pageChangeHandler,
            current: current,
        }
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            hideDefaultSelections: true,
        }
        const hasSelected = selectedRowKeys && selectedRowKeys.length > 0
        columns[2] = {
            title: "所属微信",
            dataIndex: "kefu_wxid",
            render: (id) => {
                let index = weChatList.findIndex((item) => item.wxid === id)
                if (index !== "-1") {
                    return weChatList[index].nickname || weChatList[index].remark || id
                }
            },
        }
        return (
            <span>
                <a type="primary" onClick={this.showModal} disabled={!kefu_wxid}>
                    &nbsp;&nbsp;选择目标用户
                </a>
                <Modal
                    title="选择目标用户"
                    footer={null}
                    width={900}
                    style={{ height: "85%", top: "5%", overflow: "hidden", padding: 0 }}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    wrapClassName={styles.wrapStyle}
                    bodyStyle={{ height: "calc(100% - 55px)", overflow: "auto", padding: "10px" }}
                    destroyOnClose={true}
                >
                    <div>
                        <SelectForm v={true} onSubmit={this.onSubmit} handleCancel={this.handleCancel} showTarget={this.showTarget} Targetvisible={Targetvisible} handleTarget={this.handleTarget} allTotal={allTotal}/>
                        <div className={styles.tableStyle}>
                            <Table
                                loading={loading}
                                dataSource={allContacts}
                                rowSelection={rowSelection}
                                bordered={true}
                                pagination={paginationConfig}
                                rowKey="userid"
                                columns={columns}
                                simple
                            />
                        </div>
                        <div className={styles.foot}>
                            <Button type="primary" disabled={!hasSelected} onClick={this.handleOk}>
                                确定
                            </Button>
                            <span style={{ marginLeft: 8 }}>{hasSelected ? `已选择 ${selectedRowKeys.length}` : ""}</span>
                        </div>
                    </div>
                </Modal>
            </span>
        )
    }
}
export default TargetUser
