
import { Modal, Form, Radio, Input, message } from "antd"
import TextAreas from "../../components/TextArea"
import UploadImg from "../../components/UploadImg"
import UploadVideo from "../../components/UploadVideo"
import styles from "../page.css"
import { hasEmoji } from "../../../utils/helper"
const FormItem = Form.Item
const RadioGroup = Radio.Group
const TextArea = Input.TextArea
const formItemLayout = {
    style: { padding: "10px" },
    labelCol: { span: 4 },
    wrapperCol: { span: 19 },
}
const imgLst = (defaultImgUrl, preView) => (
    <div className={styles.imgShow}>
        <span className={styles.showContent}>图片：</span>
        {defaultImgUrl && defaultImgUrl.length > 0 && <div style={{ display: "flex", flex: 1, flexWrap: "wrap" }}>
            {defaultImgUrl.map((item, index) => (
                <img onClick={() => preView(item)} key={index} src={item} className={styles.imgdefault} alt=""/>
            ))}
        </div>}
    </div>
)
const videoShow = (defaultVideo) => (
    <div className={styles.imgShow}>
        <span className={styles.showContent} >视频：</span>
        <video controls src={defaultVideo} style={{ maxHeight: 260 }}/>
    </div>
)
const textShow = (text) => (
    <div className={styles.imgShow} style={{marginTop: 10}}>
        <span className={styles.showContent} >内容：</span>
        <div dangerouslySetInnerHTML={{ __html: hasEmoji(text) }} />
    </div>
)


const MaterialForm = ({ preView, form, visible, op, record, dispatch, handleCancel, pathPage }) => {
    // 添加/修改 素材
    const handleAddOk = (e) => {
        e.preventDefault()
        e.stopPropagation()
        form.validateFields(async (err, values) => {
            if (!err) {
                let id = record ? record.id : ""
                let { text, media, type } = values
                if (type === "1") {
                    media = media ? media : record.media
                    let delImg = window.sessionStorage.getItem("delImg")
                    media.map((item, index) => {
                        if (item.includes(delImg)) {
                            media.splice(index, 1)
                        }
                    })
                }
                if (type !== "1") {
                    media = media.length ? [media] : record.media
                }
                if (!media) {
                    return message.error("内容不能为空")
                }
                dispatch({
                    type: "material/" + (pathPage === "my" ? "addMymaterial" : "addMaterial"),
                    payload: { op, text, media, type, id },
                })
                handleCancel && handleCancel()
            }
        })
    }
    const { getFieldDecorator, getFieldValue } = form
    const aid = window.sessionStorage.getItem("i")
    const isVisibal = pathPage === "commom" ? aid === "3" : true
    const value = op === "see" && { footer: null }
    const media = record && record.media
    const type = record && record.type
    // let defaultVideo = record && record.type === "2" && record.media
    return (
        <Modal
            destroyOnClose={true}
            {...value}
            width="646px"
            title={op === "create" ? "添加素材" : "查看素材"}
            visible={visible}
            onOk={handleAddOk}
            onCancel={handleCancel}
            bodyStyle={{ maxHeight: 700, overflow: "hidden", overflowY: "auto" }}>
            <Form>
                {op !== "see" && <div>
                    <FormItem {...formItemLayout} label="分享内容" style={{ margin: 0 }}>
                        {getFieldDecorator("type", { initialValue: record ? record.type : "1" })(
                            <RadioGroup disabled={!isVisibal}>
                                <Radio value="1">图文</Radio>
                                <Radio value="2">视频</Radio>
                                <Radio value="3">链接</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    {getFieldValue("type") === "1" && (
                        <FormItem label=" " {...formItemLayout} colon={false}>{getFieldDecorator("media")(
                            <UploadImg defaultImgUrl={media} uploadMaxNum={9} isVisibal={!isVisibal} />)}
                        </FormItem>)}
                    { getFieldValue("type") === "2" && (
                        <FormItem {...formItemLayout} label=" " colon={false}>
                            {getFieldDecorator("media")(<UploadVideo defaultVideo={media} />)}
                        </FormItem>
                    )}
                    { getFieldValue("type") === "3" && (
                        <FormItem {...formItemLayout} label=" " colon={false}>
                            {getFieldDecorator("media")(<TextArea />)}
                        </FormItem>
                    )}
                    { <FormItem label="分享文案" {...formItemLayout}>{getFieldDecorator("text", { initialValue: (record && record.text) || "" })(<TextAreas isRandom={true} />)}</FormItem>}
                </div>}
                {op === "see" && <div>
                    {type === "1" && imgLst(media, preView)}
                    {type === "2" && videoShow(media)}
                    {record && record.text && textShow(record && record.text)}
                </div>}
            </Form>
        </Modal>
    )
}
const MaterialManageForm = Form.create()(MaterialForm)
export default MaterialManageForm
