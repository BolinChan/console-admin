import { Form, Button, DatePicker, Select, Row, Col, Input, AutoComplete } from "antd"
import moment from "moment"
import "moment/locale/zh-cn"
moment.locale("zh-cn")
const Option = Select.Option
const { RangePicker } = DatePicker
const FormItem = Form.Item
const RecordForm = ({ form, onSubmit, handleChange, wxRecord, device_wxnick, handleSel, dcloading, dc }) => {
    const handleSubmit = (e) => {
        e.preventDefault()
        form.validateFields((err, values) => {
            if (!err) {
                let { status, excuse_account, addtime } = values
                status = status === "-1" ? undefined : status
                let addtime1 = addtime && moment(addtime[0]._d).format("YYYY-MM-DD 00:00:00")
                let addtime2 = addtime && moment(addtime[1]._d).format("YYYY-MM-DD 23:59:59")
                if (onSubmit) {
                    onSubmit({ status, excuse_account, addtime1, addtime2, device_wxnick })
                }
            }
        })
    }
    const { getFieldDecorator } = form
    const formItemLayout = {
        style: { display: "flex" },
        labelCol: { style: { minWidth: 100 } },
        wrapperCol: { style: { flex: 1 } },
        colon: false,
    }
    const reset = (e) => {
        if (!e.length) {
            form.resetFields()
            onSubmit()
            handleSel("")
        }
    }
    return (
        <div>
            <Form className="searchForm" onSubmit={handleSubmit}>
                <Row gutter={24}>
                    <Col span={8}>
                        <FormItem label="微信昵称/备注" {...formItemLayout}>
                            <AutoComplete
                                dataSource={wxRecord}
                                style={{ width: "100%" }}
                                onSelect={handleSel}
                                onChange={handleChange}
                                value={device_wxnick}
                                placeholder="请输入微信昵称/备注"
                            />
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="操作人" {...formItemLayout}>
                            {getFieldDecorator("excuse_account")(<Input autoComplete="off" placeholder="请输入操作人" />)}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="执行状态" {...formItemLayout}>
                            {getFieldDecorator("status", { initialValue: "-1" })(
                                <Select style={{ width: "100%" }}>
                                    <Option value="-1">显示全部</Option>
                                    <Option value="0">未执行</Option>
                                    <Option value="1">已执行</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem {...formItemLayout} label="导入日期">
                            {getFieldDecorator("addtime")(
                                <RangePicker
                                    ranges={{
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
                                    }}
                                    style={{ width: "100%" }}
                                    format="YYYY-MM-DD" onChange={reset} />)}
                        </FormItem>
                    </Col>
                    <Col span={16}>
                        <FormItem {...formItemLayout} label=" ">
                            <Button type="primary" htmlType="submit" className="mr10">
                                搜索
                            </Button>
                            <Button type="primary" onClick={() => reset([])} className="mr10">
                                重置
                            </Button>
                            <Button type="primary" onClick={dc} loading={dcloading}>导出未执行号码</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}
const WrappeForm = Form.create()(RecordForm)
export default WrappeForm
