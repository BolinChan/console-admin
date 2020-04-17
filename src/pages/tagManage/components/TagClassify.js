import { Icon, Popconfirm } from "antd"
import styles from "./TagClassify.css"
import classNames from "classnames"

const TagClassify = ({ item, editGroup, delGroup, current, selectGroup, index }) => (
    <div className={classNames([[styles.group], { [styles.current]: item.id === current }])} onClick={() => selectGroup(item.id, item.tagg_fenzu_name)}>
        <div className={styles.txt}>{item.tagg_fenzu_name}</div>
        {!(item.id === "32" && item.tagg_fenzu_name === "未分组") && <div className={styles.btns}>
            <Icon type="form" title="编辑" onClick={() => editGroup(item)} style={{ marginRight: "16px" }} />
            <Popconfirm title="确定要删除吗？" onConfirm={() => delGroup(item.id, index)}>
                <Icon type="delete" title="删除" />
            </Popconfirm>
        </div>}
    </div>
)
export default TagClassify
