/* 新增展商中的列表项 */
const exhibitorList = [{
		title: '展商名称',
		selectText: '',
		isSelect: false,
		isSign: true,
		isDisabled: false,
		isType: 'text',
		id: 0,
		mode: ""
	},
	{
		title: '展商简称',
		selectText: '',
		isSelect: false,
		isSign: false,
		isDisabled: false,
		isType: 'text',
		id: 1,
		mode: "",
	},
	{
		title: '电话',
		selectText: '',
		isSelect: false,
		isSign: false,
		isDisabled: false,
		isType: 'number',
		id: 2,
		mode: "",
	},
	{
		title: '邮箱',
		selectText: '',
		isSelect: false,
		isSign: false,
		isDisabled: false,
		isType: 'text',
		id: 3,
		mode: ""
	},
	{
		title: '国家',
		selectText: '选择国家',
		isSelect: true,
		isSign: false,
		isDisabled: true,
		isType: 'text',
		id: 4,
		mode: "selector"
	},
	{
		title: '省份',
		selectText: '选择省份',
		isSelect: true,
		isSign: false,
		isDisabled: true,
		isType: 'text',
		id: 5,
		mode: "selector"
	},
	{
		title: '城市',
		selectText: '选择城市',
		isSelect: true,
		isSign: false,
		isDisabled: true,
		isType: 'text',
		id: 6,
		mode: "selector"
	},
	{
		title: '产品类别',
		selectText: '选择产品类别',
		isSelect: true,
		isSign: false,
		isDisabled: true,
		isType: 'text',
		id: 7,
		mode: "selector"
	},
	{
		title: '行业',
		selectText: '选择行业',
		isSelect: true,
		isSign: false,
		isDisabled: true,
		isType: 'text',
		id: 8,
		mode: "selector"
	}
]
/* 新增联络人 */
const liaisonsList = [{
		title: '姓名',
		selectText: '姓名',
		isSelect: false,
		isSign: true,
		isDisabled: false,
		isType: 'text',
		id: 0,
		mode: ""
	},
	{
		title: '称谓',
		selectText: '选择称谓',
		isSelect: true,
		isSign: false,
		isDisabled: false,
		isType: 'text',
		id: 1,
		mode: "selector"
	},
	{
		title: '职务',
		selectText: '',
		isSelect: false,
		isSign: false,
		isDisabled: false,
		isType: 'text',
		id: 2,
		mode: ""
	},
	{
		title: '地址',
		selectText: '',
		isSelect: false,
		isSign: false,
		isDisabled: false,
		isType: 'text',
		id: 3,
		mode: ""
	},
	{
		title: '邮编',
		selectText: '',
		isSelect: false,
		isSign: false,
		isDisabled: false,
		isType: 'text',
		id: 4,
		mode: ""
	},
	{
		title: '电话',
		selectText: '',
		isSelect: false,
		isSign: true,
		isDisabled: false,
		isType: 'text',
		id: 5,
		mode: ""
	},
	{
		title: '手机号',
		selectText: '选择下次联络时间',
		isSelect: false,
		isSign: false,
		isDisabled: false,
		isType: 'text',
		id: 6,
		mode: ""
	},
	{
		title: '国家',
		selectText: '选择国家',
		isSelect: true,
		isSign: false,
		isDisabled: true,
		isType: 'text',
		id: 7,
		mode: "selector"
	},
	{
		title: '省份',
		selectText: '选择省份',
		isSelect: true,
		isSign: false,
		isDisabled: true,
		isType: 'text',
		id: 8,
		mode: "selector"
	},
	{
		title: '城市',
		selectText: '选择城市',
		isSelect: true,
		isSign: false,
		isDisabled: true,
		isType: 'text',
		id: 9,
		mode: "selector"
	},
	{
		title: '县城',
		selectText: '县城',
		isSelect: true,
		isSign: false,
		isDisabled: true,
		isType: 'text',
		id: 10,
		mode: "selector"
	}
]
const contactList = [{
		title: '联络人',
		selectText: '',
		isSelect: true,
		isSign: true,
		isDisabled: true,
		isType: 'text',
		id: 0,
		mode: "selector",
		placeholder: "选择联络人"
	},
	{
		title: '联络方式',
		selectText: '',
		isSelect: true,
		isSign: true,
		isDisabled: true,
		isType: 'text',
		id: 1,
		mode: "selector",
		placeholder: "选择联络方式"
	},
	{
		title: '销售进度（%）',
		selectText: '',
		isSelect: true,
		isSign: true,
		isDisabled: true,
		isType: 'text',
		id: 2,
		mode: "selector",
		placeholder: "选择销售进度"
	},
	{
		title: '预估面积(m2)',
		selectText: '',
		isSelect: false,
		isSign: false,
		isDisabled: false,
		isType: 'text',
		id: 3,
		mode: "",
		placeholder: ""
	},
	{
		title: '预估金额',
		selectText: '',
		isSelect: false,
		isSign: false,
		isDisabled: false,
		isType: 'text',
		id: 4,
		mode: "",
		placeholder: ""
	},
	{
		title: '下次联络时间',
		selectText: '',
		isSelect: true,
		isSign: true,
		isDisabled: true,
		isType: 'text',
		id: 5,
		mode: "dateTime",
		placeholder: "选择下次联络时间"
	}
]
/* 新增联络中的联络方式 */
const contactWay = [{
	opt: '电话',
	value: '电话'
}, {
	opt: '传真',
	value: '传真'
}, {
	opt: 'Email',
	value: 'Email'
}]


