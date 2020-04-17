import { Modal, Form, Input, Select, DatePicker } from "antd"
import moment from "moment"
import SelectWeChat from "../../../components/SelectWeChats"
import styles1 from "../../../redpackage/components/RecordForm.css"
// import { area } from "../../../../utils/area"
import SelectMultple from "../../../components/SelectMultple"
import SetRule from "../../autofriend/components/Rule"
const { RangePicker } = DatePicker

const FormItem = Form.Item
const {Option} = Select
const orderExtra = (
    <div>
        {/* <div>该方式会把这段时间的订单中的手机号码加为好友，并自动填写手机号旺旺号。</div> */}
        <div>若未绑定云贝scrm系统公众号，请先绑定云贝scrm系统公众号，对接店铺数据！</div>
    </div>
)
const AddForm = ({record, visible, form, dispatch, handleCancel, action, weChatList, statusLst, store, publicList, onChangePublic, changeContent, acceptList}) => {
    const {getFieldValue} = form
    store = store && store.map((item) => ({id: item.id, name: item.name}))
    const handleOk = (e) => {
        form.validateFields((err, values) => {
            if (!err) {
                let {
                    time, deviceIds, maxPrice, minPrice, status, ischack, chackMsg, addUserNum,
                    addtime1, addtime2, startTime, endTime, isremark, fromOrderTime, endOrderTime,
                    uniacids, shopids} = values
                if (time && time.length > 0) {
                    fromOrderTime = moment(time[0]._d).format("YYYY-MM-DD 00:00:00")
                    endOrderTime = moment(time[1]._d).format("YYYY-MM-DD 23:59:59")
                }
                startTime = startTime && moment(startTime._d).format("HH:mm:ss")
                endTime = endTime && moment(endTime._d).format("HH:mm:ss")
                let content = []
                acceptList && acceptList.map((item, index) => {
                    if (!item.isdelete) {
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
                let payload = {
                    content,
                    isDo: 1,
                    addUserTime: [addtime1, addtime2],
                    executeTime: [startTime, endTime],
                    ischack: ischack ? 1 : 0,
                    is_auto_remark: isremark ? 1 : 0,
                    autoSend: 0, // 是否开启自动回复
                    addUserNum,
                    chackMsg,
                    deviceIds,
                    uniacids,
                    shopids,
                    orderStatus: status,
                    endPrice: maxPrice,
                    fromPrice: minPrice,
                    fromOrderTime,
                    endOrderTime,
                    action,
                }
                dispatch({
                    type: `autoAdd/${action}`,
                    payload,
                })
                handleCancel && handleCancel()
            }
        })
    }
    const { getFieldDecorator } = form
    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 4 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 20 },
        },
    }
    let time = []
    if (record.endOrderTime) {
        time = [moment(record.fromOrderTime), moment(record.endOrderTime)]
    }
    return (
        <span className="YH">
            <Modal
                width="50%"
                wrapClassName="wrapClass"
                bodyStyle={{ height: "calc(100% - 108px)", overflow: "auto"}}
                style={{ height: "80%", top: "10%", minWidth: 720 }}
                title="任务设置"
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
                destroyOnClose={true}>
                <Form>
                    {record && record.deviceIds
                        ? <FormItem label="所选微信" {...formItemLayout}>
                            {getFieldDecorator("deviceIds", {initialValue: [record.deviceIds]})(
                                <span>{record.nickname}</span>
                            )}
                        </FormItem>
                        : <FormItem label="选择微信" {...formItemLayout}>
                            {getFieldDecorator("deviceIds", { rules: [{ required: true, message: "请选择微信!" }] })(
                                <SelectWeChat data={weChatList} direction="vertical" isDevicename={true}></SelectWeChat>
                            )}
                        </FormItem>}

                    <SetRule changeContent={changeContent} acceptList={acceptList} disconten={true} formItemLayout={formItemLayout} type="order" record={record} form={form}/>

                    <FormItem {...formItemLayout} label="选择公众号">
                        {getFieldDecorator("uniacids",
                            {initialValue: record && record.uniacids || []})(
                            <SelectMultple
                                onChange={onChangePublic}
                                mode="multiple"
                                data={publicList}
                                placeholder="请选择公众号（默认绑定的公众号）"/>)}
                    </FormItem>
                    <FormItem {...formItemLayout} label="选择店铺">
                        {getFieldDecorator("shopids", {initialValue: record && record.shopids || []})(<SelectMultple mode="multiple" data={store} placeholder="请选择店铺（默认所有店铺）"/>)}
                    </FormItem>
                    <FormItem {...formItemLayout} label="选择订单日期" extra={orderExtra}>
                        {getFieldDecorator("time", {initialValue: time})(
                            <RangePicker format="YYYY-MM-DD" ranges={{
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
                            }}/>
                        )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="选择订单状态">
                        {getFieldDecorator("status", {initialValue: record && record.orderStatus || ""})(
                            <Select placeholder="订单状态">
                                {statusLst.map((item) => (
                                    <Option value={item.value} key={item.value}>{item.name}</Option>
                                ))}
                            </Select>)}
                    </FormItem>
                    {/* <FormItem {...formItemLayout} label="选择收货地区">
                        {getFieldDecorator("area")(
                            <Cascader options={area} placeholder="省市区选择" onChange={this.areaChange}/>)}
                    </FormItem> */}
                    <FormItem {...formItemLayout} label="订单金额">
                        <div className={styles1.moneyInput} style={{width: 350}}>
                            <FormItem className={styles1.input1}>
                                {getFieldDecorator("minPrice", {initialValue: record && record.fromPrice || ""})(
                                    <Input autoComplete="off" placeholder="最小订单金额" />)}
                            </FormItem>
                            <FormItem className={styles1.interval}>
                                <Input placeholder="~" disabled />
                            </FormItem>
                            <FormItem className={styles1.input2}>
                                {getFieldDecorator("maxPrice", {initialValue: record && record.endPrice || ""})(
                                    <Input autoComplete="off" placeholder="最大订单金额" />)}
                            </FormItem>
                        </div>
                    </FormItem>
                </Form>
            </Modal>
        </span>
    )
}
const ListForm = Form.create()(AddForm)
export default ListForm
