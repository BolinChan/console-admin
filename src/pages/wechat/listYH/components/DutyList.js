import { Table, Popconfirm, Button} from "antd"
const DutyList = ({ data, templist, deleteChatDuty, loading, weChatList, showModal}) => {
    const columns = [
        {title: "发起微信", dataIndex: "initiate", render: (initiate) => {
            const list = weChatList && weChatList.find((item) => item.wxid === initiate)
            return list && (list.wxremark || list.nickname || list.wxid) || initiate
        }},
        {title: "接收微信", dataIndex: "accept", render: (accept) => {
            let namelist = []
            if (accept && typeof accept === "object" && weChatList) {
                accept.map((wxid) => {
                    const fd = weChatList.find((item) => item.wxid === wxid)
                    fd && (namelist.push(fd.wxremark || fd.nickname || fd.wxid))
                })
                namelist = namelist.join("，")
                return <div>{namelist}</div>
            }
        },
        },
        // {title: "状态", dataIndex: "is_stop", render: (is_stop) => is_stop === "0" ? "未停止" : "已停止"},
        {title: "聊天模板", dataIndex: "chat_template", render: (id, e) => {
            const list = templist && templist.find((item) => item.id === id)
            return list ? list.template_name : ""
        }},
        {title: "任务类型", dataIndex: "cycle", render: (cycle) => (cycle === "2" ? "单次" : "循环")},
        {title: "执行时间", dataIndex: "carriedtime"},
        {title: "操作", key: "option", render: (item) => (
            <div>
                <Button type="primary" onClick={() => showModal(item, 1)} className="mar5">编辑</Button>
                <Popconfirm title="确定要删除吗？" arrowPointAtCenter={true} placement="topRight" onConfirm={() => deleteChatDuty(item.id)}>
                    <Button type="danger" className="mar5">删除</Button>
                </Popconfirm >
            </div>)},
    ]
    const pagination = {
        hideOnSinglePage: true,
        pageSize: 10,
        total: data && data.length,
    }
    return (
        <div className="pad10">
            <Table dataSource={data} loading={loading} rowKey="id" bordered={true} columns={columns} pagination={pagination}></Table>
        </div>
    )
}

export default DutyList
