import { Modal, message } from "antd"
import { Component } from "react"
import Set from "./Set"
class PerModel extends Component {
    state = { cheackList: []}
    onChange=(value) => {
        let {cheackList} = this.state
        value.map((item, index) => {
            cheackList[index] = item
        })
        this.setState({cheackList})
    }
    handleOk=async () => {
        const {cheackList} = this.state
        const {dispatch, zid, handleCancel} = this.props
        let id = []
        cheackList.map((item) => {
            id.push(...item)
        })
        let isTrue = await dispatch({
            type: "account/setPermie",
            payload: { id, ziid: zid },
        })
        if (!isTrue) {
            message.success("设置成功")
            dispatch({ type: "account/fetchZAccount" })
            handleCancel && handleCancel()
        } else {
            message.error("设置失败，请稍后重试")
        }
    }
    render () {
        let { list, accountnum, visible, handleCancel} = this.props
        let permiList = []
        if (list) {
            list = list.map((item) => ({...item, label: item.rights_name, value: item.id}))
            permiList[0] = list.filter((item) => item.is_service === "1")
            permiList[1] = list.filter((item) => item.is_service === "2")
        }
        return (
            <span>
                <Modal title={accountnum + "账号权限"} visible={visible} onOk={this.handleOk} onCancel={handleCancel} destroyOnClose={true} width={640}>
                    {permiList.map((item, index) => <div key={index}> <Set onChange={this.onChange} titleName={index === 0 ? "管理端权限" : "客服端权限"} {...this.props} index={index} data={item}></Set></div>) }
                </Modal>
            </span>
        )
    }
}

export default PerModel
