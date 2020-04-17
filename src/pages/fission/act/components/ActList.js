import { Avatar, Popover, Switch, Popconfirm, Pagination } from "antd"
import Link from "umi/link"
import styles from "./AcList.css"
function linkPath (id, type) {
    return `/fission/${type}?id=${id}`
}
const ActList = ({data, total, dispatch, pageNo, showModal, onChangeStatue, pageChange }) => {
    const deleteConfirm = (id) => {
        dispatch({
            type: "fission/posterDelete",
            payload: { id },
        })
    }
    const qrImg = "//qr.liantu.com/api.php?text=http%3a%2f%2fauth.yunbeisoft.com%2findex.php%3ffromNick%3d%26fromWxid%3d%26taskid%3d"

    const Day = (actTimeEnd, actTimeStart) => (actTimeEnd - actTimeStart) / (24 * 60 * 60)
    return (
        <div className={styles.activity}>
            {data && data.map((item, index) => (

                <div key={index} className={styles.activityItem + " f fc fj"}>
                    <div className={styles.acitivityId}>{item.id}</div>
                    <div className={styles.acitivityAva}>
                        <Avatar src={item.bg} shape="square" size={48} className="mr10" />
                        <div className="f fv">
                            <span>{item.actName}</span>
                            <span>活动关键词：{item.keyword}</span>
                        </div>
                    </div>
                    <div className={styles.acitivityAva2}>
                        <Popover content={<Avatar src={qrImg + item.id} shape="square" size={250} />} trigger="hover">
                            <Avatar src={qrImg + item.id} shape="square" size={60} />
                        </Popover>
                    </div>
                    <div className={styles.activityMainItem}>
                        <div>有效期</div>
                        <div>{Math.floor(Day(item.actTimeEnd, item.actTimeStart))}天</div>
                    </div>
                    <div className={styles.activityMainItem}>
                        <div>开始时间</div>
                        <div>{new Date(item.actTimeStart * 1000).toLocaleString()}</div>
                    </div>
                    <div className={styles.activityMainItem}>
                        <span>{item.status === "1" ? "进行中" : "已暂停"}</span>
                    </div>
                    <div className={styles.activityMainItem}>
                        <Switch checkedChildren="开启" unCheckedChildren="暂停" defaultChecked={item.status === "1"} onChange={onChangeStatue && onChangeStatue(item.id)} />
                    </div>
                    <div className={styles.activityFun + " f fw"}>
                        <Link to={linkPath(item.id, "timePeriod")}>时段统计</Link>
                        <Link to={linkPath(item.id, "qrcodeTree")}>树形图</Link>
                        <Link to={linkPath(item.id, "qrcode")}>扫码统计</Link>
                        {/* <Link to={linkPath(item.id, "getActivity")}>活动统计</Link> */}
                        <a href="javascript:;" onClick={() => showModal && showModal(item, "qr")}>设置客服</a>
                        <a href="javascript:;" onClick={() => showModal && showModal(item, "prize")}>设置奖品</a>
                        <a href="javascript:;" onClick={() => showModal && showModal(item, "poster")}>编辑</a>
                        <Popconfirm onConfirm={() => deleteConfirm(item.id)} title="确定要删除吗？" arrowPointAtCenter={true} placement="topRight">
                            <a href="javascript:;" >删除</a>
                        </Popconfirm>
                    </div>
                </div>
            ))}
            <Pagination hideOnSinglePage={true} current={pageNo} total={total} pageSize={10} className={styles.activitPage + " f f-end"} onChange={pageChange} />
        </div>
    )

}
export default ActList
