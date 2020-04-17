import { Table, Avatar, Row } from "antd"
import styles from "../page.css"
import { hasEmoji } from "../../../../utils/helper"
const TYPES = [{ id: "1", label: "文本消息" }, { id: "2", label: "图片消息" }, { id: "3", label: "链接消息" }, { id: "4", label: "视频消息" }, {id: "5", label: "系统消息"}, {id: "6", label: "链接"}]
const findTypeLabel = (id) => {
    const target = TYPES.find((item) => item.id === id)
    return target && target.label ? target.label : ""
}
const errinfoFun = (isTrue) => (isTrue === "1" ? "接收" : "发送")
const WeChatFun = (WeChatId, weChatList) => {
    let list = weChatList.find((item) => item.wxid === WeChatId)
    if (list) {
        return list.nickname ? list.nickname : "未命名"
    }
}
const devicesFun = (WeChatId, weChatList) => {
    let list = weChatList.find((item) => item.wxid === WeChatId)
    if (list) {
        return list.devicename ? list.devicename : "未命名"
    }
}
const contentFun = (text, row) => {
    if (row.type === "2") {
        return <img src={row.text || row.url} style={{ maxHeight: "100px" }} alt="任务图片" />
    }
    if (row.type === "6" && typeof text === "string") {
        try {
            let list = JSON.parse(text)
            const {Source, Title} = list
            return <a target="_blank" rel="noopener noreferrer" href={list.Url} title="点击查看">
                <Row type="flex" align="middle" className={styles.ljCard}>
                    <Avatar shape="square" size={64} icon="user" src={list.Icon}/>
                    <div className="ml10" style={{flex: 1, overflow: "hidden"}}>
                        <p>{Source.length > 15 ? Source.slice(0, 15) + "..." : Source}</p>
                        <p>{Title.length > 30 ? Title.slice(0, 30) + "..." : Title}</p>
                    </div>
                </Row>
            </a>
        } catch (e) {
            return "无"
        }
    } else {
        return <div>{text ? <span dangerouslySetInnerHTML={{ __html: hasEmoji(text) }} /> : "无"}</div>
    }
}
const TableRecord = ({ current, logs, loading, weChatList, pageChangeHandler, total }) => {
    const columns = [
        { title: "编号", dataIndex: "id" },
        { title: "执行设备", dataIndex: "devicename", render: (name, row) => devicesFun(row.WeChatId, weChatList) },
        { title: "执行微信", dataIndex: "WeChatId", render: (WeChatId) => WeChatFun(WeChatId, weChatList) },
        {
            title: "操作人",
            dataIndex: "excuse_account",
            render: (account) => (account ? account : "未知"),
        },
        { title: "好友信息", dataIndex: "nick", render: (nick, row) => nick || row.FriendId },
        { title: "任务类型", dataIndex: "type", render: (id) => findTypeLabel(id) },
        { title: "内容", dataIndex: "text", className: `${styles.maxWidth}`, render: (text, row) => contentFun(text, row),
        },
        {
            title: "创建时间",
            dataIndex: "addtime",
        },
        { title: "状态", dataIndex: "status", render: (id) => errinfoFun(id) },
    ]
    const showTotal = () => (
        <span style={{ marginTop: 5, color: "rgba(0,0,0,0.5)", display: "block" }}>总数{total}条</span>
    )
    const paginationConfig = {
        total,
        showTotal,
        defaultPageSize: 20,
        // hideOnSinglePage: true,
        onChange: pageChangeHandler,
        current,
    }
    // let heigthY = document.getElementById("cont") ? document.getElementById("cont").offsetHeight - 270 : "auto"
    return (
        <div>
            <Table dataSource={logs} bordered={true} pagination={paginationConfig} rowKey="id" columns={columns} loading={loading} simple />
        </div>
    )
}
export default TableRecord
