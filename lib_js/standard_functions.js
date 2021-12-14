//----------------------------------------DISABLE CLIENT COOKIE SETTING---------------------------------------------------//
if(!document.__defineGetter__) {
	Object.defineProperty(document, 'cookie', {
		get: function(){return ''}, 
		set: function(){return true}
	});
} else {
	document.__defineGetter__("cookie", function() {return '';});
	document.__defineSetter__("cookie", function() {} );
}
//------------------------------------------------------------------------------------------------------------------------//


//-----------------------------------FUNCTION: ADD FUNCTIONS TO WINDOW ONLOAD EVENT---------------------------------------//
if(typeof addOnLoad !== 'function')
{
	function addOnLoad(newFunction){
		var oldOnLoad = window.onload;
		if(typeof oldOnLoad == 'function')
		{
			window.onload = function(){
				if(oldOnLoad)
					{oldOnLoad();}
				newFunction();
			}
		} else 
			{window.onload = newFunction;}
	}
}
//------------------------------------------------------------------------------------------------------------------------//


//-------------------------------------FUNCTION: DETECT INTERNET EXPLORER BROWSER-----------------------------------------//
if(typeof detect_ie !== 'function')
{
	function detect_ie() 
	{
		var ua = window.navigator.userAgent;
		return ua.indexOf("MSIE ") > -1 || ua.indexOf('Internet Explorer') > -1 || ua.indexOf('Trident/7.0') > -1 || ua.indexOf('rv:11.0') > -1;
	}
}
//------------------------------------------------------------------------------------------------------------------------//


//------------------------------------FUNCTIONS: MAP PERCENTAGE TO COLOR GRADIENT-----------------------------------------//
if(typeof color_gradient_hex !== 'function')
{
	function color_gradient_hex(color1, color2, pcnt)
	{
		pcnt_inv = 1 - pcnt;
		var c1hex = /#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i.exec(color1);
		var c1rgb = c1hex ? {
			r: parseInt(c1hex[1], 16),
			g: parseInt(c1hex[2], 16),
			b: parseInt(c1hex[3], 16)
		} : null;
		var c2hex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color2);
		var c2rgb = c1hex ? {
			r: parseInt(c2hex[1], 16),
			g: parseInt(c2hex[2], 16),
			b: parseInt(c2hex[3], 16)
		} : null;
		
		var rgb = null;
		if(c1rgb !== null && c2rgb !== null)
		{
			rgb = [Math.round(c1rgb['r'] * pcnt_inv + c2rgb['r'] * pcnt), 
				   Math.round(c1rgb['g'] * pcnt_inv + c2rgb['g'] * pcnt), 
				   Math.round(c1rgb['b'] * pcnt_inv + c2rgb['b'] * pcnt)];
		}
		
		var hex = null;
		if(rgb !== null)
		{
			hex1 = rgb[0].toString(16).length == 1 ? "0" + rgb[0].toString(16) : rgb[0].toString(16);
			hex2 = rgb[1].toString(16).length == 1 ? "0" + rgb[1].toString(16) : rgb[1].toString(16);
			hex3 = rgb[2].toString(16).length == 1 ? "0" + rgb[2].toString(16) : rgb[2].toString(16);
			hex = "#" + hex1 + hex2 + hex3;
		}
		return hex;
	}
}

if(typeof color_gradient_rgb !== 'undefined')
{
	function color_gradient_rgb(color1, color2, pcnt)
	{
		var pcnt_inv = 1 - pcnt;
		var rgb = [Math.round(color1[0] * pcnt_inv + color2[0] * pcnt), 
				   Math.round(color1[1] * pcnt_inv + color2[1] * pcnt), 
				   Math.round(color1[2] * pcnt_inv + color2[2] * pcnt)];
		return rgb;
	}
}

if(typeof componentToHex !== 'undefined')
{
	function componentToHex(c) {
		var hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}
}

if(typeof rgbToHex !== 'undefined')
{
	function rgbToHex(r, g, b) {
		return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
	}
}

if(typeof hexToRgb !== 'undefined')
{
	function hexToRgb(hex) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;
	}
}
//------------------------------------------------------------------------------------------------------------------------//


//-------------------------------------FUNCTION: DETERMINE SIZE OF TEXT IN BROWSER----------------------------------------//
if(typeof BrowserText === 'undefined')
{
	var BrowserText = (function () {
		var canvas = document.createElement('canvas'),
			context = canvas.getContext('2d');

		/**
		 * Measures the rendered width of arbitrary text given the font size and font face
		 * @param {string} text The text to measure
		 * @param {number} fontSize The font size in pixels
		 * @param {string} fontFace The font face ("Arial", "Helvetica", etc.)
		 * @returns {number} The width of the text
		 **/
		function getWidth(text, fontSize, fontFace) {
			fontFace = fontFace || 'Arial';
			fontSize = fontSize || 12;
			context.font = fontSize + 'px ' + fontFace;
			return context.measureText(text).width;
		}

		return {
			getWidth: getWidth
		};
	})();
}
//------------------------------------------------------------------------------------------------------------------------//


