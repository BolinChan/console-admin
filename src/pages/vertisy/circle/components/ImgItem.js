import { Tooltip, Button} from "antd"
import styles from "../../../material/page.css"
import { hasEmoji } from "../../../../utils/helper"
const content = (item) => (
    <div>
        {item.media && item.media.map((mess, index) => (
            <span key={index}>
                {item.type === "1" && <img src={mess} style={{maxHeight: 150}} alt=""/>}
                {item.type === "2" && <video src={mess} controls="controls" style={{maxHeight: 150}}/>}
            </span>
        ))}
        <div dangerouslySetInnerHTML={{ __html: hasEmoji(item.text) }} />
    </div>
)
const ImgItem = ({data, selectMaterial}) => (
    <section>
        {data && data.map((item) => (
            <div key={item.id} id="itemImg" className={styles.imgItem} style={{height: 301}}>
                {item.type === "1" && item.media.length ? <img src={item.media && item.media[0]} alt=""/> : ""}

                {item.type === "2" && item.media.length ? <video controls="controls" src={item.media[0]} /> : ""}

                {item.type === "3" && <div className={styles.videoShow} style={{ padding: 20 }}>
                    <p>分享的链接：</p>
                    <a style={{ wordBreak: "break-all"}} href={item.media && item.media[0]} target="_blank" rel="noopener noreferrer" title="点击查看详情">{item.media && item.media[0]}</a>
                </div>}

                {item.media.length === 0 ? <img src="//qn.fuwuhao.cc/20181029160620701595bd6bf7c27d17.png" alt=""/> : ""}

                <span className={styles.favo} style={{top: -5, right: 0}}><Button type="primary" size="small" onClick={() => selectMaterial && selectMaterial(item)}>选择素材</Button></span>
                <div className={styles.stats} style={{height: 50}}>
                    <Tooltip placement="top" title={() => content(item)} overlayStyle={{ maxWidth: 500 }}>
                        <div className={styles.text} dangerouslySetInnerHTML={{ __html: hasEmoji(item.text) }} />
                    </Tooltip>
                    {/* <Tooltip title={() => content(item)} overlayStyle={{maxWidth: 500, background: "rgba(0,0,0,0.5)"}}>
                        <div className={styles.text} >{item.text}</div>
                    </Tooltip> */}
                </div>

            </div>
        ))}
    </section>
)
export default ImgItem
