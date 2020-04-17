import { Table, Avatar, Tag, Button, Row } from "antd"
import styles from "../page.css"
import SetName from "./SetName"
// 删除标签
const preventDefault = (dispatch, tagid, id, record) => (e) => {
    e.preventDefault()
    e.stopPropagation()
    let index = tagid.findIndex((item) => item === id)
    tagid.splice(index, 1)
    dispatch({
        type: "chat/editTags",
        payload: { wxid: record.wxid, kefu_wxid: record.kefu_wxid, tagid },
    })
}
// 删除好友分配的客服
const preventKefu = (dispatch, kefuid, record) => (e) => {
    e.stopPropagation()
    dispatch({
        type: "chat/delFkefu",
        payload: { kefuid, userid: record.userid },
    })
}

const tagFun = (tagid, tags, dispatch, record) => {
    if (tags && tagid.length > 0 || record.wxtagname) {
        let list = []
        tags && tags.map((mess) => {
            if (tagid.find((id) => mess.id === id)) {
                list.push(mess)
            }
        })
        return (
            <span>
                { record.wxtagname && record.wxtagname.map((wxname) =>
                    <Tag color="green" style={{ margin: "3px" }} key={wxname}>
                        <span title={wxname}>{wxname.length > 6 ? wxname.slice(0, 6) + "..." : wxname}</span>
                    </Tag>
                )}
                {list.map((item) => (
                    <Tag closable onClose={preventDefault(dispatch, tagid, item.id, record)} color="blue" style={{ margin: "3px" }} key={item.id}>
                        <span title={item.tag_name}>{item.tag_name.length > 6 ? item.tag_name.slice(0, 6) + "..." : item.tag_name}</span>
                    </Tag>
                ))}
            </span>
        )
    } else {
        return "无"
    }
}
const FirendTable = ({ showModifyInfo, showChatModel, selectMatch, showTag, pageChangeHandler, onSelectChange, tabledata}) => {
    let { loading, contacts, weChatList, contactTotal, current, tags, dispatch, selectedRowKeys, usergroup, fieldtotal, fieldata} = tabledata
    let width = 150
    const columns = [
        {
            title: "好友微信", dataIndex: "wxid", width: 270, fixed: "left",
            render: (wxid, item) => (
                <div>
                    <Row type="flex" align="middle">
                        <Avatar shape="square" size="large" icon="user" src={item.headImg} />
                        <div className={styles.beyond}>
                            <div title={item.nick || item.remark || wxid}>
                            昵称：
                                {item.nick || item.remark || wxid}
                            </div>
                            <div>
                            微信号：
                                {item.FriendNo || "未知"}
                            </div>
                        </div>
                    </Row>
                </div>
            ) },
        {
            title: "所属微信", dataIndex: "kefu_wxid", width,
            render: (id) => {
                let index = weChatList && weChatList.findIndex((item) => item.wxid === id)
                if (index !== -1) {
                    return weChatList[index].nickname || weChatList[index].remark || id
                }
            },
        },
        {title: "所属客服", dataIndex: "ziaccounts", width: 200,
            render: (ziaccounts, record) => {
                let list = []
                ziaccounts.map((mess) => {
                    if (mess.accountnum && !list.find((i) => i.accountnum === mess.accountnum)) {
                        list.push(mess)
                    }
                })
                return (
                    <div style={{width: "100%"}}>
                        {/* closable */}
                        { list && list.length > 0
                            ? list.map((item, index) => <Tag onClose={preventKefu(dispatch, item.id, record)} color="blue" style={{ margin: "3px" }} key={index}>{item.accountnum}</Tag>) : "无"}
                    </div>
                )

            },
        },
        { title: "性别", dataIndex: "sex", width: 70, render: (sex) => sex === "1" ? "男" : "女"},
        {
            title: "手机号码", dataIndex: "phone", width,
            render: (phone, record) => <SetName action="editPhone" holder="请输入手机号码" record={record} dispatch={dispatch} defaultname={phone ? phone : "未绑定"} />,
        }, {
            title: "旺旺号", width: 170, dataIndex: "buyer_name",
            render: (buyername, record) => <SetName action="editWang" holder="请输入旺旺号" record={record} dispatch={dispatch} defaultname={buyername ? buyername : "未绑定"} />,
        }, {
            title: "京东帐号", width: 170, dataIndex: "jdAccount",
            render: (jdAccount, record) => <SetName action="editJd" holder="请输入京东帐号" record={record} dispatch={dispatch} defaultname={jdAccount ? jdAccount : "未绑定"} />,
        },
        {
            title: "备注", dataIndex: "remark", width,
            render: (remark, record) => <SetName action="editRemark" holder="请输入备注" record={record} dispatch={dispatch} defaultname={remark ? remark : "无"} />,
        },
        {
            title: "备忘录", dataIndex: "record", width,
            render: (text, record) => <SetName action="editAddress" holder="请输入备忘录" record={record} dispatch={dispatch} defaultname={text ? text : "无"} /> },
        {
            title: "居住地址", dataIndex: "address", width,
            render: (text, record) => <SetName address={true} action="editAddress" holder="请输入居住地址" record={record} dispatch={dispatch} defaultname={text ? text : "无"} /> },
        {
            title: "所在分组", dataIndex: "fid", width,
            render: (fid, record) => {
                let list = usergroup && usergroup.find((mess) => mess.id === fid)
                if (list && list.fenzu_name) {
                    record.fenzu_name = list.fenzu_name
                }
                return (<a title="点击设置分组" style={{color: !(list && list.fenzu_name) && "#3f78ad"}} onClick={() => showModifyInfo("assignmentUser", record)}> { list && list.fenzu_name || "设置分组" } </a>)
            },
        },
        { title: "好友标签", dataIndex: "tagid", width, render: (tagid, record) => tagFun(tagid, tags, dispatch, record)},
        { title: "地区", dataIndex: "city", width: 70, render: (text) => <div>{text ? text : "未知"}</div> },
        { title: "添加时间", dataIndex: "createtime", width: 170 },
        {
            title: "操作", key: "opt", width: 230, fixed: "right",
            render: (record) => (
                <div>
                    <Button type="primary" className="mar5" onClick={showTag && showTag("编辑", record, "editTags")}>编辑标签</Button>
                    <Button type="primary" className="mar5"
                        onClick={selectMatch("selectFriend", "分配客服", null, record)}>分配客服</Button>
                    <Button className="mar5" onClick={() => showChatModel && showChatModel(record)}>聊天记录</Button>
                    <Button className="mar5" onClick={selectMatch("getHistoryMsg", "同步记录", null, record)}>同步记录</Button>
                </div>
            ),
        },
    ]
    if (fieldata) {
        fieldata = fieldata.filter((item) => item.status === "1")
        fieldtotal = fieldata.length
        fieldata.map((item) => {
            columns.splice(columns.length - 3, 0, { title: item.name, key: item.id, width, render: (record) => {
                let fields = record.extend_fields && typeof record.extend_fields === "string" ? JSON.parse(record.extend_fields) : record.extend_fields
                let defaultname = fields && fields[item.id]
                let name = defaultname || "点击修改"
                if (defaultname && typeof defaultname === "object") {
                    name = defaultname.join("，")
                }
                if (item.type === "6" || item.type === "7" || item.type === "5" || item.type === "4") {
                    return <a style={{ color: !defaultname && "#3f78ad", display: "block"}} onClick={() => showModifyInfo("editfriendfield", record, {...item, defaultname, fields})} title="点击修改">
                        {name}
                    </a>
                } else {
                    return <SetName
                        type={item.type}
                        action="editfriendfield"
                        holder="请输入"
                        record={record}
                        fielditem={item}
                        fields={fields}
                        dispatch={dispatch}
                        defaultname={fields && fields[item.id] ? fields[item.id] : "无"} />
                }
            }})
        })
    }
    const showTotal = () => (
        <span style={{ marginTop: 5, color: "rgba(0,0,0,0.5)", display: "block" }}>总数{contactTotal}条</span>
    )
    const paginationConfig = {
        total: contactTotal, // 总数
        defaultPageSize: 20, // 每页显示条数
        onChange: pageChangeHandler, // 点击分页
        showTotal,
        current: current,
    }
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    }
    const heigth = document.getElementById("cont") ? document.getElementById("cont").offsetHeight - 430 : 600
    const widthx = 2444 + fieldtotal * (width + 2)

    return (
        <div>
            <Table
                rowSelection={rowSelection}
                dataSource={contacts}
                pagination={paginationConfig}
                rowKey="userid"
                columns={columns}
                loading={loading}
                bordered
                simple
                scroll={{ x: widthx, y: heigth }}/>
        </div>
    )
}
export default FirendTable
