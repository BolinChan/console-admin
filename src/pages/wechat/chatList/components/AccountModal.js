import { Modal, Checkbox } from "antd"
let selectList = []
let delList = []
const AccountModal = ({ list, visible, record, handleCancel, dispatch, selectedRowKeys}) => {
    const handleSelect = (e) => {
        const { kefuid, checked } = e.target
        if (checked) {
            if (!record.kefus || (record && record.kefus.findIndex((item) => item.kefuid === kefuid) === -1)) {
                selectList.push(kefuid)
            }
            delList = delList.filter((item) => item.kefuid !== kefuid)
        }
        if (!checked) {
            if (record && record.kefus) {
                let index = record.kefus.findIndex((item) => item.kefuid === kefuid)
                index !== -1 && delList.push({id: record.kefus[index].id, kefuid})
            }
            selectList = selectList.filter((item) => item !== kefuid)
        }
    }
    const submit = () => {
        if (record && !record.wxid && selectList.length > 0 && selectedRowKeys.length > 0) {
            dispatch({
                type: "chat/Equipments",
                payload: { kefuid: selectList, wxid: selectedRowKeys },
            })
            onCancel()
            return
        }
        if (selectList.length > 0) {
            dispatch({
                type: "chat/DisEquipment",
                payload: { kefuid: selectList, wxid: record.wxid },
            })
        }
        if (delList.length > 0) {
            dispatch({
                type: "chat/deleteKefu",
                payload: { id: delList.map((item) => item.id), recordid: record.id },
            })
            delList.map((item) => record.kefus = record.kefus.filter((mess) => mess.kefuid !== item.kefuid))
        }
        onCancel()
    }
    const onCancel = () => {
        selectList = []
        delList = []
        handleCancel && handleCancel()
    }
    return (
        <span>
            <Modal
                width={640}
                wrapClassName="wrapClass"
                style={{ height: "70%", overflow: "hidden"}}
                bodyStyle={{ height: "calc(100% - 108px)", overflow: "auto"}}
                destroyOnClose={true}
                title="分配客服"
                visible={visible}
                onOk={submit}
                onCancel={onCancel}
            >
                {list &&
                    list.map((item) => {
                        let isTure = record && record.kefus && record.kefus.find((mess) => mess.kefuid === item.id)
                        return (
                            <Checkbox defaultChecked={!!isTure} key={item.id} accountnum={item.accountnum} kefuid={item.id} onChange={handleSelect}>
                                {item.accountnum}
                            </Checkbox>
                        )
                    })}
            </Modal>
        </span>
    )
}
export default AccountModal
