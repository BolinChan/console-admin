
import { Checkbox, Select, Radio, Row, DatePicker, Modal, Form, message, Avatar } from "antd"
import styles from "../page.css"
import moment from "moment"
const Option = Select.Option
const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group
const FormItem = Form.Item
const ModifyInfo = ({form, action, usergroup, fielditem, record, visible, handleCancel, dispatch }) => {
    let plainOptions = []
    if (fielditem && fielditem.field_value) {
        fielditem.field_value = fielditem.field_value.replace(/，/ig, ",")
        plainOptions = fielditem.field_value.split(",")
    }
    const visibility = fielditem && (fielditem.type === "5" || fielditem.type === "4")
    const { getFieldDecorator, validateFields } = form
    const modalOk = () => {
        validateFields(async (err, values) => {
            let {date, field_value, fid} = values
            if (!err) {
                let payload = {uid: record.userid, fid}
                if (action === "editfriendfield") {
                    if (date && fielditem.type === "4") {
                        field_value = moment(date._d).format("YYYY-MM-DD")
                    }
                    if (date && fielditem.type === "5") {
                        field_value = moment(date._d).format("YYYY-MM-DD HH:mm:ss")
                    }
                    payload = { wxid: record.wxid, kefu_wxid: record.kefu_wxid, extend_fields: fielditem.fields ? fielditem.fields : {}, userid: record.userid}
                    payload.extend_fields[fielditem.id] = field_value
                }
                await dispatch({ type: `chat/${action}`, payload})
                handleCancel()
            }
        })
    }
    const onDateChange = async (date) => {
        if (!date) {
            return message.error("请选择时间")
        }
        await form.setFieldsValue({date})
        modalOk()
    }
    return (
        <Modal
            title="请选择"
            destroyOnClose={true}
            visible={visible}
            onOk={modalOk}
            onCancel={handleCancel}
            style={{visibility: visibility && "hidden"}}
        >
            {record && !visibility && <Row type="flex" align="middle" className={styles.modalItem}>
                <Avatar shape="square" src={record.headImg} style={{ width: 40, height: 40 }} icon="user" />
                <div className="pad10">
                    <p>昵称：{record.nick}</p>
                    <p>微信：{record.FriendNo || "未知"}</p>
                </div>
            </Row>}
            <Form layout="inline">
                {fielditem
                    ? <div>
                        {visibility && <FormItem className="pad10" label="选择日期：">
                            {getFieldDecorator("date", {initialValue: fielditem.defaultname && moment(fielditem.defaultname)})(
                                <DatePicker
                                    format={fielditem.type === "5" ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD"}
                                    showTime
                                    placeholder="请选择"
                                    onOk={onDateChange}
                                    open={true}
                                />
                            )}
                        </FormItem>}
                        <FormItem label={fielditem.name}>
                            {fielditem.type === "6" && getFieldDecorator("field_value", {initialValue: fielditem.defaultname})(
                                <RadioGroup>
                                    {plainOptions.map((item) => <Radio key={item} value={item}>{item}</Radio>)}
                                </RadioGroup>
                            )}
                            {fielditem.type === "7" && getFieldDecorator("field_value", {initialValue: fielditem.defaultname})(
                                <CheckboxGroup options={plainOptions}/>
                            )}
                        </FormItem>
                    </div>
                    : <FormItem label="选择分组" wrapperCol={{style: {width: "80%"}}} style={{width: "100%"}}>
                        {getFieldDecorator("fid", {initialValue: record && record.fenzu_name})(
                            <Select placeholder="请选择分组">
                                <Option value="0">取消分组</Option>
                                {usergroup && usergroup.map((item) => <Option key={item.id} value={item.id}>{item.fenzu_name}</Option>)}
                            </Select>
                        )}
                    </FormItem>
                }
            </Form>
        </Modal>
    )
}
const RecordSearcheForm = Form.create()(ModifyInfo)
export default RecordSearcheForm
