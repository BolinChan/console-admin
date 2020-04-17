
import { connect } from "dva"
import SubmitForm from "./components/SubmitForm"
import { Component } from "react"
class Page extends Component {
    render () {
        let {weChatList} = this.props
        if (weChatList && weChatList.length > 0) {
            weChatList = weChatList.filter((item) => item.isoff === "1")
        }
        return (
            <SubmitForm {...this.props} weChatList={weChatList} />
        )
    }
}
function mapStateToProps (state) {
    const { devFanData, addRule, store } = state.autoAdd

    return {
        usergroup: state.chat.usergroup,
        alltags: state.tagManage.alltags,
        weChatList: state.vertisy.weChatList,
        publicList: state.auxiliary.publicList,
        devFanData,
        addRule,
        store,
        loading: state.loading.models.autoAdd,
    }
}
export default connect(mapStateToProps)(Page)
