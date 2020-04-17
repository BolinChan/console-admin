import { Modal, Form, Input, InputNumber, Select } from "antd"
import { Component } from "react"
const Option = Select.Option
const FormItem = Form.Item
class AddDevice extends Component {
    state = { visible: false }
    showModal = () => {
        this.setState({
            visible: true,
        })
    }

    handleOk = (e) => {
        const { form, onOk, devGroupList, Vaule } = this.props
        form.validateFields((err, values) => {
            if (!err) {
                if (values.index !== "" && Vaule && Vaule.zuname === values.index) {
                    values.index = devGroupList.findIndex((item) => item.name === values.index)
                }
                onOk(values)
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
        const { form, Vaule, devGroupList } = this.props
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
                <Modal title={Vaule ? "编辑设备" : " 新增设备"} visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel} destroyOnClose={true}>
                    <Form>
                        <FormItem {...formItemLayout} label="设备序号">
                            {getFieldDecorator("Sort", {initialValue: Vaule && Vaule.Sort})(<InputNumber min={0} autoComplete="off" placeholder="请输入序号（用于排序）" style={{width: "100%"}}/>)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="设备名称">
                            {getFieldDecorator("devicename",
                                { initialValue: Vaule && Vaule.devicename, rules: [{ required: true, message: "请输入设备名称!" }] })(<Input autoComplete="off" placeholder="请输入设备名称"/>)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="设备号">
                            {getFieldDecorator("sncode",
                                { initialValue: Vaule && Vaule.sncode, rules: [{ required: true, message: "请输入手机序列号!" }] })(<Input autoComplete="off" placeholder="请输入手机序列号"/>)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="选择分组">
                            {getFieldDecorator("index", { initialValue: Vaule && Vaule.zuname || "" })(
                                <Select placeholder="请选择分组">
                                    <Option value="">请选择</Option>
                                    {devGroupList &&
                                    devGroupList.map((item, index) => (
                                        <Option value={index} key={item.id}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="备注">
                            {getFieldDecorator("remark", { initialValue: Vaule && Vaule.remark })(<Input autoComplete="off" placeholder="请输入备注"/>)}
                        </FormItem>
                    </Form>
                </Modal>
            </span>
        )
    }
}
const setForm = Form.create()(AddDevice)
export default setForm
