import { Modal, Form, Input, Icon, message } from "antd"
import { Component } from "react"
const FormItem = Form.Item
class AddUser extends Component {
    state = { visible: false }

    showModal = () => {
        this.setState({
            visible: true,
        })
    }

    handleOk = (e) => {
        const { form } = this.props
        form.validateFields(async (err, values) => {
            if (!err) {
                if (values.password !== values.newpassword) {
                    return message.error("两次密码不一致")
                }
                let visible = await this.props.dispatch({
                    type: "account/editPrimary",
                    payload: values,
                })
                this.setState({
                    visible,
                })
            }
        })

    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        })
    }

    render () {
        const { form, Vaule } = this.props
        const { getFieldDecorator } = form
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 18 },
        }
        return (
            <a>
                <span type="primary" onClick={this.showModal}>
                    <Icon type="form" theme="outlined" />
                    &nbsp;修改密码
                </span>
                <Modal title="修改密码" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel} destroyOnClose={true}>
                    <Form>
                        <FormItem {...formItemLayout} label="当前密码">
                            {getFieldDecorator("oldPassword", { rules: [{ required: !Vaule, message: "请输入当前密码!" }] })(
                                <Input prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />} type="password" autoComplete="off" placeholder="请输入当前密码" />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="新密码">
                            {getFieldDecorator("password", { rules: [{ required: !Vaule, message: "密码至少为六位数!", min: 6 }] })(
                                <Input prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />} type="password" autoComplete="off" placeholder="请输入新密码" />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="请确认新密码">
                            {getFieldDecorator("newpassword", { rules: [{ required: !Vaule, message: "请输入密码!" }] })(
                                <Input prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />} type="password" autoComplete="off" placeholder="请输入新密码" />)}
                        </FormItem>
                    </Form>
                </Modal>
            </a>
        )
    }
}
const setForm = Form.create()(AddUser)
export default setForm
