import { Input, Icon } from "antd"
import Contact from "./Contact"
import styles from "./BuddyChat.css"
const GroupUser = ({ contacts, currentContactId, handleChangeCurrent, devices }) => (
    <div className={styles.Sidebar}>
        <div className={styles.pad15}>
            <div style={{ paddingBottom: "10px" }}>群成员（50人）</div>
            <Input
                // className={classNames([{ [styles.inputStyle]: !atInput }, { [styles.atInput]: atInput }])}
                prefix={<Icon type="search" style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="请输入成员信息"
                // onFocus={this.handleFocus}
                // onBlur={this.handleBlur}
                // onPressEnter={this.handleSearch}
                // onChange={this.realtimeSearch}
                autoComplete="off"
            />
        </div>
        <div className={styles.contactBox}>
            {contacts && contacts.map((item) => <Contact key={item.userid} {...item} currentContactId={currentContactId} onClick={() => handleChangeCurrent(item.userid)} devices={devices} />)}
        </div>
    </div>
)
export default GroupUser