const bootList = [{
		title: '展位号',
		selectText: '',
		isSelect: false,
		isSign: true,
		isDisabled: false,
		isType: 'text',
		id: 0
	},
	{
		title: '展位类型',
		selectText: '选择展位类型',
		isSelect: true,
		isSign: true,
		isDisabled: true,
		isType: 'text',
		id: 1
	},
	{
		title: '价格类别',
		selectText: '选择价格类别',
		isSelect: true,
		isSign: true,
		isDisabled: true,
		isType: 'number',
		id: 2
	},
	{
		title: '所属展厅',
		selectText: '选择所属展厅',
		isSelect: true,
		isSign: true,
		isDisabled: true,
		isType: 'text',
		id: 3
	},
	{
		title: '所属展商',
		selectText: '',
		isSelect: false,
		isSign: false,
		isDisabled: true,
		isType: 'text',
		id: 4
	}
]

const priceInfo = [{
		title: '长(m)',
		selectText: '',
		isSelect: false,
		isSign: true,
		isDisabled: false,
		isType: 'number',
		id: "price0"
	},
	{
		title: '宽(m)',
		selectText: '',
		isSelect: false,
		isSign: true,
		isDisabled: false,
		isType: 'number',
		id: "price1"
	},
	{
		title: '面积(㎡)',
		selectText: '',
		isSelect: false,
		isSign: true,
		isDisabled: true,
		isType: 'number',
		id: "price2"
	},
	{
		title: '人民币价格(元)',
		selectText: '0',
		isSelect: false,
		isSign: true,
		isDisabled: true,
		isType: 'number',
		id: "price3"
	}
]

const exhibitorStatus = [{
	opt: "不限",
	value: 0
}, {
	opt: "未联系",
	value: 1
}, {
	opt: "已联系",
	value: 2
}, {
	opt: "已预定",
	value: 3
}, {
	opt: "已签约",
	value: 4
}, {
	opt: "部分付款",
	value: 5
}, {
	opt: "全部付款",
	value: 6
}]
/* 展位场所 */
const bthPlaceList = [{
	opt: '室内',
	value: '室内'
}, {
	opt: '室外',
	value: '室外'
}]
/* 销售进度 */
const rateProgress = [{
		opt: "不限",
		values: ""
	},
	{
		opt: 0,
		values: 0
	},
	{
		opt: 10,
		values: 10
	},
	{
		opt: 30,
		values: 30
	},
	{
		opt: 50,
		values: 40
	},
	{
		opt: 70,
		values: 70
	},
	{
		opt: 90,
		values: 90
	},
	{
		opt: 100,
		values: 100
	}
]

/* 销售进度 */
const rateProgres = [
	{
		opt: 0,
		values: 0
	},
	{
		opt: 10,
		values: 2
	},
	{
		opt: 30,
		values: 3
	},
	{
		opt: 50,
		values: 4
	},
	{
		opt: 70,
		values: 5
	},
	{
		opt: 90,
		values: 6
	},
	{
		opt: 100,
		values: 7
	}
]
export default {
	exhibitorList,
	liaisonsList,
	contactList,
	rateProgress,
	rateProgres,
	contactWay,
	bthPlaceList,
	exhibitorStatus
}
