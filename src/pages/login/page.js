import { Form, Icon, Input, Button, Divider, message } from "antd"
import { Component } from "react"
import { connect } from "dva"
import topbg from "../../assets/topbg.png"
import logoLarge from "../../assets/logoLarge.png"
import styles from "./page.css"
const FormItem = Form.Item

class Login extends Component {
    state = {
        isprimary: true,
    }
    componentDidMount () {
        const msg = window.sessionStorage.getItem("msg")
        if (msg) {
            message.error(msg)
            window.sessionStorage.clear()
        }
    }
    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (this.state.isprimary) {
                    this.props.dispatch({
                        type: "login/loginPrimary",
                        payload: { ...values },
                    })
                }
            }
        })
    }

    switchFun = () => {
        this.setState({ isprimary: true })
    }
    render () {
        // const { showPage } = this.props
        const { getFieldDecorator } = this.props.form
        return (
            <div className={styles.loginPage}>
                <div className={styles.loginBox}>
                    <div className={styles.goCustom}>
                        <a href="//user.scrm.la" target={"_blank"}>客服端登录>></a>
                    </div>
                    <div className={styles.shw}></div>
                    <div className={styles.topBox}>
                        <img src={topbg} style={{width: "100%"}} alt=""/>
                        <img src={logoLarge} className={styles.imgLogo} alt=""/>
                    </div>
                    <Divider style={{color: "#233a5a", fontSize: 22, margin: 0, padding: 24, letterSpacing: 1}} className={styles.LTitle}>管理员登录</Divider>
                    <Form onSubmit={this.handleSubmit} className={styles.loginForm}>
                        <FormItem>
                            {getFieldDecorator("accountnum", {
                                rules: [{ required: true, message: "请输入账号!" }],
                            })(<Input autoComplete="off" prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />} placeholder="账号" />)}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator("password", {
                                rules: [{ required: true, message: "请输入密码!" }],
                            })(<Input prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />} type="password" placeholder="密码" />)}
                        </FormItem>
                        <FormItem style={{margin: 0}}>
                            <Button type="primary" htmlType="submit" loading={this.props.loading} className={styles.loginButton}>
                                登录
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}

const LoginForm = Form.create()(Login)
function mapStateToProps (state) {
    const { operationList, showPage } = state.login
    return {
        showPage,
        operationList,
        loading: state.loading.models.login,
    }
}
export default connect(mapStateToProps)(LoginForm)
