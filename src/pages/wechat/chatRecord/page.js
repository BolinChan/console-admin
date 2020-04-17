import { connect } from "dva"
import Record from "./components/RecordForm"
const Page = ({ weChatList, dispatch, contacts, logs, loading, total, accountList }) => (
    <div className="pad20">
        <Record accountList={accountList} weChatList={weChatList} dispatch={dispatch} contacts={contacts} logs={logs} loading={loading} total={total} />
    </div>
)

function mapStateToProps (state) {
    return {
        weChatList: state.vertisy.weChatList,
        contacts: state.chat.contacts,
        loading: state.loading.models.message,
        logs: state.message.logs,
        total: state.message.total,
        accountList: state.account.accountList,
    }
}
export default connect(mapStateToProps)(Page)
