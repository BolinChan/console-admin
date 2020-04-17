import { testSubstr, decodeURIComponent } from "../utils/helper"
import * as chatService from "../services/service"
import { message } from "antd"
export default {
    namespace: "chat",
    state: {weChatList: [], contacts: [], contactTotal: 0, update: [], YHList: [], usergroup: [] },
    reducers: {
        saveContacts (
            state,
            {
                payload: { contacts, total },
            }
        ) {
            return { ...state, contacts, contactTotal: Number(total) }
        },
        updateContacts (
            state,
            {
                payload: { wxid, isflush },
            }
        ) {
            let update = state.update
            let index = update.findIndex((item) => item.wxid === wxid)
            index !== -1 ? (update[index].isflush = isflush) : (update.push({ wxid, isflush }))
            return { ...state, update }
        },
        saveRemark (state, { payload }) {
            let contacts = state.contacts
            let index
            // 给好友打标签
            if (payload.uid) {
                payload.uid.map((mess) => {
                    index = contacts.findIndex((item) => item.userid === mess)
                    if (index !== -1) {
                        payload.tagid.map((item) => {
                            if (!contacts[index].tagid.find((mess) => mess === item)) {
                                !payload.delTags && contacts[index].tagid.push(item)
                            }
                            if (payload.delTags && contacts[index].tagid.find((mess) => mess === item)) {
                                (contacts[index].tagid = contacts[index].tagid.filter((id) => id !== item))
                            }
                        })
                    }
                })
            } else {
                index = contacts.findIndex((item) => item.wxid === payload.wxid && item.kefu_wxid === payload.kefu_wxid)
                index !== -1 && (contacts[index] = { ...contacts[index], ...payload })
            }
            return { ...state, contacts }
        },
        saveAddress (
            state, { payload}
        ) {
            let contacts = state.contacts
            contacts && contacts.map((item, index) => {
                if (item.userid === payload.userid) {
                    contacts[index] = {...item, ...payload}
                }
            })
            return { ...state, contacts }
        },
        saveWeChatList (
            state,
            {
                payload: { weChatList, obj, eidtRemark },
            }
        ) {
            let wechattotal = state.wechattotal || weChatList && weChatList.length
            weChatList = weChatList || state.weChatList
            if (obj) {
                let index = weChatList.findIndex((item) => item.wxid === obj.wxid)
                index !== "-1" && weChatList[index].kefus.push(obj)
            }
            if (eidtRemark) {
                let index = weChatList.findIndex((item) => item.id === eidtRemark.id)
                index !== "-1" && (weChatList[index].wxremark = eidtRemark.remark)
            }
            return { ...state, weChatList, wechattotal }
        },
        delWeChatList (state, { payload }) {
            let weChatList = state.weChatList
            if (weChatList.find((item) => item.id === payload.id)) {
                weChatList = weChatList.filter((item) => item.id !== payload.id)
            }
            return { ...state, weChatList }
        },
        saveUserGroup (
            state,
            {
                payload: { data, delGroup, editGroup },
            }
        ) {
            let usergroup = data ? data : state.usergroup
            delGroup && (usergroup = usergroup.filter((item) => item.id !== delGroup))
            if (editGroup) {
                let index = usergroup.findIndex((item) => item.id === editGroup.fenzuid)
                index !== "-1" && (usergroup[index] = {id: editGroup.fenzuid, fenzu_name: editGroup.fenzu_name, number: usergroup[index].number})
            }
            usergroup = usergroup && usergroup.sort((a, b) => b.id - a.id)
            return { ...state, usergroup }
        },
        fenGroup (
            state,
            {
                payload: { uid, fid },
            }
        ) {
            let contacts = state.contacts
            let index = contacts.findIndex((item) => item.userid === uid)
            index !== -1 && (contacts[index].fid = fid)
            return { ...state, contacts }
        },
        saveYH (
            state,
            {
                payload: { data, edit, YHCount, id},
            }
        ) {
            let YHList = data || state.YHList
            if (id) {
                YHList = YHList.filter((item) => item.id !== id)
            }
            if (edit) {
                let index = YHList.findIndex((item) => item.id === edit.id)
                index !== -1 && (YHList[index] = {...YHList[index], ...edit, isstop: edit.isstop === "2" ? "0" : "1"})
            }
            return { ...state, YHList, YHCount }
        },
        saveChatDuty (
            state,
            {
                payload: { data, id, edit},
            }
        ) {
            const weChatList = state.weChatList
            let chatDuty = data || state.chatDuty
            if (weChatList && data) {
                chatDuty.map((item) => {
                    let devicename = []
                    if (item.deviceids) {
                        const deviceids = JSON.parse(item.deviceids)
                        deviceids.map((mess) => {
                            const list = weChatList.find((n) => n.deviceid === mess)
                            list && devicename.push(list.devicename)
                        })
                    }
                    item.devicename = devicename
                })
            }
            if (id) {
                chatDuty = chatDuty.filter((item) => item.id !== id)
            }
            if (edit) {
                let index = chatDuty.findIndex((item) => item.id === edit.id)
                index !== -1 && (chatDuty[index] = edit)
            }
            return { ...state, chatDuty }
        },
        savetemplate (
            state,
            {
                payload: { data, edit, id},
            }
        ) {
            let templist = data || state.templist
            if (id) {
                templist = templist.filter((item) => item.id !== id)
            }
            if (edit) {
                let index = templist.findIndex((item) => item.id === edit.id)
                index !== -1 && (templist[index].template_name = edit.template_name)
            }
            return { ...state, templist }
        },
        stopWechat (
            state,
            {
                payload: { WeChatId, stopVisible },
            }
        ) {
            let weChatList = state.weChatList
            let index = weChatList.findIndex((item) => item.wxid === WeChatId)
            index !== "-1" && (weChatList[index].stopVisible = stopVisible)
            return { ...state, weChatList }
        },

        savefield (
            state,
            {
                payload: { data, id },
            }
        ) {
            let fieldata = data ? data.data : state.fieldata
            const fieldtotal = data ? Number(data.total) : state.fieldtotal
            id && (fieldata = fieldata.filter((item) => item.id !== id))
            return { ...state, fieldata, fieldtotal}
        },
    },
    effects: {
        // 获取好友列表数据
        * fetchContactList ({ payload }, { call, put, select }) {
            const contacts = yield select((state) => state.chat.contacts)
            const weChatList = yield select((state) => state.chat.weChatList)
            let fname = ""
            if (payload.zu_id) {
                const usergroup = yield select((state) => state.chat.usergroup)
                fname = usergroup && usergroup.find((item) => item.id === payload.zu_id)
            }
            let kefu_wxid = weChatList && weChatList.map((item) => item.wxid)
            if (!weChatList || weChatList.length === 0 || (!payload && contacts && contacts.length > 0)) {
                return
            }
            if (payload && !payload.kefu_wxid) {
                payload.kefu_wxid = kefu_wxid
            }
            const { data } = yield call(chatService.fetchContactList, {fname: fname && fname.fenzu_name, kefu_wxid, ...payload})
            if (data.error) {
                return
            }
            yield put({
                type: "saveContacts",
                payload: {
                    contacts: data.contents,
                    total: data.total,
                },
            })
        },
        // 同步好友
        * updateContactList ({ payload }, { call, put, select }) {
            const { data } = yield call(chatService.updateContactList, payload)
            if (data.error) {
                message.error(data.errmsg)
                return false
            }
            yield put({
                type: "updateContacts",
                payload: { isflush: data.error, wxid: payload.WeChatId[0] },
            })
            message.success("同步成功")
            return true
        },
        // 清除粉丝
        * delContact ({ payload }, { call, put, select }) {
            const { data } = yield call(chatService.delContact, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({type: "fetchContactList", payload: {}})
            yield put({type: "stopWechat", payload})
            message.success("指令已执行")
        },
        // 停止清除粉丝
        * stopDelete ({ payload }, { call, put, select }) {
            const { data } = yield call(chatService.stopDelete, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            message.success("停止成功")
        },
        // 给好友修改备注
        * editRemark ({ payload }, { call, put }) {
            const { data } = yield call(chatService.editRemark, payload)
            if (data.error) {
                return
            }
            yield put({
                type: "saveRemark",
                payload,
            })
            message.success("修改成功")
        },
        // 给好友修改手机
        * editPhone ({ payload }, { call, put }) {
            const { data } = yield call(chatService.editPhone, payload)
            if (data.error) {
                return
            }
            yield put({
                type: "saveRemark",
                payload,
            })
            message.success("修改成功")
        },
        // 给好友修改旺旺号
        * editWang ({ payload }, { call, put }) {
            const { data } = yield call(chatService.editWang, { ...payload, wangwang: payload.buyer_name })
            if (data.error) {
                return
            }
            yield put({
                type: "saveRemark",
                payload,
            })
            message.success("修改成功")
        },
        // 修改京东帐号
        * editJd ({ payload }, { call, put }) {
            const { data } = yield call(chatService.editJd, payload)
            if (data.error) {
                return
            }
            yield put({
                type: "saveRemark",
                payload,
            })
            message.success("修改成功")
        },
        // 给好友修改备忘录 居住地址
        * editAddress ({ payload }, { call, put }) {
            const { data } = yield call(chatService.editAddress, payload)
            if (data.error) {
                return
            }
            yield put({
                type: "saveAddress",
                payload,
            })
            message.success("修改成功")
        },
        // 给好友打标签
        * editTags ({ payload }, { call, put }) {
            const { data } = yield call(chatService.editTags, payload)
            if (data.error) {
                return
            }
            yield put({
                type: "saveRemark",
                payload,
            })
            message.success("修改成功")
        },
        // 批量打标签
        * maxEditTags ({ payload }, { call, put }) {
            const { data } = yield call(chatService.maxEditTags, payload)
            if (data.error) {
                return
            }
            yield put({
                type: "saveRemark",
                payload,
            })
            message.success("修改成功")
        },
        // 批量去标签
        * maxDelTags ({ payload }, { call, put }) {
            const { data } = yield call(chatService.maxDelTags, payload)
            if (data.error) {
                return
            }
            yield put({
                type: "saveRemark",
                payload: {delTags: true, ...payload},
            })
            message.success("修改成功")
        },
        // 给搜索的结果打标签
        * fenpeiTag ({ payload }, { call, put, select}) {
            const weChatList = yield select((state) => state.chat.weChatList)
            let kefu_wxid = weChatList && weChatList.map((item) => item.wxid)
            if (!payload.conditions.kefu_wxid) {
                payload.conditions.kefu_wxid = kefu_wxid
            }
            const { data } = yield call(chatService.fenpeiTag, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "fetchContactList",
                payload: payload.conditions,
            })
        },
        // 获取微信列表数据
        * fetchWeChatList ({ payload }, { call, put, select }) {
            const weChatList = yield select((state) => state.chat.weChatList)
            const wechattotal = yield select((state) => state.chat.wechattotal)
            let userid = window.sessionStorage.getItem("i")
            if (weChatList && weChatList.length === wechattotal && !payload) {
                return
            }
            const { data } = yield call(chatService.fetchWeChatList, { userid, ...payload })
            yield put({
                type: "saveWeChatList",
                payload: {
                    weChatList: data.error ? [] : data.data,
                },
            })
        },
        // 删除微信（设备)
        * deleteWeChatList ({ payload }, { call, put }) {
            const { data } = yield call(chatService.deleteWeChatList, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "delWeChatList",
                payload: { ...payload },
            })
            message.success(data.errmsg)
        },
        // 修改设备微信备注
        * WeChatRemark ({ payload }, { call, put }) {
            const { data } = yield call(chatService.WeChatRemark, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "saveWeChatList",
                payload: { eidtRemark: payload },
            })
            message.success(data.errmsg)
        },
        // 分配设备微信给客服
        * DisEquipment ({ payload }, { call, put }) {
            let userid = window.sessionStorage.getItem("i")
            const { data } = yield call(chatService.DisEquipment, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "fetchWeChatList",
                payload: { userid },
            })
            message.success("分配成功")
        },
        // 分配设备微信给客服
        * Equipments ({ payload }, { call, put }) {
            let userid = window.sessionStorage.getItem("i")
            const { data } = yield call(chatService.Equipments, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "fetchWeChatList",
                payload: { userid },
            })
            message.success("分配成功")
        },
        // 取消微信客服
        * deleteKefu ({ payload }, { call, put }) {
            const { data } = yield call(chatService.deleteKefu, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            // yield put({
            //     type: "saveWeChatList",
            //     payload: { delDate: payload },
            // })
        },
        // 给客服分配粉丝微信号
        * selectFriend ({ payload }, { call, put }) {
            const { data } = yield call(chatService.selectFriend, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            if (payload.contactList) {
                yield put({
                    type: "fetchContactList",
                    payload: payload.contactList,
                })
            }
            message.success("分配成功！")
        },
        // 取消分配搜索结果
        * deleteSelectFriend ({ payload }, { call, put }) {
            const { data } = yield call(chatService.deleteSelectFriend, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            if (payload.contactList) {
                yield put({
                    type: "fetchContactList",
                    payload: payload.contactList,
                })
            }
            message.success("已取消分配！")
        },
        // 删除给客服分配粉丝微信号
        * delFkefu ({ payload }, { call, put }) {
            const { data } = yield call(chatService.delFkefu, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
        },
        // 分配好友分组
        * assignmentUser ({ payload }, { call, put }) {
            yield call(chatService.assignmentUser, payload)
            // const { data } = yield call(chatService.editusergroup, payload)
            // if (data.error) {
            //     return message.error(data.errmsg)
            // }
            yield put({
                type: "fenGroup",
                payload,
            })
            // message.success("分配成功！")
        },
        // 获取好友分组
        * getusergroup ({ payload }, { call, put, select }) {
            const usergroup = yield select((state) => state.chat.usergroup)
            if (usergroup && usergroup.length > 0 && !payload) {
                return
            }
            const { data } = yield call(chatService.getusergroup, {token: "1"})
            yield put({
                type: "saveUserGroup",
                payload: {
                    data: data.data,
                },
            })
        },
        // 删除好友分组
        * delusergroup ({ payload }, { call, put }) {
            const { data } = yield call(chatService.delusergroup, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "saveUserGroup",
                payload: { delGroup: payload.fid },
            })
        },
        // 添加好友分组
        * addusergroup ({ payload }, { call, put }) {
            const { data } = yield call(chatService.addusergroup, { fname: payload.fname})
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "getusergroup",
                payload: { add: "add"},
            })
            message.success("添加成功！")
        },
        // 编辑好友分组
        * editusergroup ({ payload }, { call, put }) {
            const { data } = yield call(chatService.editusergroup, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "saveUserGroup",
                payload: {editGroup: payload },
            })
            message.success("修改成功！")
        },
        // 获取养号列表
        * fetchNursing ({ payload }, { call, put, select }) {
            let YHList = yield select((state) => state.chat.YHList)
            let index = YHList && YHList.findIndex((item) => item.nickname === payload && payload.device_name)
            if (index !== -1) {
                return
            }
            const { data } = yield call(chatService.fetchNursing, payload)
            yield put({
                type: "saveYH",
                payload: {data: data.data, YHCount: Number(data.count || 0) },
            })
        },
        // 添加自动养号设置
        * addNursing ({ payload }, { call, put }) {
            const { data } = yield call(chatService.addNursing, payload)
            if (data.error) {
                return message.error(data.msg)
            }
            yield put({
                type: "fetchNursing",
                payload: {device_name: payload.nickname },
            })
            message.success("设置成功！")
        },
        // 编辑自动养号
        * editNursing ({ payload }, { call, put }) {
            const { data } = yield call(chatService.editNursing, {edit: "1", ...payload})
            if (data.error) {
                return message.error(data.msg)
            }
            yield put({
                type: "saveYH",
                payload: {edit: payload },
            })
            message.success("设置成功！")
        },

        // 删除自动养号
        * delNursing ({ payload }, { call, put }) {
            const { data } = yield call(chatService.delNursing, payload)
            if (data.error) {
                return message.error(data.msg)
            }
            yield put({
                type: "saveYH",
                payload,
            })
            message.success("删除成功！")
        },
        // 获取自动聊天任务
        * fetchAutoChatDuty (_, { call, put, select }) {
            const { data } = yield call(chatService.fetchAutoChatDuty)
            yield put({
                type: "saveChatDuty",
                payload: data,
            })
        },
        // 添加自动聊天任务
        * addAutoChatDuty ({ payload }, { call, put, select }) {
            const { data } = yield call(chatService.addAutoChatDuty, payload)
            if (data.error) {
                return message.error(data.msg)
            }
            yield put({
                type: "fetchAutoChatDuty",
            })
            message.success("设置成功！")
        },

        // 修改自动聊天任务
        * updateAutoChatDuty ({ payload }, { call, put }) {
            const { data } = yield call(chatService.updateAutoChatDuty, payload)
            if (data.error) {
                return message.error(data.msg)
            }
            yield put({
                type: "saveChatDuty",
                payload: {edit: payload},
            })
            message.success("设置成功！")
        },
        // 删除自动聊天任务
        * deleteChatDuty ({ payload }, { call, put }) {
            const { data } = yield call(chatService.deleteChatDuty, payload)
            if (data.error) {
                return message.error(data.msg)
            }
            yield put({
                type: "saveChatDuty",
                payload,
            })
            message.success("删除成功！")
        },
        // 获取模板
        * fetchTemplateGet (_, { call, put, select }) {
            const { data } = yield call(chatService.fetchTemplateGet)
            yield put({
                type: "savetemplate",
                payload: data,
            })
        },
        // 添加模板
        * templateAdd ({ payload }, { call, put, select }) {
            const { data } = yield call(chatService.templateAdd, payload)
            if (data.error) {
                return data
            }
            yield put({
                type: "fetchTemplateGet",
            })
            return data
        },

        // 修改模板名称
        * templateEdit ({ payload }, { call, put }) {
            const { data } = yield call(chatService.templateEdit, payload)
            if (data.error) {
                return data
            }
            yield put({type: "savetemplate", payload: {edit: payload} })
            return data
        },
        // 删除模板
        * templateDel ({ payload }, { call, put }) {
            const { data } = yield call(chatService.templateDel, payload)
            if (data.error) {
                return message.error(data.msg)
            }
            yield put({
                type: "savetemplate",
                payload,
            })
            message.success("删除成功！")
        },
        // 编辑好友自定义字段内容
        * editfriendfield ({ payload }, { call, put }) {
            const { data } = yield call(chatService.editfriendfield, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "saveRemark",
                payload,
            })
            message.success("修改成功")
        },
        // 获取自定义字段
        * fetchField ({ payload }, { call, put, select }) {
            const { data } = yield call(chatService.fetchField, { status: 1, ...payload})
            yield put({
                type: "savefield",
                payload: {data},
            })
        },
        // 添加自定义
        * addField ({ payload }, { call, put }) {
            const { data } = yield call(chatService.addField, payload)
            if (data.error) {
                message.error(data.errmsg)
                return false
            }
            yield put({ type: "fetchField"})
            message.success("添加成功！")
            return true
        },
        // 删除自定义字段
        * delField ({ payload }, { call, put }) {
            const { data } = yield call(chatService.delField, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({type: "savefield", payload })
            message.success("删除成功！")
        },
        // 自定义排序
        * orderField ({ payload }, { call, put }) {
            const { data } = yield call(chatService.orderField, payload)
            if (data.error) {
                return message.error(data.msg)
            }
            yield put({ type: "fetchField"})

        },
    },
    subscriptions: {
        setup ({ dispatch, history, query }) {
            return history.listen(async ({ pathname, search, query }) => {
                if (pathname === "/wechat/friendsList" || pathname === "/wechat/friendGroup" || pathname === "/autoadd/autofriend") {
                    await dispatch({ type: "getusergroup" })
                }
                if (testSubstr(pathname, "/wechat")) {
                    await dispatch({ type: "fetchWeChatList" })
                }
                if (pathname === "/wechat/friendsList") {
                    dispatch({ type: "fetchContactList", payload: { zu_id: decodeURIComponent(query.d) } })
                    dispatch({type: "fetchField"})
                }
                if (testSubstr(pathname, "/tagManage")) {
                    dispatch({ type: "fetchWeChatList" })
                }
                if (testSubstr(pathname, "/listYH")) {
                    dispatch({ type: "fetchNursing" })
                    dispatch({type: "fetchAutoChatDuty"})
                    dispatch({type: "fetchTemplateGet"})
                }
                if (pathname === "/fission/act") {
                    dispatch({ type: "fetchWeChatList" })
                }
                if (pathname === "/wechat/extende") {
                    dispatch({type: "fetchField"})
                }
            })
        },
    },
}
