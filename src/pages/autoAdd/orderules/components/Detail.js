import { Table, Modal } from "antd"
const Record = ({ data, loading, statusLst, visible, onChance, total, pageChangeHandler, current}) => {
    const columns = [
        {title: "执行微信", dataIndex: "nickname"},
        {title: "是否备注", dataIndex: "is_auto_remark", render: (remark) => remark === "1" ? "是" : "否"},
        {title: "金额范围", dataIndex: "fromPrice", render: (form, record) => form ? (form + " - " + record.endPrice) : "未设置"},
        {title: "订单时间范围", dataIndex: "fromOrderTime", render: (form, record) =>
            form ? (form + " - " + record.endOrderTime) : "未设置",
        },
        {title: "订单状态", dataIndex: "orderStatus", render: (orderStatus) => {
            let list = statusLst.find((item) => item.value === orderStatus)
            return list && list.name || "默认所有"
        }},
        {title: "执行次数", dataIndex: "num"},
    ]
    const showTotal = () => (
        <span style={{ marginTop: 5, color: "rgba(0,0,0,0.5)", display: "block" }}>总数{total}条</span>
    )
    const pagination = {
        // hideOnSinglePage: true,
        pageSize: 10,
        total,
        current,
        showTotal,
        onChance: pageChangeHandler,
    }
    return (
        <Modal
            width="50%"
            wrapClassName="wrapClass"
            bodyStyle={{ height: "calc(100% - 55px)", overflow: "auto"}}
            style={{ height: "80%", top: "10%", minWidth: 720 }}
            title="执行记录"
            visible={visible}
            footer={null}
            onCancel={onChance}
        >
            <Table dataSource={data} loading={loading} rowKey="id" bordered={true} columns={columns} pagination={pagination}></Table>
        </Modal>
    )
}

export default Record
