// import { connect } from "dva"
import { Component } from "react"
import { Input } from "antd"
class SetName extends Component {
    state = {
        visible: false,
    }
    componentDidMount () {
        document.body.addEventListener("click", this.Listener)
    }
    componentDidUpdate () {
        if (document.getElementById("boxInput")) {
            document.getElementById("boxInput").removeEventListener("click", this.onClickFun)
            document.getElementById("boxInput").addEventListener("click", this.onClickFun)
        }
    }
    componentWillUnmount () {
        document.body.removeEventListener("click", this.Listener)
    }
    Listener = (e) => {
        this.setState({ visible: false })
    }
    onClickFun = (e) => {
        e.stopPropagation()
    }
    setName = () => {
        this.setState({ visible: true })
    }
    // 提交数据
    enterSubmit = (e) => {
        let name = e.target.value
        const { record, action, dispatch, address, fielditem, fields} = this.props
        let defaultValue = this.state.name || record.remark
        if (name !== defaultValue) {
            this.setState({ visible: false, name: name.replace(/(\s*$)/g, "") })
            // 编辑备注
            let payload = { wxid: record.wxid, kefu_wxid: record.kefu_wxid }
            if (action === "editRemark") {
                payload.remark = name.replace(/(\s*$)/g, "")
            }
            if (action === "editPhone") {
                payload.phone = name.replace(/(\s*$)/g, "")
            }
            if (action === "editWang") {
                payload.buyer_name = name.replace(/(\s*$)/g, "")
            }
            if (action === "editAddress") {
                payload = address ? {userid: record.userid, address: name.replace(/(\s*$)/g, "")} : {userid: record.userid, record: name.replace(/(\s*$)/g, "")}
            }
            if (action === "editJd") {
                payload.jdAccount = name.replace(/(\s*$)/g, "")
                payload.userid = record.userid
            }
            // 编辑自定义字段
            if (action === "editfriendfield") {
                payload = {extend_fields: fields ? fields : {}, userid: record.userid, ...payload}
                payload.extend_fields[fielditem.id] = name.replace(/(\s*$)/g, "")
            }
            dispatch({
                type: `chat/${action}`,
                payload,
            })
        }
    }
    render () {
        const { defaultname, holder} = this.props
        let { visible, name} = this.state
        let isTrue = defaultname === "无" || defaultname === "未绑定"
        return (<div>
            <a style={{ display: !visible ? "block" : "none", color: isTrue && "#3f78ad"}} onDoubleClick={this.setName} title="双击修改，Enter键保存">
                {defaultname}
            </a>
            {visible && (
                <Input
                    id="boxInput"
                    placeholder={holder}
                    defaultValue={name || (isTrue ? "" : defaultname)}
                    ref={(input) => input && input.focus()}
                    onPressEnter={this.enterSubmit}
                />
            )}
        </div>
        )
    }
}
export default SetName
