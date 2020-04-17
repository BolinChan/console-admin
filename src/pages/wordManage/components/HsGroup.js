import styles from "./HsGroup.css"
import classNames from "classnames"
import { Icon, Popconfirm } from "antd"
const HsGroup = ({ hsGroup, onChangeGroup, current, editGroup, delGroup, sortChange }) => (
    <div ref={sortChange} style={{width: "255px"}} title="可拖动排序">
        {hsGroup && hsGroup.map((item, index) => (
            <div className={classNames([[styles.group], { [styles.current]: item.groupId === current }, { [styles.option]: item.groupId !== current }])}
                onClick={onChangeGroup(item.groupId)} key={index} id={item.groupId}
            >
                <span className={styles.itemName}>{item.name}</span>
                <span className={styles.btns}>
                    <Icon type="form" title="编辑" onClick={editGroup(item)} style={{ marginRight: "16px", cursor: "pointer" }} />
                    <Popconfirm title="确定要删除吗？" onConfirm={(e) => delGroup(e, item.groupId)}>
                        <Icon type="delete" title="删除" style={{ cursor: "pointer" }} />
                    </Popconfirm>
                </span>
            </div>
        ))}
    </div>


)
export default HsGroup
