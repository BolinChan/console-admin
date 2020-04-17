import { Modal, Form, Select } from "antd"
import { Component } from "react"
const Option = Select.Option
const FormItem = Form.Item
class SetGroup extends Component {
    state = { visible: false }
    showModal = () => {
        this.setState({
            visible: true,
        })
    }
    handleOk = (e) => {
        const { record, form, dispatch, devGroupList, selectedRowKeys} = this.props
        form.validateFields((err, values) => {
            const { index} = values
            let zu_id = ""
            let zuname = ""
            if (typeof index === "number") {
                zu_id = devGroupList[index].id
                zuname = devGroupList[index].name
            }
            if (!err) {
                let payload = {zu_id, zuname}
                if (!record) {
                    payload.id = selectedRowKeys
                }
                if (record) {
                    payload.id = [record.id]
                    // payload = {zu_id, zuname, remark: record.remark, sncode: record.sncode, devicename: record.devicename, id: record.id }
                }
                dispatch({
                    // type: `devices/${action || "addEditDevices"}`,
                    type: "devices/setDevicesGroup",
                    payload,
                })
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
        const { getFieldDecorator } = this.props.form
        const { record, devGroupList } = this.props
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        }
        return (
            <span>
                <a type="primary" onClick={this.showModal}>
                    {this.props.children}
                </a>
                <Modal destroyOnClose={true} title="设备分组设置" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
                    <Form>
                        <FormItem {...formItemLayout} label="选择分组">
                            {getFieldDecorator("index", { initialValue: record && record.zuname })(
                                <Select placeholder="请选择分组">
                                    <Option value="">未分组</Option>
                                    {devGroupList &&
                                        devGroupList.map((item, index) => (
                                            <Option value={index} key={item.id}> {item.name} </Option>
                                        ))}
                                </Select>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </span>
        )
    }
}
const ListForm = Form.create()(SetGroup)
export default ListForm
