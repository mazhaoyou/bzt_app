/**
 * 数字转换汉字-只保留整数位
 * */
export function fNumber (v) {
  var value = Math.abs(v)
  var zthousand = '千'
  var qzmillion = '千万'
  var zmillion = '万'
  var zbillion = '亿'
  var zt = '万亿'
  if (value < 10000) {
    return value
  } else if (value >= 1000 && value < 10000) {
    return (value / 1000) + zthousand
  } else if (value >= 10000 && value < 100000000) {
    if ((value / 10000) >= 1000) {
      return (value / 10000 / 1000) + qzmillion
    }
    return (value / 10000) + zmillion
  } else if (value >= 100000000 && value < 1000000000000) {
    return (value / 100000000) + zbillion
  } else if (value >= 1000000000000) {
    return (value / 1000000000000) + zt
  }
  return Math.abs(value)
}

/**
 * 数字转换汉字-保留小数点儿后两位
 * */
export function fNumberToFixed (v) {
  var value = Math.abs(v)
  var zthousand = '千'
  var qzmillion = '千万'
  var zmillion = '万'
  var zbillion = '亿'
  var zt = '万亿'
  if (value < 10000) {
    return value
  } else if (value >= 1000 && value < 10000) {
    return (value / 1000).toFixed(2) + zthousand
  } else if (value >= 10000 && value < 100000000) {
    if ((value / 10000) >= 1000) {
      return (value / 10000 / 1000).toFixed(2) + qzmillion
    }
    return (value / 10000).toFixed(2) + zmillion
  } else if (value >= 100000000 && value < 1000000000000) {
    return (value / 100000000).toFixed(2) + zbillion
  } else if (value >= 1000000000000) {
    return (value / 1000000000000).toFixed(2) + zt
  }
  var number = Math.abs(value)
  return isNaN(number) ? '--' : number
}

/**
 * 千分格式化
 */
export function toQf (num) {
  num = num + ''
  num = num.replace(/[ ]/g, '')
  if (num === '') {
    return
  }
  if (isNaN(num)) {
    return
  }
  var index = num.indexOf('.')
  var reg = /(-?\d+)(\d{3})/
  if (index === -1) {
    while (reg.test(num)) {
      num = num.replace(reg, '$1,$2')
    }
  } else {
    var intPart = num.substring(0, index)
    var pointPart = num.substring(index + 1, num.length)
    while (reg.test(intPart)) {
      intPart = intPart.replace(reg, '$1,$2')
    }
    num = intPart + '.' + pointPart
  }
  return num
}

/** 时间戳处理 */
export function getYesterdayDate () {
  var time = new Date().getTime()
  var yesterday = new Date(time - 24 * 3600 * 1000)
  return yesterday
}
export function add0 (m) {
  return m < 10 ? '0' + m : m
}
export function formatTimeStamp (timestamp) {
  var time = new Date(timestamp)
  var y = time.getFullYear()
  var m = time.getMonth() + 1
  var d = time.getDate()
  var h = time.getHours()
  var mm = time.getMinutes()
  var s = time.getSeconds()
  return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s)
}

export function formatDayStamp (timestamp) {
  var time = new Date(timestamp)
  var y = time.getFullYear()
  var m = time.getMonth() + 1
  var d = time.getDate()
  return y + '-' + add0(m) + '-' + add0(d)
}

/** 浅copy */
export function copy (initalObj) {
  var obj = {}
  for (var i in initalObj) {
    obj[i] = initalObj[i]
  }
  return obj
}

/** 深拷贝 */
export function deepCloneTime (time) {
  var obj = time.getTime()
  var _obj = JSON.stringify(obj)
  var objClone = new Date(JSON.parse(_obj))
  return objClone
}

/** 最简单数组去重法 */
export function duplicateRemove (array) {
  var n = []
  for (var i = 0; i < array.length; i++) {
    if (n.indexOf(array[i]) === -1) n.push(array[i])
  }
  return n
}

export function showPop (title, content) {
	// 向 popup 传递消息
	uni.$emit('page-popup', {
		title: title,
		content: content
	});
	const subNVue = uni.getSubNVueById('popup')
	subNVue.show('slide-in-top', 250)
}
