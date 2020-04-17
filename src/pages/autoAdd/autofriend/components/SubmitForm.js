import { Component } from "react"
import { Form, Radio, Input, Button, message, DatePicker, Select, Cascader } from "antd"
import SelectMultple from "../../../components/SelectMultple"
import styles from "./SubmitForm.css"
import styles1 from "../../../redpackage/components/RecordForm.css"
import templetExcel from "../templet.xls"
import SelectWeChat from "../../../components/SelectWeChats"
import SelectFile from "./SelectFile"
import axios from "axios"
import { area } from "../../../../utils/area"
import SetRule from "./Rule"
import moment from "moment"
const { RangePicker } = DatePicker
const FormItem = Form.Item
const { TextArea } = Input
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const Option = Select.Option
const extra = (
    <div>
        <div>不填则设备平均分配导入的好友号码，执行加好友操作</div>
        <div>填写 * 号时，所有设备都会执行导入的好友号码，执行加好友操作</div>
        <div>填写数字时，例如：10,10,80   设备会按照10%，10%，80%的比例执行导入的好友号码，执行加好友操作</div>
        <div>选择多台设备时，可以不设置所有设备，剩余设备会平均分配剩余的百分比，执行加好友操作</div>
    </div>
)
const orderExtra = (
    <div>
        <div>该方式会把这段时间的订单中的手机号码加为好友，并自动填写手机号旺旺号。</div>
        <div>若未绑定云贝scrm系统公众号，请先绑定云贝scrm系统公众号，对接店铺数据！</div>
    </div>
)
const statusLst = [
    { name: "全部订单", value: "" },
    { name: "取消订单", value: -1 },
    { name: "待付款订单", value: 0 },
    { name: "已付款订单", value: 1 },
    { name: "已发货订单", value: 2 },
    { name: "成功订单", value: 3 },
    { name: "退货中订单", value: 4 },
    { name: "退货完成订单", value: 5 },
]
class SubmitForm extends Component {
    state = {
        isTure: false,
        bi: "",
        acceptList: [{ type: "1", frist: true }],
    }
    shouldComponentUpdate (nextProps) {
        const { addRule } = nextProps
        let { acceptList } = this.state
        if (addRule && acceptList[0].frist) {
            acceptList = addRule.content ? JSON.parse(addRule.content) : [{ type: "1", text: "" }]
            this.setState({ acceptList })
        }
        return true
    }
    // 加好友表单提交
    phoneSubmit = (e) => {
        e.preventDefault()
        const { form, dispatch, store } = this.props
        const { acceptList } = this.state
        form.validateFields(async (err, values) => {
            if (!err) {
                let { phone, deviceIds, type, time, startTime, endTime, isremark, shopIds, area, minPrice, maxPrice, status, fid, tagid, uniacids, shopids, file } = values
                if (type === "phone" && !phone) {
                    return message.error("请输入手机号码")
                }
                let data_lists = phone && phone.split("\n")
                if (data_lists && !data_lists[data_lists.length - 1]) {
                    data_lists.splice(data_lists.length - 1, 1)
                }
                // 自动加好友请求
                let payload = { data_lists, deviceIds, fid, tagid }
                let uniacid = window.sessionStorage.getItem("uniacid")
                if (type === "order" && (!uniacid || uniacid === "undefined")) {
                    return message.error("请先绑定云贝scrm系统公众号，对接店铺数据！")
                }
                if (type === "order") {
                    let from_time = time && moment(time[0]._d).format("YYYY-MM-DD 00:00:00")
                    let end_time = time && moment(time[1]._d).format("YYYY-MM-DD 23:59:59")
                    if (!shopIds || shopIds && shopIds.length === 0) {
                        shopIds = store.map((item) => item.id)
                    }
                    payload = {
                        deviceIds, type, end_time, from_time, shopIds, area, minPrice, maxPrice, status,
                        uniacids,
                        shopids,
                    }
                }
                let { ischack, chackMsg, addUserNum, addtime1, addtime2 } = values
                startTime = moment(startTime._d).format("HH:mm:ss")
                endTime = moment(endTime._d).format("HH:mm:ss")
                let content = []
                acceptList && acceptList.map((item, index) => {
                    if (!item.isdelete) {
                        const [url, img, text, type] = [values[`url${index}`], values[`img${index}`], values[`text${index}`], values[`type${index}`]]
                        if (type === "1" && text) {
                            content.push({ type, text })
                        }
                        if (type === "2" && img && img.length > 0) {
                            content.push({ type, img: img[0] })
                        }
                        if (type === "4" && url) {
                            content.push({ type, url })
                        }
                    }
                })
                let list = {
                    addUserNum,
                    addUserTime: [addtime1, addtime2],
                    isDo: 1,
                    chackMsg,
                    ischack: ischack ? "1" : "0",
                    executeTime: [startTime, endTime],
                    is_auto_remark: isremark,
                    content,
                }
                this.setState({ isTure: true })
                let setR = await dispatch({
                    type: "autoAdd/AddFriendRule",
                    payload: { setList: list },
                    // payload: {setList: list, phonelist: payload},
                })
                if (setR && type !== "upPhone") {
                    let is = await dispatch({ type: "autoAdd/autoAddFriends", payload })
                    is && form.setFieldsValue({ fid: undefined, tagid: undefined, phone: "" })
                }
                if (setR && type === "upPhone") {
                    this.customRequest(file)
                }
            }
        })
    }
    // 直接导入手机号码时，添加好友规则设置
    handleSubmit = async (e) => {
        const deviceIds = this.props.form.getFieldValue("deviceIds")
        if (!deviceIds || deviceIds.length === 0) {
            e.stopPropagation()
            return message.error("请选择执行设备!")
        }
        this.phoneSubmit(e)
    }
    customRequest = (file) => {
        const { form } = this.props
        this.setState({uploading: true})
        const deviceIds = form.getFieldValue("deviceIds")
        const action = `//wechat.yunbeisoft.com/index_test.php/home/file/upload?access_token=ACCESS_TOKEN&deviceIds=${deviceIds}`
        const formData = new FormData()
        let token = window.sessionStorage.getItem("token")
        delete file.thumbUrl
        formData.append("token", token)
        formData.append("bi", form.getFieldValue("bi"))
        formData.append("fid", form.getFieldValue("fid"))
        formData.append("tagid", form.getFieldValue("tagid"))
        formData.append("file", file)
        axios.post(action, formData).then(({ data: response }) => {
            if (response.error) {
                message.error("文件上传失败")
            } else {
                form.setFieldsValue({ file: undefined, fid: undefined, tagid: undefined, bi: "" })
                message.success("文件上传成功")
            }
            this.setState({uploading: false})
        })
    }
    // 添加、删除回复内容
    changeContent = (acceptList) => {
        this.setState({ acceptList })
    }
    onChangePublic = () => {
        const { store, form } = this.props
        const list = form.getFieldValue("uniacids")
        let filStore = []
        list && list.map((uniacid) => {
            const _s = store && store.filter((mess) => mess.uniacid === uniacid)
            filStore.push(..._s)
        })
        return filStore
    }
    render () {
        const formItemLayout = {
            style: { padding: "10px" },
            labelCol: { span: 4 },
            wrapperCol: { span: 19 },
        }
        const { getFieldDecorator, getFieldValue } = this.props.form
        let { weChatList, loading, addRule, store, usergroup, alltags, publicList } = this.props
        let { isTure, acceptList, uploading } = this.state
        if (getFieldValue("uniacids")) {
            store = this.onChangePublic()
        }
        store = store && store.map((item) => ({ id: item.id, name: item.name }))
        return (
            <div className={styles.tPadding}>
                <Form onSubmit={this.phoneSubmit} style={{ maxWidth: 1400 }}>
                    <FormItem label="选择方式" {...formItemLayout}>
                        {getFieldDecorator("type", { initialValue: "phone" })(
                            <RadioGroup>
                                <RadioButton value="phone">手动输入手机号码</RadioButton>
                                <RadioButton value="upPhone">批量上传手机号码</RadioButton>
                                <RadioButton value="order">按订单加好友</RadioButton>
                            </RadioGroup>)}
                    </FormItem>
                    <FormItem label="选择微信" {...formItemLayout}>
                        {getFieldDecorator("deviceIds", { rules: [{ required: true, message: "请选择微信!" }] })(
                            <SelectWeChat data={weChatList} direction="vertical" isDevicename={true}></SelectWeChat>
                        )}
                    </FormItem>

                    <SetRule formItemLayout={formItemLayout} type={getFieldValue("type")} record={addRule} form={this.props.form} changeContent={this.changeContent} acceptList={acceptList} />

                    <FormItem label="自动分组" {...formItemLayout}>
                        {getFieldDecorator("fid")(
                            <Select placeholder="请选择分组">
                                <Option value="">请选择</Option>
                                {usergroup.map((item) => (
                                    <Option value={item.id} key={item.id}>{item.fenzu_name}</Option>
                                ))}
                            </Select>)}
                    </FormItem>
                    <FormItem label="自动打标签" {...formItemLayout}>
                        {getFieldDecorator("tagid")(
                            <Select placeholder="请选择标签">
                                <Option value="">请选择</Option>
                                {alltags.map((item) => (
                                    <Option value={item.id} key={item.id}>{item.tag_name}</Option>
                                ))}
                            </Select>)}
                    </FormItem>
                    {/* </div>} */}

                    {getFieldValue("type") === "phone" && <div>
                        <FormItem {...formItemLayout} label="手机号码">
                            {getFieldDecorator("phone")(<TextArea rows={10} style={{ resize: "none" }} placeholder="输入手机号，一行一个号码，不能带空格" />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label=" " colon={false}>
                            <Button type="primary" htmlType="submit" loading={isTure && loading}>
                                确定
                            </Button>
                        </FormItem>
                    </div>}

                    {getFieldValue("type") === "upPhone" && <div><FormItem {...formItemLayout} label="分配手机号码" extra={extra}>
                        {getFieldDecorator("bi")(<TextArea rows={6} style={{ resize: "none" }} placeholder="输入百分比数字，用,分割" />)}
                    </FormItem>
                    <FormItem {...formItemLayout} label="导入文件">
                        {getFieldDecorator("file", { rules: [{ required: true, message: "请选择文件!" }] })(<SelectFile/>)}
                    </FormItem>
                    <FormItem {...formItemLayout} className={styles.marB0} label=" " colon={false}>
                        <div className={styles.btns}>
                            <Button onClick={this.handleSubmit} className="mr10" type="primary" loading={uploading}>
                                确定
                            </Button>
                            <Button htmlType="button">
                                <a href={templetExcel} download="templet.xls">
                                下载模板
                                </a>
                            </Button>
                        </div>
                    </FormItem>
                    </div>}

                    {getFieldValue("type") === "order" && <div>
                        <FormItem {...formItemLayout} label="选择订单日期" extra={orderExtra}>
                            {getFieldDecorator("time", { initialValue: [moment().subtract(7, "days"), moment().add(0, "days")], rules: [{ required: true, message: "请选择时间!" }] })(
                                <RangePicker format="YYYY-MM-DD" allowClear={false} ranges={{
                                    "今天": [moment(), moment()],
                                    "昨天": [moment().days(moment().days() - 1)
                                        .startOf("days"), moment().days(moment().days() - 1)
                                        .endOf("days")],
                                    "过去一周": [moment().days(moment().days() - 7)
                                        .startOf("days"), moment().endOf(moment())],
                                    "过去一个月": [moment().days(moment().days() - 30)
                                        .startOf("days"), moment().endOf(moment())],
                                    "过去半年": [moment().days(moment().days() - 183)
                                        .startOf("days"), moment().endOf(moment())],
                                }} />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="选择公众号">
                            {getFieldDecorator("uniacids")(<SelectMultple mode="multiple" data={publicList} placeholder="请选择公众号（默认绑定的公众号）" />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="选择店铺">
                            {getFieldDecorator("shopIds")(<SelectMultple mode="multiple" data={store} placeholder="请选择店铺（默认所有店铺）" />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="订单金额">
                            <div className={styles1.moneyInput} style={{ width: 350 }}>
                                <FormItem className={styles1.input1}>{getFieldDecorator("minPrice")(<Input autoComplete="off" placeholder="最小订单金额" />)}</FormItem>
                                <FormItem className={styles1.interval}>
                                    <Input placeholder="~" disabled />
                                </FormItem>
                                <FormItem className={styles1.input2}>{getFieldDecorator("maxPrice")(<Input autoComplete="off" placeholder="最大订单金额" />)}</FormItem>
                            </div>
                        </FormItem>
                        <FormItem {...formItemLayout} label="选择订单状态">
                            {getFieldDecorator("status")(
                                <Select placeholder="订单状态">
                                    {statusLst.map((item) => (
                                        <Option value={item.value} key={item.value}>{item.name}</Option>
                                    ))}
                                </Select>)}
                        </FormItem>
                        {window.sessionStorage.getItem("iiii") === "3" && <span>
                            <FormItem {...formItemLayout} label="选择收货地区">
                                {getFieldDecorator("area")(
                                    <Cascader options={area} placeholder="省市区选择" className={styles.w1} onChange={this.areaChange} />)}
                            </FormItem>
                        </span>}

                        <FormItem {...formItemLayout} label=" " colon={false}>
                            <Button type="primary" htmlType="submit" loading={isTure && loading}>
                                确定
                            </Button>
                        </FormItem>
                    </div>}
                </Form>
            </div>

        )
    }
}
const dataTableForm = Form.create()(SubmitForm)
export default dataTableForm
