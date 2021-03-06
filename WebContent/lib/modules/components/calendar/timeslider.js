/**
 * 时间选择空间
 * @author Xiaoyin Song
 * 
 * v 1.0.0
 * 
 * 
 * 说明：
 *     SliderDot类为拖动的控制点，
 *     TimeSlider为时间拖动轴，
 *     DoubleTimeSlider为对TimeSlider的包装,
 *     对外接口为DoubleTimeSlider.
 *     
 * 由于对外只需调用DoubleTimeSlider所以三个类在一个模块内。
 *    
 */
define(function(require, exports, module) {

	require('class');
	var BaseClass=require("modules/components/calendar/base.js");
	var TimeSliderConfig={
			fontColor:"#333",
			fontSize:"11px",
			uitlBorderWidth:0,
			dotBorder:"1px solid #787878",
			uitlBorder:"1px solid #999",//"1px solid #D6D6D6"背景线上，border的样式
			halfMargin:8,//背景线上，短的线的外边距
			halfHeight:14,//背景线上，短的线的高度
			completeHeight:30,//背景线上的完成高度，也就是长的线的高度
			uitlWidth:10,//背景线的每个的宽度，也是拖动块的基本宽度
			padding:5,//标准内边距
			bothSidesPadding:14,//right,left在标准内边距上的增量
			bottomPadding:14,//bottom在标准内边距上的增量
			position:"relative",//被Container包含的首个元素的定位方式
			dotIncreHeight:2,
			"margin-left":14,
			"margin-right":13,
			dotIncreWdith:0//dot拖动块在uitlWidth上的增量宽度
			
	};
	var SliderDot = Class(BaseClass,{
		getScrollLeft : function() {
	        if (this.env.ie||this.env.opera||this.env.firefox) {
		        return document.documentElement.scrollLeft;
	        } else {
		        return document.body.scrollLeft;
	        }
        },
        getScrollTop : function() {
	        if (this.env.ie||this.env.opera||this.env.firefox) {
		        return document.documentElement.scrollTop;
	        } else {
		        return document.body.scrollTop;
	        }
        },
		mouseUp:function(){
			$(document).off("mousemove", this._mouseMove);
			$(document).off("mouseup", this._mouseUp);
			if (this.env.ie) {
				$(this.elem).off("losecapture",this._mouseUp);
				this.elem.releaseCapture();
			} else {
				$(window).off("blur", this._mouseUp);
			}   		
	    },
		mouseDown:function(event){
			this._x = event.clientX - this.elem.offsetLeft;
			this._y = event.clientY - this.elem.offsetTop;
			this._t=this.getScrollTop();
			this._l=this.getScrollLeft();		
			$(document).on("mousemove", this._mouseMove);
			$(document).on("mouseup", this._mouseUp);

			if (this.env.ie) {
				$(this.elem).on("losecapture", this._mouseUp);
				this.elem.setCapture();
			} else {
				$(window).on("blur", this._mouseUp);
				event.preventDefault();
			}
		
	    },
	    setPosition:function(obj){
	    	var num=obj.hour*2;
            if(obj.minute>=30){
            	num++;
	    	}
            this.elem.style.left=(this.uitlWidth*num+this.boundaryLeft)+"px";   
            this.textElem.style.left=(this.uitlWidth*num+this.boundaryText)+"px";
            this.textElem.innerHTML=(obj.hour<10?("0"+obj.hour):obj.hour)+":"+(obj.minute<10?("0"+obj.minute):obj.minute);
	    },
		mouseMove:function(event){
	    	window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
	    	var left = event.clientX - this._x-this._l+this.getScrollLeft();
	    	left=Math.max(Math.min(left,this.boundaryRight),this.boundaryLeft);
	    	var num=Math.floor((left-this.boundaryLeft)/this.uitlWidth);	    	
	    	if(num!=this.num){
	    	    this.elem.style.left=(this.uitlWidth*num+this.boundaryLeft)+"px";    	    
	    	    if(num%2==0){
	    	    	var textAfter="00";
	    	    }else{
	    	    	var textAfter="30";
	    	    }
	    	    var textbefore=Math.floor(num/2);
	    	    
	    	    if(textbefore==24){textbefore=23;textAfter=59;}
	    	    if(textbefore<10){textbefore="0"+textbefore;}
	    	    this.textElem.style.left=(this.uitlWidth*num+this.boundaryText)+"px";
	    	    this.textElem.innerHTML=textbefore+":"+textAfter;
	    	    this.options.papa.setTime(textbefore+":"+textAfter);
	    	    this.num=num;
	    	}
	    },
        eventElem:function(){
        	this._mouseDown=this.bindAsEventListener(this,this.mouseDown);
        	$(this.elem).on("mousedown",this._mouseDown);
	    },
		createElem:function(){
			var height=TimeSliderConfig.halfHeight+TimeSliderConfig.dotIncreHeight;
			var width=TimeSliderConfig.uitlWidth+TimeSliderConfig.dotIncreWdith;
			this.boundaryText=TimeSliderConfig.padding+TimeSliderConfig.bothSidesPadding-26/2;
			this.boundaryTop=TimeSliderConfig.padding+(TimeSliderConfig.completeHeight-height)/2-1;
			this.boundaryLeft=TimeSliderConfig.padding+TimeSliderConfig.bothSidesPadding-width/2;
			this.boundaryRight=(TimeSliderConfig.uitlWidth+TimeSliderConfig.uitlBorderWidth)*48+this.boundaryLeft;
			this.elem=document.createElement("div");
			this.elem.style.backgroundColor="whiteSmoke";
			this.elem.style.borderRadius="2px";
			this.elem.style.border=TimeSliderConfig.dotBorder;
			this.elem.style.height=height+"px";
			this.elem.style.width=width+"px";
			this.elem.style.position="absolute";
			this.elem.style.top=this.boundaryTop+"px";
			this.elem.style.left=this.boundaryLeft+"px";
			this.elem.style.cursor="pointer";
			this.num=0;
			this.uitlWidth=TimeSliderConfig.uitlBorderWidth+TimeSliderConfig.uitlWidth;
			this.$$(this.options.Container).appendChild(this.elem);
			this.textElem=document.createElement("div");
			this.textElem.style.position="absolute";
			this.textElem.style.wordBreak="break-all";
			this.textElem.style.textAlign="center";
			this.textElem.style.fontSize=TimeSliderConfig.fontSize;
			this.textElem.style.color=TimeSliderConfig.fontColor;
			this.textElem.style.left=this.boundaryText+"px";
			//this.textElem.style.backgroundColor='#F7F7F7';
			this.textElem.style.top=(TimeSliderConfig.padding+TimeSliderConfig.completeHeight+17)+"px";
			if(this.env.ie6){
				this.textElem.style.width="27px";
			}
			this.textElem.innerHTML="00:00";
			this.$$(this.options.Container).appendChild(this.textElem);
			
		},
		initialize : function(options) {
			this.setOptionsValue();
			this.setOptions(options);
			this.createElem();
			this._mouseMove=this.bindAsEventListener(this,this.mouseMove);
			this._mouseUp=this.bind(this,this.mouseUp);
            this.eventElem();

		},
		destroy:function(){
			$(this.elem).off("mousedown",this._mouseDown);
			this.$$(this.options.Container).removeChild(this.elem);
			this.elem=null;
			this.$$(this.options.Container).removeChild(this.textElem);
			this.textElem=null;
		},
		setOptionsValue : function(options) {
			this.options = {
					papa:null,
				    Container : ""
			};
		}
	});
	var TimeSlider = Class(BaseClass, {

        setTime:function(text){
			if(this.oText){
				this.oText.value=text;
			}	
        },
        setDate:function(obj){//{date:new Date()}
			var Time={
					   hour:obj.getHours(),
					   minute:obj.getMinutes()
				    };
	        this.dot.setPosition(Time);
	        this.options.TextElem.value=(obj.getHours()<10?"0"+obj.getHours():obj.getHours())+":"+(obj.getMinutes()<10?"0"+obj.getMinutes():obj.getMinutes());
        },
        textElemBlur:function(){     	
        	if(!(/^((2[0123])|([01]\d)):([0-5]\d)$/.test(this.options.TextElem.value))){
        		this.options.TextElem.value="00:00";
        		this.options.papa.showAlert("请输入正确的时间");
        		return false;
        	}else{
        		this.options.papa.hideAlert();
        	}
        	var arr=this.options.TextElem.value.split(":");     
			var Time={
				   hour:parseInt(arr[0],10),
				   minute:parseInt(arr[1],10)
			    };
        	this.dot.setPosition(Time);
        },
		eventElem:function(){
			if(this.oText){
			//	this.elem.style.border="1px solid #86BE2B";
			}
			this._textElemBlur=this.bind(this,this.textElemBlur);
			$(this.options.TextElem).on("blur",this._textElemBlur);
		},
		createTable:function(){
			this.background=document.createElement("div");
			var uitlWidth=TimeSliderConfig.uitlBorderWidth+TimeSliderConfig.uitlWidth;
			var boundaryText=TimeSliderConfig.padding+TimeSliderConfig.bothSidesPadding-26/2-1;
			var buffer=this.stringBuffer();
			buffer.append('<table border="0" cellspacing="0" cellpadding="0">');
			buffer.append('<tr>');
			for(var i=0;i<24;i++){
				if(i==0||(i+1)%4==0){
					var textElem=document.createElement("div");
					textElem.style.position="absolute";
					textElem.style.wordBreak="break-all";
					textElem.style.textAlign="center";
					textElem.style.fontSize=TimeSliderConfig.fontSize;
					textElem.style.color="#333";
					textElem.style.left=(uitlWidth*i*2+boundaryText)+"px";
					textElem.style.top=(TimeSliderConfig.padding+TimeSliderConfig.completeHeight)+"px";
					if(this.env.ie6){
						textElem.style.width="27px";
					}
					textElem.innerHTML=(i<10?("0"+i):i)+":00";
					this.elem.appendChild(textElem);
				}
				buffer.append('<td><div style="');
				
				buffer.append('width:');
				buffer.append(TimeSliderConfig.uitlWidth+"px;");
				buffer.append('border-left:');
				buffer.append(TimeSliderConfig.uitlBorder);
				buffer.append(';height:');
				buffer.append(TimeSliderConfig.completeHeight);
				buffer.append('px"></div></td>');
				
				buffer.append('<td><div style="');
				buffer.append('margin-top:');buffer.append(TimeSliderConfig.halfMargin+"px;");
				buffer.append('margin-bottom:');buffer.append(TimeSliderConfig.halfMargin+"px;");
				buffer.append('width:');buffer.append(TimeSliderConfig.uitlWidth+"px;");
				buffer.append('border-left:');buffer.append(TimeSliderConfig.uitlBorder+";");
				buffer.append('height:');buffer.append(TimeSliderConfig.halfHeight+"px");
				buffer.append('"></div></td>');
			}
			buffer.append('</tr>');
			buffer.append('</table>');
			this.background.style.borderRight=TimeSliderConfig.uitlBorder;
			this.background.innerHTML=buffer.toString();
			this.elem.appendChild(this.background);
		},
		createElem:function(){
			this.elem=document.createElement("div");
			var padding=TimeSliderConfig.padding;
			this.elem.style.paddingTop=padding+"px";
			this.elem.style.paddingLeft=this.elem.style.paddingRight=(TimeSliderConfig.bothSidesPadding+padding)+"px";
			this.elem.style.paddingBottom=(TimeSliderConfig.bottomPadding+padding)+"px";
			this.elem.style.position=TimeSliderConfig.position;
			this.createTable();
			
			this.dot=new this.options.Dot({
				Container:this.elem,
				papa:this
			});
			this.dot.setPosition(this.options.Time);
			this.options.Container.appendChild(this.elem);
		},
		initialize : function(options) {
			this.setOptionsValue();
			this.setOptions(options);
			this.createElem();
			if(this.options.TextElem){this.oText=this.$$(this.options.TextElem);}
			this.oText.value=(this.options.Time.hour>=10?this.options.Time.hour:("0"+this.options.Time.hour))+":"+(this.options.Time.minute>=10?this.options.Time.minute:("0"+this.options.Time.minute));
			this.eventElem();
		
		},
		destroy:function(){
			this.dot.destroy();
			this.dot=null;
			$(this.options.TextElem).off("blur",this._textElemBlur);
			this.options.Container.removeChild(this.elem);
			this.elem=null;
		},
		setOptionsValue : function(options) {
			this.options = {
				papa:{
	            },
				Time:{
				   hour:null,
				   minute:null
			    },
			    TextElem:null,
				Dot : SliderDot,
				Container : ""
			};
		}
	});
	var DoubleTimeSlider =  Class(BaseClass,{
        hide:function(){
	        this.elem.style.display="none";
	        this.flag=false;
        },
        show:function(){
		    this.elem.style.display="block";
		    this.flag=true;
	    },
	    clickTextElem:function(){
	    	if(!this.flag){
	    		this.options.papa.calendarHide();
	    		this.show();
	    	}
	    },
	    eventElem:function(){
	    	this._clickTextElem=this.bind(this,this.clickTextElem);
	    	$(this.options.StartElem).on("click",this._clickTextElem);
	    	$(this.options.EndElem).on("click",this._clickTextElem);
	    },
        hideAlert:function(){
        
	    	this.options.papa.hideAlert();
	    },
        showAlert:function(text){
        	this.options.papa.showAlert(text);
        },
		createElem : function() {
			this.elem = document.createElement("div");
			this.elem.style.marginLeft=TimeSliderConfig["margin-left"]+'px';
			this.elem.style.marginRight=TimeSliderConfig["margin-right"]+'px';
			var div=document.createElement("div");
			div.style.margin="0px 1px 1px 1px";
			div.innerHTML='<p class="text-muted credit">起始时间，分钟部分：</p>';
			this.elem.appendChild(div);
			this.timeSliderObj1=new this.options.TimeSlider({
				   papa:this,
				   Time:{
				        hour:this.options.Start.hour,
				        minute:this.options.Start.minute
			       },
				   TextElem:this.options.StartElem,
				   Container:this.elem
				});
			var div=document.createElement("div");
			div.style.margin="19px 1px 1px 1px";
	
			div.innerHTML='<p class="text-muted credit">结束时间，分钟部分：</p>';
			this.elem.appendChild(div);
			this.timeSliderObj2=new this.options.TimeSlider({
				   papa:this,
				   Time:{
		              hour:this.options.End.hour,
		              minute:this.options.End.minute
		           },
				   TextElem:this.options.EndElem,
				   Container:this.elem
				});
			this.hide();
			this.options.Container.appendChild(this.elem);
		},
		initialize : function(options) {
			this.setOptionsValue();
			this.setOptions(options);
        	if(this.options.caleNum==3){
        		TimeSliderConfig.uitlWidth=13;
        		TimeSliderConfig["margin-left"]=23;
        		TimeSliderConfig["margin-right"]=23;
        	}else if(this.options.caleNum==2){
        		TimeSliderConfig.uitlWidth=9;
        		TimeSliderConfig["margin-left"]=10;
        		TimeSliderConfig["margin-right"]=9;
        	}else{
        		TimeSliderConfig.uitlWidth=7;
        		TimeSliderConfig["margin-left"]=9;
        		TimeSliderConfig["margin-right"]=8;
        	}
			this.createElem();
			this.eventElem();
		},
		destroy:function(){
			this.timeSliderObj1.destroy();
			this.timeSliderObj1=null;
			this.timeSliderObj2.destroy();
			this.timeSliderObj2=null;
	    	$(this.options.StartElem).off("click",this._clickTextElem);
	    	$(this.options.EndElem).off("click",this._clickTextElem);
	    	this.options.Container.removeChild(this.elem);
	    	this.elem=null;
		},
		setOptionsValue : function(options) {
			this.options = {
			    caleNum:3,
				Start:{
				   hour:null,
				   minute:null
                },
                End:{
 				   hour:null,
				   minute:null  	
                },
				papa:{
 		
 	            },
				TimeSlider:TimeSlider,
                StartElem:null,
                EndElem:null,
				Container : null
			};
		}
	});
	module.exports=DoubleTimeSlider;
});