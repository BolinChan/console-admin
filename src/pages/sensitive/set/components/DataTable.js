import { Table, Popconfirm, Button } from "antd"
import AddForm from "./AddForm"

const columns = [{ title: "敏感词", dataIndex: "name" },
    { title: "敏感类型", dataIndex: "type", render: (type) => type === "1" ? "阻止并预警" : "仅预警"}, { title: "创建者", dataIndex: "shenhe_realname" }, { title: "创建时间", dataIndex: "createtime" }]
const GroupTable = ({ list, loading, dispatch }) => {
    const deleteConfirm = (id) => {
        dispatch({
            type: "auxiliary/deleteKeyData",
            payload: { id },
        })
    }
    const showTotal = () => (
        <span style={{ marginTop: 5, color: "rgba(0,0,0,0.5)", display: "block" }}>总数{list && list.length}条</span>
    )
    const paginationConfig = {
        total: list && list.length,
        defaultPageSize: 20, // 每页显示条数
        showTotal,
    }
    columns[8] = {
        title: "操作",
        key: "operation",
        className: "operation",
        render: (record) => (
            <a>
                <AddForm record={record} dispatch={dispatch} action="updateKeyData">
                    <Button type="primary" className="mar5">编辑</Button>
                </AddForm>
                <Popconfirm title="确定要删除吗？" onConfirm={() => deleteConfirm(record.id)}>
                    <Button type="danger" className="mar5">删除</Button>
                </Popconfirm>
            </a>
        ),
    }
    return (
        <div className="pad10">
            <Table dataSource={list} bordered={true} pagination={paginationConfig} rowKey="id" columns={columns} simple loading={loading} />
        </div>
    )
}
export default GroupTable
