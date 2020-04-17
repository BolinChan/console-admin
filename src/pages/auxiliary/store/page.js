import { connect } from "dva"
import { Table, Button, Switch } from "antd"
import StoreForm from "./components/StoreForm"
const columns = [{ title: "公众号名称", dataIndex: "name" }, { title: "账号名称", dataIndex: "username" }]
const Page = ({ publicList, loading, dispatch }) => {
    const changeSwitch = (id) => (is_open) => {
        dispatch({
            type: "auxiliary/editPublic",
            payload: { op: "change", id, is_open: is_open ? "1" : "2" },
        })
    }
    const changeReceive = (uid) => (is_open) => {
        dispatch({
            type: "auxiliary/follow",
            payload: { uid, type: is_open ? 2 : 1 },
        })
    }
    const changeAttention = (uid) => (is_open) => {
        dispatch({
            type: "auxiliary/attention",
            payload: { uid, type: is_open ? 2 : 1 },
        })
    }
    const showTotal = () => (
        <span style={{ marginTop: 5, color: "rgba(0,0,0,0.5)", display: "block" }}>总数{publicList && publicList.length}条</span>
    )
    const paginationConfig = {
        total: publicList && publicList.length,
        defaultPageSize: 20, // 每页显示条数
        showTotal,
    }
    columns[6] = {
        title: "领取后跳转关注",
        dataIndex: "receive",
        render: (type, record) => <Switch onChange={changeReceive(record.uniacid)} defaultChecked={type === "2"} checkedChildren="是" unCheckedChildren="否" />,
    }
    columns[7] = {
        title: "是否关注公众号",
        dataIndex: "is_attention",
        render: (type, record) => <Switch onChange={changeAttention(record.uniacid)} defaultChecked={type === "2"} checkedChildren="是" unCheckedChildren="否" />,
    }
    columns[8] = {
        title: "是否开启",
        dataIndex: "is_open",
        render: (is_open, record) => <Switch onChange={changeSwitch(record.id)} defaultChecked={is_open === "1"} checkedChildren="开启" unCheckedChildren="关闭" checked={is_open === "1"} />,
    }
    columns[10] = {
        title: "操作",
        key: "operation",
        render: (record) => (
            <a>
                <StoreForm record={record} dispatch={dispatch} action="update">
                    <Button type="primary">编辑</Button>
                </StoreForm>
            </a>
        ),
    }
    return (
        <div className="pad10">
            <div className="pad10">
                <StoreForm dispatch={dispatch} action="add">
                    <Button type="primary">
                        绑定公众号
                    </Button>
                </StoreForm>
            </div>
            <div className="pad10">
                <Table dataSource={publicList} bordered={true} pagination={paginationConfig} rowKey="id" columns={columns} simple loading={loading} />
            </div>
        </div>
    )
}
function mapStateToProps (state) {
    const { publicList } = state.auxiliary
    return {
        publicList,
        loading: state.loading.models.auxiliary,
    }
}
export default connect(mapStateToProps)(Page)
