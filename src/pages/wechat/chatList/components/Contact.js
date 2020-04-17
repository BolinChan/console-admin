import { Avatar, Badge } from "antd"
import classNames from "classnames"
import styles from "./Contact.css"
const Contact = ({ wxid, userid, headImg, remark, conremark, nick, unread, onClick, currentContactId }) => (
    <div className={classNames([[styles.box], [styles.item], { [styles.current]: currentContactId === userid }])} onClick={onClick}>
        <div className={classNames([[styles.avatar], [styles.box]])}>
            <Badge count={unread}>
                <Avatar size="large" src={headImg || "https://jutaobao.oss-cn-shenzhen.aliyuncs.com/no-head.png"} />
            </Badge>
        </div>

        <div className={classNames([[styles.content], [styles.box]])}>
            <div className={styles.title}>
                <div title={nick || remark || conremark || wxid} className={styles.name}>
                    {nick || remark || conremark || wxid}
                </div>
                {/* <div title={devicename}>（{deviceid}）</div> */}
            </div>
        </div>
    </div>
)

export default Contact
