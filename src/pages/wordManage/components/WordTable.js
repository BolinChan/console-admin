import { Component } from "react"
import { Table, Button, Modal, Input, Popconfirm, Form, Select, message, Row } from "antd"
import styles from "../page.css"
import UploadImg from "../../components/UploadImg"
import TextAreas from "../../components/TextArea"
import { hasEmoji } from "../../../utils/helper"
const FormItem = Form.Item
const { Option } = Select
const Search = Input.Search
const columns = [
    {
        title: "操作人", width: 100,
        dataIndex: "add_account", render: (account) => account || "未知",
    },
    { title: "标题", dataIndex: "title" },
    {
        title: "消息类型",
        dataIndex: "type",
        width: 100,
        render: (match_type) => {
            if (match_type === "1") {
                return "文本消息"
            }
            if (match_type === "2") {
                return "图片消息"
            }
        },
    },
    {
        title: "消息内容",
        dataIndex: "text",
        render: (content, record) => {
            if (record.type === "2") {
                return (<img src={content} style={{ maxHeight: "100px" }} alt="" />)
            } else if (content) {
                content = hasEmoji(content)
                return (<span dangerouslySetInnerHTML={{ __html: content }} />)
            }
        },
    }, { title: "更新时间", dataIndex: "addTime", width: 170 },
]

