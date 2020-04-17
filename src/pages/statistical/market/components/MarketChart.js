import { Chart, Axis, Geom, Tooltip, Legend } from "bizcharts"
import DataSet from "@antv/data-set"
const MarketChart = ({data}) => {
    if (!data) {
        data = [
            { month: "2018-10-01", "付款客户": 0, "付款订单": 0, "付款金额": 0, "客单价": 0, "复购率": 0 },
        ]
    }
    const ds = new DataSet()
    const dv = ds.createView("origin").source(data)
    dv.transform({
        type: "fold",
        fields: ["付款客户", "付款订单", "付款金额", "客单价", "复购率"], // 展开字段集
        key: "city",
        value: "value",
    })
    return (
        <div className="pad20">
            <Chart height={400} data={dv} forceFit>
                <Legend />
                <Axis name="month" />
                <Axis name="value" label={{formatter: (val) => `${val}`}}/>
                <Tooltip crosshairs={{type: "y"}}/>
                <Geom type="line" position="month*value" size={2} color={"city"} />
                <Geom type='point' position="month*value" size={4} shape={"circle"} color={"city"} style={{ stroke: "#fff", lineWidth: 1}} />
            </Chart>
            {/* <div>
                <Slider padding={[20, 40, 20, 40]} width='auto' height={26} start='2015-02-07' end='2015-04-01'
                    xAxis="month" yAxis='Tokyo' scales={{time: {type: "time", tickCount: 10, mask: "YYYY-MM-D"}}} data={dv}
                    onChange={onChange}
                />
            </div> */}
        </div>
    )

}
export default MarketChart
