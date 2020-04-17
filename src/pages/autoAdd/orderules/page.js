import {Component} from "react"
import {connect} from "dva"
import { Button, Row} from "antd"
import AddRules from "./components/AddRules"
import Record from "./components/Record"
import Detail from "./components/Detail"
import SearchInput from "../../components/SearchInput"
const statusLst = [
    { name: "全部订单", value: "" },
    { name: "取消订单", value: "-1" },
    { name: "待付款订单", value: "0" },
    { name: "已付款订单", value: "1" },
    { name: "已发货订单", value: "2" },
    { name: "成功订单", value: "3" },
    { name: "退货中订单", value: "4" },
    { name: "退货完成订单", value: "5" },
]
class Page extends Component {
    state={visible: false, page: 1, acceptList: []}
    showModal=(action, record) => {
        if (!record) {
            record = {addUserTime: ["100", "200"], addUserNum: 10}
        }
        this.setState({record, visible: true, action})
    }
    // showDetail=(record) => {
    //     this.setState({detailVisible: true, record, page: 1})
    //     this.props.dispatch({
    //         type: "autoAdd/fetchOrderDetail",
    //         payload: {id: record.id},
    //     })
    // }
    handleCancel=() => {
        this.setState({visible: false, detailVisible: false})
    }
    pageChangeHandler=(page) => {
        this.props.dispatch({
            type: "autoAdd/fetchOrderDetail",
            payload: {id: this.state.record.id, page},
        })
        this.setState({ page})
    }
    // 删除
    deleteConfirm= (id) => {
        this.props.dispatch({
            type: "autoAdd/delOrderRule",
            payload: {id},
        })
    }
    onSearch=(value) => {
        this.props.dispatch({type: "autoAdd/fetchOrderRule", payload: value && {deviceId: [value]}})
    }
    onChangePublic=(list) => {
        const {store} = this.props
        let filStore = []
        list && list.map((uniacid) => {
            const _s = store.filter((mess) => mess.uniacid === uniacid)
            filStore.push(..._s)
        })
        this.setState({filStore})
    }
    // onChangeStatue=(item) => async (status) => {
    //     this.props.dispatch({
    //         type: "autoAdd/setOrderRule",
    //         payload: {deviceIds: [item.deviceIds], isDo: status ? 1 : 0 },
    //     })
    // }
    // 添加、删除回复内容
    changeContent = (acceptList) => {
        this.setState({ acceptList })
    }
    render () {
        let {orderules, detailTotal, orderDetail, loading, weChatList, store} = this.props
        const {page, visible, record, action, detailVisible, filStore, acceptList} = this.state
        if (filStore && filStore.length > 0) {
            store = filStore
        }
        return (
            <div className="pad10">
                <Row className="pad10" type="flex" justify="space-between">
                    <Button type="primary" onClick={() => this.showModal("setOrderRule")}>设置任务</Button>
                    <SearchInput style={{width: 300}} data={weChatList} onChange={this.onSearch}></SearchInput>
                </Row>
                <Record
                    data={orderules}
                    loading={!detailVisible && loading}
                    deleteConfirm={this.deleteConfirm}
                    showModal={this.showModal}
                    onChangeStatue={this.onChangeStatue}
                    // showDetail={this.showDetail}
                    statusLst={statusLst}
                />

                {visible &&
                <AddRules
                    {...this.props}
                    store={store}
                    handleCancel={this.handleCancel}
                    record={record}
                    visible={visible}
                    action={action}
                    statusLst={statusLst}
                    onChangePublic={this.onChangePublic}
                    changeContent={this.changeContent}
                    acceptList={acceptList}
                />}

                {detailVisible &&
                <Detail
                    visible={detailVisible}
                    onChance={this.handleCancel}
                    data={orderDetail}
                    total={detailTotal}
                    loading={loading}
                    current={page}
                    pageChangeHandler={this.pageChangeHandler}
                />}
            </div>
        )
    }
}
function mapStateToProps (state) {
    const { orderules, detailTotal, orderDetail, store } = state.autoAdd
    return {
        weChatList: state.vertisy.weChatList,
        loading: state.loading.models.autoAdd,
        publicList: state.auxiliary.publicList,
        orderules,
        detailTotal,
        orderDetail,
        store,
    }
}
export default connect(mapStateToProps)(Page)
