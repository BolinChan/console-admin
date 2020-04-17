import { connect } from "dva"
import { Table } from "antd"
const Page = ({ orderList, loading }) => {
    const columns = [
        { title: "电话", dataIndex: "phone" },
        { title: "订单号", dataIndex: "order_num" },
        { title: "订单金额", dataIndex: "order_price" },
        { title: "时间", dataIndex: "order_time" },
    ]
    const paginationConfig = {
        total: 1, // 数据总数
        defaultPageSize: 20, // 每页显示条数
        hideOnSinglePage: true, // 只有一页时隐藏
        showTotal: () => `共 ${1} 条 `,
    }
    return (
        <div className="pad10">
            <div className="pad10">
                <Table dataSource={orderList} bordered={true} pagination={paginationConfig} rowKey="id" columns={columns} simple loading={loading} />
            </div>
        </div>
    )
}
function mapStateToProps (state) {
    const { orderList } = state.auxiliary
    return {
        orderList,
        loading: state.loading.models.auxiliary,
    }
}
export default connect(mapStateToProps)(Page)
