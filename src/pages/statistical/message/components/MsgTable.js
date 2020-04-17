import { Table } from "antd"
const MsgTable = ({ data, loading }) => {
    const columns = [
        // { title: "时间", dataIndex: "date" },
        { title: "客服账号", dataIndex: "zaccount" },
        { title: "发送人数", dataIndex: "fachu_person" },
        { title: "接收人数", dataIndex: "shoudao_person" },
        { title: "收发人数比例", dataIndex: "person_bili" },
        { title: "发出消息", dataIndex: "fachu_msg" },
        { title: "接收消息", dataIndex: "shoudao_msg" },
        { title: "收发消息比例", dataIndex: "msg_bili" },
    ]
    const ShowTotalItem = () => (
        <span style={{ marginTop: 5, color: "rgba(0,0,0,0.5)", display: "block" }}>总数{data && data.length}条</span>
    )
    const paginationConfig = {
        showTotal: ShowTotalItem,
        total: data && data.length,
        defaultPageSize: 10,
        // hideOnSinglePage: true,
    }
    return (
        <div className="pad20">
            <Table dataSource={data} pagination={paginationConfig} rowKey="zaccount" columns={columns} loading={loading} simple />
        </div>
    )
}
export default MsgTable
