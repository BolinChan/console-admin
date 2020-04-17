import { Modal, Form, Radio, Input, TimePicker, Icon } from "antd"
import { Component } from "react"
import moment from "moment"
import "moment/locale/zh-cn"
import styles from "../../page.css"
const FormItem = Form.Item
const RadioGroup = Radio.Group
moment.locale("zh-cn")

class PointSet extends Component {
    state = { visible: false, addTimeLst: [{ id: 1, form: "from0", end: "end0", num: "num0", timeStar: " 00:00:00", timeEnd: "23:59:59" }] }
    showModal = () => {
        this.setState({
            visible: true,
        })
    }
    handleOk = (e) => {
        const { form, onOk } = this.props
        const { addTimeLst } = this.state
        form.validateFields((err, values) => {
            if (!err) {
                let { deviceid, duty_type, is_auto } = values
                let time = []
                for (let i = 0, len = addTimeLst.length; i < len; i++) {
                    let num = addTimeLst[i].setNum ? addTimeLst[i].setNum : ""
                    time.push({ from: addTimeLst[i].timeStar, end: addTimeLst[i].timeEnd, num })
                }
                let payload = { deviceid, duty_type, is_auto, time }
                onOk(payload)
                form.resetFields()
            }
        })
        this.setState({
            visible: false,
        })
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        })
    }
    addTimePush = () => {
        const { addTimeLst } = this.state
        let key = addTimeLst.length + 1
        addTimeLst.push({ id: key, form: "from" + key, end: "end" + key, num: "num" + key, timeStar: "00:00:00", timeEnd: "23:59:59" })
        this.setState({ addTimeLst })
    }
    lessTime = (id) => {
        const { addTimeLst } = this.state
        if (addTimeLst.length) {
            let findex = addTimeLst.findIndex((item) => item.id === id)
            if (findex !== -1) {
                addTimeLst.splice(findex, 1)
            }
            this.setState({ addTimeLst })
        }
    }
    inputNumFun = (index, e) => {
        const { addTimeLst } = this.state
        e.target.value = e.target.value.replace(/[^\d]/g, "")
        addTimeLst[index].setNum = Number(e.target.value)
        this.setState({ addTimeLst })
    }
    changeTime = (index, type, e) => {
        let { addTimeLst } = this.state
        let time = moment(e._d).format("HH:mm:ss")
        type === "star" ? addTimeLst[index].timeStar = time : addTimeLst[index].timeEnd = time
        this.setState({ addTimeLst })
    }
    render () {
        const { addTimeLst } = this.state
        const { form, record } = this.props
        const { getFieldDecorator } = form
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 17 },
        }
        let deviceid = record && record.device_wxid ? [record.device_wxid] : record
        let duty_type = record.duty_type === "单次任务" ? "2" : "1"
        return (
            <span>
                <a type="primary" onClick={this.showModal}>
                    {this.props.children}
                </a>
                <Modal width={650} title="自动点赞设置" visible={this.state.visible} okText="保存修改" cancelText="取消修改" onOk={this.handleOk} onCancel={this.handleCancel} destroyOnClose={true}>
                    <Form layout="horizontal">
                        <FormItem {...formItemLayout} label="设备名称">
                            {getFieldDecorator("deviceid", { initialValue: deviceid })(<div>{record && record.devicename ? record.devicename : "未命名"}</div>)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="是否开启自动点赞">
                            {getFieldDecorator("is_auto", { initialValue: record.is_auto ? record.is_auto : "1" })(
                                <RadioGroup>
                                    <Radio value="1">是</Radio>
                                    <Radio value="0">否</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="任务类型">
                            {getFieldDecorator("duty_type", { initialValue: duty_type })(
                                <RadioGroup>
                                    <Radio value="1">循环每日执行</Radio>
                                    <Radio value="2">单次执行</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="设备点赞时间">
                            {addTimeLst && addTimeLst.length > 0 && addTimeLst.map((item, index) => (
                                <div style={{ display: "flex" }} key={item.id}>
                                    <FormItem>
                                        {getFieldDecorator(`${item.form}`, { initialValue: moment(`${item.timeStar}`, "HH:mm") })(<TimePicker
                                            onChange={(e) => this.changeTime(index, "star", e)}
                                            format="HH:mm"
                                            style={{ width: 100 }} />)}
                                    </FormItem>
                                    <FormItem> &nbsp;- &nbsp;</FormItem>
                                    <FormItem>
                                        {getFieldDecorator(`${item.end}`, { initialValue: moment(`${item.timeEnd}`, "HH:mm") })(<TimePicker
                                            onChange={(e) => this.changeTime(index, "end", e)}
                                            format="HH:mm"
                                            style={{ width: 100 }} />)}
                                    </FormItem>
                                    <FormItem> &nbsp;&nbsp;&nbsp;&nbsp;次数:&nbsp;</FormItem>
                                    <FormItem>
                                        {getFieldDecorator(`${item.num}`)(<Input placeholder="5-10" autoComplete="off" onInput={(e) => this.inputNumFun(index, e)} style={{ width: 80 }} />)}
                                    </FormItem>
                                    <FormItem> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</FormItem>
                                    <FormItem>
                                        {item.id === 1 && <Icon type="plus-circle" className={styles.icon} onClick={this.addTimePush} />}
                                        {item.id > 1 && <Icon type="minus-circle" className={styles.icon} onClick={() => this.lessTime(item.id)} />}
                                    </FormItem>
                                </div>
                            ))}
                        </FormItem>
                    </Form>
                </Modal>
            </span>
        )
    }
}
const setForm = Form.create()(PointSet)
export default setForm
