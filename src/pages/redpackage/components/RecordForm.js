import { Form, Input, Row, Col, DatePicker, Select, Button } from "antd"
import styles from "./RecordForm.css"
import moment from "moment"
import "moment/locale/zh-cn"
const { RangePicker } = DatePicker
const Option = Select.Option
const FormItem = Form.Item
const RecordSearche = ({ form, wechat, handleSubmit, RevealAll, execution, btnloading }) => {
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
            let { time, min, max } = values
            if (!err) {
                if (handleSubmit) {
                    if (time && time.length > 0) {
                        let start = moment(time[0]._d).format("YYYY-MM-DD 00:00:00")
                        let end = moment(time[1]._d).format("YYYY-MM-DD 23:59:59")
                        values.time = [start, end]
                    }
                    if (min && max) {
                        values.money = [min, max]
                    }
                    handleSubmit(values)
                }
            }
        })
    }
    const AllFun = () => {
        form.resetFields() // 清空数据
        RevealAll()
    }
    return (
        <Form className="searchForm" onSubmit={onSubmit}>
            <Row gutter={24}>
                <Col span={8}>
                    <FormItem {...formItemLayout} label="操作人">
                        {getFieldDecorator("user")(<Input autoComplete="off" placeholder="搜索发送操作人" />)}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem {...formItemLayout} label="发放金额" style={{ margin: 0, display: "flex" }}>
                        <div className={styles.moneyInput}>
                            <FormItem className={styles.input1}>{getFieldDecorator("min")(<Input autoComplete="off" placeholder="最小发放金额" />)}</FormItem>
                            <FormItem className={styles.interval}>
                                <Input placeholder="~" disabled />
                            </FormItem>
                            <FormItem className={styles.input2}>{getFieldDecorator("max")(<Input autoComplete="off" placeholder="最大发放金额" />)}</FormItem>
                        </div>
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem {...formItemLayout} label="红包状态" >
                        {getFieldDecorator("status", { initialValue: "" })(
                            <Select>
                                <Option value="">显示全部</Option>
                                {/* <Option value="0">未领取</Option> */}
                                <Option value="1">已领取</Option>
                                <Option value="2">红包错误</Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem {...formItemLayout} label="发放日期" >
                        {getFieldDecorator("time")(<RangePicker format="YYYY-MM-DD" style={{ width: "100%" }} ranges={{
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
                    <FormItem {...formItemLayout} label="红包备注" >
                        {getFieldDecorator("hbremark")(<Input autoComplete="off" placeholder="请输入红包备注" />)}
                    </FormItem>

                </Col>
                <Col span={8}>
                    <FormItem {...formItemLayout} label="关联订单" >
                        {getFieldDecorator("xgorder")(<Input autoComplete="off" placeholder="请输入关联的订单" />)}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem {...formItemLayout} label="昵称" >
                        {getFieldDecorator("nickname")(<Input autoComplete="off" placeholder="接收人/领取人昵称" />)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem {...formItemLayout} label=" ">
                        <Button type="primary" htmlType="submit">
                            搜索
                        </Button>
                        &nbsp; &nbsp;
                        <Button type="primary" onClick={AllFun}>
                            重置
                        </Button>
                        &nbsp; &nbsp;
                        <Button type="primary" onClick={execution} loading={btnloading}>
                            导出搜索数据
                        </Button>
                    </FormItem>
                </Col>
            </Row>
        </Form>
    )
}
const RecordSearcheForm = Form.create()(RecordSearche)
export default RecordSearcheForm
