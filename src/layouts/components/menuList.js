let menubar = [
    {
        key: "home",
        i: "icon-shouye_huaban_huaban",
        pathname: "/home",
        title: "首页",
    },
    {
        key: "pyq",
        i: "icon-ai-moments",
        title: "朋友圈",
        pathname: "/vertisy",
        childrenNav: [
            {
                key: "dz",
                icon: "user",
                pathname: "/vertisy/point",
                title: "自动点赞",
            },
            {
                key: "vx",
                icon: "user",
                pathname: "/vertisy/circle",
                title: "朋友圈营销",
            },
            {
                key: "verrecord",
                icon: "user",
                pathname: "/vertisy/record",
                title: "朋友圈记录",
            },
            // {
            //     key: "currency",
            //     icon: "",
            //     pathname: "/material/currency",
            //     title: "云素材",
            // },
            {
                key: "mymanage",
                icon: "",
                pathname: "/material/myself",
                title: "我的素材",
            },
        ],
    },
    {
        key: "qf",
        i: "icon-send",
        pathname: "/fsend",
        title: "群发管理",
        childrenNav: [
            {
                key: "groupSend",
                icon: "user",
                pathname: "/fsend/groupSend",
                title: "群发消息",
            },
            {
                key: "groupRecord",
                icon: "user",
                pathname: "/fsend/groupRecord",
                title: "群发记录",
            },
        ],
    },
    // {
    //     key: "qunguanli",
    //     i: "icon-renqunguanli",
    //     pathname: "/qunmanage",
    //     title: "群管理",
    //     childrenNav: [
    //         {
    //             key: "qunset",
    //             icon: "",
    //             pathname: "/qunmanage/creatup",
    //             title: "创建群设置",
    //         },
    //         {
    //             key: "auto",
    //             icon: "",
    //             pathname: "/qunmanage/enterset",
    //             title: "自动进群设置",
    //         },
    //         {
    //             key: "qunadd",
    //             icon: "",
    //             pathname: "/qunmanage/add",
    //             title: "群内加好友",
    //         },
    //         {
    //             key: "kickset",
    //             icon: "",
    //             pathname: "/qunmanage/kickset",
    //             title: "群内踢人设置",
    //         },
    //         {
    //             key: "basic",
    //             icon: "",
    //             pathname: "/qunmanage/basicset",
    //             title: "基础设置",
    //         },
    //         {
    //             key: "other",
    //             icon: "",
    //             pathname: "/qunmanage/otherset",
    //             title: "群名称与公告设置",
    //         },
    //     ],
    // },
    {
        key: "autoadd",
        i: "icon-tianjiahaoyou1",
        title: "加好友设置",
        pathname: "/autoadd",
        childrenNav: [
            {
                key: "huifu",
                icon: "user",
                pathname: "/autoadd/reply",
                title: "被添加规则",
            },

            {
                key: "zidong",
                icon: "user",
                pathname: "/autoadd/autofriend",
                title: "自动加好友",
            },
            // {
            //     key: "orderules",
            //     icon: "user",
            //     pathname: "/autoadd/orderules",
            //     title: "按订单加好友",
            // },
            {
                key: "zhixing",
                icon: "user",
                pathname: "/autoadd/record",
                title: "执行记录",
            },
        ],
    },
    // {
    //     key: "sucai",
    //     i: "icon-sucai",
    //     pathname: "/material",
    //     title: "素材管理",
    //     childrenNav: [
    //         {
    //             key: "currency",
    //             icon: "",
    //             pathname: "/material/currency",
    //             title: "云素材",
    //         },
    //         {
    //             key: "mymanage",
    //             icon: "",
    //             pathname: "/material/myself",
    //             title: "我的素材",
    //         },
    //     ],
    // },
    {
        key: "leida",
        i: "icon-yingxiao",
        pathname: "",
        title: "营销雷达",
        childrenNav: [
            {
                key: "myart",
                i: "icon-yingxiao",
                pathname: "/article/content",
                title: "我的分享",
            },
            {
                key: "share",
                i: "icon-yingxiao",
                pathname: "/article/share",
                title: "团队分享",
            },
            {
                key: "team",
                i: "icon-user",
                pathname: "/article/team",
                title: "团队管理",
            },
            // {
            //     key: "award",
            //     i: "icon-caiwu",
            //     pathname: "/article/award",
            //     title: "成为代理",
            // },
            {
                key: "bill",
                i: "icon-caiwu",
                pathname: "/article/bill",
                title: "财务明细",
            },
        ],
    },
    {
        key: "art",
        i: "icon-yingxiao",
        pathname: "/article/content",
        title: "营销雷达",
    },
    {
        key: "huas",
        i: "icon-xiaoxi1",
        pathname: "/wordManage",
        title: "快捷回复",
    },
    {
        key: "guanjianci",
        i: "icon-automessage",
        pathname: "/keyword",
        title: "自动回复",
    },
    {
        key: "fission",
        i: "icon-huodongtuiguang",
        pathname: "/fission",
        title: "海报裂变",
        childrenNav: [
            {
                key: "act",
                icon: "",
                pathname: "/fission/act",
                title: "活动列表",
            },
        ],
    },
    {
        key: "tongjizhongxin",
        i: "icon-shujutongji2",
        pathname: "/statistical",
        title: "统计中心",
        childrenNav: [
            {
                key: "stafan",
                icon: "",
                pathname: "/statistical/fan",
                title: "粉丝统计",
            },
            {
                key: "stamessage",
                icon: "",
                pathname: "/statistical/message",
                title: "消息统计",
            },
            {
                key: "stamarket",
                icon: "",
                pathname: "/statistical/market",
                title: "营销统计",
            },
            {
                key: "staorder",
                icon: "",
                pathname: "/statistical/order",
                title: "订单统计",
            },
        ],
    },
    {
        key: "sheb",
        i: "icon-tel",
        pathname: "/devices",
        title: "设备管理",
        childrenNav: [
            {
                key: "devicelist",
                icon: "",
                pathname: "/devices/list",
                title: "设备列表",
            },
            {
                key: "devicegroup",
                icon: "",
                pathname: "/devices/group",
                title: "设备分组",
            },
            // {
            //     key: "devicedutyList",
            //     icon: "",
            //     pathname: "/devices/dutyList",
            //     title: "指令记录",
            // },
        ],
    },
    {
        key: "wechat",
        i: "icon-ai-weixin",
        title: "微信管理",
        pathname: "/wechat",
        childrenNav: [
            {
                key: "wechatList",
                icon: "",
                pathname: "/wechat/chatList",
                title: "微信列表",
            },
            {
                key: "friend",
                icon: "",
                pathname: "/wechat/friendsList",
                title: "好友列表",
            },
            {
                key: "friendGroup",
                icon: "",
                pathname: "/wechat/friendGroup",
                title: "好友分组",
            },
            {
                key: "YH",
                icon: "",
                pathname: "/wechat/listYH",
                title: "自动养号",
            },
            {
                key: "biaoqian",
                i: "icon-biaoqian",
                pathname: "/tagManage",
                title: "标签管理",
            },
            {
                key: "kuozhan",
                i: "icon-biaoqian",
                pathname: "/wechat/extende",
                title: "扩展字段",
            },
            {
                key: "renwujil",
                icon: "",
                pathname: "/wechat/chatRecord",
                title: "聊天记录",
            },
        ],
    },
    {
        key: "qrcode",
        i: "icon-saoma",
        pathname: "/auxiliary/qrcode",
        title: "微活码",
    },
    {
        key: "aux",
        i: "icon-weibiaoti103",
        title: "系统设置",
        pathname: "/auxiliary",
        childrenNav: [
            {
                key: "account",
                i: "icon-user",
                pathname: "/account",
                title: "账号管理",
            },
            {
                key: "partment",
                // icon: "user",
                i: "icon-bumen",
                pathname: "/partment",
                title: "部门管理",
            },
            {
                key: "store",
                icon: "",
                pathname: "/auxiliary/store",
                title: "绑定公众号",
            },
            {
                key: "senset",
                icon: "",
                pathname: "/sensitive/set",
                title: "风险设置",
            },
            {
                key: "senoperation",
                icon: "",
                pathname: "/sensitive/operation",
                title: "风险记录",
            },
            {
                key: "caozuo",
                i: "icon-jilumian",
                pathname: "/operation",
                title: "操作记录",
            },
            {
                key: "maker",
                icon: "",
                pathname: "/auxiliary/maker",
                title: "创客工具箱",
            },
            // {
            //     key: "record",
            //     icon: "",
            //     pathname: "/auxiliary/orderRecord",
            //     title: "订单记录",
            // },
            // {
            //     key: "client",
            //     icon: "",
            //     pathname: "/auxiliary/client",
            //     title: "客户端下载",
            // },
        ],
    },
    {
        key: "mingsi",
        i: "icon-caiwu",
        pathname: "/redpackage",
        title: "财务明细",
    },
    // {
    //     key: "zhuzhanghoa",
    //     icon: "user",
    //     pathname: "/primaryuser",
    //     title: "主账号管理",
    // },
]
export const menuBar = (userlist) => {
    let menuList = menubar
    let Jurisdiction = userlist && userlist.auth
    if (window.sessionStorage.getItem("i") !== "3") {
        menuList = menuList.filter((item) => item.key !== "qunguanli")
        let index = menuList.findIndex((item) => item.key === "autoadd")
        index !== -1 && (menuList[index].childrenNav = menuList[index].childrenNav.filter((item) => item.key !== "orderules"))
        let aux = menuList.findIndex((item) => item.key === "aux")
        aux !== -1 && (menuList[aux].childrenNav = menuList[aux].childrenNav.filter((item) => item.key !== "maker"))
    }

    // 子账号
    if (Jurisdiction) {
        let meu = []
        const { yinXiao} = userlist
        menuList.map((mess) => {
            if (!mess.childrenNav && Jurisdiction.find((item) => item.rights_name === mess.title)) {
                meu.push(mess)
            }
            if (mess.childrenNav) {
                let childrenNav = []
                mess.childrenNav.map((ch) => {
                    if (mess.key === "leida") {
                        Number(yinXiao) && ch.key === "share" && childrenNav.push(ch)
                        Number(yinXiao) && ch.key === "myart" && childrenNav.push(ch)
                        // Number(yinXiao) && ch.key === "award" && childrenNav.push(ch)
                        return
                    }
                    if (Jurisdiction.find((item) => item.rights_name === ch.title)) {
                        childrenNav.push(ch)
                    }
                })
                if (childrenNav.length > 0) {
                    meu.push({ ...mess, childrenNav })
                }
                if (childrenNav.length === 0 && Jurisdiction.find((item) => item.rights_name === mess.title)) {
                    meu.push(mess)
                }
            }
        })
        menuList = meu
        return menuList
    }
    // 主账号
    if (userlist && menuList) {
        const { yinXiao, haiBao, moren } = userlist
        menuList = menuList.filter((item) => {
            if (!Number(moren) && item.key === "leida") {
                // !Number(payment) && (item.childrenNav = [item.childrenNav[0]])
                return (Number(yinXiao) && item.key === "leida")
            }
            if (!Number(haiBao) && item.key === "fission") {
                return item.key !== "fission"
            }
            if (!Number(yinXiao) && item.key === "art") {
                return item.key !== "art"
            }
            if (Number(moren)) {
                return item.key !== "leida"
            }
        })
        return menuList
    }
}
