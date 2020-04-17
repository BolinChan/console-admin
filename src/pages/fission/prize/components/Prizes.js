import { List, Popconfirm } from "antd"
import styles from "../../act/components/AcList.css"
const Prizes = ({ data, deleteConfirm, total, loading, showModal, pageChangeHandler, current}) => {
    const pagination = {
        style: { marginTop: -4, marginBottom: 20 },
        hideOnSinglePage: true,
        pageSize: 10,
        total,
        onChange: pageChangeHandler, // 点击分页
        current: current,
    }
    return (
        <div>
            {/* <Button icon="plus" type="dashed" style={{ marginBottom: 8, width: "100%" }}>添加</Button> */}
            <List
                loading={loading}
                dataSource={data}
                renderItem={(item) => (
                    <List.Item
                        actions={[<a href="javascript:;" onClick={() => showModal && showModal(item, "qr")}>编辑</a>,
                            <Popconfirm title="确定要删除吗？" arrowPointAtCenter={true} placement="topRight" onConfirm={() => deleteConfirm(item.id)}><a href="javascript:;">删除</a></Popconfirm >]}
                    >
                        <List.Item.Meta
                            // avatar={<Avatar src="https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png" shape="square" size={48} />}
                            title={item.name}
                            description={item.type === "2" ? "兑换码" : "自定义链接"}
                        />
                        <div className={styles.listContent}>
                            {/* <div className={styles.listItem}>
                                <span>完成人数：100</span>
                            </div> */}
                            <div className={styles.listItem}>
                                <span>库存：{item.stock_num || 0}</span>
                                {/* <Progress percent={30} style={{ width: 180 }} status="active" /> */}
                            </div>
                        </div>
                    </List.Item>
                )}
                pagination={pagination}
            >
            </List>
        </div>
    )
}

export default Prizes
