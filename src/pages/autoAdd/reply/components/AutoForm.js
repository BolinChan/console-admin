import { Component } from "react"
import { Form, Switch, Input, Modal, Checkbox} from "antd"
import ReplyContent from "./ReplyContent"
const FormItem = Form.Item
class Set extends Component {
    state = {
        isAutoRe: true,
        vvisible: false,
        isAdd: true,
        acceptList: [],
    }
    showModal = () => {
        const { record} = this.props
        let { isAdd, acceptList } = this.state
        if (record) {
            const img = record.accept_auto_reply_img
            const text = record.accept_auto_reply_msg
            const type = record.accept_auto_reply_type
            isAdd = record.is_auto_accept === "1"
            if (record.content) {
                record.content.map((item) => item.isdelete = false)
                acceptList = record.content
            }
            if (img || text) {
                acceptList = [{type, img, text}, ...acceptList]
            }
        }
        this.setState({
            visible: true,
            isAdd,
            acceptList: acceptList.length > 0 ? acceptList : [{type: "1", text: "", img: ""}],
        })
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
            acceptList: [],
        })
    }
    // 规则表单提交
    handleSubmit = (e) => {
        e.preventDefault()
        const { dispatch, form, device_wxid, onOk } = this.props
        const {getFieldValue} = form
        const {acceptList} = this.state
        form.validateFields((err, values) => {
            if (!err) {
                let { isAdd, isAutoRe, addNum, isremark } = values
                let content = []
                const num = acceptList && acceptList.findIndex((item) => !item.isdelete)
                acceptList && acceptList.map((item, index) => {
                    if (index !== num && !item.isdelete) {
                        const [url, img, text, type] = [getFieldValue(`url${index}`), getFieldValue(`img${index}`), getFieldValue(`text${index}`), getFieldValue(`type${index}`)]
                        if (type === "1" && text) {
                            content.push({type, text})
                        }
                        if (type === "2" && img && img.length > 0) {
                            content.push({type, img: img[0]})
                        }
                        if (type === "4" && url) {
                            content.push({type, url})
                        }
                    }
                })
                dispatch({
                    type: "autoAdd/setBeiRule",
                    payload: {
                        is_auto_accept: isAdd ? "1" : "0",
                        is_accept_auto_reply: isAutoRe ? "1" : "0",
                        device_wxid,
                        day_accept_number: addNum,
                        accept_auto_reply_type: values[`type${num}`],
                        accept_auto_reply_img: values[`img${num}`],
                        accept_auto_reply_msg: values[`text${num}`],
                        content,
                        is_auto_remark: isremark ? "1" : "0",
                    },
                })
                onOk && onOk(values)
                this.setState({
                    visible: false,
                })
            }
        })
    }
    // 是否开启自动回复
    switchMsg = (e) => {
        this.setState({ isAutoRe: e })
    }
    inputNumFun = (e) => {
        e.target.value = e.target.value.replace(/[^\d]/g, "")
        this.props.form.setFieldsValue({ addNum: e.target.value })
    }
    // 添加、删除回复内容
    changeContent=(acceptList) => {
        this.setState({acceptList})
    }
    render () {
        const { form, record } = this.props
        const { getFieldDecorator } = form
        let { isAutoRe, visible, isAdd, acceptList} = this.state
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        }
        return (
            <span>
                <a type="primary" onClick={this.showModal}>
                    {this.props.children}
                </a>
                <Modal
                    title="被添加规则设置"
                    width={650}
                    destroyOnClose={true}
                    visible={visible}
                    okText="保存修改"
                    cancelText="取消修改"
                    onOk={this.handleSubmit}
                    onCancel={this.handleCancel}
                    wrapClassName="wrapClass"
                    bodyStyle={{ height: "calc(100% - 108px)", overflow: "auto" }}
                    style={{ height: "70%", top: "10%", overflow: "hidden"}}>
                    <Form>
                        <FormItem {...formItemLayout} label="是否开启自动通过">
                            {getFieldDecorator("isAdd", { initialValue: isAdd })(<Switch defaultChecked={isAdd} checkedChildren="开启" unCheckedChildren="关闭" />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="单台每日上限">
                            {getFieldDecorator("addNum", { initialValue: record ? record.day_accept_number : "280" }, { rules: [{ required: true, message: "请填写数字" }] })(
                                <Input addonBefore="每天增加" addonAfter="个" type="number" min="0" onInput={this.inputNumFun} />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="是否自动备注">
                            {getFieldDecorator("isremark", record && {initialValue: record.is_auto_remark === "1"})(<Checkbox defaultChecked={record && record.is_auto_remark === "1"}/>)}
                            <span className="ml10" style={{color: "#c9c9c9"}}>添加为好友时是否自动给好友备注：微信昵称+时间</span>
                        </FormItem>
                        <FormItem {...formItemLayout} label="是否开启自动回复">
                            {getFieldDecorator("isAutoRe", {initialValue: record && record.is_accept_auto_reply === "1"})(
                                <Switch defaultChecked={record && record.is_accept_auto_reply === "1"} checkedChildren="开启" unCheckedChildren="关闭" onChange={this.switchMsg} />
                            )}
                        </FormItem>
                        <ReplyContent acceptList={acceptList} formItemLayout={formItemLayout} form={form} isAutoRe={isAutoRe} changeContent={this.changeContent} isvideo="ture"></ReplyContent>
                    </Form>
                </Modal>
            </span>
        )
    }
}
const setForm = Form.create()(Set)
export default setForm
