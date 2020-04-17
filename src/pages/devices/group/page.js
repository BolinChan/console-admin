import { connect } from "dva"
import GroupTable from "./components/GroupTable"
const Page = ({ devGroupList, loading, dispatch }) => <GroupTable dispatch={dispatch} list={devGroupList} loading={loading} />
function mapStateToProps (state) {
    const { devGroupList } = state.devices
    return {
        devGroupList,
        loading: state.loading.models.devices,
    }
}
export default connect(mapStateToProps)(Page)
