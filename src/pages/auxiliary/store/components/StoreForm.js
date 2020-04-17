import { Modal, Form, Input, Button, Icon } from "antd"
import { Component } from "react"
const FormItem = Form.Item
class AddForm extends Component {
    state = { visible: false }

    showModal = () => {
        this.setState({ visible: true }, () => this.input && this.input.focus())
    }

    handleOk = (e) => {
        const { form, record, action } = this.props
        form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: "auxiliary/editPublic",
                    payload: {op: action, id: record && record.id, ...values },
                })
                this.setState({
                    visible: false,
                })
            }
        })
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        })
    }
    editInput = (input) => (this.input = input)
    render () {
        const { form, record } = this.props
        const { getFieldDecorator } = form
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
            colon: false,
        }
        return (
            <span>
                <span type="primary" onClick={this.showModal}>
                    {this.props.children}
                </span>
                <Modal title={record ? "修改信息" : "绑定公众号"} visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel} footer={null} destroyOnClose={true}>
                    <Form>
                        <FormItem {...formItemLayout} label="公众号名称">
                            {getFieldDecorator("name", { initialValue: record && record.name, rules: [{ required: true, message: "请填写公众号名称" }] })(
                                <Input autoComplete="off" placeholder="请输入公众号名称" ref={this.editInput} />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="云贝scrm主账号">
                            {getFieldDecorator("username", { initialValue: record && record.username, rules: [{ required: true, message: "请填写账号" }] })(
                                <Input autoComplete="off" placeholder="请输入账号" />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="登录密码">
                            {getFieldDecorator("password", { rules: [{ required: true, message: "请填写登录密码" }] })(
                                <Input prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />} type="password" autoComplete="off" placeholder="请输入登录密码" />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label=" ">
                            <Button type="primary" onClick={this.handleOk}>
                                提交
                            </Button>
                        </FormItem>
                    </Form>
                </Modal>
            </span>
        )
    }
}
const setForm = Form.create()(AddForm)
export default setForm
