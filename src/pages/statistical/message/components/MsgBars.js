import { Chart, Geom, Axis, Tooltip, Legend, Coord} from "bizcharts"
import DataSet from "@antv/data-set"
const MsgBars = ({data}) => {
    let dataList = []
    if (data) {
        data.map((item) => {
            let {fachu_msg, fachu_person, msg_bili, person_bili, shoudao_msg, shoudao_person, zaccount} = item
            if (fachu_msg && person_bili) {
                msg_bili = msg_bili.replace("%", "")
                dataList.push({"发出消息": fachu_msg, "消息比例(%)": msg_bili, "人数比例": person_bili, "收到消息": shoudao_msg, "收到人数": shoudao_person, "发出人数": fachu_person, zaccount})
            }
        })
    }
    const ds = new DataSet()
    const dv = ds.createView().source(dataList)
    dv.transform({
        type: "fold",
        fields: ["发出消息", "收到消息", "消息比例(%)"],
        // 展开字段集
        key: "type",
        // key字段
        value: "value", // value字段
    })
    let height = dataList.length * 30 > 500 ? dataList.length * 35 : 500
    return (
        <div className="pad20">
            <Chart data={dv} height={height} forceFit>
                <Legend />
                <Coord transpose scale={[1, -1]} />
                <Axis
                    name="zaccount"
                    label={{
                        offset: 12,
                    }}
                />
                <Axis name="value" position={"right"} />
                <Tooltip />
                <Geom
                    type="interval"
                    position="zaccount*value"
                    color={"type"}
                    adjust={[
                        {
                            type: "dodge",
                            marginRatio: 1 / 32,
                        },
                    ]}
                />
            </Chart>
        </div>
    )
}

export default MsgBars
