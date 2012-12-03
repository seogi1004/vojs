(function(e){var t=function(e,t,n){var r={},i={};var s=Array.prototype,o=s.slice,u=s.forEach;var a={"\\":"\\","'":"'",r:"\r",n:"\n",t:"	",u2028:"\u2028",u2029:"\u2029"};for(var f in a)a[a[f]]=f;var l=/\\|'|\r|\n|\t|\u2028|\u2029/g,c=/\\(\\|'|r|n|t|u2028|u2029)/g,h=/.^/;var p=function(e){return e.replace(c,function(e,t){return a[t]})};var d=r.each=r.forEach=function(e,t,n){if(e==null)return;if(u&&e.forEach===u){e.forEach(t,n)}else if(e.length===+e.length){for(var s=0,o=e.length;s<o;s++){if(s in e&&t.call(n,e[s],s,e)===i)return}}else{for(var a in e){if(r.has(e,a)){if(t.call(n,e[a],a,e)===i)return}}}};r.has=function(e,t){return hasOwnProperty.call(e,t)};r.defaults=function(e){d(o.call(arguments,1),function(t){for(var n in t){if(e[n]==null)e[n]=t[n]}});return e};r.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};r.template=function(e,t,n){n=r.defaults(n||{},r.templateSettings);var i="__p+='"+e.replace(l,function(e){return"\\"+a[e]}).replace(n.escape||h,function(e,t){return"'+\n_.escape("+p(t)+")+\n'"}).replace(n.interpolate||h,function(e,t){return"'+\n("+p(t)+")+\n'"}).replace(n.evaluate||h,function(e,t){return"';\n"+p(t)+"\n;__p+='"})+"';\n";if(!n.variable)i="with(obj||{}){\n"+i+"}\n";i="var __p='';"+"var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n"+i+"return __p;\n";var s=new Function(n.variable||"obj","_",i);if(t)return s(t,r);var o=function(e){return s.call(this,e,r)};o.source="function("+(n.variable||"obj")+"){\n"+i+"}";return o};return r.template(e,t,n)};var n=function(e,n,r,i){if(typeof e!="object")throw new Error("VOJS_CRITICAL_ERR: is not an object");if(typeof n!="string")throw new Error("VOJS_CRITICAL_ERR: is not an template id");if(typeof r!="string")throw new Error("VOJS_CRITICAL_ERR: is not an target id");var s=$("#"+n);if(s.attr("type")!="text/template")throw new Error("VOJS_CRITICAL_ERR: is not a template tag");var o="VOJS_"+(new Date).getTime();var u=$.extend({viewId:o},i),a=t(s.html(),u),f=r?$("#"+r):$("body");if(a.indexOf("<script")!=-1)throw new Error("VOJS_CRITICAL_ERR: script tag should not be used");if(f.size()==0)throw new Error("VOJS_CRITICAL_ERR: the target does not exist");return{viewId:o,targetSel:f,tplHtml:a}};var r=function(e,t){function s(e){if(e.value==undefined||e.tagName.toUpperCase()=="BUTTON")return true;return false}function o(){if(!e){if(s(t))r="html";else r="value"}else{if(e.indexOf(".")!=-1){var n=e.split(".");r=n[0];i=n[1]}else{r="css";i=e}}}var n=$(t);var r=0,i="";this.run=function(e){var t={html:function(){if(e)n.html(e);else return n.html()},value:function(){if(e)n.val(e);else return n.val()},css:function(){if(e)n.css(i,e);else return n.css(i)},attr:function(){if(e)n.attr(i,e);else return n.attr(i)}};return t[r]()};o()};var i=function(e){function i(){var e=$(n.root);s(e);u(e);a(e);f(e)}function s(e){e.on("click","[data-act]",function(e){o("click",e)});e.on("mousedown","[data-act]",function(e){o("mousedown",e)});e.on("mouseup","[data-act]",function(e){o("mouseup",e)});e.on("dblclick","[data-act]",function(e){o("dblclick",e)});e.on("change","[data-act]",function(e){o("change",e)});e.on("keydown","[data-act]",function(e){o("keydown",e)});e.on("keyup","[data-act]",function(e){o("keyup",e)})}function o(e,t){var r=t.currentTarget;var i=l($(r).data("act"));var s=i.func,o=i.key,u=i.type?i.type:"click";if(u==e){if(!o){if(n.act[s]){n.act[s].call(n,t)}else{}}else{if(n.act[s]){n.act[s].call(n,t,o)}else{}}}}function u(e){var t=[],n=[];var r=e.find("[data-bind]");r.each(function(e){var i=$(this),s=i.data("bind"),o=c(s);var u=o.length>0?o:[o];for(var a in u){var f=u[a];if(!f.key){n.push({name:f.func,elem:this})}else{t.push({func:f.func,key:f.key,data:i.get(0)})}}if(r.size()==e+1){d(t);p(n)}})}function a(e){var t=[];var r=e.find("[data-tag],[id]");r.each(function(e){var i=$(this),s=false,o=i.data("tag"),u=l(o);if(u.type){throw new Error("VOJS_TAG_ERR: invalid expression")}if(typeof o!="string"){o=this.id;s=true}if(o.indexOf(":")==-1||s){n.tag[o]=i.get(0)}else{t.push({func:u.func,key:u.key,data:i.get(0)})}if(r.size()==e+1){for(var e in t){if(!n.tag[t[e].func]){n.tag[t[e].func]=new Object}n.tag[t[e].func][t[e].key]=t[e].data}}})}function f(e){$("body").find("script[type*=template]").each(function(r){var i=$(this).data("tpl"),s="body",o="";if(!i)return;if(i.indexOf(":")==-1){o=i}else{var f=i.split(":"),s="#"+f[0],o=f[1]}var l=$(s).find("[data-tpl="+o+"]").not("script"),c=$(this).html();var h=function(){var n=l,r=arguments[0];if(typeof r=="string"){n=e.find("#"+arguments[0]);r=arguments[1]?arguments[1]:{};o=arguments[0]}n.html(t(c,r));u(n);a(n);return n.get(0)};n.tpl[o]=h})}function l(e){var t=null,n=null,r=null;if(e){if(e.indexOf("#")!=-1){var i=e.split("#");r=i[1],e=i[0]}if(e.indexOf(":")!=-1){var i=e.split(":");t=i[1],n=i[0]}else{n=e}}return{key:t,func:n,type:r}}function c(e){if(e.indexOf(",")!=-1){if(e.indexOf(":")!=-1)throw new Error("VOJS_BIND_ERR: bind array keys can not be used");var t=e.split(","),n=new Array;for(var r in t){n.push(l(t[r]))}return n}return l(e)}function h(e,t,n){var i=$(t).data("bind"),s=c(i),o=s.length>0?s:[s];for(var u in o){var a=o[u];if(a.func==e){(new r(a.type,t)).run(n)}}}function p(e){var t=new Object;for(var r in e){var i=e[r];if(!t[i.name])t[i.name]=[];t[i.name].push(i.elem)}for(var s in t){(function(e){n.bindMultiProc=function(n){var r=t[e];for(var i=0;i<r.length;i++){var s=r[i];h(e,s,n)}return r.length>1?r:r[0]}})(s);n.bind[s]=n.bindMultiProc}}function d(e){for(var t in e){var r=e[t].func;(function(t){n.funcMultiProc=function(n,r){var s=i(e,t,n);h(t,s,r);return s}})(r);function i(e,t,n){for(var r in e){var i=e[r];if(i.func==t&&i.key==n){return i.data}}}n.bind[r]=n.funcMultiProc}}function v(e,t,n){function o(e){return(new r(e.cmd.type,e.elem)).run()}var i="[data-"+e+"]"+(e=="tag"?",#"+t:""),s=[];$(i).each(function(n){var r=$(this).data(e);if(e=="tag"&&!r)r=this.id;var i=l(r);if(t==i.func){s.push({cmd:i,elem:this})}});return function(e){if(e.length==1&&!e[0].cmd.key){if(n)return e[0].elem;else return o(e[0])}else{var r=new Object,i=0;for(var s=0;s<e.length;s++){var u=e[s].cmd;if(u.key){t=u.key}else{t=i;i++}if(n)r[t]=e[s].elem;else r[t]=o(e[s])}return r}}(s)}var n=this;n.root=e?$("#"+e).get(0):$("body").get(0),n.act={},n.bind={},n.tag={},n.tpl={};n.bind.get=function(e){return v("bind",e,true)};n.tag.get=function(e){return v("tag",e,true)};n.act.get=function(e){return v("act",e,true)};n.bind.val=function(e){return v("bind",e,false)};n.tag.val=function(e){return v("tag",e,false)};n.act.val=function(e){return v("act",e,false)};n.destroy=function(){n.close();$(n.root).remove()};n.close=function(){$(n.root).off();for(var e in this){delete this[e]}};i()};i.applyTo=function(e,t){if(typeof e!="object")throw new Error("VOJS_CRITICAL_ERR: is not an object");$.extend(e,new i(t))};i.appendTo=function(e,t,r,s){var o=n(e,t,r,s);o.targetSel.append(o.tplHtml);i.applyTo(e,o.viewId)};i.prependTo=function(e,t,r,s){var o=n(e,t,r,s);o.targetSel.prepend(o.tplHtml);i.applyTo(e,o.viewId)};i.includeTpl=function(){var e=i.includePath?i.includePath:"",t=i.includeExt?i.includeExt:"tpl",n=arguments.length;if(typeof arguments[n-1]=="object"){var r=arguments[n-1];e=r.path?r.path:e;t=r.ext?r.ext:t}for(var s in arguments){var o=arguments[s],u="",a="body";if(typeof o=="string"){if(o.indexOf(":")!=-1){var f=o.split(":"),a="#"+f[0],u=e+"/"+f[1]+"."+t}else{u=e+"/"+o+"."+t}$.ajax({url:u,method:"GET",async:false,success:function(e){$(a).append(e)}})}}};i.template=function(e,n,r){return t(e,n,r)};e.vo=i})(window)