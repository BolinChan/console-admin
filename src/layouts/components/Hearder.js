import styles from "./Heard.css"
import EditModel from "./EditModel"
import { Icon, Badge, Modal, Timeline, Spin, Dropdown, Menu, AutoComplete, Input } from "antd"
const Hearder = ({user, modalShow, modalHide, visible, log, checkDate, exitFun, loading, dispatch, searchList, handleSel, visibleSearch, onClickSearch}) => {
    const menuName = (
        <Menu>
            <Menu.Item>
                <EditModel dispatch={dispatch}></EditModel>
            </Menu.Item>
            <Menu.Item>
                <a onClick={exitFun}>
                    <Icon type="logout" />
                        &nbsp;退出登录
                </a>
            </Menu.Item>
        </Menu>
    )
    searchList = searchList && searchList.map((item) => item.title)
    let autoStyle = {
        transition: "width .3s",
        marginLeft: "10px",
        width: visibleSearch ? 200 : 0,
        visibility: !visibleSearch && "hidden",
        background: "transparent",
        borderRadius: 0}
    return (
        <div className={styles.dot}>
            <div style={{overflow: "hidden"}}>
                {/* {!visibleSearch && <Icon type="search" className="certain-category-icon" onClick={onClickSearch}/>} */}
                <AutoComplete
                    style={autoStyle}
                    dataSource={searchList}
                    placeholder="请输入搜索内容"
                    onSelect={handleSel}
                    autoFocus={true}
                    filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                >
                    <Input suffix={<Icon type="search" className="certain-category-icon" />} />
                </AutoComplete>
            </div>
            <Dropdown overlay={menuName} placement="bottomLeft" className={styles.hoverStyle} >
                <Badge status="success" text={user}/>
            </Dropdown>
            <div className={styles.hoverStyle} onClick={modalShow}>
                <Badge dot={log && log.length > 0 && log[0].createtime > checkDate}>
                    <Icon type="bell" ></Icon>
                </Badge>
                <span style={{ marginLeft: 8, fontSize: 12 }}>更新日志</span>
            </div>
            {/* <Badge title="点击下载客服端桌面应用" style={{ backgroundColor: "#108ee9", cursor: "pointer", width: 36}} count={"EXE"}/> */}
            {/* <Tag color="#108ee9" title="点击下载客服端桌面应用"><Icon type="download" theme="outlined" />客服端EXE</Tag> */}
            {/* <Search placeholder="搜索订单号" /> */}

            <Modal
                title="更新日志"
                centered={true}
                width={700}
                bodyStyle={{ maxHeight: 700, overflow: "hidden", overflowY: "auto" }}
                footer={null}
                onCancel={modalHide}
                visible={visible}
                destroyOnClose={true}
            >
                <Timeline className={styles.upLog} id="upLog">
                    {log && log.length > 0
                        ? log.map((item) => (
                            <Timeline.Item key={item.id} color="green">
                                <div className={styles.title}>{item.createtime}</div>
                                <p>版本号：{item.version_number}</p>
                                <ol>
                                    {item.content.map((val, index) => (
                                        <li key={index}>{val}</li>
                                    ))}
                                </ol>
                            </Timeline.Item>
                        ))
                        : (
                            <Timeline.Item color="red">
                                            暂无日志
                            </Timeline.Item>
                        )}
                    {loading && <div style={{textAlign: "center"}}><Spin /></div>}
                </Timeline>
            </Modal>
        </div>
    )
}
export default Hearder
