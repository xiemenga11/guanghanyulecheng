(function(){
var bet=l("#bet");
var betHandle=l("#betHandle");
//初始化BET的值
bet.html(betHandle.val());
betHandle.listen("change",function(){
	bet.html(betHandle.val());
})}())