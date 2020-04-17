import { Tree, Icon, Card, Row, Popconfirm, Button} from "antd"
import ParmentForm from "./ParmentForm"
import styles from "../page.css"
const {TreeNode, DirectoryTree} = Tree
// const menu = (
//     <Menu>
//         <Menu.Item key="1">1st menu item</Menu.Item>
//         <Menu.Item key="2">2nd menu item</Menu.Item>
//         <Menu.Item key="3">3rd menu item</Menu.Item>
//     </Menu>
// )
const Demo = ({deleteConfirm, partmentList, list, dispatch, onSelect, loading}) => {
    deleteConfirm = (id) => {
        dispatch({
            type: "account/deldepartment",
            payload: {id},
        })
    }
    const titleFun = (item) =>
        <Row type="flex" justify="space-between" >
            {item.name}
            <Row type="flex" justify="space-between">
                <ParmentForm action="editdepartment" record={item} dispatch={dispatch}>
                    <Icon type="form" title="编辑" />
                </ParmentForm>
                <Popconfirm title="确定要删除吗？"onConfirm={() => deleteConfirm(item.id)}>
                    <Icon type="delete" title="删除" className="ml10" style={{display: "flex", alignItems: "center"}}/>
                </Popconfirm>
            </Row>
        </Row>
    let dataList = partmentList && partmentList.filter((item) => item.pid === "0")
    let nextList = partmentList && partmentList.filter((item) => item.pid !== "0")
    const loop = (data) => data && data.map((item) => {
        let childrenList = []
        nextList.map((mess) => {
            if (mess.pid === item.id) {
                childrenList.push(mess)
            }
        })
        nextList = nextList.concat(childrenList).filter((v, i, arr) => arr.indexOf(v.id) === arr.lastIndexOf(v.id))
        if (childrenList && childrenList.length > 0) {
            return <TreeNode key={item.id} title={titleFun(item)}>{loop(childrenList)}</TreeNode>
        }
        return <TreeNode key={item.id} title={titleFun(item)} />
    })
    return (
        <Card
            title="组织结构"
            extra={<ParmentForm SuperName={list.name} selectID={list.id}
                action="adddepartment" dispatch={dispatch}><Icon type="plus" theme="outlined" title="添加部门" className={styles.addIcon}/></ParmentForm>
            }
            bodyStyle={{height: "calc(100% - 56px)", padding: 0, overflow: "auto"}}
            style={{height: "100%"}}
        >
            {(!dataList || dataList && dataList.length === 0) && !loading && <div style={{textAlign: "center"}} className="pad20">
                <ParmentForm action="adddepartment" selectID="0" dispatch={dispatch}>
                    <Button type="primary"><Icon type="plus" theme="outlined"/>添加部门</Button>
                </ParmentForm>
            </div>}
            <DirectoryTree
                onSelect={onSelect}
                //   defaultExpandedKeys={this.state.expandedKeys}
                draggable
                showIcon={false}
            >
                {loop(dataList)}
            </DirectoryTree>
        </Card>
    )
}
export default Demo
