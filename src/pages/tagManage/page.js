import { Component } from "react"
import { connect } from "dva"
import { Input, Modal, Form, message, Row, Button, Icon } from "antd"
import TagClassify from "./components/TagClassify"
import TagTable from "./components/TagTable"
import styles from "./page.css"
const FormItem = Form.Item
class Page extends Component {
    state = { visible: false, current: "-1" }
    UNSAFE_componentWillMount () {
        this.Initialization()
    }
    Initialization=async () => {
        const { TagGroup, dispatch } = this.props
        if (TagGroup && TagGroup.length > 0) {
            this.setState({current: TagGroup[0].id})
            return
        }
        let data = await dispatch({ type: "tagManage/getTagsGrop" })
        if (data) {
            this.setState({current: data[0].id})
        }
    }
    addTagModal = () => {
        this.setState({
            visible: true,
            searhWord: "",
            action: "createDevTags",
        })
    }
    addGrop = () => {
        this.setState({
            visible: true,
            searhWord: "",
            action: "addTagsGrop",
        })
    }
    componentDidUpdate () {
        if (this.state.visible && this.input) {
            this.input.focus()
        }
    }
    inputFocus = (input) => (this.input = input)
    addTagOk = (e) => {
        e.preventDefault()
        const { dispatch, form } = this.props
        const { record, action, current} = this.state
        form.validateFields((err, values) => {
            if (!err) {
                const { tagName } = values
                if (!tagName || tagName.replace(/\s+/g, "").length <= 0) {
                    return message.error("请输入文本内容")
                }
                if (action === "editTagsGrop") {
                    dispatch({
                        type: `tagManage/${action}`,
                        payload: {
                            tagg_fenzu_name: tagName,
                            id: record.id,
                            post: 1,
                            groupid: record.zid,
                        },
                    })
                }
                if (action === "createDevTags") {
                    dispatch({
                        type: `tagManage/${action}`,
                        payload: {
                            tag_name: tagName,
                            wxid: this.props.weChatList.map((item) => item.wxid),
                            ziid: current,
                        },
                    })
                }
                if (action === "addTagsGrop") {
                    dispatch({
                        type: `tagManage/${action}`,
                        payload: {
                            tagg_fenzu_name: tagName,
                        },
                    })
                }
                this.setState({
                    visible: false,
                })
                // 清除input 的值
                form.setFields({
                    tagName: "",
                })
            }
        })
    }
    cancelTag = (e) => {
        this.setState({
            visible: false,
        })
    }

    inputOnChange = (e) => {
        if (e.target.value === "") {
            this.setState({ searhWord: "" })
        }
    }

    search = (value) => {
        let inputVal = value.replace(/(^\s*)|(\s*$)/g, "").replace(/\s/g, "") // 去掉空格
        let _searchWord = inputVal.toLocaleLowerCase() // 统一换成小写
        this.setState({ searhWord: _searchWord })
    }
    // 编辑组
    editGroup = (record) => {
        this.setState({
            visible: true,
            action: "editTagsGrop",
            record,
        })
    }
    delGroup = async (id, index) => {
        const {TagGroup, dispatch} = this.props
        const isTrue = await dispatch({
            type: "tagManage/delTagsGrop",
            payload: {id },
        })
        if (isTrue && index && index !== 0) {
            this.setState({ current: TagGroup[index - 1].id })
        }

    }
    selectGroup = (id) => {
        this.setState({ current: id })
    }
    searchTag = async (e) => {
        let data = await this.props.dispatch({
            type: "tagManage/getDevTags",
            payload: { tagName: e },
        })
        if (data.length) {
            const list = data.find((mess) => mess.zid !== "0")
            this.setState({ current: list.zid})
        }
    }
    render () {
        const { getFieldDecorator } = this.props.form
        let { tags, loading, dispatch, TagGroup } = this.props
        let { searhWord, action, record, current } = this.state
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 18 },
        }
        const paddingLR = {
            paddingLeft: 0,
            paddingRight: 0,
        }
        let titleName = "新增标签"
        if (action === "addTagsGrop") {
            titleName = "新增标签类别"
        }
        if (action === "editTagsGrop") {
            titleName = "编辑标签类别"
        }
        tags = tags.filter((item) => item.zid === current || (current === "32" && item.zid === "0"))
        return (
            <div className={styles.pageBox}>
                <div className={styles.inlineDiv}>
                    <Modal title={titleName} visible={this.state.visible} onOk={this.addTagOk} onCancel={this.cancelTag} htmlType="submit" bodyStyle={paddingLR} destroyOnClose={true}>
                        <Form className={styles.marginStyle}>
                            <FormItem {...formItemLayout} className={styles.marginStyle} label="名称">
                                {getFieldDecorator("tagName", { initialValue: record && record.tagg_fenzu_name })(
                                    <Input ref={this.inputFocus} autoComplete="off" autoFocus="autofocus" onPressEnter={this.addTagOk} />
                                )}
                            </FormItem>
                        </Form>
                    </Modal>
                </div>
                <div className={styles.content}>
                    <div className={styles.sidebarTag}>
                        <Row type="flex" className="pad20" justify="center">
                            <Button type="primary" onClick={this.addGrop}><Icon type="plus" />新增标签组</Button>
                        </Row>
                        {TagGroup && TagGroup.map((item, index) =>
                            <TagClassify
                                key={index}
                                index={index}
                                current={current}
                                selectGroup={this.selectGroup}
                                editGroup={this.editGroup}
                                delGroup={this.delGroup}
                                item={item}/>)}
                    </div>
                    <Row className={styles.contentTag}>
                        <TagTable searchTag={this.searchTag} addTagModal={this.addTagModal} searchWord={searhWord} tags={tags} loading={loading} dispatch={dispatch} />
                    </Row>
                </div>
            </div>
        )
    }
}
const pageForm = Form.create()(Page)
function mapStateToProps (state) {
    const { tags, TagGroup } = state.tagManage
    return {
        weChatList: state.chat.weChatList,
        tags,
        TagGroup,
        loading: state.loading.models.tagManage,
    }
}
export default connect(mapStateToProps)(pageForm)
