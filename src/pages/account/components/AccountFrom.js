import { Form, Input, Button, Card, Select } from "antd"
import AddAccount from "./AddAccount"
const FormItem = Form.Item
const Option = Select.Option
const AccountFrom = ({ form, handleSubmit, hanldAdd, partmentList }) => {
    const { getFieldDecorator } = form
    const onSubmit = (e) => {
        e.preventDefault()
        form.validateFields((err, values) => {
            if (!err) {
                if (handleSubmit) {
                    handleSubmit(values)
                }
            }
        })
    }
    return (
        <Card hoverable>
            <div className="f fc fj">
                <Form onSubmit={onSubmit} layout="inline">
                    <FormItem>
                        {getFieldDecorator("keys")(<Input autoComplete="off" placeholder="请输入登录账号/姓名/昵称" style={{ width: 250 }} />)}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator("department")(
                            <Select style={{ width: 200 }} placeholder="请选择部门" allowClear={true}>
                                <Option value="">全部</Option>
                                {partmentList && partmentList.map((item, index) => (
                                    <Option key={index} value={item.name}>{item.name}</Option>
                                ))}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem >
                        <Button type="primary" htmlType="submit" icon="search">查询</Button>
                    </FormItem>
                </Form>
                <AddAccount onOk={hanldAdd} partmentList={partmentList}>
                    <Button type="primary" icon="plus-circle">新增账号</Button>
                </AddAccount>
            </div>
        </Card>
    )
}
const RecordSearcheForm = Form.create()(AccountFrom)
export default RecordSearcheForm
