/* 该文件已全局引入，无需每个界面在引入 */
import http from './config';
import api from "./apiURL"

/**	数据中台地址 */
let middleEndUrl = "http://masteref-biz-recommend.platform.test.eastfair.cn";
// let middleEndUrl = "http://10.20.16.63:3000/mock/26/api";
/** 升级地址 */
let controlUrl = "https://ai.exporegist.com/AppUpdate/api"

/** 登录-根据展会编码获取展会路由 */
const searchExhInfo = (data) => {
	return http.request({
		baseUrl: middleEndUrl,
		url: api.searchExhInfo,	// DEBUG环境
		 // url: api.searchExhInfoMock,		// MOCK环境
		method: 'post',
		data,
	})
}

const test = (data) => {

	http.interceptor.response = (response) => {
		//判断返回状态 执行相应操作
		return response;
	}
	return http.request({
		baseUrl: 'https://unidemo.dcloud.net.cn/',
		url: 'ajax/echo/text?name=uni-app',
		dataType: 'text',
		data,
	})
}

/**
 * 版本控制
 * @param {Objact} data : {
	 version: 当前应用版本号
	 type: 1: iOS  2: Android
 }
 * */
const versionControl = (data) => {
	return http.request({
		baseUrl: controlUrl,
		url: api.update,
		method: 'get',
		data,
	})
}
/* 获得banner图 */
const getBanner = (data) => {
	return http.request({
		url: '/index/banner',
		method: 'get',
		data,
	})
}

/* 获得日历数据 */
const getCalenderData = (data) => {
	return http.request({
		url: api.needLinkActorCount,
		method: 'get',
		data,
	})
}

/* 获得展商列表 */
const getActorListData = (data) => {
	return http.request({
		url: api.getActorListData,
		method: 'post',
		data,
	})
}

/** 获取展会列表 */
const getExhibitionList = (data) => {
	return http.request({
		url: api.getExhibitionList,
		method: 'get',
		data,
	})
}

/** 设置当前展会 */
const upDateCurrentExh = (data) => {
	return http.request({
		url: api.upDateCurrentExh,
		method: 'get',
		data,
	})
}

/** 展商报表 */
const biActorStatics = (data) => {
	return http.request({
		url: api.biActorStatics,
		method: 'post',
		data,
	})
}


/** 获取人员列表 */
const getExhUserList = (data) => {
	return http.request({
		url: api.getExhUserData,
		method: 'post',
		data,
	})
}

/* 新增展商 */
const addActorData = (data) => {
	return http.request({
		url: "/ActorData/AddActorData",
		method: 'post',
		data,
	})
}
/* 修改展商 */
const modifyActorData = (data) => {
	return http.request({
		url: "/ActorData/ModifyActorData",
		method: 'post',
		data,
	})
}
/* 新增展商 */
const getCurrentUserInfo = (data) => {
	return http.request({
		url: "/ExhUserData/GetCurrentUserInfo",
		method: 'get',
		data,
	})
}

/** 待办事项-联络 */
const getNeedLinkList = (data) => {
	return http.request({
		url: api.getNeedLinks,
		method: 'get',
		data,
	})
}

/** 展位报表 */
const biBoothChartData = (data) => {
	return http.request({
		url: api.getBoothReport,
		method: 'post',
		data,
	})
}

/** 合同报表 */
const biContactChartData = (data) => {
	return http.request({
		url: api.getContactReport,
		method: 'post',
		data,
	})
}

/* 获得国家 */
const getCountry = (data) => {
	return http.request({
		url: "/Common/GetCountry",
		method: 'get',
		data,
	})
}

/* 获得省份 */
const getProvince = (data) => {
	return http.request({
		url: "/Common/GetProvince",
		method: 'get',
		data,
	})
}

/* 获得城市 */
const getCity = (data) => {
	return http.request({
		url: "/Common/GetCity",
		method: 'get',
		data,
	})
}

/** 业绩报表 */
const biPhoneChartData = (data) => {
	return http.request({
		url: api.getPhoneReport,
		method: 'post',
		data,
	})
}

/* 获得城市 */
const getInfoCi = (data) => {
	return http.request({
		url: "/Common/GetInfoCi",
		method: 'get',
		data,
	})
}
/** 数据概要 */
const getIndexDataDetail = (data) => {
	return http.request({
		url: api.getIndexDataDetail,
		method: 'post',
		data,
	})
}

