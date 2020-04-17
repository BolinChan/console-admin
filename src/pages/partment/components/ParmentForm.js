import { Modal, Form, Input, Radio } from "antd"
import { Component } from "react"
// const Option = Select.Option
const {TextArea} = Input
const FormItem = Form.Item
class ParmentForm extends Component {
    state = { visible: false }

    showModal = (e) => {
        e.stopPropagation()
        const {action, record} = this.props
        if (action === "editdepartment" && !record.name) {
            this.setState({
                visible: false,
            })
        } else {
            this.setState({
                visible: true,
            })
        }
    }

    handleOk = (e) => {
        e.stopPropagation()
        const { form, action, record, selectID } = this.props
        form.validateFields((err, values) => {
            if (!err) {
                let payload = {...values}
                if (action === "editdepartment") {
                    payload.id = record.id
                }
                if (action === "adddepartment") {
                    payload.pid = selectID
                }
                if (values.type === "per") {
                    payload.pid = "0"
                }
                this.props.dispatch({
                    type: `account/${action}`,
                    payload,
                })
                this.setState({
                    visible: false,
                })
            }
        })
    }

    handleCancel = (e) => {
        e.stopPropagation()
        this.setState({
            visible: false,
        })
    }

    render () {
        const { form, record, SuperName} = this.props
        const { getFieldDecorator } = form
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 19 },
        }
        // let Superior = partmentList.filter(item=>item.id===selectID)
        return (
            <span>
                <span type="primary" onClick={this.showModal}>
                    {this.props.children}
                </span>
                <Modal destroyOnClose={true} title={record ? "编辑部门" : "新增部门"} visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
                    <Form>
                        {SuperName &&
                        <div>
                            <FormItem {...formItemLayout} label="部门级别">
                                {getFieldDecorator("type", { initialValue: "next" })(<Radio.Group buttonStyle="solid">
                                    <Radio.Button value="next">下级部门</Radio.Button>
                                    <Radio.Button value="per">一级部门</Radio.Button>
                                </Radio.Group>)}
                            </FormItem>
                            {form.getFieldValue("type") === "next" && <FormItem {...formItemLayout} label="上级部门">
                                {getFieldDecorator("super", { initialValue: record && record.desc })(<div>{SuperName}</div>)}
                            </FormItem>}
                        </div>
                        }
                        <FormItem {...formItemLayout} label="部门名称">
                            {getFieldDecorator("name", { initialValue: record && record.name, rules: [{ required: true, message: "请输入部门名称" }] })(<Input autoComplete="off" />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="部门描述">
                            {getFieldDecorator("desc", { initialValue: record && record.desc })(<TextArea autosize={{ minRows: 6 }} />)}
                        </FormItem>
                    </Form>
                </Modal>
            </span>
        )
    }
}
const setForm = Form.create()(ParmentForm)
export default setForm
