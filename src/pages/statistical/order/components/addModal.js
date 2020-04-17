import { Form, Modal, Button, message } from "antd"
import { Component } from "react"
import SetRule from "../../../autoAdd/autofriend/components/Rule"
import SelectWeChat from "../../../components/SelectWeChats"
const FormItem = Form.Item
class AddModal extends Component {
    state = { visable: false, ischack: true }
    // 显示加好友弹窗
    showAddModal = () => {
        let { phoneLst } = this.props
        let { dev_array } = this.state
        if (dev_array && dev_array.length === 0) {
            message.error("请选择设备")
            return
        }
        if (phoneLst && phoneLst.length === 0) {
            message.error("请选择添加的好友")
            return
        }
        this.setState({ visable: true })
    }
    hideAddModal = () => {
        this.setState({ visable: false })
    }
    handleSubmit = () => {
        const { form, dispatch, phoneLst } = this.props
        form.validateFields((err, values) => {
            if (!err) {
                let { deviceIds, ischack, chackMsg, addUserNum, addtime1, addtime2 } = values
                let rulelist = {
                    // deviceIds,
                    addUserNum,
                    addUserTime: [addtime1, addtime2],
                    isDo: 1,
                    chackMsg,
                    ischack,
                }
                let addList = {
                    deviceIds,
                    data_lists: phoneLst,
                }
                dispatch({
                    type: "statistical/addFriend",
                    payload: { rulelist, addList },
                })
                this.setState({ visable: false })
            }
        })
    }
    render () {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 17 },
        }
        let {weChatList, form, disabled, addRule } = this.props
        const { visable } = this.state
        const { getFieldDecorator} = form
        if (weChatList && weChatList.length > 0) {
            weChatList = weChatList.filter((item) => item.isoff === "1")
        }
        return (
            <span>
                <Button type="primary" onClick={this.showAddModal} disabled={!disabled}>加好友</Button>
                <Modal title="添加好友" visible={visable} onCancel={this.hideAddModal} onOk={this.handleSubmit}
                    bodyStyle={{ height: "calc(100% - 108px)", overflow: "auto"}}
                    wrapClassName="wrapClass"
                    style={{ height: "70%", padding: 0, top: "15%" }}
                    width={800}
                >
                    <Form>
                        <FormItem {...formItemLayout} label="选择微信">
                            { getFieldDecorator("deviceIds", { rules: [{ required: true, message: "请选择微信"}] })(
                                <SelectWeChat data={weChatList} direction="vertical"></SelectWeChat>
                            )}
                        </FormItem>
                        <SetRule formItemLayout={formItemLayout} type="order" record={addRule} form={form} ></SetRule>
                    </Form>
                </Modal>
            </span>
        )
    }
}

const setForm = Form.create()(AddModal)
export default setForm
