import { Card, Radio } from "antd"
import { Pie } from "ant-design-pro/lib/Charts"
import moment from "moment"
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
// 获取昨天的开始结束时间
function getYesterday () {
    const startDate = moment().subtract("days", 1)
        .format("YYYY-MM-DD") + " 00:00:00"
    const endDate = moment(moment().startOf("days", 1)
        .valueOf()).format("YYYY-MM-DD HH:mm:ss")
    return [startDate, endDate]
}
function Today () {
    const startDate = moment().startOf("day")
        .valueOf()
    const endDate = moment().valueOf()
    return [moment(startDate).format("YYYY-MM-DD HH:mm:ss"), moment(endDate).format("YYYY-MM-DD HH:mm:ss")]
}
// 获取最近七天的开始结束时间
function getLast7Days () {
    let date = []
    date.push(moment().subtract("days", 7)
        .format("YYYY-MM-DD"))
    date.push(moment().format("YYYY-MM-DD"))
    return date
}
// 获取最近30天的开始结束时间
function getLast30Days () {
    let date = []
    date.push(moment().subtract("days", 30)
        .format("YYYY-MM-DD"))
    date.push(moment().format("YYYY-MM-DD"))
    return date
}
function parseNumber (str) {
    str = str.split(".")
    let re = /(?=(?!\b)(\d{3})+$)/g
    return str[0].replace(re, ",") + "." + str[1]
}
const Pies = ({data, weChatList, dispatch}) => {
    const onChangeTime = (e) => {
        if (e.target.value === "") {
            dispatch({
                type: "login/RedRank",
            })
            return
        }
        let list = [getLast30Days(), getLast7Days(), getYesterday(), Today()]
        dispatch({
            type: "login/RedRank",
            payload: list[Number(e.target.value)],
        })
    }
    const redSearch = (
        <RadioGroup defaultValue="" onChange={onChangeTime}>
            <RadioButton value="">全部记录</RadioButton>
            <RadioButton value="0">最近一月</RadioButton>
            <RadioButton value="1">最近7天</RadioButton>
            <RadioButton value="2">昨日</RadioButton>
            <RadioButton value="3">今日</RadioButton>
        </RadioGroup>
    )
    // let salesPieData = [{ x: "设备微信1", y: 4544 }, { x: "设备微信9", y: 3321 }, { x: "设备微信2", y: 3113 }, { x: "设备微信3", y: 2341 }, { x: "设备微信15", y: 1231 }, { x: "设备微信121", y: 1231 }]
    let salesPieData = []
    if (data && weChatList && weChatList.length > 0) {
        data.map((item) => {
            let list = weChatList.find((mess) => mess.wxid === item.devicid)
            salesPieData.push({x: list.nickname, y: Number(item.z_money)})
        })
    }
    const total = parseNumber(salesPieData.reduce((pre, now) => now.y + pre, 0).toFixed(2))
    return (
        <Card title="红包发放记录" extra={redSearch} bordered={false} style={{height: "100%", minHeight: "403px"}}>
            <Pie
                hasLegend
                title="发送金额"
                subTitle="发送金额"
                total={() => "￥" + total}
                data={salesPieData}
                valueFormat={(val) => "￥" + parseNumber(val.toFixed(2))}
                height={294}
            />
        </Card>
    )
}
export default Pies
