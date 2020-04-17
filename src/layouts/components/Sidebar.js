import { Component } from "react"
import { Layout, Menu, Icon } from "antd"
import { connect } from "dva"
import Link from "umi/link"
import { testSubstr } from "../../utils/helper"
import styles from "./Heard.css"
import {menuBar} from "./menuList"
import withRouter from "umi/withRouter"
import HearderTop from "./Hearder"
import Exception403 from "./403"
import logoLarge from "../../assets/logoLarge.png"
import logoSmall from "../../assets/logoSmall.png"
let menuList = []
let searchList = []
const { Header, Content, Sider } = Layout
const SubMenu = Menu.SubMenu
const IconFont = Icon.createFromIconfontCN({
    scriptUrl: "//at.alicdn.com/t/font_862846_n5z7etfduo.js",
})
// const getMenuMatches = (flatMenuKeys, path) => flatMenuKeys.filter((item) => item.pathname && pathToRegexp(item.pathname).test(path))
// function urlToList (url) {
//     const urllist = url.split("/").filter((i) => i)
//     return urllist.map((urlItem, index) => `/${urllist.slice(0, index + 1).join("/")}`)
// }
const getFlatMenuChildren = (menus) => {
    let keys = []
    menus.forEach((item) => {
        if (item.childrenNav) {
            keys = keys.concat(getFlatMenuChildren(item.childrenNav))
            return
        }
        keys.push(item)
    })
    return keys
}
class Sidebar extends Component {
    state = {
        collapsed: false,
        page: 1,
    }
    UNSAFE_componentWillMount () {
        if (this.props.auth) {
            menuList = menuBar(this.props.auth)
            this.MenuDisplay()
        }
        !this.props.auth && this.Verification()
    }
    componentDidMount () {
        window.addEventListener("resize", this.resize)
    }
    componentWillUnmount () {
        window.removeEventListener("resize", this.resize)
    }
    getFlatMenuKeys (pathname) {
        let keys = []
        menuList.forEach((item) => {
            if (item.childrenNav) {
                let list = item.childrenNav.find((mess) => mess.pathname === pathname)
                list && (keys = [item.key, list.key])
            }
            if (!item.childrenNav && item.pathname === pathname) {
                keys.push(item.key)
            }
        })
        return keys
    }
    getSelectedMenuKeys = () => {
        let {location: { pathname }} = this.props
        return this.getFlatMenuKeys(pathname)
        // return urlToList(pathname).map((itemPath) => getMenuMatches(this.getFlatMenuKeys(menuList), itemPath).pop())
    }
    Verification=async () => {
        let data = await this.props.dispatch({ type: "login/isToken" })
        menuList = menuBar(data)
        this.MenuDisplay()
    }
    MenuDisplay=() => {
        let {selectedKeys, openKeys} = this.state
        searchList = menuList && getFlatMenuChildren(menuList)
        if (!selectedKeys) {
            selectedKeys = this.getSelectedMenuKeys()
            selectedKeys[0] === undefined && selectedKeys.length === 1 && (selectedKeys[0] = "home")
            openKeys = [selectedKeys[0]]
        }
        this.setState({selectedKeys, openKeys})
    }
    resize = (e) => {
        const collapsed = document.body.offsetWidth < 1100
        const {openKeys} = this.state
        this.setState({ collapsed, openKeys: collapsed ? [] : openKeys})
    }
    toggle = () => {
        const {openKeys} = this.state
        const collapsed = !this.state.collapsed
        this.setState({
            collapsed,
            openKeys: collapsed ? [] : openKeys,
        })
    }
    exitFun = () => {
        window.location.href = ""
        window.sessionStorage.setItem("exit", true)
        this.props.dispatch({
            type: "login/exit",
            payload: { accountnum: this.props.user },
        })
    }
    modalShow = () => {
        this.setState({ visible: true })
        this.props.dispatch({ type: "login/checkLog" })
        setTimeout(() => {
            document.getElementsByClassName("ant-modal-body")[0].addEventListener("scroll", this.upLogFun)
        }, 1000)
    }
    upLogFun = () => {
        const { dispatch, loading, log } = this.props
        let { page, lastTime } = this.state
        const clientHeight = event.target.clientHeight
        const scrollHeight = event.target.scrollHeight
        const scrollTop = event.target.scrollTop
        let isNew = lastTime !== log[log.length - 1].createtime
        if (clientHeight + scrollTop === scrollHeight && !loading && isNew) {
            ++page
            dispatch({ type: "login/fetchLog", payload: { page } })
            this.setState({ page, lastTime: log[log.length - 1].createtime })
        }
    }
    modalHide = () => {
        this.setState({ visible: false })
    }
    // menuItemClick (menu) {
    //     if (menu && menu.key.includes("client")) {
    //         window.location.href = "https://codeload.github.com/douban/douban-client/legacy.zip/master"
    //     }
    // }
    onOpenChange=(list) => {
        this.setState({openKeys: [list[list.length - 1]]})
    }
    onSelect = (value) => {
        this.setState({selectedKeys: value.selectedKeys})
    }
    // 搜索侧边栏菜单
    handleSel=(value) => {
        menuList.map((item) => {
            if (item.title === value) {
                this.setState({selectedKeys: [item.key]})
                window.location.href = `#${item.pathname}`
            }
            if (item.childrenNav) {
                item.childrenNav.map((mess) => {
                    if (mess.title === value) {
                        this.setState({selectedKeys: [mess.key], openKeys: [item.key]})
                        window.location.href = `#${mess.pathname}`
                    }
                })
            }
        })
    }
    onClickSearch=() => {
        this.setState({visibleSearch: !this.state.visibleSearch})
    }
    render () {
        let {openKeys, collapsed, selectedKeys, visibleSearch, disJurisdict} = this.state
        const {location, children, auth} = this.props
        if (location.pathname && searchList) {
            if (!searchList.find((item) => item.pathname === location.pathname)) {
                disJurisdict = true
                selectedKeys = []
            }
            if (testSubstr(location.pathname, "/fission") && searchList.find((item) => item.key === "act")) {
                disJurisdict = false
            }
        }
        return (
            <Layout className={styles.LayoutStyle}>
                <Sider trigger={null} className={styles.siderStyle} collapsible collapsed={collapsed} >
                    <div className={styles.logo}>
                        {!collapsed && <img src={logoLarge} alt="" />}
                        {collapsed && <img src={logoSmall} alt="" style={{ width: "40px" }} />}
                    </div>
                    <Menu
                        className={styles.menuStyle}
                        theme="dark"
                        defaultSelectedKeys={selectedKeys}
                        selectedKeys={selectedKeys}
                        onSelect={this.onSelect}
                        onOpenChange={this.onOpenChange}
                        openKeys={openKeys}
                        mode="inline">
                        {menuList.map((item) => {
                            if (item.childrenNav) {
                                return (
                                    <SubMenu
                                        key={item.key}
                                        title={
                                            <span>
                                                {item.i && <IconFont type={item.i} style={{ fontSize: "18px" }} />}
                                                <span>{item.title}</span>
                                            </span>
                                        }
                                    >
                                        {item.childrenNav.map((mess) =>
                                            (
                                                <Menu.Item key={mess.key}>
                                                    <Link to={mess.pathname}>
                                                        <span>{mess.title}</span>
                                                    </Link>
                                                </Menu.Item>
                                            )
                                        )}
                                    </SubMenu>
                                )
                            } else {
                                return (
                                    <Menu.Item key={item.key}>
                                        <Link to={item.pathname}>
                                            {item.i && <IconFont type={item.i} style={{ fontSize: "18px" }} />}
                                            <span>{item.title}</span>
                                        </Link>
                                    </Menu.Item>
                                )
                            }
                        })}
                    </Menu>
                </Sider>
                <Layout className={styles.RightStyle}>
                    <Header className={styles.heardStyle}>
                        <div>
                            <Icon
                                className={styles.trigger}
                                type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
                                onClick={this.toggle}
                            />
                        </div>
                        <HearderTop
                            {...this.props}
                            searchList={searchList}
                            count={this.state.count}
                            modalShow={this.modalShow}
                            visible={this.state.visible}
                            modalHide={this.modalHide}
                            exitFun={this.exitFun}
                            handleSel={this.handleSel}
                            onSelect={this.handleSel}
                            onClickSearch={this.onClickSearch}
                            visibleSearch={visibleSearch}
                        />
                    </Header>
                    <Content className={styles.ContentStyles} id="cont">
                        <div className={styles.childrenStyle}>
                            {disJurisdict ? <Exception403 auth={auth}/> : children}
                        </div>
                    </Content>
                </Layout>
            </Layout>
        )
    }
}
export default withRouter(connect()(Sidebar))
