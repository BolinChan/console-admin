import { Skeleton, Card, Icon, Avatar, Row, Popconfirm, Pagination, Popover, Col, Badge, Spin } from "antd"
import QRCode from "qrcode.react"
import styles from "../page.css"
const { Meta } = Card

const Record = ({pageSize, onCollection, articledata, total, showEditor, deleteConfirm, loading, pageChangeHandler, current, showAnalysis, type, moren }) => {
    const action = (item) => {
        let data = [
            <a onClick={() => showAnalysis(item)}> <Icon type="area-chart" /> 数据分析</a>,
            <Popover
                content={
                    <div style={{ textAlign: "center" }}>
                        <span>打开微信“扫一扫”，打开网页后</span>
                        <p style={{ marginBottom: 16 }}>点击屏幕右上角分享按钮</p>
                        <QRCode
                            value={`http://wechat.yunbeisoft.com/index_test.php/home/share/getOne?id=${item.id}`}
                        />
                    </div>
                }
            >
                <a><Icon type="share-alt" /> 分享</a>
            </Popover>,
            <a onClick={() => showEditor(item.id)}><Icon type="edit" /> 编辑</a>,
            <Popconfirm title="确定要删除吗?" onConfirm={() => deleteConfirm && deleteConfirm(item.id)}>
                <a><Icon type="delete" /> 删除</a>
            </Popconfirm>,
        ]
        if (!Number(type)) {
            data = [
                <a onClick={() => showEditor(item.id, true)}><Icon type="eye" /> 查看</a>,
                <a onClick={() => onCollection(item.id, item)} style={{color: item.color}}><Icon type="copy" /> 拷贝</a>]
        }
        return data
    }
    return (
        <Row type="flex">
            {articledata.length === 0 && <div style={{width: "100%", paddingTop: 30}} className="pad20 tc">
                { loading ? <Spin size="large" spinning={loading}/> : "暂无分享数据"}
            </div>}
            {articledata && articledata.map((item) => <Col xs={24} lg={12} xl={8} xxl={6} key={item.id} className="pad10">
                <Card
                    style={{ width: "100%" }}
                    actions={action(item)}
                >
                    <Skeleton loading={loading} avatar active>
                        <Meta
                            avatar={<Avatar shape="square" size={74} src={item.pic} />}
                            title={item.title}
                            description={
                                <div>
                                    {!Number(type)
                                        ? <p className="textover">创建人：{item.zizccount || "未知"}</p>
                                        : <p title={item.remark} className="textover">备注：{item.remark || "无"}</p>
                                    }
                                    <p>创建时间：{item.createtime}</p>
                                </div>
                            }
                        />
                    </Skeleton>
                    {item.type === "1" && type !== "0" && !moren &&
                    <Badge style={{ background: "#1890ff" }} className={styles.badg} count="共享"/>}
                    {type !== "0" && <div className={styles.artviwe}>
                    浏览人数 <span className={styles.cb}>{item.number} </span>，浏览次数 <span className={styles.cb}> {item.views} </span>
                    </div>}
                </Card>
            </Col>)}
            <div className={styles.fy}>
                <Pagination
                    showTotal={() => `共 ${total} 条`}
                    pageSize={pageSize}
                    current={current}
                    total={total}
                    onChange={pageChangeHandler}
                    hideOnSinglePage={true}
                />
            </div>
        </Row>
    )
}

export default Record
