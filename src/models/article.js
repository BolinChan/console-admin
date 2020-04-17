import * as materialService from "../services/material"
import { message } from "antd"
export default {
    namespace: "article",
    state: {
        articledata: [],
        billdata: [],
        awardList: [],
        total: 0,
        minQrcode: "",
    },
    reducers: {
        saveData (state, { payload: { data, total } }) {
            return { ...state, articledata: data, total: Number(total) }
        },
        upArticle (state, { payload }) {
            let articledata = state.articledata.slice(0)
            if (articledata && articledata.length > 0) {
                let index = articledata.findIndex((item) => item.id === payload.id)
                if (index !== -1) {
                    articledata[index] = {...articledata[index], ...payload}
                } else {
                    articledata = [payload].concat(articledata)
                }
            } else {
                articledata = [payload].concat(articledata)
            }
            return { ...state, articledata }
        },
        delArticle (state, { payload }) {
            let articledata = state.articledata.slice(0)
            if (articledata && articledata.length > 0) {
                let index = articledata.findIndex((item) => item.id === payload.id)
                if (index !== -1) {
                    articledata.splice(index, 1)
                }
            }
            return { ...state, articledata }
        },
        saveQrcode (state, { payload }) {
            return { ...state, minQrcode: payload }
        },
        saveBill (state, { payload: { data, payOrderId } }) {
            let billdata = data || state.billdata
            if (payOrderId) {
                billdata = billdata.filter((item) => item.id !== payOrderId)
            }
            return { ...state, billdata}
        },
    },
    effects: {
        * getMiniQrcode (_, { call, put }) {
            const { data } = yield call(materialService.getMiniQrcode)
            if (data.error) {
                return
            }
            yield put({ type: "saveQrcode", payload: data.file })
        },
        // 获取文章列表
        * fetchArticle ({ payload }, { call, put }) {
            const { data } = yield call(materialService.fetchArticle, payload)
            if (!data.error) {
                yield put({
                    type: "saveData",
                    payload: { data: data.data, total: data.count },
                })
            }
        },
        // 编辑/新增文章
        * edit ({ payload }, { call, put }) {
            const { data } = yield call(materialService.edit, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            message.success("编辑成功！")
            yield put({
                type: "upArticle",
                payload: {
                    ...payload,
                    id: payload.id || data.id,
                    // createtime: payload.createtime || data.createtime,
                },
            })
        },
        // 删除文章
        * del ({ payload }, { call, put }) {
            const { data } = yield call(materialService.del, payload)
            if (data.error) {
                return message.error(data.errmsg)
            }
            yield put({ type: "delArticle", payload })
        },
        // 获取账单
        * fetchbill (_, { call, put }) {
            const { data } = yield call(materialService.fetchbill)
            if (data.error) {
                return
            }
            yield put({ type: "saveBill", payload: data })
        },
        // 删除账单
        * delPayLog ({payload}, { call, put, select }) {
            const { data } = yield call(materialService.delPayLog, payload)
            if (data.error) {
                return
            }
            yield put({ type: "saveBill", payload })
        },
    },
    subscriptions: {
        setup ({ dispatch, history, query }) {
            return history.listen(async ({ pathname, search, query }) => {
                if (pathname === "/article/bill") {
                    dispatch({ type: "fetchbill" })
                }
            })
        },
    },
}
