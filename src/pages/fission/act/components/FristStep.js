import { Form, Input, DatePicker, Button, Radio } from "antd"
import moment from "moment"
import styles from "../../page.css"
const FormItem = Form.Item
const RadioGroup = Radio.Group
const RangePicker = DatePicker.RangePicker
const FristStep = ({ form, record, onsubmit, onValuesChange}) => {
    const handleSubmit = (e) => {
        form.validateFields((err, values) => {
            if (!err) {
                let [s_time, e_time] = ["", ""]
                let { actTime } = values
                if (actTime && actTime.length > 0) {
                    s_time = moment(actTime[0]._d).format("YYYY-MM-DD HH:mm:ss")
                    e_time = moment(actTime[1]._d).format("YYYY-MM-DD HH:mm:ss")
                    values.actTimeStart = (new Date(s_time)).getTime() / 1000
                    values.actTimeEnd = (new Date(e_time)).getTime() / 1000
                }
                values.actTime = { start: s_time, end: e_time }
                if (e === "isChange") {
                    onValuesChange && onValuesChange(values)
                    return false
                }
                onsubmit && onsubmit(values)
            }
        })
    }
    const selectRadio = (e) => {
        const {value} = e.target
        form.setFieldsValue({ actTime: [moment(), moment().add(value, "days")]})
    }
    const selectPicker = (actTime) => {
        let actTimeStart = (new Date(actTime[0]._d)).getTime()
        let actTimeEnd = (new Date(actTime[1]._d)).getTime()
        form.setFieldsValue({ selTime: (actTimeEnd - actTimeStart) / (24 * 60 * 60 * 1000)})
    }
    const { getFieldDecorator } = form
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 17 },
    }
    let days = record && record.actTimeStart ? ((record.actTimeEnd - record.actTimeStart) / (24 * 60 * 60)) : 30
    let dataTime = record && record.actTimeStart ? [moment(new Date(record.actTimeStart * 1000)),
        moment(new Date(record.actTimeEnd * 1000))] : [moment(), moment().add(30, "days")]
    return (
        <Form onChange={() => handleSubmit("isChange")}>
            <FormItem {...formItemLayout} label="海报名称">
                {getFieldDecorator("actName", { initialValue: record && record.actName, rules: [{ required: true, message: "请输入海报名称" }] })(<Input autoComplete="off" placeholder="请输入海报名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="活动时间">
                {getFieldDecorator("actTime",
                    {initialValue: dataTime, rules: [{ required: true, message: "请选择时间" }]})(<RangePicker allowClear={false} format="YYYY-MM-DD HH:mm:ss" showTime onChange={selectPicker}/>)}
            </FormItem>
            <FormItem {...formItemLayout} label=" " colon={false}>
                {getFieldDecorator("selTime", {initialValue: days})(
                    <RadioGroup onChange={selectRadio}>
                        <Radio value={1}>一天</Radio>
                        <Radio value={3}>三天</Radio>
                        <Radio value={5}>五天</Radio>
                        <Radio value={7}>七天</Radio>
                        <Radio value={30}>一个月</Radio>
                    </RadioGroup>
                )}
            </FormItem>
            <FormItem {...formItemLayout} label="触发活动的关键词">
                {getFieldDecorator("keyword", { initialValue: record && record.keyword })(<Input placeholder="请输入关键词" />)}
            </FormItem>
            <div className={styles.formboot}>
                <Button type="primary" onClick={handleSubmit}>下一步</Button>
            </div>
        </Form >
    )
}
const setForm = Form.create()(FristStep)
export default setForm
