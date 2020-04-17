import { Table, Avatar, Row, Tooltip } from "antd"
import SetStatues from "./SetStatues"
import styles from "../page.css"
const columns = [
    { title: "敏感行为", dataIndex: "action" },
    { title: "敏感内容", dataIndex: "content", className: `${styles.dhs}`, render: (content) => <Tooltip style={{maxHeight: "500px"}} placement="top" title={content}>{content}</Tooltip>},
    { title: "异常/正常", dataIndex: "is_exception", render: (exception) => (exception === "1" ? "异常" : "正常") },
    { title: "状态", dataIndex: "status" },
    { title: "操作人", dataIndex: "responsible", render: (name, record) => name || record.shenhe_realname},
    {
        title: "微信信息",
        dataIndex: "re_wxid",
        render: (wxid, item) => (
            <Row type="flex" align="middle">
                <div>
                    <Avatar shape="square" size={64} src={item.re_headimg} icon="user" />
                </div>
                <div className={styles.padLR}>
                    <div className={styles.beyond}>
                        昵称：
                        {item.re_nick}
                    </div>
                    <p>
                        微信ID：
                        {wxid}
                    </p>
                </div>
            </Row>
        ),
    },
    {
        title: "好友信息",
        dataIndex: "friend_nick",
        // width: 400,
        render: (nick, item) => (
            <div>
                <Avatar shape="square" size={64} src={item.friend_headimg} icon="user" />
                <span className="pad10">{nick || item.friend_remark || item.friend_wxid}</span>
            </div>
        ),
    },
    { title: "设备", dataIndex: "device_name" },
    { title: "发送时间", dataIndex: "add_time" },
]
const actionFun = (action, record, list) => {
    let setList = list && list.find((item) => item.action_type === record.actionid)
    let color = setList && setList.color !== "rgba(0, 0, 0, 1)" ? setList.color : ""
    return <span style={{ color: color }}>{action}</span>
}
const OperateTable = ({ loading, list, total, current, pageChangeHandler, onOk, onSelectChange, selectedRowKeys, setActionList }) => {
    columns[0] = { title: "敏感行为", dataIndex: "action", render: (action, record) => actionFun(action, record, setActionList) }
    columns[3] = {
        title: "状态",
        dataIndex: "status",
        render: (status, record) => (
            <SetStatues onOk={onOk} record={record}>
                {status === "0" ? "待处理" : "已处理"}
            </SetStatues>
        ),
    }
    const showTotal = () => (
        <span style={{ marginTop: 5, color: "rgba(0,0,0,0.5)", display: "block" }}>总数{total}条</span>
    )
    const paginationConfig = {
        total, // 总数
        showTotal,
        onChange: pageChangeHandler, // 点击分页
        defaultPageSize: 20,
        current,
    }
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    }
    // const hasSelected = selectedRowKeys && selectedRowKeys.length > 0
    return (
        <div>
            {/* <div>
                <SetStatues onOk={setStatues} record={selectedRowKeys}>
                    <Button type="primary">批量处理</Button>
                </SetStatues>
                <span style={{ marginLeft: 8 }}>{hasSelected ? `已选择 ${selectedRowKeys.length}` : ""}</span>
            </div> */}
            {/* <br /> */}
            <Table dataSource={list} rowSelection={rowSelection} rowKey="id" columns={columns} pagination={paginationConfig} loading={loading} bordered simple />
        </div>
    )
}
export default OperateTable
