import { Component } from "react"
import styles from "./Message.css"
import Message from "./Message"
import { Spin, Pagination, Input, DatePicker } from "antd"
import moment from "moment"
// import { Input, DatePicker } from "antd"
// import styles from "./BuddyChat.css"
const Search = Input.Search
// const FormItem = Form.Item
const { RangePicker } = DatePicker
let length = 0
let messagesId = ""
class MessageList extends Component {
    state = {
        scrollTop: 0,
        offsetHeight: 0,
        scrollHeight: 0,
        isLoading: false,
        current: 1,
    }
    componentDidUpdate () {
        if (this.props.messages.length > 0 && this.props.messages[0].id !== messagesId) {
            messagesId = this.props.messages[0].id
            length = 0
        }
        if (this.props.messages.length > length) {
            this.scrollList.scrollTop = this.scrollList.scrollHeight // 每次滚动条到底部
            length = this.props.messages.length
        }
    }

    componentDidMount () {
        this.scrollList.scrollTop = this.scrollList.scrollHeight
        this.scrollList.onscroll = () => {
            const scrollHeight = this.scrollList.scrollHeight
            const scrollTop = this.scrollList.scrollTop
            const offsetHeight = this.scrollList.offsetHeight
            this.setState({
                scrollTop: scrollTop,
                scrollHeight: scrollHeight,
                offsetHeight: offsetHeight,
            })
        }
        window.onmousewheel = document.onmousewheel = this.scrollFunc // IE/Opera/Chrome
        document.addEventListener("DOMMouseScroll", this.scrollFunc, false) // FF
    }
    onChangePage = (page, pageSize) => {
        const { keyword, datatime } = this.state
        const { kefu_wxid, dispatch, FriendId } = this.props
        dispatch({
            type: "message/fetchMessages",
            payload: { FriendId, deviceIds: [kefu_wxid], page, keyword, datatime },
        })
        this.setState({ current: page })
    }
    // 选择时间
    selectDate = (datatime) => {
        let { keyword } = this.state
        const { dispatch, kefu_wxid, SearchChange, FriendId } = this.props
        let reg_time1 = datatime && moment(datatime[0]._d).format("YYYY-MM-DD 00:00:00")
        let reg_time2 = datatime && moment(datatime[1]._d).format("YYYY-MM-DD 23:59:59")
        datatime = [reg_time1, reg_time2]
        dispatch({
            type: "message/fetchMessages",
            payload: { keyword, deviceIds: [kefu_wxid], FriendId, datatime, page: 1 },
        })
        SearchChange && SearchChange(datatime, keyword)
        this.setState({ datatime })
    }
    // 搜索聊天消息
    SearchMessage = (keyword) => {
        let { datatime } = this.state
        const { dispatch, kefu_wxid, SearchChange, FriendId } = this.props
        dispatch({
            type: "message/fetchMessages",
            payload: { keyword, deviceIds: [kefu_wxid], FriendId, datatime, page: 1 },
        })
        SearchChange && SearchChange(datatime, keyword)
        this.setState({ keyword })
    }
    onChangeRecord = (e) => {
        this.setState({ keyword: e.target.value })
    }
    render () {
        const { messages, messageTotal, weChatList, loading } = this.props
        const { current, keyword } = this.state
        return (
            <div className={styles.rightBox}>
                <div layout="inline" className="pad10">
                    <RangePicker style={{ width: "300px" }} format="YYYY-MM-DD" allowClear={false} onChange={this.selectDate} className="mr10" ranges={{
                        "今天": [moment(), moment()],
                        "昨天": [moment().days(moment().days() - 1)
                            .startOf("days"), moment().days(moment().days() - 1)
                            .endOf("days")],
                        "过去一周": [moment().days(moment().days() - 7)
                            .startOf("days"), moment().endOf(moment())],
                        "过去一个月": [moment().days(moment().days() - 30)
                            .startOf("days"), moment().endOf(moment())],
                        "过去半年": [moment().days(moment().days() - 183)
                            .startOf("days"), moment().endOf(moment())],
                    }}/>
                    <Search style={{ width: "200px" }} value={keyword} placeholder="请输入内容" onSearch={(value) => this.SearchMessage(value)} onChange={this.onChangeRecord} />
                </div>
                <div className={styles.message_body} ref={(el) => (this.scrollList = el)}>
                    {messages &&
                        messages.map((item, index) => {
                            let img = weChatList && weChatList.find((mess) => mess.wxid === item.WeChatId)
                            img = img ? img.headimg : "https://jutaobao.oss-cn-shenzhen.aliyuncs.com/no-head.png"
                            return (
                                <Message
                                    {...item}
                                    keyStatus={item.key}
                                    mine={item.status === "0"}
                                    content={item.text}
                                    headimg={item.status === "0" ? img : item.headImg || "https://jutaobao.oss-cn-shenzhen.aliyuncs.com/no-head.png"}
                                    key={index}
                                    wxId={item.tag}
                                />
                            )
                        })}
                    <div className={styles.loadMsg}>
                        <Spin spinning={loading} />
                    </div>
                    {messages.length === 0 && !loading && <div className={styles.moreA}>无任何消息记录</div>}
                </div>
                {messageTotal > 0 &&
                    messages &&
                    messages.length > 0 && (
                    <div className={styles.footer}>
                        <Pagination current={current} pageSize={20} total={messageTotal} showTotal={() => `共 ${messageTotal} 条 `} onChange={this.onChangePage} />
                    </div>
                )}
            </div>

        )
    }
}
export default MessageList
