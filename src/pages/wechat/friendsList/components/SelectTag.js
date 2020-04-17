import { Modal, Checkbox } from "antd"
// import { Component } from "react"
const CheckboxGroup = Checkbox.Group
const SelectTag = ({selecTagid, values, tags, isTag, onChangeSelect, onCancel, type, total, contactTotal, selectedRowKeys, userRow, dispatch}) => {
    const handleOk = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (type === "搜索") {
            dispatch({
                type: "chat/fenpeiTag",
                payload: { conditions: values, tagid: selecTagid },
            })
            onCancel && onCancel()
            return
        }
        if (type === "批量删除") {
            dispatch({
                type: "chat/maxDelTags",
                payload: { uid: selectedRowKeys, tagid: selecTagid},
            })
            onCancel && onCancel()
            return
        }
        if (type === "批量编辑") {
            dispatch({
                type: "chat/maxEditTags",
                payload: { uid: selectedRowKeys, tagid: selecTagid },
            })
        } else {
            const { wxid, kefu_wxid } = userRow
            dispatch({
                type: "chat/editTags",
                payload: { wxid, kefu_wxid, tagid: selecTagid },
            })

        }
        onCancel && onCancel()
    }
    tags && tags.map((item) => {
        item.label = item.tag_name
        item.value = item.id
    })
    total = selectedRowKeys.length
    let title = type
    if (type === "搜索") {
        title = "给搜索结果打"
        total = contactTotal
    }
    if (selecTagid && tags) {
        selecTagid.map((item, index) => {
            const i = tags.findIndex((mess) => mess.id === item)
            i === -1 && selecTagid.splice(index, 1)
        })
    }
    return (
        <span>
            <Modal
                destroyOnClose={true} onOk={handleOk} title={title + "标签"} visible={isTag} onCancel={onCancel} wrapClassName="wrapClass"
                width="646px"
                style={{ height: "60%", overflow: "hidden"}}
                bodyStyle={{ height: "calc(100% - 108px)", overflow: "auto", padding: "20px" }}>
                { !userRow && <div className="pad10">编辑标签的好友数量：{total}</div>}
                <CheckboxGroup options={tags} defaultValue={selecTagid} onChange={onChangeSelect}>
                </CheckboxGroup>
            </Modal>
        </span>
    )
}

export default SelectTag

// import { Modal, Checkbox, Form, Radio} from "antd"
// // import { Component } from "react"
// const CheckboxGroup = Checkbox.Group
// const FormItem = Form.Item
// const SelectTag = ({ conditions, tags, isTag, onCancel, type, contactTotal, selectedRowKeys, userRow, dispatch, form, action}) => {
//     const {getFieldDecorator, getFieldValue, validateFields} = form
//     const handleOk = (e) => {
//         validateFields((err, values) => {
//             if (!err) {
//                 let {payload, tagid} = values
//                 action = action || values.action
//                 if (action === "fenpeiTag") {
//                     payload = { conditions, tagid }
//                 }
//                 if (action === "maxEditTags") {
//                     payload = { uid: selectedRowKeys, tagid }
//                 }
//                 if (action === "editTags") {
//                     const { wxid, kefu_wxid } = userRow
//                     payload = { wxid, kefu_wxid, tagid }
//                 }
//                 if (action === "maxDelTags") {
//                     payload = { uid: selectedRowKeys, tagid}
//                 }
//                 dispatch({
//                     type: `chat/${action}`,
//                     payload,
//                 })
//             }
//         })
//         onCancel && onCancel()
//     }
//     tags && tags.map((item) => {
//         item.label = item.tag_name
//         item.value = item.id
//     })
//     let selecTagid = userRow ? userRow.tagid : []
//     if (selecTagid && tags) {
//         selecTagid.map((item, index) => {
//             const i = tags.findIndex((mess) => mess.id === item)
//             i === -1 && selecTagid.splice(index, 1)
//         })
//     }
//     const formItemLayout = {
//         style: { display: "flex" },
//         labelCol: { style: { minWidth: 100 } },
//         wrapperCol: { style: { flex: 1} },
//         colon: false,
//     }
//     return (
//         <Modal
//             destroyOnClose={true} onOk={handleOk} title={type + "标签"} visible={isTag} onCancel={onCancel} wrapClassName="wrapClass"
//             width="646px"
//             style={{ height: "60%", overflow: "hidden"}}
//             bodyStyle={{ height: "calc(100% - 108px)", overflow: "auto", padding: "20px" }}
//         >
//             <Form className="selectTag">
//                 {!userRow && action !== "maxDelTags" &&
//                     <FormItem {...formItemLayout} label="选择的好友:">
//                         {getFieldDecorator("action", {initialValue: selectedRowKeys.length > 0 ? "maxEditTags" : "fenpeiTag"})(
//                             <Radio.Group>
//                                 <Radio.Button value="maxEditTags">选中结果</Radio.Button>
//                                 <Radio.Button value="fenpeiTag">筛选结果</Radio.Button>
//                             </Radio.Group>
//                         )}
//                         <span className="ml10">已选择 {getFieldValue("action") === "fenpeiTag" ? contactTotal : selectedRowKeys.length} 个好友</span>
//                     </FormItem>
//                 }
//                 <FormItem {...formItemLayout} label=" ">
//                     {getFieldDecorator("tagid", {initialValue: selecTagid})(
//                         <CheckboxGroup options={tags}/>
//                     )}
//                 </FormItem>
//             </Form>
//         </Modal>
//     )
// }
// const RecordSearcheForm = Form.create()(SelectTag)
// export default RecordSearcheForm
