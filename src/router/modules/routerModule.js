//  备注： 详情的路由必须以Details结尾, 用来处理变态产品的需求。 列表放在第一个child

const Workbench = () =>
  // 工作台
  import(
    /* webpackChunkName: "workbench" */ /* webpackMode: "lazy" */ "@/views/main/page/workbench"
  );
const Announcement = () =>
  // 公告
  import(
    /* webpackChunkName: "announcement" */ /* webpackMode: "lazy" */ "@/views/main/page/workbench/announcement.vue"
  );
const AnnouncementDetails = () =>
  // 公告
  import(
    /* webpackChunkName: "announcementDetails" */ /* webpackMode: "lazy" */ "@/views/main/page/workbench/announcementDetails.vue"
  );
// ==================================================================

const Order = () =>
  // 订单
  import(
    /* webpackChunkName: "order" */ /* webpackMode: "lazy" */ "@/views/main/page/order"
  );

// ------------------
const BrabBill = () =>
  // 抢单
  import(
    /* webpackChunkName: "brabBill" */ /* webpackMode: "lazy" */ "@/views/main/page/order/brabBill"
  );
const brabBillDetails = () =>
  // 抢单详情
  import(
    /* webpackChunkName: "brabBillDetails" */ /* webpackMode: "lazy" */ "@/views/main/page/order/brabBill/brabBillDetails.vue"
  );
// ------------------

const Receive = () =>
  // 接收
  import(
    /* webpackChunkName: "receive" */ /* webpackMode: "lazy" */ "@/views/main/page/order/receive"
  );
const ReceiveDetails = () =>
  // 接收详情
  import(
    /* webpackChunkName: "receiveDetails" */ /* webpackMode: "lazy" */ "@/views/main/page/order/receive/receiveDetails.vue"
  );
// ------------------

const Transaction = () =>
  // 办理
  import(
    /* webpackChunkName: "transaction" */ /* webpackMode: "lazy" */ "@/views/main/page/order/transaction"
  );
const TransactionTemplate = () =>
  // 办理详情-模板
  import(
    /* webpackChunkName: "finishDetailsTemplate" */ /* webpackMode: "lazy" */ "@/views/main/page/order/transaction/transactionTemplate.vue"
  );
const TransactionTask = () =>
  // 办理详情-任务
  import(
    /* webpackChunkName: "finishDetailsTask" */ /* webpackMode: "lazy" */ "@/views/main/page/order/transaction/transactionTask.vue"
  );
const TransactionDocument = () =>
  // 办理详情-文档
  import(
    /* webpackChunkName: "finishDetailsDocument" */ /* webpackMode: "lazy" */ "@/views/main/page/order/transaction/transactionDocument.vue"
  );
const TransactionBill = () =>
  // 办理详情-底单
  import(
    /* webpackChunkName: "finishDetailsBill" */ /* webpackMode: "lazy" */ "@/views/main/page/order/transaction/transactionBill.vue"
  );
const TransactionDynamic = () =>
  // 办理详情-动态
  import(
    /* webpackChunkName: "finishDetailsDynamic" */ /* webpackMode: "lazy" */ "@/views/main/page/order/transaction/transactionDynamic.vue"
  );
const TransactionDetails = () =>
  // 接收详情
  import(
    /* webpackChunkName: "transactionDetails" */ /* webpackMode: "lazy" */ "@/views/main/page/order/transaction/transactionDetails.vue"
  );
// ------------------
// ------------------

const Finish = () =>
  // 完结
  import(
    /* webpackChunkName: "finish" */ /* webpackMode: "lazy" */ "@/views/main/page/order/finish"
  );
const FinishDetailsTemplate = () =>
  // 完结详情-模板
  import(
    /* webpackChunkName: "finishDetailsTemplate" */ /* webpackMode: "lazy" */ "@/views/main/page/order/finish/finishDetailsTemplate"
  );
const FinishDetailsTask = () =>
  // 完结详情-任务
  import(
    /* webpackChunkName: "finishDetailsTask" */ /* webpackMode: "lazy" */ "@/views/main/page/order/finish/finishDetailsTask"
  );
const FinishDetailsDocument = () =>
  // 完结详情-文档
  import(
    /* webpackChunkName: "finishDetailsDocument" */ /* webpackMode: "lazy" */ "@/views/main/page/order/finish/finishDetailsDocument"
  );
