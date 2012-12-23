/*! vojs v@1.2.3 | seogi1004.github.com/vojs */

(function(experts) {
	var getTemplate = function(text, data, settings) {
		var _ = {},
			breaker = {};
	
		var ArrayProto = Array.prototype,
			slice = ArrayProto.slice,
			nativeForEach = ArrayProto.forEach;
		
		var escapes = {
			'\\' : '\\',
			"'" : "'",
			'r' : '\r',
			'n' : '\n',
			't' : '\t',
			'u2028' : '\u2028',
			'u2029' : '\u2029'
		};
	
		for (var p in escapes)
		escapes[escapes[p]] = p;
		
		var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g,
			unescaper = /\\(\\|'|r|n|t|u2028|u2029)/g,
			noMatch = /.^/;
		
		var unescape = function(code) {
			return code.replace(unescaper, function(match, escape) {
				return escapes[escape];
			});
		};
	
		var each = _.each = _.forEach = function(obj, iterator, context) {
			if (obj == null)
				return;
			if (nativeForEach && obj.forEach === nativeForEach) {
				obj.forEach(iterator, context);
			} else if (obj.length === +obj.length) {
				for (var i = 0, l = obj.length; i < l; i++) {
					if ( i in obj && iterator.call(context, obj[i], i, obj) === breaker)
						return;
				}
			} else {
				for (var key in obj) {
					if (_.has(obj, key)) {
						if (iterator.call(context, obj[key], key, obj) === breaker)
							return;
					}
				}
			}
		};
	
		_.has = function(obj, key) {
			return hasOwnProperty.call(obj, key);
		};
	
		_.defaults = function(obj) {
			each(slice.call(arguments, 1), function(source) {
				for (var prop in source) {
					if (obj[prop] == null)
						obj[prop] = source[prop];
				}
			});
			return obj;
		};
	
		_.templateSettings = {
			evaluate : /<%([\s\S]+?)%>/g,
			interpolate : /<%=([\s\S]+?)%>/g,
			escape : /<%-([\s\S]+?)%>/g
		};
	
		_.template = function(text, data, settings) {
			settings = _.defaults(settings || {}, _.templateSettings);
	
			var source = "__p+='" + text.replace(escaper, function(match) {
				return '\\' + escapes[match];
			}).replace(settings.escape || noMatch, function(match, code) {
				return "'+\n_.escape(" + unescape(code) + ")+\n'";
			}).replace(settings.interpolate || noMatch, function(match, code) {
				return "'+\n(" + unescape(code) + ")+\n'";
			}).replace(settings.evaluate || noMatch, function(match, code) {
				return "';\n" + unescape(code) + "\n;__p+='";
			}) + "';\n";
	
			if (!settings.variable)
				source = 'with(obj||{}){\n' + source + '}\n';
	
			source = "var __p='';" + "var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n" + source + "return __p;\n";
	
			var render = new Function(settings.variable || 'obj', '_', source);
			if (data)
				return render(data, _);
			var template = function(data) {
				return render.call(this, data, _);
			};
	
			template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';
	
			return template;
		};
		
		return _.template(text, data, settings);
	}
	
	var getTplView = function(obj, tplId, targetId, args) {
		if(typeof(obj) != 'object') throw new Error("VOJS_CRITICAL_ERR: is not an object");
		if(typeof(tplId) != 'string') throw new Error("VOJS_CRITICAL_ERR: is not an template id");
		if(typeof(targetId) != 'string') throw new Error("VOJS_CRITICAL_ERR: is not an target id");
		
		var tpl = $("#" + tplId);
		if(tpl.attr("type") != "text/template") throw new Error("VOJS_CRITICAL_ERR: is not a template tag");
		
		var viewId = "VOJS_" + new Date().getTime();
		var params = $.extend({ viewId: viewId }, args),
			tplHtml = getTemplate(tpl.html(), params),
			targetSel = (targetId) ? $("#" + targetId) : $("body");
		
		if(tplHtml.indexOf("<script") != -1) throw new Error("VOJS_CRITICAL_ERR: script tag should not be used");
		if(targetSel.size() == 0) throw new Error("VOJS_CRITICAL_ERR: the target does not exist");
			
		return {
			viewId: viewId, targetSel: targetSel, tplHtml: tplHtml
		};
	}
	
	var ViewRouter = new function() {
		var voList = [],	
			funcList = null;
		
		function run(e) {
			if(!location.hash) return;
			var args = location.hash.replace("#", "").split("/");
			
			if(args.length < 1) { 
				throw new Error("VOJS_ROUTER_ERR: parameter does not exist");
			} else {
				var comm = getCommand(args);
				
				try {
					var obj = voList[comm.id],
						func = obj.act[comm.func];
					
					if(func) func.call(obj, e, comm.args);
					else throw new Error("VOJS_ROUTER_ERR: " + comm.func + " is not specified");
				} catch(e) {
					throw new Error("VOJS_ROUTER_ERR: " + comm.func + " is not defined");
				}
			}
		}
		
		function getCommand(args) {
			var mod = args.shift();
			
			if(mod.indexOf(":") != -1) {
				var tmp = mod.split(":");
				
				id = tmp[0];
				func = tmp[1];
			} else {
				id = "body";
				func = mod;
			}
				
			return {
				id: id,
				func: func,
				args: args
			};
		}
		
		this.init = function() {
			$(window).bind('hashchange', function(e) {
				run(e);
			}).trigger('hashchange');
		}
		
		this.insert = function(obj, id) {
			id = (id) ? id : "body";
			voList[id] = obj;
		}
	}
	
	var ViewData = function(type, elem) {
		var $sel = $(elem);
		var dataType = 0,
			dataAttr = "";
		
		function isTypeHtml(elem) {
			if(elem.value == undefined || elem.tagName.toUpperCase() == 'BUTTON')
				return true;
			
			return false;
		}
		
		function init() {
			if(!type) {
				if(isTypeHtml(elem)) dataType = "html";
				else dataType = "value";
			} else {
				if(type.indexOf(".") != -1) {
					var arr = type.split(".");
					
					dataType = arr[0];
					dataAttr = arr[1];
				} else {
					dataType = "css";
					dataAttr = type;
				}
			}
		}
		
		this.run = function(value) {
			var method = {
				"html": function() { 
					if(value) $sel.html(value);
					else return $sel.html();
				},
				"value": function() { 
					if(value) $sel.val(value);
					else return $sel.val();
				},
				"css": function() { 
					if(value) $sel.css(dataAttr, value);
					else return $sel.css(dataAttr);
				},
				"attr": function() { 
					if(value) $sel.attr(dataAttr, value);
					else return $sel.attr(dataAttr);
				}
			};
			
			return method[dataType]();
		}
		
		init();
	}
	
	var ViewObject = function(id) {
		var	self 		= this;
			self.root 	= (id) ? $("#" + id).get(0) : $("body").get(0),
			self.act 	= {},
			self.bind 	= {},
			self.tag	= {},
			self.tpl 	= {};
	
		function init() {
			var $root = $(self.root);
			
			initAct($root);
			initBind($root);
			initTag($root);
			initTpl($root);
		}
		
		function initAct(root) {
			root.on("click", 	"[data-act]", function(e) { initActProc("click", e); });
			root.on("mousedown","[data-act]", function(e) { initActProc("mousedown", e); });
			root.on("mouseup", 	"[data-act]", function(e) { initActProc("mouseup", e); });
			root.on("dblclick", "[data-act]", function(e) { initActProc("dblclick", e); });
			root.on("change",	"[data-act]", function(e) { initActProc("change", e); });
			root.on("keydown",	"[data-act]", function(e) { initActProc("keydown", e); });
			root.on("keyup", 	"[data-act]", function(e) { initActProc("keyup", e); });
		}
		
		function initActProc(type, e) {
			var elem = e.currentTarget;
			var command = getParseCommand($(elem).data('act'));
			
			var act = command.func,
				key = command.key,
				atype = (command.type) ? command.type : "click";
			
			if(atype == type) {
				if(!key) {
					if(self.act[act]) {
						self.act[act].call(self, e); 
					} else {
						//throw new Error("VOJS_ACT_ERR: " + act + " is not defined");
					}
				} else {
					if(self.act[act]) { 
						self.act[act].call(self, e, key); 
					} else { 
						//throw new Error("VOJS_ACT_ERR: " + act + " is not defined");
					}	
				}
			}
		}
		
		function initBind(root) {
			var funcList = [],
				bindList = [];
			var sel = root.find("[data-bind]");
			
			sel.each(function(i) {
				var $this = $(this),
					tmpComm = $this.data("bind"),
					tmpCommArr = getParseCommandArr(tmpComm);
					
				var commArr = (tmpCommArr.length > 0) ? tmpCommArr : [ tmpCommArr ];
					
				for(var j=0, len=commArr.length; j < len; j++) {
					var command = commArr[j];
					
					if(!command.key) {
						bindList.push({ name: command.func, elem: this });
					} else {
						funcList.push({ func: command.func, key: command.key, data: $this.get(0) });
					}
				}
				
				if(sel.size() == i + 1) {
					settingBindFunc(funcList);
					settingBindMulti(bindList);
				}
			});
		}
		
		function initTag(root) {
			var funcList = [];
			var sel = root.find("[data-tag],[id]");
	
			sel.each(function(i) {
				var $this = $(this),
					isId = false,
					tmp_func = $this.data("tag"),
					command = getParseCommand(tmp_func);
				
				if(command.type) { 
					throw new Error("VOJS_TAG_ERR: invalid expression"); 
				}
				
				if(typeof(tmp_func) != "string") { 
					tmp_func = this.id;
					isId = true;
				}
				
				if(tmp_func.indexOf(':') == -1 || isId) {
					self.tag[tmp_func] = $this.get(0);
				} else {
					funcList.push({ func: command.func, key: command.key, data: $this.get(0) });
				}
				
				if(sel.size() == i + 1) {
					for(var i=0, len=funcList.length; i < len; i++) {
						if(!self.tag[funcList[i].func]) {
							self.tag[funcList[i].func] = new Object();
						} 
							
						self.tag[funcList[i].func][funcList[i].key] = funcList[i].data;
					}
				}
			});
		}
		
		function initTpl(root) {
			$("body").find("script[type*=template]").each(function(i) {
				var key		= $(this).data("tpl" ),
					viewSel	= "body",
					id 		= "";
					
				if(!key) return;
				
				if(key.indexOf(":") == -1) { 
					id = key;
				} else {
					var tmpArr  = key.split(":"),
						viewSel = "#" + tmpArr[0],
						id 		= tmpArr[1];	
				}
					
				var $cont	 = $(viewSel).find("[data-tpl=" + id + "]").not("script"),
					$tplHtml = $(this).html();
				
				var tplFunc = function() {
					var sel	= $cont,
						obj = arguments[0];
					
					if(typeof(obj) == "string") {
						sel = root.find("#" + arguments[0]);
						obj = arguments[1] ? arguments[1] : {};
						id	= arguments[0];
					}
					
					sel.html(getTemplate($tplHtml, obj));
					
					initBind(sel);
					initTag(sel);
					
					return sel.get(0);
				}
				
				self.tpl[id] = tplFunc;
			});
		}
		
		/**
		 * data 속성의 value 파싱 함수
		 * 
		 * @param {String} command
		 */
		function getParseCommand(command) {
			var key = null, func = null, type = null;
			
			if(command) {
				if(command.indexOf('#') != -1) {
					var arr = command.split("#");
						type = arr[1],
						command = arr[0];
				}
				
				if(command.indexOf(':') != -1) {
					var arr = command.split(":");
						key = arr[1], 
						func = arr[0];
				} else {
					func = command;
				}
			}
				
			return {
				key		: key,
				func	: func,
				type	: type
			};
		}
		
		function getParseCommandArr(command) {
			if(command.indexOf(',') != -1) {
				if(command.indexOf(':') != -1) throw new Error("VOJS_BIND_ERR: bind array keys can not be used");
				
				var arr = command.split(","),
					commArr = new Array();
				
				for(var i=0, len=arr.length; i < len; i++) {
					commArr.push(getParseCommand(arr[i]));
				}
				
				return commArr;
			}
			
			return getParseCommand(command);
		}
		
		/**
		 * bind 태그일 경우, 
		 * 엘리먼트 유형에 따라 처리하는 함수
		 * 
		 * @param {Element} elem
		 * @param {String} value 
		 */
		function settingBindProc(func, elem, value) {
			var tmpComm = $(elem).data("bind"),
				tmpCommArr = getParseCommandArr(tmpComm),
				commArr = (tmpCommArr.length > 0) ? tmpCommArr : [ tmpCommArr ];
			
			for(var i=0, len=commArr.length; i < len; i++) {
				var comm = commArr[i];
				
				if(comm.func == func) {
					new ViewData(comm.type, elem).run(value);
				}
			}
		}	
		
		/**
		 * bind 태그일 경우, 
		 * 단일/멀티 유형에 따라 처리하는 함수
		 * 
		 * @param {Array} bindList
		 */
		function settingBindMulti(bindList) {
			var list = new Object();
			
			for(var i=0, len=bindList.length; i < len; i++) {
				var obj = bindList[i];
				if(!list[obj.name]) list[obj.name] = [];
				
				list[obj.name].push(obj.elem);
			}
			
			for(var func in list) {
				(function(func) {
					self.bindMultiProc = function(value) {
						var elemList = list[func];
						
						for(var j=0, len=elemList.length; j < len; j++) {
							var elem = elemList[j];
							
							settingBindProc(func, elem, value);
						}
						
						return (elemList.length > 1) ? elemList : elemList[0];
					}
				})(func);
				
				self.bind[func] = self.bindMultiProc;
			}
		}
		
		/**
		 * bind 태그 메소드 세팅 함수
		 * bind일 경우, settingBindProc 호출
		 * 
		 * @param {Array} funcList
		 */
		function settingBindFunc(funcList) {
			for(var i=0, len=funcList.length; i < len; i++) {
				var func = funcList[i].func;
				
				(function(func) {
					self.funcMultiProc = function(key, value) {
						var data = getFuncElem(funcList, func, key);
						settingBindProc(func, data, value);
						
						return data;
					};
				})(func);
				
				function getFuncElem(funcList, func, key) {
					for(var i=0, len=funcList.length; i < len; i++) {
						var obj = funcList[i];
						
						if(obj.func == func && obj.key == key) {
							return obj.data;
						}
					}
				}
				
				self.bind[func] = self.funcMultiProc;
			}
		}
		
		/**
		 * bind/tag/act, 엘리먼트 또는 데이터을 가져오는 메소드
		 * 
		 * @param {String} type
		 * @param {String} key
		 * @param {Boolean} is_elem
		 */	
		function _search(type, key, is_elem) {
			var sel	= "[data-" + type + "]" + ((type == "tag") ? ",#" + key : ""),
				cmdList = [];
			
			$(sel).each(function(i) {
				var cmd_str = $(this).data(type);
				if(type == "tag" && !cmd_str) cmd_str = this.id;
			
				var command = getParseCommand(cmd_str);
				if(key == command.func) {
					cmdList.push({ cmd: command, elem: this });
				}
			});
			
			function getData(data) {
				return new ViewData(data.cmd.type, data.elem).run();
			}
			
			return (function(cmdList) {
				if(cmdList.length == 1 && !cmdList[0].cmd.key) {
					if(is_elem) return cmdList[0].elem;
					else return getData(cmdList[0]);
					
				} else {
					var list = new Object(),
						index = 0;
					
					for(var i=0, len=cmdList.length; i < len; i++) {
						var cmd = cmdList[i].cmd;
						
						if(cmd.key) { key = cmd.key; } 
						else { key = index; index++; }
						
						if(is_elem) list[key] = cmdList[i].elem;
						else list[key] = getData(cmdList[i]);
					}
					
					return list;
				}
			})(cmdList);
		}
		
		//-- Search API
		self.bind.get 	= function(key) 	{ return _search("bind", key, true); }
		self.tag.get 	= function(key) 	{ return _search("tag",  key, true); }
		self.act.get 	= function(key) 	{ return _search("act",  key, true); }

		self.bind.val 	= function(key) 	{ return _search("bind", key, false); }
		self.tag.val 	= function(key) 	{ return _search("tag",  key, false); }
		self.act.val 	= function(key) 	{ return _search("act",  key, false); }
		
		//-- Memory Returned API
		self.destroy = function() {
			$(self.root).off().remove();
			self.close(true);
		}
		
		self.close = function(isOff) {
			if(!isOff) $(self.root).off();
			for(var key in this) { delete this[key]; }
		}
		
		//-- Initialization
		init();
	}
	
	ViewObject.applyTo = function(obj, id) {
		if(typeof(obj) != 'object') throw new Error("VOJS_CRITICAL_ERR: is not an object");
		var obj = $.extend(obj, new ViewObject(id));
		
		ViewRouter.insert(obj, id);
	}
	
	ViewObject.appendTo = function(obj, tplId, targetId, args) {
		var res = getTplView(obj, tplId, targetId, args);
		
		res.targetSel.append(res.tplHtml);	
		ViewObject.applyTo(obj, res.viewId);
	}
	
	ViewObject.prependTo = function(obj, tplId, targetId, args) {
		var res = getTplView(obj, tplId, targetId, args);
		
		res.targetSel.prepend(res.tplHtml);	
		ViewObject.applyTo(obj, res.viewId);
	}
	
	ViewObject.includeTpl = function() {
		var tpl_path = (ViewObject.includePath) ? ViewObject.includePath : "",
			tpl_ext = (ViewObject.includeExt) ? ViewObject.includeExt : "tpl",
			len = arguments.length;
			
		if(typeof(arguments[len - 1]) == "object") {
			var opts = arguments[len - 1];
			
			tpl_path = (opts.path) ? opts.path : tpl_path;
			tpl_ext = (opts.ext) ? opts.ext : tpl_ext;
		}
		
		for(var i=0, len=arguments.length; i < len; i++) {
			var tpl = arguments[i],
				url = "",
				sel = "body";
				
			if(typeof(tpl) == "string") {
				if(tpl.indexOf(":") != -1) {
					var arr = tpl.split(":"),
						sel = "#" + arr[0],
						url = tpl_path + "/" + arr[1] + "." + tpl_ext;			
				} else {
					url = tpl_path +  "/" + tpl + "." + tpl_ext;
				}
			    
			    $.ajax({ 
			        url: url, 
			        method: 'GET', 
			        async: false, 
			        success: function(data) { 
			        	$(sel).append(data);  
			        } 
				});
			}
		}
	}
	
	ViewObject.template = function(text, data, settings) {
		return getTemplate(text, data, settings);
	}
	
	ViewObject.router = function() {
		ViewRouter.init();
	}
	
	experts.vo = ViewObject;
})(window);