
import { Modal, Form, Input } from "antd"
import { connect } from "dva"
import TableList from "./components/TableList"
import { Component } from "react"
const FormItem = Form.Item
class Page extends Component {
    state = { visible: false }
    showModal = (action, record) => {
        this.setState({
            visible: true,
            action, record,
        })
    }

    handleOk = (e) => {
        const { form, dispatch} = this.props
        const {action, record} = this.state
        form.validateFields((err, values) => {
            if (!err) {
                let payload = {...values}
                if (action === "editusergroup") {
                    payload = {fenzuid: record && record.id, fenzu_name: values.fname}
                }
                dispatch({
                    type: `chat/${action}`,
                    payload,
                })
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

    render () {
        const { form, usergroup, loading, dispatch } = this.props
        const {record} = this.state
        const { getFieldDecorator } = form
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 19 },
        }
        return (
            <span>
                <Modal destroyOnClose={true} title={record ? "编辑分组" : "新增分组"} visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
                    <Form>
                        <FormItem {...formItemLayout} label="分组名称">
                            {getFieldDecorator("fname", { initialValue: record && record.fenzu_name,
                                rules: [{ required: true, message: "请输入分组名称" }] })(<Input ref={(input) => input && input.focus()} autoComplete="off" onPressEnter={this.handleOk}/>)}
                        </FormItem>
                    </Form>
                </Modal>
                <TableList dispatch={dispatch} showModal={this.showModal} list={usergroup} loading={loading} />
            </span>
        )
    }
}
const setForm = Form.create()(Page)
function mapStateToProps (state) {
    const { usergroup } = state.chat
    return {
        usergroup,
        loading: state.loading.models.chat,
    }
}
export default connect(mapStateToProps)(setForm)
