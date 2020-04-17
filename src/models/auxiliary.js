import * as chatService from "../services/service"
import { message } from "antd"
export default {
    namespace: "auxiliary",
    state: {
        total: 0,
        actionList: [],
        publicList: [],
        setActionList: [],
        sensitData: [],
        microList: [],
        microTotal: 0,
        codeList: [],
    },
    reducers: {
        // saveOrder (
        //     state,
        //     {
        //         payload: { data },
        //     }
        // ) {
        //     return { ...state, orderList: data }
        // },
        savePublic (
            state,
            {
                payload: { data, editData },
            }
        ) {
            let publicList = data || state.publicList
            if (editData) {
                let index = publicList.findIndex((item) => item.id === editData.id)
                if (editData.is_open === "1") {
                    publicList.map((item) => item.is_open = "0")
                }
                if (index !== -1) {
                    publicList[index] = { ...publicList[index], ...editData }
                    window.sessionStorage.setItem("uniacid", publicList[index].uniacid)
                }
            }
            if (!window.sessionStorage.getItem("uniacid")) {
                let list = publicList.find((item) => item.is_open === "1")
                list && (window.sessionStorage.setItem("uniacid", list.uniacid))
            }
            return { ...state, publicList }
        },
        saveActions (
            state,
            {
                payload: { data, total, editStatus },
            }
        ) {
            let actionList = data || state.actionList
            total = total ? Number(total) : state.total
            if (editStatus) {
                editStatus.id.map((item) => {
                    let index = actionList.findIndex((mess) => mess.id === item)
                    actionList[index] = { ...actionList[index], ...editStatus, id: actionList[index].id, status: "1" }
                })
            }
            return { ...state, actionList, total }
        },
        saveSetActions (
            state,
            {
                payload: { data, update },
            }
        ) {
            let setActionList = data ? data : state.setActionList
            if (update) {
                let index = setActionList.findIndex((mess) => mess.id === update.id)
                setActionList[index] = { ...setActionList[index], ...update }
            }
            return { ...state, setActionList }
        },
        saveKeyData (
            state,
            {
                payload: { data, update, deleteId },
            }
        ) {
            if (data) {
                data = data.sort((a, b) => new Date(b.createtime).getTime() - new Date(a.createtime).getTime())
            }
            let sensitData = data || state.sensitData
            if (update) {
                let index = sensitData.findIndex((mess) => mess.id === update.id)
                sensitData[index] = { ...sensitData[index], ...update }
            }
            if (deleteId) {
                sensitData = sensitData.filter((item) => item.id !== deleteId)
            }
            return { ...state, sensitData }
        },
        saveMicro (
            state,
            {
                payload: { data, total, update, deleteId },
            }
        ) {
            let microList = data || state.microList
            let microTotal = total || state.microTotal
            if (update) {
                let index = microList.findIndex((mess) => mess.id === update.id)
                microList[index] = { ...microList[index], ...update }
            }
            if (deleteId) {
                microList = microList.filter((item) => item.id !== deleteId)
            }
            return { ...state, microList, microTotal }
        },
        saveQrcode (
            state,
            {
                payload: { data, update, deleteId },
            }
        ) {
            let codeList = data ? data : state.codeList
            if (update) {
                let index = codeList.findIndex((mess) => mess.id === update.id)
                codeList[index] = { ...codeList[index], ...update }
            }
            if (deleteId) {
                codeList = codeList.filter((item) => item.id !== deleteId)
            }
            return { ...state, codeList }
        },
        saveMaker (
            state,
            {
                payload: { data, edit, id },
            }
        ) {
            let makerList = data ? data : state.makerList
            if (edit) {
                let index = makerList.findIndex((mess) => mess.id === edit.id)
                makerList[index] = { ...makerList[index], ...edit }
            }
            if (id) {
                makerList = makerList.filter((item) => item.id !== id)
            }
            return { ...state, makerList }
        },
    },
    effects: {
        // 获取绑定的公众号
        * fetchPublic (_, { call, put, select }) {
            const publicList = yield select((state) => state.auxiliary.publicList)
            if (publicList && publicList.length > 0) {
                return
            }
            const { data } = yield call(chatService.bindPublic, { op: "select", ispubilc: true })
            if (!data || data.error) {
                return
            }
            yield put({
                type: "savePublic",
                payload: {
                    data: data.data,
                },
            })
        },
        // 编辑公众号
        * editPublic ({ payload }, { call, put }) {
            const { data } = yield call(chatService.bindPublic, payload)
            if (!data || data.error) {
                return message.error(data.msg)
            }
            if (payload.op === "add") {
                yield put({
                    type: "fetchPublic",
                })
                return message.success("添加成功")
            }
            if (payload.op === "update" || payload.op === "change") {
                yield put({
                    type: "savePublic",
                    payload: {
                        editData: payload,
                    },
                })
            }
            message.success("修改成功")
        },
        // 领取后是否展示扫描二维码关注公众号功能
        * follow ({ payload }, { call, put }) {
            const { data } = yield call(chatService.follow, payload)
            if (data.error) {
                return message.error("修改失败")
            }
            message.success("修改成功")
        },
        // 是否关注公众号后才可以领取群控红包
        * attention ({ payload }, { call, put }) {
            const { data } = yield call(chatService.attention, payload)
            if (data.error) {
                return message.error("修改失败")
            }
            message.success("修改成功")
        },
        // 获取（查询）敏感词数据
        * fetchKeyData ({ payload }, { call, put }) {
            const { data } = yield call(chatService.fetchKeyData, payload)
            yield put({
                type: "saveKeyData",
                payload: {
                    data: data.error ? [] : data.data || data.msg,
                },
            })
        },
        // 添加敏感词数据
        * addKeyData ({ payload }, { call, put }) {
            const shenhe_realname = window.sessionStorage.getItem("user")
            const { data } = yield call(chatService.addKeyData, { shenhe_realname, ...payload })
            if (data.error) {
                return message.error(data.msg)
            }
            yield put({
                type: "fetchKeyData",
                payload: {
                },
            })
            message.success("添加成功")
        },
        // 修改敏感词数据
        * updateKeyData ({ payload }, { call, put }) {
            const { data } = yield call(chatService.updateKeyData, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "saveKeyData",
                payload: {
                    update: payload,
                },
            })
        },
        // 删除敏感词数据
        * deleteKeyData ({ payload }, { call, put }) {
            const { data } = yield call(chatService.deleteKeyData, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "saveKeyData",
                payload: { deleteId: payload.id },
            })
        },

        // 获取敏感词操作
        * fetchActions ({ payload }, { call, put }) {
            const { data } = yield call(chatService.fetchActions, {pagesize: 20, ...payload })
            if (!data || data && data.error) {
                return
            }
            yield put({
                type: "saveActions",
                payload: {
                    data: data.data || data.msg,
                    total: data.total,
                },
            })
        },
        // 修改敏感操作状态
        * updateStatus ({ payload }, { call, put }) {
            const shenhe_realname = window.sessionStorage.getItem("user")
            const { data } = yield call(chatService.updateStatus, { shenhe_realname, ...payload })
            if (data.error) {
                return message.error(data.msg)
            }
            yield put({
                type: "saveActions",
                payload: {
                    editStatus: payload,
                },
            })
        },
        // 获取敏感词操作设置
        * getActions (_, { call, put }) {
            const { data } = yield call(chatService.getActions)
            if (!data || data && data.error) {
                return
            }
            yield put({
                type: "saveSetActions",
                payload: {
                    data: data.data,
                },
            })
        },
        // 修改敏感词操作设置
        * updateActions ({ payload }, { call, put }) {
            const { data } = yield call(chatService.updateActions, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "saveSetActions",
                payload: {
                    update: payload,
                },
            })
        },

        // 获取活码
        * fetchMicro ({payload}, { call, put, select}) {
            const microList = yield select((state) => state.auxiliary.microList)
            if (microList && microList.length > 0 && !payload) {
                return
            }
            const { data } = yield call(chatService.fetchMicro)
            yield put({
                type: "saveMicro",
                payload: {
                    data: data.error ? [] : data.data,
                    total: data.total,
                },
            })
        },
        // 添加活码
        * addMicro ({ payload }, { call, put }) {
            const { data } = yield call(chatService.addMicro, payload)
            if (data.error) {
                return message.error(data.msg)
            }
            yield put({
                type: "fetchMicro",
                payload: "add",
            })
        },
        // 修改活码
        * updateMicro ({ payload }, { call, put }) {
            const { data } = yield call(chatService.updateMicro, { ...payload, post: 1 })
            if (data.error) {
                return message.error(data.msg)
            }
            yield put({
                type: "saveMicro",
                payload: { update: payload },
            })
        },
        // 删除活码
        * deleteMicro ({ payload }, { call, put }) {
            const { data } = yield call(chatService.deleteMicro, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "saveMicro",
                payload: { deleteId: payload.id },
            })
        },
        // 获取活码下二维码
        * fetchQrcode ({ payload }, { call, put }) {
            const { data } = yield call(chatService.fetchQrcode, payload)
            if (data.error) {
                return
            }
            yield put({
                type: "saveQrcode",
                payload: { data: data.data },
            })
        },
        // 添加二维码
        * addQrcode ({ payload }, { call, put }) {
            const { data } = yield call(chatService.addQrcode, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "fetchQrcode",
                payload: { gid: payload.group_id },
            })
            message.success("添加成功")
        },
        // 修改二维码
        * updateQrcode ({ payload }, { call, put }) {
            const { data } = yield call(chatService.updateQrcode, { post: "1", ...payload })
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "saveQrcode",
                payload: { update: payload },
            })
        },
        // 删除二维码
        * deleteQrcode ({ payload }, { call, put }) {
            const { data } = yield call(chatService.deleteQrcode, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "saveQrcode",
                payload: { deleteId: payload.id },
            })
        },
        // 管理端获取创客绑定账号列表
        * MakerGets (_, { call, put }) {
            const { data } = yield call(chatService.MakerGets)
            yield put({
                type: "saveMaker",
                payload: data,
            })
        },
        // 添加创客工具箱账号
        * MakerAdd ({payload}, { call, put }) {
            const { data } = yield call(chatService.MakerAdd, payload)
            if (data.error) {
                return message.error(data.msg)
            }
            yield put({ type: "MakerGets" })
            return message.success("添加成功")
        },
        // 编辑创客工具箱账号
        * MakerEdit ({payload}, { call, put }) {
            const { data } = yield call(chatService.MakerEdit, payload)
            if (data.error) {
                return message.error(data.msg)
            }
            yield put({ type: "saveMaker", payload: {edit: payload} })
            return message.success("编辑成功")
        },
        // 删除创客工具箱账号
        * MakerDel ({payload}, { call, put }) {
            const { data } = yield call(chatService.MakerDel, payload)
            if (data.error) {
                return message.error(data.msg)
            }
            yield put({ type: "saveMaker", payload})
            return message.success("删除成功")
        },
        // 获取订单记录
        // * getOrderRecord ({ payload }, { call, put }) {
        //     // const uniacid = window.sessionStorage.getItem("uniacid")
        //     // const { data } = yield call(chatService.getOrderRecord, { uniacid, ...payload })
        //     let arrray = [
        //         { id: "12", phone: "1324242", order_price: "$100", order_num: "1323424", order_time: "2018-2-3" },
        //     ]
        //     yield put({
        //         type: "saveOrder",
        //         payload: {
        //             data: arrray,
        //         },
        //     })
        // },

    },
    subscriptions: {
        setup ({ dispatch, history, query }) {
            return history.listen(async ({ pathname, search, query }) => {
                let token = window.sessionStorage.getItem("token")
                if (!token) {
                    return
                }
                if (pathname === "/home" || pathname === "/auxiliary/store") {
                    await dispatch({ type: "fetchPublic" })
                }
                if (pathname === "/sensitive/operation") {
                    dispatch({ type: "fetchActions" })
                    dispatch({ type: "getActions" })
                }
                if (pathname === "/auxiliary/qrcode") {
                    dispatch({ type: "fetchMicro" })
                }
                if (pathname === "/sensitive/set") {
                    dispatch({ type: "fetchKeyData" })
                }
                if (pathname === "/auxiliary/maker") {
                    dispatch({ type: "MakerGets" })
                }
            })
        },
    },
}
