import { Row, Col, Tabs, Button, message, notification } from "antd"
import { connect } from "dva"
import styles from "./page.css"
import Bars from "./components/Bars"
import Chart from "./components/Chart"
import MiniBar from "./components/MiniBar"
import Pies from "./components/Pies"
import axios from "axios"
import { Component } from "react"
import moment from "moment"
const TabPane = Tabs.TabPane
class Home extends Component {
    state = { dcloading: false, rateLoading: false, current: 1 }
    dc = () => {
        this.setState({ dcloading: true })
        let data = JSON.stringify({token: window.sessionStorage.getItem("token"), aid: this.props.auth && this.props.auth.id || window.sessionStorage.getItem("i"), name: "设备数据"})
        axios.post("//wechat.yunbeisoft.com/index_test.php/home/tem/download_excel", data).then(({ data: response }) => {
            this.setState({ dcloading: false })
            if (response.error) {
                message.error("导出失败，请稍后重试！")
            }
            const a = document.createElement("a")
            a.href = response.address
            a.download = "FansData"
            a.click()
        })
    }
    componentDidMount () {
        let height = document.getElementById("mini") && document.getElementById("mini").offsetHeight
        this.setState({height})
    }
    // 加好友数据
    executionNumber = () => {
        const {auth} = this.props
        let {time} = this.state
        this.setState({ loadingfriend: true })
        if (!time) {
            time = [moment().subtract("days", 10)
                .format("YYYY-MM-DD"), moment().format("YYYY-MM-DD")]
        }
        let data = JSON.stringify({aid: auth && auth.id || window.sessionStorage.getItem("i"), time, token: window.sessionStorage.getItem("token")})
        axios.post("//wechat.yunbeisoft.com/index_test.php/home/users/executionNumber", data).then(({ data: response }) => {
            this.setState({ loadingfriend: false })
            if (response.error) {
                message.error("导出失败，请稍后重试！")
            }
            const a = document.createElement("a")
            a.href = response.address
            a.download = "FansData"
            a.click()
        })
    }
    selectDate=(sendtime) => {
        const {dispatch} = this.props
        let start = moment(sendtime[0]._d).format("YYYY-MM-DD")
        let end = moment(sendtime[1]._d).format("YYYY-MM-DD ")
        let isTrue = (new Date(end).getTime() - 29 * 24 * 60 * 60 * 1000) > new Date(start).getTime()
        if (isTrue) {
            notification.warning({
                message: "提示",
                description: "最多只能显示30天的加好友情况，选择超过30天时默认显示最后30天",
                duration: 6,
            })
            // message.info("最多只能显示30天的加好友情况，选择超过30天时默认显示最后30天")
            let date = new Date(end).getTime() - 29 * 24 * 60 * 60 * 1000
            start = moment(new Date(date)).format("YYYY-MM-DD")
        }
        let time = [start, end]
        this.setState({time})
        dispatch({type: "login/friendStatistics", payload: {time}})
        this.onPageChange(1, time)
    }
    // 同步好友
    flushFun = async (WeChatId) => {
        const error = this.props.dispatch({
            type: "chat/updateContactList",
            payload: {WeChatId: [WeChatId]},
        })
        if (!error) {
            this.onChangePage(this.state.current)
            this.setState({WeChatId})
        }
    }
    // 好友通过率分页显示
    onPageChange=async (page, time) => {
        this.setState({page, rateLoading: true})
        let payload = {page}
        time.start && (payload.time = time)
        await this.props.dispatch({type: "login/friendPassRate", payload })
        this.setState({rateLoading: false})
    }
    // 排行分页
    onChangePage=async (page) => {
        await this.props.dispatch({type: "login/friendRank", payload: {page} })
        this.setState({current: page})
    }
    render () {
        let { friendNum, addFriend, friendRank, circleNum, friendrate, weChatList, redRank, loading, dispatch, minidata, update, updateLoading, rateCount, ranktotal} = this.props
        const {WeChatId, page, rateLoading, dcloading, current} = this.state
        const dcBtn = (
            <div style={{ lineHeight: "43px"}}>
                <Button type="primary" onClick={this.dc} loading={dcloading}>导出设备数据</Button>
            </div>
        )
        const BarsList = {
            WeChatId, update, friendRank, ranktotal, current, updateLoading, flushFun: this.flushFun, onChangePage: this.onChangePage}
        return (
            <div className={styles.container}>
                <div className={styles.fansTab}>
                    <Tabs defaultActiveKey="1" size="large" tabBarExtraContent={dcBtn}>
                        <TabPane tab="好友数量" key="1">
                            <Bars {...BarsList} data={friendNum} />
                        </TabPane>
                        <TabPane tab="新增数量" key="2">
                            <Bars {...BarsList} data={addFriend} />
                        </TabPane>
                        {/* <TabPane tab="好友分布" key="3">
                            好友分布
                        </TabPane> */}
                    </Tabs>
                </div>
                <Row style={{ marginLeft: "-8px", marginRight: "-8px"}}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={12} >
                        <div className={styles.tab} style={{marginRight: "8px", marginLeft: "8px", height: document.getElementById("mini") && document.getElementById("mini").offsetHeight}}>
                            <Pies data={redRank} weChatList={weChatList} dispatch={dispatch} />
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={12} >
                        <div className={styles.tab} id="mini" style={{ marginRight: "8px", marginLeft: "8px"}}>
                            <MiniBar
                                total={rateCount}
                                onPageChange={this.onPageChange}
                                current={page}
                                executionNumber={this.executionNumber}
                                data={friendrate}
                                minidata={minidata}
                                loadingfriend={this.state.loadingfriend}
                                loading={rateLoading || loading && !friendrate}
                                weChatList={weChatList}
                                selectDate={this.selectDate}/>
                        </div>
                    </Col>
                </Row>
                <div className={styles.tab} style={{marginBottom: "0"}}>
                    <Chart data={circleNum} weChatList={weChatList} />
                </div>
            </div>
        )
    }
}
function mapStateToProps (state) {
    const { friendRank, addFriend, friendNum, circleNum, redRank, auth, friendrate, minidata, rateCount, ranktotal } = state.login
    return {
        friendRank, ranktotal, addFriend, friendNum, circleNum, redRank, auth, friendrate, rateCount, minidata,
        weChatList: state.vertisy.weChatList,
        loading: state.loading.models.login,
        update: state.chat.update,
        updateLoading: state.loading.models.chat,
    }
}
export default connect(mapStateToProps)(Home)
