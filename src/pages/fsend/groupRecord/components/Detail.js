import styles from "../../page.css"
import { Table, Modal } from "antd"
const columns = [
    {
        title: "好友微信",
        dataIndex: "nick",
        render: (nick, item) => (nick ? nick : item.weixin),
    },
    {
        title: "操作人",
        dataIndex: "excuse_account",
        render: (account) => (account ? account : "未知"),
    },
    {
        title: "所属设备",
        dataIndex: "devicename",
    },
    {
        title: "状态",
        dataIndex: "excuse_status",
        render: (status) => (status === "1" ? "已执行" : "未执行"),
    },
]
const Detail = ({ detailList, loading, record, current, visible, handleCancel, pageChangeDetail}) => {
    detailList = record && detailList && detailList.filter((item) => item.id === record.id)
    const paginationConfig = {
        total: detailList && detailList.length,
        hideOnSinglePage: true,
        onChange: pageChangeDetail,
        defaultPageSize: 20,
        current,
    }
    return (
        <Modal
            footer={null}
            width="800px"
            bodyStyle={{ height: "calc(100% - 55px)", overflow: "hidden", padding: 0 }}
            wrapClassName={styles.buddy}
            style={{ height: "80%", padding: 0, top: "10%" }}
            title="详情"
            visible={visible}
            onCancel={handleCancel}
            destroyOnClose={true}
        >
            <div className={styles.tablestyle}>
                <Table size="small" dataSource={detailList} rowKey="weixin" columns={columns} simple bordered={true} loading={loading} pagination={paginationConfig} />
            </div>
        </Modal>
    )
}
export default Detail
