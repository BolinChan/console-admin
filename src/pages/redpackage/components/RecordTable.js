import { Table, Avatar } from "antd"
import moment from "moment"
const statusFun = (status, item) => {
    if (status === "1") {
        return "已领取"
    } else {
        return status === "0" ? "未领取" : <div>红包错误<p style={{color: "rgb(245, 34, 45)", fontSize: "12px"}}>{item.msg}</p></div>
    }
}
const timeFun = (time) => time && moment(new Date(time * 1000)).format("YYYY-MM-DD HH:mm:ss")
const columns = [
    { title: "操作人", dataIndex: "ziaccountname", render: (ziaccountname) => ziaccountname || "未知"},
    {
        title: "接收人微信",
        dataIndex: "wxid",
        render: (wxid, item) => (
            <div>
                <Avatar shape="square" size="large" icon="user" src={item.headImg} className="mr10"/>
                <span style={{ whiteSpace: "nowrap"}}>
                    { item.remarks || item.nickname || item.wxid || "未知"}
                </span>
            </div>
        ),
    },
    { title: "发送时间", dataIndex: "createtime", render: (time) => timeFun(time) },
    {
        title: "领取人微信",
        dataIndex: "l_nickname",
        render: (l_nickname, item) => (
            item.status === "1" ? <div>
                <Avatar shape="square" size="large" icon="user" src={item.avatar} className="mr10"/>
                <span style={{ whiteSpace: "nowrap"}}>
                    {l_nickname || "未知"}
                </span>
            </div> : "未领取"
        ),
    },
    { title: "领取时间", dataIndex: "updatetime", render: (time) => timeFun(time) },
    { title: "红包金额（元）", dataIndex: "money" },
    { title: "红包备注", dataIndex: "hbremark" },
    { title: "留言", dataIndex: "content" },
    { title: "红包状态", dataIndex: "status", render: (status, item) => statusFun(status, item) },
    { title: "关联的订单", dataIndex: "xgorder", render: (xgorder) => xgorder || "无" },
]
const RecordTable = ({ loading, list, current, accountList, pageChangeHandler }) => {
    const showTotal = () => (
        <span style={{ marginTop: 5, color: "rgba(0,0,0,0.5)", display: "block" }}>总数{list && Number(list[0])}条</span>
    )
    const paginationConfig = {
        total: list && Number(list[0]),
        onChange: pageChangeHandler,
        defaultPageSize: 20,
        current,
        showTotal,
    }

    columns[0] = { title: "操作人", dataIndex: "zid", render: (id) => {
        let account = accountList && accountList.find((item) => item.id === id)
        return account ? account.accountnum : "未知"
    } }
    return (
        <div>
            <Table dataSource={list[1]} rowKey="createtime" columns={columns} pagination={paginationConfig} loading={loading} bordered simple />
        </div>
    )
}
export default RecordTable
