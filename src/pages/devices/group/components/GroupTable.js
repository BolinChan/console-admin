import { Table, Popconfirm, Button } from "antd"
import AddForm from "./AddForm"
import { decodeURIComponent } from "../../../../utils/helper"
const columns = [{ title: "分组名", dataIndex: "name" }]
const GroupTable = ({ list, loading, dispatch }) => {
    const deviceFun = (zu_id, num) => {
        num !== "0" && (window.location.href = `#/devices/list?d=${decodeURIComponent(zu_id, 1)}`)
    }
    const deleteConfirm = (id) => {
        dispatch({
            type: "devices/delDevGroup",
            payload: { id },
        })
    }
    const ShowTotalItem = () => (
        <span style={{ marginTop: 5, color: "rgba(0,0,0,0.5)", display: "block" }}>总数{list && list.length}条</span>
    )
    const paginationConfig = {
        total: list && list.length,
        defaultPageSize: 20, // 每页显示条数
        showTotal: ShowTotalItem,
        // hideOnSinglePage: true, // 只有一页时隐藏
    }
    columns[1] = { title: "当前分组下的设备数量", dataIndex: "device_num",
        render: (num, record) => <div title={num === "0" ? "当前分组下暂无设备" : "点击查看当前分组下的设备"} onClick={() => deviceFun(record.id, num)} style={{cursor: "pointer"}}><a>{num}</a></div> }
    columns[4] = {
        title: "操作",
        key: "operation",
        className: "operation",
        render: (record) => (
            <a>
                <AddForm record={record} dispatch={dispatch} action="editDevGroup">
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
            <div className="pad10">
                <AddForm dispatch={dispatch} action="addDevGroup">
                    <Button type="primary">新增分组</Button>
                </AddForm>
            </div>
            <div className="pad10">
                <Table dataSource={list} bordered={true} pagination={paginationConfig} rowKey="id" columns={columns} simple loading={loading} />
            </div>
        </div>
    )
}
export default GroupTable
