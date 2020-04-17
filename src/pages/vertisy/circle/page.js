import { Component } from "react"
import { connect } from "dva"
import Vertising from "./components/Vertising"
class Page extends Component {
    render () {
        let { weChatList} = this.props
        if (weChatList && weChatList.length > 0) {
            weChatList = weChatList.filter((item) => item.isoff === "1")
        }
        return (
            <div>
                <Vertising {...this.props} weChatList={weChatList} />
            </div>

        )
    }
}
function mapStateToProps (state) {
    const {circleList, weChatList} = state.vertisy
    return {
        weChatList,
        circleList,
        material: state.material.material,
        myMaterial: state.material.myMaterial,
        loading: state.loading.models.vertisy,
        loadingMater: state.loading.models.material,
    }
}
export default connect(mapStateToProps)(Page)
