import { Card, Select } from "antd"
import { Chart, Axis, Geom, Tooltip, Legend } from "bizcharts"
import DataSet from "@antv/data-set"
import styles from "../page.css"
const Option = Select.Option
const ChartMode = ({data, weChatList}) => {
    if (data) {
        data = data.map((item) => ({x: item.x, "点赞数": item.y1, "评论数": item.y2}))
    }
    if (!data) {data = [{ x: "2018-10-01", "点赞数": 0, "评论数": 0 }]}
    const ds = new DataSet()
    const dv = ds.createView("origin").source(data)
    const scale = {
        date: {
            type: "time",
            mask: "YYYY-MM-DD",
            tickCount: 4,
            alias: "日期",
            nice: false,
        },
    }
    dv.transform({
        type: "fold",
        fields: ["点赞数", "评论数"],
        key: "city",
        value: "value",
    })
    const momentSearch = (
        <div style={{display: "none"}}>
            <Select placeholder="请选择设备微信" defaultValue={weChatList && weChatList[0].nickname} style={{ width: 250, marginLeft: 16 }} onChange={this.SelectWeChat}>
                {weChatList && weChatList.map((item) => <Option key={item.id} value={item.wxid}>{item.nickname}</Option>)}
            </Select>
        </div>
    )
    return (
        <div style={{position: "relative"}}>
            <div className={styles.hiddenBar}></div>
            <Card title="朋友圈统计" extra={momentSearch} scale={scale} bordered={false}>
                {/* <TimelineChart height={300} data={chartData} titleMap={{ y1: "点赞数", y2: "评论数"}} /> */}
                <Chart height={400} data={dv} forceFit>
                    <Legend />
                    <Axis name="x" />
                    <Axis name="value" label={{formatter: (val) => `${val}`}}/>
                    <Tooltip crosshairs={{type: "y"}}/>
                    <Geom type="line" position="x*value" size={2} color={"city"} />
                    <Geom type='point' position="x*value" size={4} shape={"circle"} color={"city"} style={{ stroke: "#fff", lineWidth: 1}} />
                </Chart>
            </Card>
        </div>
    )
}
export default ChartMode
