import { Component } from "react"
import { Table, Button, Modal, Input, Popconfirm, Form, Radio, TimePicker, Row, Badge } from "antd"
import SelectWeChat from "../../components/SelectWeChats"
import ReplyContent from "../../autoAdd/reply/components/ReplyContent"
import moment from "moment"
import { isArray } from "util"
const FormItem = Form.Item
const RadioGroup = Radio.Group
const Search = Input.Search
const columns = [
    {
        title: "关键词",
        dataIndex: "keyword",
        width: 150,
    },
    {
        title: "匹配类型",
        dataIndex: "match_type",
        width: 100,
        render: (match_type) => {
            if (match_type === "1") {
                return "包含"
            }
            if (match_type === "4") {
                return "任意"
            }
            if (match_type === "3") {
                return "完全相同"
            }
        },
    },
    {
        title: "回复时间",
        dataIndex: "starttime",
        width: 150,
        render: (starttime, record) => <div>{starttime} - {record.endtime}</div>,
    },
    {
        title: "消息类型",
        dataIndex: "content",
        width: 100,
        render: (content) => {
            if (content[0].msg_type === "1") {
                if (content.find((t) => t.type !== "1")) {
                    return "组合"
                }
                return "文本"
            }
            if (content[0].msg_type === "2") {
                if (content.find((t) => t.type !== "2")) {
                    return "组合"
                }
                return "图片"
            }
            if (content[0].msg_type === "4") {
                if (content.find((t) => t.type !== "4")) {
                    return "组合"
                }
                return "视频"
            }
        },
    },
    {
        title: "回复内容",
        key: "contents",
        render: (record) => {
            const content = record.content
            return content.map((item, index) => <span key={index} >
                {item.msg_type === "2" && <img src={item.msg_content} style={{ height: "60px" }} alt="" />}
                {item.msg_type === "1" &&
                    <Row type="flex" className="mar5">
                        {item.msg_content &&
                        <Badge count={index + 1}style={{ backgroundColor: "#fff", color: "#999", boxShadow: "0 0 0 1px #d9d9d9 inset" }} />}
                            &nbsp;{item.msg_content || "未设置"}
                    </Row>}
                {item.msg_type === "4" && <div><video src={item.msg_content} style={{ width: 100 }} controls /></div>}
            </span>)
        },
    },
    {
        title: "指定微信",
        dataIndex: "devicesname",
        width: 200,
    },
]
class KeyTable extends Component {
    state = {
        visible: false,
        imgUrls: [],
        wxids: [],
        acceptList: [],
    }
    // 添加、删除回复内容
    changeContent = (acceptList) => {
        this.setState({ acceptList })
    }
    // 点击添加
    handleAdd = () => {
        let array = []
        const { weChatList } = this.props
        if (weChatList) {
            weChatList.map((item) => {
                array.push(item.wxid)
            })
            this.setState({ wxids: array })
        }
        this.setState({
            wxids: array,
            visible: true,
            action: "addKeyReply",
            VauleEidt: undefined,
            imgUrls: [],
            acceptList: [{ type: "1", text: "", img: "" }],
        })
    }
    // 点击编辑
    editWord = (item) => () => {
        let { acceptList } = this.state
        if (item.content) {
            acceptList = item.content.map((mess) => ({ img: mess.msg_content, text: mess.msg_content, type: mess.msg_type, time: mess.msg_time }))
        }
        this.setState({
            visible: true,
            action: "upKeyReply",
            VauleEidt: item,
            imgUrls: item.content[0].msg_type === "2" ? [item.content[0].msg_content] : [],
            acceptList,
        })
    }
    handleCancel = () => {
        this.setState({
            visible: false,
        })
    }
    // 删除关键词
    onDelete = (id) => () => {
        this.props.dispatch({
            type: "keyword/delKeyReply",
            payload: { id },
        })
    }
    // 修改添加关键词
    handleOk = () => {
        const { dispatch, form } = this.props
        const { getFieldValue } = form
        const { action, VauleEidt, acceptList } = this.state
        form.validateFields((err, values) => {
            const { rule_type, keyword, match_type, devices } = values
            if (!err) {
                this.setState({
                    visible: false,
                })
                let content = []
                acceptList && acceptList.map((item, index) => {
                    if (!item.isdelete) {
                        const [url, img, text, msg_type, msg_time] = [
                            getFieldValue(`url${index}`), getFieldValue(`img${index}`), getFieldValue(`text${index}`), getFieldValue(`type${index}`), getFieldValue(`time${index}`)]
                        if (msg_type === "1" && text) {
                            content.push({ msg_type, msg_time, msg_content: text })
                        }
                        if (msg_type === "2" && img && img.length > 0) {
                            content.push({ msg_type, msg_time, msg_content: img[0] })
                        }
                        if (msg_type === "4" && url) {
                            content.push({ msg_type, msg_time, msg_content: url })
                        }
                    }
                })
                // let msg_content = values.msg_type === "2" ? values.imgs[0] : values.msg_content
                let starttime = moment(values.starttime._d).format("HH:mm:ss")
                let endtime = moment(values.endtime._d).format("HH:mm:ss")
                let payload = {
                    devices,
                    rule_type: rule_type || "2",
                    keyword,
                    match_type,
                    content,
                    // content: [{ msg_type: values.msg_type, msg_content, msg_time: "3" }],
                    starttime,
                    endtime,
                }
                if (values.match_type === "4") {
                    payload.keyword = " "
                }
                if (action === "upKeyReply") {
                    payload.id = VauleEidt.id
                }
                dispatch({
                    type: `keyword/${action}`,
                    payload,
                })
            }
        })
    }
    searchkey = (e) => {
        this.props.dispatch({
            type: "keyword/fetchKeyPeply",
            payload: { search: e },
        })
    }
    ShowTotalItem = () => {
        const { KeyReply } = this.props
        return (
            <span style={{ marginTop: 5, color: "rgba(0,0,0,0.5)", display: "block" }}>总数{KeyReply && KeyReply.length}条</span>
        )
    }
    render () {
        const { form, KeyReply, loading, weChatList } = this.props
        const { action, VauleEidt, acceptList } = this.state
        const { getFieldDecorator, getFieldValue } = form
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 18 },
        }
        columns[6] = {
            title: "操作",
            key: "id",
            width: 190,
            render: (text, record) => (
                <span>
                    <Button type="primary" onClick={this.editWord(record)} className="mar5">
                        编辑
                    </Button>
                    <Popconfirm title="确定要删除吗？" onConfirm={this.onDelete(record.id)}>
                        <Button type="danger" className="mar5">删除</Button>
                    </Popconfirm>
                </span>
            ),
        }
        let initValue = []
        if (VauleEidt) {
            isArray(VauleEidt.devices) ? (initValue = VauleEidt.devices) : (initValue = !VauleEidt.devices && [])
        }
        let heigthY = document.getElementById("cont") ? document.getElementById("cont").offsetHeight - 190 : "auto"
        const match_type = getFieldValue("match_type") !== "4"
        const endtime = moment(VauleEidt && VauleEidt.endtime ? VauleEidt.endtime : "23:59:59", "HH:mm:ss")
        const starttime = moment(VauleEidt && VauleEidt.starttime ? VauleEidt.starttime : "00:00:00", "HH:mm:ss")
        return (
            <div className="pad10">
                <Row type="flex" justify="space-between" align="middle" className="pad10">
                    <Button onClick={this.handleAdd} type="primary">添加关键词</Button>
                    <Search
                        style={{ width: 350 }}
                        placeholder="搜索关键词或回复内容"
                        enterButton
                        onSearch={this.searchkey}
                    />
                </Row>
                <Modal
                    bodyStyle={{ height: "calc(100% - 108px)", overflow: "auto" }}
                    wrapClassName="wrapClass"
                    style={{ height: "70%", padding: 0, top: "15%" }}
                    width={800} title={action === "edit" ? "编辑关键词" : "添加关键词"}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}>
                    <Form>
                        <FormItem {...formItemLayout} label="指定微信回复">
                            {getFieldDecorator("devices", { initialValue: initValue })(
                                <SelectWeChat data={weChatList} direction="vertical" initValue={initValue} />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="匹配形式" extra='"任意" - 任何消息都会触发该内容'>
                            {getFieldDecorator("match_type",
                                { initialValue: VauleEidt && VauleEidt.match_type || "1", rules: [{ required: true, message: "请选择匹配形式!" }] })(
                                <RadioGroup>
                                    <Radio value="1">包含</Radio>
                                    <Radio value="3">完全相同</Radio>
                                    <Radio value="4">任意</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                        {match_type && <FormItem {...formItemLayout} label="关键词">
                            {getFieldDecorator("keyword", { initialValue: VauleEidt && VauleEidt.keyword, rules: [{ required: match_type, message: "请输入关键词!" }] })(
                                <Input ref={(input) => input && input.focus()} autoComplete="off" placeholder="请输入关键词" />
                            )}
                        </FormItem>}
                        <FormItem {...formItemLayout} style={{ margin: 0 }} label="回复时间">
                            <div style={{ display: "flex" }}>
                                <FormItem>
                                    {getFieldDecorator("starttime",
                                        { initialValue: starttime })(<TimePicker allowEmpty={false} format="HH:mm:ss" />)}</FormItem>
                                <FormItem> &nbsp;- &nbsp;</FormItem>
                                <FormItem>
                                    {getFieldDecorator("endtime",
                                        { initialValue: endtime })(<TimePicker format="HH:mm:ss" allowEmpty={false} />)}</FormItem>
                            </div>
                        </FormItem>
                        <ReplyContent
                            acceptList={acceptList}
                            formItemLayout={formItemLayout}
                            form={form}
                            changeContent={this.changeContent}
                            isvideo="ture"
                            isAutoRe={true}
                            showTime={true}/>
                    </Form>
                </Modal>
                <Table
                    className="pad10"
                    bordered
                    dataSource={KeyReply}
                    rowKey="id"
                    loading={loading}
                    columns={columns}
                    scroll={{ y: heigthY }}
                    pagination={{
                        pageSize: 20,
                        showTotal: this.ShowTotalItem,
                        onChange: () => {
                            if (document.getElementsByClassName("ant-table-body")) {
                                document.getElementsByClassName("ant-table-body")[0].scrollTop = 0
                            }
                        },
                    }}
                />
            </div>
        )
    }
}
const setForm = Form.create()(KeyTable)
export default setForm
