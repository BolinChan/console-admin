import { Component } from "react"
import { connect } from "dva"
import UserTable from "./components/UserTable"
class Page extends Component {
    hanldAdd = (vaule) => {
        this.props.dispatch({
            type: "account/primaryAdd",
            payload: { ...vaule },
        })
    }
    hanldEdit = (id) => (vaule) => {
        this.props.dispatch({
            type: "account/editPrimary",
            payload: { ...vaule, id },
        })
    }
    // 删除主账号
    deleteConfirm = (id) => {
        this.props.dispatch({
            type: "account/primaryDelete",
            payload: { id },
        })
    }
    render () {
        const { primaryList, loading } = this.props
        return (
            <div className="pad10">
                <UserTable hanldEdit={this.hanldEdit} deleteConfirm={this.deleteConfirm} accountList={primaryList} loading={loading} hanldAdd={this.hanldAdd} />
            </div>
        )
    }
}
function mapStateToProps (state) {
    const { primaryList } = state.account
    return {
        primaryList,
        loading: state.loading.models.account,
    }
}
export default connect(mapStateToProps)(Page)
