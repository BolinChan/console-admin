import { Card, Tooltip} from "antd"
import ParmentForm from "./ParmentForm"
// import {Input} from "antd"
// const {TextArea} = Input
const Content = ({list, dispatch}) => (
    <Card
        title={(list.name || "未选择部门")}
        extra={<ParmentForm action="editdepartment" record={list} dispatch={dispatch}>
            { list.name ? <a >编辑</a> : <Tooltip placement="top" title="未选择部门">
                <a>编辑</a>
            </Tooltip>
            }
        </ParmentForm>}
        style={{ boxShadow: "0 2px 8px rgba(0, 21, 41, 0.08)", height: "25%"}}
        // bodyStyle={{border: "0"}}
    >
        <div>{list.desc || "部门描述"}</div>
        {/* <TextArea autosize={{ minRows: 6 }} /> */}
    </Card>
)
export default Content
