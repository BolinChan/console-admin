import { Transfer, Card, Radio } from "antd"
import styles from "../page.css"
const Allocation = ({data, targetKeys, handleChange, selectedKeys, handleSelectChange, radioChange}) => {
    data = data && data.sort((a, b) => b.is_service - a.is_service)
    const radioList = <Radio.Group size="small" defaultValue="" onChange={radioChange}>
        <Radio.Button value="">全部</Radio.Button>
        <Radio.Button value="2">客服端</Radio.Button>
        <Radio.Button value="1">管理端</Radio.Button>
    </Radio.Group>
    return (
        <Card
            title={"权限分配（创建用户时分配的权限）"}
            bodyStyle={{height: "calc(100% - 56px)"}}
            style={{ boxShadow: "0 2px 8px rgba(0, 21, 41, 0.08)", marginTop: "20px", height: "70%"}}
        >
            <Transfer
                className={styles.tran}
                dataSource={data}
                titles={[radioList, "默认分配的部门"]}
                targetKeys={targetKeys}
                selectedKeys={selectedKeys}
                onChange={handleChange}
                onSelectChange={handleSelectChange}
                render={(item) => item.title}
                showSearch
            />
        </Card>
    )

}
export default Allocation
