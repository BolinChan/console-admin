import { Component } from "react"
import { connect } from "dva"
import { Modal, Input, Radio, Row, Form} from "antd"
import styles from "./page.css"
import HsGroup from "./components/HsGroup"
import WordTable from "./components/WordTable"
import Sortable from "sortablejs"
const {Search} = Input
const FormItem = Form.Item
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
}
class Page extends Component {
    state = {
        currentGroupId: "",
        groupVisible: false,
        hsgroup_type: "2",
    }
    UNSAFE_componentWillMount () {
        this.Initialization()
    }
    Initialization=async () => {
        const {currentGroupId} = this.state
        if (hsGroup && hsGroup.length > 0) {
            return
        }
        await this.props.dispatch({ type: "wordManage/fetchHsGroup" })
        const { hsGroup, dispatch } = this.props
        // 初始化获取第一个话术组中的话术语
        if (currentGroupId === "" && hsGroup && hsGroup.length > 0) {
            dispatch({
                type: "wordManage/fetchHsWord",
                payload: {hsgroup_type: this.state.hsgroup_type, groupId: hsGroup[0].groupId },
            })
            this.setState({currentGroupId: hsGroup[0].groupId})
        }
    }

    // 选择组 获取对应的话术语
    onChangeGroup = (groupId) => () => {
        this.setState({
            currentGroupId: groupId,
        })
        this.props.dispatch({
            type: "wordManage/fetchHsWord",
            payload: {hsgroup_type: this.state.hsgroup_type, groupId },
        })
    }
    // 添加分组
    addGroupModal = () => {
        this.setState({
            groupVisible: true,
            action: "add",
        })
    }
    // 编辑分组
    editGroupModal = (values) => () => {
        this.setState({
            groupVisible: true,
            groupId: values.groupId,
            groupName: values.name,
            action: "edit",
        })
    }
    // 添加编辑分组
    handleOk = () => {
        const { action, groupId } = this.state
        const {dispatch, form} = this.props
        const url = action === "add" ? "addGroup" : "editGroup"
        form.validateFields(async (err, values) => {
            if (!err) {
                const payload = { isDisplay: 1, ...values }
                if (url === "editGroup") {
                    payload.groupId = groupId
                }
                dispatch({
                    type: `wordManage/${url}`,
                    payload: payload,
                })
                this.setState({
                    groupVisible: false,
                    groupName: "",
                    hsgroup_type: values.hsgroup_type,
                })
            }
        })
    }
    handleCancel = () => {
        this.setState({
            groupVisible: false,
            groupName: "",
        })
    }
    delGroup = (e, id) => {
        e.stopPropagation()
        e.preventDefault()
        const { hsGroup } = this.props
        this.props.dispatch({
            type: "wordManage/delGroup",
            payload: { groupId: id },
        })
        // 删除当前选中，选中项上移一个
        let index = hsGroup.findIndex((item) => item.groupId === id)
        let groupId = hsGroup.length > 1 ? hsGroup[index - 1].groupId : "-1" // -1表示获取空数据
        this.setState({
            currentGroupId: groupId,
        })
        this.props.dispatch({
            type: "wordManage/fetchHsWord",
            payload: {hsgroup_type: this.state.hsgroup_type, groupId },
        })
    }
    sortChange = (componentBackingInstance) => {
        if (componentBackingInstance) {
            let options = {
                draggable: "div",
                animation: 150,
                onEnd: (evt) => {
                    let ids = []
                    const list = evt.to
                    const eleList = list.querySelectorAll("div")
                    for (let i = 0; i < eleList.length; i++) {
                        ids.push(eleList[i].id)
                    }
                    this.props.dispatch({
                        type: "wordManage/groupSort",
                        payload: { ids: ids },
                    })
                },
            }
            Sortable.create(componentBackingInstance, options)
        }
    }
    groupChange= (e) => {
        const {dispatch} = this.props
        dispatch({
            type: "wordManage/fetchHsGroup",
            payload: { hsgroup_type: e.target.value },
        })
        this.setState({hsgroup_type: e.target.value})
    }
    searchGroup=(name) => {
        this.props.dispatch({
            type: "wordManage/fetchHsGroup",
            payload: { hsgroup_type: this.state.hsgroup_type, name },
        })
    }
    render () {
        const { hsGroup, hsWord, dispatch, loading, form } = this.props
        let { currentGroupId, action, groupName, hsgroup_type } = this.state
        const { getFieldDecorator } = form

        if (currentGroupId === "" && hsGroup && hsGroup.length > 0) {
            currentGroupId = hsGroup[0].groupId
        }
        hsGroup && hsGroup.map((item) => {
            item.id = item.groupId
        })
        const options = [{ label: "公有", value: "2" }, { label: "私有", value: "1" }, { label: "部门快捷语", value: "3" }]
        return (
            <div className={styles.container}>
                <div className={styles.sideber} id="dd">
                    <div className={styles.item}>
                        <Radio.Group value={hsgroup_type} onChange={this.groupChange} buttonStyle="solid">
                            {options.map((item) => <Radio.Button key={item.value} value={item.value}>{item.label}</Radio.Button>)}
                        </Radio.Group>
                    </div>
                    <div className="pad10" style={{width: "255px"}}>
                        <Search
                            placeholder="请输入搜索内容"
                            onSearch={this.searchGroup}
                        />
                    </div>

                    {hsGroup && hsGroup.length > 0 ? (<HsGroup hsGroup={hsGroup}
                        current={currentGroupId}
                        onChangeGroup={this.onChangeGroup}
                        selectDevice={this.selectDevice}
                        editGroup={this.editGroupModal}
                        delGroup={this.delGroup}
                        sortChange={this.sortChange}
                    />)
                        : (
                            <Row type="flex" justify="center" className="pad20">暂无分组</Row>
                        )}
                </div>
                <WordTable hsGroup={hsGroup} addGroupModal={this.addGroupModal} data={hsWord} loading={loading} groupId={currentGroupId} dispatch={dispatch} />
                <Modal title={action === "edit" ? "编辑分组" : "添加分组"} visible={this.state.groupVisible} onOk={this.handleOk} onCancel={this.handleCancel} destroyOnClose={true}>
                    <FormItem {...formItemLayout} label="快捷语类型">
                        {getFieldDecorator("hsgroup_type", {initialValue: hsgroup_type, rules: [{ required: true, message: "输入类型!" }]})(<Radio.Group buttonStyle="solid" disabled={groupName}>
                            {options.map((item) => <Radio.Button key={item.value} value={item.value}>{item.label}</Radio.Button>)}
                        </Radio.Group>)}
                    </FormItem>
                    <FormItem {...formItemLayout} label="名称">
                        {getFieldDecorator("nameGroup",
                            {initialValue: groupName, rules: [{ required: true, message: "输入分组名称!" }] })(
                            <Input
                                ref={(input) => input && input.focus()}
                                autoFocus="autofocus"
                                onPressEnter={this.handleOk}
                                placeholder="输入分组名称" />)}
                    </FormItem>
                </Modal>
            </div>
        )
    }
}
const Demo = Form.create()(Page)
function mapStateToProps (state) {
    let { hsGroup, hsWord, dispatch } = state.wordManage
    return {
        hsGroup,
        hsWord,
        dispatch,
        loading: state.loading.models.wordManage,
    }
}

export default connect(mapStateToProps)(Demo)
