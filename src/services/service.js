import request from "../utils/request"
const wechat = "//wechat.yunbeisoft.com/index_test.php/home"
// 再次执行指令
export function dutyReexecute (body) {
    return request({
        method: "post",
        url: `${wechat}/duty/dutyReexecute`,
        data: JSON.stringify(body),
    })
}
// 删除指令
export function dutyDelete (body) {
    return request({
        method: "post",
        url: `${wechat}/duty/dutyDelete`,
        data: JSON.stringify(body),
    })
}
// 获取指令列表
export function fetchDutyLst (body) {
    return request({
        method: "post",
        url: `${wechat}/duty/dutyList`,
        data: JSON.stringify(body),
    })
}
// 获取子账号
export function fetchAccount (body) {
    return request({
        method: "post",
        url: `${wechat}/ziaccount/get_zids`,
        data: JSON.stringify(body),
    })
}
// 获取设备
export function fetchDevices (body) {
    return request({
        method: "post",
        url: `${wechat}/device/gets`,
        data: JSON.stringify(body),
    })
}
// 创建设备（编辑设备）
export function addDevices (body) {
    return request({
        method: "post",
        url: `${wechat}/device/create`,
        data: JSON.stringify(body),
    })
}
// 设置设备的分组
export function setDevicesGroup (body) {
    return request({
        method: "post",
        url: `${wechat}/device/batchupd`,
        data: JSON.stringify(body),
    })
}

// 删除设备
export function delDevices (body) {
    return request({
        method: "post",
        url: `${wechat}/device/delete_device`,
        data: JSON.stringify(body),
    })
}
// 获取设备分组
export function fetchDevGroup (body) {
    return request({
        method: "post",
        url: `${wechat}/device/get_zus`,
        data: JSON.stringify(body),
    })
}
// 添加设备分组
export function addDevGroup (body) {
    return request({
        method: "post",
        url: `${wechat}/device/zu_create`,
        data: JSON.stringify(body),
    })
}
// 编辑设备分组
export function editDevGroup (body) {
    return request({
        method: "post",
        url: `${wechat}/device/zu_update`,
        data: JSON.stringify(body),
    })
}
// 删除设备分组
export function delDevGroup (body) {
    return request({
        method: "post",
        url: `${wechat}/device/zu_delete`,
        data: JSON.stringify(body),
    })
}
// 分配设备微信给客服
export function DisEquipment (body) {
    return request({
        method: "post",
        url: `${wechat}/device/update_device_kefu`,
        data: JSON.stringify(body),
    })
}
// 删除微信客服
export function deleteKefu (body) {
    return request({
        method: "post",
        url: `${wechat}/device/delete_device_kefu`,
        data: JSON.stringify(body),
    })
}
// 分配设备微信给客服
export function Equipments (body) {
    return request({
        method: "post",
        url: `${wechat}/device/piliangupdate_device_kefu`,
        data: JSON.stringify(body),
    })
}
// 获取好友
export function fetchContactList (body) {
    return request({
        method: "post",
        url: `${wechat}/api/dogetuserlists`,
        data: JSON.stringify(body),
    })
}
// 同步好友
export function updateContactList (body) {
    return request({
        method: "post",
        url: `${wechat}/setting/flush_friends`,
        data: JSON.stringify(body),
    })
}
// 清理粉丝
export function delContact (body) {
    return request({
        method: "post",
        url: `${wechat}/account/delete_fans`,
        data: JSON.stringify(body),
    })
}
// 停止清理粉丝
export function stopDelete (body) {
    return request({
        method: "post",
        url: `${wechat}/nursing/stopDeleteFriends`,
        data: JSON.stringify(body),
    })
}
// 给好友备注
export function editRemark (body) {
    return request({
        method: "post",
        url: `${wechat}/api/update_remark`,
        data: JSON.stringify(body),
    })
}
// 给好友手机号码
export function editPhone (body) {
    return request({
        method: "post",
        url: `${wechat}/api/phone_to_wxid`,
        data: JSON.stringify(body),
    })
}
// 给好友绑定旺旺号
export function editWang (body) {
    return request({
        method: "post",
        url: `${wechat}/api/ww_to_wxid`,
        data: JSON.stringify(body),
    })
}
// 绑定京东帐号
export function editJd (body) {
    return request({
        method: "post",
        url: `${wechat}/device/setJdAccount`,
        data: JSON.stringify(body),
    })
}
// 给好友打标签
export function editTags (body) {
    return request({
        method: "post",
        url: `${wechat}/tagg/taggwxid`,
        data: JSON.stringify(body),
    })
}
// 批量给好友打标签
export function maxEditTags (body) {
    return request({
        method: "post",
        url: `${wechat}/tagg/piliangaddtagg`,
        data: JSON.stringify(body),
    })
}
// 批量给好友删除标签
export function maxDelTags (body) {
    return request({
        method: "post",
        url: `${wechat}/tagg/piliangdeltagg`,
        data: JSON.stringify(body),
    })
}
// 给搜索结果打标签
export function fenpeiTag (body) {
    return request({
        method: "post",
        url: `${wechat}/tagg/fenpei_wx_to_tagg`,
        data: JSON.stringify(body),
    })
}
// 编辑好友 备忘录 居住地址
export function editAddress (body) {
    return request({
        method: "post",
        url: `${wechat}/setting/editFriend`,
        data: JSON.stringify(body),
    })
}

