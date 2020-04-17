import {Table} from "antd"
// import styles from "../../page.css"
const MarketTable = ({data, loading}) => {
    const columns = [
        // { title: "微信", dataIndex: "name" },
        { title: "客服账号", dataIndex: "zidAccount" },
        { title: "累计付款订单", dataIndex: "num" },
        { title: "累计付款金额", dataIndex: "sum" },
        { title: "累计付款客户", dataIndex: "person_num" },
        { title: "平均客单价", dataIndex: "pingjun" },
        { title: "购买率（%）", dataIndex: "goumailv" },
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
            <Table dataSource={data} pagination={paginationConfig} rowKey="zid" columns={columns} loading={loading} simple />
        </div>
    )
}
export default MarketTable
