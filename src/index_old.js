function eval() {
    // Do not use eval!!!
    return;
}

var delSpace = function (ex){
	var i;
	var res="";
	for (i=0;i<ex.length;i++){
		if (ex[i]!=" "){res+=ex[i];}
	}
	return res;
}
var correct3signs = function (ex){
	while(ex.indexOf("*--")!=-1){ex=ex.split("*--").join("*");}
	while(ex.indexOf("/--")!=-1){ex=ex.split("/--").join("/");}
	while(ex.indexOf("+--")!=-1){ex=ex.split("+--").join("+");}
	while(ex.indexOf("---")!=-1){ex=ex.split("---").join("-");}
	return ex;
}
var hup=function (a,b,h){
	if (h=="*"){return a*b;}
	if (h=="/"){if (b==0){throw "TypeError: Division by zero.";} return a/b;}
	if (h=="+"){return a+b;}
	if (h=="-"){return a-b;}
}
var isMulDivSign=function (el){
	if ((el=="*")||
		(el=="/")){
		return true;
	}
	return false;
}
var isPriorSign = function (el,pre){
	if (el=="="){return true;}
	if (el=="+"){return true;}
	if ((el=="-")&&(isSign(pre)==false)){
		return true;
	}
	return false;
}
var isSign = function (el){
	if ((el=="*")||
		(el=="/")||
		(el=="+")||
		(el=="-")||
		(el=="!")){
		return true;
	}
	return false;
}

var solve_buf =function (bf){
	var i;
	var res=Number(bf[0].substring(0,bf[0].length-1));
	for (i=0;i<bf.length-1;i++){
		var b=Number(bf[i+1].substring(0,bf[i+1].length-1));
		var h=bf[i][bf[i].length-1];
		res=hup(res,b,h);
	}
	return res;
}

var solve_muldiv= function (ex){
	var i;
	var bf=[];
	var ex_part="";
	for (i=0;i<ex.length;i++){
		if (isMulDivSign(ex[i])==true){
		ex_part+=ex[i];
		bf.push(ex_part);
		ex_part="";
		} else {ex_part+=ex[i];}
	}
	bf.push(ex_part);
	var res=solve_buf(bf)
	return String(res)+ex[ex.length-1];
}

var solve_addif=function  (ex){
	var i;
	var bf=[];
	var ex_part="";
	for (i=1;i<ex.length;i++){
		if (isPriorSign(ex[i],ex[i-1])==true){
		ex_part+=ex[i];
		bf.push(ex_part);
		ex_part="";
		} else {ex_part+=ex[i];}
	}
	//console.log(bf);
	for (i=0;i<bf.length;i++){
		bf[i]=solve_muldiv(bf[i]);
	}
	//console.log(bf);
	return solve_buf(bf);
}

var solve_par=function (ex){
	var i;
	var lev=0;
	var pre="";
	var ins="";
	var post="";
	i=0;
	while ((ex[i]!="(")&&(i<ex.length)){
		pre+=ex[i];
		i++;
	}
	if (i==ex.length){return solve_addif('!'+ex+'=');}
	do {
		if (ex[i]=="("){lev++;}
		if (ex[i]==")"){lev--;}
		ins+=ex[i];
		i++;
	} while (lev>0);
	if (pre=="-"){pre="0-";}
	ins=ins.substr(1,ins.length-2);
	while (i<ex.length){
		post+=ex[i];
		i++;
	}
	//console.log([pre,ins,post]);
	ins=solve_par(ins);
	return solve_par(correct3signs(pre+ins+post));
}
var solve_full= function (ex){
	var res=solve_par(correct3signs(delSpace(ex)));
	//console.log([res,eval(ex)]);
	return res;
}
var calc = function (expression) {
  
  return solve_full(expression);
  
}

function expressionCalculator(expr) {
    expr=expr.split("").filter((it)=>it.length).join('');
    var sc=expr.trim().split(/[0-9+\-*/ ]+/).join("").split('');
    var lv=0;console.log(sc);
    sc.forEach((it)=>{ 
        
        if (lv<0){throw ("ExpressionError: Brackets must be paired")}
        if (it=="("){lv++;}
        if (it==")"){lv--;}
    });
    if (lv!=0){throw ("ExpressionError: Brackets must be paired")}

    return solve_full(expr);  
}

module.exports = {
    expressionCalculator
}