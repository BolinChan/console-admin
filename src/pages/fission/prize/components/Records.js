import { Table, Popconfirm } from "antd"
const Records = ({ data }) => {
    const pagination = {
        style: { margin: "20px 0" },
        hideOnSinglePage: true,
        pageSize: 20,
        total: 200,
    }
    const columns = [
        { title: "奖品名称", dataIndex: "name", key: "name" },
        { title: "类型", dataIndex: "age", key: "age" },
        { title: "发奖时间", dataIndex: "address", key: "1" },
        { title: "领奖人", dataIndex: "address", key: "2" },
        { title: "操作客服", dataIndex: "address", key: "3" },
        {
            title: "操作",
            key: "operation",
            render: () => <Popconfirm title="确定要删除吗？"><a href="javascript:;">删除</a></Popconfirm>,
        },
    ]
    return (
        <Table columns={columns} dataSource={data} pagination={pagination} />
    )
}
export default Records
