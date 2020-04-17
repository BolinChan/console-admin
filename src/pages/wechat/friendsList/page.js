import { Component } from "react"
import { connect } from "dva"
import { Button, Row, message } from "antd"
import FirendTable from "./components/FirendTable"
import FriendForm from "./components/FriendForm"
import SelectTag from "./components/SelectTag"
import ChatModel from "./components/ChatModel"
import SearchResult from "./components/SearchResult"
import ModifyInfo from "./components/ModifyInfo"
import axios from "axios"

class Page extends Component {
    state = {
        values: {},
        disabled: true,
        selectedRowKeys: [],
        current: 1,
        selecTagid: [],
        showChat: false,
        options: {},
    }
    handleCancel=(e) => {
        this.setState({userRow: null, isModify: false, isTag: false, showChat: false, matchvisible: false, options: {}})
    }
    // 选择页数
    pageChangeHandler = async (page) => {
        await this.props.dispatch({
            type: "chat/fetchContactList",
            payload: { page, ...this.state.values },
        })
        this.setState({current: page})
        if (document.getElementsByClassName("ant-table-body")) {
            document.getElementsByClassName("ant-table-body")[0].scrollTop = 0
        }
    }
    handleSubmit = (values) => {
        this.setState({ values, current: 1 })
        this.props.dispatch({
            type: "chat/fetchContactList",
            payload: { page: 1, ...values },
        })
    }
    submitAll = () => {
        this.props.dispatch({
            type: "chat/fetchContactList",
            payload: {},
        })
        this.setState({ values: {}, current: 1 })
    }
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys })
    }
    // 分配搜索结果，同步记录
    selectMatch = (action, title, type, record) => () => {
        let { contactTotal, weChatList } = this.props
        let { values, selectedRowKeys} = this.state
        let conditions = values
        if (type === "sou" && conditions && !conditions.kefu_wxid) { // 分配搜索结果
            conditions.kefu_wxid = weChatList.map((item) => item.wxid)
        }
        if (type === "xz") { // 选中
            conditions = selectedRowKeys
            contactTotal = selectedRowKeys.length
        }
        if (record) { // 单个好友
            conditions = [record.userid]
            contactTotal = 1
        }
        const options = { total: contactTotal, conditions }
        this.setState({matchvisible: true, options, title, action, record})
    }
    // 修改分组和部分扩展字段
    showModifyInfo = (action, record, fielditem) => {
        this.setState({ isModify: true, fielditem, record, action })
    }
    // 标签相关
    showTag=(type, record, action) => () => {
        this.setState({action, isTag: true, type, userRow: record, selecTagid: record ? record.tagid : []})
    }
    // 选择标签
    onChangeSelect = (selecTagid) => {
        this.setState({selecTagid})
    }
    // 聊天记录
    showChatModel =(record) => {
        const {message} = this.props
        if (message && message.length > 0 && message.find((item) => item.tag === record.wxid && item.WeChatId === record.kefu_wxid)) {
            return
        }
        if (record) {
            this.props.dispatch({
                type: "message/fetchMessages",
                payload: { FriendId: record.wxid, deviceIds: [record.kefu_wxid], page: 1},
            })
        }
        this.setState({record, showChat: true})
    }
    dcData=async (data) => {
        this.setState({dcloading: true})
        await axios.post("//wechat.yunbeisoft.com/index_test.php/home/api/dogetuserlists", data).then(({ data: response }) => {
            if (response.error) {
                message.error("导出失败，请稍后重试！")
            }
            const a = document.createElement("a")
            a.href = response.file
            a.download = "好友数据.xls"
            a.click()
            this.setState({dcloading: false})
        })
    }
    render () {
        let {
            selectedRowKeys,
            record,
            current,
            fielditem,
            dcloading,
            isModify,
            showChat,
            isTag,
            matchvisible,
            options,
            values,
            title,
            action} = this.state
        const { contactTotal, dispatch, tags, accountList, usergroup} = this.props
        const hasSelected = selectedRowKeys.length > 0
        return (
            <div className="pad10">
                <div className="pad10">
                    <FriendForm
                        {...this.props}
                        handleSubmit={this.handleSubmit}
                        onClick={this.showTag("搜索")}
                        selectMatch={this.selectMatch}
                        AllReset={this.submitAll}
                        dcData={this.dcData}
                        dcloading={dcloading} />
                </div>

                <Row type="flex" justify="space-between" className="pad10">
                    <div>
                        <Button disabled={!hasSelected} type="primary"
                            onClick={this.selectMatch("selectFriend", "分配选中好友", "xz")} className="mr10">分配选中好友</Button>
                        <Button disabled={!hasSelected} onClick={this.showTag("批量编辑")} type="primary" className="mr10">批量编辑标签</Button>
                        <Button disabled={!hasSelected} onClick={this.showTag("批量删除", null, "maxDelTags")} type="danger" className="mr10">批量删除标签</Button>
                        <span >{hasSelected ? `已选择 ${selectedRowKeys.length} 项` : ""}</span>
                    </div>
                    {/* <UploadTags dispatch={dispatch}></UploadTags> */}
                </Row>

                <div className="pad10">
                    <FirendTable
                        tabledata={{current, selectedRowKeys, ...this.props}}
                        onSelectChange={this.onSelectChange}
                        pageChangeHandler={this.pageChangeHandler}
                        selectMatch={this.selectMatch}
                        showModifyInfo={this.showModifyInfo}
                        showTag={this.showTag}
                        showChatModel={this.showChatModel} />
                </div>
                {matchvisible && <SearchResult
                    visible={matchvisible}
                    options={options}
                    title={title}
                    action={action}
                    record={record}
                    searchVaule={{...values, page: current}}
                    accountList={accountList}
                    dispatch={dispatch}
                    handleCancel={this.handleCancel}
                />}
                {isModify && <ModifyInfo
                    action={action}
                    visible={isModify}
                    fielditem={fielditem}
                    record={record}
                    dispatch={dispatch}
                    usergroup={usergroup}
                    handleCancel={this.handleCancel} />}

                {isTag && <SelectTag
                    {...this.state}
                    onChangeSelect={this.onChangeSelect}
                    tags={tags}
                    dispatch={dispatch}
                    onCancel={this.handleCancel}
                    contactTotal={contactTotal}
                    conditions={this.state.values}
                />}

                {showChat && <ChatModel
                    {...this.props}
                    visible={showChat}
                    record={record}
                    handleCancel={this.handleCancel}/>}
            </div>
        )
    }
}
function mapStateToProps (state) {
    const { weChatList, contacts, contactTotal, usergroup, fieldata, fieldtotal } = state.chat
    const { accountList } = state.account
    const { messageTotal, messages } = state.message
    const {weChatlabel, tags, labeltotal, labelpage} = state.tagManage
    return {
        weChatList,
        contacts,
        contactTotal,
        tags,
        weChatlabel,
        labeltotal,
        labelpage,
        loading: state.loading.models.chat,
        accountList,
        usergroup,
        messageTotal,
        messages,
        messloading: state.loading.models.message,
        fieldata, fieldtotal,
    }
}
export default connect(mapStateToProps)(Page)
