import { testSubstr } from "../utils/helper"
import * as materialService from "../services/material"
import { message } from "antd"
export default {
    namespace: "material",
    state: {
        material: [],
        myMaterial: [],
        uptoken: "",
    },
    reducers: {
        // 获取素材库素材列表
        saveMaterial (
            state,
            {
                payload: { data, count },
            }
        ) {
            let material = []
            data.map((item) => {
                item.media = item.media && JSON.parse(item.media)
                if (material.findIndex((it) => it.id === item.id) === -1 && item.type !== "3") {
                    material.push(item)
                }
            })
            return { ...state, material, materialCount: count }
        },
        editMaterial (
            state,
            { payload}
        ) {
            let material = state.material.slice(0)
            let index = material.findIndex((item) => item.id === payload.id)
            index !== -1 && (material[index] = payload)
            return { ...state, material}
        },
        deleteMaterial (
            state,
            {
                payload: { id },
            }
        ) {
            let material = state.material.slice(0)
            let myMaterial = state.myMaterial.slice(0)
            material.map((item, index) => {
                if (item.id === id) {
                    material.splice(index, 1)
                }
            })
            myMaterial.map((item, index) => {
                if (item.id === id) {
                    myMaterial.splice(index, 1)
                }
            })
            return { ...state, material, myMaterial }
        },
        //  获取我的永久素材列表
        saveMyMaterial (
            state,
            {
                payload: { data },
            }
        ) {
            let myMaterial = []
            data.map((item) => {
                item.media = item.media && JSON.parse(item.media)
                if (myMaterial.findIndex((it) => it.id === item.id) === -1) {
                    myMaterial.push(item)
                }
            })
            return { ...state, myMaterial }
        },
        editMyMaterial (
            state,
            { payload}
        ) {
            let myMaterial = state.myMaterial.slice(0)
            let index = myMaterial.findIndex((item) => item.id === payload.id)
            index !== -1 && (myMaterial[index] = payload)
            return { ...state, myMaterial}
        },
    },
    effects: {
        // 获取素材库
        * fetchMaterial ({ payload }, { call, put, select }) {
            const material = yield select((state) => state.material.material)
            if (!payload && material && material.length > 0) {
                return
            }
            const {
                data: { error, data },
            } = yield call(materialService.getMaterial, { ispage: "2", ...payload })
            if (!error) {
                yield put({
                    type: "saveMaterial",
                    payload: {
                        data: data.list,
                        count: Number(data.total),
                    },
                })
            }
        },
        * addMaterial ({ payload }, { call, put }) {
            const { data } = yield call(materialService.addMaterial, payload)
            if (data.error) {
                return message.error(data.errMsg)
            }
            if (payload.id) {
                yield put({
                    type: "editMaterial",
                    payload,
                })
                return message.success("修改成功")
            }
            yield put({
                type: "fetchMaterial",
                payload,
            })
            message.success("添加成功")
        },
        * delMaterial ({ payload }, { call, put }) {
            const {
                data: { error, errMsg },
            } = yield call(materialService.delMaterial, payload)
            if (error) {
                return message.error(errMsg)
            }
            message.success("删除成功")
            yield put({
                type: "deleteMaterial",
                payload,
            })
        },
        // 获取我的素材库
        * fetchMyMaterial ({ payload }, { call, put, select }) {
            const myMaterial = yield select((state) => state.material.myMaterial)
            if (!payload && myMaterial && myMaterial.length > 0) {
                return
            }
            const data = yield call(materialService.getMymaterial, {ispage: 2, ...payload })
            if (!data.data.error) {
                yield put({
                    type: "saveMyMaterial",
                    payload: {
                        data: data.data.data.list,
                    },
                })
            }
        },
        // 添加或者修改我的素材
        * addMymaterial ({ payload }, { call, put }) {
            const { data } = yield call(materialService.addMymaterial, payload)
            if (data.error) {
                return message.error(data.errMsg)
            }
            if (payload.id) {
                yield put({
                    type: "editMyMaterial",
                    payload,
                })
                return message.success("修改成功")
            }
            yield put({
                type: "fetchMyMaterial",
                payload: true,
            })
            message.success("添加成功")
        },
        // 删除我的素材库
        * delMymaterial ({ payload }, { call, put, select }) {
            const { data: { error, errMsg } } = yield call(materialService.delMymaterial, payload)
            if (error) {
                return message.error(errMsg)
            }
            message.success("删除成功")
            yield put({
                type: "deleteMaterial",
                payload,
            })
        },
        // 一键分享
        * shareMaterial ({ payload }, { call }) {
            const {
                data: { error, errmsg },
            } = yield call(materialService.shareMaterial, payload)
            if (error) {
                return message.error(errmsg)
            }
            return message.success("分享成功")
        },

    },
    subscriptions: {
        setup ({ dispatch, history, query }) {
            return history.listen(async ({ pathname, search, query }) => {
                if (testSubstr(pathname, "/currency")) {
                    dispatch({ type: "vertisy/fetchWeChatList" })
                    dispatch({ type: "fetchMaterial" })
                }
                if (testSubstr(pathname, "/myself")) {
                    dispatch({ type: "vertisy/fetchWeChatList" })
                    dispatch({ type: "fetchMyMaterial" })
                }
            })
        },
    },
}
