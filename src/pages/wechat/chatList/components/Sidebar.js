import { Input, Icon, Button, Spin } from "antd"
import Contact from "./Contact"
import styles from "./BuddyChat.css"
// import SearchContact from "./SearchContact"
const { Search } = Input
const Sidebar = ({ contacts, currentContactId, handleChangeCurrent, SearchContact, devices, preFun, nextFun, isNext, isPre, totalpage, page, loading }) => (
    <div className={styles.Sidebar}>
        <div className={styles.pad15}>
            <Search placeholder="请输入联系人" onSearch={(value) => SearchContact(value)} style={{ width: "100%" }} />
        </div>
        <div className={styles.contactBox}>
            {(!contacts || contacts.length === 0) && (
                <div style={{ textAlign: "center" }}>
                    <Spin spinning={loading} />
                </div>
            )}
            {/* <Table loading={loading} dataSource={contacts} rowKey="id" pagination={false} /> */}
            {contacts &&
                contacts.map((item) => (
                    <Contact key={item.userid} {...item} currentContactId={currentContactId} onClick={() => handleChangeCurrent(item.userid, item.wxid, item.kefu_wxid)} devices={devices} />
                ))}
        </div>
        <div className={styles.pad15 + " " + styles.btGroup}>
            <Button.Group>
                <Button type={isNext ? "primary" : ""} onClick={preFun} disabled={page === 1}>
                    <Icon type="left" />
                    上一页
                </Button>
                <Button type={isPre ? "primary" : ""} onClick={nextFun} disabled={page > totalpage}>
                    下一页
                    <Icon type="right" />
                </Button>
            </Button.Group>
        </div>
    </div>
)
export default Sidebar
