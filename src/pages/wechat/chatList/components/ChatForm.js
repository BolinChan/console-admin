import { Form, Input, Row, Col, Select, Button } from "antd"
const FormItem = Form.Item
const Option = Select.Option
const ChatForm = ({ form, wechat, handleSubmit }) => {
    const { getFieldDecorator } = form
    const formItemLayout = {
        style: { display: "flex" },
        labelCol: { style: { minWidth: 80 } },
        wrapperCol: { style: { flex: 1 } },
        colon: false,
    }
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
        <Form className="searchForm" onSubmit={onSubmit}>
            <Row gutter={24}>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="设备信息">
                        {getFieldDecorator("nickname")(<Input autoComplete="off" placeholder="请输入设备信息" />)}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="微信昵称/备注">
                        {getFieldDecorator("nickname")(<Input autoComplete="off" placeholder="请输入设备信息" />)}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="微信分组">
                        {getFieldDecorator("status", { initialValue: "0" })(
                            <Select>
                                <Option value="0">1</Option>
                                <Option value="3">2</Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="状态">
                        {getFieldDecorator("status", { initialValue: "0" })(
                            <Select>
                                <Option value="0">1</Option>
                                <Option value="3">2</Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="部门">
                        {getFieldDecorator("status", { initialValue: "0" })(
                            <Select>
                                <Option value="0">1</Option>
                                <Option value="3">2</Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={24}>
                    <FormItem {...formItemLayout} label=" ">
                        <Button type="primary" htmlType="submit">
                            搜索
                        </Button>
                    </FormItem>
                </Col>
            </Row>
        </Form>
    )
}
const RecordSearcheForm = Form.create()(ChatForm)
export default RecordSearcheForm
