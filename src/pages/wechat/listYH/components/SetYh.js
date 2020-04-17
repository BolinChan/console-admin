import { Modal, Checkbox, Form, Radio, DatePicker } from "antd"
import moment from "moment"
import "../page.css"
import SelectMultple from "../../../components/SelectMultple"
const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group
const RadioGroup = Radio.Group
const RadioButton = Radio.Button
const SetYh = ({visible, form, dispatch, list, wxids, handleCancel, weChatList, isduty, templist}) => {
    const handleOk = (e) => {
        form.validateFields((err, values) => {
            if (!err) {
                let { time, action, isstop, deviceids, iscustom, type, initiate, chat_template, cycle} = values
                let executiontime = moment(time._d).format("YYYY-MM-DD HH:mm:ss")
                isstop = isstop === "0" ? "2" : "1"
                if (isduty) {
                    iscustom === "1" && weChatList && (deviceids = weChatList.map((item) => item.deviceid))
                    let payload = {initiate, accept: deviceids, carriedtime: executiontime, chat_template, cycle, post: 1}
                    let action = "addAutoChatDuty"
                    if (list && list.id) {
                        payload.id = list.id
                        action = "updateAutoChatDuty"
                        payload.initiate = initiate[0]
                    }
                    dispatch({ type: `chat/${action}`, payload})
                    handleCancel && handleCancel()
                    return
                }
                if (iscustom === "1" && weChatList) {
                    deviceids = weChatList.map((item) => item.wxid)
                }
                if (list && list.id) {
                    dispatch({
                        type: "chat/editNursing",
                        payload: {id: list.id, executiontime, action, deviceid: list.deviceid, isstop},
                    })
                } else {
                    dispatch({
                        type: "chat/addNursing",
                        payload: {type, executiontime, action, deviceid: deviceids || [wxids]},
                    })
                }
                handleCancel && handleCancel()
            }
        })
    }
    const { getFieldDecorator } = form
    const formItemLayout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 18 },
    }
    const options = [{ label: "阅读腾讯新闻", value: "1" }, { label: "阅读公众号文章", value: "2" }, { label: "看一看", value: "3" }]
    const roptions = [{ label: "关闭", value: "1" }, { label: "开启", value: "0" }]
    const disabledDate = (current) => current && current <= moment().startOf("day")
    let isTrue = (!list || !list.deviceid) && !wxids
    const name = isduty ? "设备" : "微信"
    if (isduty) {
        weChatList.sort((a, b) => {
            if (a.deviceid === b.deviceid) {
                weChatList = weChatList.filter((item) => item.id !== b.id)
            }
        })
    }
    let mubanptions = []
    if (isduty && templist) {
        templist.map((item) => mubanptions.push({label: item.template_name, value: item.id}))
    }
    return (
        <span className="YH">
            <Modal
                title={isduty ? "任务设置" : "养号设置"}
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
                destroyOnClose={true}>
                <Form>
                    {isduty &&
                    <div>
                        <FormItem {...formItemLayout} label="发起微信">
                            {getFieldDecorator("initiate", {initialValue: list ? [list.initiate] : [], rules: [{ required: true, message: "请选择至少一个微信" }] })(
                                <SelectMultple disabled={!!(list && list.id)} data={weChatList} placeholder="请选择微信" disnone={true} mode="multiple"/>
                            )}
                        </FormItem>
                    </div>}
                    {isTrue && <div>
                        <FormItem {...formItemLayout} label="选择微信">
                            {getFieldDecorator("iscustom", {initialValue: "2" })(
                                <RadioGroup>
                                    <RadioButton value="1">全部微信</RadioButton>
                                    <RadioButton value="2">自定义选择</RadioButton>
                                </RadioGroup>,
                            )}
                        </FormItem>
                        {form.getFieldValue("iscustom") === "2" && <FormItem {...formItemLayout} label="选择微信">
                            {getFieldDecorator("deviceids", {initialValue: list && list.accept ? list.accept : [], rules: [{ required: true, message: "请选择至少一个" + name }] })(
                                <SelectMultple data={weChatList} placeholder="请选择微信" mode="multiple"/>
                            )}
                        </FormItem>}
                        {!isduty ? <FormItem {...formItemLayout} label="选择类型">
                            {getFieldDecorator("type", {initialValue: 1})(
                                <RadioGroup>
                                    <RadioButton value={1}>单次执行</RadioButton>
                                    <RadioButton value={2}>循环执行</RadioButton>
                                </RadioGroup>,
                            )}
                        </FormItem>
                            : <FormItem {...formItemLayout} label="选择类型">
                                {getFieldDecorator("cycle", {initialValue: list && Number(list.cycle) || 1})(
                                    <RadioGroup>
                                        <RadioButton value={2}>单次执行</RadioButton>
                                        <RadioButton value={1}>循环执行</RadioButton>
                                    </RadioGroup>,
                                )}
                            </FormItem>
                        }
                    </div>}
                    <FormItem {...formItemLayout} label="执行时间">
                        {getFieldDecorator("time", {initialValue: list && moment(list.executiontime), rules: [{ required: true, message: "请选择时间" }]})(
                            <DatePicker style={{width: "100%"}} placeholder="选择时间" showTime format="YYYY-MM-DD HH:mm:ss" disabledDate={disabledDate}/>
                        )}
                    </FormItem>
                    {!isduty && <div>
                        <FormItem {...formItemLayout} label="选择养号方式">
                            {getFieldDecorator("action", {initialValue: list && list.action, rules: [{ required: true, message: "请选择至少一种养号方式" }] })(<CheckboxGroup options={options} />)}
                        </FormItem>
                        {!isTrue && <FormItem {...formItemLayout} label="状态">
                            {getFieldDecorator("isstop", { initialValue: list && list.isstop || "1" })(<RadioGroup options={roptions} />)}
                        </FormItem>}
                    </div>}

                    {isduty && <div className="muban">
                        <FormItem {...formItemLayout} label="聊天模板">
                            {getFieldDecorator("chat_template", { initialValue: list && list.chat_template || mubanptions[0].value })(<RadioGroup options={mubanptions} />)}
                        </FormItem>
                    </div>}
                </Form>
            </Modal>
        </span>
    )
}
const ListForm = Form.create()(SetYh)
export default ListForm
