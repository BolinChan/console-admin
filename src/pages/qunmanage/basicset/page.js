import { Component } from "react"
import { Form, Input, Button, Checkbox, message, Radio } from "antd"
import axios from "axios"
const fetchUrl = "//wechat.yunbeisoft.com/index_test.php/home/quns/get_basic_setting"
const submitUrl = "//wechat.yunbeisoft.com/index_test.php/home/quns/set_basic_setting"
const FormItem = Form.Item
const RadioGroup = Radio.Group

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 12 },
    colon: false,
}

class Page extends Component {
    componentDidMount () {
        this.fetchData()
    }
    fetchData = async () => {
        const token = window.sessionStorage.getItem("token")
        const data = { token }
        await axios.post(fetchUrl, JSON.stringify(data)).then(({ data: res }) => {
            if (!res.error) {
                const { data } = res
                const values = {
                    check_type: data.check_type,
                    wornings: data.wornings || "请不要在群内加好友，否则将会被踢出群！",
                    welcomes: data.welcomes,
                    is_protect: !!data.is_protect,
                }
                this.props.form.setFieldsValue({ ...values })
            }
        })
    }
    handleSubmit = (event) => {
        event.preventDefault()
        this.props.form.validateFields((error, values) => {
            if (!error) {
                const { check_type, wornings, welcomes, is_protect } = values
                const token = window.sessionStorage.getItem("token")
                const data = { check_type, wornings, welcomes, is_protect: is_protect ? 1 : 0, token }
                axios.post(submitUrl, JSON.stringify(data)).then(({ data: res }) => {
                    if (res.error) {
                        return message.error(res.errmsg)
                    } else {
                        return message.success(res.errmsg)
                    }
                })
            }
        })
    }
    render () {
        const { getFieldDecorator } = this.props.form
        return (
            <div className="pad20">
                <Form onSubmit={this.handleSubmit}>
                    <FormItem {...formItemLayout} label="群成员加人检测">
                        {getFieldDecorator("check_type", { initialValue: "1" })(
                            <RadioGroup>
                                <Radio value="1">不处理</Radio>
                                <Radio value="2">踢出群</Radio>
                                <Radio value="3">警告</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} extra="群成员加入被检测到之后，自动发言警告" label="警告语">
                        {getFieldDecorator("wornings", { initialValue: "请不要在群内加好友，否则将会被踢出群！" })(
                            <Input placeholder="请输入" />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} extra="新成员入群后，自动发言欢迎！" label="进群欢迎语">
                        {getFieldDecorator("welcomes")(
                            <Input placeholder="请输入" />
                        )}
                    </FormItem>
                    <FormItem wrapperCol={{ span: 12, offset: 4 }}>
                        {getFieldDecorator("is_protect", { valuePropName: "checked" })(
                            <Checkbox>群名称保护</Checkbox>
                        )}
                    </FormItem>
                    <FormItem wrapperCol={{ span: 12, offset: 4 }}>
                        <Button type="primary" htmlType="submit">
                            完成
                        </Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}
export default Form.create()(Page)
