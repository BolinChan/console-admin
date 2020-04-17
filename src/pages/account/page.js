import { Component } from "react"
import { connect } from "dva"
import {Modal } from "antd"
import AccountTable from "./components/AccountTable"
import AccountFrom from "./components/AccountFrom"
import RedSet from "./components/RedSet"
import SelectMultple from "../components/SelectMultple"
// import PerModel from "./components/PerModel"
class Page extends Component {
    state={recordPermit: {}}
    hanldAdd = (value) => {
        const { partmentList, dispatch } = this.props
        const { realname, accountnum, userinfo, password, nickname } = value
        let parment = value.did ? partmentList.find((f) => f.id === value.did) : ""
        let payload = {
            realname,
            userinfo,
            password,
            nickname,
            accountnum,
            status: parment ? parment.level : "",
            departmen_id: value.did ? value.did : "",
            departmen: value.department ? value.department : "",
        }
        dispatch({
            type: "account/addZAccount",
            payload: { ...payload },
        })
    }
    hanldEdit = async (vaule) => {
        let { dispatch } = this.props
        await dispatch({
            type: "account/editZAccount",
            payload: vaule,
        })
    }
    // 搜索
    handleSubmit = (payload) => {
        this.props.dispatch({
            type: "account/fetchZAccount",
            payload,
        })
    }
    // 开关
    ChangeSwitch = (id) => (status) => {
        this.props.dispatch({
            type: "account/changeStatus",
            payload: { id, status: status ? 0 : 1 },
        })
    }
    // 删除子账号
    deleteConfirm = (vaule) => {
        this.props.dispatch({
            type: "account/deleteZAccount",
            payload: { id: vaule },
        })
    }
    // 修改客服备注
    onSubmit = (record, userinfo) => {
        this.props.dispatch({
            type: "account/editZAccount",
            payload: { realname: record.realname, userinfo, id: record.id },
        })
    }
    showRed=(record) => {
        this.setState({redVisible: true, record, current: 1})
        this.props.dispatch({
            type: "account/BalanceRecord",
            payload: { azid: Number(record.id), page: 1},
        })
    }
    Recharge=async (value) => {
        const {dispatch} = this.props
        const {record} = this.state
        this.setState({loadingButton: true})
        await dispatch({
            type: "account/Maximum",
            payload: { azid: record.id, ...value},
        })
        dispatch({
            type: "account/BalanceRecord",
            payload: { azid: record.id, page: 1},
        })
        this.setState({loadingButton: false})
    }
    onChangePage=(page) => {
        this.props.dispatch({
            type: "account/BalanceRecord",
            payload: { azid: this.state.record.id, page},
        })
        this.setState({current: page})
    }
    // showPermit =(recordPermit) => () => {
    //     this.setState({recordPermit, visible: true})
    // }

    allocate=(kefuid) => {
        this.setState({isAllot: true, kefuid})
    }
    selectChat=(wxid) => {
        this.setState({wxid})
    }
    // 分配微信
    handleSelect=() => {
        const {wxid, kefuid} = this.state
        this.props.dispatch({
            type: "chat/Equipments",
            payload: { kefuid: [kefuid], wxid },
        })
        this.setState({isAllot: false})
    }
    handleCancel=() => {
        this.setState({isAllot: false, wxid: [], recordPermit: [], visible: false, redVisible: false})
    }
    render () {
        const { accountList, loading, permissions, dispatch, partmentList, weChatList } = this.props
        const {record, redVisible, current, loadingButton, isAllot, wxid} = this.state
        record && accountList.find((item) => {
            if (item.id === record.id && item.balance !== record.balance) {record.balance = item.balance}
        })
        return (
            <div className="pad10">
                <div className="pad10">
                    <AccountFrom handleSubmit={this.handleSubmit} hanldAdd={this.hanldAdd} partmentList={partmentList} />
                </div>
                <AccountTable
                    dispatch={dispatch}
                    permissions={permissions}
                    accountList={accountList}
                    loading={loading && !redVisible}
                    ChangeSwitch={this.ChangeSwitch}
                    deleteConfirm={this.deleteConfirm}
                    hanldEdit={this.hanldEdit}
                    onSubmit={this.onSubmit}
                    partmentList={partmentList}
                    showPermit={this.showPermit}
                    showRed={this.showRed}
                    allocate={this.allocate}
                />
                {/* {visible && <PerModel
                list={permissions}
                defaultV={recordPermit.rights_id}
                accountnum={recordPermit.accountnum}
                zid={recordPermit.id} dispatch={dispatch}
                visible={visible}
                handleCancel={this.handleCancel}/>} */}
                {redVisible && <RedSet
                    {...this.props}
                    record={record}
                    visible={redVisible}
                    handleCancel={this.handleCancel}
                    handleSubmit={this.Recharge}
                    current={current}
                    loadingButton={loadingButton}
                    onChangePage={this.onChangePage}/>}
                {isAllot &&
                <Modal
                    visible={isAllot}
                    onCancel={this.handleCancel}
                    onOk={this.handleSelect}
                    title="选择微信"
                >
                    <SelectMultple mode="multiple" data={weChatList} value={wxid} placeholder="请选择微信" onChange={this.selectChat} />
                </Modal>}
            </div>
        )
    }
}
function mapStateToProps (state) {
    const { accountList, permissions, partmentList, total, balanceList } = state.account
    return {
        accountList, partmentList,
        loading: state.loading.models.account,
        permissions,
        total,
        balanceList,
        weChatList: state.vertisy.weChatList,
    }
}
export default connect(mapStateToProps)(Page)
