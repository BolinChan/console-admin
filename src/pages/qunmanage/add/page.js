import { Component } from "react"
import { Table, Button, message, Form, Input, Row, Modal, Avatar, Badge, Tooltip} from "antd"
import request from "../../../utils/request"
const fetchUrl = "//wechat.yunbeisoft.com/index_test.php/home"
const TextArea = Input.TextArea
const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 17 },
    colon: false,
}
const columns = [
    {
        title: "群名称",
        dataIndex: "nick",
        width: "40%",
        render: (nick, item) => <Row type="flex" align="middle" style={{width: "100%"}}>
            <Avatar shape="square" size={64} src={item.headImg} icon="user"/>
            <div title={nick} className="pad10 textover" style={{width: "calc(100% - 75px)"}}>{nick || "未知"}</div>
        </Row>,
    },
    {
        title: "群人数",
        dataIndex: "member_num",
        width: 80,
    },
    {
        title: "关键词",
        dataIndex: "keyword",
        render: (keyword) => {
            if (keyword) {
                keyword = keyword.split("/")
                return keyword.map((item, index) => <Row key={index} type="flex" className="mar5">
                    <Badge count={index + 1} style={{ backgroundColor: "#fff", color: "#999", boxShadow: "0 0 0 1px #d9d9d9 inset" }} />&nbsp;{item.length > 30
                        ? <Tooltip key={item} placement="top" title={item} overlayStyle={{ maxWidth: "500px" }}>
                            {item.slice(0, 30) + "..."}
                        </Tooltip> : item}
                </Row>)
            }
        },
    },
]

class Page extends Component {
    state = {
        rulesList: [],
        isLoading: false,
        visible: false,
        selectedRowKeys: [],
        page: 1,
    }
    componentDidMount () {
        this.fetchData()
    }
    fetchData = async () => {
        this.setState({ isLoading: true })
        const option = {
            method: "post",
            url: `${fetchUrl}/qunmanage/get_qunnei_setting`,
            data: JSON.stringify({page: this.state.page})}
        let {data} = await request(option)
        this.setState({ isLoading: false, rulesList: data.data, total: Number(data.total) })
    }
    showModal= async (record) => {
        this.setState({ visible: true, record})
    }
    handleChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys })
    }
    onChangePage=(page) => {
        this.setState({page})
        this.fetchData()
    }
    handleCancel=() => {
        this.setState({visible: false})
    }
    // 新增编辑规则
    handleSubmit = (e) => {
        this.props.form.validateFields(async (error, values) => {
            if (!error) {
                let {keyword} = values
                values.keyword = keyword.replace(/\n/ig, "/")
                const {record, selectedRowKeys} = this.state
                values.qun_wxids = selectedRowKeys
                record && record.qun_wxid && (values.qun_wxids = [record.qun_wxid])
                const option = {method: "post", url: `${fetchUrl}/qunmanage/upd_qunnei_setting`, data: JSON.stringify(values)}
                let {data} = await request(option)
                if (data.error) {
                    return message.error(data.msg)
                }
                this.setState({ visible: false })
                message.success("设置成功")
                this.fetchData()
            }
        })
    }
    render () {
        const { rulesList, isLoading, visible, record, selectedRowKeys, page, total} = this.state
        const {getFieldDecorator} = this.props.form
        const rowSelection = {
            selectedRowKeys,
            onChange: this.handleChange,
        }
        columns[8] = {
            title: "操作",
            render: (item) =>
                <Button className="mar5" type="primary" onClick={() => this.showModal(item)}>设置</Button>,
        }
        let keyword = ""
        if (record && record.keyword) {
            keyword = record.keyword.split("/")
            keyword = keyword.join("\n")
        }
        return (
            <div className="pad10">
                <div className="pad10">
                    <Button className="mar5" type="primary" onClick={() => this.showModal()} disabled={selectedRowKeys.length < 1}>批量设置</Button>
                </div>
                <div className="pad10">
                    <Table
                        rowKey="qun_wxid"
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={rulesList}
                        loading={isLoading}
                        bordered={true}
                        pagination={{
                            total,
                            onChange: this.onChangePage,
                            current: page,
                            pageSize: 20,
                            showTotal: () => `共 ${rulesList.length} 条 `,
                        }}
                    />
                </div>

                {visible && <Modal width={640} title="设置规则" visible={visible} onOk={this.handleSubmit} onCancel={this.handleCancel}>
                    <Form >
                        <FormItem {...formItemLayout} extra="好友发送对应关键词之后，自动进群。可设置多个，一行一个关键词" label="关键词检测">
                            {getFieldDecorator("keyword", {initialValue: keyword, rules: [{ required: true, message: "请输入关键词" }] })(
                                <TextArea placeholder="输入关键词" rows={6} ref={this.ipt = (ipt) => ipt && ipt.focus()} />
                            )}
                        </FormItem>
                    </Form>
                </Modal>}
            </div>
        )
    }
}
const setForm = Form.create()(Page)
export default setForm