const FinishDetailsBill = () =>
  // 完结详情-底单
  import(
    /* webpackChunkName: "finishDetailsBill" */ /* webpackMode: "lazy" */ "@/views/main/page/order/finish/finishDetailsBill"
  );
const FinishDetailsDynamic = () =>
  // 完结详情-动态
  import(
    /* webpackChunkName: "finishDetailsDynamic" */ /* webpackMode: "lazy" */ "@/views/main/page/order/finish/finishDetailsDynamic"
  );
const FinishDetails = () =>
  // 接收详情
  import(
    /* webpackChunkName: "finishDetails" */ /* webpackMode: "lazy" */ "@/views/main/page/order/finish/finishDetails.vue"
  );
// ------------------

const Chargeback = () =>
  // 退单
  import(
    /* webpackChunkName: "chargeback" */ /* webpackMode: "lazy" */ "@/views/main/page/order/chargeback"
  );

const chargeBackDetails = () =>
  // 退单详情
  import(
    /* webpackChunkName: "chargeBackDetails" */ /* webpackMode: "lazy" */ "@/views/main/page/order/chargeback/chargeBackDetails.vue"
  );
// ==================================================================
const chargeBackDetailsTemplate = () =>
  // 退单详情-模板
  import(
    /* webpackChunkName: "chargeBackDetailsTemplate" */ /* webpackMode: "lazy" */ "@/views/main/page/order/chargeBack/chargeBackDetailsTemplate"
  );
const chargeBackDetailsTask = () =>
  // 退单详情-任务
  import(
    /* webpackChunkName: "chargeBackDetailsTask" */ /* webpackMode: "lazy" */ "@/views/main/page/order/chargeBack/chargeBackDetailsTask"
  );
const chargeBackDetailsDocument = () =>
  // 退单详情-文档
  import(
    /* webpackChunkName: "chargeBackDetailsDocument" */ /* webpackMode: "lazy" */ "@/views/main/page/order/chargeBack/chargeBackDetailsDocument"
  );
const chargeBackDetailsBill = () =>
  // 退单详情-底单
  import(
    /* webpackChunkName: "chargeBackDetailsBill" */ /* webpackMode: "lazy" */ "@/views/main/page/order/chargeBack/chargeBackDetailsBill"
  );
const chargeBackDetailsDynamic = () =>
  // 退单详情-动态
  import(
    /* webpackChunkName: "chargeBackDetailsDynamic" */ /* webpackMode: "lazy" */ "@/views/main/page/order/chargeBack/chargeBackDetailsDynamic"
  );

const Task = () =>
  // 任务
  import(
    /* webpackChunkName: "task" */ /* webpackMode: "lazy" */ "@/views/main/page/task"
  );

// ==================================================================

const Case = () =>
  // 案例
  import(
    /* webpackChunkName: "case" */ /* webpackMode: "lazy" */ "@/views/main/page/case"
  );
const CaseGenerate = () =>
  // 案例详情
  import(
    /* webpackChunkName: "caseGenerate" */ /* webpackMode: "lazy" */ "@/views/main/page/case/caseGenerate"
  );
const CaseDetailsPreview = () =>
  // 案例详情
  import(
    /* webpackChunkName: "case" */ /* webpackMode: "lazy" */ "@/views/main/page/case/caseDetailsPreview"
  );

// ==================================================================

const Grab = () =>
  // 抢单
  import(
    /* webpackChunkName: "grab" */ /* webpackMode: "lazy" */ "@/views/main/page/grab"
  );

const GrabDetails = () =>
  // 抢单详情
  import(
    /* webpackChunkName: "receiveDetails" */ /* webpackMode: "lazy" */ "@/views/main/page/grab/grabDetails.vue"
  );
const Notice = () =>
  // 通知
  import(
    /* webpackChunkName: "notice" */ /* webpackMode: "lazy" */ "@/views/main/page/notice"
  );
const PersonalSetting = () =>
  // 个人设置
  import(
    /* webpackChunkName: "personalSetting" */ /* webpackMode: "lazy" */ "@/views/main/page/personalSetting"
  );
const personalAttestation = r =>
  require.ensure(
    [],
    () => r(require("@/views/main/attestation/personal.vue")),
    "personalAttestation"
  );
// 店铺认证占位图
const storeAttestation = r =>
  require.ensure(
    [],
    () => r(require("@/views/main/attestation/store.vue")),
    "storeAttestation"
  );
