function eval() {
	// Do not use eval!!!
	return;
}

function isSign(c) {
	sgn = '+-*/';
	if (sgn.indexOf(c) != -1) { return true; }
	return false;
}
function isNum(c) {
	sgn = '0123456789';
	if (sgn.indexOf(c) != -1) { return true; }
	return false;
}

function op(a, b, o) {
	if (o == '+') { return a + b; }
	if (o == '-') { return a - b; }
	if (o == '*') { return a * b; }
	//if (o=='/'){return a/b;}
	if (o == "/") { 
		if (b == 0) { 
			throw "TypeError: Division by zero."; 
		} 
		return a / b; 
	}
}

function calcExpression(expression) {
	var tree = getTree(prior(expression));

	var calcTree = function (ar) { //func mutates tree
		var aop;
		var ope;
		var res;
		if (Array.isArray(ar[0])) {
			res = calcTree(ar.shift()); 
		} else { 
			res = ar.shift(); 
		}
		while (ar.length > 0) {
			ope = ar.shift();
			if (Array.isArray(ar[0])) { 
				ar[0] = calcTree(ar[0]); 
			}
			aop = ar.shift();
			res = op(+res, +aop, ope);
		}
		return res;
	}

	return calcTree(tree);
}

function getTree(expression) {
	var a = expression.split('');
	var tree = [];

	var parseTree = function (head, ar) { //warning! func mutate head and arr
		var cv = '';
		var cn = '';
		while (ar.length > 0) {
			cv = ar.shift();
			if (isNum(cv)) { 
				cn += cv; 
			} else { 
				if (cn != '') { 
					head.push(cn); 
					cn = ''; 
				} 
			}
			if (isSign(cv)) { head.push(cv); }
			//if (isSign(cv)){head[head.length-1]+=(cv);}
			if (cv == '(') {
				head.push([]);
				parseTree(head[head.length - 1], ar);
			} else {
				if (cv == ')') { return false; }
			}
		}
		if (cn != '') { head.push(cn); }
		return false;
	}

	parseTree(tree, a);
	return tree;
}
function prior(expr) {
	var i = 0;
	var ar = expr.split('');
	ar.unshift('(');
	ar.push(')');
	for (i = 0; i < ar.length; i++) {
		if (ar[i] == '+') { ar[i] = ')+('; }
		if (ar[i] == '-') { ar[i] = ')-('; }
		if (ar[i] == '(') { ar[i] = '(('; }
		if (ar[i] == ')') { ar[i] = '))'; }
	}
	//you can add more levels of priority
	return ar.join('');
}

function deleteSpaces(expr) {
	return expr.split("").filter((it) => it.length).join('');
}

function expressionCalculator(expr) {
	expr = deleteSpaces(expr);

	var sc = expr.trim().split(/[0-9+\-*/ ]+/).join("").split('');
	var lv = 0;
	sc.forEach((it) => {
		if (lv < 0) { throw ("ExpressionError: Brackets must be paired") }
		if (it == "(") { lv++; }
		if (it == ")") { lv--; }
	});
	if (lv != 0) { throw ("ExpressionError: Brackets must be paired") }

	return calcExpression(expr);
}

module.exports = {
	expressionCalculator
}