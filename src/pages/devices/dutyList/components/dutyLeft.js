import { Select } from "antd"
import styles from "./components.css"
import classnames from "classnames"

const Option = Select.Option
const aid = window.sessionStorage.getItem("i")
const DutyLeft = ({ devices, devid, DeviceChange, accountLst, AccountChange }) => (
    <div>
        <div className="fc f pad10">
            <span className="mr10" style={{ width: "80px" }}>选择子账号</span>
            <Select defaultValue="当前账号" style={{ width: 160 }} onChange={AccountChange}>
                <Option value={aid} >当前账号</Option>
                {accountLst && accountLst.map((item) => (
                    <Option value={item.id} key={item.id}>{item.nickname}</Option>
                ))}
            </Select>
        </div>
        <div className="pad10">
            <p className={styles.dutyLeftTitle}>设备列表</p>
            <div className={styles.dutyLeft}>
                <ul>
                    {devices && devices.length === 0
                        ? <li className={styles.dutyLeftItem}>没有数据~</li>
                        : <li className={styles.dutyLeftItem + " " + classnames([{ [styles.dutyLeftSel]: devid === "" }])} onClick={DeviceChange.bind(this, "")}>全部设备 </li>}
                    {devices && devices.map((item) => (
                        <li
                            className={styles.dutyLeftItem + " " + classnames([{ [styles.dutyLeftSel]: devid === item.deviceid }])}
                            key={item.id}
                            onClick={DeviceChange.bind(this, item.deviceid)}>
                            {item.devicename}
                        </li>
                    ))}
                </ul>
            </div>
        </div>

    </div>
)

export default DutyLeft
