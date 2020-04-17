import { Table, Popconfirm, Button, Switch, Tooltip, Modal } from "antd"
import RecordForm from "./components/RecordForm"
import { connect } from "dva"
import styles from "../../material/page.css"
import { Component } from "react"

import { hasEmoji } from "../../../utils/helper"
const typeList = [{ id: "2", name: "图文" }, { id: "0", name: "链接" }, { id: "3", name: "视频" }]
const TypeFun = (id) => {
    const target = typeList.find((item) => item.id === id)
    return target && target.name ? target.name : "文本"
}

const contentFun = (content, row) => {

    if (row.p_type === "0") {
        return "无"
    } else {
        if (!content) {
            return "无"
        }
        content = hasEmoji(content)
        return <Tooltip placement="top" title={<div dangerouslySetInnerHTML={{ __html: content }} />} overlayStyle={{ maxWidth: "500px" }}>
            <div className={styles.lineText} dangerouslySetInnerHTML={{ __html: content }} />
        </Tooltip>
    }
}


const commentFun = (text, record) => {
    let commentList = text ? [text] : []
    if (record.comments) {
        commentList.push(...record.comments)
    }
    return commentList.map((item) =>
        (item ? <Tooltip key={item} placement="top" title={item} overlayStyle={{ maxWidth: "500px" }}>
            {item.length > 20 ? item.substring(0, 20) + "......" : item}<br></br>
        </Tooltip> : "无")
    )
}
let width = 100
// let width2 = 250


class Page extends Component {
    state = { current: 1, value: {}, visible: false, selUrl: "", selType: "", selectedRowKeys: [] }
    ChangeSwitch = (id) => (is_stop) => {
        this.props.dispatch({ type: "vertisy/stopCircleSend", payload: { fa_pengyouquan: is_stop ? "0" : "1", id } })
    }
    // 删除朋友圈记录
    deleteConfirm = (id) => {
        if (typeof id === "string") {
            this.props.dispatch({ type: "vertisy/delCircle", payload: { id } })
        } else {
            this.props.dispatch({ type: "vertisy/delCircle", payload: { id: this.state.selectedRowKeys } })
            this.setState({ selectedRowKeys: [] })
        }
    }
    handleSubmit = (value) => {
        this.setState({ value, current: 1 })
    }
    pageChangeHandler = async (page, pageSize) => {
        this.setState({ current: page })
        let { dispatch } = this.props
        await dispatch({
            type: "vertisy/fetchCircle",
            payload: { page, ...this.state.value },
        })
        if (document.getElementsByClassName("ant-layout-content")) {
            document.getElementsByClassName("ant-layout-content")[0].scrollTop = 0
        }
    }
    // 再次推送朋友圈
    // replaceSend =(id) => () => {
    //     this.props.dispatch({
    //         type: "vertisy/replaceSend",
    //         payload: { id },
    //     })
    // }
    // 批量选择
    onSelectChange = (selectedRowKeys, Rows) => {
        this.setState({ selectedRowKeys })
    }
    ShowTotalItem = () => {
        const { circleTotal } = this.props
        return (
            <span style={{ marginTop: 5, color: "rgba(0,0,0,0.5)", display: "block" }}>总数{circleTotal}条</span>
        )
    }
    handleShow = (selUrl, selType) => {
        this.setState({ visible: true, selUrl, selType })
    }
    handleCancle = () => {
        this.setState({ visible: false, selUrl: "", selType: "" })
    }
    sourceFun = (source, row) => {
        if (row.p_type === "0" && row.Content) {
            return "无"
        }
        if (row.p_type === "2" && source && source[source.length - 1] === "]") {
            let list = source && JSON.parse(source)
            list = list && list.filter((item) => item)
            return (
                <section style={{ padding: 0 }}>
                    {list && list.map((item, index) => (
                        list.length > 3
                            ? <div key={index} id="itemImg" className={styles.imgItem} style={{ height: 80, margin: 2, maxWidth: 80, minWidth: 80 }}>
                                <img key={index} src={item} alt="" style={{ height: "100%", position: "absolute", cursor: "pointer" }} onClick={() => this.handleShow(item, row.p_type)} />
                            </div>
                            : <img key={index} src={item} alt="" style={{ height: 80, margin: 2, cursor: "pointer" }} onClick={() => this.handleShow(item, row.p_type)} />
                    ))}
                </section>
            )
        }
        if (row.p_type === "3" && source) {
            return <img alt="视频" style={{ height: 80, width: 80, cursor: "pointer" }} src="http://qn.fuwuhao.cc/vdp.png" onClick={() => this.handleShow(source = JSON.parse(source), row.p_type)} />
        } else {
            return "无"
        }
    }

