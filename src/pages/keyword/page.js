import { connect } from "dva"
import KeyFrom from "./components/KeyFrom"
import { isArray } from "util"

const Page = ({ KeyReply, dispatch, loading, weChatList }) => (
    <div>
        <KeyFrom KeyReply={KeyReply} dispatch={dispatch} loading={loading} weChatList={weChatList} />
    </div>
)

function mapStateToProps (state) {
    let { KeyReply } = state.keyword
    let {weChatList} = state.vertisy
    KeyReply = KeyReply && weChatList ? decMap(KeyReply, weChatList) : []
    return {
        weChatList,
        KeyReply,
        loading: state.loading.models.keyword,
    }
}
function decMap (Td, Tm) {
    Td.map((item) => {
        if (item.devices && !isArray(item.devices)) {
            item.devicesname = "全部微信"
            return
        } if (item.devices && isArray(item.devices)) {
            item.devicesname = []
            item.devices.map((i) => {
                let tmp = Tm.find((f) => f.wxid === i)
                if (tmp) {item.devicesname.push(tmp.devicename)}
            })
            item.devicesname = item.devicesname.join(",")
            return
        } else {
            item.devicesname = "无"
        }
    })
    return Td
}
export default connect(mapStateToProps)(Page)
