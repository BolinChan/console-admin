import { Modal, Form, InputNumber, message, Alert} from "antd"
import { connect} from "dva"
import { Component} from "react"
import request from "../../../utils/request"
import axios from "axios"
import styles from "../page.css"
const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 16 },
}
class Pay extends Component {
    state={visible: false, payvisible: false, paysueecss: false}

    // 点击支付
    handleOk = () => {
        const {form, record, type} = this.props
        form.validateFields(async (err, values) => {
            if (!err) {
                let payOrderId
                let option = {method: "post", url: "//wechat.yunbeisoft.com/index_test.php/home/Wxpay/wechatpay", data: JSON.stringify({type: "ZIVIP", ...values})}
                if (record) {
                    option.data = JSON.stringify({type: record.type === "1" ? "ZIVIP" : "VIP", payOrderId: record.id})
                    payOrderId = record.id
                }
                if (type) {
                    option.data = JSON.stringify({type})
                }
                let {data} = await request(option)
                if (data.error) {
                    return message.error(data.errMsg)
                }
                payOrderId = data.data.id
                await this.setState({visible: false, payvisible: true, href: data.data.location})
                this.confirmPayment(payOrderId)
            }
        })
    }
    confirmPayment=(payOrderId) => {
        const Int = setInterval(() => {
            const {payvisible} = this.state
            const formData = new FormData()
            formData.append("order_no", payOrderId)
            axios.post("//wx.pay.scrm.la/wxpay/check_status.php", formData).then(({data: response}) => {
                if (Number(response) === -1) {
                    this.setState({payerror: true})
                    clearInterval(Int)
                }
                if (Number(response) === 200) {
                    this.setState({ paysueecss: true})
                    window.setTimeout(() => {location.reload()}, 3000)
                    clearInterval(Int)
                }
                if (!payvisible) {
                    clearInterval(Int)
                }
            })
        }, 2000)
    }
    showModal=() => {
        const {record, type} = this.props
        if (record || type) {
            this.handleOk()
            return
        }
        this.setState({visible: true})
    }
    handleCancel=() => {
        if (!this.state.paysueecss) {
            this.setState({visible: false, payvisible: false, payerror: false})
        }
    }
    render () {
        const {record, type} = this.props
        const {getFieldDecorator, getFieldValue} = this.props.form
        const {payvisible, href, paysueecss, payerror} = this.state
        let money = 199
        if (record) {
            money = Number(record.Num) * 199
        }
        if (getFieldValue("total_num")) {
            money = getFieldValue("total_num") * 199
        }
        return (
            <span>
                <a onClick={this.showModal}>{this.props.children}</a>
                <Modal
                    title="帐号数量"
                    okText="去支付"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                >
                    {!record && !type &&
                    <Form>
                        <FormItem {...formItemLayout} label="购买子账号的数量">
                            {getFieldDecorator("total_num", {initialValue: 1, rules: [{ required: true, message: "请输入数量!" }] })(<InputNumber min={0} placeholder="请输入数量" style={{width: 150}}/>)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="支付金额">
                            <span style={{color: "#f5222d"}}>￥</span>
                            {getFieldDecorator("money")(
                                <span style={{fontSize: 18, color: "#f5222d"}}>{((getFieldValue("total_num") || 0) * 199).toFixed(2)}</span>
                            )}
                        </FormItem>
                    </Form>}
                </Modal>
                <Modal
                    title={!paysueecss && "确认支付"}
                    visible={payvisible}
                    onOk={this.handlePay}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                    width={640}
                    footer={null}
                    closable={!paysueecss}
                    wrapClassName={paysueecss && styles.modalCont}
                >
                    {!paysueecss && <div>
                        <iframe title="支付" src={href} frameBorder="no" border="0" height="400px" width="100%" align="middle"/>
                        <div className="pad20 tc f18">支付金额：
                            <span style={{color: "#f5222d"}}>￥</span>
                            <b style={{fontSize: 20, color: "#f5222d"}}>{money.toFixed(2)}</b>
                        </div>
                    </div>}

                    <div className={styles.ale}>
                        {paysueecss && <Alert closeText="关闭" message="支付成功" description="3秒后自动刷新页面" type="success"
                            onClose={() => location.reload()} showIcon />}
                        {payerror && <Alert message="错误" description="数据出现异常，请稍后重试" type="error" showIcon />}
                    </div>
                </Modal>
            </span>
        )
    }
}
function mapStateToProps (state) {
    const { accountList} = state.account
    return {
        accountList,
        loading: state.loading.models.account,
    }
}
const setForm = Form.create()(Pay)
export default connect(mapStateToProps)(setForm)
