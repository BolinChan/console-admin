import { Modal } from "antd"
import MessageList from "../../chatList/components/MessageList"
const ChatModel = ({ messages, messageTotal, weChatList, messloading, visible, record, dispatch, handleCancel}) => {
    const message = record && messages && messages.filter((item) => item.tag === record.wxid && item.WeChatId === record.kefu_wxid)
    let title = record ? (record.nick || record.remark || record.wxid) : ""
    return (
        <span >
            <Modal
                footer={null}
                bodyStyle={{ height: "calc(100% - 55px)", overflow: "hidden", padding: 0 }}
                wrapClassName="wrapClass"
                style={{ height: "80%", padding: 0, top: "5%" }}
                width="60%"
                title={title + "聊天记录"}
                visible={visible}
                onCancel={handleCancel}
                destroyOnClose={true}
            >
                <MessageList
                    loading={messloading !== undefined && messloading}
                    weChatList={weChatList}
                    messageTotal={messageTotal}
                    messages={message}
                    FriendId={record && record.wxid}
                    kefu_wxid={record && record.kefu_wxid}
                    dispatch={dispatch}/>
            </Modal>
        </span>
    )
}
export default ChatModel

