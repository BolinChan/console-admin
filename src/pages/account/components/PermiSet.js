import { Modal, Button, Checkbox, message } from "antd"
import { Component } from "react"
const CheckboxGroup = Checkbox.Group
let [MAX_MANAGE_LENGTH, MAX_CUSTOM_LENGTH] = [24, 13]
let [manage, custom] = [[], []]
class PermiSet extends Component {
    state = {
        customCheck: [],
        customAll: false,
        manageCheck: [],
        manageAll: false,
        visible: false,
        btnLoading: false,
    }
    showModal = () => {
        let [customCheck, manageCheck] = [[], []]
        let { list, defaultV } = this.props
        manage = []
        custom = []
        list.map((item) => {
            if (item.is_service === "2") {
                custom.push({
                    value: item.id,
                    label: item.rights_name,
                })
                let defV = defaultV && defaultV.find((f) => f === item.id)
                defV && customCheck.push(defV)
            }
            if (item.is_service === "1") {
                manage.push({
                    value: item.id,
                    label: item.rights_name,
                })
                let defV = defaultV && defaultV.find((k) => k === item.id)
                defV && manageCheck.push(defV)
            }
        })
        MAX_MANAGE_LENGTH = manage.length
        MAX_CUSTOM_LENGTH = custom.length
        this.setState({
            manageCheck,
            customCheck,
            visible: true,
            manageAll: manageCheck.length === MAX_MANAGE_LENGTH,
            manageminate: !!manageCheck.length && (manageCheck.length < MAX_MANAGE_LENGTH),

            customAll: customCheck.length === MAX_CUSTOM_LENGTH,
            customminate: !!customCheck.length && (customCheck.length < MAX_CUSTOM_LENGTH),
        })
    }
    handleCancel = (e) => {
        this.setState({ visible: false })
    }
    setPermi = async () => {
        const { dispatch } = this.props
        const { manageCheck, customCheck } = this.state
        let [checkLst] = [[...manageCheck, ...customCheck], []]
        let perTrue = await this.selectPermi(checkLst)
        if (!perTrue) {
            message.success("设置成功")
            dispatch({ type: "account/fetchZAccount" })
            this.setState({ visible: false })
        } else {
            message.error("设置失败，请稍后重试")
        }
    }
    selectPermi = (id) => {
        this.props.dispatch({
            type: "account/setPermie",
            payload: { id, ziid: this.props.zid },
        })
    }
    handleOk = async () => {
        this.setState({ btnLoading: true })
        await this.setPermi()
        this.setState({ btnLoading: false })

    }
    onManageChange = (value) => {
        this.setState({
            manageAll: value.length === MAX_MANAGE_LENGTH,
            manageCheck: value,
            manageminate: !!value.length && (value.length < MAX_MANAGE_LENGTH),
        })
    }
    onManageAllChange = (e) => {
        const { checked } = e.target
        let array = this.onSel(checked, 1)
        this.setState({
            manageCheck: array,
            manageAll: !!checked,
            manageminate: false,
        })
    }
    onCustomChange = (value) => {
        this.setState({
            customAll: value.length === MAX_CUSTOM_LENGTH,
            customCheck: value,
            customminate: !!value.length && (value.length < MAX_CUSTOM_LENGTH),
        })
    }
    onCustomAllChange = (e) => {
        const { checked } = e.target
        let array = this.onSel(checked, 2)
        this.setState({
            customCheck: array,
            customAll: !!checked,
            customminate: false,
        })
    }
    onSel = (checked, type) => {
        const { list } = this.props
        let array = []
        if (checked) {
            list.map((item) => {
                if (Number(item.is_service) === type) {
                    array.push(item.id)
                }
            })
        } else {
            array = []
        }
        return array
    }
    render () {
        const { manageCheck, customCheck, manageAll, customAll, btnLoading, customminate, manageminate } = this.state
        return (
            <span>
                <Button type="primary" onClick={this.showModal}>
                    设置权限
                </Button>
                <Modal
                    confirmLoading={btnLoading}
                    title={this.props.accountnum + "账号权限"}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                    width="655px">
                    <div className="f fc">
                        <span className="mr10">客服端</span>
                        <Checkbox
                            onChange={this.onCustomAllChange}
                            checked={customAll}
                            indeterminate={customminate}
                        >
                                全选（{customCheck.length}/{MAX_CUSTOM_LENGTH}）
                        </Checkbox>
                    </div>
                    <CheckboxGroup className="mt10" options={custom} value={customCheck} onChange={this.onCustomChange}></CheckboxGroup>
                    <div className="pad10"></div>
                    <div className="f fc">
                        <span className="mr10">管理端</span>
                        <Checkbox
                            onChange={this.onManageAllChange}
                            checked={manageAll}
                            indeterminate={manageminate}

                        >
                                全选（{manageCheck.length}/{MAX_MANAGE_LENGTH}）
                        </Checkbox>
                    </div>
                    <CheckboxGroup className="mt10" options={manage} value={manageCheck} onChange={this.onManageChange}></CheckboxGroup>
                </Modal>
            </span>
        )
    }
}

export default PermiSet