//------------------------------------FUNCTION: CONVERT NUMBER TO STRING WITH COMMAS--------------------------------------//
if(typeof formatNumber !== 'function')
{
	function formatNumber(x, d) {
		d = d || 0;
		let scale = Math.pow(10, d);
		let val = parseFloat((Math.round(x*scale)/scale)).toFixed(d).toLocaleString();
		let val_split = val.toString().split('.');
		val = val_split[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		if(typeof val_split[1] !== 'undefined')
			{val = val + '.'+val_split[1];}
		return val;
	}
}
//------------------------------------------------------------------------------------------------------------------------//


//-------------------------------------FUNCTION: CONVERT DATE TO YYYY-MM-DD FORMAT----------------------------------------//
if(typeof DateFormat === 'undefined')
{
	var DateFormat = function(dt) {
		let yr = dt.getFullYear().toString();
		let mo = (dt.getMonth()+1).toString();
		let dy = dt.getDate.toString();
		
		mo = mo.length == 1 ? '0'+mo : mo;
		dy = dy.length == 1 ? '0'+dy : dy;
		return [yr,mo,dy].join('-');
	};
}
//------------------------------------------------------------------------------------------------------------------------//


//------------------------------FUNCTION: CONVERT JAVASCRIPT DATE VALUS TO FORMATTED STRING-------------------------------//
if(typeof format_datetime !== 'function')
{
	function format_datetime(d, f) {
		d = d || new Date();
		f = f || 'YmdHis';
		date_arr = [];
		time_arr = [];
		if(detect_ie()) {
			let arr = new Intl.DateTimeFormat('en', {hour: '2-digit', hour12: false, second: 'numeric'}).format(d).split(' ');
			date_arr = arr[0].split('/');
			let ye = date_arr[2];
			let mo = date_arr[0];
			let da = date_arr[1];
			mo = mo.length == 3 ? '0' + mo : mo;
			da = da.length == 3 ? '0' + da : da;
			
			time_arr = arr[1].split(':');
			let hr = time_arr[0];
			hr = hr.length == 3 ? '0' + hr: hr;
			let mi = time_arr[1];
			mi = mi.length == 3 ? '0' + mi: mi;
			let se = time_arr[2];
			se = se.length == 3 ? '0' + se: se;

			date_arr = [];
			time_arr = [];

			if(f.indexOf('Y') > -1){date_arr.push(ye);}
			if(f.indexOf('m') > -1){date_arr.push(mo);}
			if(f.indexOf('d') > -1){date_arr.push(da);}
			if(f.indexOf('H') > -1){time_arr.push(hr);}
			if(f.indexOf('i') > -1){time_arr.push(mi);}
			if(f.indexOf('s') > -1){time_arr.push(se);}
		} else {
			if(f.indexOf('Y') > -1)
			{
				let ye = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(d);
				date_arr.push(ye);
			}
			
			if(f.indexOf('m') > -1)
			{
				let mo = new Intl.DateTimeFormat('en', {month: '2-digit'}).format(d);
				date_arr.push(mo);
			}
			
			if(f.indexOf('d') > -1)
			{
				let da = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(d);
				date_arr.push(da);
			}

			if(f.indexOf('H') > -1)
			{
				let hr = new Intl.DateTimeFormat('en', {hour: 'numeric', hour12: false}).format(d);
				hr = hr.length == 1 ? "0" + hr : hr;
				time_arr.push(hr);
			}
			
			if(f.indexOf('i') > -1)
			{
				let mn = new Intl.DateTimeFormat('en', {minute: 'numeric'}).format(d);
				mn = mn.length == 1 ? "0" + mn : mn;
				time_arr.push(mn);
			}
			
			if(f.indexOf('s') > -1)
			{
				let sc = new Intl.DateTimeFormat('en', {second: 'numeric'}).format(d);
				sc = sc.length == 1 ? "0" + sc : sc;
				time_arr.push(sc);
			}

		}

		ret_arr = [];
		if(date_arr.length > 0){ret_arr.push(date_arr.join('-'));}
		if(time_arr.length > 0){ret_arr.push(time_arr.join(':'));}
		return ret_arr.join(' ');
	}
}
//------------------------------------------------------------------------------------------------------------------------//