// 获取设备微信列表
export function fetchWeChatList (body) {
    return request({
        method: "post",
        url: `${wechat}/device/device_bind_lists`,
        data: JSON.stringify(body),
    })
}
// 删除设备微信
export function deleteWeChatList (body) {
    return request({
        method: "post",
        url: `${wechat}/device/delete_device_wx`,
        data: JSON.stringify(body),
    })
}
// 修改设备微信备注
export function WeChatRemark (body) {
    return request({
        method: "post",
        url: `${wechat}/device/update_device_wx_remark`,
        data: JSON.stringify(body),
    })
}

// 获取消息
export function fetchMessages (body) {
    return request({
        method: "post",
        url: `${wechat}/api/get_stat_msg_history_server`,
        data: JSON.stringify(body),
    })
}
// 同步历史记录
export function getHistoryMsg (body) {
    return request({
        method: "post",
        url: `${wechat}/device/getHistoryMsg`,
        data: JSON.stringify(body),
    })
}
// 绑定公众号
export function bindPublic (body) {
    return request({
        method: "post",
        url: "//wxx.jutaobao.cc/qunkongbind/qkbind.php",
        data: JSON.stringify(body),
    })
}
// 领取后是否展示扫描二维码关注公众号功能
export function follow (body) {
    return request({
        method: "post",
        url: "//wxx.jutaobao.cc/yunbei_send_redpack/bind.php?bind=res",
        data: JSON.stringify(body),
    })
}
// 是否关注公众号后才可以领取群控红包
export function attention (body) {
    return request({
        method: "post",
        url: "//wxx.jutaobao.cc/yunbei_send_redpack/bind.php?bind=attention",
        data: JSON.stringify(body),
    })
}
// 获取操作记录（搜索操作记录）
export function fetchOperation (body) {
    return request({
        method: "post",
        url: `${wechat}/userlog/gets`,
        data: JSON.stringify(body),
    })
}
// 获取红包记录
export function redpackage (body) {
    return request({
        method: "post",
        url: "//wxx.jutaobao.cc/yunbei_send_redpack/qr_code.php?code=record",
        data: JSON.stringify(body),
    })
}

