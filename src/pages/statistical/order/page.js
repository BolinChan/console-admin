import { Component } from "react"
import { connect } from "dva"
import { Table, Input, Select, Cascader, DatePicker, Row, Col } from "antd"
import { area } from "../../../utils/area"
import styles from "../page.css"
import styles1 from "../../redpackage/components/RecordForm.css"
import AddModal from "./components/addModal"
import moment from "moment"
const Search = Input.Search
const Option = Select.Option
const { RangePicker } = DatePicker
const columns = [
    {
        title: "店铺",
        dataIndex: "from_shop_name",
    }, {
        title: "订单编号",
        dataIndex: "ordersn",
    }, {
        title: "订单金额",
        dataIndex: "goodsprice",
    }, {
        title: "交易时间",
        dataIndex: "createtime",
    },
    {
        title: "收货人",
        dataIndex: "arealname",
    },
    {
        title: "旺旺昵称",
        dataIndex: "wang",
    }, {
        title: "收货电话",
        dataIndex: "amobile",
    }, {
        title: "收货地址",
        dataIndex: "area",
        className: styles.tableWidth,
    },
    {
        title: "订单状态",
        dataIndex: "orderstatus",
    }, {
        title: "加好友情况",
        dataIndex: "addfriendstatus",
    }]
const statusLst = [
    { name: "全部订单", value: "" },
    { name: "取消订单", value: -1 },
    { name: "待付款订单", value: 0 },
    { name: "已付款订单", value: 1 },
    { name: "已发货订单", value: 2 },
    { name: "成功订单", value: 3 },
    { name: "退货中订单", value: 4 },
    { name: "退货完成订单", value: 5 },
]
const timeStamp = (t) => {
    let time = new Date(t)
    let year = time.getFullYear()
    let month = time.getMonth() + 1
    let day = time.getDate()
    month = month < 10 ? "0" + month : month
    day = day < 10 ? "0" + day : day
    return year + "-" + month + "-" + day
}
const modelType = "statistical/orderStatistics"
class page extends Component {
    state = { phoneLst: [] }
    paginaChange = (page) => {
        let { dispatch } = this.props
        dispatch({
            type: modelType,
            payload: { page, ...this.state },
        })
    }
    // 搜索订单号
    searchNum = (e) => {
        let { dispatch } = this.props
        dispatch({
            type: modelType,
            payload: { order_sn: e },
        })
        this.setState({ ...this.state, order_sn: e })
    }
    // 搜索电话号码
    searchPhone = (e) => {
        let { dispatch } = this.props
        dispatch({
            type: modelType,
            payload: { ...this.state, phone: e },
        })
        this.setState({ phone: e })
    }
    // 选择店铺
    selStore = (e) => {
        let { dispatch } = this.props
        let shop_id = e ? e : ""
        dispatch({
            type: modelType,
            payload: { ...this.state, shop_id },
        })
        this.setState({ shop_id: e })
    }
    // 选择地区
    areaChange = (e) => {
        let { dispatch } = this.props
        dispatch({
            type: modelType,
            payload: { ...this.state, area: e },
        })
        this.setState({ area: e })
    }
    // 订单状态
    selStatus = (e) => {
        let { dispatch } = this.props
        dispatch({
            type: modelType,
            payload: { ...this.state, status: e },
        })
        this.setState({ status: e })
    }
    // 搜索旺旺
    searchWang = (e) => {
        let { dispatch } = this.props
        dispatch({
            type: modelType,
            payload: { ...this.state, wangwang: e },
        })
        this.setState({ wangwang: e })
    }
    // 最近时间
    selTimeChange = (e) => {
        let array = []
        let { dispatch } = this.props
        e.map((item) => {
            let time = timeStamp(item._d)
            array.push(time)
        })
        dispatch({
            type: modelType,
            payload: { ...this.state, time: array },
        })
        this.setState({ time: array })
    }
    onChangeMay = (type) => (e) => {
        if (type === "min") {
            this.setState({ minprice: e.target.value })
        }
        if (type === "max") {
            this.setState({ maxprice: e.target.value })
        }
    }
    onPressEnter = () => {
        const { maxprice, minprice } = this.state
        if (maxprice && minprice) {
            this.props.dispatch({
                type: modelType,
                payload: this.state,
            })
        }
    }
    onSelectChange = (e) => {
        let array = []
        let { orderLst } = this.props
        if (e.length) {
            e.map((item) => {
                let tmp = orderLst.find((f) => f.id === item)
                if (tmp) {
                    array.push(tmp.amobile)
                }
            })
        }
        this.setState({ phoneLst: array })
    }
    ShowTotalItem = () => {
        let { ordercount } = this.props
        return (
            <span style={{ marginTop: 5, color: "rgba(0,0,0,0.5)", display: "block" }}>总数{ordercount}条</span>
        )
    }
    render () {
        const { orderLst, loading, orderStore, weChatList, dispatch, ordertj, addRule, ordercount } = this.props
        const { phoneLst } = this.state
        const rowSelection = { phoneLst, onChange: this.onSelectChange }
        return (
            <div className={styles.container}>
                <Row className={styles.headerItems} type="flex" justify="space-around" style={{ marginBottom: "20px" }}>
                    <Col span={6} className={styles.headerItem}>
                        <p>我的订单</p>
                        <span>{ordertj.sum || 0}</span>
                    </Col>
                    <Col span={6} className={styles.headerItem}>
                        <p>待付款</p>
                        <span>{ordertj.ordinary || 0}</span>
                    </Col>
                    <Col span={6} className={styles.headerItem}>
                        <p>已发货</p>
                        <span>{ordertj.Ship || 0}</span>
                    </Col>
                    <Col span={6} className={styles.headerItem}>
                        <p>已取消</p>
                        <span>{ordertj.cancel || 0}</span>
                    </Col>
                </Row>
                <Row className={styles.inp} type="flex">
                    <Search placeholder="搜索订单号" className={styles.tableInput} onSearch={this.searchNum} />
                    <Search placeholder="搜索手机号码" className={styles.tableInput} onSearch={this.searchPhone} />
                    <Search placeholder="搜索旺旺昵称" className={styles.tableInput} onSearch={this.searchWang} />
                    <Cascader options={area} placeholder="省市区选择" className={styles.tableInput} onChange={this.areaChange} />
                    <Select placeholder="全部店铺" className={styles.tableInput} onChange={this.selStore}>
                        <Option value=''>全部店铺</Option>
                        {orderStore && orderStore.map((item) => (
                            <Option key={item.id} value={item.id}>{item.name}</Option>
                        ))}
                    </Select>
                    <Select placeholder="订单状态" className={styles.tableInput} onChange={this.selStatus}>
                        {statusLst.map((item) => (
                            <Option value={item.value} key={item.value}>{item.name}</Option>
                        ))}
                    </Select>
                    <RangePicker defaultValue={[moment().subtract(7, "days"), moment().add(0, "days")]} allowClear={false} onChange={this.selTimeChange} className={styles.tableInput}
                        ranges={{
                            "今天": [moment(), moment()],
                            "昨天": [moment().days(moment().days() - 1)
                                .startOf("days"), moment().days(moment().days() - 1)
                                .endOf("days")],
                            "过去一周": [moment().days(moment().days() - 7)
                                .startOf("days"), moment().endOf(moment())],
                            "过去一个月": [moment().days(moment().days() - 30)
                                .startOf("days"), moment().endOf(moment())],
                            "过去半年": [moment().days(moment().days() - 183)
                                .startOf("days"), moment().endOf(moment())],
                        }} />
                    <div className={styles1.moneyInput} style={{ width: 250 }}>
                        <span className={styles1.input1}><Input autoComplete="off" onPressEnter={this.onPressEnter} onChange={this.onChangeMay("min")} placeholder="最小金额" /></span>
                        <span className={styles1.interval}><Input placeholder="~" disabled /></span>
                        <span className={styles1.input2}><Input autoComplete="off" onPressEnter={this.onPressEnter} onChange={this.onChangeMay("max")} placeholder="最大金额" /></span>
                    </div>
                </Row>
                <div className={styles.dataList + " pad10"}>
                    <div className="pad10">
                        <AddModal weChatList={weChatList} addRule={addRule} phoneLst={phoneLst} dispatch={dispatch} disabled={phoneLst.length > 0} />&nbsp;&nbsp;
                        {phoneLst.length > 0 && <span>已选择 {phoneLst.length} 项</span>}
                    </div>
                    <div className="pad10">
                        <Table
                            rowSelection={rowSelection}
                            columns={columns}
                            loading={loading}
                            rowKey="id"
                            dataSource={orderLst}
                            pagination={{
                                total: ordercount,
                                onChange: this.paginaChange,
                                pageSize: 10,
                                showTotal: this.ShowTotalItem }} />
                    </div>
                </div>
            </div>
        )
    }
}
function mapStateToProps (state) {
    const { orderLst, ordercount, orderStore, ordertj } = state.statistical
    return {
        orderStore,
        orderLst,
        ordertj,
        ordercount,
        loading: state.loading.models.statistical,
        weChatList: state.vertisy.weChatList,
        addRule: state.autoAdd.addRule,
    }
}
export default connect(mapStateToProps)(page)
