import styles from "../index.css"
import { Row, Spin} from "antd"
const config = {
    403: {
        img: "https://gw.alipayobjects.com/zos/rmsportal/wZcnGqRDyhPOEYFcZDnb.svg",
        title: "403",
        desc: "抱歉，你无权访问该页面",
    },
    404: {
        img: "https://gw.alipayobjects.com/zos/rmsportal/KpnpchXsobRgLElEozzI.svg",
        title: "404",
        desc: "抱歉，你访问的页面不存在",
    },
    500: {
        img: "https://gw.alipayobjects.com/zos/rmsportal/RVRUAYdCGeYNBWoKiIwB.svg",
        title: "500",
        desc: "抱歉，服务器出错了",
    },
}
const Exception = ({auth}) => (
    auth
        ? <Row type="flex" justify="center" align="middle" className={styles.exception}>
            <div className={styles.imgBlock}>
                <img src={config["403"].img} alt=""/>
            </div>
            <div className={styles.desc}>
                <h1>{config["403"].title}</h1>
                <div>{config["403"].desc}</div>
            </div>
        </Row>
        : <div
            style={{
                width: "100%",
                margin: "auto",
                paddingTop: 50,
                textAlign: "center",
            }}
        >
            <Spin size="large" />
        </div>
)
export default Exception