// 设置红包最大限额
export function RedSetting (body) {
    return request({
        method: "post",
        url: "//wxx.jutaobao.cc/yunbei_send_redpack/qr_code.php?do=setMax",
        data: JSON.stringify(body),
    })
}
// 获取(查询)敏感词数据
export function fetchKeyData (body) {
    return request({
        method: "post",
        url: `${wechat}/skeyword/get_keyword?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}
export function addKeyData (body) {
    return request({
        method: "post",
        url: `${wechat}/skeyword/add_keyword?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}
export function updateKeyData (body) {
    return request({
        method: "post",
        url: `${wechat}/skeyword/update_keyword?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}
export function deleteKeyData (body) {
    return request({
        method: "post",
        url: `${wechat}/skeyword/delete_keyword?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}
// 获取敏感词操作
export function fetchActions (body) {
    return request({
        method: "post",
        url: `${wechat}/actions/get_actions?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}
// 修改敏感操作状态
export function updateStatus (body) {
    return request({
        method: "post",
        url: `${wechat}/actions/update_actions?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}
// 获取敏感词操作设置
export function getActions (body) {
    return request({
        method: "post",
        url: `${wechat}/actionsetting/get_actionsetting?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}
// 修改敏感词操作设置
export function updateActions (body) {
    return request({
        method: "post",
        url: `${wechat}/actionsetting/update_actionsetting?access_token=ACCESS_TOKEN`,
        data: JSON.stringify(body),
    })
}

// 获取活码
export function fetchMicro (body) {
    return request({
        method: "post",
        url: `${wechat}/qrcode/liovecode_show`,
        data: JSON.stringify(body),
    })
}
// 添加活码
export function addMicro (body) {
    return request({
        method: "post",
        url: `${wechat}/qrcode/liovecode_add`,
        data: JSON.stringify(body),
    })
}
// 修改活码
export function updateMicro (body) {
    return request({
        method: "post",
        url: `${wechat}/qrcode/liovecode_edit`,
        data: JSON.stringify(body),
    })
}
// 删除活码
export function deleteMicro (body) {
    return request({
        method: "post",
        url: `${wechat}/qrcode/liovecode_del`,
        data: JSON.stringify(body),
    })
}

// 获取活码下的二维码
export function fetchQrcode (body) {
    return request({
        method: "post",
        url: `${wechat}/qrcode/liove_qrcode_show`,
        data: JSON.stringify(body),
    })
}
// 添加二维码
export function addQrcode (body) {
    return request({
        method: "post",
        url: `${wechat}/qrcode/liove_qrcode_add`,
        data: JSON.stringify(body),
    })
}
// 修改二维码
export function updateQrcode (body) {
    return request({
        method: "post",
        url: `${wechat}/qrcode/liove_qrcode_edit`,
        data: JSON.stringify(body),
    })
}
// 删除二维码
export function deleteQrcode (body) {
    return request({
        method: "post",
        url: `${wechat}/qrcode/liove_qrcode_del`,
        data: JSON.stringify(body),
    })
}
// 给客服分配粉丝微信号
export function selectFriend (body) {
    return request({
        method: "post",
        url: `${wechat}/device/fenpei_wx_to_kefu`,
        data: JSON.stringify(body),
    })
}
// 取消分配搜索结果
export function deleteSelectFriend (body) {
    return request({
        method: "post",
        url: `${wechat}/device/cancle_fenpei_wx_to_kefu`,
        data: JSON.stringify(body),
    })
}
// 取消客服分配粉丝微信号
export function delFkefu (body) {
    return request({
        method: "post",
        url: `${wechat}/device/quxiao_fenpei_wx_to_kefu`,
        data: JSON.stringify(body),
    })
}
// 分配好友分组
export function assignmentUser (body) {
    return request({
        method: "post",
        url: `${wechat}/api/editusergroup`,
        data: JSON.stringify(body),
    })
}
// 获取好友分组
export function getusergroup (body) {
    return request({
        method: "post",
        url: `${wechat}/api/getusergroup`,
        data: JSON.stringify(body),
    })
}

// 删除好友分组
export function delusergroup (body) {
    return request({
        method: "post",
        url: `${wechat}/api/delusergroup`,
        data: JSON.stringify(body),
    })
}
// 添加好友分组
export function addusergroup (body) {
    return request({
        method: "post",
        url: `${wechat}/api/addusergroup`,
        data: JSON.stringify(body),
    })
}
// 编辑好友分组
export function editusergroup (body) {
    return request({
        method: "post",
        url: `${wechat}/api/bianjiusergroup`,
        data: JSON.stringify(body),
    })
}
// 获取订单
export function getOrderRecord (body) {
    return request({
        method: "post",
        url: "//wxx.jutaobao.cc/qunkong_order/qunkong_order.php",
        data: JSON.stringify(body),
    })
}
// 获取自动养号列表
export function fetchNursing (body) {
    return request({
        method: "post",
        url: `${wechat}/nursing/getLists`,
        data: JSON.stringify(body),
    })
}
// 添加自动养号设置
export function addNursing (body) {
    return request({
        method: "post",
        url: `${wechat}/nursing/addAction`,
        data: JSON.stringify(body),
    })
}
// 编辑自动养号
export function editNursing (body) {
    return request({
        method: "post",
        url: `${wechat}/nursing/editAction`,
        data: JSON.stringify(body),
    })
}
// 删除自动养号
export function delNursing (body) {
    return request({
        method: "post",
        url: `${wechat}/nursing/delAction`,
        data: JSON.stringify(body),
    })
}
// 扩展字段（查询）
export function fetchField (body) {
    return request({
        method: "post",
        url: `${wechat}/Zdyfield/selectfield`,
        data: JSON.stringify(body),
    })
}
export function addField (body) {
    return request({
        method: "post",
        url: `${wechat}/Zdyfield/addfield`,
        data: JSON.stringify(body),
    })
}
export function delField (body) {
    return request({
        method: "post",
        url: `${wechat}/Zdyfield/delfield`,
        data: JSON.stringify(body),
    })
}
// 排序自定义字段
export function orderField (body) {
    return request({
        method: "post",
        url: `${wechat}/Zdyfield/orderbyfield`,
        data: JSON.stringify(body),
    })
}
// 编辑好友自定义字段内容
export function editfriendfield (body) {
    return request({
        method: "post",
        url: `${wechat}/Zdyfield/editfriendfield`,
        data: JSON.stringify(body),
    })
}
// 获取微信自动聊天任务
export function fetchAutoChatDuty (body) {
    return request({
        method: "post",
        url: `${wechat}/autoChatGroup/AutomaticTaskGets`,
        data: JSON.stringify(body),
    })
}
// 添加微信自动聊天任务
export function addAutoChatDuty (body) {
    return request({
        method: "post",
        url: `${wechat}/autoChatGroup/AutomaticTaskAdd`,
        data: JSON.stringify(body),
    })
}
// 修改自动聊天任务
export function updateAutoChatDuty (body) {
    return request({
        method: "post",
        url: `${wechat}/autoChatGroup/AutomaticTaskEdit`,
        data: JSON.stringify(body),
    })
}
// 删除自动聊天任务
export function deleteChatDuty (body) {
    return request({
        method: "post",
        url: `${wechat}/autoChatGroup/AutomaticTaskDel`,
        data: JSON.stringify(body),
    })
}
// 获取聊天任务模板
export function fetchTemplateGet (body) {
    return request({
        method: "post",
        url: `${wechat}/autoChatGroup/templateGet`,
        data: JSON.stringify(body),
    })
}
// 添加聊天任务模板
export function templateAdd (body) {
    return request({
        method: "post",
        url: `${wechat}/autoChatGroup/templateAdd`,
        data: JSON.stringify(body),
    })
}
// 修改模板名称
export function templateEdit (body) {
    return request({
        method: "post",
        url: `${wechat}/autoChatGroup/templateEdit`,
        data: JSON.stringify(body),
    })
}
// 删除聊天任务模板
export function templateDel (body) {
    return request({
        method: "post",
        url: `${wechat}/autoChatGroup/templateDel`,
        data: JSON.stringify(body),
    })
}
// 查创客工具箱
export function MakerGets (body) {
    return request({
        method: "post",
        url: `${wechat}/autoChatGroup/MakerGets`,
        data: JSON.stringify(body),
    })
}
// 改
export function MakerEdit (body) {
    return request({
        method: "post",
        url: `${wechat}/autoChatGroup/MakerEdit`,
        data: JSON.stringify(body),
    })
}
// 增
export function MakerAdd (body) {
    return request({
        method: "post",
        url: `${wechat}/autoChatGroup/MakerAdd`,
        data: JSON.stringify(body),
    })
}
// 删
export function MakerDel (body) {
    return request({
        method: "post",
        url: `${wechat}/autoChatGroup/MakerDel`,
        data: JSON.stringify(body),
    })
}
