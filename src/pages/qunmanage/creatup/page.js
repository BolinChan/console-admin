import { Component } from "react"
import { connect } from "dva"
import { Form, InputNumber, Button, Select, Checkbox, message } from "antd"
import axios from "axios"
const fetchUrl = "//wechat.yunbeisoft.com/index_test.php/home/quns/get_qun_setting"
const submitUrl = "//wechat.yunbeisoft.com/index_test.php/home/quns/add_qun_setting"
const FormItem = Form.Item
const Option = Select.Option

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
        let { weChatList, dispatch, form } = this.props
        if (!weChatList || weChatList.length < 1) {
            await dispatch({ type: "vertisy/fetchWeChatList" })
        }
        const token = window.sessionStorage.getItem("token")
        const data = { token }
        axios.post(fetchUrl, JSON.stringify(data)).then(({ data: res }) => {
            weChatList = this.props.weChatList
            if (!res.error) {
                const { data } = res
                let values = {
                    qun_num: data.qun_num,
                    kefu_wxid: data.kefu_wxid,
                    is_auto: !!Number(data.is_auto),
                    auto_num: data.auto_num,
                    auto_max: data.auto_max,
                }
                if (weChatList && weChatList.find((item) => item.wxid === data.select_qunzhu)) {
                    values.select_qunzhu = data.select_qunzhu
                }
                form.setFieldsValue({ ...values })
            }
        })
    }
    handleSubmit = (event) => {
        event.preventDefault()
        this.props.form.validateFields((error, values) => {
            if (!error) {
                const { qun_num, kefu_wxid, is_auto, auto_num, auto_max, select_qunzhu } = values
                const token = window.sessionStorage.getItem("token")
                const data = { qun_num, kefu_wxid, is_auto: is_auto ? 1 : 0, auto_num, auto_max, select_qunzhu, token }
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
        const { weChatList } = this.props
        const children = []
        if (weChatList && weChatList.length > 0) {
            weChatList.map((item) => {
                children.push(
                    <Option key={item.id} value={item.wxid}>{item.nickname}</Option>
                )
            })
        }
        return (
            <div className="pad20">
                <Form onSubmit={this.handleSubmit}>
                    <FormItem {...formItemLayout} extra="建议一次创建群数量不要超过100，不填则默认创建20个群" label="群个数">
                        {getFieldDecorator("qun_num", { initialValue: 20 })(
                            <InputNumber
                                placeholder="请输入群个数"
                                min={1}
                                max={100}
                                style={{ width: "100%" }}
                                ref={this.ipt = (ipt) => ipt && ipt.focus()}
                            />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="选择微信">
                        {getFieldDecorator("kefu_wxid", { rules: [{ required: true, message: "请选择设备" }] })(
                            <Select mode="multiple" placeholder="请选择">
                                {children}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem wrapperCol={{ span: 12, offset: 4 }}>
                        {getFieldDecorator("is_auto", { valuePropName: "checked" })(<Checkbox>立即自动拉人进群</Checkbox>)}
                    </FormItem>
                    <FormItem {...formItemLayout} extra="系统将自动拉人进群" label="自动拉人人数">
                        {getFieldDecorator("auto_num", { initialValue: 2 })(
                            <InputNumber
                                placeholder="默认2-5人"
                                min={1}
                                max={500}
                                style={{ width: "100%" }}
                            />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} extra="系统将自动拉人进群" label="群人数上限">
                        {getFieldDecorator("auto_max", { initialValue: 35 })(
                            <InputNumber
                                placeholder="默认35人"
                                min={1}
                                max={500}
                                style={{ width: "100%" }}
                            />
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} extra="不选择则默认创建设备为群主" label="选择群主">
                        {getFieldDecorator("select_qunzhu")(
                            <Select placeholder="请选择">
                                {children}
                            </Select>
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
function mapStateToProps (state) {
    const { weChatList } = state.vertisy
    return {
        weChatList,
    }
}
export default connect(mapStateToProps)(Form.create()(Page))
