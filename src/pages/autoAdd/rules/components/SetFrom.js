import { Component } from "react"
import { Form, Switch, Input, Modal } from "antd"

const { TextArea } = Input
const FormItem = Form.Item
class Set extends Component {
    state = {
        // isAutoRe: true,
        visible: false,
        // ischack: false,
    }
    showModal = () => {
        // const { record } = this.props
        // let { ischack } = this.state
        // if (record && record.is_auto_accept) {
        //     ischack = record.is_auto_accept === "1"
        // }
        this.setState({
            visible: true,
            // ischack,
        })
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        })
    }
   // 规则表单提交
   handleSubmit = (e) => {
       e.preventDefault()
       e.stopPropagation()
       const {record, selectedRowKeys, dispatch, form } = this.props
       form.validateFields((err, values) => {
           if (!err) {
               let { ischack, chackMsg, addUserNum, addtime1, addtime2} = values
               // 编辑新增规则
               dispatch({
                   type: "autoAdd/setAddFriendRule",
                   payload: {
                       addUserNum,
                       addUserTime: [addtime1, addtime2],
                       deviceIds: record ? [record.deviceIds] : selectedRowKeys,
                       isDo: 1,
                       chackMsg,
                       ischack: ischack ? "1" : "0",
                   },
               })
               this.handleCancel()
           }
       })
   }
    // 是否开启自动回复
    // switchChack = (e) => {
    //     this.setState({ ischack: e })
    // }
    inputNumFun = (e) => {
        e.target.value = e.target.value.replace(/[^\d]/g, "")
        this.props.form.setFieldsValue({ addUserNum: e.target.value })
    }
    render () {
        const { form, record } = this.props
        const { getFieldDecorator } = form
        let { visible} = this.state
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        }
        return (
            <span>
                <a type="primary" onClick={this.showModal}>
                    {this.props.children}
                </a>
                <Modal title="加好友规则设置" width={650} visible={visible} okText="保存修改" cancelText="取消修改" onOk={this.handleSubmit} onCancel={this.handleCancel} destroyOnClose={true}>
                    <Form>
                        <FormItem {...formItemLayout} label="加好友时验证信息">
                            {getFieldDecorator("ischack", {initialValue: record && record.ischack === "1"})(
                                <Switch defaultChecked={record && record.ischack === "1"} checkedChildren="开启" unCheckedChildren="关闭"/>
                            )}
                        </FormItem>
                        <FormItem label=" " {...formItemLayout} colon={false}>
                            {getFieldDecorator("chackMsg", { initialValue: record && record.chackMsg })(
                                <TextArea rows={6} disabled={!form.getFieldValue("ischack")} placeholder="请输入验证信息" style={{ resize: "none" }} />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="每日请求上限" help="为了设备安全不建议输入超过20的数字">
                            {getFieldDecorator("addUserNum", { initialValue: record && record.addUserNum || 10 }, { rules: [{ required: true, message: "请填写数字" }, { validator: this.checkNum }] })(
                                <Input addonBefore="每天请求" addonAfter="次" type="number" />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="请求间隔">
                            <div style={{ display: "flex" }}>
                                <FormItem >{getFieldDecorator("addtime1", { initialValue: record && record.addUserTime && record.addUserTime[0] || "100" })(<Input autoComplete="off" />)}</FormItem>
                                <span>&nbsp;~&nbsp;</span>
                                <FormItem>{getFieldDecorator("addtime2", { initialValue: record && record.addUserTime && record.addUserTime[1] || "200" })(<Input autoComplete="off" />)}</FormItem>
                                <span> &nbsp;秒</span>
                            </div>
                        </FormItem>
                    </Form>
                </Modal>
            </span>
        )
    }
}
const setForm = Form.create()(Set)
export default setForm
