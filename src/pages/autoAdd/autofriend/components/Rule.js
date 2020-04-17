import { Form, Switch, Input, TimePicker, Radio } from "antd"
import moment from "moment"
import ReplyContent from "../../reply/components/ReplyContent"
const { TextArea } = Input
const FormItem = Form.Item
const RadioGroup = Radio.Group
const Set = ({form, record, type, formItemLayout, changeContent, acceptList}) => {
    const { getFieldDecorator, setFieldsValue } = form
    const inputNumFun = (e) => {
        e.target.value = e.target.value.replace(/[^\d]/g, "")
        setFieldsValue({ addUserNum: e.target.value })
    }
    let time = record && record.executeTime
    const plainOptions = [
        { label: "无备注", value: "0" },
        { label: "备注手机号码", value: "1" },
        { label: "备注时间+昵称", value: "2" },
        { label: "时间+昵称+手机号码", value: "3" },
    ]
    let extra = type === "order" ? "注：可输入 #姓名# 可自动替换为好友姓名，例如：您好#姓名#" : ""
    if (type === "upPhone") {
        extra = "注：可输入 #姓名# ，自动替换为表格中设定好的名字，例如：您好#姓名#"
    }
    return (
        <div>
            <FormItem {...formItemLayout} label="加好友时验证信息" style={{margin: 0}}>
                {getFieldDecorator("ischack", record && record.ischack && {initialValue: record.ischack === "1"})(
                    <Switch checked={form.getFieldValue("ischack")} checkedChildren="开启" unCheckedChildren="关闭" />)}
            </FormItem>
            <FormItem label=" " {...formItemLayout} colon={false} extra={extra}>
                {getFieldDecorator("chackMsg", record && { initialValue: record.chackMsg })(
                    <TextArea rows={3} disabled={!form.getFieldValue("ischack")} placeholder="请输入验证信息" style={{ resize: "none" }} />)}
            </FormItem>
            {/* <FormItem {...formItemLayout} label="是否自动通过">
                {getFieldDecorator("isDo", record && record.isDo && {initialValue: Number(record.isDo) === 1})(
                    <Switch checked={form.getFieldValue("isDo")} checkedChildren="开启" unCheckedChildren="关闭" />)}
                <span className="ml10" style={{color: "#c9c9c9"}}>开启自动通过时，不会发送预先设定好的回复消息</span>
            </FormItem> */}

            <ReplyContent acceptList={acceptList} formItemLayout={formItemLayout} form={form} isAutoRe={true} changeContent={changeContent}styleContent={{margin: 10}} title="通过后的回复消息"/>

            <FormItem {...formItemLayout} label="每日请求上限" help="为了帐号安全不建议输入超过20的数字">
                {getFieldDecorator("addUserNum", record && { initialValue: record.addUserNum || 10 }, { rules: [{ required: true, message: "请填写数字" }, { validator: this.checkNum }] })(
                    <Input addonBefore="每天请求" addonAfter="次" type="number" onInput={inputNumFun}/>
                )}
            </FormItem>
            <FormItem {...formItemLayout} label="请求间隔" style={{margin: 0}}>
                <div style={{ display: "flex" }}>
                    <FormItem >{getFieldDecorator("addtime1", record && { initialValue: record.addUserTime && record.addUserTime[0] })(<Input autoComplete="off" />)}</FormItem>
                    <span> &nbsp;~ &nbsp;</span>
                    <FormItem>{getFieldDecorator("addtime2", record && { initialValue: record.addUserTime && record.addUserTime[1] })(<Input autoComplete="off" />)}</FormItem>
                    <span> &nbsp;秒</span>
                </div>
            </FormItem>
            <FormItem {...formItemLayout} style={{ margin: 0}} label="执行加好友的时间区间">
                <div style={{ display: "flex" }}>
                    <FormItem>
                        {getFieldDecorator("startTime", { initialValue: moment(time ? time[0] : "00:00:00", "HH:mm:ss") })(<TimePicker style={{width: 165}} allowEmpty={false} format="HH:mm:ss" />)}
                    </FormItem>
                    <FormItem> &nbsp;- &nbsp;</FormItem>
                    <FormItem>
                        {getFieldDecorator("endTime", { initialValue: moment(time ? time[1] : "23:59:59", "HH:mm:ss") })(<TimePicker style={{width: 165}} format="HH:mm:ss" allowEmpty={false} />)}
                    </FormItem>
                </div>
            </FormItem>
            <FormItem {...formItemLayout} label="是否自动备注">
                {getFieldDecorator("isremark", record && {initialValue: record.is_auto_remark || "0"})(
                    <RadioGroup options={plainOptions}/>
                )}
                {/* <span className="ml10" style={{color: "#c9c9c9"}}>添加为好友时是否自动给好友备注：微信昵称+时间</span> */}
            </FormItem>
        </div>
    )
}
export default Set