/** 获得产品类别/行业 */
const getActorList = (data) => {
	return http.request({
		url: "/TradeAndProd/GetActorList",
		method: 'get',
		data,
	})
}

/**获取展商详情中的资料 */
const getActorDataDetail = (data) => {
	return http.request({
		url: "/ActorData/GetActorDataDetail",
		method: 'get',
		data,
	})
}

/**获取展商详情中的联络人 */
const getLinksByAtrId = (data) => {
	return http.request({
		url: "/Link/GetLinksByAtrId",
		method: 'get',
		data,
	})
}
/**获取展商详情中的合同 */
const getContractListData = (data) => {
	return http.request({
		url: "/Contract/GetContractListData",
		method: 'post',
		data,
	})
}

/** 催款相关 */
const getBenchPayPlan = (data) => {
	return http.request({
		url:api.getBenchPayPlan,
		method: 'post',
		data,
	})
}

/**新增联络人 */
const addContact = (data) => {
	return http.request({
		url: "/Link/AddContact",
		method: 'post',
		data,
	})
}

/**获得指定展商的联络人 */
const getContacts = (data) => {
	return http.request({
		url: "/Link/GetContacts",
		method: 'get',
		data,
	})
}

/** 登录接口 */
const loginApi = (data) => {
	return http.request({
		url: api.login,
		method: 'post',
		data,
	})
}

/**新增联络 */
const addLink = (data) => {
	return http.request({
		url: "/Link/AddLink",
		method: 'post',
		data,
	})
}

/**获取可预订的服务列表 */
const serviceBook = (data) => {
	return http.request({
		url: "/ServiceBook/GetServiceBookList",
		method: 'get',
		data,
	})
}
/**获取展商详细中的付款列表 */
const getPayMentList = (data) => {
	return http.request({
		url: "/PayMent/GetPayMentList",
		method: 'post',
		data,
	})
}

/** 退出登录 */
const logoutApi = (data) => {
	return http.request({
		url: api.logOut,
		method: 'get',
		data,
	})
}

/**预订服务 */
const saveServiceBook = (data) => {
	return http.request({
		url: "/ServiceBook/SaveServiceBook",
		method: 'post',
		data,
	})
}
/**付款详情中的预订 */
const getBookingList = (data) => {
	return http.request({
		url: "/Booking/GetBookingList",
		method: 'get',
		data,
	})
}

/**获得可预订展位列表 */
const boothList = (data) => {
	return http.request({
		url: "/Booth/BoothList",
		method: 'post',
		data,
	})
}
/**展位预定 */
const subscribeBooth = (data) => {
	return http.request({
		url: "/Booth/SubscribeBooth",
		method: 'post',
		data,
	})
}
/*获得展厅.价格类别,展位类型*/
const getExhBasicInfo = (data) => {
	return http.request({
		url: "/Booth/ExhBasicInfo",
		method: 'post',
		data,
	})
}
/*新增展位*/
const createBooth = (data) => {
	return http.request({
		url: "/Booth/CreateBooth",
		method: 'post',
		data,
	})
}

/** 获取权限 */
const getPrivilegeList = (data) => {
	return http.request({
		url: api.getPrivilegeList,
		method: 'get',
		data,
	})
}

export default {
	test,
	versionControl,
	getBanner,
	getCalenderData,
	getActorListData,
	addActorData,
	getExhibitionList,
	upDateCurrentExh,
	biActorStatics,
	getExhUserList,
	getCurrentUserInfo,
	getNeedLinkList,
	biBoothChartData,
	biContactChartData,
	biPhoneChartData,
	getCountry,
	getProvince,
	getCity,
	getIndexDataDetail,
	getActorList,
	getActorDataDetail,
	getLinksByAtrId,
	getContractListData,
	getBenchPayPlan,
	addContact,
	getInfoCi,
	searchExhInfo,
	getContacts,
	loginApi,
	addLink,
	serviceBook,
	getPayMentList,
	logoutApi,
	saveServiceBook,
	getBookingList,
	boothList,
	subscribeBooth,
	getExhBasicInfo,
	createBooth,
	modifyActorData,
	getPrivilegeList
}
