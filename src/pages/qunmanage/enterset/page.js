import { Component } from "react"
import { connect } from "dva"
import { Table, Button, Popconfirm, message} from "antd"
import Editor from "./components/Editor"
import moment from "moment"
import request from "../../../utils/request"
const fetchUrl = "//wechat.yunbeisoft.com/index_test.php/home"

const columns = [
    {
        title: "微信号",
        dataIndex: "qun_content",
        render: (qun_content) => {
            if (qun_content) {
                qun_content = JSON.parse(qun_content)
                let list = []
                qun_content = qun_content.map((item) => {
                    if (!list.find((mess) => mess === item.kefu_nick)) {
                        list.push(item.kefu_nick)
                    }
                })
                list = list.join("，")
                return list
            }
        },
    }, {
        title: "群名称",
        dataIndex: "qun_name",
    }, {
        title: "关键词",
        dataIndex: "keyword",
    }, {
        title: "操作人",
        dataIndex: "user",
    },
    {
        title: "时间",
        dataIndex: "createtime",
        render: (time) => moment(new Date(time * 1000)).format("YYYY-MM-DD HH:mm:ss"),
    },
]

class Page extends Component {
    state = {
        rulesList: [],
        isLoading: false,
        checked: [],
        qundata: [],
        visible: false,
    }
    componentDidMount () {
        this.fetchData()
    }
    fetchData = async () => {
        this.setState({ isLoading: true })
        const option = {method: "post", url: `${fetchUrl}/quns/get_addqun_setting`}
        let {data} = await request(option)
        this.setState({ isLoading: false, rulesList: data.data })
    }
    showModal=async (action, record) => {
        let {qundata} = this.state
        this.setState({ visible: true, action, record})
        if (qundata.length === 0) {
            const option = {method: "post", url: `${fetchUrl}/qunmanage/getlist`}
            let {data} = await request(option)
            qundata = data.data.qundata
        }
        this.setState({qundata})
    }
    handleChange = (selectedRowKeys, selectedRows) => {
        const checked = selectedRows.length > 0 ? selectedRows.map((item) => item.id) : []
        this.setState({ checked })
    }
    handleCancel=() => {
        this.setState({visible: false})
    }
    // 新增编辑规则
    handleSubmit = async (value) => {
        const {action, record} = this.state
        value.user = window.sessionStorage.getItem("user")
        if (record) {
            value.id = record.id
        }
        const option = {method: "post", url: `${fetchUrl}/quns/${action}`, data: JSON.stringify(value)}
        let {data} = await request(option)
        if (data.error) {
            return message.error(data.msg)
        }
        this.setState({ visible: false })
        this.fetchData()
    }
    // 删除
    onConfirmDelect= (item, id) => async () => {
        let {rulesList} = this.state
        const option = {method: "post", url: `${fetchUrl}/quns/del_addqun_setting`, data: JSON.stringify({id})}
        let {data} = await request(option)
        if (data.error) {
            return message.error(data.msg)
        }
        rulesList = rulesList.filter((i) => i.id !== id)
        this.setState({rulesList})
        message.success("删除成功")
    }
    render () {
        const { rulesList, isLoading, checked, visible, qundata, record } = this.state
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => this.handleChange(selectedRowKeys, selectedRows),
        }
        columns[8] = {
            title: "操作",
            render: (item) =>
                <div>
                    <Button className="mar5" type="primary" onClick={() => this.showModal("upd_addqun_settiong", item)}>编辑</Button>
                    <Popconfirm title={"确认删除吗?"} onConfirm={this.onConfirmDelect(item, item.id)}>
                        <Button className="mar5" type="danger">删除</Button>
                    </Popconfirm>
                </div>,
        }
        const header = () => (
            <div>
                <Button type="primary" className="mr10" onClick={() => this.showModal("add_addqun_setting")}>新增进群规则</Button>
                <Popconfirm title={"确认删除吗?"}>
                    <Button type="danger" disabled={checked.length < 1}>删除</Button>
                </Popconfirm>
            </div>
        )
        return (
            <div className="pad20">
                <Table
                    rowKey="id"
                    title={header}
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={rulesList}
                    loading={isLoading}
                    bordered={true}
                    pagination={{ showQuickJumper: true, hideOnSinglePage: true}}
                />
                {visible && <Editor
                    record={record}
                    qundata={qundata}
                    visible={visible}
                    handleSubmit={this.handleSubmit}
                    handleCancel={this.handleCancel}/>}
            </div>
        )
    }
}
function mapStateToProps (state) {
    const {qundata } = state.vertisy
    return {
        qundata,
    }
}
export default connect(mapStateToProps)(Page)
