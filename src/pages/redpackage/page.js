import { Component } from "react"
import Form from "./components/RecordForm"
import RecordTable from "./components/RecordTable"
import { connect } from "dva"
import axios from "axios"
class Page extends Component {
    state = {
        current: 1,
        btnloading: false,
        values: {},
    }
    // 搜索红包记录
    handleSubmit = (values) => {
        this.setState({ current: 1, values })
        this.props.dispatch({
            type: "operation/fetchRedpackage",
            payload: { ...values },
        })
    }
    pageChangeHandler = (page) => {
        this.props.dispatch({
            type: "operation/fetchRedpackage",
            payload: { page, ...this.state.values },
        })
        this.setState({ current: page })
    }
    RevealAll = () => {
        this.props.dispatch({
            type: "operation/fetchRedpackage",
        })
        this.setState({ current: 1, values: {} })
    }
    execution = async () => {
        let data = JSON.stringify({ uid: window.sessionStorage.getItem("uniacid"), excel: "1", ...this.state.values })
        this.setState({ btnloading: true })
        await axios.post("//wxx.jutaobao.cc/yunbei_send_redpack/qr_code.php?code=record", data).then((data) => {
            if (!data.data.error) {
                const $a = document.createElement("a")
                $a.href = data.data.file
                $a.download = data.data.fname + ".xls"
                $a.click()
            }
        })
        this.setState({ btnloading: false })
    }

    render () {
        const { loading, redPageList, accountList } = this.props
        const { current } = this.state
        return (
            <div className="pad20">
                <Form {...this.state} handleSubmit={this.handleSubmit} RevealAll={this.RevealAll} execution={this.execution} />
                <div className="pad10" />
                <RecordTable list={redPageList} accountList={accountList} loading={loading} current={current} pageChangeHandler={this.pageChangeHandler} />
            </div>
        )
    }
}

function mapStateToProps (state) {
    const { redPageList, logs } = state.operation
    return {
        redPageList,
        logs,
        loading: state.loading.models.operation,
        accountList: state.account.accountList,
    }
}
export default connect(mapStateToProps)(Page)
