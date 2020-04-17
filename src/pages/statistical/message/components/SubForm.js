
import { Form, Row, Col, Button, Select, DatePicker} from "antd"
import moment from "moment"
import styles from "../../page.css"
const { RangePicker } = DatePicker
const FormItem = Form.Item
const Option = Select.Option
const SubForm = ({ form, handleSubmit, weChatList, accountList, loading}) => {
    const { getFieldDecorator } = form
    const onSubmit = (e) => {
        e.preventDefault()
        form.validateFields((err, values) => {
            if (!err) {
                if (handleSubmit) {
                    const {time, kefu_wxid, zid} = values
                    let starttime = time && moment(time[0]._d).format("YYYY-MM-DD")
                    let endtime = time && moment(time[1]._d).format("YYYY-MM-DD")
                    handleSubmit({kefu_wxid, zid, endtime, starttime})
                }
            }
        })
    }
    return (
        <Form onSubmit={onSubmit} className={styles.headerItems} style={{marginBottom: "20px"}}>
            <Row gutter={24}>
                <Col span={6} style={{maxWidth: 250}}>
                    <FormItem style={{marginBottom: 0}}>
                        {getFieldDecorator("kefu_wxid", {initialValue: ""})(
                            <Select>
                                <Option value="">全部微信</Option>
                                {weChatList && weChatList.map((item) => <Option key={item.id} value={item.wxid}>{item.remark || item.nickname || item.wxid}</Option>)}
                            </Select>)}
                    </FormItem>
                </Col>
                <Col span={6} style={{maxWidth: 250}}>
                    <FormItem style={{marginBottom: 0}}>
                        {getFieldDecorator("time", {initialValue: [moment().subtract(7, "days"), moment().add(0, "days")] })(
                            <RangePicker allowClear={false} ranges={{
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
                </Col>
                <Col span={1}>
                    <FormItem style={{marginBottom: 0}}>
                        <Button type="primary" htmlType="submit" loading={loading}>
                                搜索
                        </Button>
                    </FormItem>
                </Col>
            </Row>
        </Form>
    )
}
const RecordSearcheForm = Form.create()(SubForm)
export default RecordSearcheForm

