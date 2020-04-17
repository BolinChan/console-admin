import { Modal, Form, Input, Alert, Button } from "antd"
import { Component } from "react"
import UploadImg from "../../../components/UploadImg"
const FormItem = Form.Item
class AddForm extends Component {
    state = { visible: false }
    showModal = () => {
        this.setState({
            visible: true,
        })
    }
    handleOk = (e) => {
        const { form, dispatch, action, record, isqrcode } = this.props
        form.validateFields((err, values) => {
            const { code_name, qrcode_name, imgList, total, url } = values
            if (!err) {
                if (!isqrcode) {
                    // 活码
                    dispatch({
                        type: `auxiliary/${action}`,
                        payload: { code_name, id: record && record.id, pic_url: url ? url[0] : ""},
                    })
                } else {
                    // 二维码
                    let payload = { total, qrcode_name}
                    if (imgList && imgList.length > 0) {
                        payload.qr_url = imgList[0]
                    }
                    if (action === "addQrcode") {
                        payload.group_id = record.id
                    }
                    if (action === "updateQrcode") {
                        payload = {...record, ...payload}
                        // payload.id = record.id
                    }
                    dispatch({
                        type: `auxiliary/${action}`,
                        payload,
                    })
                }
                // onOk(values)
                this.setState({
                    visible: false,
                })
            }
        })
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        })
    }

    render () {
        const { form, Vaule, isqrcode, record } = this.props
        const { getFieldDecorator } = form
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 18 },
        }
        return (
            <span>
                <Button className="mar5" type="primary" onClick={this.showModal}>
                    {this.props.children}
                </Button>
                <Modal title={this.props.children} destroyOnClose={true} visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
                    <Form>
                        {!isqrcode && (
                            <div>
                                <Alert
                                    message="多个二维码合并成一个二维码，合成的二维码粉丝扫码时，可以随机发任意一个二维码"
                                    type="info"
                                    showIcon
                                    style={{
                                        width: "520px",
                                        position: "relative",
                                        left: "-24px",
                                        top: "-24px",
                                    }}
                                />
                                <FormItem {...formItemLayout} label="名称">
                                    {!Vaule &&
                                        getFieldDecorator("code_name", { initialValue: record && record.code_name, rules: [{ required: true, message: "请填写名称!" }] })(<Input autoComplete="off" />)}
                                </FormItem>
                                <FormItem {...formItemLayout} label="二维码背景" extra="建议背景图大小为512*806">
                                    {getFieldDecorator("url", { initialValue: [] })(<UploadImg defaultImgUrl={record && record.pic_url && [record.pic_url]} uploadMaxNum={1} />)}
                                </FormItem>
                            </div>
                        )}
                        {isqrcode && (
                            <div>
                                <FormItem {...formItemLayout} label="二维码名称">
                                    {getFieldDecorator("qrcode_name", { initialValue: record && record.qrcode_name, rules: [{ required: true, message: "请输入名称!" }] })(
                                        <Input autoComplete="off" />
                                    )}
                                </FormItem>
                                <FormItem {...formItemLayout} label="使用总数">
                                    {getFieldDecorator("total", { initialValue: record && record.total, rules: [{ required: true, message: "请输入数量!" }] })(<Input autoComplete="off" />)}
                                </FormItem>
                                <FormItem {...formItemLayout} label="文件名">
                                    {getFieldDecorator("imgList", { initialValue: [] })(<UploadImg defaultImgUrl={record && record.qr_url ? [record.qr_url] : []} uploadMaxNum={1} />)}
                                </FormItem>
                            </div>
                        )}
                    </Form>
                </Modal>
            </span>
        )
    }
}
const setForm = Form.create()(AddForm)
export default setForm
