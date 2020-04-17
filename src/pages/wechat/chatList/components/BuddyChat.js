import { Modal, Button, Row } from "antd"
import { Component } from "react"
import { connect } from "dva"
import styles from "./BuddyChat.css"
import MessageList from "./MessageList"
import Sidebar from "./Sidebar"
import moment from "moment"
import "moment/locale/zh-cn"
moment.locale("zh-cn")
class BuddyChat extends Component {
    state = { visible: false, page: 1, current: 1 }
    showModal = () => {
        this.setState({ visible: true, keyword: "" })
    }
    handleCancel = (e) => {
        this.setState({ visible: false })
    }
    // 搜索联系人
    SearchContact = (nick) => {
        const { dispatch, kefu_wxid } = this.props
        if (nick !== "") {
            dispatch({
                type: "chat/fetchContactList",
                payload: { nick },
            })
        } else {
            dispatch({
                type: "chat/fetchContactList",
                payload: { kefu_wxid: [kefu_wxid] },
            })
        }
    }
    // 上一页
    preFun = () => {
        let { page } = this.state
        const { dispatch, kefu_wxid } = this.props
        if (page > 1) {
            --page
            dispatch({
                type: "chat/fetchContactList",
                payload: { page, kefu_wxid: [kefu_wxid] },
            })
            this.setState({ page })
        }
    }
    // 下一页
    nextFun = () => {
        let { page } = this.state
        const { contactTotal, dispatch, kefu_wxid } = this.props
        if (page < contactTotal / 20) {
            ++page
            dispatch({
                type: "chat/fetchContactList",
                payload: { page, kefu_wxid: [kefu_wxid] },
            })
            this.setState({ page })
        }
    }
    // 选择联系人
    handleChangeCurrent = (currentContactId, FriendId, kefu_wxid) => {
        const {datatime, keyword} = this.state
        this.props.dispatch({
            type: "message/fetchMessages",
            payload: { FriendId, deviceIds: [kefu_wxid], page: 1, datatime, keyword },
        })
        this.setState({ currentContactId, FriendId })
    }
    SearchChange=(datatime, keyword) => {
        this.setState({datatime, keyword})
    }
    render () {
        const { contacts, messages, contactTotal, messageTotal, weChatList, kefu_wxid, loading, messloading, dispatch } = this.props
        const { currentContactId, page, FriendId } = this.state
        let contact = contacts && contacts.filter((item) => item.kefu_wxid === kefu_wxid)
        const message = messages && messages.filter((item) => item.tag === FriendId && item.WeChatId === kefu_wxid)
        return (
            <span >
                <Button type="primary" className="mar5" onClick={this.showModal}>
                    {this.props.children}
                </Button>
                <Modal
                    footer={null}
                    bodyStyle={{ height: "calc(100% - 55px)", overflow: "hidden", padding: 0 }}
                    wrapClassName={styles.buddy}
                    style={{ height: "90%", padding: 0, top: "5%" }}
                    width="60%"
                    title={this.props.children}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                >
                    <Row type="flex" className={styles.H}>
                        <Sidebar
                            contacts={contact}
                            loading={loading}
                            handleChangeCurrent={this.handleChangeCurrent}
                            currentContactId={currentContactId}
                            preFun={this.preFun}
                            nextFun={this.nextFun}
                            page={page}
                            totalpage={contactTotal / 20}
                            SearchContact={this.SearchContact}
                        />
                        <MessageList
                            loading={messloading !== undefined && messloading}
                            weChatList={weChatList}
                            messageTotal={messageTotal}
                            messages={message}
                            SearchChange={this.SearchChange}
                            FriendId={FriendId}
                            kefu_wxid={kefu_wxid}
                            dispatch={dispatch}/>
                    </Row>
                </Modal>
            </span>
        )
    }
}
function mapStateToProps (state) {
    const { contactTotal, contacts, weChatList } = state.chat
    const { messageTotal, messages } = state.message
    return {
        weChatList,
        contacts,
        contactTotal,
        messageTotal,
        messages,
        loading: state.loading.models.chat,
        messloading: state.loading.models.message,
    }
}
export default connect(mapStateToProps)(BuddyChat)
