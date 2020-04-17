import { Component } from "react"
import { connect } from "dva"
import { Button } from "antd"
import Form from "./components/OperateForm"
import RecordTable from "./components/OperateTable"
import SetModel from "./components/SetModel"
import SetStatues from "./components/SetStatues"
class Page extends Component {
    state = {
        current: 1,
        selectedRowKeys: [],
    }
    // 搜索
    handleSubmit = (values) => {
        this.setState({ current: 1, values })
        this.props.dispatch({
            type: "auxiliary/fetchActions",
            payload: { ...values },
        })
    }
    pageChangeHandler = (page) => {
        const { values } = this.state
        this.props.dispatch({
            type: "auxiliary/fetchActions",
            payload: { page, values },
        })
        this.setState({ current: page })
    }
    RevealAll = () => {
        this.props.dispatch({
            type: "auxiliary/fetchActions",
        })
        this.setState({ current: 1 })
    }
    // 批量
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys })
    }
    // 处理状态
    setStatuesFun = (payload) => {
        this.props.dispatch({
            type: "auxiliary/updateStatus",
            payload,
        })
        this.setState({ selectedRowKeys: [] })
    }
    render () {
        const { loading, actionList, total, setActionList, dispatch } = this.props
        const { current, selectedRowKeys } = this.state
        const hasSelected = selectedRowKeys && selectedRowKeys.length > 0
        return (
            <div className="pad10">
                <div className="pad10">
                    <Form loading={loading} {...this.state} handleSubmit={this.handleSubmit} RevealAll={this.RevealAll} />
                </div>
                <div className="pad10">
                    <SetModel loading={loading} dispatch={dispatch} list={setActionList} />
                    &nbsp; &nbsp;
                    <SetStatues onOk={this.setStatuesFun} record={selectedRowKeys}>
                        <Button type="primary" disabled={selectedRowKeys.length === 0}>
                            批量处理
                        </Button>
                    </SetStatues>
                    <span style={{ marginLeft: 8 }}>{hasSelected ? `已选择 ${selectedRowKeys.length}` : ""}</span>
                </div>
                <div className="pad10">
                    <RecordTable
                        list={actionList}
                        setActionList={setActionList}
                        loading={loading}
                        total={total}
                        current={current}
                        pageChangeHandler={this.pageChangeHandler}
                        dispatch={dispatch}
                        onSelectChange={this.onSelectChange}
                        onOk={this.setStatuesFun}
                        selectedRowKeys={selectedRowKeys}
                    />
                </div>
            </div>
        )
    }
}

function mapStateToProps (state) {
    const { actionList, total, setActionList } = state.auxiliary
    return {
        actionList,
        setActionList,
        total,
        loading: state.loading.models.auxiliary,
    }
}
export default connect(mapStateToProps)(Page)
