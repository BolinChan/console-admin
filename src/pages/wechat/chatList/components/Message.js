import React from "react"
import { Avatar, Modal, message } from "antd"
import classNames from "classnames"
import styles from "./Message.css"
import moment from "moment"

const paddingStyle = {
    padding: "0",
}
class Message extends React.Component {
    state = {
        previewVisible: false,
        previewImage: "",
        number: "",
        visible: false,
    }
    componentDidMount () {
        document.body.addEventListener("click", this.Listener)
    }
    componentWillUnmount () {
        document.body.removeEventListener("click", this.Listener)
    }
    Listener = () => {
        this.setState({ visible: false })
    }
    handleCancel = () => this.setState({ previewVisible: false })
    handlePreview = (url) => () => {
        let ImgObj = new Image() // 判断图片是否存在
        ImgObj.src = url
        // 设置图片适应
        let height = ImgObj.height * 0.8 + 48
        let width = ImgObj.width * 0.8 + 48
        this.setState({ imgStyles: { height, width } })

        if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
            this.setState({
                previewImage: url,
                previewVisible: true,
                Status: false,
            })
        } else {
            message.config({
                duration: 1,
            })
            message.error("图片错误")
            return false
        }
    }
    uncloseModal = (e) => {
        e.stopPropagation()
        this.setState({ previewVisible: true })
    }
    render () {
        const { mine = false, headimg, type, img, url, content, addtime } = this.props
        const { previewVisible, previewImage, imgStyles } = this.state
        return (
            <div className={classNames(styles.message, { [styles.mine]: mine })}>
                <div className={styles.avatar}>
                    <Avatar size="default" src={headimg} />
                </div>
                <span className={type === "2" || type === "3" ? null : styles.triangle} />
                <div className={type === "2" || type === "3" ? styles.imageBox : styles.article}>
                    {(type === "1" || type === "5") && <span className={styles.expressText} dangerouslySetInnerHTML={{ __html: content }} />}
                    {type === "2" && <img src={url} style={{ maxWidth: "150px" }} onClick={this.handlePreview(url)} alt="" />}
                    {type === "3" && (
                        <img
                            src={`https://wechatqunkong.oss-cn-hangzhou.aliyuncs.com/${img || url}`}
                            // width={150}
                            style={{ maxWidth: "150px" }}
                            onClick={this.handlePreview(`https://wechatqunkong.oss-cn-hangzhou.aliyuncs.com/${img || url}`)}
                            alt=""
                        />
                    )}
                </div>
                <div className={styles.timeStyle}>{moment(new Date(addtime * 1000)).format("YYYY-MM-DD HH:mm:ss")}</div>
                <div onClick={this.handleCancel}>
                    <Modal
                        width="auto"
                        style={imgStyles}
                        wrapClassName={styles.modalCenter}
                        bodyStyle={paddingStyle}
                        visible={previewVisible}
                        footer={null}
                        onCancel={this.handleCancel}
                        className={styles.toaseImage}
                        destroyOnClose={true}
                    >
                        <img style={imgStyles} alt="example" src={previewImage} onClick={(e) => this.uncloseModal(e)} />
                        {/* <div className={styles.actionImage}>999</div> */}
                    </Modal>
                </div>
            </div>
        )
    }
}

export default Message
