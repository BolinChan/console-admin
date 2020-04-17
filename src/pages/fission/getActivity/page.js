import { Component } from "react"
import { connect } from "dva"
import { Icon, Spin } from "antd"
import { MiniArea, ChartCard } from "ant-design-pro/lib/Charts"
import { Row, Col } from "antd"
import styles from "../page.css"
class Page extends Component {
    state = { visitData: [] }
    async componentDidMount () {
        let time = new Date()
        const { fissLst, location } = this.props
        let id = location.query.id
        let star = time.getTime()
        let end = time.getTime() + (30 * 24 * 60 * 60 * 1000)
        await this.props.dispatch({
            type: "fission/getFissPosterCount",
            payload: { taskId: id, time: [star, end] },
        })
        const [allTotal, unFollow, FissionRate, retentionRate] = [[], [], [], []]
        for (let i = 0; i < 30; i += 1) {
            if (i === 10 && fissLst) {
                allTotal.push({
                    x: `${i + 1}日`,
                    y: Math.floor(fissLst.allTotal),
                })
                unFollow.push({
                    x: `${i + 1}日`,
                    y: Math.floor(fissLst.unFollow),
                })
                var str = fissLst.FissionRate.replace("%", "")
                FissionRate.push({
                    x: `${i + 1}日`,
                    y: Math.floor(str),
                })
                var str2 = fissLst.retentionRate.replace("%", "")
                retentionRate.push({
                    x: `${i + 1}日`,
                    y: Math.floor(str2),
                })

            } else {
                allTotal.push({
                    x: `${i + 1}日`,
                    y: 0,
                })
                unFollow.push({
                    x: `${i + 1}日`,
                    y: 0,
                })
                FissionRate.push({
                    x: `${i + 1}日`,
                    y: 0,
                })
                retentionRate.push({
                    x: `${i + 1}日`,
                    y: 0,
                })
            }
        }

        this.setState({ allTotal, unFollow, FissionRate, retentionRate })
    }
    render () {
        const { fissLst, loading } = this.props
        const { allTotal, unFollow, FissionRate, retentionRate } = this.state
        const datum = [
            { icon: "user", name: "总参与用户", color: "rgb(255, 189, 0)", num: fissLst && fissLst.allTotal },
            { icon: "stop", name: "总取关人数", color: "rgb(228,75,81)", num: fissLst && fissLst.unFollow },
            { icon: "arrow-up", name: "裂变率", color: "rgb(32,208,51)", num: fissLst && fissLst.FissionRate },
            { icon: "star", name: "留存率", color: "rgb(121,127,243)", num: fissLst && fissLst.retentionRate }]
        return (
            <div className="pad20">
                <h2 className="mb60">活动实时数据<a href="#/fission/act" className={styles.backa}>返回</a></h2>
                <div style={{ display: loading ? "none" : "" }}>
                    <div className="f mb60" style={{ width: "100%" }}>
                        {datum.map((item) => (
                            <div key={item.name} className="f fv fc" style={{ width: "25%" }}>
                                <div className="f fc">
                                    <Icon type={item.icon} theme="outlined" className="mr10 f18" />
                                    <span >{item.name}</span>
                                </div>
                                <div className={styles.headerTitle} style={{ color: item.color }}>{item.num}</div>
                            </div>
                        ))}
                    </div>
                    <Row className="mb60">
                        <Col span={11}>
                            <ChartCard
                                title="总参与用户"
                                total={fissLst && fissLst.allTotal}
                                contentHeight={134}
                            >
                                <MiniArea
                                    line
                                    borderColor="rgb(255, 189, 0)"
                                    color="rgba(255, 189, 0,0.6)"
                                    height={45}
                                    data={allTotal && allTotal}
                                />
                            </ChartCard>
                        </Col>
                        <Col span={12} offset={1}>
                            <ChartCard
                                title="裂变率"
                                total={fissLst && fissLst.FissionRate}
                                contentHeight={134}
                            >
                                <MiniArea
                                    line
                                    borderColor="rgb(32,208,51)"
                                    color="rgba(32,208,51,0.6)"
                                    height={45}
                                    data={FissionRate && FissionRate}
                                />
                            </ChartCard>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={11}>
                            <ChartCard
                                title="留存率"
                                total={fissLst && fissLst.retentionRate}
                                contentHeight={134}
                            >
                                <MiniArea
                                    line
                                    borderColor="rgb(121,127,243)"
                                    color="rgba(121,127,243,0.6)"
                                    height={45}
                                    data={retentionRate && retentionRate}
                                />
                            </ChartCard>
                        </Col>
                        <Col span={12} offset={1}>
                            <ChartCard
                                title="总取关人数"
                                total={fissLst && fissLst.unFollow}
                                contentHeight={134}
                            >
                                <MiniArea
                                    line
                                    borderColor="rgb(228,75,81)"
                                    color="rgba(228,75,81,0.6)"
                                    height={45}
                                    data={unFollow && unFollow}
                                />
                            </ChartCard>
                        </Col>
                    </Row>
                </div>
                <Spin spinning={loading} size="large" className={styles.spinabs}></Spin>
            </div>
        )
    }
}
function mapStateToProps (state) {
    const { fissLst } = state.fission
    return {
        fissLst,
        loading: state.loading.models.fission,
    }
}
export default connect(mapStateToProps)(Page)

