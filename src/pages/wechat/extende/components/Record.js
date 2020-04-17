import { Table, Popconfirm, Button} from "antd"
const Record = ({ data, deleteConfirm, total, loading, TyList, pageChangeHandler, current, onMouseEnter, onMove, onChangeStatue}) => {
    const columns = [{title: "状态", dataIndex: "status", width: 80, render: (status) => status === "1" ? "可用" : "禁用",
    },
    {title: "字段名称", dataIndex: "name"},
    {title: "字段类型", dataIndex: "type", width: 120, render: (type) => {
        let list = TyList.find((item) => item.id === type)
        return list.value
    }},
    {title: "提示文案", dataIndex: "question"},
    {title: "字段内容", dataIndex: "field_value"},
    {title: "创建时间", dataIndex: "createtime", width: 170 },
    {title: "操作", key: "option", render: (item) => (<div>
        {data && data.length > 0 && <span>
            {(item.id !== data[0].id) && <Button type="primary" className="mar5" onClick={() => onMove(item, "up")}>上移</Button>}
            {(item.id !== data[data.length - 1].id) && <Button type="primary" className="mar5" onClick={() => onMove(item, "down")}>下移</Button>}
        </span>}

        <Popconfirm title="确定要删除吗？" arrowPointAtCenter={true} placement="topRight" onConfirm={() => deleteConfirm(item.id)}><Button type="danger" className="mar5">删除</Button></Popconfirm >
    </div>)},
    ]
    const showTotal = () => (
        <span style={{ marginTop: 5, color: "rgba(0,0,0,0.5)", display: "block" }}>总数{total}条</span>
    )
    const pagination = {
        // hideOnSinglePage: true,
        pageSize: 10,
        total,
        showTotal,
        onChange: pageChangeHandler, // 点击分页
        current,
    }
    return (
        <div className="pad10">
            <Table dataSource={data} loading={loading} rowKey="id" bordered={true} columns={columns} pagination={pagination}
                onRow={(record) => ({
                    onMouseDown: () => onMove(record),
                    onMouseEnter: onMouseEnter, // 鼠标移入行
                })}></Table>
        </div>
    )
}

export default Record
