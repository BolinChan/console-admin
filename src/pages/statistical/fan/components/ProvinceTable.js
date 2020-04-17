import {Table} from "antd"
import styles from "../../page.css"
const ProvinceTable = ({data, loading}) => {
    const columns = [
        { title: "省份", dataIndex: "Province", width: "50%" },
        { title: "人数", dataIndex: "count", defaultSortOrder: "descend",
            sorter: (a, b) => a.count - b.count },
    ]
    const paginationConfig = {
        total: data && data.length,
        defaultPageSize: 10,
        hideOnSinglePage: true,
        size: "small",
    }
    return (
        <div className={styles.tableScorll}>
            <Table dataSource={data} pagination={paginationConfig} rowKey="Province" columns={columns} loading={loading} simple />
        </div>
    )
}
export default ProvinceTable
