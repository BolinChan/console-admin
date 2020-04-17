import { Modal, Form, Input } from "antd"
import { Component } from "react"
const FormItem = Form.Item
class AddForm extends Component {
    state = { visible: false }

    showModal = () => {
        this.setState({
            visible: true,
        })
    }

    handleOk = (e) => {
        const { form, action, record } = this.props
        form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: `devices/${action}`,
                    payload: { ...values, id: record && record.id },
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

    render () {
        const { form, record } = this.props
        const { getFieldDecorator } = form
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 19 },
        }
        return (
            <span>
                <span type="primary" onClick={this.showModal}>
                    {this.props.children}
                </span>
                <Modal destroyOnClose={true} title={record ? "编辑分组" : "新增分组"} visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
                    <Form>
                        <FormItem {...formItemLayout} label="分组名称">
                            {getFieldDecorator("name",
                                { initialValue: record && record.name,
                                    rules: [{ required: true, message: "请输入分组名称" }] })(<Input autoComplete="off" ref={(input) => input && input.focus()} onPressEnter={this.handleOk}/>)}
                        </FormItem>
                        {/* <FormItem {...formItemLayout} label="用户备注">
                            {getFieldDecorator("userinfo", { initialValue: Vaule && Vaule.userinfo })(<TextArea autosize={{ minRows: 6 }} />)}
                        </FormItem> */}
                    </Form>
                </Modal>
            </span>
        )
    }
}
const setForm = Form.create()(AddForm)
export default setForm
