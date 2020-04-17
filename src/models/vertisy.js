import { testSubstr } from "../utils/helper"
import * as vertisyService from "../services/vertisy"
import * as chatService from "../services/service"
import { message } from "antd"
export default {
    namespace: "vertisy",
    state: {
        pointSetRec: [],
        allContacts: [],
        qundata: [],
    },
    reducers: {
        saveWeChatList (
            state,
            {
                payload: { weChatList },
            }
        ) {
            return { ...state, weChatList }
        },
        saveAllContacts (
            state,
            {
                payload: { contacts, total },
            }
        ) {
            let oldContacts = state.allContacts.slice(0)
            contacts &&
                contacts.map((item) => {
                    if (oldContacts.findIndex((msg) => msg.userid === item.userid) === -1) {
                        oldContacts.push(item)
                    }
                })
            return { ...state, allContacts: oldContacts, allTotal: total ? Number(total) : state.allTotal }
        },
        saveCircleList (
            state,
            {
                payload: { circleList, circleTotal },
            }
        ) {
            return { ...state, circleList, circleTotal }
        },
        delCircleList (
            state,
            {
                payload: { id },
            }
        ) {
            let circleList = state.circleList
            circleList = circleList.filter((item) => item.id !== id)
            if (typeof id === "object") {
                id.map((i) => {
                    circleList = circleList.filter((item) => item.id !== i)
                })
            }
            return { ...state, circleList }
        },
        saveGroupList (
            state,
            {
                payload: { groupList, groupTotal },
            }
        ) {
            return { ...state, groupList, groupTotal }
        },
        // 保存点赞数据列表
        savePointRecord (
            state,
            {
                payload: { data, pointCount, setObj },
            }
        ) {
            let pointSetRec = data ? data : state.pointSetRec
            pointCount = pointCount ? pointCount : state.pointCount
            if (data) {
                pointSetRec = data.map((item) => ({ device_wxid: item.wxid, ...item }))
            }
            // 设置操作
            if (setObj && pointSetRec.length > 0) {
                setObj.deviceid.map((mess) => {
                    let index = pointSetRec.findIndex((item) => item.device_wxid === mess)
                    if (index !== -1) {
                        pointSetRec[index].status = setObj.is_auto === "1" ? "已开启" : "未开启"
                        pointSetRec[index].duty_type = setObj.duty_type === "1" ? "循环任务" : "单次任务"
                        pointSetRec[index] = { ...setObj, ...pointSetRec[index], is_auto: setObj.is_auto, device_wxid: mess, day_num: setObj.day_num }
                    }
                })
            }
            return { ...state, pointSetRec, pointCount }
        },
        saveSetPoint (state, { payload }) {
            let pointSetRec = state.pointSetRec
            let index = pointSetRec.findIndex((item) => item.id === payload.id)
            if (index !== "-1") {
                payload.is_auto && (pointSetRec[index].is_auto = payload.is_auto)
                payload.duty_type && (pointSetRec[index].duty_type = payload.duty_type === "1" ? "循环任务" : "单次任务")
            }
            return { ...state, pointSetRec }
        },
        // 查看详情
        saveDetail (
            state,
            {
                payload: { data },
            }
        ) {
            return { ...state, detailList: data }
        },
        saveDz (state, { payload }) {
            let list = []
            if (payload.list && payload.list.length) {
                list = [...list, ...payload.list]
            }
            return { ...state, dzLst: list, dzTotal: payload.total }
        },
        saveEmoj (state, { payload }) {
            let emoj = []
            if (payload && payload.random_emoji) {
                emoj = JSON.parse(payload.random_emoji)
            }
            return { ...state, Emoj: emoj }
        },
        saveQun (state, { payload: {qundata} }) {
            return { ...state, qundata }
        },
    },
    effects: {
        // 获取微信列表数据
        * fetchWeChatList (_, { call, put, select }) {
            const weChatList = yield select((state) => state.vertisy.weChatList)
            if (weChatList && weChatList.length > 0) {
                return
            }
            const userid = window.sessionStorage.getItem("i") || ""
            const { data } = yield call(chatService.fetchWeChatList, { userid })
            if (data && data.error) {
                return
            }
            yield put({
                type: "saveWeChatList",
                payload: {
                    weChatList: data.data,
                },
            })
        },
        // 获取和查询联系人
        * fetchContactList ({ payload }, { call, put, select }) {
            const weChatList = yield select((state) => state.vertisy.weChatList)
            let kefu_wxid = weChatList && weChatList.map((item) => item.wxid)
            const { data } = yield call(vertisyService.fetchContactList, { kefu_wxid, ...payload })
            if (data.error) {
                return
            }
            yield put({
                type: "saveAllContacts",
                payload: {
                    contacts: data.contents,
                    total: data.total,
                },
            })
        },
        // 获取点赞设置记录列表
        * pointSetRecord ({ payload }, { call, put, select }) {
            const { data } = yield call(vertisyService.pointSetRecord, payload)
            if (data.error) {
                return
            }
            yield put({
                type: "savePointRecord",
                payload: { data: data.data, pointCount: Number(data.count) },
            })
        },
        // 自动点赞设置
        * setPoint ({ payload }, { call, put, select }) {
            const { data } = yield call(vertisyService.setPoint, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            if (payload.id) {
                yield put({
                    type: "savePointRecord",
                    payload: { setObj: payload },
                })
            } else {
                yield put({
                    type: "pointSetRecord",
                })
            }
            message.success("设置成功")
        },
        // 设置点赞任务状态
        * pointStatus ({ payload }, { call, put, select }) {
            const { data } = yield call(vertisyService.pointStatus, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "saveSetPoint",
                payload,
            })
            message.success("设置成功")
        },
        // 设置点赞任务类型
        * pointType ({ payload }, { call, put, select }) {
            const { data } = yield call(vertisyService.pointType, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "saveSetPoint",
                payload,
            })
            message.success("设置成功")
        },
        // 查看点赞记录
        * pointList ({ payload }, { call, put, select }) {
            const { data } = yield call(vertisyService.pointList, { access_token: 111 })
            if (data.error) {
                return
            }
            yield put({
                type: "savePointList",
                payload: { data },
            })
        },

        // 朋友圈
        * sendCircle ({ payload }, { call }) {
            const {
                data: { error, msg },
            } = yield call(vertisyService.sendCircle, payload)
            if (error) {
                message.error(msg)
                return false
            }
            message.success("提交成功")
            // message.success(payload.time ? "提交成功" : "提交成功，系统将会在1分钟左右发送！")
            return true
        },
        // 重发朋友圈
        * replaceSend ({ payload }, { call, put }) {
            const { data } = yield call(vertisyService.replaceSend, payload)
            if (data.error) {
                return message.error(data.msg)
            }
            message.success("提交成功")
            // message.success("提交成功，系统将会在1分钟左右发送！")
        },
        // 获取朋友圈记录
        * fetchCircle ({ payload }, { call, put }) {
            const { data } = yield call(vertisyService.fetchCircle, { page: 1, ...payload })
            yield put({
                type: "saveCircleList",
                payload: { circleList: data.data, circleTotal: Number(data.total_num) },
            })
        },
        // 删除朋友圈记录
        * delCircle ({ payload }, { call, put }) {
            const { data } = yield call(vertisyService.delCircle, payload)
            if (data.error) {
                return message.error(data.msg)
            }
            yield put({
                type: "delCircleList",
                payload,
            })
            // message.success("已提交")
        },
        // 群发
        * qunfa ({ payload }, { call }) {
            const token = window.sessionStorage.getItem("token")
            const {
                data: { error, msg },
            } = yield call(vertisyService.doQunFa, { token, ...payload })
            if (error) {
                message.error(msg)
                return false
            }
            message.success(payload.time ? "提交成功。\n如果有错误操作，请到群发记录中取消指令！" : "提交成功，系统将会在1分钟左右发送！\n如果有错误操作，请到群发记录中取消指令！")
            return true
        },
        // 获取群发记录groupRecord
        * fetchQunfa ({ payload }, { call, put }) {
            const { data } = yield call(vertisyService.fetchQunfa, { page: 1, ...payload })
            yield put({
                type: "saveGroupList",
                payload: { groupList: data.data, groupTotal: Number(data.total_num) },
            })
        },
        // 获取详情
        * detailQunfa ({ payload }, { call, put }) {
            const { data } = yield call(vertisyService.detailQunfa, payload)
            yield put({
                type: "saveDetail",
                payload: { data: data.data },
            })
        },
        // 停止定时群发
        * stopGroupSend ({ payload }, { call, put }) {
            const { data } = yield call(vertisyService.stopGroupSend, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
        },
        // 停止定时发朋友圈
        * stopCircleSend ({ payload }, { call, put }) {
            const { data } = yield call(vertisyService.stopCircleSend, payload)
            if (data.error) {
                return message.error(data.msg)
            }
            message.success("更改成功")
        },
        * getDzRecord ({ payload }, { call, put }) {
            const { data } = yield call(vertisyService.getOne, payload)
            if (data.error) {
                return message.error(data.msg)
            }
            yield put({ type: "saveDz", payload: {list: data.data, total: Number(data.count) }})
        },
        * getemoji ({ payload }, { call, put }) {
            const { data } = yield call(vertisyService.getemoji)
            if (data.error) {
                return message.error(data.msg)
            }
            yield put({ type: "saveEmoj", payload: data.data })
        },
        * setemoji ({ payload }, { call, put }) {
            const { data } = yield call(vertisyService.setemoji, payload)
            if (data.error) {
                return message.error(data.msg)
            }
            let para = {
                random_emoji: JSON.stringify(payload.random_emoji),
            }
            yield put({ type: "saveEmoj", payload: para })
        },
        // 获取群
        * fetchQun ({ payload }, { call, put, select }) {
            const qundata = yield select((state) => state.vertisy.qundata)
            if (qundata.length > 0) {
                return
            }
            const { data } = yield call(vertisyService.fetchQun, payload)
            if (data.error) {
                return
            }
            yield put({ type: "saveQun", payload: data.data })
        },
    },
    subscriptions: {
        setup ({ dispatch, history, query }) {
            return history.listen(async ({ pathname, search, query }) => {
                if (testSubstr(pathname, "/vertisy")) {
                    dispatch({ type: "fetchWeChatList" })
                }
                if (pathname === "/vertisy/point") {
                    dispatch({ type: "pointSetRecord" })
                }
                if (pathname === "/vertisy/record") {
                    dispatch({ type: "fetchCircle" })
                }
                if (testSubstr(pathname, "/fsend")) {
                    dispatch({ type: "fetchWeChatList" })
                }
                if (pathname === "/fsend/groupRecord") {
                    dispatch({ type: "fetchQunfa" })
                }
                if (pathname === "/fsend/groupSend") {
                    await dispatch({ type: "chat/getusergroup" })
                }
                if (testSubstr(pathname, "/qunmanage")) {
                    dispatch({ type: "fetchQun" })
                }
            })
        },
    },
}
