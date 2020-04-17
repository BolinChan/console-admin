import { Component } from "react"
import { connect } from "dva"
import { Form, Button, Radio, message, DatePicker, Checkbox, Row, Col, Select } from "antd"
import SelectWeChat from "../../components/SelectWeChats"
import TextArea from "../../components/TextArea"
import UploadImg from "../../components/UploadImg"
import UploadVideo from "../../components/UploadVideo"
import Voice from "./components/Voice"
import SelectUser from "./components/SelectUser"
import SelectMultple from "../../components/SelectMultple"
import styles from "./page.css"
import moment from "moment"
import "moment/locale/zh-cn"
const FormItem = Form.Item
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const Option = Select.Option
class GroupSend extends Component {
    constructor (props) {
        super(props)
        this.state = {
            showTip: false,
            isLoading: false,
            page: 1,
        }
    }
    // 开启定时任务
    handleTimedTask = (e) => {
        this.setState({ isChecked: e.target.checked })
        if (!e.target.checked) {
            this.setState({ showTip: false })
        }
    }
    // 选择时间确认后回调
    chooseTime = (date) => {
        let nowT = Date.parse(new Date()) // 当前时间戳
        let chooseT = new Date(moment(date._d).format("YYYY-MM-DD HH:mm:ss")).getTime() // 选择时间戳
        if (chooseT < nowT) {
            // 选择小于当前时间
            this.setState({
                showTip: true,
            })
        } else {
            this.setState({
                showTip: false,
            })
        }
    }
    // 提交表单
    handleSubmit = (e) => {
        e.preventDefault()
        let { dispatch, form, weChatList } = this.props
        const { kefu_wxid } = this.state
        form.validateFields(async (err, values) => {
            let { text, deviceIds, imgList, isTrue, fxiedTime, selectedRowKeys, sendType, msgType, bqids, fenzuIds } = values
            if (!err) {
                let time = isTrue && moment(fxiedTime._d).format("YYYY-MM-DD HH:mm:ss")
                let is = isTrue ? "1" : "0" // 开启定时 1开启 0没开启
                let nowTstamp = Date.parse(new Date()) // 获取当前时间戳
                let chooseTstamp = new Date(time).getTime() // 获取选择时间的时间戳
                if (chooseTstamp < nowTstamp) {
                    // 选择小于当前时间，立刻发送
                    time = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
                }
                if (sendType === "User") {
                    deviceIds = kefu_wxid ? kefu_wxid : weChatList && [weChatList[0].wxid]
                }
                if (msgType === "txt" && (!text || text.replace(/\s+/g, "").length <= 0)) {
                    return message.error("请输入文本内容")
                }
                if (msgType === "photo" && (!imgList || imgList.length <= 0)) {
                    return message.error("请上传图片")
                }
                this.setState({ isLoading: true })
                let isL = await dispatch({
                    type: "vertisy/qunfa",
                    payload: { msgtype: msgType === "txt" ? 1 : 2, deviceIds, userids: selectedRowKeys, content: msgType === "txt" ? text : imgList[0], is_timing: is, time, bqids, fenzuIds },
                })
                if (isL) {
                    this.props.form.resetFields() // 清空数据
                    form.setFieldsValue({ msgType: "txt" })
                }
            }
        })
    }
    selecteChat = (kefu_wxid) => {
        this.setState({ kefu_wxid: [kefu_wxid] })
    }
    disabledDate = (current) => current && current <= moment().startOf("day")
    render () {
        let { weChatList, contacts, contactTotal, dispatch, loading, allContacts, allTotal, form, tags, usergroup } = this.props
        const { getFieldDecorator } = form
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 19 },
        }
        const { isChecked, showTip, isLoading, kefu_wxid } = this.state
        let sendType = form.getFieldValue("sendType")
        let msgType = form.getFieldValue("msgType")
        return (
            <Row>
                <Col className="pad20">
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem label="目标筛选" {...formItemLayout}>
                            {getFieldDecorator("sendType", { initialValue: "WeChat", rules: [{ required: true, message: "请选择目标类型!" }] })(
                                <RadioGroup>
                                    <RadioButton value="WeChat">按微信发送</RadioButton>
                                    <RadioButton value="User">按好友发送</RadioButton>
                                    <RadioButton value="tags">按标签发送</RadioButton>
                                    <RadioButton value="fenzu">按分组发送</RadioButton>
                                </RadioGroup>
                            )}
                        </FormItem>
                        {sendType !== "User" && (
                            <FormItem label="选择群发微信" {...formItemLayout}>
                                {getFieldDecorator("deviceIds", { rules: [{ required: true, message: "请选择微信!" }] })(<SelectWeChat direction="vertical" data={weChatList} isDevicename={true} />)}
                            </FormItem>
                        )}
                        {sendType === "User" && (
                            <FormItem label="选择群发对象" {...formItemLayout}>
                                <Select style={{ width: "200px" }} placeholder="请选择微信" defaultValue={weChatList && weChatList.length && weChatList[0].wxid} onChange={this.selecteChat}>
                                    {weChatList && weChatList.length &&
                                        weChatList.map((item) => (
                                            <Option key={item.wxid} value={item.wxid}>
                                                {item.nickname}
                                            </Option>
                                        ))}
                                </Select>
                                {getFieldDecorator("selectedRowKeys", {
                                    rules: [{ required: true, message: "请选择目标用户!" }],
                                })(
                                    <SelectUser
                                        weChatList={weChatList}
                                        kefu_wxid={kefu_wxid ? kefu_wxid : weChatList && [weChatList[0].wxid]}
                                        contacts={contacts}
                                        dispatch={dispatch}
                                        total={contactTotal}
                                        loading={loading}
                                        allContacts={allContacts}
                                        allTotal={allTotal || 0}
                                    />
                                )}
                            </FormItem>
                        )}
                        {sendType === "tags" && (
                            <FormItem {...formItemLayout} label="选择标签">
                                {getFieldDecorator("bqids", { rules: [{ required: true, message: "请选择标签!" }] })(
                                    <SelectMultple data={tags} placeholder="请选择标签"></SelectMultple>
                                )}
                            </FormItem>
                        )}
                        {sendType === "fenzu" && (
                            <FormItem {...formItemLayout} label="选择分组">
                                {getFieldDecorator("fenzuIds", { rules: [{ required: true, message: "请选择分组!" }] })(
                                    <SelectMultple data={usergroup} placeholder="请选择分组"></SelectMultple>
                                )}
                            </FormItem>
                        )}
                        <FormItem label="群发消息" {...formItemLayout}>
                            {getFieldDecorator("msgType", { initialValue: "txt" })(
                                <RadioGroup>
                                    <RadioButton value="txt">群发文字</RadioButton>
                                    <RadioButton value="photo">群发图片</RadioButton>
                                    {/* <RadioButton value="video">群发视频</RadioButton> */}
                                    {/* <RadioButton value="voice">群发语音</RadioButton> */}
                                </RadioGroup>
                            )}
                        </FormItem>

                        {form.getFieldValue("msgType") === "txt" && (
                            <FormItem label=" " colon={false} {...formItemLayout}>
                                {getFieldDecorator("text")(<TextArea />)}
                            </FormItem>
                        )}
                        {msgType === "photo" && (
                            <FormItem label=" " colon={false} {...formItemLayout}>
                                {getFieldDecorator("imgList")(<UploadImg uploadMaxNum={1} />)}
                            </FormItem>
                        )}
                        {msgType === "video" && (
                            <FormItem label=" " colon={false} {...formItemLayout}>
                                {getFieldDecorator("video")(<UploadVideo />)}
                            </FormItem>
                        )}
                        {msgType === "voice" && (
                            <FormItem label=" " colon={false} {...formItemLayout}>
                                {getFieldDecorator("voice")(<Voice />)}
                            </FormItem>
                        )}
                        <FormItem label="开启定时任务：" {...formItemLayout}>
                            <Col span={1}>
                                <FormItem>{getFieldDecorator("isTrue")(<Checkbox onChange={this.handleTimedTask} />)}</FormItem>
                            </Col>
                            <Col span={20}>
                                {isChecked && (
                                    <FormItem>
                                        {getFieldDecorator("fxiedTime", { initialValue: moment() })(
                                            <DatePicker format="YYYY-MM-DD HH:mm" allowClear={false} disabledDate={this.disabledDate} showTime onOk={this.chooseTime} />
                                        )}
                                        {isChecked && showTip && <span className={styles.tip}>选择的时间小于当前时间则立刻执行</span>}
                                    </FormItem>
                                )}
                            </Col>
                        </FormItem>

                        <FormItem label=" " {...formItemLayout} colon={false}>
                            <Button type="primary" htmlType="submit" loading={isLoading && loading}>
                                提交
                            </Button>
                            <span className={styles.tip}>如果有错误操作，请到群发记录中取消指令！</span>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        )
    }
}
const GroupMsg = Form.create()(GroupSend)
function mapStateToProps (state) {
    let { allContacts, allTotal, weChatList } = state.vertisy
    if (weChatList && weChatList.length > 0) {
        weChatList = weChatList.filter((item) => item.isoff === "1")
    }
    return {
        allContacts,
        allTotal,
        loading: state.loading.models.vertisy,
        weChatList,
        tags: state.tagManage.alltags,
        tagstotal: state.tagManage.tagstotal,
        usergroup: state.chat.usergroup,
    }
}
export default connect(mapStateToProps)(GroupMsg)
