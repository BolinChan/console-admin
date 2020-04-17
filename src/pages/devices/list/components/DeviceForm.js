import { Form, Input, Row, Col, Select, Button } from "antd"
import { Component } from "react"
import { getParameterByName } from "../../../../utils/helper"
const FormItem = Form.Item
const Option = Select.Option
class DeviceForm extends Component {
    state={first: true}
    shouldComponentUpdate () {
        const zu_id = getParameterByName("d", location.hash)
        if (!zu_id && this.state.first) {
            this.props.form.setFieldsValue({
                zu_id: "",
            })
            this.setState({first: false})
        }
        return true
    }
     onSubmit = (e) => {
         e.preventDefault()
         this.props.form.validateFields((err, values) => {
             if (!err) {
                 if (this.props.handleSubmit) {
                     if (values.isoff === "") {
                         values.isoff = undefined
                     }
                     this.props.handleSubmit(values)
                 }
             }
         })
     }
     submitAll = () => {
         this.props.form.resetFields() // 清空数据
         if (this.props.handleSubmit) {
             this.props.handleSubmit()
         }
     }
     render () {
         const { form, list } = this.props
         const { getFieldDecorator } = form
         const formItemLayout = {
             style: { display: "flex" },
             labelCol: { style: { minWidth: 80 } },
             wrapperCol: { style: { flex: 1 } },
             colon: false,
         }
         const zu_id = getParameterByName("d", location.hash)
         return (
             <Form className="searchForm" onSubmit={this.onSubmit}>
                 <Row gutter={24}>
                     <Col span={6}>
                         <FormItem {...formItemLayout} label="设备号">
                             {getFieldDecorator("sncode")(<Input autoComplete="off" placeholder="请输入设备号" />)}
                         </FormItem>
                     </Col>
                     <Col span={6}>
                         <FormItem {...formItemLayout} label="设备名称">
                             {getFieldDecorator("devicename")(<Input autoComplete="off" placeholder="请输入设备名称" />)}
                         </FormItem>
                     </Col>
                     <Col span={6}>
                         <FormItem {...formItemLayout} label="备注">
                             {getFieldDecorator("remark")(<Input autoComplete="off" placeholder="请输入备注" />)}
                         </FormItem>
                     </Col>
                     <Col span={6}>
                         <FormItem {...formItemLayout} label="分组">
                             {getFieldDecorator("zu_id", { initialValue: zu_id ? zu_id : "" })(
                                 <Select>
                                     <Option value="">显示全部</Option>
                                     {list && list.map((item) => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                                 </Select>
                             )}
                         </FormItem>
                     </Col>
                     <Col span={6}>
                         <FormItem {...formItemLayout} label="设备状态">
                             {getFieldDecorator("isoff", { initialValue: "" })(
                                 <Select>
                                     <Option value="">显示全部</Option>
                                     <Option value="1">在线</Option>
                                     <Option value="0">离线</Option>
                                 </Select>
                             )}
                         </FormItem>
                     </Col>
                     <Col span={12}>
                         <FormItem {...formItemLayout} label=" ">
                             <Button type="primary" htmlType="submit">
                                搜索
                             </Button>
                                &nbsp; &nbsp;
                             <Button type="primary" onClick={this.submitAll}>
                                重置
                             </Button>
                         </FormItem>
                     </Col>
                 </Row>
             </Form>
         )
     }
}
const RecordSearcheForm = Form.create()(DeviceForm)
export default RecordSearcheForm
