import { connect } from "dva"
import { Component } from "react"
import CommonPage from "../common/page"
class myself extends Component {
    render () {
        let { myMaterial, dispatch, loading, weChatList } = this.props
        if (weChatList) {
            weChatList = weChatList.filter((item) => item.isoff === "1")
        }
        return (
            <CommonPage material={myMaterial} dispatch={dispatch} loading={loading} weChatList={weChatList} pathPage={"my"} />
        )
    }
}

function mapStateToProps (state) {
    const { myMaterial } = state.material
    return {
        myMaterial,
        weChatList: state.vertisy.weChatList,
        loading: state.loading.models.login,
    }
}
export default connect(mapStateToProps)(myself)
