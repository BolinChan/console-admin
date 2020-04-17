import { Form, Input, Row, Col, Select, Button, DatePicker, Checkbox } from "antd"
import SelectMultple from "../../../components/SelectMultple"
import { getParameterByName } from "../../../../utils/helper"
import moment from "moment"
const { RangePicker } = DatePicker
const FormItem = Form.Item
const Option = Select.Option
const FriendForm = ({ form, AllReset, tags, handleSubmit, weChatList, selectMatch, accountList, usergroup, onClick, dispatch, dcloading, dcData, weChatlabel, labeltotal, labelpage }) => {
    const { getFieldDecorator } = form
    const formItemLayout = {
        style: { display: "flex" },
        labelCol: { style: { minWidth: 100 } },
        wrapperCol: { style: { flex: 1 } },
        colon: false,
    }
    const onSubmit = (e, isT) => {
        e.preventDefault()
        form.validateFields((err, values) => {
            const { createtime, kefu_wxid, repeat, isdelete } = values
            if (createtime) {
                let start = moment(createtime[0]._d).format("YYYY-MM-DD") + " 00:00:00"
                let end = moment(createtime[1]._d).format("YYYY-MM-DD") + " 23:59:59"
                values.createtime = [start, end]
            }
            if (!err) {
                values.isdelete = isdelete ? "1" : "0"
                values.repeat = repeat ? "1" : "0"
                if (isT === 1) {
                    !kefu_wxid && (values.kefu_wxid = weChatList.map((item) => item.wxid))
                    const data = JSON.stringify({ ...values, export: "1", token: window.sessionStorage.getItem("token") })
                    dcData && dcData(data)
                    return
                }
                if (handleSubmit) {
                    handleSubmit(values)
                }
            }
        })
    }
    const submitAll = () => {
        form.resetFields() // 清空数据
        form.setFieldsValue({ repeat: false, isdelete: false })
        AllReset && AllReset()
    }
    let zuname = getParameterByName("d", location.hash) && usergroup && usergroup.find((item) => item.id === getParameterByName("d", location.hash))
    return (
        <Form className="searchForm" onSubmit={onSubmit}>
            <Row gutter={24}>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="所属微信">
                        {getFieldDecorator("kefu_wxid")(
                            <SelectMultple data={weChatList} placeholder="请选择所属微信" />
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="好友昵称/备注">
                        {getFieldDecorator("nick")(<Input autoComplete="off" placeholder="请输入好友昵称/备注" />)}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="城市">
                        {getFieldDecorator("city")(<Input autoComplete="off" placeholder="请输入城市" />)}
                    </FormItem>
                </Col>
                <Col span={6} >
                    <FormItem {...formItemLayout} label="所在分组" >
                        {getFieldDecorator("fname", { initialValue: zuname && zuname.fenzu_name || "" })(
                            <Select>
                                <Option value="">显示全部</Option>
                                {usergroup &&
                                    usergroup.map((item) => (
                                        <Option key={item.id} value={item.fenzu_name}>
                                            {item.fenzu_name}
                                        </Option>
                                    ))}
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="所属客服" >
                        {getFieldDecorator("zids")(
                            <SelectMultple data={accountList} placeholder="请选择客服" />
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="选择标签" >
                        {getFieldDecorator("tagid")(
                            <SelectMultple istag={true} data={tags} placeholder="请选择标签" dispatch={dispatch} />
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="微信标签" >
                        {getFieldDecorator("wxTag")(
                            <SelectMultple istag={true} page={labelpage} total={labeltotal} type="wxTag" data={weChatlabel} placeholder="请选择微信标签" dispatch={dispatch} />
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="选择日期" >
                        {getFieldDecorator("createtime")(
                            <RangePicker style={{ width: "100%" }} format="YYYY-MM-DD" ranges={{
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
                            }} />
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem {...formItemLayout} label="旺旺号" >
                        {getFieldDecorator("buyer_name")(<Input autoComplete="off" placeholder="请输入旺旺号" />)}
                    </FormItem>
                </Col>
                <Col span={6} >
                    <FormItem {...formItemLayout} label="主动" >
                        {getFieldDecorator("statuss", { initialValue: "" })(
                            <Select>
                                <Option value="">显示全部</Option>
                                <Option value={0}>客服主动</Option>
                                <Option value={1}>好友主动</Option>
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem {...formItemLayout} label=" ">
                        <div className="f">
                            <FormItem>
                                {getFieldDecorator("repeat")(<Checkbox checked={form.getFieldValue("repeat")}>只显示重复好友</Checkbox>)}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator("isdelete")(<Checkbox checked={form.getFieldValue("isdelete")}>只显示删除好友</Checkbox>)}
                            </FormItem>
                        </div>
                    </FormItem>
                </Col>
                <Col span={24}>
                    <FormItem {...formItemLayout} label=" ">
                        <Button type="primary" className="mr10" htmlType="submit">搜索 </Button>

                        <Button type="primary" className="mr10" onClick={submitAll}>重置</Button>

                        <Button type="primary" className="mr10" onClick={selectMatch("selectFriend", "分配搜索结果", "sou")}>分配搜索结果</Button>

                        <Button type="primary" className="mr10" onClick={selectMatch("deleteSelectFriend", "取消分配", "sou")}>取消分配</Button>

                        <Button type="primary" className="mr10" onClick={onClick}>批量编辑标签</Button>

                        <Button type="primary" className="mr10" onClick={selectMatch("getHistoryMsg", "同步搜索结果", "sou")}>同步搜索结果</Button>
                        <Button loading={dcloading} type="primary" className="mr10" onClick={(e) => onSubmit(e, 1)}>导出搜索结果</Button>
                    </FormItem>
                </Col>
            </Row>
        </Form >
    )
}
const RecordSearcheForm = Form.create()(FriendForm)
export default RecordSearcheForm
