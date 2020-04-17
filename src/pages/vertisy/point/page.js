import { Component } from "react"
import { connect } from "dva"
import {message} from "antd"
import PointRecord from "./components/PointSetRecord"
import request from "../../../utils/request"
const url = "//wechat.yunbeisoft.com/index_test.php/home/dianzanvs"
class Page extends Component {
    state = {
        selectedRowKeys: [],
    }
    // 确认保存点赞设置
    handleEdit = (values) => {
        this.setState({
            selectedRowKeys: [],
        })
        this.props.dispatch({
            type: "vertisy/setPoint",
            payload: { ...values },
        })
    }
    // 选择table项
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys })
    }
    ChangeType = (item) => (duty_type) => {
        this.props.dispatch({
            type: "vertisy/pointType",
            payload: { duty_type: duty_type ? "1" : "2", id: item.id },
        })
    }
    // 选择分页
    pageChangeHandler = (page) => {
        this.props.dispatch({
            type: "vertisy/pointSetRecord",
            payload: { page },
        })
        this.setState({ current: page })
    }
    stopPoint=async (item, status) => {
        const option = {method: "post", url: `${url}/stop_dianzan`, data: JSON.stringify({type: 1, status, wxid: item.wxid})}
        const {data} = await request(option)
        if (data.error) {
            return message.error(data.errmsg)
        }
        if (status) {
            item.open = Number(item.open) + Number(item.shutDown)
            item.shutDown = 0
        } else {
            item.shutDown = Number(item.open) + Number(item.shutDown)
            item.open = 0
        }
        message.success(status ? "已开启任务" : "已停止任务")
        this.setState({item})
    }
    // 删除任务设置
    deleteConfirm=async (item) => {
        const option = {method: "post", url: `${url}/del`, data: JSON.stringify({type: 1, wxid: item.wxid})}
        const {data} = await request(option)
        if (data.error) {
            return message.error(data.errmsg)
        }
        message.success("删除成功")
        this.pageChangeHandler(this.state.current)
    }
    render () {
        const { pointSetRec, loading, pointCount } = this.props
        const { selectedRowKeys, current } = this.state
        return (
            <div>
                <PointRecord
                    pointSetRec={pointSetRec}
                    loading={loading}
                    current={current}
                    total={pointCount}
                    onSelectChange={this.onSelectChange}
                    start={this.start}
                    selectedRowKeys={selectedRowKeys}
                    handleEdit={this.handleEdit}
                    deleteConfirm={this.deleteConfirm}
                    ChangeType={this.ChangeType}
                    pageChangeHandler={this.pageChangeHandler}
                    stopPoint={this.stopPoint}
                />
            </div>
        )
    }
}
function mapStateToProps (state) {
    const { pointSetRec, pointCount } = state.vertisy
    return {
        loading: state.loading.models.vertisy,
        pointSetRec,
        pointCount,
    }
}
export default connect(mapStateToProps)(Page)
