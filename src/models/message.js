import { testSubstr } from "../utils/helper"
import * as chatService from "../services/service"
import {message} from "antd"
import moment from "moment"
import "moment/locale/zh-cn"
moment.locale("zh-cn")
export default {
    namespace: "message",
    state: {
        messages: [],
        messageTotal: 0,
    },
    reducers: {
        saveLogs (
            state,
            {
                payload: { logs, total },
            }
        ) {
            logs = logs ? logs : []
            let recordTotal = total ? Number(total) : state.total
            if (logs && logs.length <= 0) {
                recordTotal = 0
            }
            return { ...state, logs, total: recordTotal }
        },
        saveMessages (
            state,
            {
                payload: { messages, total },
            }
        ) {
            messages = messages.reverse()
            return { ...state, messages, messageTotal: Number(total) }
        },
    },
    effects: {
        // 获取任务记录
        * fetchLogs ({ payload }, { call, put, select }) {
            const weChatList = yield select((state) => state.vertisy.weChatList)
            const deviceIds = weChatList && weChatList.map((item) => item.wxid)
            if (deviceIds && deviceIds.length <= 0) {
                return
            }
            let s_time = moment()
                .subtract(1, "days")
                .format("YYYY-MM-DD HH:mm:ss")
            let e_time = moment()
                .add(1, "days")
                .format("YYYY-MM-DD HH:mm:ss")
            payload ? payload : (payload = { deviceIds, datatime: [s_time, e_time] })
            const { data } = yield call(chatService.fetchMessages, payload)
            yield put({
                type: "saveLogs",
                payload: {
                    logs: data.error ? [] : data.contents,
                    total: data.error ? 0 : data.total,
                },
            })
        },
        // 获取某个好友的聊天记录
        * fetchMessages ({ payload }, { call, put, select }) {
            const { data } = yield call(chatService.fetchMessages, payload)
            yield put({
                type: "saveMessages",
                payload: {
                    messages: data.error ? [] : data.contents,
                    total: data.error ? 0 : data.total,
                },
            })
        },
        // 同步历史记录
        * getHistoryMsg ({ payload }, { call, put, select }) {
            const { data } = yield call(chatService.getHistoryMsg, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "saveTbjl",
                payload,
            })
            return message.success("同步成功")
        },
    },
    subscriptions: {
        setup ({ dispatch, history, query }) {
            return history.listen(async ({ pathname, search, query }) => {
                if (testSubstr(pathname, "/chatRecord")) {
                    await dispatch({ type: "vertisy/fetchWeChatList"})
                    dispatch({ type: "fetchLogs" })
                }
            })
        },
    },
}
