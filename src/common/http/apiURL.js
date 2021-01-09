export default {
  /** 登录-根据展会编码获取展会路由 */
  searchExhInfo: "/searchExhibition",
  /** 登录-根据展会编码获取展会路由-mock */
  searchExhInfoMock: "/searchExhibition/mock",
  /** 登录接口 */
  login: "/token",
  /** 日历 */
  needLinkActorCount: "/Link/NeedLinkActorCount",
  getActorListData: "/ActorData/GetActorListData",
  /** 获取展会列表 */
  getExhibitionList: "/Exhibition/GetListByUserId",
  /** 设置当前展会 */
  upDateCurrentExh: "/ExhUserData/UpdateCurrentExh",
  /** 展商报表 */
  biActorStatics: "/BI/ActorStatistics",
  /** 获取人员列表 */
  getExhUserData: "/ExhUserData/GetExhUserData",
  /** 待办事项-联络 */
  getNeedLinks: "/Link/GetNeedLinks",
  /** 展位报表 */
  getBoothReport: "/Booth/Report",
  /** 合同报表 */
  getContactReport: "/BI/ContractStatistics",
  /** 业绩报表 */
  getPhoneReport: "/BI/TelephoneStatistics",
  /** 数据概要 */
  getIndexDataDetail: "/IndexStatics/GetIndexDataDetail",
  /** 催款相关 */
  getBenchPayPlan: "/BenchPayPlan/GetBenchPayPlanByDateList",
  /** 退出登录 */
  logOut: "/Common/LogOut",
  /** 应用版本管理 */
  update: "/GetUpdateInfo",
  /** 获取权限 */
  getPrivilegeList: "/Privilege/GetPrivilegeList"
}