const otherYtAttestation = r =>
  require.ensure(
    [],
    () => r(require("@/views/main/attestation/otherYt.vue")),
    "otherYtAttestation"
  );
const TeamSetting = () =>
  // 团队设置
  import(
    /* webpackChunkName: "teamSetting" */ /* webpackMode: "lazy" */ "@/views/main/page/teamSetting"
  );
const InviteNotice = () =>
  // 团队设置
  import(
    /* webpackChunkName: "teamSetting" */ /* webpackMode: "lazy" */ "@/views/main/page/notice/inviteNotice.vue"
  );
const Settled = () =>
  // 店铺入驻
  import(
    /* webpackChunkName: "chargeback" */ /* webpackMode: "lazy" */ "@/views/main/page/settled"
  );
// ==================================================================

// 公共全部路由 //  涉及到权限
export default {
  path: "/flsc",
  name: "flsc",
  meta: {
    title: "flsc"
  },
  children: [
    {
      path: "/page",
      name: "page",
      icon: "dgg-note",
      meta: {
        title: "page"
      },
      children: [
        {
          path: "/workbench",
          name: "workbench",
          icon: "dgg-note",
          meta: {
            title: "工作台",
            parentId: null,
            show: true
          },
          component: Workbench,
          children: [
            {
              path: "/workbench/announcement",
              name: "announcement",
              icon: "dgg-note",
              meta: {
                title: "公告",
                parentId: null
              },
              component: Announcement,
              children: [
                {
                  path: "/workbench/announcement/announcementDetails",
                  name: "announcementDetails",
                  icon: "dgg-note",
                  meta: {
                    title: "公共详情",
                    parentId: "workbench"
                  },
                  component: AnnouncementDetails,
                  children: []
                }
              ]
            }
          ]
        },
        {
          path: "/inviteNotice",
          name: "inviteNotice",
          icon: "dgg-note",
          meta: {
            title: "团队邀请通知",
            parentId: null,
            show: false
          },
          component: InviteNotice,
          children: []
        },
        {
          path: "/order",
          name: "order",
          icon: "dgg-note",
          meta: {
            title: "订单",
            parentId: null,
            show: true
          },
          component: Order,
          children: [
            // {
            //       path: '/order/brabBill',
            //       name: 'brabBill',
            //       icon: 'dgg-note',
            //       meta: {
            //           title: '抢单',
            //           parentId: 'order'
            //       },
            //       component: BrabBill,
            //       children: [{
            //           path: '/order/brabBill/brabBillDetails',
            //           name: 'brabBillDetails',
            //           icon: 'dgg-note',
            //           meta: {
            //               title: '抢单详情',
            //               parentId: 'order'
            //           },
            //           component: brabBillDetails,
            //           children: []
            //       }]
            //   },
            {
              path: "/order/allOrder",
              name: "allOrder",
              icon: "dgg-note",
              meta: {
                title: "全部",
                parentId: "order"
              },
              // component: allOrder,
              component: () =>
                import(
                  /* webpackChunkName: "receive" */ /* webpackMode: "lazy" */ "@/views/main/page/order/all"
                ),
              children: [
                // {
                //   path:"/order/allOrder/processPlan",
                //   name:"processPlan",
                //   icon:"dgg-note",
                //   meta:{
                //     title:"提交流程方案",
                //     parentId: "order"
                //   },
                //   component:()=>import("@/views/main/page/order/all/processPlan.vue"),
                //   children:[]
                // }
              ]
            },
            {
              path: "/order/receive",
              name: "receive",
              icon: "dgg-note",
              meta: {
                title: "待接收",
                parentId: "order"
              },
              component: Receive,
              children: [
                {
                  path: "/order/receive/receiveDetails",
                  name: "receiveDetails",
                  icon: "dgg-note",
                  meta: {
                    title: "待接收详情",
                    parentId: "order"
                  },
                  component: ReceiveDetails,
                  children: []
                }
              ]
            },
            {
              path: "/order/transaction",
              name: "transaction",
              icon: "dgg-note",
              meta: {
                title: "办理中",
                parentId: "order"
              },
              component: Transaction,
              children: [
                {
                  path: "/order/transaction/transactionTemplate",
                  name: "transactionTemplate",
                  icon: "dgg-note",
                  meta: {
                    title: "办理详情-模板",
                    parentId: "order"
                  },
                  component: TransactionTemplate,
                  children: []
                },
                {
                  path: "/order/transaction/transactionTask",
                  name: "transactionTask",
                  icon: "dgg-note",
                  meta: {
                    title: "办理详情-任务",
                    parentId: "order"
                  },
                  // component: TransactionTask,
                  component: () =>
                    import(
                      "@/views/main/page/order/transaction/transactionTask.vue"
                    ),
                  children: []
                },
                {
                  path: "/order/transaction/transactionDocument",
                  name: "transactionDocument",
                  icon: "dgg-note",
                  meta: {
                    title: "办理详情-文档",
                    parentId: "order"
                  },
                  component: TransactionDocument,
                  children: []
                },
                {
                  path: "/order/transaction/transactionBill",
                  name: "transactionBill",
                  icon: "dgg-note",
                  meta: {
                    title: "办理详情-底单",
                    parentId: "order"
                  },
                  component: TransactionBill,
                  children: []
                },
                {
                  path: "/order/transaction/transactionDynamic",
                  name: "transactionDynamic",
                  icon: "dgg-note",
                  meta: {
                    title: " 办理详情-动态",
                    parentId: "order"
                  },
                  component: TransactionDynamic,
                  children: []
                },
                {
                  path: "/order/transaction/processPlan",
                  name: "processPlan",
                  icon: "dgg-note",
                  meta: {
                    title: "提交流程方案",
                    parentId: "order"
                  },
                  component: () =>
                    import("@/views/main/page/order/all/processPlan.vue"),
                  children: []
                },
                {
                  path: "/order/transaction/transactionDetails",
                  name: "transactionDetails",
                  icon: "dgg-note",
                  meta: {
                    title: "办理中详情",
                    parentId: "order"
                  },
                  component: TransactionDetails,
                  children: []
                }
              ]
            },
            {
              path: "/order/finish",
              name: "finish",
              icon: "dgg-note",
              meta: {
                title: "完结",
                parentId: "order"
              },
              component: Finish,
              children: [
                {
                  path: "/order/finish/finishDetailsTemplate",
                  name: "finishDetailsTemplate",
                  icon: "dgg-note",
                  meta: {
                    title: " 完结详情-模板",
                    parentId: "order"
                  },
                  component: FinishDetailsTemplate,
                  children: []
                },
                {
                  path: "/order/finish/finishDetailsTask",
                  name: "finishDetailsTask",
                  icon: "dgg-note",
                  meta: {
                    title: " 完结详情-任务",
                    parentId: "order"
                  },
                  component: FinishDetailsTask,
                  children: []
                },
                {
                  path: "/order/finish/finishDetailsDocument",
                  name: "finishDetailsDocument",
                  icon: "dgg-note",
                  meta: {
                    title: " 完结详情-文档",
                    parentId: "order"
                  },
                  component: FinishDetailsDocument,
                  children: []
                },
                {
                  path: "/order/finish/finishDetailsBill",
                  name: "finishDetailsBill",
                  icon: "dgg-note",
                  meta: {
                    title: " 完结详情-底单",
                    parentId: "order"
                  },
                  component: FinishDetailsBill,
                  children: []
                },
                {
                  path: "/order/finish/finishDetailsDynamic",
                  name: "finishDetailsDynamic",
                  icon: "dgg-note",
                  meta: {
                    title: " 完结详情-动态",
                    parentId: "order"
                  },
                  component: FinishDetailsDynamic,
                  children: []
                },
                {
                  path: "/order/finish/finishDetails",
                  name: "finishDetails",
                  icon: "dgg-note",
                  meta: {
                    title: "完结详情",
                    parentId: "order"
                  },
                  component: FinishDetails,
                  children: []
                }
              ]
            },
            {
              path: "/order/chargeback",
              name: "chargeback",
              icon: "dgg-note",
              meta: {
                title: "退单",
                parentId: "order"
              },
              component: Chargeback,
              children: [
                {
                  path: "/order/chargeBack/chargeBackDetailsTemplate",
                  name: "chargeBackDetailsTemplate",
                  icon: "dgg-note",
                  meta: {
                    title: "退单详情-模板",
                    parentId: "order"
                  },
                  component: chargeBackDetailsTemplate,
                  children: []
                },
                {
                  path: "/order/chargeBack/chargeBackDetailsTask",
                  name: "chargeBackDetailsTask",
                  icon: "dgg-note",
                  meta: {
                    title: "退单详情-任务",
                    parentId: "order"
                  },
                  component: chargeBackDetailsTask,
                  children: []
                },
                {
                  path: "/order/chargeBack/chargeBackDetailsDocument",
                  name: "chargeBackDetailsDocument",
                  icon: "dgg-note",
                  meta: {
                    title: "退单详情-文档",
                    parentId: "order"
                  },
                  component: chargeBackDetailsDocument,
                  children: []
                },
                {
                  path: "/order/chargeBack/chargeBackDetailsBill",
                  name: "chargeBackDetailsBill",
                  icon: "dgg-note",
                  meta: {
                    title: "退单详情-底单",
                    parentId: "order"
                  },
                  component: chargeBackDetailsBill,
                  children: []
                },
                {
                  path: "/order/chargeBack/chargeBackDetailsDynamic",
                  name: "chargeBackDetailsDynamic",
                  icon: "dgg-note",
                  meta: {
                    title: "退单详情-动态",
                    parentId: "order"
                  },
                  component: chargeBackDetailsDynamic,
                  children: []
                },
                {
                  path: "/order/chargeBack/chargeBackDetails",
                  name: "chargeBackDetails",
                  icon: "dgg-note",
                  meta: {
                    title: "退单详情",
                    parentId: "order"
                  },
                  component: chargeBackDetails,
                  children: []
                }
              ]
            }
          ]
        },
        {
          path: "/task",
          name: "task",
          icon: "dgg-note",
          meta: {
            title: "任务",
            parentId: null,
            show: true
          },
          component: Task,
          children: []
        },
        {
          path: "/case",
          name: "case",
          icon: "dgg-note",
          meta: {
            title: "案例",
            parentId: null,
            show: false
          },
          component: Case,
          children: [
            {
              path: "/case/caseGenerate",
              name: "caseGenerate",
              icon: "dgg-note",
              meta: {
                title: "案例生成",
                parentId: "case"
              },
              component: CaseGenerate,
              children: []
            },
            {
              path: "/case/caseDetailsPreview",
              name: "caseDetailsPreview",
              icon: "dgg-note",
              meta: {
                title: "案例预览",
                parentId: "case"
              },
              component: CaseDetailsPreview,
              children: []
            }
          ]
        },
        {
          path: "/grab",
          name: "grab",
          icon: "dgg-note",
          meta: {
            title: "待抢单",
            parentId: null,
            show: false
          },
          component: Grab,
          children: [
            {
              path: "/grab/grabDetails",
              name: "grabDetails",
              icon: "dgg-note",
              meta: {
                title: "订单信息",
                parentId: "grab"
              },
              component: GrabDetails,
              children: []
            }
          ]
        },
        {
          path: "/notice",
          name: "notice",
          icon: "dgg-note",
          meta: {
            title: "通知",
            parentId: null,
            show: false
          },
          component: Notice,
          children: []
        },
        {
          path: "/personalSetting",
          name: "personalSetting",
          icon: "dgg-note",
          meta: {
            title: "个人设置",
            parentId: null,
            show: false
          },
          component: PersonalSetting,
          children: []
        },
        {
          // 去个人认证占位图
          path: "/personalAttestation",
          name: "personalAttestation",
          icon: "dgg-note",
          meta: {
            title: "",
            parentId: null
          },
          component: personalAttestation,
          children: []
        },
        {
          path: "/otherYtAttestation",
          name: "otherYtAttestation",
          icon: "dgg-note",
          meta: {
            title: "",
            parentId: null
          },
          component: otherYtAttestation,
          children: []
        },
        {
          // 去店铺入住占位图
          path: "/storeAttestation",
          name: "storeAttestation",
          icon: "dgg-note",
          meta: {
            title: "",
            parentId: null
          },
          component: storeAttestation,
          children: []
        },
        {
          path: "/teamSetting",
          name: "teamSetting",
          icon: "dgg-note",
          meta: {
            title: "团队设置",
            parentId: null,
            show: false
          },
          component: TeamSetting,
          children: []
        },
        {
          // 测试店铺入驻页面暂用路由
          path: "/settled",
          name: "settled",
          icon: "dgg-note",
          meta: {
            title: "",
            parentId: null
          },
          component: Settled,
          children: []
        }
      ]
    }
  ]
};
