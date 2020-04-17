import { Component } from "react"
import { connect } from "dva"
import {Button, Input, Row} from "antd"
import ChatTable from "./components/ChatTable"
import AccountModal from "./components/AccountModal"
import SetYh from "../listYH/components/SetYh"
// import styles from "./page.css"
const Search = Input.Search
class Page extends Component {
    state={visible: false, accountModel: false, selectedRowKeys: []}
    // 删除设备微信
    deleteConfirm = (id) => {
        this.props.dispatch({
            type: "chat/deleteWeChatList",
            payload: { id },
        })
    }
    // 获取群
    GroupFun = (kefu_wxid) => {
        this.props.dispatch({
            type: "chat/fetchContactList",
            payload: { kefu_wxid: [kefu_wxid] },
        })
    }
    // 获取好友
    BuddyFun = (kefu_wxid) => {
        this.props.dispatch({
            type: "chat/fetchContactList",
            payload: { kefu_wxid: [kefu_wxid] },
        })
    }
    // 修改微信备注
    onSubmit = (record, remark) => {
        this.props.dispatch({
            type: "chat/WeChatRemark",
            payload: { remark, id: record.id },
        })
    }
    // 删除客服
    preventDefault = (id, record) => () => {
        this.props.dispatch({
            type: "chat/deleteKefu",
            payload: { id, recordid: record.id },
        })
    }
    // 同步好友
    flushFun = (WeChatId) => {
        this.props.dispatch({
            type: "chat/updateContactList",
            payload: {WeChatId: [WeChatId]},
        })
    }
    // 清理粉丝
    fanFun = (WeChatId) => {
        this.props.dispatch({
            type: "chat/delContact",
            payload: {WeChatId, stopVisible: 1},
        })
    }
    // 停止清理粉丝
    stopdelete = (WeChatId) => {
        this.props.dispatch({
            type: "chat/stopDelete",
            payload: {WeChatId},
        })
    }
    // 自动养号相关
    showModal = (record) => {
        const { dispatch} = this.props
        this.setState({
            visible: true,
            record,
        })
        dispatch({
            type: "chat/fetchNursing",
            payload: {device_name: record.nickname },
        })
    }
    // 分配客服
    showAccount = (record) => {
        this.setState({
            accountModel: true,
            record,
        })
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
            accountModel: false,
            record: false,
        })
    }
    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys})
    }
    onSelect=(value) => {
        let {selectedRowKeys} = this.state
        const {weChatList} = this.props
        if (value === "all" && weChatList) {
            selectedRowKeys = weChatList.map((item) => item.wxid)
        } else {
            selectedRowKeys = []
        }
        this.setState({ selectedRowKeys })
    }
    // 搜索微信
    searcWeChat=(nickname) => {
        this.props.dispatch({
            type: "chat/fetchWeChatList",
            payload: {nickname: nickname.trim() },
        })
    }

    render () {
        let { dispatch, YHList, accountList, weChatList} = this.props
        const {record, visible, accountModel, selectedRowKeys} = this.state
        const hasSelected = selectedRowKeys.length > 0
        if (record && YHList) {
            YHList = YHList.find((item) => item.deviceid === record.wxid)
        }

        return (
            <div className="pad10">
                <Row className="pad10" type="flex" justify="space-between">
                    <div>
                        <Button type="primary" onClick={this.showAccount} disabled={!hasSelected} className="mr10">批量分配客服</Button>
                        {hasSelected && <span>已选择 {selectedRowKeys.length} 项</span>}
                    </div>
                    <Search
                        style={{ width: 300}}
                        placeholder="请输入微信昵称"
                        // enterButton
                        onSearch={this.searcWeChat}
                    />
                </Row>
                <div className="pad10">
                    <ChatTable
                        BuddyFun={this.BuddyFun}
                        onSubmit={this.onSubmit}
                        GroupFun={this.GroupFun}
                        deleteConfirm={this.deleteConfirm}
                        preventDefault={this.preventDefault}
                        flushFun={this.flushFun}
                        fanFun={this.fanFun}
                        stopdelete={this.stopdelete}
                        showModal={this.showModal}
                        showAccount={this.showAccount}
                        {...this.props}
                        selectedRowKeys={selectedRowKeys}
                        onSelectChange={this.onSelectChange}
                        onSelect={this.onSelect}
                    />
                </div>
                {visible && <SetYh handleCancel={this.handleCancel} list={YHList} visible={visible} wxids={record && record.wxid} dispatch={dispatch}></SetYh>}
                <AccountModal weChatList={weChatList} selectedRowKeys={selectedRowKeys} handleCancel={this.handleCancel} list={accountList} visible={accountModel} dispatch={dispatch} record={record}>
                </AccountModal>
            </div>
        )
    }
}
function mapStateToProps (state) {
    const { weChatList, update, YHList } = state.chat
    return {
        accountList: state.account.accountList,
        weChatList,
        loading: state.loading.models.chat,
        update,
        YHList,
    }
}
export default connect(mapStateToProps)(Page)
