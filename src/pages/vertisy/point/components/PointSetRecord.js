import { Table, Button, Popconfirm} from "antd"
import PointSet from "./PointSet"
import DzRecord from "./DzRecord"
let width = 300
const columns = [
    { title: "所属设备", dataIndex: "dename", width, render: (dename, record) => `${record.dename ? dename : record.devicename}` },
    {
        title: "微信昵称",
        dataIndex: "devicename", width,
        render: (devicename, record) => `${record.dename ? devicename : record.nickname}`,
    },
    { title: "开启数量", dataIndex: "open", width: 200 },
    { title: "停止数量", dataIndex: "shutDown", width: 200 },
]

const PointRecord = ({ changeStatus, ChangeType, handleEdit, pointSetRec, loading, selectedRowKeys, onSelectChange, pageChangeHandler, current, total, stopPoint, deleteConfirm}) => {
    pointSetRec = pointSetRec.filter((item) => item.devicename)
    // columns[2] = {
    //     title: "当前任务状态",
    //     dataIndex: "is_auto",
    //     width: 200,
    //     render: (is_auto, record) => {
    //         if (record.status) {
    //             return <Switch onChange={ChangeStatus(record)} checkedChildren="开启" unCheckedChildren="关闭" checked={is_auto === "1"} />
    //         } else {
    //             return "未设置"
    //         }
    //     },
    // }
    // columns[3] = {
    //     title: "任务类型",
    //     dataIndex: "duty_type",
    //     width: 200,
    //     render: (duty_type, record) => {
    //         if (duty_type) {
    //             return <Switch onChange={ChangeType(record)} checkedChildren="循环" unCheckedChildren="单次" checked={duty_type === "循环任务"} />
    //         } else {
    //             return "未设置"
    //         }
    //     },
    // }

    columns[8] = {
        title: "操作",
        key: "operation",
        render: (record) => (
            <div style={{display: "flex"}}>
                <PointSet record={record} onOk={handleEdit}>
                    <Button type="primary" className="mar5">设置任务</Button>
                </PointSet>
                <DzRecord record={record}/>
                <Button type="primary" className="mar5" onClick={() => stopPoint(record, 1)}>开启任务</Button>
                <Button type="danger" className="mar5" onClick={() => stopPoint(record, 0)}>停止任务</Button>
                <Popconfirm title="确定要删除所有点赞记录吗？" onConfirm={() => deleteConfirm(record)}>
                    <Button className="mar5" type="danger">删除</Button>
                </Popconfirm>
            </div>
        ),
    }
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,

    }
    const ShowTotalItem = () => (
        <span style={{ marginTop: 5, color: "rgba(0,0,0,0.5)", display: "block" }}>总数{total}条</span>
    )
    const pagination = {
        total,
        defaultPageSize: 20,
        onChange: pageChangeHandler,
        current,
        showTotal: ShowTotalItem,
    }
    const hasSelected = selectedRowKeys && selectedRowKeys.length > 0
    // let heigth = document.getElementById("cont") ? document.getElementById("cont").offsetHeight - 190 : 600
    return (
        <div className="pad10">
            <div className="pad10">
                <PointSet record={selectedRowKeys} onOk={handleEdit}>
                    <Button type="primary" disabled={!hasSelected}>
                        批量设置任务
                    </Button>
                </PointSet>
                <span style={{ marginLeft: 8 }}>{hasSelected ? `已选择 ${selectedRowKeys.length}` : ""}</span>
            </div>
            <div className="pad10">
                <Table dataSource={pointSetRec} pagination={pagination} rowSelection={rowSelection} bordered={true} rowKey="device_wxid" columns={columns} simple loading={loading} />
            </div>
        </div>
    )
}
export default PointRecord
