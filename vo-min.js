(function(experts){var ViewObject=function(id){function init(){var a=$(self.root);initAct(a);initBind(a);initTag(a);initTpl(a)}function initAct(a){a.on("click","[data-act]",function(a){initActProc("click",a)});a.on("mousedown","[data-act]",function(a){initActProc("mousedown",a)});a.on("mouseup","[data-act]",function(a){initActProc("mouseup",a)});a.on("dblclick","[data-act]",function(a){initActProc("dblclick",a)});a.on("change","[data-act]",function(a){initActProc("change",a)});a.on("keydown","[data-act]",function(a){initActProc("keydown",a)});a.on("keyup","[data-act]",function(a){initActProc("keyup",a)})}function initActProc(a,b){var c=b.currentTarget;var d=getParseCommand($(c).data("act"));var e=d.func,f=d.key,g=d.type?d.type:"click";if(g==a){if(!f){if(self.act[e]){self.act[e].call(self,b)}else{throw new Error("VOJS_ACT_ERR: "+e+" is not defined")}}else{if(self.act[e]){self.act[e].call(self,b,f)}else{throw new Error("VOJS_ACT_ERR: "+e+" is not defined")}}}}function initBind(a){var b=[],c=[];var d=a.find("[data-bind]");d.each(function(a){var e=$(this),f=e.data("bind"),g=getParseCommand(f);if(!g.key){c.push({name:g.func,elem:this})}else{b.push({func:g.func,key:g.key,data:e.get(0)})}if(d.size()==a+1){settingBindFunc(b);settingBindMulti(c)}})}function initTag(root){var funcList=[];var sel=root.find("[data-tag],[id]");sel.each(function(i){var $this=$(this),isId=false,tmp_func=$this.data("tag"),command=getParseCommand(tmp_func);if(command.type){throw new Error("VOJS_TAG_ERR: invalid expression");return}if(typeof tmp_func!="string"){tmp_func=this.id;isId=true}if(tmp_func.indexOf(":")==-1||isId){eval("self.tag."+tmp_func+" = $this.get(0);")}else{funcList.push({func:command.func,key:command.key,data:$this.get(0)})}if(sel.size()==i+1){for(var i in funcList){if(!self.tag[funcList[i].func]){self.tag[funcList[i].func]=new Object}self.tag[funcList[i].func][funcList[i].key]=funcList[i].data}}})}function initTpl(root){root.find("script[type*=template]").each(function(i){var $this=$(this),$cont=root.find("[data-tpl="+this.id+"]"),id=this.id;var tplFunc=function(){var a=$cont,b=arguments[0];if(typeof b=="string"){a=root.find("#"+arguments[0]);b=arguments[1]?arguments[1]:{};id=arguments[0]}a.html(_.template($this.html(),b));initBind(a);initTag(a);if(self.tag[id]){self.tag[id]=a.get(0)}return a.get(0)};eval("self.tpl."+this.id+" = tplFunc;")})}function getParseCommand(a){var b=null,c=null,d=null;if(a){if(a.indexOf(":")!=-1){var e=a.split(":");b=e[0],c=e[1]}else{c=a}if(c.indexOf("#")!=-1){var e=c.split("#");c=e[0],d=e[1]}}return{key:b,func:c,type:d}}function settingBindProc(a,b){var c=getParseCommand($(a).data("bind")),d=c.type;if(!d){if(a.value==undefined)$(a).html(b);else $(a).val(b)}else{if(d.indexOf(".")!=-1){var e=d.split(".");if(e[0]=="css"){$(a).css(e[1],b)}else if(e[1]=="attr"){$(a).attr(e[1],b)}}else{$(a).css(d,b)}}}function settingBindMulti(a){var b=new Object;for(var c in a){var d=a[c];if(!b[d.name])b[d.name]=[];b[d.name].push(d.elem)}for(var e in b){(function(a){self.bindMultiProc=function(c){var d=b[a];for(var e in d){var f=d[e];settingBindProc(f,c)}return d.length>1?d:d[0]}})(e);self.bind[e]=self.bindMultiProc}}function settingBindFunc(a){for(var b in a){var c=a[b].func;(function(b){self.funcMultiProc=function(c,e){var f=d(a,b,c);settingBindProc(f,e);return f}})(c);function d(a,b,c){for(var d in a){var e=a[d];if(e.func==b&&e.key==c){return e.data}}}self.bind[c]=self.funcMultiProc}}function _search(a,b,c){function f(a){if(a.value==undefined)return $(a).html();else return $(a).val()}function g(b){var c=b.cmd,d=b.elem;if(a=="bind"){if(!c.type){return f(d)}else{if(c.type.indexOf(".")!=-1){var e=c.type.split(".");if(e[0]=="css"){return $(d).css(e[1])}else if(e[1]=="attr"){return $(d).attr(e[1])}}else{return $(d).css(c.type)}}}else{return f(d)}}var d="[data-"+a+"]"+(a=="tag"?",#"+b:""),e=[];$(d).each(function(c){var d=$(this).data(a);if(a=="tag"&&!d)d=this.id;var f=getParseCommand(d);if(b==f.func){e.push({cmd:f,elem:this})}});return function(a){if(a.length==1&&!a[0].cmd.key){if(c)return a[0].elem;else return g(a[0])}else{var d=new Object,e=0;for(var f in a){if(typeof a[f]!="function"){var h=a[f].cmd;if(h.key){b=h.key}else{b=e;e++}if(c)d[b]=a[f].elem;else d[b]=g(a[f])}}return d}}(e)}var self=this;self.root=id?$("#"+id).get(0):$("body").get(0),self.act={},self.bind={},self.tag={},self.tpl={};self.bind.get=function(a){return _search("bind",a,true)};self.tag.get=function(a){return _search("tag",a,true)};self.act.get=function(a){return _search("act",a,true)};self.bind.val=function(a){return _search("bind",a,false)};self.tag.val=function(a){return _search("tag",a,false)};self.act.val=function(a){return _search("act",a,false)};init()};ViewObject.applyTo=function(a,b){_.extend(a,new ViewObject(b))};ViewObject.includeTpl=function(){var a=ViewObject.includePath?ViewObject.includePath:"",b=ViewObject.includeExt?ViewObject.includeExt:"tpl",c=arguments.length;if(typeof arguments[c-1]=="object"){var d=arguments[c-1];a=d.path?d.path:a;b=d.ext?d.ext:b}for(var e in arguments){var f=arguments[e],g="",h="body";if(typeof f=="string"){if(f.indexOf(":")!=-1){var i=f.split(":"),h="#"+i[0],g=a+"/"+i[1]+"."+b}else{g=a+"/"+f+"."+b}$.ajax({url:g,method:"GET",async:false,success:function(a){$(h).append(a)}})}}};experts.vo=ViewObject})(window)