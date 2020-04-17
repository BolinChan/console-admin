import { Chart, Axis, Geom, Tooltip, Legend } from "bizcharts"
import DataSet from "@antv/data-set"

const MsgChart = ({data}) => {
    if (data) {
        data = data.map((item) => ({month: item.date, "接收消息数": Number(item.shoudao_msg), "发送消息数": Number(item.fachu_msg), "发送人数": item.fachu_person, "接收人数": item.shoudao_person}))
    }
    if (data && data.length === 0) {
        data = [{month: "2018-10-10", "接收消息数": 0, "发送消息数": 0, "发送人数": 0, "接收人数": 0}]
    }
    const ds = new DataSet()
    const scale = {
        date: {
            type: "time",
            mask: "YYYY-MM-DD",
            tickCount: 4,
            alias: "日期",
            nice: false,
        },
    }
    const dv = ds.createView("origin").source(data)
    dv.transform({
        type: "fold",
        fields: ["接收消息数", "发送消息数", "发送人数", "接收人数"],
        key: "city",
        value: "value",
    })
    return (
        <div className="pad20">
            <Chart height={400} data={dv} scale={scale} forceFit>
                <Legend />
                <Axis name="month" />
                <Axis name="value" label={{formatter: (val) => `${val}`}}/>
                <Tooltip crosshairs={{type: "y"}}/>
                <Geom type="line" position="month*value" size={2} color={"city"} />
                <Geom type='point' position="month*value" size={4} shape={"circle"} color={"city"} style={{ stroke: "#fff", lineWidth: 1}} />
            </Chart>
        </div>
    )
}

export default MsgChart
