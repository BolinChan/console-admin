import { Component } from "react"
import { connect } from "dva"
import { Table, Button, Popconfirm, message} from "antd"
import Editor from "../enterset/components/Editor"
import moment from "moment"
import request from "../../../utils/request"
const fetchUrl = "//wechat.yunbeisoft.com/index_test.php/home"
const plainOptions = [{label: "名片", value: "1"}, {label: "链接", value: "2"}, {label: "小程序", value: "3"}]

const columns = [
    {
        title: "操作人",
        dataIndex: "user",
    },
    {
        title: "群名称",
        dataIndex: "qun_name",
    }, {
        title: "关键词",
        dataIndex: "keyword",
    },
    {
        title: "其他类型",
        dataIndex: "type",
        render: (type) => {
            let name = []
            plainOptions.map((item) => {
                if (type.find((va) => va === item.value)) {
                    name.push(item.label)
                }
            })
            name && (name = name.join("，"))
            return name
        },
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
        selectedRowKeys: [],
        visible: false,
    }
    componentDidMount () {
        this.fetchData()
    }
    fetchData = async () => {
        this.setState({ isLoading: true })
        const option = {method: "post", url: `${fetchUrl}/qunmanage/get_tiqun_setting`}
        let {data} = await request(option)
        this.setState({ isLoading: false, rulesList: data.data })
    }
    showModal=async (action, record) => {
        this.setState({ visible: true, action, record})
    }
    handleChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys })
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
        const option = {method: "post", url: `${fetchUrl}/qunmanage/${action}`, data: JSON.stringify(value)}
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
        const option = {method: "post", url: `${fetchUrl}/qunmanage/del_tiqun_setting`, data: JSON.stringify({id})}
        let {data} = await request(option)
        if (data.error) {
            return message.error(data.msg)
        }
        rulesList = rulesList.filter((i) => i.id !== id)
        this.setState({rulesList})
        message.success("删除成功")
    }
    render () {
        const { rulesList, isLoading, visible, record, selectedRowKeys } = this.state
        const {qundata} = this.props
        const rowSelection = {
            selectedRowKeys,
            onChange: this.handleChange,
        }
        columns[8] = {
            title: "操作",
            render: (item) =>
                <div>
                    <Button className="mar5" type="primary" onClick={() => this.showModal("upd_tiqun_setting", item)}>编辑</Button>
                    <Popconfirm title={"确认删除吗?"} onConfirm={this.onConfirmDelect(item, item.id)}>
                        <Button className="mar5" type="danger">删除</Button>
                    </Popconfirm>
                </div>,
        }
        const header = () => (
            <div >
                <Button type="primary" className="mr10" onClick={() => this.showModal("add_tiqun_setting")}>新增进群规则</Button>
                {/* <Popconfirm title={"确认删除吗?"}>
                    <Button type="danger" disabled={selectedRowKeys.length < 1}>批量删除</Button>
                </Popconfirm> */}
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
                    kick={true}
                    plainOptions={plainOptions}
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
