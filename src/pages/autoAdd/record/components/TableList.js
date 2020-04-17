import styles from "./RecordForm.css"
import { Table, Switch, Button} from "antd"
const TableList = ({ loading, autoList, atuoTotal, pageChangeHandler, onShowSizeChange, current, showModel, weChatList, ChangeSwitch }) => {
    const columns = [
        {
            title: "已通过数量/提交数量",
            dataIndex: "is_friend",
            width: 170,
            render: (doNum, row) => doNum + " / " + row.phone_number,
        },
        {
            title: "执行设备",
            dataIndex: "devicename",
            className: `${styles.phone}`,
        },
        {
            title: "操作人",
            dataIndex: "excuse_account",
            className: `${styles.phone}`,
            render: (account) => (account ? account : "未知"),
        },
        {
            title: "微信昵称",
            dataIndex: "nickname",
            className: `${styles.phone}`,
            render: (nickname, record) => nickname || record.WeChatId,
        },
        {
            title: "导入时间",
            dataIndex: "addtime",
            className: `${styles.columnWidth}`,
        },
        {
            title: "执行时间",
            dataIndex: "modifytime",
            className: `${styles.phone}`,
        },
        {
            title: "状态",
            className: `${styles.buyer_name}`,
            dataIndex: "status",
        },
        {
            title: "停止/开启",
            dataIndex: "is_stop",
            width: 110,
            render: (is_stop, item) => (
                <Switch
                    disabled={item.status === "已执行"}
                    onChange={ChangeSwitch(item.id)}
                    checkedChildren={item.status === "已执行" ? "完成" : "开启"}
                    unCheckedChildren="停止"
                    defaultChecked={is_stop !== "1"}
                />
            ),
        },
        {
            title: "操作",
            key: "operation",
            render: (text, record) => (
                <span className={styles.operation}>
                    <Button type="primary" onClick={() => showModel && showModel(record)}>查看详情</Button>
                    {/* <Popconfirm title="确定要删除吗？" onConfirm={() => deleteConfirm(record.id)}>
                        <a href="javascript:;">删除</a>
                    </Popconfirm> */}
                </span>
            ),
        },
    ]
    const showTotal = () => (
        <span style={{ marginTop: 5, color: "rgba(0,0,0,0.5)", display: "block" }}>总数{atuoTotal}条</span>
    )
    const paginationConfig = {
        showTotal,
        total: atuoTotal, // 总数
        onChange: pageChangeHandler, // 点击分页
        onShowSizeChange: onShowSizeChange, // pageSize变化回调
        defaultPageSize: 20,
        current: current,
    }
    // let heigthY = document.getElementById("cont") ? document.getElementById("cont").offsetHeight - 450 : "auto"
    return (
        <div>
            <Table dataSource={autoList} rowKey="id" columns={columns} simple bordered={true} loading={loading} pagination={paginationConfig}/>
        </div>
    )
}
export default TableList
