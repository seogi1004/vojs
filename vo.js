/*! vojs v@1.1.0 | seogi1004.github.com/vojs */

(function(experts) {
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
			root.on("click", "[data-act]", function(e) {
				initActProc("click", e);
			});
			
			root.on("mousedown", "[data-act]", function(e) {
				initActProc("mousedown", e);
			});
			
			root.on("mouseup", "[data-act]", function(e) {
				initActProc("mouseup", e);
			});

			root.on("dblclick", "[data-act]", function(e) {
				initActProc("dblclick", e);
			});

			root.on("change", "[data-act]", function(e) {
				initActProc("change", e);
			});

			root.on("keydown", "[data-act]", function(e) {
				initActProc("keydown", e);
			});
			
			root.on("keyup", "[data-act]", function(e) {
				initActProc("keyup", e);
			});
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
						throw new Error("VOJS_ACT_ERR: " + act + " is not defined");
					}
				} else {
					if(self.act[act]) { 
						self.act[act].call(self, e, key); 
					} else { 
						throw new Error("VOJS_ACT_ERR: " + act + " is not defined");
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
					func = $this.data("bind"),
					command = getParseCommand(func);
				
				if(!command.key) {
					bindList.push({ name: command.func, elem: this });
				} else {
					funcList.push({ func: command.func, key: command.key, data: $this.get(0) });
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
				
				//-- command type가 있을 경우, 예외처리
				if(command.type) { 
					throw new Error("VOJS_TAG_ERR: invalid expression"); 
				}
				
				// data-tag 태그가 없고, id일 경우
				if(typeof(tmp_func) != "string") { 
					tmp_func = this.id;
					isId = true;
				}
				
				// id는 멀티를 지원하지 않음
				if(tmp_func.indexOf(':') == -1 || isId) {
					self.tag[tmp_func] = $this.get(0);
				} else {
					funcList.push({ func: command.func, key: command.key, data: $this.get(0) });
				}
				
				// 멀티 태그일 경우, 배열 형태로 세팅
				if(sel.size() == i + 1) {
					for(var i in funcList) {
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
					
				var $cont	 = $(viewSel).find("[data-tpl=" + id + "]"),
					$tplHtml = $(this).html();
				
				var tplFunc = function() {
					var sel	= $cont,
						obj = arguments[0];
					
					// 결과 값을 입력할 엘리먼트의 id가 있을 경우
					if(typeof(obj) == "string") {
						sel = root.find("#" + arguments[0]);
						obj = arguments[1] ? arguments[1] : {};
						id	= arguments[0];
					}
					
					//  tpl 갱신
					sel.html(_.template($tplHtml, obj));
					
					// bind/tag 갱신
					initBind(sel);
					initTag(sel);
					
					// 템플릿 대상 tag를 갱신
					if(self.tag[id]) { 
						self.tag[id] = sel.get(0);
					}
					
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
				// type이 있을 경우,
				if(command.indexOf('#') != -1) {
					var arr = command.split("#");
						type = arr[1],
						command = arr[0];
				}
				
				// key가 있을 경우,
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
		
		/**
		 * bind 태그일 경우, 
		 * 엘리먼트 유형에 따라 처리하는 함수
		 * 
		 * @param {Element} elem
		 * @param {String} value 
		 */
		function settingBindProc(elem, value) {
			var command = getParseCommand($(elem).data("bind")),
				type = command.type;
				
			if(!type) {
				if(elem.value == undefined) 
					$(elem).html(value);
				else 			
					$(elem).val(value);
			} else {
				if(type.indexOf(".") != -1) {
					var arr = type.split(".");
					
					if(arr[0] == "css") {
						$(elem).css(arr[1], value);
					} else if(arr[1] == "attr") {
						$(elem).attr(arr[1], value);
					}
				} else {
					$(elem).css(type, value);
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
			
			for(var i in bindList) {
				var obj = bindList[i];
				if(!list[obj.name]) list[obj.name] = [];
				
				list[obj.name].push(obj.elem);
			}
			
			for(var func in list) {
				(function(func) {
					self.bindMultiProc = function(value) {
						var elemList = list[func];
						
						for(var j in elemList) {
							var elem = elemList[j];
							
							settingBindProc(elem, value);
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
			for(var i in funcList) {
				var func = funcList[i].func;
				
				(function(func) {
					self.funcMultiProc = function(key, value) {
						var data = getFuncElem(funcList, func, key);
						settingBindProc(data, value);
						
						return data;
					};
				})(func);
				
				function getFuncElem(funcList, func, key) {
					for(var i in funcList) {
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
			
			function getDataElem(elem) {
				if(elem.value == undefined) 
					return $(elem).html();
				else 			
					return $(elem).val();
			}
			
			function getData(data) {
				var cmd = data.cmd,	elem = data.elem;
					
				if(type == "bind") {
					if(!cmd.type) {
						return getDataElem(elem);
					} else {
						if(cmd.type.indexOf(".") != -1) {
							var arr = cmd.type.split(".");
							
							if(arr[0] == "css") {
								return $(elem).css(arr[1]);
							} else if(arr[1] == "attr") {
								return $(elem).attr(arr[1]);
							}
						} else {
							return $(elem).css(cmd.type);
						}
					}
				} else {
					return getDataElem(elem);
				}
			}
			
			return (function(cmdList) {
				//-- cmdList가 한개이고, key가 없을 경우 순수 데이터만 반환
				if(cmdList.length == 1 && !cmdList[0].cmd.key) {
					if(is_elem) return cmdList[0].elem;
					else return getData(cmdList[0]);
					
				//-- cmdList가 여러개 일때, cmd.key의 유무에 따라 다르게 처리
				} else {
					var list = new Object(),
						index = 0;
					
					for(var i in cmdList) {
						if(typeof(cmdList[i]) != "function") {
							var cmd = cmdList[i].cmd;
							
							if(cmd.key) { key = cmd.key; } 
							else { key = index; index++; }
							
							if(is_elem) list[key] = cmdList[i].elem;
							else list[key] = getData(cmdList[i]);
						}
					}
					
					return list;
				}
			})(cmdList);
		}
		
		//--
		//
		
		self.bind.get 	= function(key) 	{ return _search("bind", key, true); }
		self.tag.get 	= function(key) 	{ return _search("tag",  key, true); }
		self.act.get 	= function(key) 	{ return _search("act",  key, true); }

		self.bind.val 	= function(key) 	{ return _search("bind", key, false); }
		self.tag.val 	= function(key) 	{ return _search("tag",  key, false); }
		self.act.val 	= function(key) 	{ return _search("act",  key, false); }
		
		
		//--
		
		init();
	}
	
	var getTplView = function(obj, tplId, opts) {
		if(typeof(tplId) != 'string') throw new Error("VOJS_CRITICAL_ERR: is not an tplId");
		
		var tpl = $("#" + tplId);
		if(tpl.attr("type") != "text/template") throw new Error("VOJS_CRITICAL_ERR: is not a template tag");
		
		var viewId = "_" + new Date().getTime() + "_",
			tplHtml = _.template(tpl.html(), _.extend({ viewId: viewId }, (opts && opts.params) ? opts.params : { })),
			targetSel = (opts && opts.targetId) ? $("#" + opts.targetId) : $("body");
		
		if(tplHtml.indexOf("<script") != -1) throw new Error("VOJS_CRITICAL_ERR: script tag should not be used");
		if(targetSel.size() == 0) throw new Error("VOJS_CRITICAL_ERR: the target does not exist");
			
		return {
			viewId: viewId, targetSel: targetSel, tplHtml: tplHtml
		};
	}
	
	ViewObject.applyTo = function(obj, id) {
		if(typeof(obj) != 'object') throw new Error("VOJS_CRITICAL_ERR: is not an object");
		
		_.extend(obj, new ViewObject(id));
	}
	
	ViewObject.appendTo = function(obj, tplId, opts) {
		var res = getTplView(obj, tplId, opts);
		
		res.targetSel.append(res.tplHtml);	
		ViewObject.applyTo(obj, res.viewId);
	}
	
	ViewObject.prependTo = function(obj, tplId, opts) {
		var res = getTplView(obj, tplId, opts);
		
		res.targetSel.prepend(res.tplHtml);	
		ViewObject.applyTo(obj, res.viewId);
	}
	
	ViewObject.includeTpl = function() {
		var tpl_path = (ViewObject.includePath) ? ViewObject.includePath : "",
			tpl_ext = (ViewObject.includeExt) ? ViewObject.includeExt : "tpl",
			len = arguments.length;
			
		// 옵션 체크, 마지막 파라메터가 객체일 경우
		if(typeof(arguments[len - 1]) == "object") {
			var opts = arguments[len - 1];
			
			tpl_path = (opts.path) ? opts.path : tpl_path;
			tpl_ext = (opts.ext) ? opts.ext : tpl_ext;
		}
		
		for(var i in arguments) {
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
	
	experts.vo = ViewObject;
})(window);