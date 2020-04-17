import { Table, Button, Avatar } from "antd"
import SetFrom from "./SetFrom"
const weChatFun = (wxid, weChatList) => {
    let obj = weChatList && weChatList.find((item) => item.wxid === wxid)
    if (obj) {
        return (
            <div>
                <Avatar size="large" shape="square" icon="user" src={obj.headimg} className="mr10"/>
                {obj.nickname}
            </div>
        )
    } else {
        return "无"
    }
}
const columns = [
    { title: "微信信息", dataIndex: "device_wxid" },
    { title: "验证状态", dataIndex: "ischack", render: (auto) => (auto === "1" ? "开启" : "关闭") },
    { title: "验证消息", dataIndex: "chackMsg", render: (chackMsg) => (chackMsg ? chackMsg : "未设置") },
    { title: "请求间隔", dataIndex: "addUserTime", render: (time) => <div>{time && time[0]} - {time && time[1]}</div>},
]

const RulesTable = ({ weChatList, handleEdit, list, dispatch, loading, selectedRowKeys, onSelectChange }) => {
    const paginationConfig = {
        total: list && list.length,
        defaultPageSize: 20,
        hideOnSinglePage: true,
        showTotal: () => `共 ${list && list.length || 0} 条 `,
    }
    columns[0] = {
        title: "微信信息",
        dataIndex: "deviceIds",
        render: (wxid) => weChatFun(wxid, weChatList),
    }
    columns[8] = {
        title: "操作",
        key: "operation",
        render: (record) => (
            <div>
                <SetFrom record={record} dispatch={dispatch}>
                    <Button type="primary">设置规则</Button>
                </SetFrom>
            </div>
        ),
    }
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    }

    const hasSelected = selectedRowKeys && selectedRowKeys.length > 0
    return (
        <div className="pad10">
            <div className="pad10">
                <SetFrom selectedRowKeys={selectedRowKeys} onOk={handleEdit} dispatch={dispatch}>
                    <Button type="primary" disabled={!hasSelected}>
                        批量设置规则
                    </Button>
                </SetFrom>
                <span style={{ marginLeft: 8 }}>{hasSelected ? `已选择 ${selectedRowKeys.length}` : ""}</span>
            </div>
            <div className="pad10">
                <Table dataSource={list} rowSelection={rowSelection} bordered={true} pagination={paginationConfig} rowKey="deviceIds" columns={columns} simple loading={loading} />
            </div>
        </div>
    )
}
export default RulesTable
