import { Table, Popconfirm, Button } from "antd"
import { decodeURIComponent } from "../../../../utils/helper"
// import AddForm from "./AddForm"
const columns = [{ title: "分组名", dataIndex: "fenzu_name" }]
const GroupTable = ({ list, loading, dispatch, showModal }) => {
    const deleteConfirm = (fid) => {
        dispatch({
            type: "chat/delusergroup",
            payload: { fid },
        })
    }
    const showTotal = () => (
        <span style={{ marginTop: 5, color: "rgba(0,0,0,0.5)", display: "block" }}>总数{list && list.length}条</span>
    )
    const paginationConfig = {
        showTotal,
        total: list && list.length,
        defaultPageSize: 20, // 每页显示条数
        // hideOnSinglePage: true, // 只有一页时隐藏
    }
    const deviceFun = (zu_id, num) => {
        num !== "0" && (window.location.href = `#/wechat/friendsList?d=${decodeURIComponent(zu_id, 1)}`)
    }
    columns[1] = {
        title: "当前分组下的好友数量",
        dataIndex: "number",
        render: (num, record) => <div
            title={num === "0" ? "当前分组下暂无好友" : "点击查看当前分组下的好友"}
            onClick={() => deviceFun(record.id, num)}
            style={{cursor: "pointer"}}>
            <a>{num}</a>
        </div> }
    columns[4] = {
        title: "操作",
        key: "operation",
        className: "operation",
        render: (record) => (
            <a>
                <Button type="primary" onClick={() => showModal && showModal("editusergroup", record)} className="mar5">编辑</Button>
                <Popconfirm title="确定要删除吗？" onConfirm={() => deleteConfirm(record.id)}>
                    <Button type="danger" className="mar5">删除</Button>
                </Popconfirm>
            </a>
        ),
    }
    return (
        <div className="pad10">
            <div className="pad10">
                {/* <AddForm dispatch={dispatch} action="addDevGroup"> */}
                <Button type="primary" onClick={() => showModal && showModal("addusergroup")}>新增分组</Button>
                {/* </AddForm> */}
            </div>
            <div className="pad10">
                <Table dataSource={list} bordered={true} pagination={paginationConfig} rowKey="id" columns={columns} simple loading={loading} />
            </div>
        </div>
    )
}
export default GroupTable
