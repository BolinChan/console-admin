import { Skeleton, Card, Avatar, Row, Pagination, Badge, Col, Modal, Table } from "antd"
import styles from "../page.css"
import { Component } from "react"
import axios from "axios"
import Pay from "./Pay"

const { Meta } = Card
const url = "//wechat.yunbeisoft.com/index_test.php/home/article"
const columns = [
    { title: "用户昵称", dataIndex: "nick" },
    { title: "浏览时长(s)", dataIndex: "duration" },
    { title: "浏览时间", dataIndex: "createtime" },
    { title: "上级", dataIndex: "parent_nick" },
]
class Analysis extends Component {
    state = {
        page: 1,
        data: [],
        total: 0,
    }
    componentDidMount () {
        const id = this.props.itemList.id
        if (id && id !== "") {
            this.fetch(1, id)
        }
    }
    pageChangeHandler = (page) => {
        this.fetch(page, this.props.itemList.id)
    }
    fetch = async (page, article_id) => {
        const aid = window.sessionStorage.getItem("i")
        const token = window.sessionStorage.getItem("token")
        const data = { article_id, aid, token, page }
        await axios.post(`${url}/getBsss`, data).then(({ data: res }) => {
            const { data } = res
            if (res.error) {
                return
            }
            const showpay = res && data.length === 3 && Number(res.payment) === 0
            let payload = { data, total: Number(res.count), page }
            this.setState({ ...payload, showpay })
        })
    }
    fetchDetail = async (page, openid) => {
        this.setState({ detloading: true })
        const aid = window.sessionStorage.getItem("i")
        const token = window.sessionStorage.getItem("token")
        const data = { article_id: this.props.itemList.id, aid, token, page, openid }
        await axios.post(`${url}/getBrowse`, data).then(({ data: res }) => {
            const { data } = res
            this.setState({ detloading: false })
            if (res.error) {
                return
            }
            let payload = { detailData: data, detailTotal: Number(res.count), detailpage: page, openid }
            this.setState({ ...payload })
        })
    }
    showModal = (openid) => {
        this.setState({ visible: true })
        this.fetchDetail(1, openid)
    }
    onChance = () => {
        this.setState({ visible: false })
    }
    detailPage = (page) => {
        this.fetchDetail(page, this.state.openid)
    }
    render () {
        const { loading, handleChance, pageSize } = this.props
        const { total, page, data, visible, detailpage, detailData, detailTotal, detloading, showpay } = this.state
        const count = pageSize * (page - 1) + 1
        const paginationConfig = {
            total: detailTotal,
            pageSize,
            hideOnSinglePage: true,
            current: detailpage,
            onChange: this.detailPage,
            showTotal: () => `共 ${detailTotal} 条 `,
        }
        return (
            <div className={styles.wz}>
                <Card
                    title={"数据分析"}
                    extra={<a onClick={handleChance}>返回</a>}
                    style={{ width: "100%", zIndex: 9 }}
                    bordered={false}
                    bodyStyle={{ padding: 0 }}
                />
                <Row type="flex" className={styles.contex + " pad10"} >
                    {data && data.map((item, index) => <Col key={item.id} xs={24} lg={12} xl={8} xxl={6} className="pad10">
                        <Card
                            style={{ width: "100%" }}
                            actions={[
                                <div onClick={() => this.showModal(item.openid)} title="点击查看详情">
                                    点击次数 <span className={styles.cb}>{item.hit_count} </span>，
                                    浏览时长 <span className={styles.cb}> {item.browse_time} </span>秒
                                </div>,
                            ]}
                        >
                            <Skeleton loading={loading} avatar active>
                                <Meta
                                    avatar={<Avatar icon="user" shape="square" size={74} src={item.headImg} />}
                                    title={item.nick}
                                    description={
                                        <div>
                                            <p>浏览时间：{item.createtime}</p>
                                            <p>上级：{item.parent_nick || "无"}</p>
                                        </div>
                                    }
                                />
                            </Skeleton>
                            <Badge style={{ background: count + index > 3 ? "rgb(173, 169, 169)" : "#1890ff" }} className={styles.badg} count={count + index} overflowCount={999} />
                            <a className={styles.xq} onClick={() => this.showModal(item.openid)}>详情</a>
                        </Card>
                    </Col>)}
                    {showpay && <div style={{ width: "100%"}} className="pad20 tc"><Pay type="VIP">查看更多数据分析，请点击支付</Pay></div>}
                </Row>
                {data.length === 0 && <div className="pad20 tc">暂无浏览记录</div>}

                {!showpay && <div className={styles.fy}>
                    <Pagination showTotal={() => `共${total}条`} pageSize={pageSize} current={page} total={total} onChange={this.pageChangeHandler} hideOnSinglePage={true} />
                </div>}
                <Modal title="详细记录" visible={visible} footer={null} onCancel={this.onChance} width={640}>
                    <Table dataSource={detailData} bordered={true} size="small" pagination={paginationConfig} rowKey="id" columns={columns} simple loading={detloading} />
                </Modal>
            </div>
        )
    }
}

export default Analysis
