import { Component } from "react"
import { connect } from "dva"
import { Table, Row, Avatar, Popover, Input, Button, Select } from "antd"
import styles from "../page.css"
const Option = Select.Option
class Page extends Component {
    state = { current: 1, nick: "", status: null }
    componentDidMount () {
        const { location, dispatch } = this.props
        let id = location.query.id
        dispatch({
            type: "fission/getAllSaomaList",
            payload: { taskId: id },
        })
    }
    pageChangeHandler = (e) => {
        let { nick, status } = this.state
        const { location, dispatch } = this.props
        let id = location.query.id
        dispatch({
            type: "fission/getAllSaomaList",
            payload: { taskId: id, page: e, nick: nick ? nick : "", status: status ? status : "" },
        })
        this.setState({ current: e })
    }
    nickChange = (e) => {
        this.setState({ nick: e.target.value })
    }
    handleChange = (e) => {
        this.setState({ status: e })
    }
    searchQrcode = () => {
        const { dispatch, location } = this.props
        const { nick, status } = this.state
        let id = location.query.id
        if (nick || status !== null) {
            dispatch({
                type: "fission/getAllSaomaList",
                payload: { taskId: id, nick, status },
            })
            this.setState({ current: 1 })
        }
    }
    ShowTotalItem=() => {
        const {qrcodeTotal} = this.props
        return (
            <span style={{ marginTop: 5, color: "rgba(0,0,0,0.5)", display: "block" }}>总数{qrcodeTotal}条</span>
        )
    }
    render () {
        const { current, nick } = this.state
        const { qrcodeLst, qrcodeTotal, loading } = this.props
        const paginationConfig = {
            total: qrcodeTotal, // 总数
            defaultPageSize: 20, // 每页显示条数
            // hideOnSinglePage: true, // 只有一页时隐藏
            onChange: this.pageChangeHandler, // 点击分页
            current: current,
            showTotal: this.ShowTotalItem,
        }
        const columns = [{
            title: "扫码用户",
            dataIndex: "nickname",
            render: (nickname, item) => (
                <div>
                    <Row type="flex">
                        <Avatar style={{ marginRight: 10 }} shape="square" size="large" icon="user" src={item.headimgurl} />
                        <div >{nickname || "暂无昵称"}</div>
                    </Row>
                </div>
            ),
        },
        {
            title: "性别",
            align: "center",
            dataIndex: "sex",
            render: (sex) => (
                <div>{sex === "1" ? "男" : sex === "2" ? "女" : "未知"}</div>
            ),
        },
        {
            title: "省份",
            align: "center",
            dataIndex: "province",
            render: (province) => (
                <div>{province || "暂无"}</div>
            ),
        },
        {
            title: "城市",
            align: "center",
            dataIndex: "city",
            render: (city) => (
                <div>{city || "暂无"}</div>
            ),
        },
        {
            title: "客服二维码",
            align: "center",
            dataIndex: "qrcode_img",
            render: (qrcode_img) => (
                <Popover content={<Avatar src={qrcode_img} shape="square" size={250} />} trigger="hover">
                    <Avatar src={qrcode_img} shape="square" size={60} />
                </Popover>
            ),
        },
        {
            title: "上级",
            align: "center",
            dataIndex: "fromnick",
            render: (fromnick) => (
                <div> {fromnick || "暂无"}</div>
            ),
        },
        {
            title: "是否已加客服",
            align: "center",
            dataIndex: "status",
            render: (status) => (
                <div> {status === "0" ? "否" : "是"}</div>
            ),
        },
        {
            title: "扫码时间",
            dataIndex: "add_time",
            render: (add_time) => (
                <div> {add_time}</div>
            ),
        },
        ]
        return (
            <div className="pad20" >
                <div style={{ marginBottom: 20 }}>
                    <Input placeholder="请输入用户昵称" style={{ width: "300px" }} className="mr10" onChange={this.nickChange} value={nick} />
                    <Select allowClear={true} placeholder="请选择是否添加客服好友" style={{ width: 300 }} className="mr10" onChange={this.handleChange}>
                        <Option value="1">扫码已加客服</Option>
                        <Option value="0">扫码未加客服</Option>
                    </Select>
                    <Button type="primary" onClick={this.searchQrcode} >搜索</Button>
                    <a href="#/fission/act" className={styles.backa}>返回</a>
                </div>


                <Table columns={columns} dataSource={qrcodeLst} rowKey="id" pagination={paginationConfig} loading={loading} />
            </div>
        )
    }
}
function mapStateToProps (state) {
    const { qrcodeLst, qrcodeTotal } = state.fission
    return {
        qrcodeLst,
        qrcodeTotal,
        loading: state.loading.models.fission,
    }
}
export default connect(mapStateToProps)(Page)

