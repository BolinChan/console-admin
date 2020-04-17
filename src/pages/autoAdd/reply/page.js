import { connect } from "dva"
import ReplyTable from "./components/ReplyTable"
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
    onSelect=(value) => {
        let {selectedRowKeys} = this.state
        const {weChatList} = this.props
        if (value === "all" && weChatList) {
            selectedRowKeys = weChatList.map((item) => item.wxid)
        } else {
            selectedRowKeys = []
        }
        this.setState({ selectedRowKeys })

    }
    render () {
        const { BeiRule, dispatch, loading, weChatList } = this.props
        const { selectedRowKeys } = this.state
        return (
            <div style={{ height: "100%" }}>
                <ReplyTable
                    list={BeiRule}
                    dispatch={dispatch}
                    onSelectChange={this.onSelectChange}
                    loading={loading}
                    selectedRowKeys={selectedRowKeys}
                    handleEdit={this.handleEdit}
                    weChatList={weChatList}
                    onSelect={this.onSelect}
                />
            </div>
        )
    }
}
function mapStateToProps (state) {
    const { BeiRule } = state.autoAdd
    return {
        BeiRule,
        weChatList: state.vertisy.weChatList,
        loading: state.loading.models.autoAdd,
    }
}
export default connect(mapStateToProps)(Page)
