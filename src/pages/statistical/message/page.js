import { Component } from "react"
import { connect } from "dva"
import { Row, Col, Tabs} from "antd"
import styles from "../page.css"
import MsgTable from "./components/MsgTable"
import MsgChart from "./components/MsgChart"
import SubForm from "./components/SubForm"
import MsgBars from "./components/MsgBars"
const {TabPane} = Tabs
class page extends Component {
    state={current: 1}
    handleSubmit =(value) => {
        this.props.dispatch({type: "statistical/msgStatistics", payload: value})
    }
    render () {
        const { current} = this.state
        const {posterTotal, loading} = this.props
        const {weChatList, accountList, msgT} = this.props
        let total = msgT && msgT.zong
        let dataList = msgT && msgT.everyday || []
        return (
            <div className={styles.container}>
                <SubForm loading={loading} accountList={accountList} weChatList={weChatList} handleSubmit={this.handleSubmit}></SubForm>
                {/* <Row className={styles.headerItems} type="flex" justify="space-around" style={{marginBottom: "20px"}}>
                    <Col className={styles.headerItem}>
                        <p>发送总人数</p>
                        <span>{total && total.fachu_person || 0}</span>
                    </Col>
                    <Col className={styles.headerItem}>
                        <p>接收总人数</p>
                        <span>{total && total.shoudao_person || 0}</span>
                    </Col>
                    <Col className={styles.headerItem}>
                        <p>收发人数比例</p>
                        <span>{total && total.person_bili || 0}</span>
                    </Col>
                    <Col className={styles.headerItem}>
                        <p>发送总消息</p>
                        <span>{total && total.fachu_msg || 0}</span>
                    </Col>
                    <Col className={styles.headerItem}>
                        <p>接收总消息数</p>
                        <span>{total && total.shoudao_msg || 0}</span>
                    </Col>
                    <Col className={styles.headerItem}>
                        <p>收发总消息比例</p>
                        <span>{total && total.msg_bili || 0}</span>
                    </Col>
                </Row>
                <div className={styles.dataList}>
                    <MsgChart data={dataList} />
                </div> */}
                <div className={styles.dataList} style={{marginTop: "20px"}}>
                    <Tabs defaultActiveKey="1" size="large" tabBarStyle={{ marginBottom: "0", padding: "0 20px" }}>
                        <TabPane tab="总统计" key="1">
                            <Row className={styles.headerItems} type="flex" justify="space-around">
                                <Col className={styles.headerItem}>
                                    <p>发送总人数</p>
                                    <span>{total && total.fachu_person || 0}</span>
                                </Col>
                                <Col className={styles.headerItem}>
                                    <p>接收总人数</p>
                                    <span>{total && total.shoudao_person || 0}</span>
                                </Col>
                                <Col className={styles.headerItem}>
                                    <p>收发人数比例</p>
                                    <span>{total && total.person_bili || 0}</span>
                                </Col>
                                <Col className={styles.headerItem}>
                                    <p>发送总消息</p>
                                    <span>{total && total.fachu_msg || 0}</span>
                                </Col>
                                <Col className={styles.headerItem}>
                                    <p>接收总消息数</p>
                                    <span>{total && total.shoudao_msg || 0}</span>
                                </Col>
                                <Col className={styles.headerItem}>
                                    <p>收发总消息比例</p>
                                    <span>{total && total.msg_bili || 0}</span>
                                </Col>
                            </Row>
                            <MsgChart data={dataList} />
                        </TabPane>
                        <TabPane tab="客服消息统计" key="2">
                            <MsgBars data={msgT && msgT.zzong} />
                        </TabPane>
                    </Tabs>
                </div>
                <div className={styles.dataList} style={{marginTop: "20px"}}>
                    <MsgTable total={posterTotal} pageChangeHandler={this.pageChangeHandler} current={current}
                        loading={loading} data={msgT && msgT.zzong} showModal={this.showModal} deleteConfirm={this.deleteConfirm}/>
                </div>
            </div>
        )
    }
}
function mapStateToProps (state) {
    const {msgT } = state.statistical
    const {accountList } = state.account
    const {weChatList} = state.vertisy
    return {
        msgT,
        weChatList,
        accountList,
        loading: state.loading.models.statistical,
    }
}
export default connect(mapStateToProps)(page)
