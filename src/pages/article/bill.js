import { connect } from "dva"
import { Table, Button, Popconfirm } from "antd"
import moment from "moment"
import Pay from "./components/Pay"

const columns = [
    { title: "金额", dataIndex: "money" },
    { title: "支付状态", dataIndex: "IsPay", render: (pay) => Number(pay) ? "已支付" : "未支付" },
    { title: "支付时间", dataIndex: "createtime", render: (time) => moment(new Date(time * 1000)).format("YYYY-MM-DD HH:mm:ss") },
    { title: "描述", dataIndex: "Description" },
]
const Bill = ({ billdata, loading, dispatch }) => {
    const deleteConfirm = (payOrderId) => {
        dispatch({
            type: "article/delPayLog",
            payload: { payOrderId },
        })
    }
    const paginationConfig = {
        total: billdata.length,
        defaultPageSize: 20,
        hideOnSinglePage: true,
        showTotal: () => `共 ${billdata.length} 条 `,
    }
    columns[8] = {
        title: "操作",
        key: "operation",
        render: (record) => (
            <div>
                {record.IsPay !== "1" && <Pay record={record}><Button disabled={record.IsPay === "1"} type="danger">去支付</Button></Pay>}
                <Popconfirm title="确定要删除吗？" onConfirm={() => deleteConfirm(record.id)}>
                    <Button className="mar5" type="danger">删除</Button>
                </Popconfirm>
            </div>
        ),
    }
    return (
        <div className="pad20">
            <Table dataSource={billdata} bordered={true} pagination={paginationConfig} rowKey="id" columns={columns} simple loading={loading} />
        </div>
    )
}
function mapStateToProps (state) {
    const { billdata } = state.article
    return {
        billdata,
        loading: state.loading.models.article,
    }
}
export default connect(mapStateToProps)(Bill)
