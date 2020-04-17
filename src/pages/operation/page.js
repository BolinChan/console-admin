import { Component } from "react"
import { connect } from "dva"
import OperatTable from "./components/OperatTable"
import OperaForm from "./components/OperaForm"
class Page extends Component {
    // 搜索
    handleSubmit = (values) => {
        this.props.dispatch({
            type: "operation/fetchOperation",
            payload: { ...values },
        })
    }
    AllFun = () => {
        this.props.dispatch({
            type: "operation/fetchOperation",
        })
    }
    render () {
        let { operationList, loading } = this.props
        operationList = operationList && operationList.sort((a, b) => new Date(b.add_time).getTime() - new Date(a.add_time).getTime())
        return (
            <div className="pad10">
                <div className="pad10">
                    <OperaForm handleSubmit={this.handleSubmit} AllFun={this.AllFun} />
                </div>
                <div className="pad10">
                    <OperatTable list={operationList} pageChangeHandler={this.pageChangeHandler} loading={loading} />
                </div>
            </div>
        )
    }
}
function mapStateToProps (state) {
    const { operationList } = state.operation
    return {
        operationList,
        loading: state.loading.models.operation,
    }
}
export default connect(mapStateToProps)(Page)
