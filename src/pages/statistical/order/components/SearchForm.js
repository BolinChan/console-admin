
import { Form, Input, Row, Col, Select, DatePicker, Cascader} from "antd"
import moment from "moment"
import { area } from "../../../../utils/area"
import styles from "../../page.css"
import styles1 from "../../../redpackage/components/RecordForm.css"
const { RangePicker } = DatePicker
const FormItem = Form.Item
const Option = Select.Option
const Search = Input.Search

const SearchForm = ({ form, handleSubmit, orderStore, loading}) => {
    const { getFieldDecorator } = form
    const onSubmit = (e) => {
        form.validateFields((err, values) => {
            if (!err) {
                if (handleSubmit) {
                    const {time} = values
                    if (time) {
                        let starttime = moment(time[0]._d).format("YYYY-MM-DD")
                        let endtime = moment(time[1]._d).format("YYYY-MM-DD")
                        values.time = [starttime, endtime]
                    }
                    handleSubmit(values)
                }
            }
        })
    }
    const onChange = () => {
        onSubmit()
    }
    const statusLst = [
        { name: "全部订单", value: "全部订单" },
        { name: "取消订单", value: -1 },
        { name: "待付款订单", value: 0 },
        { name: "已付款订单", value: 1 },
        { name: "已发货订单", value: 2 },
        { name: "成功订单", value: 3 },
        { name: "退货中订单", value: 4 },
        { name: "退货完成订单", value: 5 },
    ]
    return (
        <Form onSubmit={onSubmit} style={{marginBottom: "20px"}}>
            <Row gutter={24}>
                <Col span={6}>
                    <FormItem style={{marginBottom: 0}}>
                        {getFieldDecorator("order_sn")(
                            <Search placeholder="搜索订单号" className={styles.w1} onSearch={this.searchNum} />)}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem style={{marginBottom: 0}}>
                        {getFieldDecorator("phone")(
                            <Search placeholder="搜索手机号码" className={styles.w1} onSearch={this.searchNum} />)}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem style={{marginBottom: 0}}>
                        {getFieldDecorator("wangwang")(
                            <Search placeholder="搜索旺旺昵称" className={styles.w1} onSearch={this.searchNum} />)}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem style={{marginBottom: 0}}>
                        {getFieldDecorator("area")(
                            <Cascader options={area} placeholder="省市区选择" className={styles.w1} onChange={this.areaChange}/>)}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem style={{marginBottom: 0}}>
                        {getFieldDecorator("shop_id")(
                            <Select placeholder="全部店铺" className={styles.w1} onChange={onChange}>
                                <Option value=''>全部店铺</Option>
                                {orderStore && orderStore.map((item) => (
                                    <Option key={item.id} value={item.id}>{item.name}</Option>
                                ))}
                            </Select>)}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem style={{marginBottom: 0}}>
                        {getFieldDecorator("status")(
                            <Select placeholder="订单状态" className={styles.w1} onChange={onChange}>
                                {statusLst.map((item) => (
                                    <Option value={item.value} key={item.value}>{item.name}</Option>
                                ))}
                            </Select>)}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem style={{marginBottom: 0}}>
                        {getFieldDecorator("time", {initialValue: [moment().subtract(7, "days"), moment().add(0, "days")] })(
                            <RangePicker className={styles.w1} allowClear={false}/>
                        )}
                    </FormItem>
                </Col>
                <Col span={6}>
                    <FormItem style={{margin: 0, display: "flex"}}>
                        <div className={styles1.moneyInput + " " + styles.w1} style={{margin: 0}}>
                            <FormItem className={styles1.input1}>{getFieldDecorator("minprice")(<Input autoComplete="off" placeholder="最小发放金额" />)}</FormItem>
                            <FormItem className={styles1.interval}>
                                <Input placeholder="~" disabled />
                            </FormItem>
                            <FormItem className={styles1.input2}>{getFieldDecorator("maxprice")(<Input autoComplete="off" placeholder="最大发放金额" />)}</FormItem>
                        </div>
                    </FormItem>
                </Col>
                {/* <Col span={1}>
                    <FormItem style={{marginBottom: 0}}>
                        <Button type="primary" htmlType="submit" loading={loading}>
                                搜索
                        </Button>
                    </FormItem>
                </Col> */}
            </Row>
        </Form>
    )
}
const RecordSearcheForm = Form.create()(SearchForm)
export default RecordSearcheForm

