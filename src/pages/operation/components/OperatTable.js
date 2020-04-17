import { Table } from "antd"
const columns = [
    { title: "用户名", dataIndex: "user_name" },
    { title: "用户行为", dataIndex: "action" },
    { title: "IP地址", dataIndex: "ip" },
    { title: "时间", dataIndex: "add_time" },
    { title: "详情", dataIndex: "remark" },
]

const OperatTable = ({ loading, list }) => {
    const showTotal = () => (
        <span style={{ marginTop: 5, color: "rgba(0,0,0,0.5)", display: "block" }}>总数{list && list.length}条</span>
    )
    const paginationConfig = {
        total: list && list.length, // 总数
        showTotal,
    }
    return (

        <div>
            <Table dataSource={list} rowKey="id" columns={columns} loading={loading} bordered simple pagination={paginationConfig}/>
        </div>
    )
}
export default OperatTable
