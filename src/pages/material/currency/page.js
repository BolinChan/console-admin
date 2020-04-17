import { Component } from "react"
import { connect } from "dva"
import CommonPage from "../common/page"
class currency extends Component {
    render () {
        let { material, dispatch, weChatList, loading } = this.props
        const isVisibal = window.sessionStorage.getItem("i") === "3"
        if (weChatList) {
            weChatList = weChatList.filter((item) => item.isoff === "1")
        }
        return (
            <CommonPage isVisibal={isVisibal} material={material} dispatch={dispatch} loading={loading} weChatList={weChatList} pathPage="commom" />
        )
    }
}
function mapStateToProps (state) {
    const { material } = state.material
    return {
        material,
        weChatList: state.vertisy.weChatList,
        loading: state.loading.models.login,
    }
}
export default connect(mapStateToProps)(currency)
