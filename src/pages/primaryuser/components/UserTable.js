import { Button, Table, Row, Col, Icon, Switch, Popconfirm } from "antd"
import AddUser from "./AddUser"

const columns = [
    { title: "登录账号", dataIndex: "accountnum" },
    { title: "姓名", dataIndex: "realname" },
    { title: "昵称", dataIndex: "nickname" },
    { title: "状态", dataIndex: "level" },
    { title: "所在公众号", dataIndex: "bumen" },
    // { title: "账号权限", dataIndex: "quanxian" },
    // { title: "创建者", dataIndex: "chuanjianz" },
    { title: "创建时间", dataIndex: "createtime" },
]

const UserTable = ({ hanldEdit, accountList, loading, onSelectChange, hanldAdd, deleteConfirm }) => {
    const paginationConfig = {
        total: accountList && accountList.length,
        defaultPageSize: 20,
        hideOnSinglePage: true,
        // current,
    }
    columns[3] = {
        title: "账号权限",
        dataIndex: "status",
        render: (status) => {
            if (status === "0") {
                return (
                    <div>
                        <b>停用</b>
                        <span className="pad10">
                            <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked />
                        </span>
                        <a>正常</a>
                    </div>
                )
            }
        },
    }
    columns[5] = {
        title: "账号权限",
        key: "operation1",
    }
    columns[7] = {
        title: "操作",
        key: "operation",
        render: (record) => (
            <a>
                <AddUser onOk={hanldEdit(record.id)} Vaule={record}>
                    <Icon type="edit" title="编辑账号" />
                </AddUser>
                <Popconfirm title="确定要删除吗？" onConfirm={() => deleteConfirm(record.id)}>
                    <Icon type="delete" title="删除" style={{ marginRight: "15px" }} />
                </Popconfirm>
            </a>
        ),
    }

    return (
        <Row type="flex" justify="center">
            <Col md={24}>
                <div className="pad10">
                    <AddUser onOk={hanldAdd}>
                        <Button type="primary">新增账号</Button>
                    </AddUser>
                </div>
                <div className="pad10">
                    <Table dataSource={accountList} bordered={true} pagination={paginationConfig} rowKey="id" columns={columns} simple loading={loading} />
                </div>
            </Col>
        </Row>
    )
}
export default UserTable
