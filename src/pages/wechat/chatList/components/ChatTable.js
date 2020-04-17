import { Table, Avatar, Badge, Popconfirm, Button, Tag, Row } from "antd"
// import GroupChat from "./GroupChat"
import BuddyChat from "./BuddyChat"
// import AccountModal from "./AccountModal"
import SetInput from "../../../components/SetInput"
import styles from "../page.css"
const columns = [
    {
        title: "微信基本信息",
        dataIndex: "wx_id",
        width: 350,
        render: (wx_id, item) => (
            <Row type="flex" align="middle">
                <div>
                    <Avatar shape="square" size={64} src={item.headimg} />
                </div>
                <div className={styles.padLR}>
                    <Row type="flex" align="middle" className={styles.h}>
                        <div className={styles.beyond}>
                            昵称：
                            {item.nickname}
                        </div>
                        <div className={styles.dot}>
                            <Badge status={item.isoff === "1" ? "success" : "error"} count={5} dot className={styles.padLR} />
                        </div>
                    </Row>
                    <p>
                        微信ID：
                        {item.wxid}
                    </p>
                </div>
            </Row>
        ),
    },
    { title: "所属设备", dataIndex: "devicename", width: 180 },
]
const ChatTable = ({ loading, weChatList, deleteConfirm, preventDefault, BuddyFun, showAccount, onSubmit, flushFun, update, fanFun, stopdelete, selectedRowKeys, onSelectChange, onSelect}) => {
    const ShowTotalItem = () => (
        <span style={{ marginTop: 5, color: "rgba(0,0,0,0.5)", display: "block" }}>总数{weChatList && weChatList.length}条</span>
    )
    const paginationConfig = {
        total: weChatList && weChatList.length,
        defaultPageSize: 20, // 每页显示条数
        showTotal: ShowTotalItem,
        // hideOnSinglePage: true, // 只有一页时隐藏
    }
    columns[3] = {
        title: "所属客服",
        dataIndex: "kefus",
        render: (kefus, record) => (
            <div>
                <span>
                    {kefus.map((item) => (
                        <Tag closable onClose={preventDefault(item.id, record)} color="blue" style={{ margin: "3px" }} key={item.id}>
                            {item.accountnum}
                        </Tag>
                    ))}
                </span>
                {kefus && kefus.length === 0 && "未分配"}
                <div>{/* <Badge status={item.isoff === "1" ? "success" : "error"} count={5} text={item.useridowen} /> */}</div>
            </div>
        ),
    }
    columns[4] = {
        title: "备注",
        dataIndex: "wxremark",
        width: 150,
        render: (text, record) => <SetInput onSubmit={onSubmit} holder="请输入序号" record={record} defaultname={text ? text : "无"} />,
    }
    const deltitle = <div>清理僵尸粉指令不可中断<br/>请在合适的时间执行清粉<br/>确定要清理僵尸粉吗?</div>
    columns[10] = {
        title: "操作",
        key: "operation",
        render: (record) => {
            let updatelist = update.find((item) => item.wxid === record.wxid)
            let isflush = updatelist ? updatelist.isflush : true
            return (
                <div>
                    {/* <GroupChat>
                        <a onClick={() => GroupFun(record.wxid)}>群聊记录</a>
                    </GroupChat> */}
                    {/* </div> */}
                    {/* <AccountModal list={accountList} defaultV={record.kefus} dispatch={dispatch} record={record}> */}
                    <Button onClick={() => showAccount && showAccount(record)} type="primary" className="mar5">分配客服</Button>
                    {/* </AccountModal> */}
                    <Button className="mar5" type={isflush ? "primary" : ""} title={isflush ? "" : "已同步"} disabled={!isflush} onClick={() => flushFun(record.wxid)} >
                    同步好友
                    </Button>
                    <BuddyChat kefu_wxid={record.wxid} loading={loading}>
                        <a onClick={() => BuddyFun(record.wxid)}>好友聊天记录</a>
                    </BuddyChat>
                    <Popconfirm title={deltitle} onConfirm={() => fanFun(record.wxid, record)}>
                        <Button className="mar5" type="primary">清理僵尸粉</Button>
                    </Popconfirm>
                    <Button className="mar5" type="danger" size="default" onClick={() => stopdelete(record.wxid, record)}>
                        停止清理僵尸粉
                    </Button>
                    <Popconfirm title="确定要删除吗？" onConfirm={() => deleteConfirm(record.id)}>
                        <Button className="mar5" type="danger" size="default">
                        删除
                        </Button>
                    </Popconfirm>
                </div>
            )
        },
    }
    const selections = [{
        key: 0,
        text: "取消选择",
        onSelect: () => onSelect("cancel"),
    },
    {
        key: 0,
        text: "选择全部",
        onSelect: () => onSelect("all"),
    },
    ]
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        hideDefaultSelections: true,
        selections: weChatList && weChatList.length > 20 ? selections : false,
    }
    return (
        <div>
            <Table dataSource={weChatList} rowSelection={rowSelection} rowKey="wxid" columns={columns} loading={loading} pagination={paginationConfig} bordered simple />
        </div>
    )
}
export default ChatTable
