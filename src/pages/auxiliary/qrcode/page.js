import { connect } from "dva"
import { Table, Button, Popconfirm, Avatar } from "antd"
import QrcodeTable from "./components/QrcodeTable"
import AddForm from "./components/AddForm"
import axios from "axios"
const columns = [
    { title: "名称", dataIndex: "code_name" },
    { title: "创建时间", dataIndex: "addtime" },
    { title: "背景图", dataIndex: "pic_url", render: (url) => url ? <Avatar shape="square" src={url} size={100}></Avatar> : "无" },
    { title: "活码", dataIndex: "img_url", render: (img) => <img src={img} alt="" style={{ width: "100px" }} /> },
]
const Page = ({ microTotal, microList, loading, dispatch, codeList }) => {
    const deleteConfirm = (id) => {
        dispatch({
            type: "auxiliary/deleteMicro",
            payload: { id },
        })
    }
    const downloadFile = (record, fileName) => {
        axios.post(`//wechat.yunbeisoft.com/index_test.php/home/qrcode/downs/id/${record.token}`).then(({ data: response }) => {
            const a = document.createElement("a")
            a.href = response
            a.download = record.code_name + "活码.jpg"
            a.click()
        })
    }
    const showTotal = () => (
        <span style={{ marginTop: 5, color: "rgba(0,0,0,0.5)", display: "block" }}>总数{microTotal ? microTotal : microList.length}条</span>
    )
    const paginationConfig = {
        showTotal,
        total: microTotal,
        defaultPageSize: 20, // 每页显示条数
        // hideOnSinglePage: true, // 只有一页时隐藏
    }
    columns[8] = {
        title: "操作",
        key: "operation",
        render: (record) => (
            <span>
                <Button onClick={() => downloadFile(record)} className="mar5" type="primary">
                    下载活码
                </Button>
                <AddForm dispatch={dispatch} record={record} action="updateMicro">
                    修改活码
                </AddForm>
                <AddForm record={record} dispatch={dispatch} isqrcode={true} action="addQrcode">
                    添加二维码
                </AddForm>
                <QrcodeTable record={record} list={codeList} loading={loading} dispatch={dispatch} />
                <Popconfirm title="确定要删除吗？" onConfirm={() => deleteConfirm(record.id)}>
                    <Button className="mar5" type="danger">删除</Button>
                </Popconfirm>
            </span>
        ),
    }
    return (
        <div className="pad10">
            <div className="pad10">
                <AddForm dispatch={dispatch} action="addMicro">
                    添加活码
                </AddForm>
            </div>
            <div className="pad10">
                <Table dataSource={microList} bordered={true} pagination={paginationConfig} rowKey="id" columns={columns} simple loading={loading} />
            </div>
        </div>
    )
}
function mapStateToProps (state) {
    const { codeList, microList, microTotal } = state.auxiliary
    return {
        microList,
        microTotal,
        codeList,
        loading: state.loading.models.auxiliary,
    }
}
export default connect(mapStateToProps)(Page)
