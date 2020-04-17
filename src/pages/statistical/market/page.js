import { Component } from "react"
import { connect } from "dva"
import { Row, Col, Tabs, DatePicker, Select, Button, message} from "antd"
import styles from "../page.css"
import MarketTable from "./components/MarketTable"
import MarketChart from "./components/MarketChart"
import moment from "moment"
import axios from "axios"
const { RangePicker } = DatePicker
const TabPane = Tabs.TabPane
const {Option} = Select
class page extends Component {
    state={dcloading: false, chatLoading: false}
    selectDate=async (sendtime) => {
        let starttime = moment(sendtime[0]._d).format("YYYY-MM-DD")
        let endtime = moment(sendtime[1]._d).format("YYYY-MM-DD ")
        this.props.dispatch({
            type: "statistical/marketPlan",
            payload: {starttime, endtime},
        })
        await this.setState({starttime, endtime})
        this.handleChange()
    }
    handleChange =async (e, list) => {
        const {starttime, endtime} = this.state
        let zid = list && list.map((item) => item.props.vaule)
        if (!zid || zid.length === 0) {
            zid = this.props.accountList.map((item) => item.id)
        }
        await this.props.dispatch({
            type: "statistical/marketZTj",
            payload: {zid, starttime, endtime},
        })
        this.setState({zid})
    }
    dcData=() => {
        const {auth} = this.props
        const {starttime, endtime, zid} = this.state
        this.setState({ dcloading: true })
        let data = JSON.stringify({
            token: window.sessionStorage.getItem("token"),
            aid: auth && auth.id || window.sessionStorage.getItem("i"),
            uniacid: window.sessionStorage.getItem("uniacid"),
            excel: 1,
            zid,
            starttime,
            endtime,
        })
        axios.post("//wxx.jutaobao.cc/yunbei_send_redpack/qr_code.php?code=ztongji", data).then(({ data: response }) => {
            this.setState({ dcloading: false })
            if (response.error) {
                message.error("导出失败，请稍后重试！")
            }
            const a = document.createElement("a")
            a.href = response.file
            a.download = "营销数据.xls"
            a.click()
        })
    }
    render () {
        const { dcloading} = this.state
        const {marketChart, loading, marketSum, marketList, accountList} = this.props
        const redSearch =
        <div>
            <Select mode="multiple" placeholder="请选择客服账号" onChange={this.handleChange} style={{minWidth: 280}} className="pad10">
                {accountList && accountList.map((item) => <Option key={item.realname + item.accountnum} vaule={item.id}>{item.realname}（{item.accountnum}）</Option>)}
            </Select>
            <Button disabled={!accountList} loading={dcloading} onClick={this.dcData} type="primary">导出数据</Button>
        </div>

        const timeSearch = <RangePicker
            className="pad10"
            style={{width: 280}}
            defaultValue={[moment().subtract("days", 7), moment()]}
            format="YYYY-MM-DD"
            allowClear={false}
            onChange={this.selectDate}
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
            }}/>
        return (
            <div className={styles.container}>
                <Row className={styles.headerItems} type="flex" justify="space-around" style={{marginBottom: "20px"}}>
                    <Col span={4} className={styles.headerItem}>
                        <p>累计微信付款订单</p>
                        <span>{marketSum.num || 0}</span> 笔
                    </Col>
                    <Col span={4} className={styles.headerItem}>
                        <p>累计微信付款金额</p>
                        <span>{marketSum.sum || 0}</span> 元
                    </Col>
                    <Col span={4} className={styles.headerItem}>
                        <p>累计微信付款客户</p>
                        <span>{marketSum.goumailv || 0}</span> 人
                    </Col>
                    <Col span={4} className={styles.headerItem}>
                        <p>微信平均客单价</p>
                        <span>{marketSum.pingjun || 0}</span> 元/笔
                    </Col>
                    <Col span={4} className={styles.headerItem}>
                        <p>微信客户购买率</p>
                        <span>{marketSum.goumailv || 0}</span> %
                    </Col>
                </Row>
                <div className={styles.dataList}>
                    <Tabs defaultActiveKey="1" size="large" tabBarStyle={{ marginBottom: "0", padding: "0 20px" }} tabBarExtraContent={timeSearch}>
                        <TabPane tab="营销统计" key="1">
                            <MarketChart data={marketChart} loading={loading}/>
                            {/* <Spin spinning={chatLoading} className={styles.spinwz}></Spin> */}
                        </TabPane>
                    </Tabs>
                </div>
                <div className={styles.dataList} style={{marginTop: "20px"}}>
                    <Tabs defaultActiveKey="1" size="large" tabBarStyle={{ marginBottom: "0", padding: "0 20px" }} tabBarExtraContent={redSearch}>
                        <TabPane tab="微信营销计划" key="1" >
                            <MarketTable loading={loading} data={marketList} />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}
function mapStateToProps (state) {
    const {marketChart, marketSum, accountList, marketList } = state.statistical
    return {
        marketChart,
        marketSum,
        loading: state.loading.models.statistical,
        accountList,
        marketList,
    }
}
export default connect(mapStateToProps)(page)
