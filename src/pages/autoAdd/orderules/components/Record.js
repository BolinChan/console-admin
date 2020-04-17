import { Table, Popconfirm, Button } from "antd"
const Record = ({ data, deleteConfirm, loading, statusLst, showModal, showDetail }) => {
    const columns = [
        { title: "执行微信", dataIndex: "nickname" },
        // {title: "是否自动回复", dataIndex: "autoSend", render: (autoSend) => autoSend ? "是" : "否"},
        // {title: "回复内容", dataIndex: "autoSendMsg", render: (text) => text || "未设置"},
        // {title: "开启验证", dataIndex: "ischack", render: (ischack) => ischack ? "开启" : "关闭"},
        // {title: "验证信息", dataIndex: "chackMsg", render: (chackMsg) => chackMsg || "未设置"},
        // {title: "加好友数量", dataIndex: "addUserNum"},
        // {title: "加好友时间", dataIndex: "addUserTime"},
        // {title: "执行区间", dataIndex: "executeTime"},

        // {title: "开启/关闭加好友", dataIndex: "isDo", render: (isDo, record) => <Switch checkedChildren="开启" unCheckedChildren="关闭" onChange={onChangeStatue(record)} checked={isDo === "1"}/>},
        { title: "是否备注", dataIndex: "is_auto_remark", render: (remark) => remark === "1" ? "是" : "否" },
        { title: "金额范围", dataIndex: "fromPrice", render: (form, record) => form ? (form + " - " + record.endPrice) : "未设置" },
        {
            title: "订单时间范围", dataIndex: "fromOrderTime", render: (form, record) =>
                form ? (form + " - " + record.endOrderTime) : "未设置",
        },
        {
            title: "订单状态", dataIndex: "orderStatus", render: (orderStatus) => {
                let list = statusLst.find((item) => item.value === orderStatus)
                return list && list.name || "默认所有"
            },
        },
        { title: "执行次数", dataIndex: "num" },
        {
            title: "操作", key: "option", render: (item) => (<div>
                {/* <Button className="mar5" type="primary" onClick={() => showDetail && showDetail(item)}>执行记录</Button> */}
                <Button className="mar5" type="primary" onClick={() => showModal("setOrderRule", item)}>编辑</Button>
                <Popconfirm title="确定要删除吗？" arrowPointAtCenter={true} placement="topRight" onConfirm={() => deleteConfirm(item.id)}>
                    <Button className="mar5" type="danger">删除</Button>
                </Popconfirm >
            </div>),
        },
    ]
    const showTotal = () => (
        <span style={{ marginTop: 5, color: "rgba(0,0,0,0.5)", display: "block" }}>总数{data && data.length}条</span>
    )
    const pagination = {
        pageSize: 10,
        showTotal,
        total: data && data.length,

    }
    return (
        <div className="pad10">
            <Table dataSource={data} loading={loading} rowKey="id" bordered={true} columns={columns} pagination={pagination}></Table>
        </div>
    )
}

export default Record
