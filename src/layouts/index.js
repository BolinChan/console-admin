import React, { Component } from "react"
import { connect } from "dva"
import styles from "./index.css"
import withRouter from "umi/withRouter"
import { LocaleProvider} from "antd"
import zh_CN from "antd/lib/locale-provider/zh_CN"
import "moment/locale/zh-cn"
import Sidebar from "./components/Sidebar"
import Login from "../pages/login/page"
import "ant-design-pro/dist/ant-design-pro.css"
import { routerRedux } from "dva/router"
class Layout extends Component {
    UNSAFE_componentWillMount () {
        let exit = window.sessionStorage.getItem("exit")
        if (exit) {
            window.sessionStorage.clear()
        }
        const {location, dispatch} = this.props
        let token = window.sessionStorage.getItem("token")
        if (!token && (location.pathname !== "/" || location.pathname !== "login")) {
            dispatch(routerRedux.push({pathname: "/"}))
        }
    }
    render () {
        let Client
        let { auth, location } = this.props
        let i, user, token
        if (auth) {
            let { accountnum, id } = this.props.auth
            i = id
            user = accountnum
            token = auth.token
        }
        if (!token) {
            i = window.sessionStorage.getItem("i")
            user = window.sessionStorage.getItem("user")
            token = window.sessionStorage.getItem("token")
        }
        Client = (
            <div className={styles.normal}>
                <div className={styles.content}>
                    <div className={styles.main}>
                        {token &&
                            location.pathname !== "/login" &&
                            location.pathname !== "/"
                            ? <Sidebar {...this.props} i={i} user={user} /> : <Login />}
                    </div>
                </div>
            </div>
        )
        return (
            <span>
                <LocaleProvider locale={zh_CN}>
                    {Client}
                </LocaleProvider>
            </span>

        )
    }
}

function mapStateToProps (state) {
    const { checkDate, log, showPage, auth } = state.login
    return {
        showPage,
        checkDate,
        log,
        auth,
        loading: state.loading.models.login,
    }
}
const mapState = connect(mapStateToProps)(Layout)
export default withRouter(mapState)
