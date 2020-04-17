import { Form, Input, Row, Col, Button } from "antd"
const FormItem = Form.Item
// const Option = Select.Option
const OperaFrom = ({ form, wechat, handleSubmit, AllFun }) => {
    const { getFieldDecorator } = form
    const formItemLayout = {
        style: { display: "flex" },
        labelCol: { style: { minWidth: 100 } },
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
    const AllSubmit = () => {
        form.setFieldsValue({ action: "", accountnum: "" })
        AllFun && AllFun()
    }
    // let option = ["登陆", "登出", "停用账户", "启用账户","操作"]
    return (
        <Form className="searchForm" onSubmit={onSubmit}>
            <Row gutter={24}>
                <Col span={8}>
                    <FormItem {...formItemLayout} label="用户账号">
                        {getFieldDecorator("accountnum")(<Input autoComplete="off" placeholder="请输入用户账号" />)}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem {...formItemLayout} label="用户行为">
                        {getFieldDecorator("remark", { initialValue: "" })(
                            <Input placeholder="请输入用户行为"></Input>
                        )}
                    </FormItem>
                </Col>
                <Col span={24}>
                    <FormItem {...formItemLayout} label=" ">
                        <Button type="primary" htmlType="submit" className="mr10">
                            搜索
                        </Button>
                        <Button type="primary" onClick={AllSubmit}>
                            重置
                        </Button>
                    </FormItem>
                </Col>
            </Row>
        </Form>
    )
}
const RecordSearcheForm = Form.create()(OperaFrom)
export default RecordSearcheForm
