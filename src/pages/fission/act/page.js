import { Component } from "react"
import { connect } from "dva"
import { Button, Tabs, Modal } from "antd"
import styles from "../page.css"
import ActList from "./components/ActList"
// import AddPoster from "./components/AddPoster"
import SelectModal from "./components/SelectModal"
import AddPrize from "./components/AddPrize"
import StepModel from "./components/StepModel"
import axios from "axios"
const TabPane = Tabs.TabPane
class Page extends Component {
    state = {
        typeActive: "all",
        searchWord: "",
        prizeList: [],
    }
    customRequest = (rid) => {
        const formData = new FormData()
        formData.append("aid", window.sessionStorage.getItem("i"))
        let token = window.sessionStorage.getItem("token")
        formData.append("token", token)
        if (rid) {
            formData.append("rid", rid)
        }
        axios.post("//wechat.yunbeisoft.com/index_test.php/home/prize/get_prize?access_token=ACCESS_TOKEN", formData).then(({ data: response }) => {
            if (!response.error) {
                this.setState({ prizeList: response.data })
                // let prizeList = this.state.prizeList
                // this.setState({prizeList: [...response.data, ...prizeList]})
            }
        })
    }
    handleCancel = () => {
        this.setState({
            visible: false,
            isShow: false,
            record: undefined,
        })
    }
    showModal = (record, action) => {
        const { dispatch } = this.props
        if (action === "qr") {
            dispatch({
                type: "fission/posterQrcodeList",
                payload: { pid: record && record.id },
            })
            this.setState({
                visible: true,
                record,
            })
            return
        }
        // if (action === "prize") {
        //     this.customRequest(record.id)
        // }
        this.customRequest(record.id)
        if (action === "poster" && record) {
            dispatch({
                type: "fission/fetchDetail",
                payload: { id: record.id },
            })
        }
        this.setState({
            isShow: true,
            record, action, op: "edit",
        })
    }
    showPosterAdd = (op, action) => {
        this.setState({
            isShow: true,
            op, action,
        })
    }
    handlChat = (wxid) => {
        const { record } = this.state
        this.props.dispatch({
            type: "fission/posterQrcodeSet",
            payload: { wxid, pid: record.id },
        })
        this.handleCancel()
    }
    changeType = (e) => {
        this.setState({ typeActive: e })
    }
    handleSearch = (e) => {
        if (!e || e.replace(/\s+/g, "").length <= 0) {
            this.setState({ searchWord: e })
        }
    }
    // 改变活动状态
    onChangeStatue = (id) => (status) => {
        this.props.dispatch({
            type: "fission/posterStatusSet",
            payload: { id, status: status ? "1" : "0" },
        })
    }
    pageChange = (e) => {
        this.props.dispatch({
            type: "fission/fetchPoster",
            payload: { pageNo: e },
        })
    }
    render () {
        const { visible, isShow, record, prizeList, action, op } = this.state
        const { dispatch, posterList, posterTotal, posterDetail, weChatList, loading, posterqrcode, pageNo } = this.props
        let list = prizeList && record && prizeList.find((item) => item.rid === record.id)
        let bodyStyle = {}
        action === "poster" && (bodyStyle = { height: "calc(100% - 150px)", marginTop: 72, paddingTop: 0 })
        const extraContent = (
            <div className={styles.extraContent}>
                <div className={styles.linkList}>
                    <Button type="primary" onClick={() => this.showPosterAdd("create", "poster")}>添加活动</Button>,
                </div>
            </div >
        )
        return (
            <div >
                <div className={styles.dataList}>
                    <Tabs defaultActiveKey="1" size="large" tabBarExtraContent={extraContent} >
                        <TabPane tab="活动列表" key="1">
                            <ActList loading={loading} showModal={this.showModal} data={posterList} pageNo={pageNo} pageChange={this.pageChange}
                                posterDetail={posterDetail} dispatch={dispatch} total={posterTotal} onChangeStatue={this.onChangeStatue} />
                        </TabPane>
                    </Tabs>
                </div>
                {visible && <SelectModal loading={loading} defaultV={posterqrcode} handleOk={this.handlChat} list={weChatList} visible={visible} handleCancel={this.handleCancel}></SelectModal>}
                <Modal destroyOnClose={true} width="60%" bodyStyle={{ height: "calc(100% - 55px)", overflow: "scroll", padding: "20px", ...bodyStyle }}
                    wrapClassName={styles.buddy}
                    visible={isShow} footer={null} onCancel={this.handleCancel}
                    style={{ height: action === "poster" ? "90%" : "60%", padding: 0, top: "5%" }} title={record ? "编辑" : "新增"} >
                    {action === "prize" && <AddPrize loading={loading} record={record} list={list} handleCancel={this.handleCancel}></AddPrize>}
                    {action === "poster" &&
                    <StepModel
                        posterList={posterList}
                        op={op}
                        loading={loading}
                        list={list}
                        record={record && posterDetail}
                        id={record && record.id}
                        dispatch={dispatch}
                        handleCancel={this.handleCancel}/>}
                </Modal>
            </div>
        )
    }
}
function mapStateToProps (state) {
    const { posterList, posterTotal, posterDetail, posterqrcode, pageNo } = state.fission
    return {
        pageNo,
        loading: state.loading.models.fission,
        posterList, posterTotal,
        posterDetail,
        posterqrcode,
        weChatList: state.chat.weChatList,
    }
}
export default connect(mapStateToProps)(Page)

