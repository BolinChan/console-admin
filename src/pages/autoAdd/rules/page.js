import { connect } from "dva"
import RulesTable from "./components/RulesTable"
import { Component } from "react"
class Page extends Component {
    state = {
        selectedRowKeys: [],
    }
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys })
    }
    handleEdit = () => {
        this.setState({ selectedRowKeys: [] })
    }
    render () {
        const { addRule, dispatch, loading, weChatList } = this.props
        const { selectedRowKeys } = this.state
        return (
            <div style={{ height: "100%" }}>
                <RulesTable
                    list={addRule}
                    dispatch={dispatch}
                    onSelectChange={this.onSelectChange}
                    loading={loading}
                    selectedRowKeys={selectedRowKeys}
                    handleEdit={this.handleEdit}
                    weChatList={weChatList}
                />
            </div>
        )
    }
}
function mapStateToProps (state) {
    const { addRule } = state.autoAdd
    return {
        addRule,
        weChatList: state.vertisy.weChatList,
        loading: state.loading.models.autoAdd,
    }
}
export default connect(mapStateToProps)(Page)
