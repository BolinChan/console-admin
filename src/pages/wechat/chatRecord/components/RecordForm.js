import { Component } from "react"
import { Form, Button, Row, Col, DatePicker, Select, Input } from "antd"
import SelectMultple from "../../../components/SelectMultple"
import SearchInput from "../../../components/SearchInput"
import TableRecord from "./TableRecord"
import moment from "moment"
import "moment/locale/zh-cn"
moment.locale("zh-cn")
const FormItem = Form.Item
const { RangePicker } = DatePicker
const { Option } = Select
class Record extends Component {
    state = { isChecked: false, imageNumber: 0, current: 1, pagesize: 20, msg: "" }
    onSubmitFUn = (page) => {
        const { form, accountList } = this.props
        form.validateFields((err, values) => {
            if (!err) {
                let { deviceIds, fxiedTime, operator, type, keyword, nick } = values
                if (operator && operator.length > 0) {
                    let list = accountList.find((item) => item.id === operator[0])
                    list && (operator = list.accountnum)
                }
                let s_time = moment(fxiedTime[0]._d).format("YYYY-MM-DD 00:00:00")
                let e_time = moment(fxiedTime[1]._d).format("YYYY-MM-DD 23:59:59")
                if (!deviceIds) {
                    deviceIds = this.props.weChatList.map((item) => item.wxid)
                } else {
                    deviceIds = [deviceIds]
                }
                this.props.dispatch({
                    type: "message/fetchLogs",
                    payload: { page, datatime: [s_time, e_time], deviceIds, operator, type, operator_type: "kefu", keyword, nick },
                })
            }
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.onSubmitFUn(1)
        this.setState({ current: 1 })
    }
    AllSubmit = () => {
        const { dispatch, form, weChatList } = this.props
        form.resetFields()
        form.setFieldsValue({ fxiedTime: [moment().subtract(1, "days"), moment().add(1, "days")] })
        dispatch({
            type: "message/fetchLogs",
            payload: { page: 1, datatime: [moment().subtract(1, "days"), moment().add(1, "days")], deviceIds: weChatList.map((item) => item.wxid) },
        })
        this.setState({ current: 1 })
    }
    // 选择页数
    pageChangeHandler = (page, pagesize) => {
        this.setState({ current: page, pagesize })
        this.onSubmitFUn(page, pagesize)
    }

    render () {
        const { getFieldDecorator } = this.props.form
        const { weChatList, dispatch, logs, loading, total, accountList } = this.props
        const { pagesize, current } = this.state
        const formItemLayout = {
            style: { display: "flex" },
            labelCol: { style: { minWidth: 100 } },
            wrapperCol: { style: { flex: 1 } },
        }
        return (
            <div>
                <Form className="searchForm" onSubmit={this.handleSubmit}>
                    <Row gutter={24}>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label="选择微信">
                                {getFieldDecorator("deviceIds")(<SearchInput data={weChatList}></SearchInput>)}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label="操作人" >
                                {getFieldDecorator("operator")(
                                    <SelectMultple data={accountList} placeholder="请选择操作人"></SelectMultple>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label="好友昵称" >
                                {getFieldDecorator("nick")(
                                    <Input placeholder="请输入昵称" />
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8} >
                            <FormItem {...formItemLayout} label="消息类型" >
                                {getFieldDecorator("type")(
                                    <Select placeholder="请选择类型">
                                        <Option value="">显示全部</Option>
                                        <Option value={1}>文本消息</Option>
                                        <Option value={2}>图片消息</Option>
                                        <Option value={4}>视频消息</Option>
                                        <Option value={5}>系统消息</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label="消息内容">
                                {getFieldDecorator("keyword")(
                                    <Input autoComplete="off" placeholder="请输入内容"></Input>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem {...formItemLayout} label="创建日期">
                                {getFieldDecorator("fxiedTime", { initialValue: [moment().subtract(1, "days"), moment().add(1, "days")] })(
                                    <RangePicker style={{ width: "100%" }} format="YYYY-MM-DD" allowClear={false} ranges={{
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
                        <Col span={8}>
                            <FormItem {...formItemLayout} label=" " colon={false}>
                                <Button type="primary" htmlType="submit" className="mr10">
                                    搜索
                                </Button>
                                <Button onClick={this.AllSubmit} type="primary">
                                    重置
                                </Button>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <br />
                <TableRecord
                    pageChangeHandler={this.pageChangeHandler}
                    current={current}
                    pageSize={pagesize}
                    weChatList={weChatList || []}
                    dispatch={dispatch}
                    logs={logs}
                    loading={loading}
                    total={total}
                />
            </div>
        )
    }
}
const RecordDemo = Form.create()(Record)
export default RecordDemo
