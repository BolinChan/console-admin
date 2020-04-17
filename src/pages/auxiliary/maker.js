import { Component } from "react"
import { Table, Popconfirm, Button, Modal, Form, Input, Icon, Switch } from "antd"
import { connect } from "dva"
const FormItem = Form.Item

class Page extends Component {
    state = { visible: false }
    deleteConfirm = (id) => {
        this.props.dispatch({
            type: "auxiliary/MakerDel",
            payload: { id },
        })
    }
    handleOk = () => {
        const { dispatch, form } = this.props
        const { action, record } = this.state
        form.validateFields((err, values) => {
            if (!err) {
                if (action === "MakerEdit" && record) {
                    values.id = record.id
                }
                values.isopen = values.isopen ? 1 : 2
                dispatch({
                    type: `auxiliary/${action}`,
                    payload: values,
                })
                this.setState({
                    visible: false,
                })
            }
        })
    }
    showModel = (action, record) => () => {
        this.setState({ visible: true, record, action })
    }
    handleCancel = () => {
        this.setState({ visible: false, record: false })
    }
    onChangeSwitch = (item) => (isopen) => {
        this.props.dispatch({
            type: "auxiliary/MakerEdit",
            payload: { ...item, id: item.id, isopen: isopen ? "1" : "2" },
        })
    }
    render () {
        const { makerList, loading, form } = this.props
        const { record, visible } = this.state
        const { getFieldDecorator } = form
        const showTotal = () => (
            <span style={{ marginTop: 5, color: "rgba(0,0,0,0.5)", display: "block" }}>总数{makerList && makerList.length}条</span>
        )
        const paginationConfig = {
            total: makerList && makerList.length,
            defaultPageSize: 20,
            showTotal,

        }
        const columns = [
            { title: "创客帐号名称", dataIndex: "MakerUser" },
            { title: "状态", dataIndex: "isopen", render: (isopen, item) => <Switch checkedChildren="开启" unCheckedChildren="关闭" checked={isopen === "1"} onChange={this.onChangeSwitch(item)} /> },
            {
                title: "操作", key: "operation", render: (item) =>
                    <div>
                        <Button type="primary" onClick={this.showModel("MakerEdit", item)} >编辑</Button>
                        <Popconfirm title="确定要删除吗？" onConfirm={() => this.deleteConfirm(item.id)}>
                            <Button className="mar5" type="danger">删除</Button>
                        </Popconfirm>
                    </div>,
            },
        ]
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
            colon: false,
        }
        return (
            <div className="pad10">
                <div className="pad10">
                    <Button type="primary" onClick={this.showModel("MakerAdd")} disabled={makerList && makerList.length > 0}>添加创客帐号</Button>
                </div>
                <div className="pad10">
                    <Table dataSource={makerList} bordered={true} pagination={paginationConfig} rowKey="id" columns={columns} simple loading={loading} />
                </div>
                <Modal title={record ? "修改信息" : "添加帐号"} visible={visible} onOk={this.handleOk} onCancel={this.handleCancel} destroyOnClose={true}>
                    <Form>
                        <FormItem {...formItemLayout} label="状态">
                            {getFieldDecorator("isopen")(
                                <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked={record && record.isopen === 1} />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="创客账号">
                            {getFieldDecorator("MakerUser", { initialValue: record && record.MakerUser, rules: [{ required: true, message: "请填写帐号" }] })(
                                <Input autoComplete="off" placeholder="请输入帐号" />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="密码">
                            {getFieldDecorator("MakerPwd", { rules: [{ required: true, message: "请填写密码" }] })(
                                <Input prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />} type="password" autoComplete="off" placeholder="请输入密码" />
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}
function mapStateToProps (state) {
    const { makerList } = state.auxiliary
    return {
        makerList,
        loading: state.loading.models.auxiliary,
    }
}
const setForm = Form.create()(Page)
export default connect(mapStateToProps)(setForm)
