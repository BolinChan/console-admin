import { Table, Popconfirm, Switch, Button} from "antd"
const options = [{ label: "阅读腾讯新闻", value: "1" }, { label: "阅读公众号文章", value: "2" }, { label: "看一看", value: "3" }]
const Prizes = ({ data, deleteConfirm, total, loading, showModal, pageChangeHandler, current, onChangeStatue}) => {
    const columns = [{title: "养号方式", dataIndex: "action", render: (action) => {
        let name = ""
        options.map((me) => {
            if (action.find((id) => me.value === id)) {
                name += me.label + " ➕ "
            }
        })
        name.length > 0 && (name = name.substr(0, name.length - 2))
        return name
    },
    }, {title: "执行微信", dataIndex: "nickname"},
    {title: "开始时间", dataIndex: "executiontime"},
    {title: "类型", dataIndex: "type", render: (type) => type === "2" ? "循环执行" : "单次执行"},
    {title: "状态", dataIndex: "isstop", render: (isstop, item) => <Switch checkedChildren="开启" unCheckedChildren="停止" checked={isstop === "0"} onChange={onChangeStatue && onChangeStatue(item.id)}/>},
    {title: "操作", key: "option", render: (item) => {
        let disabled = item.isaction === "1"
        return (<div>
            <Button type="primary" title={disabled ? "已执行的记录无法编辑" : ""} onClick={() => showModal && showModal(item)} disabled={disabled} className="mar5">编辑</Button>
            <Popconfirm title="确定要删除吗？" arrowPointAtCenter={true} placement="topRight" onConfirm={() => deleteConfirm(item.id)}><Button className="mar5" type="danger">删除</Button></Popconfirm >
        </div>)
    }},
    ]
    const showTotal = () => (
        <span style={{ marginTop: 5, color: "rgba(0,0,0,0.5)", display: "block" }}>总数{total}条</span>
    )
    const pagination = {
        // hideOnSinglePage: true,
        pageSize: 10,
        total,
        onChange: pageChangeHandler, // 点击分页
        current,
        showTotal,
    }
    return (
        <div className="pad10">
            <Table dataSource={data} rowKey="id" bordered={true} columns={columns} pagination={pagination}></Table>
        </div>
    )
}

export default Prizes

// import { List, Popconfirm, Row, Switch} from "antd"
// import styles from "../page.css"
// const Prizes = ({ data, deleteConfirm, total, loading, showModal, pageChangeHandler, current, onChangeStatue}) => {
//     const pagination = {
//         style: { marginTop: -4, marginBottom: 20 },
//         hideOnSinglePage: true,
//         pageSize: 10,
//         total,
//         onChange: pageChangeHandler, // 点击分页
//         current,
//     }
//     const options = [{ label: "阅读腾讯新闻", value: "1" }, { label: "阅读公众号文章", value: "2" }, { label: "看一看", value: "3" }]
//     return (
//         <div className="pad10">
//             <List
//                 loading={loading}
//                 dataSource={data}
//                 renderItem={(item) => {
//                     let name = ""
//                     options.map((me) => {
//                         if (item.action.find((id) => me.value === id)) {
//                             name += me.label + " ➕ "
//                         }
//                     })
//                     name.length > 0 && (name = name.substr(0, name.length - 2))
//                     let disabled = item.isaction === "1"
//                     return (
//                         <List.Item
//                             actions={[<span title={disabled ? "已执行的记录无法编辑" : ""}><a href="javascript:;" onClick={() => showModal && showModal(item)} disabled={disabled}>编辑</a></span>,
//                                 <Popconfirm title="确定要删除吗？" arrowPointAtCenter={true} placement="topRight" onConfirm={() => deleteConfirm(item.id)}><a href="javascript:;">删除</a></Popconfirm >]}
//                         >
//                             <List.Item.Meta title={name} />
//                             <Row type="flex" justify="space-around" style={{width: "100%"}}>
//                                 <div className={styles.listItem}>
//                                     <div>执行微信</div>
//                                     <span>{item.nickname || item.deviceid}</span>
//                                 </div>
//                                 <div className={styles.listItem}>
//                                     <div>开始时间</div>
//                                     <span>{item.executiontime}</span>
//                                 </div>
//                                 <div className={styles.listItem}>
//                                     <Switch checkedChildren="开启" unCheckedChildren="停止" checked={item.isstop === "0"} onChange={onChangeStatue && onChangeStatue(item.id)}/>
//                                 </div>
//                             </Row>
//                         </List.Item>
//                     )
//                 }}
//                 pagination={pagination}
//             >
//             </List>
//         </div>
//     )
// }

// export default Prizes