class WordTable extends Component {
    state = {
        visible: false,
    }
    componentDidMount () {
        document.removeEventListener("keydown", this.handleEnterKey)
        document.addEventListener("keydown", this.handleEnterKey)
    }
    handleEnterKey = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault()
            const { getFieldValue, setFieldsValue } = this.props.form
            let text = getFieldValue("text") + "\n"
            setFieldsValue({ text })
        }
    }
    // 点击添加
    handleAdd = () => {
        const { groupId, form } = this.props
        if (!groupId) {
            return message.error("请新增或选择分组")
        }
        this.setState({
            visible: true,
            action: "add",
            VauleEidt: null,
            mgstype: null,
        })
        form.setFieldsValue({
            type: "",
        })
    }
    // 点击编辑
    editWord = (item) => () => {
        let imgs = item.type === "2" ? [item.text] : []
        this.setState({
            visible: true,
            action: "edit",
            VauleEidt: item,
            mgstype: item.type,
            imgs,
        })
        this.props.form.setFieldsValue({
            type: item.type,
        })
    }
    //  选择消息类型
    MsgTypeFun = (mgstype) => {
        this.setState({ mgstype })
    }
    handleCancel = () => {
        this.setState({
            visible: false,
        })
    }
    // 删除关键词
    onDelete = (text_id) => () => {
        this.props.dispatch({
            type: "wordManage/delMsg",
            payload: { text_id },
        })
    }
    // 修改添加关键词
    handleOk = () => {
        let { dispatch, form, groupId } = this.props
        const { action, VauleEidt } = this.state
        form.validateFields(async (err, values) => {
            if (!err) {
                const url = action === "add" ? "addMsg" : "editMsg"
                this.setState({ visible: false })
                let payload = {
                    hsgroup_type: "2",
                    isdisplay: "1",
                    title: values.title,
                    type: values.type,
                    text: values.type === "2" ? values.text[0] : values.text,
                    groupId: values.groupId,
                }
                if (action === "edit") {
                    payload.text_id = VauleEidt.id
                }
                let is = await dispatch({ type: `wordManage/${url}`, payload })
                if (is) {
                    dispatch({ type: "wordManage/fetchHsWord", payload: { groupId } })
                }
            }
        })
    }
    // onPressEnter = (e) => {
    //     e.preventDefault()
    //     this.handleOk()
    // }
    searchContent = (e) => {
        this.props.dispatch({
            type: "wordManage/fetchHsWord",
            payload: { text: e },
        })
    }
    onUpTop = (item) => () => {
        this.props.dispatch({
            type: "wordManage/groupUptop",
            payload: { gid: item.gid, id: item.id },
        })
    }
    render () {
        const { form, data, loading, addGroupModal, hsGroup, groupId } = this.props
        const { action, VauleEidt, mgstype, imgs } = this.state
        const { getFieldDecorator } = form
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 18 },
        }

        columns[10] = {
            title: "操作",
            key: "id",
            render: (text, record, index) => (
                <span>
                    <Button className="mar5" type="primary" onClick={this.editWord(record)}>编辑</Button>
                    <Button className="mar5" type="primary" onClick={this.onUpTop(record)} disabled={index === 0}>置顶</Button>
                    <Popconfirm title="确定要删除吗？" onConfirm={this.onDelete(record.id)}>
                        <Button className="mar5" type="danger">删除</Button>
                    </Popconfirm>
                </span>
            ),
        }
        return (
            <div className={styles.tab + " pad10"}>
                <Row type="flex" justify="space-between" align="middle" className="pad10">
                    <Row type="flex">
                        <Button type="primary" title="点击添加分组" onClick={addGroupModal} className="mr10">
                            添加分组
                        </Button>
                        <Button onClick={this.handleAdd} type="primary" >添加快捷语 </Button>
                    </Row>
                    <div>
                        <Search
                            style={{ width: 300 }}
                            placeholder="搜索标题/消息内容"
                            onSearch={this.searchContent}
                            enterButton
                        />
                    </div>
                </Row>
                <Modal width={646} destroyOnClose={true} title={action === "edit" ? "编辑快捷语" : "添加快捷语"} visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
                    <Form>
                        <FormItem {...formItemLayout} label="选择分组">
                            {getFieldDecorator("groupId", { initialValue: groupId })(
                                <Select placeholder="请选择分组">
                                    {hsGroup && hsGroup.map((item) => <Option value={item.groupId} key={item.groupId}>{item.name}</Option>)}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="标题">
                            {getFieldDecorator("title", { initialValue: VauleEidt && VauleEidt.title, rules: [{ required: true, message: "请输入标题!" }] })(
                                <Input ref={(input) => input && input.focus} autoComplete="off" placeholder="请输入标题" />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="消息类型">
                            {getFieldDecorator("type", { initialValue: VauleEidt && VauleEidt.type, rules: [{ required: true, message: "请输入选择类型!" }] })(
                                <Select onChange={this.MsgTypeFun} placeholder="请选择消息类型">
                                    <Option value="1">文本消息</Option>
                                    <Option value="2">图片消息</Option>
                                </Select>
                            )}
                        </FormItem>
                        {mgstype === "1" && (
                            <FormItem {...formItemLayout} label="文本消息">
                                {getFieldDecorator("text", { initialValue: VauleEidt && VauleEidt.type === "1" && VauleEidt.text })(<TextAreas autosize={{ minRows: 6 }} />)}
                            </FormItem>
                        )}
                        {mgstype === "2" && (
                            <FormItem {...formItemLayout} label="选择图片">
                                {getFieldDecorator("text")(<UploadImg uploadMaxNum={1} defaultImgUrl={imgs} />)}
                            </FormItem>
                        )}
                    </Form>
                </Modal>
                <Table
                    className="pad10"
                    bordered
                    dataSource={data}
                    rowKey="id"
                    loading={loading}
                    columns={columns}
                    pagination={{ pageSize: 20 }}
                // scroll={{y: document.getElementById("cont") ? document.getElementById("cont").offsetHeight - 190 : "auto"}}
                // pagination={{
                //     pageSize: 20,
                //     onChange: () => {
                //         if (document.getElementsByClassName("ant-table-body")) {
                //             document.getElementsByClassName("ant-table-body")[0].scrollTop = 0
                //         }
                //     },
                // }}
                />
            </div>
        )
    }
}
const setForm = Form.create()(WordTable)
export default setForm
