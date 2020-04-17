import { Component } from "react"
import { Table, Button, Modal, Form, Input, message, Popconfirm, Switch, Row, Icon } from "antd"
const FormItem = Form.Item
const Search = Input.Search
class TagTable extends Component {
    state = {
        visible: false,
        record: {},
        selectedRowKeys: [],
    }
    componentDidUpdate () {
        if (this.state.visible && this.input) {
            this.input.focus()
        }
    }
    inputFocus = (input) => (this.input = input)
    // 编辑标签按钮
    showTagModal = (record) => () => {
        this.setState({
            visible: true,
            record,
        })
    }

    // 标签删除确认
    tagDeleteConfirm = (id) => () => {
        const dispatch = this.props.dispatch
        dispatch({
            type: "tagManage/deleteDevTags",
            payload: { id },
        })
    }
    // 标签编辑确认
    tagEditConfirm = (record) => (e) => {
        e.preventDefault()
        const { dispatch, form } = this.props
        form.validateFields((err, values) => {
            if (!err) {
                let { tagName } = values
                if (!tagName || tagName.replace(/\s+/g, "").length <= 0) {
                    return message.error("请输入文本内容")
                } else {
                    this.setState({
                        visible: false,
                    })
                }
                // 编辑请求
                dispatch({
                    type: "tagManage/editDevTags",
                    payload: {
                        id: record.id,
                        post: 1,
                        tag_name: tagName,
                        groupid: record.zid,
                    },
                })
            }
        })
    }
    cancelEdit = (e) => {
        this.setState({
            visible: false,
        })
    }
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys })
    }
    // 更改标签状态
    switchChange = (id) => (check) => {
        this.props.dispatch({
            type: "tagManage/editStatus",
            payload: {
                id: [id],
                isweb: check ? "0" : "1",
            },
        })
    }
    switchChanges = (check) => {
        this.props.dispatch({
            type: "tagManage/editStatus",
            payload: {
                id: this.state.selectedRowKeys,
                isweb: check ? "0" : "1",
            },
        })
    }
    render () {
        const { getFieldDecorator } = this.props.form
        const { record, selectedRowKeys } = this.state
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 20 },
        }
        // 表格数据源
        // const dataSource = []
        let { loading, tags } = this.props
        // 列表名
        const columns = [
            {
                title: "标签",
                dataIndex: "tag_name",
                width: "25%",
            },
            { title: "客户数", dataIndex: "number", width: "25%", render: (number) => (number ? number : 0) },
            {
                title: "显示状态",
                dataIndex: "is_web",
                render: (is_web, item) => <Switch checkedChildren="开" unCheckedChildren="关" checked={is_web === "0"} onChange={this.switchChange(item.id)} />,
            },
            {
                title: "操作",
                key: "operation",
                render: (text, record) => (
                    <div>
                        <Button type="primary" onClick={this.showTagModal(record)} className="mar5">
                            编辑
                        </Button>
                        <Popconfirm title="确定要删除吗？" onConfirm={this.tagDeleteConfirm(record.id)}>
                            <Button type="danger" className="mar5">删除</Button>
                        </Popconfirm>
                    </div>
                ),
            },
        ]
        const showTotal = () => (
            <span style={{ marginTop: 5, color: "rgba(0,0,0,0.5)", display: "block" }}>总数{tags && tags.length}条</span>
        )
        // 分页配置
        const paginationConfig = {
            total: tags && tags.length, // 总数
            defaultPageSize: 10, // 每页显示条数
            showTotal,
        }
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        }
        return (
            <div className="pad10">
                <Row type="flex" justify="space-between" align="middle" className="pad10">
                    <span>
                        <Switch
                            title="批量改变标签显示状态"
                            checkedChildren="批量开"
                            unCheckedChildren="批量关"
                            defaultChecked={false}
                            disabled={selectedRowKeys.length === 0}
                            onChange={this.switchChanges}
                            className="mr10" />
                        {selectedRowKeys.length > 0 && `已选择${selectedRowKeys.length}`}
                    </span>
                    <div>
                        <Search
                            className="mr10"
                            style={{ width: 300 }}
                            placeholder="搜索标签"
                            onSearch={this.props.searchTag}
                            enterButton
                        />
                        <Button type="primary" onClick={this.props.addTagModal}><Icon type="plus" />新增标签</Button>
                    </div>
                </Row>
                <div className="pad10">
                    <Table
                        rowSelection={rowSelection}
                        dataSource={tags}
                        rowKey="id"
                        columns={columns}
                        bordered={true}
                        pagination={paginationConfig}
                        loading={loading}
                    />
                </div>

                <Modal title="编辑标签" visible={this.state.visible} onOk={this.tagEditConfirm(record)} onCancel={this.cancelEdit} htmlType="submit" destroyOnClose={true}>
                    <Form>
                        <FormItem {...formItemLayout} label="标签">
                            {getFieldDecorator("tagName", { initialValue: record && record.tag_name })(
                                <Input ref={this.inputFocus} autoFocus="autofocus" autoComplete="off" onPressEnter={this.tagEditConfirm(record)} />
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}

const pageForm = Form.create()(TagTable)
export default pageForm
