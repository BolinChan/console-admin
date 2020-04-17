import { Modal, Form, Input, Checkbox } from "antd"
import { Component } from "react"
const FormItem = Form.Item
class SetStatues extends Component {
    state = { visible: false }
    showModal = () => {
        this.setState({
            visible: true,
        })
    }

    handleOk = (e) => {
        const { form, record, onOk } = this.props
        form.validateFields((err, values) => {
            if (!err) {
                const { shenhe_remark, isCheck } = values
                let payload = { id: record.length ? record : [record.id], shenhe_remark, is_exception: isCheck ? "2" : "1" }
                onOk && onOk(payload)
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
        const { form } = this.props
        const { getFieldDecorator } = form
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 18 },
        }
        return (
            <span>
                <a type="primary" onClick={this.showModal} title="点击处理">
                    {this.props.children}
                </a>
                <Modal title="敏感操作处理" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel} destroyOnClose={true}>
                    <Form>
                        <FormItem {...formItemLayout} label="处理备注">
                            {getFieldDecorator("shenhe_remark", { initialValue: " " })(<Input autoComplete="off" />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="正常/异常">
                            {getFieldDecorator("isCheck")(<Checkbox>正常行为</Checkbox>)}
                        </FormItem>
                    </Form>
                </Modal>
            </span>
        )
    }
}
const setForm = Form.create()(SetStatues)
export default setForm
