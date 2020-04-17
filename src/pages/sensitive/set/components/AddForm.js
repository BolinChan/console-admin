import { Modal, Form, Input, Radio } from "antd"
import { Component } from "react"
const FormItem = Form.Item
const RadioGroup = Radio.Group
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
                    type: `auxiliary/${action}`,
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
                <Modal title={record ? "编辑敏感词" : "新增敏感词"} visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel} destroyOnClose={true}>
                    <Form>
                        <FormItem {...formItemLayout} label="名称">
                            {getFieldDecorator("name", { initialValue: record && record.name, rules: [{ required: true, message: "请输入名称" }] })(<Input autoComplete="off" />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="敏感类型">
                            {getFieldDecorator("type", { initialValue: record && record.type || "1" })(<RadioGroup>
                                <Radio value="1">阻止并预警</Radio>
                                <Radio value="2">仅预警</Radio>
                            </RadioGroup>)}
                        </FormItem>
                    </Form>
                </Modal>
            </span>
        )
    }
}
const setForm = Form.create()(AddForm)
export default setForm
