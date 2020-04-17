import Form from "./Form"
import styles from "../page.css"
import { Component } from "react"
import ShareVertisy from "../../vertisy/circle/page"
import { Select, Button, Popconfirm, Icon, Modal, Tooltip, Spin, message } from "antd"
import {CopyToClipboard} from "react-copy-to-clipboard"
import { hasEmoji } from "../../../utils/helper"
const { Option } = Select
class CommonPage extends Component {
    state = { visible: false, wxIds: [], previewShow: false, previewImg: "" }
    deleteConfirm = (id) => {
        this.props.dispatch({
            type: "material/" + (this.props.pathPage === "my" ? "delMymaterial" : "delMaterial"),
            payload: { id },
        })
    }
    showDetail = (op, record) => () => {
        this.setState({ op, visible: true, record })
    }
    handleCancel = () => {
        this.setState({ visible: false, shareVisible: false })
    }
    editSend = (selecItem) => {
        this.setState({ shareVisible: true, selecItem })
    }
    selWeChat = (wxIds) => {
        this.setState({ wxIds })
    }
    handleChange = (e) => {
        if (Number(e) === 0) {
            e = ""
        }
        this.props.dispatch({
            type: "material/fetchMyMaterial",
            payload: { type: e },
        })
    }
    preView = (src) => {
        this.setState({ previewImg: src, previewShow: true })
    }
    preHidden = () => {
        this.setState({ previewImg: "", previewShow: false })
    }
    onCopy=(item) => {
        if (item.type === "1") {
            return message.success("已成功复制第一张图片链接")
        } else {
            return message.success("已成功复制链接")
        }
    }
    render () {
        let { material, dispatch, loading, weChatList, pathPage, isVisibal, selectMaterial, pyq } = this.props
        const { shareVisible, selecItem, previewShow, previewImg } = this.state
        if (weChatList) {
            weChatList = weChatList.filter((item) => item.isoff === "1")
        }
        let selOptions = pathPage === "my" ? (
            <div>
                <Select defaultValue="素材类型" style={{ width: 200, height: "32px", margin: 6 }} onChange={this.handleChange}>
                    <Option value="0">全部素材</Option>
                    <Option value="1">图文素材素材</Option>
                    <Option value="2">视频素材</Option>
                    <Option value="3">链接素材</Option>
                </Select>
            </div>
        ) : ""
        return (
            <div>
                {(isVisibal || pathPage === "my") && <div className={styles.topSel + " f"}>
                    <Button type="primary" onClick={this.showDetail("create")} style={{ margin: 6 }}>添加素材</Button>
                    {selOptions}
                </div>}
                <Spin spinning={loading}>
                    <section>
                        {material && material.map((item) => (
                            <div key={item.id} id="itemImg" className={styles.imgItem} style={{paddingBottom: pyq ? "52px" : "86px"}}>
                                {item.type === "1" && <img src={item.media && item.media[0]} onClick={this.showDetail("see", item)} alt=""/>}

                                {item.type === "2" && <div className={styles.videoShow} onClick={this.showDetail("see", item)}>
                                    <Icon type="video-camera" className={styles.videoIcon} />
                                </div>}

                                {item.type === "3" && <div className={styles.videoShow} style={{ padding: 20 }}>
                                    <p>分享的链接：</p>
                                    <a style={{ wordBreak: "break-all"}} href={item.media && item.media[0]} target="_blank" rel="noopener noreferrer" title="点击查看详情">{item.media && item.media[0]}</a>
                                </div>}

                                {/* {item.media && item.media.length <= 0 && <img src="//qn.fuwuhao.cc/20181029160620701595bd6bf7c27d17.png" onClick={this.showDetail("see", item)} alt=""/>} */}

                                {pyq && <span className={styles.favo} style={{top: -5, right: 0}}>
                                    <Button type="primary" size="small" onClick={() => selectMaterial && selectMaterial(item)}>选择素材</Button>
                                </span>}

                                <div className={styles.stats} >
                                    <Tooltip placement="top" title={(<div dangerouslySetInnerHTML={{ __html: hasEmoji(item.text) }} />)} overlayStyle={{ maxWidth: 300 }}>
                                        <div className={styles.text} dangerouslySetInnerHTML={{ __html: hasEmoji(item.text) }} />
                                    </Tooltip>

                                    {!pyq && <div className={styles.icons}>
                                        <CopyToClipboard text={item.media && item.media[0]}>
                                            <Button shape="circle" className="mar5" title="复制图片/视频" onClick={() => this.onCopy(item)}>
                                                <Icon type="copy" />
                                            </Button>
                                        </CopyToClipboard>
                                        <Button shape="circle" className="mar5" title="分享素材到朋友圈" onClick={() => this.editSend(item)}>
                                            <Icon type="share-alt" />
                                        </Button>
                                        {(isVisibal || pathPage === "my") && <span>
                                            <Button shape="circle" title="编辑素材" onClick={this.showDetail("edit", item)} className="mar5">
                                                <Icon type="form" />
                                            </Button>
                                            <Popconfirm className={styles.delIcon} title="确定要删除吗？" onConfirm={() => this.deleteConfirm(item.id)}>
                                                <Button shape="circle" type="danger" className="mar5"><Icon title="删除素材" type="delete"/></Button>
                                            </Popconfirm>
                                        </span>}
                                    </div>}
                                </div>
                            </div>
                        ))}
                        {material.length === 0 ? <div>暂无数据~</div> : ""}
                    </section>
                </Spin>
                <Form preView={this.preView} {...this.state} dispatch={dispatch} handleCancel={this.handleCancel} pathPage={pathPage}/>
                <Modal
                    width={800}
                    title="分享素材"
                    wrapClassName="wrapClass"
                    style={{ height: "80%" }}
                    bodyStyle={{ height: "calc(100% - 55px)", overflowY: "auto", padding: 0 }}
                    visible={shareVisible}
                    footer={null}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                >
                    <ShareVertisy share={true} sharelist={selecItem}></ShareVertisy>
                </Modal>
                <Modal
                    visible={previewShow}
                    footer={null}
                    destroyOnClose={true}
                    keyboard={true}
                    onCancel={this.preHidden}
                    closable={false}
                >
                    <img src={previewImg} style={{ width: "100%" }} onClick={this.preHidden} alt=""/>
                </Modal>
            </div>
        )
    }
}

export default CommonPage
