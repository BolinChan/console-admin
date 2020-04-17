import { Table, Button, Avatar, Badge, Row } from "antd"
import AutoForm from "./AutoForm"
const weChatFun = (wxid, weChatList) => {
    let obj = weChatList.find((item) => item.wxid === wxid)
    if (obj) {
        return (
            <div>
                <Avatar size="large" shape="square" icon="user" src={obj.headimg} className="mr10" />
                {obj.nickname}
            </div>
        )
    } else {
        return "无"
    }
}
const width = 100
const columns = [
    { title: "微信信息", dataIndex: "device_wxid" },
    { title: "自动通过", dataIndex: "is_auto_accept", width, render: (auto) => (auto === "1" ? "开启" : "关闭") },
    { title: "自动备注", dataIndex: "is_auto_remark", width, render: (auto) => (auto === "1" ? "开启" : "关闭") },
    { title: "每日上限", dataIndex: "day_accept_number", width },
    { title: "自动回复", dataIndex: "is_accept_auto_reply", width, render: (auto) => (auto === "1" ? "开启" : "关闭") },
    {
        title: "类型", width,
        dataIndex: "accept_auto_reply_type",
        render: (type, record) => {
            if (type === "1") {
                if (record.content && record.content.find((t) => t.type !== "1")) {
                    return "组合"
                }
                return "文本"
            }
            if (type === "2") {
                if (record.content && record.content.find((t) => t.type !== "2")) {
                    return "组合"
                }
                return "图片"
            }
            if (type === "4") {
                if (record.content && record.content.find((t) => t.type !== "4")) {
                    return "组合"
                }
                return "视频"
            }
        },
    },
    {
        title: "回复内容",
        dataIndex: "accept_auto_reply_msg",
        render: (text, record) => {
            const img = record.accept_auto_reply_img
            const type = record.accept_auto_reply_type
            let content = [{ type: type || "1", text, img }]
            if (record.content) {
                content.push(...record.content)
            }
            return content.map((item, index) => <span key={index} >
                {item.type === "2" && <img src={item.img} style={{ height: "60px" }} alt="" />}
                {item.type === "1" &&
                    <Row type="flex" className="mar5">
                        {item.text && <Badge count={index + 1} style={{ backgroundColor: "#fff", color: "#999", boxShadow: "0 0 0 1px #d9d9d9 inset" }} />} &nbsp;{item.text || "未设置"}</Row>}
                {item.type === "4" && <div><video src={item.url} style={{ width: 100 }} controls /></div>}
            </span>)
            // if (record.accept_auto_reply_type === "1") {
            //     return text || "未设置"
            // }
            // if (record.accept_auto_reply_type === "2") {
            //     return <img src={record.accept_auto_reply_img} style={{ width: "100px" }} alt="" />
            // }
        },
    },
]

const PointRecord = ({ weChatList, handleEdit, list, dispatch, loading, selectedRowKeys, onSelectChange, onSelect }) => {
    const ShowTotalItem = () => (
        <span style={{ marginTop: 5, color: "rgba(0,0,0,0.5)", display: "block" }}>总数{list && list.length}条</span>
    )
    const paginationConfig = {
        total: list && list.length,
        defaultPageSize: 20,
        showTotal: ShowTotalItem,
        // hideOnSinglePage: true,
    }
    columns[0] = {
        title: "微信信息",
        dataIndex: "device_wxid",
        width: 200,
        render: (wxid) => weChatFun(wxid, weChatList),
    }
    columns[8] = {
        title: "操作",
        key: "operation",
        render: (record) => (
            <div>
                <AutoForm record={record} device_wxid={[record.device_wxid]} dispatch={dispatch}>
                    <Button type="primary">设置规则</Button>
                </AutoForm>
            </div>
        ),
    }
    const selections = [{
        key: 0,
        text: "取消选择",
        onSelect: () => onSelect("cancel"),
    },
    {
        key: 0,
        text: "选择全部",
        onSelect: () => onSelect("all"),
    },
    ]
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        hideDefaultSelections: true,
        selections: weChatList && weChatList.length > 20 ? selections : false,
    }

    const hasSelected = selectedRowKeys && selectedRowKeys.length > 0
    return (
        <div className="pad10">
            <div className="pad10">
                <AutoForm device_wxid={selectedRowKeys} onOk={handleEdit} dispatch={dispatch}>
                    <Button type="primary" disabled={!hasSelected}>
                        批量设置规则
                    </Button>
                </AutoForm>
                <span style={{ marginLeft: 8 }}>{hasSelected ? `已选择 ${selectedRowKeys.length}` : ""}</span>
            </div>
            <div className="pad10">
                <Table dataSource={list} rowSelection={rowSelection} bordered={true} pagination={paginationConfig} rowKey="device_wxid" columns={columns} simple loading={loading} />
            </div>
        </div>
    )
}
export default PointRecord
