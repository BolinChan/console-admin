
import { Component } from "react"
import { connect } from "dva"
import { message, Row, Col, Card, DatePicker } from "antd"
import RecordForm from "./components/RecordForm"
import TableList from "./components/TableList"
import Detail from "./components/Detail"
import axios from "axios"
import styles from "../../statistical/page.css"
import moment from "moment"
const { RangePicker } = DatePicker

class Page extends Component {
    state = { current: 1, currentDetail: 1, wxRecord: [] }
    // 选择页数
    pageChangeHandler = async (page, pageSize) => {
        this.setState({ loadingTable: true })
        await this.props.dispatch({ type: "autoAdd/PhoneRecord", payload: { ...this.state.values, page } })
        this.setState({ current: page, pageSize, loadingTable: false })
    }
    ChangeSwitch = (id) => (is_stop) => {
        this.props.dispatch({ type: "autoAdd/stopAutoAdd", payload: { is_stop: is_stop ? "0" : "1", id } })
    }
    onSubmit = async (payload) => {
        this.setState({ loadingTable: true })
        await this.props.dispatch({ type: "autoAdd/PhoneRecord", payload })
        this.setState({ current: 1, values: payload, loadingTable: false })
    }
    dc = () => {
        this.setState({ dcloading: true })
        const { auth } = this.props
        let data = JSON.stringify({ aid: auth && auth.id || window.sessionStorage.getItem("i"), name: "未执行号码", token: window.sessionStorage.getItem("token") })
        axios.post("//wechat.yunbeisoft.com/index_test.php/home/tem/userdownload_excel", data).then(({ data: response }) => {
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
    showModel = (record) => {
        this.setState({
            visible: true,
            record,
        })
        let { dispatch } = this.props
        dispatch({
            type: "autoAdd/detailRecord",
            payload: { page: 1, id: record.id },
        })
    }
    pageChangeDetail = (page, pageSize) => {
        this.setState({ currentDetail: page })
        let { dispatch } = this.props
        dispatch({
            type: "autoAdd/detailRecord",
            payload: { page, id: this.state.record.id },
        })
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
            currentDetail: 1,
        })
    }
    handleChange = async (e) => {
        this.setState({
            device_wxnick: e,
        })
        let nickname = await this.props.dispatch({
            type: "autoAdd/fetchUserName",
            payload: { nickname: e },
        })

        this.setState({
            wxRecord: nickname,
        })
    }
    handleSel = (e) => {
        this.setState({
            device_wxnick: e,
        })
    }
    selectDate = async (sendtime) => {
        const { dispatch } = this.props
        let from = moment(sendtime[0]._d).format("YYYY-MM-DD")
        let end = moment(sendtime[1]._d).format("YYYY-MM-DD ")
        this.setState({ istj: true })
        await dispatch({
            type: "autoAdd/addFriendTj",
            payload: { end, from },
        })
        this.setState({ istj: false })
    }
    render () {
        let { weChatList, autoList, dispatch, atuoTotal, detailList, detaiTotal, importMobile, loading } = this.props
        let { current, visible, record, currentDetail, wxRecord, loadingTable, device_wxnick, dcloading } = this.state

        const momentSearch = <RangePicker
            style={{ width: 280 }}
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
            }}
            defaultValue={[moment().subtract("days", 30), moment()]}
            format="YYYY-MM-DD"
            allowClear={false}
            onChange={this.selectDate} />

        if (loading && (!autoList || autoList.length === 0)) {
            loadingTable = true
        }
        return (
            <div>
                <Card
                    style={{ borderBottom: "20px solid #f0f2f5" }}
                    title="加好友统计" extra={momentSearch} bordered={false}
                >
                    <Row type="flex" justify="space-around" >
                        <Col className={styles.headerItem}>
                            <p>总导入数量</p>
                            <span>{importMobile && importMobile.all || 0}</span>
                        </Col>
                        <Col className={styles.headerItem}>
                            <p>总执行数量</p>
                            <span>{importMobile && importMobile.zhi || 0}</span>
                        </Col>
                        <Col className={styles.headerItem}>
                            <p>添加好友数量</p>
                            <span>{importMobile && importMobile.success || 0}</span>
                        </Col>
                        <Col className={styles.headerItem}>
                            <p>未执行数量</p>
                            <span>{importMobile && importMobile.wei || 0}</span>
                        </Col>
                    </Row>
                </Card>
                <div className="pad10">
                    <div className="pad10">
                        <RecordForm
                            dispatch={dispatch}
                            onSubmit={this.onSubmit}
                            handleSel={this.handleSel}
                            handleChange={this.handleChange}
                            wxRecord={wxRecord}
                            device_wxnick={device_wxnick}
                            dc={this.dc}
                            dcloading={dcloading} />
                    </div>
                    <div className="pad10">
                        <TableList
                            autoList={autoList}
                            current={current}
                            pageChangeHandler={this.pageChangeHandler}
                            ChangeSwitch={this.ChangeSwitch}
                            dispatch={dispatch}
                            loading={loadingTable}
                            atuoTotal={atuoTotal}
                            weChatList={weChatList}
                            detailList={detailList}
                            detaiTotal={detaiTotal}
                            showModel={this.showModel}
                        />
                    </div>
                    {visible && <Detail record={record} current={currentDetail} pageChangeDetail={this.pageChangeDetail} visible={visible} {...this.props} handleCancel={this.handleCancel} />}
                </div>
            </div>

        )
    }
}
function mapStateToProps (state) {
    let { autoList, atuoTotal, detailList, detaiTotal, importMobile } = state.autoAdd
    return {
        weChatList: state.vertisy.weChatList,
        autoList,
        atuoTotal,
        detailList,
        detaiTotal,
        importMobile,
        loading: state.loading.models.autoAdd,
    }
}
export default connect(mapStateToProps)(Page)
