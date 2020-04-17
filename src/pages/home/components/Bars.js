import { Row, Col, Icon, Pagination } from "antd"
import styles from "../page.css"
import { Bar } from "ant-design-pro/lib/Charts"
import classnames from "classnames"
const IconFont = Icon.createFromIconfontCN({
    scriptUrl: "//at.alicdn.com/t/font_862846_69jtk0zrwop.js",
})
const Bars = ({data, friendRank, flushFun, update, updateLoading, WeChatId, ranktotal, current, onChangePage}) => {
    if (data) {
        for (let i = 0; i < data.length; i += 1) {
            data[i].x = data[i].month
            data[i].y = data[i].num
        }
    }
    return (
        <Row>
            <Col xs={24} sm={24} md={12} lg={12} xl={16}>
                <div className={styles.barBox}>
                    <Bar height={300} title="粉丝总数趋势" data={data} />
                </div>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                <div className={styles.rankBox}>
                    <h4>
                        <span>好友总数排行</span>
                    </h4>
                    <ul className={styles.rankList}>
                        {friendRank &&
                            friendRank.map((item, index) => {
                                let updatelist = update && update.find((mess) => mess.wxid === item.wxid)
                                let isflush = updatelist ? updatelist.isflush : true
                                let text = item.wxremark || item.nickname || item.wxid
                                return (
                                    <li key={index}>
                                        <span className={classnames([[styles.rankItemNum], { [styles.rankItemTop]: index + (current - 1) * 7 < 3 }])}>{(current - 1) * 7 + 1 + index}</span>
                                        <span className={styles.rankItemTitle} title={text + `（${item.devicename}）`}>
                                           ( {item.devicename.length > 4 ? item.devicename.substring(0, 4) + "..." : item.devicename})
                                            {text }
                                        </span>
                                        <span>{item.fans_num}</span>
                                        <IconFont
                                            spin={WeChatId === item.wxid && updateLoading}
                                            className={classnames([[styles.iconLoad], {[styles.isload]: isflush}])}
                                            title={isflush ? "点击同步好友" : "好友已同步"}
                                            disabled={!isflush}
                                            type="icon-winfo-icon-tongbu"
                                            onClick={() => flushFun && flushFun(item.wxid)}/>
                                    </li>
                                )
                            })}
                    </ul>
                    <Pagination size="small" total={ranktotal} pageSize={7} current={current} onChange={onChangePage} hideOnSinglePage={true} style={{ marginTop: 16, textAlign: "right"}}/>
                </div>
            </Col>
        </Row>
    )
}
export default Bars
