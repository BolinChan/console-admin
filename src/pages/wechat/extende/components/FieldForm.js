
import { Modal, Form, Radio, Input, Select} from "antd"
const FormItem = Form.Item
const RadioGroup = Radio.Group
const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 19 },
}
const {Option} = Select
const FieldForm = ({ form, visible, dispatch, handleCancel, TyList }) => {
    const handleAddOk = (e) => {
        e.preventDefault()
        e.stopPropagation()
        form.validateFields(async (err, values) => {
            if (!err) {
                const isTrue = dispatch({type: "chat/addField", payload: values})
                isTrue && handleCancel && handleCancel()
            }
        })
    }
    const { getFieldDecorator, getFieldValue} = form
    return (
        <Modal destroyOnClose={true} width="646px" title="添加字段" visible={visible} onOk={handleAddOk} onCancel={handleCancel} bodyStyle={{ maxHeight: 700, overflow: "hidden", overflowY: "auto" }}>
            <Form>
                <FormItem {...formItemLayout} label="可用状态">
                    {getFieldDecorator("status", { initialValue: 1})(
                        <RadioGroup>
                            <Radio value={1}>可用</Radio>
                            <Radio value={0}>禁用</Radio>
                        </RadioGroup>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="字段名称">
                    {getFieldDecorator("name", { rules: [{ required: true, message: "请填写字段名称!" }] })(<Input placeholder="请输入字段名称"></Input>)}
                </FormItem>
                <FormItem {...formItemLayout} label="类型">
                    {getFieldDecorator("type", { rules: [{ required: true, message: "请选择类型!" }] })(<Select placeholder="请选择类型">
                        {TyList.map((item) => <Option value={item.id} key={item.id}>{item.value}</Option>)}
                    </Select>)}
                </FormItem>
                <FormItem {...formItemLayout} label="提示文案">
                    {getFieldDecorator("question")(<Input placeholder="请输入提示文案"></Input>)}
                </FormItem>
                {(getFieldValue("type") === "6" || getFieldValue("type") === "7") && <FormItem {...formItemLayout} label="字段取值">
                    {getFieldDecorator("field_value", { rules: [{ required: true, message: "请输入内容!" }] })(
                        <Input placeholder="请用逗号隔开"></Input>
                    )}
                </FormItem>}
            </Form>
        </Modal>
    )
}
const MaterialManageForm = Form.create()(FieldForm)
export default MaterialManageForm
