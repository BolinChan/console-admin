import { Form, Input, Row, Col, Select, Button, DatePicker, Popconfirm } from "antd"
import moment from "moment"
import SearchInput from "../../../components/SearchInput"

moment.locale("zh-cn")
const FormItem = Form.Item
const { RangePicker } = DatePicker
const Option = Select.Option
const FriendForm = ({ action, form, wechat, dispatch, handleSubmit, weChatList, typeList, selectedRowKeys, deleteConfirm }) => {
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
            let { time, WeChatId, excuse_account, p_type } = values
            let reg_time1 = time && moment(time[0]._d).format("YYYY-MM-DD") + " 00:00:00"
            let reg_time2 = time && moment(time[1]._d).format("YYYY-MM-DD") + " 23:59:59"
            WeChatId === "-1" && (WeChatId = undefined)
            p_type === "-1" && (p_type = undefined)
            if (!err) {
                if (action === "fetchCircle") {
                    dispatch({
                        type: `vertisy/${action}`,
                        payload: { WeChatId, excuse_account, p_type, reg_time1, reg_time2 },
                    })
                    handleSubmit && handleSubmit({WeChatId, excuse_account, p_type, reg_time1, reg_time2 })
                }
                if (action === "fetchQunfa") {
                    dispatch({
                        type: `vertisy/${action}`,
                        payload: { WeChatId, excuse_account, ContentType: p_type, reg_time1, reg_time2 },
                    })
                    handleSubmit && handleSubmit({ WeChatId, excuse_account, ContentType: p_type, reg_time1, reg_time2 })
                }
            }
        })
    }
    const submitAll = () => {
        dispatch({
            type: `vertisy/${action}`,
        })
        form.setFieldsValue({
            WeChatId: undefined,
            excuse_account: "",
            p_type: "-1",
            time: undefined,
        })
        handleSubmit && handleSubmit({})
    }
    const hasSelected = selectedRowKeys && selectedRowKeys.length > 0
    return (
        <Form className="searchForm" onSubmit={onSubmit}>
            <Row gutter={24}>
                <Col span={8}>
                    <FormItem {...formItemLayout} label="所属微信">
                        {getFieldDecorator("WeChatId")(
                            <SearchInput data={weChatList}></SearchInput>
                        )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem {...formItemLayout} label="操作人账号">
                        {getFieldDecorator("excuse_account")(<Input autoComplete="off" placeholder="请输入操作人账号" />)}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem {...formItemLayout} label="消息类型">
                        {getFieldDecorator("p_type", { initialValue: "-1" })(
                            <Select>
                                <Option value="-1">显示全部</Option>
                                {typeList.map((item) => (
                                    <Option key={item.id} value={item.id}>
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem {...formItemLayout} label="创建日期">
                        {getFieldDecorator("time")(<RangePicker allowClear={false} style={{ width: "100%" }} format="YYYY-MM-DD"
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
                            }}/>)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem {...formItemLayout} label=" ">
                        <Button type="primary" htmlType="submit" className="mr10">
                            搜索
                        </Button>
                        <Button type="primary" onClick={submitAll} className="mr10">
                            重置
                        </Button>
                        <Popconfirm title="确定要删除吗？" onConfirm={deleteConfirm}>
                            <Button type="danger" disabled={!hasSelected} className="mr10">批量删除</Button>
                            {hasSelected && <span>已选择 {selectedRowKeys && selectedRowKeys.length} 项</span>}
                        </Popconfirm>
                    </FormItem>
                </Col>
            </Row>
        </Form>
    )
}
const RecordSearcheForm = Form.create()(FriendForm)
export default RecordSearcheForm
