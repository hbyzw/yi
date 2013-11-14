define(function(require, exports, module) {
	require('class');
	var slice = Array.prototype.slice;
	function StringBuffer(){
		this._strings_=new  Array;
	}
	StringBuffer.prototype.append=function (str){
		this._strings_.push(str);
	};
	StringBuffer.prototype.toString=function(){
		return this._strings_.join("");
	};
	String.prototype.Trim = function(){
		return this.replace(/(^\s*)|(\s*$)/g,""); 
	};
	var Template = function(template, pattern) {
		this.template = String(template);
		this.pattern = pattern || Template.Pattern;
	};
	Template.Pattern = /@\{([^}]*)\}/mg;
	Template.trim = String.trim || function(str) {
		return str.replace(/^\s+|\s+$/g, '');
	};
	Template.prototype = {
		constructor : Template,
		compile : function(object) {
			return this.template.replace(this.pattern, function(displace,
					variable) {
				variable = Template.trim(variable);
				return displace = object[variable];
			});
		}
	};
	var BaseClass = Class( {
		env :{
				ie : /MSIE/i.test(navigator.userAgent),
				ie6 : /MSIE 6/i.test(navigator.userAgent),
				ie7 : /MSIE 7/i.test(navigator.userAgent),
				ie8 : /MSIE 8/i.test(navigator.userAgent),
				firefox : /Firefox/i.test(navigator.userAgent),
				opera : /Opera/i.test(navigator.userAgent),
				webkit : /Webkit/i.test(navigator.userAgent),
				camino : /Camino/i.test(navigator.userAgent)
		},
		$$:function(id){
			return "string" == typeof id ? document.getElementById(id) : id;
		},
	    randomId:function(){
	     	do{
	     	var id=this.randomChar();
	     	}while(this.$$(id));
	        return id;
	    },
		template:function(){
			return  Template;
		},
		stringBuffer:function(){
			return new StringBuffer();
		},
		bind:function(thisp, fun) {
			var args = slice.call(arguments, 2);
			return function() {
				return fun.apply(thisp, args.concat(slice.call(arguments)));
			};
		},
		bindAsEventListener:function(thisp, fun) {
			var args = slice.call(arguments, 2);
			return function(event) {
				return fun.apply(thisp, [ event || window.event ].concat(args));
			};
		},
		randomChar:function()  {
			  var l=7;
		      var  x="qwertyuioplkjhgfdsazxcvbnm";
		      var  tmp=[];
		      var re;
		      for(var  i=0;i<  l;i++)  {
		           tmp.push(x.charAt(Math.ceil(Math.random()*100000000)%x.length));
		      }
		      re=tmp.join("");
		      return re;
		},
		extend : function(destination, source) {
			for ( var property in source) {
				destination[property] = source[property];
			}
			return destination;
		},
		initialize : function(options) {
			this.setOptionsValue();
			this.setOptions(options);

		},
		setOptions : function(options) {
			this.extend(this.options, options || {});
		}
	});
	module.exports=BaseClass;
});