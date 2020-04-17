import { testSubstr, decodeURIComponent} from "../utils/helper"
import * as chatService from "../services/service"
import { message } from "antd"

export default {
    namespace: "devices",
    state: {
        devices: [],
        devGroupList: [],
        maxnum: 0,
        num: 0,
    },
    reducers: {
        saveDevices (
            state,
            {
                payload: { devices, maxnum, num, devtotal },
            }
        ) {
            let list = []
            devices && devices.map((item) => {
                let index = list.findIndex((mess) => mess.id === item.id && mess.sncode === item.sncode)
                if (index === -1) {
                    list.push({...item, weChat: [{headimg: item.headimg, nickname: item.nickname}]})
                }
                if (index !== -1 && list[index].nickname !== item.nickname) {
                    list[index].weChat.push({headimg: item.headimg, nickname: item.nickname})
                }
            })
            devices = list
            const userid = window.sessionStorage.getItem("i") || ""
            num = state.num > Number(num) ? state.num : Number(num)
            return { ...state, devices, userid, maxnum, num, devtotal }
        },
        saveEditDevices (state, { payload }) {
            let devices = state.devices
            let index = devices.findIndex((item) => item.id === payload.id)
            if (index !== -1) {
                devices[index] = { ...devices[index], ...payload }
            } else {
                devices = [...devices, payload]
            }
            return { ...state, devices }
        },
        saveDelDevices (state, { payload }) {
            let devices = state.devices
            let num = state.num
            payload.id.map((id) => {
                if (devices.find((item) => item.id === id)) {
                    devices = devices.filter((item) => item.id !== id)
                    num--
                }
            })
            return { ...state, devices, num }
        },
        saveDevGroup (
            state,
            {
                payload: { data, editData, delData },
            }
        ) {
            let devGroupList = data ? data : state.devGroupList
            if (editData) {
                let index = devGroupList.findIndex((item) => item.id === editData.id)
                index !== -1 && (devGroupList[index].name = editData.name)
            }
            if (delData && devGroupList.find((item) => item.id === delData.id)) {
                devGroupList = devGroupList.filter((item) => item.id !== delData.id)
            }
            devGroupList = devGroupList && devGroupList.sort((a, b) => b.id - a.id)
            return { ...state, devGroupList }
        },
        intDevices (
            state,
            {
                payload: { data },
            }
        ) {
            let devices = state.devices
            devices.map((item) => {
                let index = data.findIndex((mess) => mess.id === item.id && mess.isoff !== item.isoff)
                index !== -1 && (item.isoff = data[index].isoff)
            })
            return { ...state, devices }
        },
        saveDuty (
            state,
            {
                payload: { devices, account, dutyLst, dutyNum, pageNo },
            }
        ) {
            return { ...state, devices, accountLst: account, dutyLst, dutyNum, pageNo }
        },
    },
    effects: {
        // 获取设备
        * fetchDevices ({ payload }, { call, put }) {
            const { data } = yield call(chatService.fetchDevices, {page: 1, userid: window.sessionStorage.getItem("i"), ...payload })
            if (!data || data.error) {
                return
            }
            yield put({
                type: "saveDevices",
                payload: {
                    devices: data.data,
                    maxnum: data.device_num,
                    num: data.yiyong_num,
                    devtotal: Number(data.yiyong_num),
                },
            })
        },
        // 添加、编辑设备
        * addEditDevices ({ payload }, { call, put }) {
            const userid = window.sessionStorage.getItem("i") || ""
            const { data } = yield call(chatService.addDevices, { userid, ...payload })
            if (data.error) {
                return message.error(data.errmsg)
            }
            if (!payload.id) {
                yield put({
                    type: "fetchDevices",
                })
                return message.success("添加成功")
            }
            message.success("编辑成功")
            if (payload.op === "sort") {
                yield put({
                    type: "fetchDevices",
                })
                return
            }
            yield put({
                type: "saveEditDevices",
                payload: { userid, ...payload },
            })
        },
        // 删除设备
        * delDevices ({ payload }, { call, put }) {
            const { data } = yield call(chatService.delDevices, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "saveDelDevices",
                payload: { ...payload },
            })
        },
        // 设置设备分组
        * setDevicesGroup ({ payload }, { call, put }) {
            const { data } = yield call(chatService.setDevicesGroup, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            message.success("编辑成功")
            yield put({
                type: "fetchDevices",
            })
        },
        // 获取设备分组
        * fetchDevGroup ({payload}, { call, put, select }) {
            let group = yield select((state) => state.devices.devGroupList)
            if (group.length > 0 && !payload) {
                return
            }
            const { data } = yield call(chatService.fetchDevGroup)
            if (data.error) {
                return
            }
            yield put({
                type: "saveDevGroup",
                payload: data,
            })
        },
        // 添加设备分组
        * addDevGroup ({ payload }, { call, put }) {
            const { data } = yield call(chatService.addDevGroup, { name: payload.name })
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "fetchDevGroup",
                payload: {add: true},
            })
            message.success("添加成功")
        },
        // 编辑设备分组
        * editDevGroup ({ payload }, { call, put }) {
            const { data } = yield call(chatService.editDevGroup, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "saveDevGroup",
                payload: { editData: payload },
            })
            message.success("编辑成功")
        },
        // 删除设备分组
        * delDevGroup ({ payload }, { call, put }) {
            const { data } = yield call(chatService.delDevGroup, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "saveDevGroup",
                payload: { delData: payload },
            })
            message.success("删除成功")
        },
        // 获取设备
        * IntervalDevices ({ payload }, { call, put }) {
            const { data } = yield call(chatService.fetchDevices, { userid: window.sessionStorage.getItem("i"), ...payload })
            if (!data || data.error) {
                return
            }
            yield put({
                type: "intDevices",
                payload: {
                    data: data.data,
                },
            })
        },
        * dutyDevices ({ payload }, { call, put, select }) {
            let account
            const { data } = yield call(chatService.fetchWeChatList, { ...payload })
            const accountLst = yield select((state) => state.devices.accountLst)
            const dutyData = yield call(chatService.fetchDutyLst, { zid: payload.userid, pageNo: 1, pageSize: 10 })
            if (accountLst && accountLst.length) {
                account = accountLst
            } else {
                const accountTm = yield call(chatService.fetchAccount)
                account = accountTm ? accountTm.data.data : []
            }
            yield put({
                type: "saveDuty",
                payload: {
                    account,
                    pageNo: !dutyData.data.error ? dutyData.data.data.pageNo : 1,
                    devices: !data.error ? data.data : [],
                    dutyLst: !dutyData.data.error ? dutyData.data.data.list : [],
                    dutyNum: Number(dutyData.data.data.total) ? Number(dutyData.data.data.total) : 1,
                },
            })
        },
        * fetchDutyLst ({ payload }, { call, put, select }) {
            const account = yield select((state) => state.devices.accountLst)
            const devices = yield select((state) => state.devices.devices)
            const { data } = yield call(chatService.fetchDutyLst, { pageSize: 10, ...payload })
            yield put({
                type: "saveDuty",
                payload: {
                    account,
                    devices,
                    pageNo: !data.error ? data.data.pageNo : 1,
                    dutyLst: !data.error ? data.data.list : [],
                    dutyNum: Number(data.data.total) ? Number(data.data.total) : 1,
                },
            })
        },
        // 删除
        * dutyDelete ({ payload }, { call, put, select }) {
            const account = yield select((state) => state.devices.accountLst)
            const devices = yield select((state) => state.devices.devices)
            const deleteInfo = yield call(chatService.dutyDelete, { id: payload.id })
            const { data } = yield call(chatService.fetchDutyLst, { pageSize: 10, ...payload.list })
            yield put({
                type: "saveDuty",
                payload: {
                    account,
                    devices,
                    pageNo: !data.error ? data.data.pageNo : 1,
                    dutyLst: !data.error ? data.data.list : [],
                    dutyNum: Number(data.data.total) ? Number(data.data.total) : 1,
                },
            })
            if (!deleteInfo.data.error) {
                return message.success("删除成功")
            } else {
                return message.error(deleteInfo.data.errMsg)
            }
        },
        // 再次执行
        * dutyReexecute ({ payload }, { call, put, select }) {
            const account = yield select((state) => state.devices.accountLst)
            const devices = yield select((state) => state.devices.devices)
            const againInfo = yield call(chatService.dutyReexecute, { id: payload.id })
            const { data } = yield call(chatService.fetchDutyLst, { pageSize: 10, ...payload.list })
            yield put({
                type: "saveDuty",
                payload: {
                    account,
                    devices,
                    pageNo: !data.error ? data.data.pageNo : 1,
                    dutyLst: !data.error ? data.data.list : [],
                    dutyNum: Number(data.data.total) ? Number(data.data.total) : 1,
                },
            })
            if (!againInfo.data.error) {
                return message.success("执行成功")
            } else {
                return message.error(againInfo.data.errMsg)
            }
        },
    },
    subscriptions: {
        setup ({ dispatch, history, query }) {
            // let Int
            return history.listen(async ({ pathname, search, query }) => {
                if (testSubstr(pathname, "/account")) {
                    await dispatch({ type: "fetchDevices" })
                }
                if (pathname === "/devices/list") {
                    dispatch({ type: "fetchDevices", payload: { zu_id: decodeURIComponent(query.d) } })
                    dispatch({ type: "fetchDevGroup" })
                    // Int = setInterval(() => {dispatch({ type: "IntervalDevices" })}, 5000)
                }
                // if (pathname !== "/devices/list") {
                //     clearInterval(Int)
                // }
                if (pathname === "/devices/group") {
                    dispatch({ type: "fetchDevGroup" })
                }
                if (pathname === "/devices/dutyList") {
                    dispatch({ type: "dutyDevices", payload: { userid: window.sessionStorage.getItem("i") } })
                }
            })
        },
    },
}
