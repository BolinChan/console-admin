import { Component } from "react"
import ECharts from "echarts"
import "./china"
class ProvinceMap extends Component {
    componentDidMount () {
        var chart = ECharts.init(document.getElementById("main"))
        chart.setOption({
            series: [{
                type: "map",
                map: "china",
            }],
        })
        const {data} = this.props
        if (data && data.length > 0) {
            this.createMap(this.mapNode)
        }
    }
    componentDidUpdate () {
        const {data} = this.props
        if (data && data.length > 0) {
            this.createMap(this.mapNode)
        }
    }
    createMap = (element) => {
        let maxNum = 0
        let data = this.props.data.map((item) => {
            maxNum = Number(item.count) > maxNum ? Number(item.count) : maxNum
            return {name: item.Province, value: item.count}
        })
        // { name: '北京', value: 16251.93, selected: true }
        const myChart = ECharts.init(element)
        const option = {
            tooltip: {
                trigger: "item",
            },
            dataRange: {
                // orient: "horizontal",
                min: 0,
                max: maxNum,
                text: ["高", "低"], // 文本，默认为数值文本
                splitNumber: 0,
                calculable: true,
                color: ["#0a60e2", "#80b5e9", "#d2f5f7"],
            },
            series: [
                {
                    name: "粉丝地区分布",
                    type: "map",
                    mapType: "china",
                    mapLocation: {
                        x: "left",
                    },
                    // selectedMode: 'multiple',
                    itemStyle: {
                        normal: { label: { show: true, color: "#333" }, borderWidth: 0 },
                        // emphasis: { label: { show: true } },
                        // borderWidth: 0,
                        // borderColor: '#eee',
                    },
                    data,
                },
            ],
            animation: true,
        }
        myChart.setOption(option, true)
    }
    setMapElement = (n) => {
        this.mapNode = n
    }
    render () {
        return (
            <div style={{ maxWidth: "100%", height: "550px" }} ref={this.setMapElement} id="main"/>
        )
    }

}
export default ProvinceMap
