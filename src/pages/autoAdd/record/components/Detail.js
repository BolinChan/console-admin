import styles from "./RecordForm.css"
import { Table, Modal } from "antd"
import moment from "moment"
const columns = [
    {
        title: "执行的号码",
        dataIndex: "phone",
    },
    {
        title: "操作人",
        dataIndex: "excuse_account",
        render: (account) => (account ? account : "未知"),
    },
    {
        title: "微信昵称",
        dataIndex: "WeChatId",
        className: `${styles.phone}`,
    },
    {
        title: "执行时间",
        dataIndex: "modifytime",
        render: (time) => time && moment(new Date(time * 1000)).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
        title: "状态",
        dataIndex: "status",
    },
    {
        title: "是否忽略",
        dataIndex: "is_ignore", render: (is_ignore) => Number(is_ignore) === 1 ? "是(已为好友)" : "否",
    },
    {
        title: "是否通过",
        dataIndex: "is_friend", render: (is_friend) => Number(is_friend) === 1 ? "是" : "否",
    },
]
const weChatFun = (wxid, weChatList) => {
    let obj = weChatList && weChatList.find((item) => item.wxid === wxid)
    return obj && obj.nickname || wxid || "未命名"
}
const Detail = ({ detailList, loading, detaiTotal, weChatList, visible, handleCancel, pageChangeDetail, current, record }) => {
    const paginationConfig = {
        total: detaiTotal, // 总数
        hideOnSinglePage: true, // 只有一页时隐藏
        onChange: pageChangeDetail, // 点击分页
        defaultPageSize: 20,
        current,
    }
    columns[2] = {
        title: "微信昵称",
        dataIndex: "WeChatId",
        render: (wxid) => weChatFun(wxid, weChatList),
    }
    const height = record && Number(record.phone_number) > 15 ? "90%" : "70%"
    return (
        <div>
            <Modal
                footer={null}
                width="800px"
                bodyStyle={{ height: "calc(100% - 55px)", overflow: "hidden", padding: 0 }}
                wrapClassName="wrapClass"
                style={{ height: height, padding: 0}}
                title="详情"
                visible={visible}
                onCancel={handleCancel}
                destroyOnClose={true}
                centered={true}
            >
                <div className={styles.tablestyle}>
                    <Table size="small" dataSource={detailList} rowKey="id" columns={columns} simple bordered={true} loading={loading} pagination={paginationConfig} />
                </div>
            </Modal>
        </div>
    )
}
export default Detail
