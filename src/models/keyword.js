import { testSubstr } from "../utils/helper"
import * as keyService from "../services/keyword"
import { message } from "antd"
export default {
    namespace: "keyword",
    state: {
        KeyReply: [],
    },
    reducers: {
        saveAddKey (
            state,
            {
                payload: { data },
            }
        ) {
            return { ...state, KeyReply: data.data }
        },
        saveDelKey (state, { payload }) {
            let KeyReply = state.KeyReply
            KeyReply = KeyReply.filter((item) => item.id !== payload.id)
            return { ...state, KeyReply }
        },
        saveUpKey (state, { payload }) {
            let KeyReply = state.KeyReply
            let index = KeyReply.findIndex((item) => item.id === payload.id)
            KeyReply[index] = { ...KeyReply[index], ...payload }
            return { ...state, KeyReply }
        },
    },
    effects: {
        // 关键词
        * fetchKeyPeply ({ payload }, { call, put, select }) {
            const { data } = yield call(keyService.fetchKeyWord, { rule_type: "2", ...payload })
            if (data.error) {
                return
            }
            yield put({
                type: "saveAddKey",
                payload: {
                    data: data,
                },
            })
        },
        * addKeyReply ({ payload }, { call, put }) {
            const { data } = yield call(keyService.addKeyReply, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "fetchKeyPeply",
            })
            message.success("添加成功")
        },
        * delKeyReply ({ payload }, { call, put, select }) {
            const { data } = yield call(keyService.delKeyReply, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "saveDelKey",
                payload,
            })
            message.success("删除成功")
        },
        * upKeyReply ({ payload }, { call, put, select }) {
            const { data } = yield call(keyService.upKeyReply, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({
                type: "saveUpKey",
                payload,
            })
            message.success("修改成功")
        },

    },
    subscriptions: {
        setup ({ dispatch, history, query }) {
            return history.listen(async ({ pathname, search, query }) => {
                if (testSubstr(pathname, "/keyword")) {
                    dispatch({ type: "vertisy/fetchWeChatList" })
                    dispatch({ type: "fetchKeyPeply" })
                }
            })
        },
    },
}
