import { Modal, Form, Input, Icon, Cascader, Radio } from "antd"
import { Component } from "react"
const FormItem = Form.Item
const TextArea = Input.TextArea
const RadioGroup = Radio.Group
class NewAccount extends Component {
    state = { visible: false }
    showModal = () => {
        this.setState({
            visible: true,
        })
    }
    handleOk = (e) => {
        const { form, onOk, partmentList, record } = this.props
        form.validateFields((err, values) => {
            const { did } = values
            if (record) {
                values.ziid = record.id
                values.department = record.departmen
            }
            if (did) {
                let department = partmentList.find((f) => f.id === did[did.length - 1])
                values.department = department.name
            }
            values.password = values.pwd || ""
            if (!err) {
                onOk(values)
                this.setState({
                    visible: false,
                })
            }
        })
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        })
    }
    displayRender = (label) => label[label.length - 1]
    render () {
        const { form, record, partmentList } = this.props
        const { getFieldDecorator } = form
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 18 },
        }
        let dataList = partmentList && partmentList.filter((item) => item.pid === "0")
        let nextList = partmentList && partmentList.filter((item) => item.pid !== "0")
        const loop = (data) => data && data.map((item) => {
            let childrenList = []
            nextList.map((mess, index) => {
                if (mess.pid === item.id) {
                    childrenList.push({ label: mess.name, value: mess.id, id: mess.id })
                    mess.istrue = "1"
                }
            })
            nextList = nextList.filter((row) => row.istrue !== 1)
            if (childrenList.length > 0) {
                item.children = childrenList
                nextList.length > 0 && loop(childrenList)
            } else {
                item.children = []
            }
            return { label: item.name, value: item.id, children: item.children }
        })
        const options = ["auto.png", "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg", "12.jpg"]
        return (
            <span>
                <span type="primary" onClick={this.showModal}>
                    {this.props.children}
                </span>
                <Modal title={record ? "编辑账号" : "新增账号"} destroyOnClose={true} visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}
                    width={640}
                    wrapClassName="wrapClass"
                    style={{ height: "70%", overflow: "hidden"}}
                    bodyStyle={{ height: "calc(100% - 108px)", overflow: "auto", padding: "20px" }}
                >
                    <Form>
                        <FormItem {...formItemLayout} label="登录账号">
                            {!record && getFieldDecorator("accountnum", { rules: [{ required: true, message: "请填写账号!" }] })(<Input autoComplete="off" />)}
                            {record && record.accountnum && <div>{record.accountnum}</div>}
                        </FormItem>
                        <FormItem {...formItemLayout} label={record ? "重置密码" : "登录密码"}>
                            {getFieldDecorator("pwd", { rules: [{ required: !record, message: "请输入密码!" }] })(
                                <Input prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />} type="password" autoComplete="off" placeholder="请输入密码" />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="真实姓名">
                            {getFieldDecorator("realname",
                                { initialValue: record && record.realname, rules: [{ required: true, message: "请输入真实姓名!" }] })(<Input autoComplete="off" placeholder="请输入真实姓名" />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="用户昵称" >
                            {getFieldDecorator("nickname",
                                { initialValue: record && record.nickname, rules: [{ required: true, message: "请填写昵称!" }] })(<Input autoComplete="off" placeholder="请输入昵称" />)}
                        </FormItem>
                        <FormItem {...formItemLayout} label="用户部门">
                            {getFieldDecorator("did")(
                                partmentList && partmentList.length > 0 ? <Cascader
                                    options={loop(dataList)}
                                    expandTrigger="hover"
                                    displayRender={this.displayRender}
                                    placeholder="请选择部门"
                                /> : <span>暂无部门</span>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="选择头像">
                            {getFieldDecorator("headimg", {initialValue: record && record.headimg || ("//admin.scrm.la/headImg/" + options[0])})(
                                <RadioGroup>
                                    {options.map((item) => {
                                        let style = { width: 60, height: 60, padding: 5, borderRadius: 4, margin: 2, textAlign: "right",
                                            background: `url(//admin.scrm.la/headImg/${item}) no-repeat`, backgroundSize: "cover",
                                            boxShadow: "0px 0px 6px rgba(0, 0, 0, 0.3)",
                                        }
                                        return <Radio key={item} style={style} value={"//admin.scrm.la/headImg/" + item}></Radio>
                                    })}
                                </RadioGroup>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="用户备注">
                            {getFieldDecorator("userinfo", { initialValue: record && record.userinfo })(<TextArea autosize={{ minRows: 6 }} />)}
                        </FormItem>
                    </Form>
                </Modal>
            </span>
        )
    }
}
const setForm = Form.create()(NewAccount)
export default setForm
