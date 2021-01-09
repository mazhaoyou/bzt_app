import util from './util.js'
/* 
	毫秒转为正常格式时间过滤器 
	编写过滤器传入需要的时间格式，例如：yyyy-MM-dd hh:mm:ss或者yyyy年MM月dd日
	注意：月MM必须大写，目的为了区分月与分，其他都为小写
	时间格式定义：
		参数为0格式：yyyy-MM-dd hh:mm:ss 
		参数为1格式：yyyy-MM-dd 
		参数为2格式：hh:mm:ss 
		参数为3格式：yyyy年MM月dd日 hh时mm分ss秒
		参数为4格式：yyyy年MM月dd日 
		参数为5格式：hh时mm分ss秒
		参数为6格式：yyyy年MM月 
		参数为7格式：yyyy
		参数为8格式：yyyy/MM/dd 
		参数为9格式： hh:mm
		参数为10格式： MM-dd hh-mm
*/
const formatDate = (date, fmt) => {
	return util.formatDate(date,fmt)
};

/* 
	获取发送消息时间过滤器
	还用过滤器就可以实现转换
*/

const getFormatTime = (timestamp) => {
	var now = util.getUnix(); //当前时间戳
	var today = util.getTodayUnix(); //今天0点时间戳
	var year = util.getYearUnix(); //今年0点时间戳
	var timer = (now - timestamp) / 1000; // 转换为秒级时间戳
	var tip = '';

	if (timer <= 0) {
		tip = '刚刚';
	} else if (Math.floor(timer / 60) <= 0) {
		tip = '刚刚';
	} else if (timer < 3600) {
		tip = Math.floor(timer / 60) + '分钟前';
	} else if (timer >= 3600 && (timestamp - today >= 0)) {
		tip = Math.floor(timer / 3600) + '小时前';
	} else if (timer / 86400 <= 31) {
		tip = Math.ceil(timer / 86400) + '天前';
	} else {
		tip = util.getLastDate(timestamp);
	}
	return tip;
}



/* 钱格式化，保留两位小数 */
 const toDecimal2 = (x = 0) => {
    return util.toDecimal2(x)
}
const countDown = (insureTime, createTime) => {
	let date = insureTime - createTime;
	let days = Math.floor(date / (24 * 3600 * 1000));
	if (days <= 0){
		days = 0;
	}
	return days;
}

// 对于数据进行取绝对值处理
const absVal = (val) => {
	return Math.abs(val);
}
/* mpvue-picker 选择数据问题*/
const selectPicker = (item) =>{
	if (item.opt) {
		return item.opt;
	} else if (item.label){
		return item.label;
	}
}

// 超过一万显示W
const minllion = (val) => {
	let num;
	 if(val > 9999){//大于9999显示x.xx万
	    num = (Math.floor(val/1000)/10) + 'W';
	 } else {
	   num = val;
	 }
	  return num;
}
/* 输入数据检验 */
const alidationNum = (num,srjTotalNum) => {
	if(num > srjTotalNum){
	   util.toast("目前最多只能预订"+srjTotalNum +"个");
	   return srjTotalNum;
	} 
	 return num;
}

/**
 * 空字段保护
 * @param {any} field 需要检测的字段
 * @param {any} pField 待替换字段
 * */
const fieldProtaction = (field, pField) => {
	return util.fieldProtaction(field, pField)
}

export {
	formatDate,
	getFormatTime,
	toDecimal2,
	absVal,
	countDown,
	minllion,
	selectPicker,
	alidationNum,
	fieldProtaction
}
