import { Modal, Form, Input } from "antd"
import { Component } from "react"
const FormItem = Form.Item
const TextArea = Input.TextArea
class AddUser extends Component {
    state = { visible: false }

    showModal = () => {
        this.setState({
            visible: true,
        })
    }

    handleOk = (e) => {
        const { form, onOk } = this.props
        form.validateFields((err, values) => {
            if (!err) {
                onOk(values)
            }
        })
        this.setState({
            visible: false,
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
            <span>
                <span type="primary" onClick={this.showModal}>
                    {this.props.children}
                </span>
                <Modal title={Vaule ? "编辑账号" : "新增账号"} visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel} destroyOnClose={true}>
                    <Form>
                        <FormItem {...formItemLayout} label="登录账号">
                            {getFieldDecorator("accountnum", { initialValue: Vaule && Vaule.accountnum, rules: [{ required: true, message: "请填写账号!" }] })(<Input autoComplete="off" />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label={Vaule ? "重置密码" : "登录密码"}>
                            {getFieldDecorator("password", { rules: [{ required: !Vaule, message: "请输入密码!" }] })(<Input autoComplete="off" />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="真实姓名">
                            {getFieldDecorator("realname", { initialValue: Vaule && Vaule.realname, rules: [{ required: true, message: "请输入真实姓名!" }] })(<Input autoComplete="off" />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="用户昵称">
                            {getFieldDecorator("nickname", { initialValue: Vaule && Vaule.nickname })(<Input autoComplete="off" />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="用户备注">
                            {getFieldDecorator("userinfo", { initialValue: Vaule && Vaule.userinfo })(<TextArea autosize={{ minRows: 6 }} />)}
                        </FormItem>
                    </Form>
                </Modal>
            </span>
        )
    }
}
const setForm = Form.create()(AddUser)
export default setForm
