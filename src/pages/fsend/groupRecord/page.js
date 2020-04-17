import { Table, Switch, Button } from "antd"
import RecordForm from "../../vertisy/record/components/RecordForm"
import Detail from "./components/Detail"
import { connect } from "dva"
import { Component } from "react"
import { hasEmoji } from "../../../utils/helper"
const typeList = [{ id: "1", name: "图文" }, { id: "0", name: "文本" }]
const TypeFun = (id) => {
    const target = typeList.find((item) => item.id === id)
    return target && target.name ? target.name : "文本"
}
const contentFun = (content, row) => {
    if (row.ContentType === "1" && content) {
        return <img src={content} alt="" style={{ height: "60px" }} />
    }
    if (row.ContentType === "0" && content) {
        return <span dangerouslySetInnerHTML={{ __html: hasEmoji(content) }} />
    } else {
        return "无"
    }
}
const WeChatFun = (WeChatId, weChatList) => {
    let list = weChatList && weChatList.find((item) => item.wxid === WeChatId)
    if (list) {
        return list.nickname ? list.nickname : "未命名"
    } else {
        return WeChatId
    }
}
const columns = [
    { title: "设备名称", dataIndex: "devicename", width: 150 },
    { title: "执行微信", dataIndex: "WeChatId" },
    { title: "操作人", dataIndex: "excuse_account", width: 100 },
    { title: "任务类型", dataIndex: "ContentType", width: 100, render: (id) => TypeFun(id) },
    { title: "消息内容", dataIndex: "Content", render: (content, row) => contentFun(content, row) },
    {
        title: "时间", dataIndex: "reg_time", width: 240, render: (reg_time, record) => <div>
            <div>创建时间：{reg_time}</div>
            <div style={{ padding: "5px 0" }}>定时时间：{(record.time === "0" || !record.time) ? "无定时" : record.time}</div>
            <div>执行时间：{record.excuse_time}</div>
        </div>,
    },
    // { title: "创建时间", dataIndex: "reg_time", width: 170 },
    {
        title: "状态",
        dataIndex: "excuse_status", width: 80,
        render: (status) => (status === 1 ? "已执行" : "未执行"),
    },
]

class Page extends Component {
    state = { visible: false, currentDetail: 1 }
    ChangeSwitch = (id) => (quxiao) => {
        this.props.dispatch({ type: "vertisy/stopGroupSend", payload: { quxiao: quxiao ? "0" : "1", id } })
    }
    showModel = (record) => {
        this.setState({
            visible: true,
            record,
        })
        let { dispatch } = this.props
        dispatch({
            type: "vertisy/detailQunfa",
            payload: { id: record.id },
        })
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
            currentDetail: 1,
        })
    }
    handleSubmit = (value) => {
        this.setState({ value, current: 1 })
    }
    pageChangeHandler = async (page, pageSize) => {
        this.setState({ current: page })
        let { dispatch } = this.props
        await dispatch({
            type: "vertisy/fetchQunfa",
            payload: { page, ...this.state.value },
        })
        if (document.getElementsByClassName("ant-table-body")) {
            document.getElementsByClassName("ant-table-body")[0].scrollTop = 0
        }
    }
    ShowTotalItem = () => {
        const { groupTotal } = this.props
        return (
            <span style={{ marginTop: 5, color: "rgba(0,0,0,0.5)", display: "block" }}>总数{groupTotal}条</span>
        )
    }
    render () {
        let { groupList, loading, weChatList, dispatch, groupTotal } = this.props
        const { currentDetail, visible, record, current } = this.state
        const paginationConfig = {
            total: groupTotal,
            defaultPageSize: 20,
            //    hideOnSinglePage: true,
            showTotal: this.ShowTotalItem,
            onChange: this.pageChangeHandler, // 点击分页
            current,
        }
        columns[1] = { title: "执行微信", dataIndex: "WeChatId", width: 150, render: (WeChatId) => WeChatFun(WeChatId, weChatList) }
        columns[10] = {
            title: "停止/开启",
            dataIndex: "quxiao",
            width: 110,
            render: (quxiao, item) => (
                <Switch
                    disabled={item.excuse_status === 1}
                    onChange={this.ChangeSwitch(item.id)}
                    checkedChildren={item.excuse_status === 1 ? "已发送" : "开启"}
                    unCheckedChildren="停止"
                    defaultChecked={quxiao === "0"}
                />
            ),
        }
        columns[11] = {
            title: "操作", key: "operation", width: 121,
            render: (record) => (<Button type="primary" onClick={() => this.showModel(record)}>查看详情</Button>),
        }
        let heigthY = document.getElementById("cont") ? document.getElementById("cont").offsetHeight - 270 : "auto"
        return (
            <div className="pad10">
                <div className="pad10">
                    <RecordForm handleSubmit={this.handleSubmit} action="fetchQunfa" typeList={typeList} weChatList={weChatList} dispatch={dispatch} />
                </div>
                <div className="pad10">
                    <Table dataSource={groupList} bordered={true} pagination={paginationConfig} rowKey="id" columns={columns} simple loading={!visible && loading} scroll={{ y: heigthY }} />
                </div>
                <Detail record={record} current={currentDetail} visible={visible} {...this.props} handleCancel={this.handleCancel} />
            </div>
        )
    }
}
function mapStateToProps (state) {
    const { groupList, detailList, groupTotal } = state.vertisy
    return {
        loading: state.loading.models.vertisy,
        detailList,
        groupList, groupTotal,
        weChatList: state.vertisy.weChatList,
    }
}
export default connect(mapStateToProps)(Page)
