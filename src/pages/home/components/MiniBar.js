
import { ChartCard, MiniArea} from "ant-design-pro/lib/Charts"
import NumberInfo from "ant-design-pro/lib/NumberInfo"
import { Col, Row, Avatar, Button, DatePicker } from "antd"
// import styles from "../page.css"
import { Card, Table} from "antd"
import numeral from "numeral"
import moment from "moment"
const { RangePicker } = DatePicker
const columns = [
    { title: "微信信息", dataIndex: "wxid" },
    { title: "新增数量", dataIndex: "num", render: (num) => num || 0 },
    { title: "通过率", dataIndex: "probability", render: (value) => value + "%"},
]
const weChatFun = (wxid, weChatList) => {
    let list = weChatList && weChatList.find((item) => item.wxid === wxid)
    return <div><Avatar shape="square" src={list && list.headimg} icon="user" /> {list && list.nickname || "未知"}</div>
}
const MiniCard = ({loading, data, loadingfriend, weChatList, minidata, executionNumber, selectDate, onPageChange, current, total}) => {
    data = data && data.filter((item) => item.wxid)
    columns[0] = {title: "微信信息", dataIndex: "wxid", render: (wxid) => weChatFun(wxid, weChatList)}
    let visitData = []
    let totalNum = 0
    visitData = minidata && minidata.map((item) => {
        totalNum = totalNum + Number(item.num)
        return {x: item.time, y: Number(item.num) || 0}
    })
    const paginationConfig = {
        style: {marginBottom: 0 },
        total,
        defaultPageSize: 5, // 每页显示条数
        hideOnSinglePage: true, // 只有一页时隐藏
        onChange: onPageChange,
        current,
    }
    return (
        <Card title="加好友通过率" bordered={false} extra={
            <div>
                <RangePicker style={{width: 280}} defaultValue={[moment().subtract("days", 15), moment()]} format="YYYY-MM-DD"
                    allowClear={false} onChange={selectDate} className="mr10"
                    ranges={{
                        "今天": [moment(), moment()],
                        "昨天": [moment().days(moment().days() - 1)
                            .startOf("days"), moment().days(moment().days() - 1)
                            .endOf("days")],
                        "过去一周": [moment().days(moment().days() - 7)
                            .startOf("days"), moment().endOf(moment())],
                        "过去一个月": [moment().days(moment().days() - 30)
                            .startOf("days"), moment().endOf(moment())],
                        "过去半年": [moment().days(moment().days() - 183)
                            .startOf("days"), moment().endOf(moment())],
                    }}/>
                <Button loading={loadingfriend} onClick={executionNumber} type="primary">导出加好友数据</Button>
            </div>
        } style={{height: "100%", minHeight: "403px"}}>
            <Row>
                <Col span={24}>
                    <ChartCard
                        title={<span>加好友通过人数</span>}
                        bordered={false}
                        bodyStyle = {{padding: "0"}}
                    >
                        <NumberInfo
                            total={numeral(totalNum).format("0,0")}
                        />
                        <MiniArea
                            line
                            height={45}
                            data={visitData || []}
                        />
                    </ChartCard>
                </Col>
                {/* {data && <div className={styles.spinS}><Spin spinning={loading}></Spin></div>} */}
            </Row>
            <Table dataSource={data} loading={loading} size="small" pagination={paginationConfig} rowKey="wxid" columns={columns} simple/>
        </Card>
    )
}
export default MiniCard
