import { Popconfirm, Pagination, Modal } from "antd"
import styles from "./components.css"
import classnames from "classnames"
const topTmp = [{ name: "全部", id: "" }, { name: "未被执行", id: 0 }, { name: "执行成功", id: 1 }, { name: "执行失败", id: 2 }]
const funTmp = [
    { name: "全部", id: "" },
    { name: "发朋友圈", id: 1071 },
    { name: "加粉", id: 1072 },
    { name: "装扮", id: 3 },
    { name: "自动通过", id: 5 },
    { name: "自动点赞", id: 1098 },
    { name: "查看朋友圈权限", id: 7 },
]
const contentImg = (datum, preview) => (
    <div className="f fv ml10">
        <p className="mb30">{datum.content}</p>
        <div className={styles.dutyImgShow + " mb30 f fw"}>
            {datum && datum.img && datum.img.map((item, index) => (
                item && <img key={index} src={item} className={styles.dutyImg} onClick={preview.bind(this, item)} alt=""/>
            ))}
        </div>
    </div>
)
const contentVideo = (datum) => (
    <div className="f fv ml10">
        <p className="mb30">{datum.content}</p>
        <div className={styles.dutyImgShow + " f fw"}>
            {datum.video && datum.video.map((item, index) => (
                item && <video key={index} src={item} className={styles.dutyVideo} controls/>
            ))}
        </div>
    </div>
)
const DutyRight = ({ status, TopChange, type, FunChange, dutyLst, dutyNum, PaginaChange, pageNo, visible, handleOk, handleCancel, previewImg, Delete, Again }) => (
    <div className=" f1">
        <div className={styles.dutyRightTop + " f fv pad10"}>
            <ul className="f fc">
                {topTmp.map((item) => (
                    <li className={classnames([{ [styles.dutyRightSel]: status === item.id }])} key={item.id} onClick={TopChange.bind(this, item.id)}>{item.name}</li>
                ))}
            </ul>
            <ul className="f fc mt10">
                {funTmp.map((item) => (
                    <li className={classnames([{ [styles.dutyRightSel]: type === item.id }])} key={item.id} onClick={FunChange.bind(this, item.id)}>{item.name}</li>
                ))}
            </ul>
        </div>
        <div className="pad10">
            <div className={styles.dutyRightmain}>
                <ul id="dutyRight">
                    {dutyLst && dutyLst.map((item) => (
                        <li key={item.id}>
                            <div className="f">
                                <span className={styles.dutyStatus}>{item.status}</span>
                                <div className={styles.dutyRightItem + " f fv"}>
                                    <span className="ml10">{item.time}</span>
                                    <span className={styles.dutyRightitle}>{item.decname}</span>
                                    <span className="mb30 ml10">执行指令:{item.devid}</span>
                                    {item.content && <span className="ml10 mb30">{item.content}</span>}
                                    {item.link && <span className="ml10 mb30">{item.link}</span>}
                                    {item.img && item.img.length && contentImg(item, handleOk)}
                                    {item.video && item.video.length && contentVideo(item)}
                                    <div className={styles.dutyFunc}>
                                        <Popconfirm title="确定要执行吗？" onConfirm={() => Again(item.id)}> <span className={styles.again}>再次执行</span></Popconfirm>
                                        <Popconfirm title="确定要删除吗？" onConfirm={() => Delete(item.id)}> <span className={styles.Del}>删除指令</span></Popconfirm>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                    {dutyLst && dutyLst.length === 0 && <li>暂无数据~</li>}
                </ul>
            </div>
        </div>

        <Pagination className="f f-end pad10" total={dutyNum} onChange={PaginaChange} current={pageNo} />
        <Modal
            visible={visible}
            footer={null}
            keyboard={true}
            maskClosable={true}
            onCancel={handleCancel}
        >
            <img src={previewImg} style={{ width: "100%" }} alt=""/>
        </Modal>
    </div>
)

export default DutyRight
