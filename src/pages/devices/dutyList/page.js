import { Component } from "react"
import { connect } from "dva"
import DutyLeft from "./components/dutyLeft"
import DutyRight from "./components/dutyRight"
import { expDutyLst } from "../../../utils/helper"
class DustList extends Component {
    state = {
        zid: "",
        devid: "",
        status: "",
        type: "",
        visible: false,
        previewImg: "",
    };
    // 设备选择
    DeviceChange = (e) => {
        document.getElementById("dutyRight").scrollTop = 0
        const { pageNo } = this.props
        const { zid } = this.state
        this.props.dispatch({
            type: "devices/fetchDutyLst",
            payload: { pageNo, zid, devid: e },
        })
        this.setState({ devid: e, status: "", type: "" })
    };
    // 账号选择
    AccountChange = (e) => {
        document.getElementById("dutyRight").scrollTop = 0
        this.props.dispatch({
            type: "devices/dutyDevices",
            payload: { userid: e },
        })
        this.setState({ zid: e, status: "", type: "", devid: "" })
    };
    // 执行情况
    TopChange = async (e) => {
        await this.setState({ status: e })
        document.getElementById("dutyRight").scrollTop = 0
        let payload = payloadDatum(this, false, "")
        this.props.dispatch({
            type: "devices/fetchDutyLst",
            payload: { ...payload },
        })
    };
    // 功能选择
    FunChange = async (e) => {
        await this.setState({ type: e })
        document.getElementById("dutyRight").scrollTop = 0
        let payload = payloadDatum(this, false, "")
        this.props.dispatch({
            type: "devices/fetchDutyLst",
            payload: { ...payload },
        })
    };
    // 分页
    PaginaChange = (e) => {
        document.getElementById("dutyRight").scrollTop = 0
        const { dispatch } = this.props
        let payload = payloadDatum(this, false, "", e)
        dispatch({
            type: "devices/fetchDutyLst",
            payload: { ...payload },
        })
    };
    handleOk = (e) => {
        this.setState({ visible: true, previewImg: e })
    };
    handleCancel = (e) => {
        this.setState({ visible: false })
    };
    Delete = (e) => {
        const { dispatch } = this.props

        dispatch({
            type: "devices/dutyDelete",
            payload: payloadDatum(this, true, e),
        })
    };
    Again = (e) => {
        const { dispatch } = this.props
        dispatch({
            type: "devices/dutyReexecute",
            payload: payloadDatum(this, true, e),
        })
    };
    render () {
        const { devices, accountLst, dutyLst, dutyNum, pageNo } = this.props
        const { devid, status, type, visible, previewImg } = this.state
        return (
            <div className="f pad10">
                <DutyLeft
                    accountLst={accountLst}
                    devices={devices}
                    devid={devid}
                    DeviceChange={this.DeviceChange}
                    AccountChange={this.AccountChange}
                />
                <DutyRight
                    status={status}
                    dutyLst={dutyLst}
                    pageNo={pageNo}
                    dutyNum={dutyNum}
                    type={type}
                    FunChange={this.FunChange}
                    TopChange={this.TopChange}
                    PaginaChange={this.PaginaChange}
                    handleOk={this.handleOk}
                    visible={visible}
                    handleCancel={this.handleCancel}
                    previewImg={previewImg}
                    Delete={this.Delete}
                    Again={this.Again}
                />
            </div>
        )
    }
}
function payloadDatum (target, isTrue, id, pageNo) {
    pageNo = !pageNo ? target.props.pageNo : pageNo
    const { zid, devid, status, type } = target.state
    let payload
    if (isTrue) {
        payload = {
            id,
            list:
                status !== ""
                    ? { pageNo, zid, devid, status, type }
                    : { pageNo, zid, devid, type },
        }
    } else {
        payload =
            status !== ""
                ? { pageNo, zid, devid, status, type }
                : { pageNo, zid, devid, type }
    }
    return payload
}
function mapStateToProps (state) {
    const { devices, accountLst, dutyLst, dutyNum, pageNo } = state.devices
    let array = expDutyLst(dutyLst && dutyLst)
    return {
        devices,
        accountLst,
        dutyNum,
        pageNo,
        dutyLst: array,
    }
}

export default connect(mapStateToProps)(DustList)
