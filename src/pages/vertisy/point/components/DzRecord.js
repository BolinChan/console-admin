import { Modal, Button, Table, Switch, message, Popconfirm} from "antd"
import { Component } from "react"
import { connect } from "dva"
import request from "../../../../utils/request"
const url = "//wechat.yunbeisoft.com/index_test.php/home/dianzanvs"
class DzRecord extends Component {
    state = { visible: false, current: 1 }
    dzClick = () => {
        this.initLoad(1)
        this.setState({ visible: true })
    }
    onCancel = () => {
        this.setState({ visible: false })
    }
    initLoad = (e) => {
        const { record, dispatch } = this.props
        let payload = { wxid: record.device_wxid, page: e }
        dispatch({ type: "vertisy/getDzRecord", payload })
        this.setState({ current: e })
    }
    changeStatus= (item) => async (is_auto) => {
        const option = {method: "post", url: `${url}/stop_dianzan`, data: JSON.stringify({type: 2, status: is_auto ? 1 : 0, id: item.id})}
        const {data} = await request(option)
        if (data.error) {
            return message.error(data.errmsg)
        }
        item.status = is_auto ? "1" : "0"
        this.setState({item})
    }
    // 编辑
    changeType=(item) => async (checked) => {
        const option = {method: "post", url: `${url}/edit`, data: JSON.stringify({post: 1, duty_type: checked ? 1 : 2, id: item.id})}
        const {data} = await request(option)
        if (data.error) {
            return message.error(data.errmsg)
        }
        message.success("编辑成功")
        item.duty_type = checked ? 1 : 2
        this.setState({item})
    }
    // 删除
    deleteConfirm=async (item) => {
        const option = {method: "post", url: `${url}/del`, data: JSON.stringify({type: 2, id: item.id})}
        const {data} = await request(option)
        if (data.error) {
            return message.error(data.errmsg)
        }
        message.success("删除成功")
        this.initLoad(this.state.current)
    }
    render () {
        const { visible, current } = this.state
        const { dzLst, dzTotal, record, loading } = this.props
        const pagination = {
            total: dzTotal,
            defaultPageSize: 10,
            hideOnSinglePage: true,
            onChange: this.initLoad,
            current,
        }
        const columns = [
            { title: "所属设备", dataIndex: "device_wxid", render: (item) => item === record.device_wxid ? record.devicename : "未知" },
            { title: "操作时间", dataIndex: "add_time" },
            { title: "时间段", dataIndex: "from", render: (from, item) => from + "-" + item.end },
            {
                title: "任务类型",
                dataIndex: "duty_type",
                render: (duty_type, item) => <Switch
                    onChange={this.changeType(item)}
                    checkedChildren="循环"
                    unCheckedChildren="单次"
                    checked={Number(duty_type) === 1} />,
            },
            { title: "执行次数", dataIndex: "executionNumber", align: "center", render: (executionNumber, item) => executionNumber || 0 },
            { title: "已点赞次数", dataIndex: "already_num", align: "center" },
            { title: "点赞数量", dataIndex: "day_num", align: "center" },
            {
                title: "当前任务状态",
                dataIndex: "status",
                width: 200,
                render: (status, item) =>
                    <Switch onChange={this.changeStatus(item)} checkedChildren="开启" unCheckedChildren="关闭" checked={status === "1"} />,
            },
            {
                title: "操作",
                key: "operation",
                render: (item) => (
                    <div>
                        <Popconfirm title="确定要删除吗？" onConfirm={() => this.deleteConfirm(item)}>
                            <Button type="danger">删除</Button>
                        </Popconfirm>
                    </div>
                ),
            },
        ]
        return (
            <div>
                <Button className="mar5" type="primary" onClick={this.dzClick}>点赞记录</Button>
                <Modal visible={visible} footer={null} title="点赞记录" onCancel={this.onCancel} width="1000px">
                    <Table size="small" dataSource={dzLst} pagination={pagination} bordered={true} rowKey="id" columns={columns} simple loading={loading} />
                </Modal>
            </div>
        )
    }
}
function mapStateToProps (state) {
    const { dzLst, dzTotal } = state.vertisy
    return {
        dzLst,
        dzTotal,
        loading: state.loading.models.vertisy,

    }
}
export default connect(mapStateToProps)(DzRecord)
