import { Form, Input, Button, Radio, message} from "antd"
import { Component } from "react"
import axios from "axios"
import styles from "../../page.css"
import TextArea from "antd/lib/input/TextArea"
const FormItem = Form.Item
const RadioGroup = Radio.Group
let action = "//wechat.yunbeisoft.com/index_test.php/home/prize/add_prize?access_token=ACCESS_TOKEN"
class AddPoster extends Component {
    state={loading: false}
    onSubmit = (e) => {
        let { form, record, list, posterList} = this.props
        if (!record && posterList) {
            record = posterList[0]
        }
        form.validateFields((err, values) => {
            if (!err) {
                let { result, type} = values
                result = result && result.split("\n")
                if (result && !result[result.length - 1]) {
                    result.splice(result.length - 1, 1)
                }
                let data = {aid: window.sessionStorage.getItem("i"), rid: record.id, ...values, name: " "}
                if (type === "2") {
                    data.result = result.join(",")
                }

                if (list && list.id) {
                    data.id = list.id
                    action = "//wechat.yunbeisoft.com/index_test.php/home/prize/update_prize?access_token=ACCESS_TOKEN"
                }
                this.customRequest({ action, data})
            }
        })
    }
    beforeUpload=(file) => {
        this.setState({file})
        return false
    }
    customRequest = ({ action, data }) => {
        const {handleCancel} = this.props
        const formData = new FormData()
        let token = window.sessionStorage.getItem("token")
        formData.append("token", token)
        this.setState({loading: true})
        if (data) {
            Object.keys(data).map((key) => {
                formData.append(key, data[key])
            })
        }
        axios.post(action, formData).then(({ data: response }) => {
            if (response.error) {
                this.setState({loading: false})
                return message.error(response.msg)
            }
            this.setState({loading: false})
            handleCancel && handleCancel()
            message.success("设置成功")
        })
    }
    inputNumFun = (e) => {
        e.target.value = e.target.value.replace(/[^\d]/g, "")
        this.props.form.setFieldsValue({ expire: e.target.value })
    }
    render () {
        const { form, list, current, prev} = this.props
        const {loading} = this.state
        const { getFieldDecorator } = form
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 17 },
        }
        let userNum = 0
        if (form.getFieldValue("type") === "2" && list && list.used) {
            userNum = list.used.split("\n").length - 1
        }
        return (
            <span>
                <Form onSubmit={this.onSubmit}>
                    <FormItem {...formItemLayout} label="奖品类型">
                        {getFieldDecorator("type", { initialValue: list && list.type || "2" })(<RadioGroup>
                            <Radio value="2">兑换码</Radio>
                            <Radio value="3">自定义链接</Radio>
                        </RadioGroup>)}
                    </FormItem>
                    {list && form.getFieldValue("type") === "2" && <FormItem {...formItemLayout} label="库存数量">{ list.stock_num}</FormItem>}
                    <FormItem {...formItemLayout} label="奖励要求人数">
                        {getFieldDecorator("jl_num", { initialValue: list && list.jl_num })(<Input addonAfter="人" type="number" min="0" onInput={this.inputNumFun} placeholder="不填默认为0" />)}
                    </FormItem>
                    {form.getFieldValue("type") === "2" && <div>
                        {/* target="_blank" */}
                        <FormItem {...formItemLayout} label="兑换码" extra={<a href="//admin.scrm.la/macthCoed/" target="_blank" rel="noopener noreferrer">点击生成随机兑换码</a>}>
                            {getFieldDecorator("result",
                                { initialValue: list && list.result,
                                    rules: [{ required: true, message: "请输入兑换码" }] })(<TextArea placeholder="请输入兑换码" autosize={{ minRows: 6, maxRows: 10 }}/>)}
                        </FormItem>
                        {list && list.used && <FormItem {...formItemLayout} label={`已使用的兑换码（${userNum}）`}>
                            <TextArea value={list.used} readOnly={true} autosize={{maxRows: 10 }}/>
                        </FormItem>}
                    </div>}
                    {form.getFieldValue("type") === "3" && <FormItem {...formItemLayout} label="自定义链接">
                        {getFieldDecorator("url", { initialValue: list && list.url, rules: [{ required: !list, message: "请输入自定义链接" }] })(<Input placeholder="请输入自定义链接"/>)}
                    </FormItem>}
                    <div className={styles.formboot}>
                        {current && <Button className="mr10" onClick={prev}>上一步</Button>}
                        <Button loading={loading} type="primary" onClick={this.onSubmit}>
                                完成
                        </Button>
                    </div>
                </Form>
            </span>
        )
    }
}
const setForm = Form.create()(AddPoster)
export default setForm
