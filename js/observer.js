function Observer(data) {
	this.data = data
	this.walk(data)
}

Observer.prototype = {
	constructor: Observer,

	walk: function(data) {
		var me = this
		Object.keys(data).forEach(function(key) {
			me.convert(key, data[key])
		});
	},

	convert: function(key, val) {
		this.defineReactive(this.data, key, val)
	},

	defineReactive: function(data, key, val) {
		var dep = new Dep()
		// 首次加载递归，由深到浅的将数据变为响应式
		var childObj = observe(val)

		Object.defineProperty(data, key, {
			enumerable: true,
			configurable: false,
			get: function() {
				if (Dep.target) {
					dep.depend()
				}
				return val
			},
			set: function(newVal) {
				if (newVal === val) {
					return
				}
				val = newVal
				// 新值是object，转变为响应式
				childObj = observe(newVal)
				// 通知订阅者
				dep.notify()
			}
		})
	}
}

function observe(value, vm) {
	if (!value || typeof value !== 'object') {
		return
	}
	return new Observer(value)
}


var uid = 0

function Dep() {
	this.id = uid++
	this.subs = []
}

Dep.prototype = {
	addSub: function(sub) {
		this.subs.push(sub)
	},

	depend: function() {
		Dep.target.addDep(this)
	},

	removeSub: function(sub) {
		var index = this.subs.indexOf(sub)
		if (index != -1) {
			this.subs.splice(index, 1)
		}
	},

	notify: function() {
		this.subs.forEach(function(sub) {
			sub.update()
		})
	}
}

Dep.target = null;