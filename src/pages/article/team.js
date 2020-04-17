import { Table, Button, Switch, Modal, Form, Input, Icon} from "antd"
import { Component } from "react"
import { connect} from "dva"
import Pay from "./components/Pay"
const FormItem = Form.Item
const columns = [
    { title: "登录账号", dataIndex: "accountnum" },
    { title: "姓名", dataIndex: "realname", render: (name) => name || "未设置"},
    { title: "昵称", dataIndex: "nickname", render: (name) => name || "未设置"},
    { title: "文章数量", dataIndex: "gNum", render: (gNum, item) =>
        <div>公有文章：<a className="f18">{gNum || 0}</a>，
        私有文章：<a className="f18">{item.sNum || 0}</a></div> },
    { title: "创建时间", dataIndex: "createtime" },
]
const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 18 },
}
class team extends Component {
    state={visible: false}
    // 停用帐号
    onChangeStatus=(record) => async (checked) => {
        this.props.dispatch({
            type: "account/changeStatus",
            payload: { id: record.id, status: checked ? 0 : 1 },
        })
        record.status = checked ? "0" : "1"
        this.setState({record})
    }
    showModal=(action, record) => {
        this.setState({record, action, visible: true})
    }
    // 新增，编辑帐号
    handleOk=() => {
        const {form, dispatch} = this.props
        const {record, action} = this.state
        form.validateFields(async (err, values) => {
            if (!err) {
                values.password = values.pwd
                if (record) {
                    values.ziid = record.id
                }
                await dispatch({type: `account/${action}`, payload: values})
                this.setState({visible: false})
            }
        })
    }
    handleCancel=() => {
        this.setState({visible: false})
    }
    render () {
        const { accountList, loading, form, auth} = this.props
        const {getFieldDecorator} = form
        const {record, visible} = this.state
        const paginationConfig = {
            total: accountList && accountList.length,
            defaultPageSize: 20,
            hideOnSinglePage: true,
            showTotal: () => `共 ${accountList && accountList.length || 0} 条 `,
        }
        columns[0] = { title: "登录账号", dataIndex: "accountnum", render: (accountnum) => accountnum + "@" + auth.accountnum}
        columns[7] = {title: "状态", dataIndex: "status", render: (status, item) => <Switch onChange={this.onChangeStatus(item)} checkedChildren="正常" unCheckedChildren="停用" checked={status !== "1"} />}
        columns[8] = {
            title: "操作",
            key: "operation",
            render: (item) =>
                <Button type="primary" onClick={() => this.showModal("editZAccount", item)} className="mar5">编辑</Button>,
        }
        return (
            <div className="pad10">
                <div className="pad10">
                    <Pay><Button type="primary">新增团队成员</Button></Pay>
                </div>
                <div className="pad10">
                    <Table dataSource={accountList} bordered={true} pagination={paginationConfig} rowKey="id" columns={columns} simple loading={loading} />
                </div>
                <Modal
                    title={record ? "编辑账号" : "新增账号"}
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    width={640}
                    destroyOnClose={true}
                >
                    <Form>
                        <FormItem {...formItemLayout} label="登录账号">
                            {getFieldDecorator("accountnum",
                                record && {initialValue: record.accountnum, rules: [{ required: true, message: "请填写账号!" }] })(<Input autoComplete="off" disabled={!!record} placeholder="请输入帐号"/>)}
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
                    </Form>
                </Modal>

            </div>
        )
    }
}
function mapStateToProps (state) {
    const { accountList} = state.account
    return {
        accountList,
        auth: state.login.auth,
        loading: state.loading.models.account,
    }
}
const setForm = Form.create()(team)
export default connect(mapStateToProps)(setForm)
