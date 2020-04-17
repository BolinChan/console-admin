import { Table, Popconfirm, Button, Form, Modal, Input, message, Icon } from "antd"
import { Component } from "react"
import request from "../../../../utils/request"
import Content from "./Content"
const FormItem = Form.Item
const url = "//wechat.yunbeisoft.com/index_test.php/home/autoChatGroup"
class TempTable extends Component {
    state = { visible: false, contentList: [], delist: [] }
    handleOk = () => {
        const { form, dispatch } = this.props
        let { contentList, delist, action, id, name, isError, msg } = this.state
        form.validateFields(async (err, values) => {
            const { template_name } = values
            if (!err) {
                let content = []
                contentList && contentList.map((item, index) => {
                    const text = form.getFieldValue(`index${index}`)
                    text && content.push(text)
                })
                if (action === "contentEdit") {// 添加，编辑内容
                    content.map(async (item, i) => {
                        let options = { method: "post", url: url + "/contentEdit" }
                        if (item.id) {
                            options.data = JSON.stringify({ id: item.id, content: item.content })
                        }
                        if (!item.id) {
                            options.data = JSON.stringify({ group_id: id, content: item.content })
                            options.url = url + "/contentAdd"
                        }
                        const { data } = await request(options)
                        if (content.length - 1 !== i) {
                            return
                        }
                        isError = data.error
                        msg = data.msg
                    })
                }
                if (name !== template_name && id) { // 编辑名称
                    const data = await dispatch({ type: "chat/templateEdit", payload: { template_name, id } })
                    isError = data.error
                    msg = data.msg
                }
                if (delist.length > 0) { // 删除对话中的某一组内容
                    delist.map(async (item) => {
                        let options = { method: "post", url: url + "/contentDel", data: JSON.stringify({ id: item.id, content: item.content }) }
                        const { data } = await request(options)
                        isError = data.error
                        msg = data.msg
                    })
                }
                if (action === "add") { // 添加模板
                    const chat_content = content.map((item) => item.content)
                    const data = await dispatch({ type: "chat/templateAdd", payload: { template_name, chat_content } })
                    isError = data.error
                    msg = data.msg
                }
                await this.setState({ visible: false })
                if (isError) {
                    return message.error(msg)
                }
                message.success("设置成功")
            }
        })
    }
    showModel = async (action, id, name) => {
        let { contentList } = this.setState
        if (id) {
            const options = { method: "post", data: JSON.stringify({ id }), url: url + "/templateGetOne" }
            const { data } = await request(options)
            if (!data.error) {
                contentList = data.data.content
            }
        } else {
            contentList = [{ initiate: 1 }, { initiate: 0 }]
        }
        this.setState({ name, id, action, visible: true, contentList })
    }
    handleCancel = () => {
        this.setState({ visible: false })
    }
    addContent = () => {
        let { contentList } = this.state
        contentList.push({ initiate: 1 })
        contentList.push({ initiate: 0 })
        this.setState({ contentList })
    }
    delContent = (index) => () => {
        let { contentList, delist } = this.state
        if (contentList[index].id) {
            delist.push(contentList[index])
        }
        contentList.splice(index, 1)
        this.setState({ contentList, delist })
    }
    // 删除模板
    deleteTemplate = (id) => {
        this.props.dispatch({ type: "chat/templateDel", payload: { id } })
    }
    render () {
        const { handleCancel, data, loading, form } = this.props
        const { visible, contentList, name, action } = this.state
        const { getFieldDecorator } = form
        const columns = [
            { title: "模板名称", dataIndex: "template_name" },
            { title: "聊天条数", dataIndex: "how_many" },
            { title: "创建时间", dataIndex: "createtime" },
            {
                title: "操作", key: "option", render: (item) => (<div>
                    <Button type="primary" onClick={() => this.showModel("contentEdit", item.id, item.template_name)} className="mar5">编辑</Button>
                    <Popconfirm title="确定要删除吗？" arrowPointAtCenter={true} placement="topRight" onConfirm={() => this.deleteTemplate(item.id)}>
                        <Button type="danger" className="mar5">删除</Button>
                    </Popconfirm >
                </div>),
            },
        ]
        const showTotal = () => (
            <span style={{ marginTop: 5, color: "rgba(0,0,0,0.5)", display: "block" }}>总数{data && data.length}条</span>
        )
        const pagination = {
            pageSize: 10,
            total: data && data.length,
            showTotal,
        }
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 18 },
            colon: false,
        }
        let dialogue = 1
        return (
            <div className="pad10">
                <div className="pad10">
                    <Button type="primary" onClick={() => this.showModel("add")} className="mr10">设置模板</Button>
                    <Button onClick={handleCancel}>查看任务</Button>
                </div>
                <div className="pad10">
                    <Table dataSource={data} loading={loading} rowKey="id" bordered={true} columns={columns} pagination={pagination} />
                </div>
                <Modal
                    width={760}
                    title={action === "add" ? "设置模板" : "编辑模板"}
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                    wrapClassName="wrapClass"
                    style={{ height: "80%", overflow: "hidden" }}
                    bodyStyle={{ height: "calc(100% - 108px)", overflow: "auto" }}
                >
                    <Form>
                        <FormItem {...formItemLayout} label="模板名称">
                            {getFieldDecorator("template_name", { initialValue: name })(<Input placeholder="请输入名称名称" />)}
                        </FormItem>
                        {contentList.map((item, index) =>
                            <div key={index}>
                                {!!item.initiate && <FormItem {...formItemLayout} label=" " style={{ margin: 0 }}>
                                    <h3>对话 {dialogue++}</h3>
                                </FormItem>}
                                <FormItem {...formItemLayout} label={
                                    <span>
                                        <a
                                            title="点击删除该组内容"
                                            className="pad10"
                                            style={{ color: "red", width: 50, visibility: index !== (contentList.length - 1) && "hidden" }} onClick={this.delContent(index)}>
                                            <Icon type="minus-square" />
                                        </a>
                                        {item.initiate ? "主动发言" : "回答内容"}
                                    </span>
                                }>
                                    {getFieldDecorator(`index${index}`)(
                                        <Content contentid={item.id} acceptList={item.content} />
                                    )}
                                </FormItem>
                            </div>
                        )}
                        <FormItem {...formItemLayout} label=" ">
                            <a onClick={this.addContent}><Icon type="plus-square" /> 添加对话</a>
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}
const ListForm = Form.create()(TempTable)
export default ListForm
