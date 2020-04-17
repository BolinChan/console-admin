import { Table, Switch, Popconfirm, Button } from "antd"
import PermiSet from "./PermiSet"
import AddAccount from "./AddAccount"
// import PerModel from "./PerModel"
import SetInput from "../../components/SetInput"
const columns = [
    { title: "所在部门", dataIndex: "departmen" },
    { title: "登录账号", dataIndex: "accountnum" },
    { title: "姓名", dataIndex: "realname" },
    {title: "客服备注", dataIndex: "userinfo"},
    { title: "创建时间", dataIndex: "createtime" },
]

const AccountTable = ({ accountList, dispatch, onSubmit, loading, permissions, deleteConfirm, ChangeSwitch, hanldEdit, partmentList, allocate, showRed}) => {
    const showTotal = () => (
        <span style={{ marginTop: 5, color: "rgba(0,0,0,0.5)", display: "block" }}>总数{accountList && accountList.length}条</span>
    )
    const paginationConfig = {
        total: accountList && accountList.length,
        defaultPageSize: 20,
        showTotal,
    }
    columns[3] = {
        title: "客服备注",
        dataIndex: "userinfo",
        width: 200,
        render: (userinfo, record) => <SetInput onSubmit={onSubmit} holder="请输入备注" record={record} defaultname={userinfo ? userinfo : "无"} />,
    }
    columns[5] = {
        title: "账号停用",
        dataIndex: "status",
        render: (status, item) => (
            <div>
                <span className="pad10">
                    <Switch onChange={ChangeSwitch(item.id)} checkedChildren="正常" unCheckedChildren="停用" defaultChecked={status !== "1"} />
                </span>
            </div>
        ),
    }
    columns[6] = {
        title: "账号权限",
        key: "operation1",
        render: (record) => <PermiSet list={permissions} defaultV={record.rights_id} accountnum={record.accountnum} zid={record.id} dispatch={dispatch} />,
    }
    columns[7] = {
        title: "红包设置",
        key: "hongb",
        render: (record) => <Button type="danger" onClick={() => showRed(record)}>红包设置</Button>,
    }
    columns[8] = {
        title: "操作",
        key: "operation",
        className: "operation",
        render: (record) => (
            <a>
                <Button className="mar5" type="primary" onClick={() => allocate(record.id)}>分配微信</Button>
                <AddAccount onOk={hanldEdit} record={record} partmentList={partmentList}>
                    <Button className="mar5" type="primary">编辑</Button>
                </AddAccount>
                <Popconfirm title="确定要删除吗？" onConfirm={() => deleteConfirm(record.id)}>
                    <Button className="mar5" type="danger">删除</Button>
                </Popconfirm>
            </a>
        ),
    }
    return (
        <div className="pad10">
            <Table dataSource={accountList} bordered={true} pagination={paginationConfig} rowKey="id" columns={columns} simple loading={loading} />
        </div>
    )
}
export default AccountTable
