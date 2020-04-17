import {Component} from "react"
import { Row, Col, Card} from "antd"
import ProvinceTable from "./components/ProvinceTable"
import ProvinceMap from "./components/ProvinceMap"
import { connect } from "dva"
import styles from "../page.css"
// const {Option} = Select
const _d = new Date()
class page extends Component {
    render () {
        const {province, loading, gender, addFriend} = this.props
        let addNum = 0
        if (addNum === 0 && addFriend) {
            let month = _d.getMonth() + 1 + "月"
            let list = addFriend.find((item) => item.month === month)
            list && (addNum = list.num)
        }
        let total = 0
        if (gender && gender.nan) {
            total = Number(gender.nan) + Number(gender.nv) + Number(gender.weizhi)
        }
        return (
            <Row className="pad10">
                <Col lg={24} xl={18}>
                    <Col lg={24} xl={10} className="pad10">
                        <Card title="粉丝数据">
                            <Row className={styles.headerItems}>
                                <Col span={12} className={styles.headerItem}>
                                    <p>新增粉丝数</p>
                                    <span>{addNum}</span>
                                </Col>
                                <Col span={12} className={styles.headerItem}>
                                    <p>累计粉丝数</p>
                                    <span>{total}</span>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col lg={24} xl={14} className="pad10">
                        <Card title="粉丝属性">
                            <Row className={styles.headerItems}>
                                <Col span={8} className={styles.headerItem}>
                                    <p>男</p>
                                    <span>{gender.nan}</span>
                                </Col>
                                <Col span={8} className={styles.headerItem}>
                                    <p>女</p>
                                    <span>{gender.nv}</span>
                                </Col>
                                <Col span={8} className={styles.headerItem}>
                                    <p>未知</p>
                                    <span>{gender.weizhi}</span>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col span={24} className="pad10">
                        <Card title="统计">
                            <ProvinceMap data={province}></ProvinceMap>
                        </Card>
                    </Col>
                </Col>
                <Col lg={24} xl={6} className="pad10">
                    <Card title="粉丝地区分布">
                        <ProvinceTable data={province} loading={loading}></ProvinceTable>
                    </Card>
                </Col>
            </Row>
        )
    }
}
function mapStateToProps (state) {
    const { province, gender} = state.statistical
    const { addFriend, friendNum } = state.login
    return {
        province,
        gender,
        addFriend,
        friendNum,
        loading: state.loading.models.statistical,
    }
}
export default connect(mapStateToProps)(page)
