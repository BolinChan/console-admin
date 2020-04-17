import { Form, Input, Button, Modal, DatePicker, InputNumber } from "antd"
import moment from "moment"

const FormItem = Form.Item
const { RangePicker } = DatePicker

const SelectForm = ({v, form, allTotal, onSubmit, showTarget, Targetvisible, handleCancel, handleTarget }) => {
    const { getFieldDecorator } = form
    const Submit = (e) => {
        e.preventDefault()
        form.validateFields((err, values) => {
            if (!err) {
                onSubmit && onSubmit(values)
            }
        })
    }
    const AllSubmit = () => {
        form.setFieldsValue({
            city: "",
            nick: "",
        })
        onSubmit && onSubmit({ })
    }
    const handleOK = () => {
        form.validateFields((err, values) => {
            if (!err) {
                const {regtime, end, start} = values
                if (regtime) {
                    values.start_time = moment(regtime[0]._d).format("YYYY-MM-DD HH:mm:ss")
                    values.end_time = moment(regtime[1]._d).format("YYYY-MM-DD HH:mm:ss")
                }
                values.total = end - start
                handleTarget && handleTarget(values)
            }
        })
    }
    const Target = {
        labelCol: { span: 7 },
        wrapperCol: { span: 17 },
    }
    allTotal = allTotal || 0
    return (
        <div>
            <Form layout="inline" style={{ padding: "10px" }}>
                <FormItem label="城市">
                    {getFieldDecorator("city")(<Input autoComplete="off" placeholder="请选择城市"/>)}
                </FormItem>
                <FormItem label="好友昵称/备注">
                    {getFieldDecorator("nick")(<Input autoComplete="off" placeholder="请输入好友昵称/备注"/>)}
                </FormItem>
                <FormItem>
                    <Button type="primary" onClick={Submit}>
                    搜索
                    </Button>
                </FormItem>
                <FormItem>
                    <Button type="primary" onClick={AllSubmit}>
                    重置
                    </Button>
                </FormItem>
                <FormItem>
                    {v && <Button type="primary" onClick={showTarget}>
                    群发搜索结果
                    </Button>}
                </FormItem>
                <Modal title="群发搜索结果"
                    visible={Targetvisible}
                    onOk={handleOK}
                    onCancel={handleCancel}
                    destroyOnClose={true}>
                    <FormItem {...Target} label="选择群发的人数范围：" extra="为了微信安全建议每次群发人数不超过200">
                        <div style={{ display: "flex" }}>
                            <FormItem style={{margin: 0}}>
                                {getFieldDecorator("start", { initialValue: 0})(<InputNumber style={{width: 100}} placeholder="请输入人数" min={0} max={form.getFieldValue("end")}/>)}
                            </FormItem>

                            <FormItem style={{margin: 0}}> &nbsp;- &nbsp;</FormItem>

                            <FormItem style={{margin: 0}}>
                                {getFieldDecorator("end", { initialValue: allTotal})(<InputNumber style={{width: 100}} placeholder="请输入人数" min={0} max={allTotal}/>)}
                            </FormItem>
                        </div>
                    </FormItem>
                    <FormItem {...Target} label="群发的人数：">
                        <div>{form.getFieldValue("end") - form.getFieldValue("start")}</div>
                    </FormItem>
                    <FormItem {...Target} label="上次群发的时间段" extra="群发的对象 不包括 该时间段之间的好友">
                        {getFieldDecorator("regtime")(
                            <RangePicker style={{width: "100%"}} format="YYYY-MM-DD HH:mm:ss" showTime allowClear={false}/>
                        )}
                    </FormItem>
                </Modal>
            </Form>

        </div>

    )
}
const setForm = Form.create()(SelectForm)
export default setForm
