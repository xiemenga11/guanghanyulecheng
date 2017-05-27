//xxx.removeChild(obj) xxx是所删除节点的父节点
// xxx.removeNode(true) xxx是所要删除的节点： 只有IE有效；   替代：xxx.parentNode.removeChild(xxx);
(function(w){
	//bom window对象
	var win={
		// 返回窗口的宽度
		wid:function(){
			return window.innerWidth
				|| document.documentElement.clientWidth
				|| document.body.clientWidth;
		},
		// 返回窗口的高度
		hei:function(){
			return window.innerHeight
				|| document.documentElement.clientHeight
				|| document.body.clientHeight;
		},
		// 返回屏幕的高度
		screenHei:function(){
			return screen.availHeight;
		},
		// 返回屏幕的宽度
		screenWid:function(){
			return screen.availWidth;
		},
		/*
		返回或设置window的地址
		url: string 要设置的地址
		return: string window的location
		如果传了地址则设置，如果没传则返回
		*/
		url:function(url){
			if(url){
				window.location.href=url;
			}else{
				return window.location.href;
			}
		},

		/*
		将窗口滚动条滚动到指定坐标
		y: int 竖坐标
		x: int 横坐标； 默认：0
		*/
		scrollTo:function(y,x){
			var x=x||0;
			var y=isNum(y)?y:l(y).offset("Top");
			window.scrollTo(x,y);
		},
		/*
		将窗口滚动条滚动指定距离
		y: int 竖向滚动距离
		x: int 横向滚动距离； 默认：0
		*/
		scrollBy:function(y,x){
			var x=x||0;
			window.scrollBy(x,y);
		},
		//还有BUG  需要修复   
		//问题：每次都要从顶部开始往下移，而不是从现在的位置滚动到指定位置
		/*
		动画滚动到指定坐标
		y: int 竖坐标
		x: int 横坐标； 默认：0
		time: int 滚动时间，单位：毫秒 ； 默认：70毫秒
		*/
		aniScrollTo:function(y,x,time){
			var time=time||70;
			var x=x||0;
			var y=isNum(y)?y:l(y).offset("Top");
			var hei=l("body[1]").css("height").toInt();
			var step=y;
			var top=0;
			var timer=setInterval(function(){
				if(top<y){
					win.scrollTo(top);
					if(step>1){
						step/=2;
					}
					top+=step;
					console.log(top)
				}else{
					top=y;
					win.scrollTo(top);
					clearInterval(timer);
				}
			},time)		},
		/*
		动画滚动移动指定距离
		y: int 竖向滚动距离
		x: int 横横向滚动距离； 默认：0
		time: int 滚动时间，单位：毫秒 ； 默认：70毫秒
		*/	
		aniScrollBy:function(y,x,time){
			var time=time||70;
			var x=x||0;
			var step=y;
			var top=0;
			// var timer;
			var timer=setInterval(function(){
				if(y>0){
					if(top<y){
						if(step>1){
							step/=2;
						}else{
							step=1;
						}
						win.scrollBy(step);
						top+=step;
					}else{
						clearInterval(timer);
					}
				}else{
					if(top>y){
						if(step<1){
							step/=2;
						}else{
							step=-1;
						}
						win.scrollBy(step);
						top+=step;
					}else{
						clearInterval(timer);
					}
				}
			},time);

		},
		/*
		滚动到文档顶部
		time:int 滚动时间，单位：毫秒； 默认：70毫秒
		*/
		toTop:function(time){
			var time=time||70;
			win.aniScrollBy(-l("body[1]").css("height").toInt(),0,time);
		},
		/*
		滚动到文档底部
		time:int 滚动时间，单位：毫秒； 默认：70毫秒
		*/
		toBottom:function(time){
			var time=time||70;
			win.aniScrollBy(l("body[1]").css("height").toInt(),0,time);
		}
	}
	// L 核心函数
	/*
	元素选择器
	selector: string||obj 元素选择条件||元素DOM
	context: obj 元素条件的父元素
	return :返回一个核心对象
	*/
	function _l(selector,context){
		var selector=selector||document.body;
		if(typeof selector ==="string"){
			var s=selector.split(" ");
			var c=context||false;
			if(s.length==1){
				this.obj=dom(selector,context);
			}else{
				this.obj=dom(s[1],dom(s[0]));
				if(s.length>2){
					for(var i=2; i<s.length; i++){
						this.obj=dom(s[i],this.obj);
					}
				}
			}
		}else if(typeof selector ==="object"){
			this.obj=selector;
		}
		return this;
	}
	_l.prototype={
		/*
		设置或返回元素的css
		attr:string||object 返回attr指定的值||设置attr指定的值
		*/
		css:function(attr){
			if(typeof attr === "string"){
				if(this.obj.currentStyle){
					return this.obj.currentStyle[attr];
				}else{
					return getComputedStyle(this.obj,false)[attr];
				}
			}else if(typeof attr==="object"){
				for(var i in attr){
					this.obj.style[i]=attr[i];
				}
				return this;
			}
		},
		/*
		设置或返回元素的属性
		attr:string||object 返回attr指定属性的值||设置attr指定属性的值
		*/
		attr:function(attr){
			if(typeof attr === "string"){
				return this.obj[attr];
			}else{
				for(var i in attr){
					this.obj[i]=attr[i]
				}
				return this;
			}
		},
		/*
		设置或返回元素的innerHTML
		text:string 如果传了则元素的innerHTML等于text;否则返回元素的innerHTML
		add:string "add"||"push" ;如果等于add则在innerHTML前添加text,如果等于push则在innerHTML后添加text,否则则用text代替innerHTML
		return:string 元素的innerHTML;
		*/
		html:function(text,add){
			if(text){
				this.obj=html(this.obj,text,add);
				return this;
			}else{
				return html(this.obj,text);
			}
		},
		/*
		设置或返回元素的value
		value: string 是设置的值
		return: string 元素的value
		如果传入了value则设置value，否则返回元素的value
		*/
		val:function(value){
			if(value||value==0||typeof value==="number"||typeof value==="string"){
				this.obj.value=value;
				return this;
			}else{
				return this.obj.value;
			}
		},
		/*
		遍历元素数组
		callback:function 为没一个元素调用的函数
		*/
		each:function(callback){
			for(var i=0; i<this.obj.length; i++){
				callback(this.obj[i],i);
			}
		},
		/*
		为元素添加监听事件
		event：string 事件类型
		callback: function 事件调用的函数
		*/
		listen:function(event,callback){
			if(this.obj.addEventListener){
				this.obj.addEventListener(event,callback);
			}else{
				this.obj.attachEvent("on"+event,callback);
			}
			return this;
		},
		/*
		获取元素的offset值
		attr:string 返回指定的offset值； attr的首字母必须大写
		return: int 指定的offset值；
		*/
		offset:function(attr){
			return this.obj["offset"+attr];
		},
		//这个也有问题    还没找到问题所在，稍后修复
		//问题：在插入多个子元素的时候，会跳一个插入，而不是连续插入
		/*
		添加元素
		data字段{
			tag:string 要添加的元素标签名
			child:string||domobject||object 添加的元素的内容||添加到元素的元素||要添加到元素的数组
			css:object 添加的元素的css;
			attr:object 添加的元素的属性；
			callback: function 添加元素的监听事件
			insertBefore: int||domobject 如果传了则添加到指定内部子元素[int]的前面||添加到内部domobject前面；如果不传则添加到后面
			dom:domobject 添加的DOM元素，不传tag的话，就添加这个dom元素
		}
		return:domobject 返回添加的元素对象
		*/
		addDom:function(data){
			var css=css||false;
			var cObj=false;
			var obj;
			if(data.tag){
				obj=document.createElement(data.tag);
				if(typeof data.child==="string"){
					cObj=document.createTextNode(data.child);
					obj.appendChild(cObj);
				}else if(typeof data.child==="object"){
					cObj=data.child.obj;
					if(isDom(cObj)){
						obj.appendChild(cObj);
					}else{
						for(var i=0; i<cObj.length; i++){
							obj.appendChild(cObj[i]);
						}
					}
				}
			}else{
				obj=data.dom;
			}
			if(data.css){
				l(obj).css(data.css);
			}
			if(data.attr){
				for(var j in data.attr){
					obj[j]=data.attr[j];
				}
			}
			if(data.callback){
				data.callback(obj);
			}
			if(data.insertBefore||data.insertBefore===0){
				if(typeof data.insertBefore==="number"){
					this.obj.insertBefore(obj,this.obj.childNodes[data.insertBefore]);
				}else{
					this.obj.insertBefore(obj,data.insertBefore)
				}
			}else{
				this.obj.appendChild(obj);
			}
			return obj;
		},
		/*
		隐藏元素
		time:int 隐藏元素的interval时间；单位：毫秒； 如果传了则动画隐藏，否则直接隐藏
		remove:bool 隐藏后是否移除，true移除；false||不传  则不移除
		*/
		hide:function(time,remove){
			if(time){
				var opacity=1;
				var This=this;
				var timer=setInterval(function(){
					if(opacity>0){
						opacity-=0.1;
					}else{
						opacity=0;
						clearInterval(timer);
						This.obj.style.display="none";
						if(remove===true){
							This.obj.parentNode.removeChild(This.obj);
						}
					}
					This.obj.style.opacity=opacity;
					This.obj.style.filter="alpha(opacity="+opacity*100+")";
				},time)
			}else{
				this.obj.style.display="none";
				if(remove===true){
					this.obj.parentNode.removeChild(this.obj);
				}
			}
		},
		/*
		显示元素
		time:int 显示元素的interval时间；单位：毫秒； 如果传了则动画显示，否则直接显示
		type:string 显示后元素的display的属性；默认：block
		*/
		show:function(time,type){
			var type=type||"block";
			if(time){
				var opacity=0;
				var This=this;
				var timer=setInterval(function(){
					
					if(opacity<1){
						opacity+=0.1;
					}else{
						clearInterval(timer);
						opacity=1;
					}
					l(This.obj).css({
						"display":type,
						"opacity":opacity,
						"filter":"alpha(opacity="+opacity*100+")"
					})
				},time)
			}else{
				l(this.obj).css({
					"opacity":1,
					"filter":"alpha(opacity=100)",
					"display":type
				})
			}
		},
		/*
		添加遮罩层
		config字段{
			transParent:bool 是否继承父元素的宽高 true继承   false|| 不传   则不继承遮罩层默认为窗口的宽高
			css:object 遮罩层的css
			child:string ||domobject 添加到遮罩层的文字||添加到遮罩层的domobject
			callback:function 遮罩层的监听事件
		}
		遮罩层的默认高度为窗口高度
		遮罩层的默认宽度为窗口宽度
		遮罩层的默认lineheight为窗口高度
		*/
		mask:function(config){
			var css={
				"backgroundColor":"rgba(0,0,0,0.5)",
				"position":"fixed",
				"top":0,
				"left":0,
				"color":"white",
				"textAlign":"center",
				"lineHeight":win.hei()+"px",
				"fontSize":"50px",
				"fontWeight":"bold",
				"width":win.screenWid()+"px",
				"height":win.screenHei()+"px"
			};
			if(config.transParent===true){
				css.width=this.offset("Width")+"px";
				css.lineHeight=css.height=this.offset("Height")+"px";
				css.position="absolute";
				this.css({"position":"relative"});
			}
			if(config.css){
				for(var i in config.css){
					css[i]=config.css[i];
				}
			}
			var o=this.addDom({
				tag:"div",
				child:config.child,
				css:css,
				callback:config.callback
			})
			return o;
		},
		/*
		移除元素
		obj:domobject 是移除的子元素
		如果传了obj则移除当前元素的子元素obj,如果不传则移除当前元素自身
		*/
		remove:function(obj){
			if(obj){
				this.obj.removeChild(obj);
				return this;
			}else{
				this.obj.parentNode.removeChild(this.obj);
			}
		},
		/*
		元素闪烁
		time:int 闪烁间隔时间； 单位：毫秒   默认：500毫秒
		*/
		twinkle:function(time){
			var This=this;
			var time=time||500;
			setInterval(function(){
				if(This.css("opacity")==1||This.css("filter")=="alpha(opacity=100)"){
					This.css({
						"opacity":0,
						"filter":"alpha(opacity=0)"
					});
				}else{
					This.css({
						"opacity":1,
						"filter":"alpha(opacity=100)"
					})
				}
				
			},time)
			return this;
		},
		marquee:function(){
			this.obj.addDom({
				tag:"marquee",
				child:l(this.clone())
			})
		},
		/*
		toast
		text:string 要toast的字符串
		position:string toast的位置；默认居中50%； 
		可以选字符：top||center||middle||bottom ;如果不传则为50%；如果传了则位置为传入的位置
		*/
		toast:function(text,position){
			var po;
			if(position){
				switch(position){
					case "center":
						po="50%";
						break;
					case "middle":
						po="50%";
						break;
					case "top":
						po="5%";
						break;
					case "bottom":
						po="90%";
						break;
					default:
						po=position;
						break;
				}
			}else{
				po="50%";
			}
			var css={
				"position":"fixed",
				"backgroundColor":"rgba(0,0,0,0.5)",
				"color":"white",
				"top":po,
				"padding":"10px",
				"borderRadius":"5px"
			}
			var obj=l().addDom({
				tag:"div",
				child:text,
				css:css
			})
			var w=l(obj).offset("Width");
			l(obj).css({
				"left":(win.wid()-w)/2+"px"
			})
			setTimeout(function(){
				l(obj).hide(10,true);
			},2000)
		},
		//还有问题     但不想弄了    等会儿再弄
		drag:function(){
			var move,
				sX,
				sY,
				mX,
				mY,
				oX=this.offset("Left"),
				oY=this.offset("Top"),
				obj=this.obj;
			this.listen("mousedown",function(e){
				var e=e||event;
				sX=e.clientX;
				sY=e.clientY;
				alert(oX+":"+oY);
				l(obj).css({
					"position":"fixed",
					"left":"10px",
					"top":"10px"
				});
				l().listen("mousemove",move=function(e){
					var e=e||event;
					mX=e.clientX-sX;
					mY=e.clientY-sY;
					l(obj).css({
						"top":l(obj).offset("Top")+mY+"px",
						"left":l(obj).offset("Left")+mX+"px"
					})
				})
			}).listen("mouseup",function(e){
				var e=e||event;
				l().obj.removeEventListener("mousemove",move);
			})
		},
		/*
		设置或返回元素的data
		data:string||object 返回元素的data值||设置元素的data
		如果不传则返回指定的data值
		*/
		data:function(data){
			if(data&&typeof data==="object"){
				for(var i in data){
					this.obj.dataset[i]=data[i];
				}
				return this;
			}else{
				return this.obj.dataset[data];
			}
		},
		//功能还不完善，还要改进，
		//目前只能获取到子元素，而不能进行chaining调用
		//使用子元素还要用for循环调用，有点麻烦
		child:function(){
			return this.obj.childNodes;
		},
		/*
		克隆元素
		deep:bool||string  true克隆元素和它的内容,false只克隆元素不克隆内容；不传则默认为false||如果传入string，则克隆元素并将内容替换为deep
		return:克隆后的元素
		*/
		clone:function(deep){
			if(typeof deep==="string"){
				var o=this.obj.cloneNode(deep);
				l(o).html(deep);
				return o;
			}else{
				return this.obj.cloneNode(deep);
			}
		},

		store:function(data){
			if(!window.localStorage){
				return;
			}
			if(typeof data==="string"){
				if(localStorage[data]){
					return localStorage[data];
				}else{
					return false;
				}
			}else{
				for(var i in data){
					localStorage[i]=data[i];
				}
				return this;
			}
		}
	}
	var l=w.l=function(selector){
		return new _l(selector);
	}
	w.win=win;
	//原生对像的原型
	// Object.prototype.css=function(attr){
	// 	return css(this,attr);
	// }
	// Object.prototype.html=function(text){
	// 	return html(this,text);
	// }
	// Object.prototype.listen=function(event,callback){
	// 	if(this.addEventListener){
	// 		this.addEventListener(event,callback);
	// 	}else{
	// 		this.attachEvent("on"+event,callback);
	// 	}
	// 	return this;
	// }
	function _o(object){
		this.obj=object;
		return this;
	}
	var o=w.o=function(object){
		return new _o(object);
	}
	_o.prototype={
		/*
		遍历array
		callback:function 每一个元素的监听事件
		*/
		each:function(callback){
			for(var i in this.obj){
				callback(this.obj[i],i)
			}
		}
	}
	// 将boolean和number转换为string
	Boolean.prototype.toStr=Number.prototype.toStr=function(){
		return String(this);
	}
	// alert数据
	Boolean.prototype.alt=Number.prototype.alt=String.prototype.alt=function(){
		alert(this)
	}
	//将字符串转换为int
	String.prototype.toInt=function(){
		return parseInt(this);
	}
	//将字符串转换为float
	String.prototype.toFloat=function(){
		return parseFloat(this);
	}
	// 将float转换到四舍五入到指定位数
	Number.prototype.fixed=function(point){
		var point=point||1;
		return this.toFixed(point)*1;
	}
	// toast字符串
	String.prototype.toast=function(position){
		l().toast(String(this),position);
	}
	// 删除字符串的空白字符
	String.prototype.trim=function(){
		var reg=/\s/g;
		return this.replace(reg,"");
	}
	// 判断字符串是否在数组内
	String.prototype.inArray=function(array){
		return inArray(this,array);
	}
	// 将字符串转换为JSON对象
	String.prototype.toJson=function(chain){
		var chain=chain||false;
		if(chain===true){
			return o(strToJson(this));
		}else{
			return strToJson(this);
		}
	}
}(window))
function dom(selector,context){
	var context=context||document;
	var idReg=/#\S+/g;
	var claReg=/\.\S+/g;
	var tagReg=/\S+/g;
	var index=/\[\d+\]/g;
	var j=false;
	var obj;
	if(selector.match(index)){
		j=selector.match(index);
		j=parseInt(j[0].replace(/(\[|\])/g,""))-1;
		selector=selector.replace(index,"");
	}	
	if(selector.match(idReg)){
		obj= context.getElementById(selector.replace("#",""));
	}else if(selector.match(claReg)){
		obj= context.getElementsByClassName(selector.replace(".",""));
	}else{
		obj= context.getElementsByTagName(selector);
	}
	if(j!==false){
		return obj[j];
	}else{
		return obj;
	}
}
function css(obj,attr){
	if(typeof attr === "string"){
		if(obj.currentStyle){
			return obj.currentStyle[attr];
		}else{
			return getComputedStyle(obj,false)[attr];
		}
	}else if(typeof attr==="object"){
		for(var i in attr){
			obj.style[i]=attr[i];
		}
		return obj;
	}
}
function html(obj,text,add){
	if(text&&(typeof text==="string"||typeof text==="number")){
		if(add=="add"){
			obj.innerHTML=text+obj.innerHTML;
		}else if(add=="push"){
			obj.innerHTML+=text;
		}else{
			obj.innerHTML=text;
		}
		return obj;
	}else if(text&&typeof text==="object"){
		o(text).each(function(text){
			var a=add||"push";
			html(obj,text,a);
		})
	}else{
		return obj.innerHTML;
	}
}

