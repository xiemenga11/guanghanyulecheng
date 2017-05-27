(function(){
/*--------------定义数据----------------------------------------------------------------------------------------*/
	//统计用的数据
//	var playwin=l().store("playwin")?l().store("playwin").toInt():0;
//	var playlose=l().store("playlose")?l().store("playlose").toInt():0;
//	var playdraw=l().store("playdraw")?l().store("playdraw").toInt():0;
//	var gameCount=l().store("gameCount")?l().store("gameCount").toInt():0;
//	var playWinScore=l().store("playWinScore")?l().store("playWinScore").toInt():0;
//	var playLoseScore=l().store("playLoseScore")?l().store("playLoseScore").toInt():0;
//	var gameCountObj=l("#gameCount");
//	var playdrawObj=l("#playdraw");
//	var playwinObj=l("#playwin");
//	var playloseObj=l("#playlose");
//	var playWinScoreObj=l("#playWinScore");
//	var playLoseScoreObj=l("#playLoseScore");


	// var lianziCount=0;
	var playdisabed=false;
	var won=l("#won");//得分历史
	var winScore=l("#winScore");
	var gameStep=0;//检测游戏进行到哪一步
	var hold=l("#holdBox .hold");
//	var reset=l("#reset");
	var pokers=l("#picBox img");
	var play=l("#play");
	var score=l("#score");
	var bet=l("#betHandle");
	var his=l("#msgBox")
	var dashunzi=false;//判断大清用
	var wutong=false;//五同750
	var tonghuada=false;//同花大顺250
	var tonghua=false;//同花顺120
	var sitong=false;//四同60
	var hulu=false;//葫芦10
	var tonghua=false;//同花7
	var shunzi=false;//顺子5
	var santong=false;//三同3
	var liangdui=false;//两对2
	var yidui=false;//一对1，大于8的
	var plus=0;//得分倍数
	//扑克数组
	var pokerArr=[
		"h_1",
		"h_2",
		"h_3",
		"h_4",
		"h_5",
		"h_6",
		"h_7",
		"h_8",
		"h_9",
		"h_10",
		"h_11",
		"h_12",
		"h_13",
		"t_1",
		"t_2",
		"t_3",
		"t_4",
		"t_5",
		"t_6",
		"t_7",
		"t_8",
		"t_9",
		"t_10",
		"t_11",
		"t_12",
		"t_13",
		"y_1",
		"y_2",
		"y_3",
		"y_4",
		"y_5",
		"y_6",
		"y_7",
		"y_8",
		"y_9",
		"y_10",
		"y_11",
		"y_12",
		"y_13",
		"f_1",
		"f_2",
		"f_3",
		"f_4",
		"f_5",
		"f_6",
		"f_7",
		"f_8",
		"f_9",
		"f_10",
		"f_11",
		"f_12",
		"f_13"
	];
	//牌型名字
	var comboName={
		750:"五同",
		250:"同花大顺",
		120:"同花顺",
		60:"四同",
		10:"葫芦",
		7:"同花",
		5:"顺子",
		3:"三同",
		2:"两对",
		1:"一对"
	}
	pokerArr=shuffle(pokerArr);
	//翻开的牌的数组
	var curPokerArr=[];
	var betScore=bet.val().toInt();//防止押分后再修改倍数

	//读取本地储存的分数
	var localScore=l().store("score")&&l().store("score").toInt()!=0?l().store("score"):1000;
	score.val(localScore);

/*-------------操作-----------------------------------------------------------------------------------------*/
	//键盘操作
//	document.onkeydown=function(e){
//		var e=e||event;
//		if(playdisabed==true){
//			return;
//		}
//		if(e.key=="Enter"||e.key=="Spacebar"){
//			playgame();
//		}else{
//			var obj=l(pokers.obj[e.key-1]);
//			if(obj.data("hold")==0){
//				obj.data({
//					"hold":1
//				})
//			}else{
//				obj.data({
//					"hold":0
//				})
//			}
//			if(hold.obj[e.key-1].innerHTML=="留牌"){
//				hold.obj[e.key-1].innerHTML="";
//			}else{
//				hold.obj[e.key-1].innerHTML="留牌";
//			}
//		}
//	}
	//选择要留的牌
	pokers.each(holdPoker);
	hold.each(holdPoker);
	function holdPoker(obj,i){
		var obj=l(obj);
		obj.listen("click",function(){
			if(hold.obj[i].innerHTML=="留牌"){
				hold.obj[i].innerHTML="";
				hold.obj[i].style.opacity=0;
			}else{
				hold.obj[i].innerHTML="留牌";
				hold.obj[i].style.opacity=1;
			}
			if(pokers.obj[i].dataset.hold==0){
//				obj.data({
//					"hold":1
//				})
				pokers.obj[i].dataset.hold=1
			}else{
//				obj.data({
//					"hold":0
//				})
				pokers.obj[i].dataset.hold=0
			}
		})
	}
	//翻牌
	play.listen("click",playgame);

	//充值
//	reset.listen("click",function(){
//		score.val(1000);
//	})

/*------------游戏函数------------------------------------------------------------------------------------------*/


	//游戏初始化
	function gameInit(){
		pokerArr=shuffle(pokerArr);
		pokerArr=shuffle(pokerArr);
		gameStep=0;//检测游戏进行到哪一步
		//初始化牌型
		plus=0;//得分倍数
		wutong=false;//五同750
		tonghuada=false;//同花大顺250
		tonghua=false;//同花顺120
		sitong=false;//四同60
		hulu=false;//葫芦10
		tonghua=false;//同花7
		shunzi=false;//顺子5
		santong=false;//三同3
		liangdui=false;//两对2
		yidui=false;//一对1，大于8的
		// curPokerArr=[];
		//初始化扑克，使每一张扑克显示为背面
		pokers.each(function(obj,i){
			obj.src="../image/bg.png";
		})
		//留牌清空
		holdClear();

		play.val("启动");

	}
	//执行游戏初始化
	gameInit();
/*---------逻辑判断---------------------------------------------------------------------------------------------*/

function gameover(){
	if(score.val().toInt()==0){
		return true;
	}
	return false;
}
//留牌清空
function holdClear(){
	hold.each(function(obj,i){
		l(obj).html(" ");
		obj.style.opacity=0;
	})
	pokers.each(function(obj,i){
		l(obj).data({"hold":0});
	})
}
//牌型判断
function just(){
	var lianziCount=0;//检验牌有多少连续
	var tongCount=0;
	var tong=[];//主要是用来检测是两对还是三同
	var h=[];
	var s=[];
	for(var i=0; i<curPokerArr.length; i++){
		h[i]=curPokerArr[i][0];
		s[i]=curPokerArr[i][1].toInt();
	}
	h.sort();
	s.sort(function(a,b){return a-b});
	//判断五同
	if(s[0]==s[1]&&s[0]==s[2]&&s[0]==s[3]&&s[0]==s[4]){
		console.log("wutong");
		wutong=true;
	}

	//判断同花
	if(h[0]==h[1]&&h[0]==h[2]&&h[0]==h[3]&&h[0]==h[4]){
		console.log("tonghua");
		tonghua=true;
	}

	//判断逻辑
	for(var i=0; i<s.length-1; i++){
		if(s[i]+1==s[i+1]){
			lianziCount++;
		}
		if(s[i]==s[i+1]){
			if(!inArray(s[i],tong)){
				tong.push(s[i]);
			}
			tongCount++;
		}
	}
	//判断顺子
	if(lianziCount==4){
		console.log("shunzi");
		shunzi=true;
	}
	//有A的顺子
	if(lianziCount==3&&s[0]==1&&s[1]==10){
		console.log("shunzi");
		dashunzi=true;
		shunzi=true;
	}
	//四同
	if(tongCount==3&&tong.length==1){
		console.log("sitong");
		sitong=true;
	}
	//三同
	if(tongCount==2&&tong.length==1){
		console.log("santong");
		santong=true;
	}
	//葫芦
	if(tongCount==3&&tong.length==2){
		console.log("hulu");
		hulu=true;
	}
	//两对
	if(tongCount==2&&tong.length==2){
		console.log("liangdui");
		liangdui=true;
	}
	//一对
	if(tongCount==1&&tong.length==1){
		if(tong[0]>=8||tong[0]==1){
			console.log("yidui");
			yidui=true;
		}
	}
}
//倍数判断
function plusJust(){
	if(yidui==true){
		plus=1;
	}
	if(liangdui==true){
		plus=2;
	}
	if(santong==true){
		plus=3;
	}
	if(shunzi==true){
		plus=5;
	}
	if(tonghua==true){
		plus=7;
	}
	if(hulu==true){
		plus=10;
	}
	if(sitong==true){
		plus=60;
	}
	if(shunzi==true&&tonghua==true){
		plus=120;
	}
	if(shunzi==true&&tonghua==true&&dashunzi==true){
		plus=250;
	}
	if(wutong==true){
		plus=750;
	}
}

function playgame(){


		//游戏开始时初始化游戏
		if(gameStep==0){
			betScore=bet.val().toInt();//防止押分后再修改倍数
			gameInit();
			//打乱扑克数组
			pokerArr=shuffle(pokerArr);
			if(gameover()) {
				"您没有积分了".toast(); return;//游戏结束就没有反应
			}
			//判断押的是否超分
			if(betScore>score.val().toInt()){
				betScore=score.val().toInt();
				bet.val(betScore);
				l("#bet").html(betScore);
			}
			//减去押分
			score.val(score.val().toInt()-betScore);
		}
		//换牌阶段，换牌后判断牌型
		if(gameStep==1){
			play.obj.disabled=true;
			playdisabed=true;
			pokers.each(function(obj,i){
				var obj=l(obj);
				if(obj.data("hold")==0){
					obj.obj.src="../image/bg.png";
					setTimeout(function(){
						obj.attr({"src":"../image/"+pokerArr[i+6].replace("_","")+".png"});
					},300);
					curPokerArr[i]=pokerArr[i+6].split("_");
				}
			})
			setTimeout(function(){
				play.obj.disabled=false;
				playdisabed=false;
			},300)
			//----test-start----
			// curPokerArr=[
			// 	["f","2"],
			// 	["h","10"],
			// 	["h","10"],
			// 	["h","5"],
			// 	["h","4"]
			// ];
			//----test-end-----

			//判断牌型
			just();
			//判断倍数
			plusJust();
			//计算得分
			if(plus!=0){
				setTimeout(function(){
//					addHis(comboName[plus]+"　赢得：　"+plus*betScore,"#00dd00");
					his.html("<b style='color:#33dd33'>" + comboName[plus] + "</b>  赢得  <b style='color:gold;'>" + plus * betScore + "</b><br/>" + his.html())//在MSGBOX输出得分结果
					comboName[plus].toast("top");
					winScore.val(plus*betScore);
					play.val("得分");
				},300)
				//统计
//				if(plus==1){
//					playdraw++
//				}else{
//					playwin++;
//					playWinScore+=(plus-1)*betScore;
//				}
			}else{
				setTimeout(function(){
//					addHis("你　输　了：　"+betScore,"red");
					play.val("启动");
				},300)


				//统计
//				playLoseScore+=betScore;
//				playlose++;
			}

//			gameCount++
//			tongji();
			gameStep++;
			//留牌清空
			holdClear();
			return;
		}
		//得分
		if(gameStep==2){
			score.val(score.val().toInt()+winScore.val().toInt());
			winScore.val(0);
			gameInit();
			l().store({"score":score.val()});//在本地缓存分数
			return;
		}
		//让每一张扑克显示
		pokers.each(function(obj,i){
			//将显示了的扑克保存到显示数组
			curPokerArr[i]=pokerArr[i].split("_");
			//显示扑克
			obj.src="../image/"+pokerArr[i].replace("_","")+".png";
		})

		play.val("换牌");
		gameStep++;
	}

	//将得分添加到得分历史
//	function addHis(text,color){
//		won.addDom({
//			"tag":"div",
//			"css":{
//				"color":color
//			},
//			"child":text,
//			"attr":{
//				"className":"items"
//			},
//			"insertBefore":l("#won div[2]").obj
//		})
//	}


	//统计
//	function tongji(){
//		playWinScoreObj.html("得 ："+playWinScore);
//		playLoseScoreObj.html("失 ："+playLoseScore);
//		playdrawObj.html("和 ："+playdraw+"("+((playdraw/gameCount)*100).toFixed(3)+"%)")
//		playwinObj.html("赢 ："+playwin+"("+((playwin/gameCount)*100).toFixed(3)+"%)");
//		playloseObj.html("输 ："+playlose+"("+((playlose/gameCount)*100).toFixed(3)+"%)");
//		gameCountObj.html("共 ："+gameCount+"");
//		l().store({
//			"playWinScore":playWinScore,
//			"playLoseScore":playLoseScore,
//			"playdraw":playdraw,
//			"playwin":playwin,
//			"playlose":playlose,
//			"gameCount":gameCount
//		})
//
//	}
//	tongji()
}())
// l().store({
// 	"playWinScore":0,
// 	"playLoseScore":0,
// 	"playdraw":0,
// 	"playwin":0,
// 	"playlose":0,
// 	"gameCount":0
// })
