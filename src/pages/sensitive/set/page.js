import { connect } from "dva"
import DataTable from "./components/DataTable"
import SearchForm from "./components/SearchForm"
const Page = ({ sensitData, loading, dispatch }) =>
    <div className="pad10">
        <div className="pad10">
            <SearchForm dispatch={dispatch}></SearchForm>
        </div>
        <DataTable dispatch={dispatch} list={sensitData} loading={loading} />
    </div>
function mapStateToProps (state) {
    const { sensitData } = state.auxiliary
    return {
        sensitData,
        loading: state.loading.models.auxiliary,
    }
}
export default connect(mapStateToProps)(Page)
