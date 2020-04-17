import { Table, Button, Modal, Avatar, Spin, Message } from "antd"
import { Component } from "react"
import styles from "../page.css"
import SelectForm from "./SelectForm"
import moment from "moment"
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
    { title: "上次执行时间", dataIndex: "reg_time", render: (time) => time && moment(new Date(time * 1000)).format("YYYY-MM-DD HH:mm:ss") },
]
let ids = []
class SelectTable extends Component {
    state = { visible: false, selectedRowKeys: [], searchV: {} }
    showModal = async () => {
        this.setState({
            visible: true,
            current: 1,
            searchV: {},
            currentTotal: 0,
            selectedRowKeys: ids,
        })
        let { parameter } = this.state
        const { kefu_wxid, dispatch } = this.props
        !parameter && kefu_wxid && (parameter = [{ kefu_wxid: kefu_wxid[0], page: 1 }])
        if (kefu_wxid && !parameter.find((item) => item.kefu_wxid === kefu_wxid[0])) {
            parameter.push({ kefu_wxid: kefu_wxid[0], page: 1 })
        }
        let index = parameter && parameter.findIndex((item) => item.kefu_wxid === kefu_wxid[0])
        await dispatch({ type: "vertisy/fetchContactList", payload: { page: parameter[index].page, kefu_wxid } })
        let Int = setInterval(async () => {
            const { city, nick, remark } = this.state.searchV
            let total = index !== "-1" && parameter[index].total
            let page = index !== "-1" && parameter[index].page
            let isTrue = page <= total / 20 + 1 || total === undefined
            if (isTrue && !city && !nick && !remark && !this.props.loading) {
                await dispatch({ type: "vertisy/fetchContactList", payload: { page: ++page, kefu_wxid } })
                parameter[index].page++
                parameter[index].total = this.props.allTotal ? this.props.allTotal : undefined
                this.setState({ parameter, currentTotal: parameter[index].total })
            }
            if ((page > total / 20 + 1 && total !== undefined) || !this.state.visible) {
                clearInterval(Int)
            }
        }, 100)
    }
    onSubmit = (payload) => {
        const { dispatch, kefu_wxid} = this.props
        let filterContacts = this.filterFun(payload)
        // const {city, nick} = payload
        let page = Math.floor(filterContacts.length / 20)
        let Int = setInterval(async () => {
            page++
            await dispatch({ type: "vertisy/fetchContactList", payload: {...payload, page, kefu_wxid} })
            if ((page > this.props.allTotal / 20 + 1) || !this.state.visible) {
                clearInterval(Int)
            }
        }, 100)
        this.setState({ current: 1, searchV: payload, selectedRowKeys: [] })
    }
    pageChangeHandler = (page) => {
        const { dispatch, kefu_wxid } = this.props
        const { city, nick, remark } = this.state.searchV
        if (city || nick || remark) {
            let page = 1
            let Int = setInterval(async () => {
                const { allTotal, loading } = this.props
                let isTrue = page <= allTotal / 20 + 1
                if (isTrue && !loading) {
                    await dispatch({ type: "vertisy/fetchContactList", payload: { ...this.state.searchV, page, kefu_wxid } })
                    page++
                } else {
                    clearInterval(Int)
                }
            }, 100)
        }
        this.setState({ current: page })
    }
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
        })
    }
    // 选择table项
    onSelectChange = (selectedRowKeys) => {
        if (selectedRowKeys.length > 200) {
            return Message.error("最多可选择200个好友")
        }
        this.setState({ selectedRowKeys })
    }
    onSelect= (filterContacts, i, end) => () => {
        let userids = filterContacts.map((item) => item.userid)
        userids = userids.slice(i * 200, end)
        this.setState({
            selectedRowKeys: userids,
        })
    }
    filterFun=(searchV) => {
        let {kefu_wxid, allContacts} = this.props
        const { city, nick } = searchV || this.state.searchV
        let filterContacts = []
        if (kefu_wxid && allContacts) {
            kefu_wxid.map((item) => {
                let list = allContacts.filter((mess) => mess.kefu_wxid === item)
                filterContacts = [...filterContacts, ...list]
            })
            city && city !== "" && (filterContacts = filterContacts.filter((mess) => mess.city && mess.city.indexOf(city.toLocaleLowerCase()) !== -1))
            nick && nick !== "" && (filterContacts = filterContacts.filter((mess) =>
                mess.nick && mess.nick.indexOf(nick.toLocaleLowerCase()) !== -1 ||
            mess.remark && mess.remark.indexOf(nick.toLocaleLowerCase()) !== -1))
        }
        return filterContacts
    }
    render () {
        let { dispatch, weChatList, kefu_wxid, allTotal, loading} = this.props
        let { selectedRowKeys, current, searchV, currentTotal } = this.state
        const { city, nick, remark } = searchV
        let filterContacts = this.filterFun()
        const paginationConfig = {
            currentTotal,
            defaultPageSize: 20,
            hideOnSinglePage: true,
            onChange: this.pageChangeHandler,
            current: current,
        }
        let selections = []
        selections[0] = {
            key: 0,
            text: "取消选择",
            onSelect: () => {
                this.setState({
                    selectedRowKeys: [],
                })
            },
        }
        let max = filterContacts && filterContacts.length / 200
        for (let i = 0; i <= max; i++) {
            let end = i + 1 > max ? filterContacts.length : (i + 1) * 200
            selections[i + 1] = {
                key: i + 1,
                text: `选择 ${i * 200} - ${end}`,
                // text: `选择 0 - ${end}`,
                onSelect: this.onSelect(filterContacts, i, end),
            }
        }
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            hideDefaultSelections: true,
            selections: filterContacts.length > 20 ? selections : false,
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
        if (city || nick || remark) {
            currentTotal = allTotal
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
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    wrapClassName={styles.wrapStyle}
                    bodyStyle={{ height: "calc(100% - 55px)", overflow: "auto", padding: "10px" }}
                    destroyOnClose={true}
                >
                    <div>
                        <SelectForm dispatch={dispatch} kefu_wxid={kefu_wxid} onSubmit={this.onSubmit} />
                        <div className={styles.tableStyle}>
                            <Table
                                loading={filterContacts.length === 0 && loading}
                                dataSource={filterContacts}
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
                            <div>
                                <Spin spinning={filterContacts.length !== (filterContacts.length > allTotal ? filterContacts.length : allTotal)} />&nbsp;&nbsp;
                                已加载数量: {filterContacts.length}/{filterContacts.length > allTotal ? filterContacts.length : allTotal}
                            </div>
                        </div>
                    </div>
                </Modal>
            </span>
        )
    }
}
export default SelectTable
