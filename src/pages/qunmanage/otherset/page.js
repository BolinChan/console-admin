import { Component } from "react"
import { connect } from "dva"
import { Form, Input, Button, Checkbox, message, Select } from "antd"
import axios from "axios"
// const fetchUrl = "//wechat.yunbeisoft.com/index_test.php/home/qunmanage/getlist"
const submitUrl = "//wechat.yunbeisoft.com/index_test.php/home/qunmanage/batchupd"
const FormItem = Form.Item
const { Option } = Select

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 12 },
    colon: false,
}

class Page extends Component {
    state = { }
    componentDidMount () {
        const { weChatList, dispatch } = this.props
        if (!weChatList || weChatList.length < 1) {
            dispatch({ type: "vertisy/fetchWeChatList" })
        }
    }
    handleSearch = (inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
    handleSubmit = (event) => {
        event.preventDefault()
        this.props.form.validateFields((error, values) => {
            if (!error) {
                const { changemaster } = values
                const token = window.sessionStorage.getItem("token")
                const data = {...values, changemaster: changemaster ? 1 : 0, token }
                axios.post(submitUrl, JSON.stringify(data)).then(({ data: res }) => {
                    if (res.error) {
                        return message.error(res.msg)
                    } else {
                        return message.success(res.msg)
                    }
                })
            }
        })
    }
    render () {
        const { getFieldDecorator } = this.props.form
        const {weChatList, qundata} = this.props
        const children = []
        if (qundata && qundata.length > 0) {
            qundata.map((item) => {
                children.push(
                    <Option key={item.wxid} value={item.wxid}>
                        {item.nick}
                    </Option>
                )
            })
        }
        return (
            <div className="pad20">
                <Form onSubmit={this.handleSubmit}>
                    <FormItem {...formItemLayout} extra="多选" label="选择对应群">
                        {getFieldDecorator("wxid", { rules: [{ required: true, message: "请选择对应群", type: "array" }] })(
                            <Select mode="multiple" placeholder="请选择对应群" filterOption={this.handleSearch}>
                                {children}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} extra="统一替换群名称" label="群名称">
                        {getFieldDecorator("newnick", { rules: [{ required: true, message: "请输入群名称" }] })(
                            <Input placeholder="请输入" />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} extra="统一替换群公告" label="群公告">
                        {getFieldDecorator("notice", { rules: [{ required: true, message: "请输入群公告" }] })(
                            <Input placeholder="请输入" />
                        )}
                    </FormItem>
                    <FormItem wrapperCol={{ span: 12, offset: 4 }}>
                        {getFieldDecorator("changemaster", { valuePropName: "checked" })(
                            <Checkbox>是否转让群主</Checkbox>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="选择群主">
                        {getFieldDecorator("kefu_wxid")(
                            <Select placeholder="请选择群主">
                                {weChatList && weChatList.map((item) => <Option key={item.wxid} value={item.wxid}>
                                    {item.nickname}
                                </Option>)}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem wrapperCol={{ span: 12, offset: 4 }}>
                        <Button type="primary" htmlType="submit">完成</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}
function mapStateToProps (state) {
    const { weChatList, qundata } = state.vertisy
    return { weChatList, qundata }
}
export default connect(mapStateToProps)(Form.create()(Page))
