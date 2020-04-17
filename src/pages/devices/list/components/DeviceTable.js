import { Table, Badge, Popconfirm, Button, Avatar } from "antd"
import styles from "../../page.css"
import SetGroup from "./SetGroup"
import AddDevice from "./AddDevice"
import SetInput from "../../../components/SetInput"
const width = 150
const columns = [
    {
        title: "序号",
        dataIndex: "Sort",
    },
    {
        title: "设备名称",
        dataIndex: "devicename",
        className: `${styles.dot}`,
        width: 200,
        render: (id, item) => <Badge status={item.isoff === "1" ? "success" : "error"} count={5} text={id} />,
    },
    {
        title: "当前登录微信",
        dataIndex: "nickname",
        render: (nickname, row) => {
            if (nickname) {
                return row.weChat.map((item, index) =>
                    <div className="f fc" key={index} style={{flexWrap: "wrap"}}>
                        <Avatar className="mar5" shape="square" size={64} icon="user" src={item.headimg} style={{ border: "1px solid #e8e8e8"}}/>
                        <div className="mar5">{item.nickname}</div>
                    </div>)

            } else {
                return <div>无</div>
            }
        },
    },
    {
        title: "设备号",
        dataIndex: "sncode",
        width,
    },
    {
        title: "备注",
        dataIndex: "remark",
        width,
        render: (text) => <span>{text ? text : "无"}</span>,
    },
    {
        title: "设备分组",
        dataIndex: "zuname",
        width,
    },
]
const DeviceTable = ({ loading, devices, deleteConfirm, dispatch, hanldEdit, devGroupList, onSelectChange, selectedRowKeys, onSelect, onChangeSort, hanldChangePage, current, total}) => {
    const ShowTotalItem = () => (
        <span style={{ marginTop: 5, color: "rgba(0,0,0,0.5)", display: "block" }}>总数{total}条</span>
    )
    const paginationConfig = {
        total,
        defaultPageSize: 20,
        // hideOnSinglePage: true, // 只有一页时隐藏
        current,
        onChange: hanldChangePage,
        showTotal: ShowTotalItem,
    }

    columns[0] = {
        title: "序号",
        dataIndex: "Sort",
        width,
        render: (num, record) =>
            <SetInput type="number" onSubmit={onChangeSort} holder="请输入备注" record={record} defaultname={num ? num : "未设置"} />,
    }
    columns[5] = {
        title: "设备分组",
        dataIndex: "zuname",
        width,
        render: (name, record) => (
            <SetGroup record={record} dispatch={dispatch} devGroupList={devGroupList}>
                {name ? name : "设置分组"}
            </SetGroup>
        ),
    }
    columns[8] = {
        title: "操作",
        key: "operation",
        className: "operation",
        width: 190,
        render: (row) => (
            <a>
                <AddDevice onOk={hanldEdit(row)} Vaule={row} devGroupList={devGroupList}>
                    <Button type="primary" className="mar5">编辑</Button>
                </AddDevice>
                <Popconfirm title="确定要删除吗？" onConfirm={() => deleteConfirm([row.id])}>
                    <Button type="danger" className="mar5">删除</Button>
                </Popconfirm>
            </a>
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
        // hideDefaultSelections: true,
        selections: devices && devices.length > 20 ? selections : false,
    }
    // let heigthY = document.getElementById("cont") ? document.getElementById("cont").offsetHeight - 320 : "auto"
    return (
        <div>
            <Table dataSource={devices} rowKey="id" columns={columns} rowSelection={rowSelection} loading={loading} pagination={paginationConfig} bordered simple />
        </div>
    )
}
export default DeviceTable
