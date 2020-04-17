import { Component } from "react"
import { connect } from "dva"
import { Form, Input, Modal, Select, Checkbox} from "antd"
const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option
const CheckboxGroup = Checkbox.Group
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 17 },
    colon: false,
}
class Editor extends Component {
    componentDidMount () {
        this.fetchData()
    }
    fetchData = async () => {
        const { weChatList, dispatch } = this.props
        if (!weChatList || weChatList.length < 1) {
            await dispatch({ type: "vertisy/fetchWeChatList" })
        }
    }
    handleSubmit = (event) => {
        event.preventDefault()
        const {qundata, form, record} = this.props
        form.validateFields((error, values) => {
            if (!error) {
                let {quns, keyword, type} = values
                let qun_content = []
                keyword = keyword.replace(/\n/ig, "/")
                qundata.map((item) => {
                    if (quns.find((id) => id === item.wxid)) {
                        const obj = {kefu_nick: item.kefu_nick, wxid: item.kefu_wxid, QunId: item.wxid, nick: item.nick}
                        qun_content.push(obj)
                    }
                })
                this.props.handleSubmit({type: type || [], keyword, qun_content, id: record && record.id})
            }
        })
    }
    render () {
        const { weChatList, handleCancel, qundata, record, visible, kick, form, plainOptions } = this.props
        const { getFieldDecorator } = form
        const wechats = []
        if (weChatList && weChatList.length > 0) {
            weChatList.map((item) => {
                wechats.push(
                    <Option key={item.id} value={item.wxid}>{item.nickname}</Option>
                )
            })
        }
        let kefu_wxid = []
        let quns = []
        if (record && qundata.length > 0) {
            const qun_content = JSON.parse(record.qun_content)
            qun_content.map((item) => {
                quns.push(item.QunId)
                if (!kefu_wxid.find((id) => id === item.wxid)) {
                    kefu_wxid.push(item.wxid)
                }
            })
        }
        return (
            <Modal width={640} title="设置规则" visible={visible} onOk={this.handleSubmit} onCancel={handleCancel}>
                <Form >
                    <FormItem {...formItemLayout} extra="好友发送对应关键词之后，自动进群。可设置多个，一行一个关键词" label="关键词检测">
                        {getFieldDecorator("keyword", {initialValue: record && record.keyword, rules: [{ required: true, message: "请输入关键词" }] })(
                            <TextArea
                                placeholder="输入关键词"
                                rows={6}
                                ref={this.ipt = (ipt) => ipt && ipt.focus()}
                            />
                        )}
                    </FormItem>
                    {!kick && <FormItem {...formItemLayout} label="选择对应微信号">
                        {getFieldDecorator("kefu_wxid", {initialValue: kefu_wxid, rules: [{ required: true, message: "请选择对应微信号" }] })(
                            <Select mode="multiple" placeholder="请选择">
                                {wechats}
                            </Select>
                        )}
                    </FormItem>}
                    <FormItem {...formItemLayout} label="选择对应群">
                        {getFieldDecorator("quns", {initialValue: quns, rules: [{ required: true, message: "请选择对应群" }] })(
                            <Select mode="multiple" placeholder="请选择">
                                {qundata.map((item) => <Option key={item.wxid} value={item.wxid}>{item.nick}</Option>) }
                            </Select>
                        )}
                    </FormItem>
                    {kick && <FormItem {...formItemLayout} label="其他类型">
                        {getFieldDecorator("type", {initialValue: record && record.type})(
                            <CheckboxGroup options={plainOptions} />
                        )}
                    </FormItem>}
                </Form>
            </Modal>
        )
    }
}
function mapStateToProps (state) {
    const { weChatList } = state.vertisy
    return { weChatList }
}
export default connect(mapStateToProps)(Form.create()(Editor))