    render () {
        const { circleList, loading, weChatList, dispatch, circleTotal } = this.props
        const { selectedRowKeys, current, visible, selUrl, selType } = this.state
        const paginationConfig = {
            total: circleTotal, // 总数
            defaultPageSize: 20, // 每页显示条数
            onChange: this.pageChangeHandler, // 点击分页
            current,
            showTotal: this.ShowTotalItem,
        }
        let columns = [
            { title: "设备名称", width: 200, dataIndex: "devicename", render: (devicename, record) => (<div className="f fv" ><span>{devicename}</span><span>执行微信：{record.nickname}</span></div>) },
            { title: "操作人", dataIndex: "excuse_account", width, render: (name, record) => (name ? name : record.phone ? "手动发送" : "未知") },
            { title: "任务类型", dataIndex: "p_type", width, render: (id) => TypeFun(id) },
            { title: "文案内容", dataIndex: "Content", width: 150, render: (content, row) => contentFun(content, row) },
            { title: "分享内容", dataIndex: "source", width: 295, render: (source, row) => this.sourceFun(source, row) },
            { title: "评论", dataIndex: "Comment", width: 150, render: (text, record) => commentFun(text, record) },
            {
                title: "时间", dataIndex: "reg_time", width: 240, render: (reg_time, record) => <div>
                    <div>创建时间：{reg_time}</div>
                    <div style={{ padding: "5px 0" }}>定时时间：{(record.time === "0" || !record.time) ? "无定时" : record.time}</div>
                    <div>执行时间：{record.protime}</div>
                </div>,
            },
            { title: "发送结果", dataIndex: "is_fail", width, render: (is_fail, record) => is_fail === 0 && record.status === "1" ? "发送成功" : record.status === "0" ? "未发送" : "发送失败" },
            {
                title: "开启/撤回",
                dataIndex: "is_stop",
                width: 110,
                render: (is_stop, item) => {
                    let bac = item.is_fail === 1 && item.status === "1"
                    return (
                        <Switch
                            disabled={item.status === "1"}
                            onChange={this.ChangeSwitch(item.id)}
                            checkedChildren={item.status === "1" ? "已发送" : "开启"}
                            unCheckedChildren="停止"
                            defaultChecked={is_stop === "0"}
                            style={{ backgroundColor: bac ? "#f5222d" : "auto" }} />
                    )
                },
            },
            {
                title: "操作",
                key: "operation",
                // fixed: "right",
                width: 110,
                render: (record) => (
                    <div>
                        <Popconfirm title="确定要重发吗？" onConfirm={() => window.location.href = `#/vertisy/circle?d=${record.id}`}>
                            <Button disabled={record.is_fail === 0} title={record.is_fail === 0 ? "已发送成功的数据不支持重发" : ""} type="primary" style={{ margin: 5 }}>重发</Button>
                        </Popconfirm>
                        {/* <Popconfirm title="是否要重新编辑发表的内容？" cancelText="直接发送" onCancel={this.replaceSend(record.id)} onConfirm={() => window.location.href = `#/vertisy/circle?d=${record.id}`}>
                            <Button disabled={record.is_fail === 0} title={record.is_fail === 0 ? "已发送成功的数据不支持重发" : ""} type="primary" style={{margin: 5}}>重发</Button>
                        </Popconfirm> */}
                        <Popconfirm title="确定要删除吗？" onConfirm={() => this.deleteConfirm(record.id)}>
                            <Button style={{ margin: 5 }} type="danger" >删除</Button>
                        </Popconfirm>
                    </div>
                ),
            },
        ]


        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        }
        return (
            <div className="pad10" >
                <div className="pad10">
                    <RecordForm
                        action="fetchCircle"
                        typeList={typeList}
                        weChatList={weChatList}
                        dispatch={dispatch}
                        handleSubmit={this.handleSubmit}
                        selectedRowKeys={selectedRowKeys}
                        deleteConfirm={this.deleteConfirm} />
                </div>
                <div className="pad10">
                    <Table
                        rowSelection={rowSelection}
                        dataSource={circleList}
                        bordered={true}
                        pagination={paginationConfig}
                        rowKey="id"
                        columns={columns}
                        simple
                        loading={loading} />
                </div>
                <Modal visible={visible} footer={null} onCancel={this.handleCancle} bodyStyle={{ padding: "0" }}>
                    {selType && selType === "2" && <img alt="图片" src={selUrl} style={{ width: "100%" }}></img>}
                    {selType && selType === "3" && <video alt="视频" src={selUrl} controls style={{ width: "100%", maxHeight: 600 }} />}
                </Modal>
            </div >
        )
    }
}

function mapStateToProps (state) {
    const { circleList, weChatList, circleTotal } = state.vertisy
    return {
        loading: state.loading.models.vertisy,
        circleList,
        weChatList,
        circleTotal,
    }
}
export default connect(mapStateToProps)(Page)
