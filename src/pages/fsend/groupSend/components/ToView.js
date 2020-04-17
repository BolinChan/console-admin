import { Table, Modal, Avatar } from "antd"
import { Component } from "react"
import styles from "../page.css"
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
]

class ToView extends Component {
    state = { visible: false, selectedRowKeys: [], searchV: {} }
    showModal = () => {
        this.setState({
            visible: true,
        })
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        })
    }
    render () {
        let { listIds, weChatList, allContacts } = this.props
        let selectlist = []
        if (listIds && allContacts) {
            listIds.map((item) => {
                let list = allContacts.filter((mess) => mess.userid === item)
                selectlist = [...selectlist, ...list]
            })
        }
        const paginationConfig = {
            total: selectlist && selectlist.length,
            defaultPageSize: 20,
            hideOnSinglePage: true,
        }
        columns[1] = {
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
                <a type="primary" onClick={this.showModal}>
                    &nbsp;&nbsp;已选用户
                </a>
                <Modal
                    title="选择目标用户"
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
                    <div className={styles.tableStyle}>
                        <Table dataSource={selectlist} bordered={true} pagination={paginationConfig} rowKey="userid" columns={columns} simple />
                    </div>
                </Modal>
            </span>
        )
    }
}
export default ToView