//is 系列函数
// 是否是dom object
function isDom(obj){
	if( typeof HTMLElement === 'object' ){
		return obj instanceof HTMLElement;
	}else{
		return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
	}
}
// 是否是object
function isObj(obj){
	return typeof obj==="object";
}
// 是否是number
function isNum(obj){
	return typeof obj==="number";
}
//----------------------------------------------------------
// 重载刷新文档
function reload(){
	window.location.reload();
}
// 后退
function goBack(){
	history.back();
}
// 清楚事件冒泡
function canncelBubble(e){
	window.event? window.event.cancelBubble = true : e.stopPropagation();
}
// 判断给定字符串是否在给定的数组内
function inArray(search,array){
	for(var i in array){
		if(search==array[i]){
			return true;
		}
	}
	return false;
}
// ajax
/*
con字段{
	url:ajax地址
	progress:bool 是否显示progress，默认不显示
	timeout：int 单位秒，默认10秒
	method：string get||post；默认：get
	data:object method为post时传入的数据；默认：null
	type:string 返回数据的格式 text||json；默认为text
	suc:function 成功时调用的函数
	fail:function 失败是调用的函数
}
*/
function ajax(con){
	var xml;
	var progress=false;
	var timer=false;
	var config={
		method:"get",
		timeout:10,
		showProgress:false,
		data:null,
		type:"text"
	}
	for(var i in con){
		config[i]=con[i]
	}
	if(window.XMLHttpRequest){
		xml=new XMLHttpRequest();
	}else{
		xml=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xml.onreadystatechange=function(){
		if(xml.readyState==4&&xml.status==200){
			clearTimeout(timer);
			if(progress!==false){
				l(progress).hide(false,true);
				progress=false;
			}
			var response;
			if(config.type==="text"){
				response=xml.responseText
			}else{
				response=xml.responseText.toJson();
			}
			config.suc(response);
		}else{
			if(config.showProgress&&progress===false){
				progress=l().addDom({
					tag:"div",
					child:config.showProgress,
					css:{
						"backgroundColor":"rgba(0,0,0,0.5)",
						"color":"white",
						"padding":"10px",
						"position":"fixed",
						"top":"50%",
						"borderRadius":"5px"
					}
				})
				var left=(win.wid()-l(progress).offset("Width"))/2+"px";
				l(progress).css({"left":left});
			}
			if(timer===false){
				timer=setTimeout(function(){
					if(progress!==false){
						l(progress).hide(false,true);
						progress=false;
					}
					var err={
						"state":xml.readyState,
						"status":xml.status
					}
					config.fail(err)
				},config.timeout*1000)
			}
		}
	}
	if(config.method.toLowerCase()=="post"){
		xml.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	}
	xml.open(config.method,config.url,true);
	xml.send(config.data);
}
// 将字符串转换为JSON对象
/*
str: string 要转换的字符串
return : 转换后得到的对象
*/
function strToJson(str){
	if(window.JSON){
		return JSON.parse(str);
	}else{
		return (new Function("return"+str))()
	}
}
function shuffle(arr){
	return arr.sort(function(){return 0.5-Math.random()});
}






