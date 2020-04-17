import {Component} from "react"
import {connect} from "dva"
import { Button, Row, Input, Radio, Tabs} from "antd"
import ListItem from "./components/ListItem"
import SetYh from "./components/SetYh"
import DutyList from "./components/DutyList"
import Template from "./components/Template"
const Search = Input.Search
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const TabPane = Tabs.TabPane
class Page extends Component {
    state={page: 1, visible: false}
    pageChangeHandler =(page, size) => {
        this.onSubmit({page})
        this.setState({page})
    }
    searchWChat=(device_name) => {
        this.onSubmit({device_name})
        this.setState({page: 1, device_name})
    }
    onChangeRadio=(e) => {
        const {value} = e.target
        this.setState({page: 1, status: value})
        this.onSubmit({status: value})

    }
    onChangeStatue=(id) => (status) => {
        this.props.dispatch({
            type: "chat/editNursing",
            payload: {id, isstop: status ? "2" : "1" },
        })
    }
    deleteConfirm=(id) => {
        this.props.dispatch({
            type: "chat/delNursing",
            payload: {id},
        })
    }
    onSubmit=(value) => {
        const {page, status, device_name} = this.state
        this.props.dispatch({
            type: "chat/fetchNursing",
            payload: {page, status, device_name, ...value},
        })
    }

    showModal=(record, isduty) => {
        this.setState({record, visible: true, isduty})
    }
    handleCancel=() => {
        this.setState({visible: false, temVisible: false})
    }
    // 删除聊天任务
    deleteChatDuty= (id) => {
        this.props.dispatch({
            type: "chat/deleteChatDuty",
            payload: {id},
        })
    }
    showTemplate=() => {
        this.setState({temVisible: true})
    }
    render () {
        const {YHList, loading, YHCount, weChatList, chatDuty, templist, dispatch} = this.props
        const {page, visible, record, temVisible} = this.state
        let option = [{value: "3", label: "未执行"}, {value: "1", label: "执行成功"}, {value: "2", label: "执行失败"}]
        return (
            <div>
                <Tabs defaultActiveKey="1" size="large" tabBarStyle={{ margin: 0 }}>
                    <TabPane tab="自动养号" key="1">
                        <div className="pad10">
                            <Row className="pad10" type="flex" justify="space-between">
                                <Button type="primary" onClick={this.showModal}>批量养号设置</Button>
                                <Row type="flex" justify="end">
                                    <RadioGroup defaultValue="" onChange={this.onChangeRadio} className="mr10">
                                        <RadioButton value="">全部</RadioButton>
                                        { option.map((item) => <RadioButton key={item.value} value={item.value}>{item.label}</RadioButton>)}
                                    </RadioGroup>
                                    <Search placeholder="请输入微信昵称" style={{width: 300}} onSearch={this.searchWChat} />
                                </Row>
                            </Row>
                            <ListItem
                                data={YHList}
                                loading={loading}
                                current={page}
                                total={YHCount}
                                onChangeStatue={this.onChangeStatue}
                                pageChangeHandler={this.pageChangeHandler}
                                deleteConfirm={this.deleteConfirm}
                                showModal={this.showModal}
                                visible={visible}/>
                        </div>
                    </TabPane>
                    <TabPane tab="聊天任务" key="2">
                        {temVisible
                            ? <Template loading={loading} dispatch={dispatch} data={templist} handleCancel={this.handleCancel}/>
                            : <div className="pad10">
                                <div className="pad10">
                                    <Button type="primary" onClick={() => this.showModal(null, 1)} className="mr10">任务设置</Button>
                                    <Button onClick={this.showTemplate}>查看模板</Button>
                                </div>
                                <DutyList
                                    data={chatDuty}
                                    deleteChatDuty={this.deleteChatDuty}
                                    showModal={this.showModal}
                                    {...this.props}
                                />
                            </div>}
                    </TabPane>
                </Tabs>
                {visible && <SetYh weChatList={weChatList} handleCancel={this.handleCancel} YHList={YHList} visible={visible} list={record} {...this.props} isduty={this.state.isduty}></SetYh>}
            </div>

        )
    }
}
function mapStateToProps (state) {
    const { weChatList, YHList, YHCount, chatDuty, templist } = state.chat
    return {
        weChatList,
        loading: state.loading.models.chat,
        YHList,
        YHCount,
        chatDuty,
        templist,
    }
}
export default connect(mapStateToProps)(Page)
