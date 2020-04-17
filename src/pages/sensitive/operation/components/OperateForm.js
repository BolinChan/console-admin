import { Form, Row, Col, DatePicker, Select, Button } from "antd"
// import SetModel from "./SetModel"
import moment from "moment"
import "moment/locale/zh-cn"
const { RangePicker } = DatePicker
const Option = Select.Option
const FormItem = Form.Item
const OperateForm = ({ form, wechat, handleSubmit, RevealAll, setFun, dispatch, list, loading }) => {
    const { getFieldDecorator } = form
    const formItemLayout = {
        style: { display: "flex" },
        labelCol: { style: { minWidth: 100 } },
        wrapperCol: { style: { flex: 1 } },
        colon: false,
    }
    const onSubmit = (e) => {
        e.preventDefault()
        form.validateFields((err, values) => {
            let { sendtime, starttime, endtime, status, is_exception } = values
            if (!err) {
                if (handleSubmit) {
                    if (sendtime && sendtime.length > 0) {
                        starttime = moment(sendtime[0]._d).format("YYYY-MM-DD")
                        endtime = moment(sendtime[1]._d).format("YYYY-MM-DD")
                    }
                    values = { is_exception, status, starttime, endtime }
                    handleSubmit(values)
                }
            }
        })
    }
    const AllFun = () => {
        form.setFieldsValue({
            sendtime: [],
            status: "",
            is_exception: "",
        })
        RevealAll()
    }
    return (
        <Form className="searchForm" onSubmit={onSubmit}>
            <Row gutter={24}>
                {/* <Col span={8}>
                    <FormItem {...formItemLayout} label="敏感类型">
                        {getFieldDecorator("status", { initialValue: "" })(
                            <Select>
                                <Option value="">显示全部</Option>
                                <Option value="0">未领取</Option>
                                <Option value="1">已领取</Option>
                                <Option value="2">红包错误</Option>
                            </Select>
                        )}
                    </FormItem>
                </Col> */}
                <Col span={8}>
                    <FormItem {...formItemLayout} label="状态">
                        {getFieldDecorator("is_exception", { initialValue: "" })(
                            <Select>
                                <Option value="">显示全部</Option>
                                <Option value="1">异常</Option>
                                <Option value="2">正常</Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem {...formItemLayout} label="发生时间">
                        {getFieldDecorator("sendtime")(<RangePicker style={{ width: "100%" }} ranges={{
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
                        }}/>)}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem {...formItemLayout}>
                        <Button type="primary" htmlType="submit">
                            搜索
                        </Button>
                        &nbsp; &nbsp;
                        <Button type="primary" onClick={AllFun}>
                            重置
                        </Button>
                        &nbsp; &nbsp;
                        {/* <SetModel loading={loading} dispatch={dispatch} list={list} /> */}
                    </FormItem>
                </Col>
            </Row>
        </Form>
    )
}
const RecordSearcheForm = Form.create()(OperateForm)
export default RecordSearcheForm
