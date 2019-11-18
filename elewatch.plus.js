		/**
		 * @author Jimmy Lam
		 * @param {[id]}[容器的ID]
		 * @param {[clockSize]}[时钟的大小][1-12][由小到大][必须传入数字1--12,不得带单引或双引]
		 * @param {[system]}[12小时制,还是24小时制][必须传入数字12或24,不得带单引或双引]
		 * @param {[cColor]}[时钟的颜色:默认是黑,可选色'green','red','blue','yellow']
		 * 混合的构造函数，原型方式
		 */
		//构造函数
		function EleWatch({id,clockSize,system,cColor}){
			//获取父元素
			this.clockBox = document.getElementById(id);
			this.createNumBox();
			this.system = system;
			//获取显示事件数字的子元素
			this.numBox = this.clockBox.querySelectorAll('.numBox');
			this.hourSpan1 = this.numBox[0].children;
			this.hourSpan2 = this.numBox[1].children;
			this.minutesSpan1 = this.numBox[2].children;
		    this.minutesSpan2 = this.numBox[3].children;
		    this.secondSpan1 = this.numBox[4].children;
		    this.secondSpan2 = this.numBox[5].children;
		    this.boxAP = this.numBox[6].children;
			this.setClockColor(cColor);
			this.setClockSize(clockSize || 5);//不传就默认为5
			this.setEachDivSize();
			this.setEachSpanSize();
			//执行小时制判断
			this.changeSystemType(this.system);
			this.setPonits();
			this.initHourMinutes();
			var that = this;
			this.setNowTime();
			setInterval(function(){
				that.setNowTime();
			},1000);
		}
		//如果是12小时制 重新设置主容器的宽度(这个方法不起作用)
		

		//设置颜色
		EleWatch.prototype.setClockColor = function(color){
			if(color){
				switch(color){
					case 'red':
					this.numColor = '#d9534f';
					this.numBackColor = '#f2dede';
					break;
					case 'blue':
					this.numColor = '#2e6da4';
					this.numBackColor = '#d9edf7';
					break;
					case 'green':
					this.numColor = '#4cae4c';
					this.numBackColor = '#dff0d8';
					break;
					case 'yellow':
					this.numColor = '#eea236';
					this.numBackColor = '#fcf8e3';
					break;
					case 'green':
					this.numColor = '#4cae4c';
					this.numBackColor = '#dff0d8';
					break;
					default:
					this.numColor = '#222';
					this.numBackColor = '#fff';
					break;
				}
			}else{
					this.numColor = '#222';
					this.numBackColor = '#fff';
			}
		}
		//初始化分钟和小时的显示(进入页面执行一次现实出来,然后通过定时器变化时间)
		//因为定时器中设置了判断节流
		EleWatch.prototype.initHourMinutes = function(){
			this.nowTime = new Date();
			this.minutes = this.nowTime.getMinutes().toString();
			//获取分钟的第一位数
	    	this.minutesFirst = this.minutes.slice(0,1);
	    	//获取分钟的第二位数
	    	this.minutesSecond = this.minutes.slice(1);
		    if(this.minutes.length > 1){
				this.switchTime(this.minutesFirst,this.minutesSpan1);
				this.switchTime(this.minutesSecond,this.minutesSpan2);
		    }else{
				this.switchTime('0',this.minutesSpan1);
				this.switchTime(this.minutesFirst,this.minutesSpan2);
		    }

		     if(this.system == 12){
		    	 this.hour =this.nowTime.getHours();//12小时制执行这个
		    	 //在12小时制中,进行AM PM判断
		    	 //24小时不需要判断
		    	if(this.hour >= 12){
			    	this.setTimeNum(this.selectNumArr('ArrP'),this.boxAP);
		    	}else{
		    		this.setTimeNum(this.selectNumArr('ArrA'),this.boxAP);
		    	}
		    	//12小时制中.小时数要减去12,如果12点 12-12=0 就把值设为'12';
		    	if(this.hour>12){
		    		
		    	 	this.hour = (this.hour - 12).toString();
		    	 	
		    	 	if(this.hour == 0){
		    	 		this.hour = '12';
		    	 	}

		    	}else{
		    	 	this.hour = this.hour.toString();
		    	}
		    //--------------------------------------------------------------
		    }else{
		    	 //24小时制执行这个
		    	 this.hour = this.nowTime.getHours().toString();
		    }

			//获取小时的第一位数
	    	this.hourFirst = this.hour.slice(0,1);
		    //获取小时的第二位数
	    	this.hourSecond = this.hour.slice(1);

		    if(this.hour.length > 1){
				this.switchTime(this.hourFirst,this.hourSpan1);
				this.switchTime(this.hourSecond,this.hourSpan2);
		    }else{

				this.switchTime('0',this.hourSpan1);
				this.switchTime(this.hourFirst,this.hourSpan2);
		    }
		    
		}
		EleWatch.prototype.changeSystemType = function(system){
		    	if(system !== 12){
		    	  this.BoxAP = this.numBox[6];
		    	  this.BoxM = this.numBox[7];
		    	  this.BoxAP.style.display = 'none';
				  this.BoxM.style.display = 'none';
				  this.clockBox.style.width = parseInt(this.clockBox.style.width) - (this.divBox[1].offsetWidth*2) + 'px';
		    	}else{
		    	  this.setLastM();
		    	}
		}
		EleWatch.prototype.setNowTime = function(){
			this.nowTime = new Date();
	    	this.hour = this.nowTime.getHours().toString();
	    	this.minutes = this.nowTime.getMinutes().toString();
	    	this.second = this.nowTime.getSeconds().toString();
	    	//24小时制
	    	

	    	//获取分钟的第一位数
	    	this.minutesFirst = this.minutes.slice(0,1);
	    	//获取分钟的第二位数
	    	this.minutesSecond = this.minutes.slice(1);

	    	//获取秒的第一位数1,2,3,4,,,45,46,59,0(规律)
    		this.secondFirst = this.second.slice(0,1);
	    	//获取秒的第二位数
	    	this.secondSecond = this.second.slice(1);
			
	    	//设置闪动点(只要是删除这一块，就能取消闪动效果)------
	    	if(this.point1Dian1.style.opacity == '1'){
	    		this.point1Dian1.style.opacity = '0.5'
				this.point1Dian2.style.opacity =  '0.5';
				this.point21Dian1.style.opacity = '0.5';
				this.point2Dian2.style.opacity =  '0.5';
	    	}else{
	    		this.point1Dian1.style.opacity = '1';
				this.point1Dian2.style.opacity = '1';
				this.point21Dian1.style.opacity ='1';
				this.point2Dian2.style.opacity = '1';
	    	}
			//--------------------------------------------------
	    	//动态设置秒
	    	if(this.second.length > 1){
	    		this.switchTime(this.secondFirst,this.secondSpan1);
	    		this.switchTime(this.secondSecond,this.secondSpan2);
	    	}else if(this.second.length == 1){
	    		this.switchTime('0',this.secondSpan1);
	    		this.switchTime(this.secondFirst,this.secondSpan2);
	    	}

	    	//设置分钟-----------------------
	    	//(secondFirst=='0' && secondSecond=='')
	    	//当秒数到00秒(也就是60秒的时候)才改变分钟的显示(节流)
	    	if(this.secondFirst=='0' && this.secondSecond==''){
			    if(this.minutes.length > 1){
	    			this.switchTime(this.minutesFirst,this.minutesSpan1);
	    			this.switchTime(this.minutesSecond,this.minutesSpan2);
			    }else{
	    			this.switchTime('0',this.minutesSpan1);
	    			this.switchTime(this.minutesFirst,this.minutesSpan2);
			    }
	    	}


	    	//设置小时---------------------
	    	if(this.minutesFirst=='0' && this.minutesSecond==''){//节流判断
	    		//--------------------------
	    		if(this.system == 12){
		    	 	this.hour =this.nowTime.getHours();//12小时制执行这个,获得小时的值(number类型用于加减)

		    	 	//在12小时制中,进行AM PM判断 先于时间判断。避免覆盖
		    	 	//24小时不需要判断
			    	if(this.hour >= 12){
				    	this.setTimeNum(this.selectNumArr('ArrP'),this.boxAP);
			    	}else{
			    		this.setTimeNum(this.selectNumArr('ArrA'),this.boxAP);
			    	}
			    	if(this.hour>12){
			    	 	this.hour = (this.hour - 12).toString();
				    	 	if(this.hour == 0){this.hour = '12';}
				    }else{this.hour = this.hour.toString();}

			    }else{
			    	 this.hour = this.nowTime.getHours().toString();
			    }
			    //获取小时的第一位数
		    	this.hourFirst = this.hour.slice(0,1);
		    	//获取小时的第二位数
		    	this.hourSecond = this.hour.slice(1);
		    	//--------------------------------
		    	if(this.hour.length > 1){
	    			this.switchTime(this.hourFirst,this.hourSpan1);
	    			this.switchTime(this.hourSecond,this.hourSpan2);
			    }else{
			    	
	    			this.switchTime('0',this.hourSpan1);
	    			this.switchTime(this.hourFirst,this.hourSpan2);
			    }
		    }
		}
		EleWatch.prototype.switchTime = function(timeItem,clockElement){
	    	switch(timeItem){
				case '0':
				this.setTimeNum(this.selectNumArr('Arr0'),clockElement);
				break;
				case '1':
				this.setTimeNum(this.selectNumArr('Arr1'),clockElement);
				break;
				case '2':
				this.setTimeNum(this.selectNumArr('Arr2'),clockElement);
				break;
				case '3':
				this.setTimeNum(this.selectNumArr('Arr3'),clockElement);
				break;
				case '4':
				this.setTimeNum(this.selectNumArr('Arr4'),clockElement);
				break;
				case '5':
				this.setTimeNum(this.selectNumArr('Arr5'),clockElement);
				break;
				case '6':
				this.setTimeNum(this.selectNumArr('Arr6'),clockElement);
				break;
				case '7':
				this.setTimeNum(this.selectNumArr('Arr7'),clockElement);
				break;
				case '8':
				this.setTimeNum(this.selectNumArr('Arr8'),clockElement);
				break;
				case '9':
				this.setTimeNum(this.selectNumArr('Arr9'),clockElement);
				break;
			}	
	    }
	    //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
	    
		//用于设置每格时间数字的方法,参数 arr:代表数字的数组;element:指定的numBox元素
		EleWatch.prototype.setTimeNum = function(numArr,element){
			//this.spanLength = 35;固定值
			for(var i=0;i<35;i++){
				if(numArr[i] == 1){
					element[i].style.background = this.numColor;//~~~~~~~~~~~~~!!!设置颜色
				}else{
					element[i].style.background = this.numBackColor;
				}
			}
		}
		//返回所需要的生产数字的数组
		EleWatch.prototype.selectNumArr = function(arrName){
			switch(arrName){
				case 'Arr0':
				return this.Arr0 = [0,1,1,1,1,
							         0,1,0,0,1,
							         0,1,0,0,1,
							         0,1,0,0,1,
							         0,1,0,0,1,
							         0,1,0,0,1,
							         0,1,1,1,1];
				break;
				case 'Arr1':
				return this.Arr1 = [0,0,1,0,0,
								     0,1,1,0,0,
								     0,0,1,0,0,
								     0,0,1,0,0,
								     0,0,1,0,0,
								     0,0,1,0,0,
								     0,1,1,1,0];
				break;
				case 'Arr2':
				return this.Arr2 = [0,1,1,1,1,
								    0,0,0,0,1,
								    0,0,0,0,1,
								    0,1,1,1,1,
								    0,1,0,0,0,
								    0,1,0,0,0,
								    0,1,1,1,1];
				break;
				case 'Arr3':
				return this.Arr3 = [0,1,1,1,1,
								    0,0,0,0,1,
								    0,0,0,0,1,
								    0,1,1,1,1,
								    0,0,0,0,1,
								    0,0,0,0,1,
								    0,1,1,1,1];
				break;
				case 'Arr4':
				return this.Arr4 = [0,1,0,0,1,
								    0,1,0,0,1,
								    0,1,0,0,1,
								    0,1,0,0,1,
								    0,1,1,1,1,
								    0,0,0,0,1,
								    0,0,0,0,1];
				break;
				case 'Arr5':
				return this.Arr5 = [0,1,1,1,1,
								    0,1,0,0,0,
								    0,1,0,0,0,
								    0,1,1,1,1,
								    0,0,0,0,1,
								    0,0,0,0,1,
								    0,1,1,1,1];
				break;
				case 'Arr6':
				return this.Arr6 = [0,1,1,1,1,
								    0,1,0,0,0,
								    0,1,0,0,0,
								    0,1,1,1,1,
								    0,1,0,0,1,
								    0,1,0,0,1,
								    0,1,1,1,1];
				break;
				case 'Arr7':
				return this.Arr7 = [0,1,1,1,1,
								    0,0,0,0,1,
								    0,0,0,0,1,
								    0,0,0,0,1,
								    0,0,0,0,1,
								    0,0,0,0,1,
								    0,0,0,0,1];
				break;
				case 'Arr8':
				return this.Arr8 = [0,1,1,1,1,
								    0,1,0,0,1,
								    0,1,0,0,1,
								    0,1,1,1,1,
								    0,1,0,0,1,
								    0,1,0,0,1,
								    0,1,1,1,1];
				break;
				case 'Arr9':
				return this.Arr9 = [0,1,1,1,1,
								    0,1,0,0,1,
								    0,1,0,0,1,
								    0,1,1,1,1,
								    0,0,0,0,1,
								    0,0,0,0,1,
								    0,1,1,1,1];
				break;
				case 'ArrM':
				return this.ArrM = [1,0,0,0,1,
								     1,1,0,1,1,
								     1,0,1,0,1,
								     1,0,1,0,1,
								     1,0,0,0,1,
								     1,0,0,0,1,
								     1,0,0,0,1];
				break;
				case 'ArrA':
				return this.ArrA =  [0,0,1,1,0,
								     0,1,0,0,1,
								     0,1,0,0,1,
								     0,1,1,1,1,
								     0,1,0,0,1,
								     0,1,0,0,1,
								     0,1,0,0,1];
				break;
				case 'ArrP':
				return this.ArrP = [0,1,1,1,0,
								     0,1,0,0,1,
								     0,1,0,0,1,
								     0,1,0,0,1,
								     0,1,1,1,0,
								     0,1,0,0,0,
								     0,1,0,0,0];
				break;
				case 'pointArr':
				return this.pointArr = [0,0,0,0,0,
									    0,0,0,0,0,
									    0,0,1,0,0,
									    0,0,0,0,0,
									    0,0,1,0,0,
									    0,0,0,0,0,
									    0,0,0,0,0];
				break;
			}
		}
		//如果是12小时制则设置最后一个固定不变的M,不放入定时器
		EleWatch.prototype.setLastM = function(){
			this.boxM = this.numBox[7].children;
			this.setTimeNum(this.selectNumArr('ArrM'),this.boxM);
		}
		//设置两组分割点
		EleWatch.prototype.setPonits = function(){
			//获取两个闪动点子元素
			this.pointrBox = this.clockBox.querySelectorAll('.pointBox');
			this.pointSpan1 = this.pointrBox[0].children;
			this.pointSpan2 = this.pointrBox[1].children;

			//设置两组分隔点
			this.setTimeNum(this.selectNumArr('pointArr'),this.pointSpan1);
			this.setTimeNum(this.selectNumArr('pointArr'),this.pointSpan2);

			this.point1Dian1 = this.pointSpan1[12];//第1个格的第1个点
			this.point1Dian2 = this.pointSpan1[22];//第1个格的第2个点
			this.point21Dian1 = this.pointSpan2[12];//第2个格的第1个点
			this.point2Dian2 = this.pointSpan2[22];//第2个格的第2个点
			//设置两个点的透明度,用于闪动
			//现设置四个点的头部度为空，然后在setNowTime方法中判断
			//如果透明度不等于1就设为0.5,这样进入画面四个点都是不透明的
			this.point1Dian1.style.opacity= '';
			this.point1Dian2.style.opacity= '';
			this.point21Dian1.style.opacity= '';
			this.point2Dian2.style.opacity= '';

			this.point1Dian1.style.transition= 'all linear .1s';
			this.point1Dian2.style.transition= 'all linear .1s';
			this.point21Dian1.style.transition= 'all linear .1s';
			this.point2Dian2.style.transition= 'all linear .1s';
		}
		//设置每个span的高宽
		EleWatch.prototype.setEachSpanSize = function(){
			this.span = this.clockBox.querySelectorAll('span');
			this.spanMarginT = 1;
			this.spanMarginL = 1;
			this.spanHeight = Math.floor(this.clock_height / 7) - (this.spanMarginT*2) +1;
		    this.spanWidth = this.spanHeight;
		    for(var i =0;i<this.span.length;i++){
				this.span[i].style.float = 'left';
				this.span[i].style.width = this.spanWidth +'px';
				this.span[i].style.height = this.spanHeight+'px';
				this.span[i].style.boxSizing = 'border-box';
				/*this.span[i].style.background = 'black';*/
				this.span[i].style.marginLeft = this.spanMarginL +'px';
				this.span[i].style.marginTop = this.spanMarginT +'px';
				this.span[i].style.borderRadius = '2px';
			}
		}
		//设置父元素内每个div的高宽
		EleWatch.prototype.setEachDivSize = function(){
			//获取所有div子元素
			this.divBox = this.clockBox.querySelectorAll('div');
			this.divBoxWidth = this.clock_width/10;
			for(var i =0;i<this.divBox.length;i++){
				this.divBox[i].style.float = 'left';
				this.divBox[i].style.width = this.divBoxWidth +'px';
				this.divBox[i].style.height = this.clock_height+'px';
				this.divBox[i].style.boxSizing = 'border-box';
			}
		}
		//设置父元素高宽。
		EleWatch.prototype.setClockSize = function(clockSize){
			switch(clockSize){
				case 1:
				this.clock_width = 171;
				break;
				case 2:
				this.clock_width = 270;
				break;
				case 3:
				this.clock_width = 370;
				break;
				case 4:
				this.clock_width = 470;
				break;
				case 5:
				this.clock_width = 570;
				break;
				case 6:
				this.clock_width = 670;
				break;
				case 7:
				this.clock_width = 770;
				break;
				case 8:
				this.clock_width = 870;
				break;
				case 9:
				this.clock_width = 970;
				break;
				case 10:
				this.clock_width = 1070;
				break;
				case 11:
				this.clock_width = 1170;
				break;
				case 12:
				this.clock_width = 1270;
				break;
				default:
				//如果传入参数不存在指定值,则设为 4 (470)
				this.clock_width = 470;
				break;
			}
			this.clock_height = Math.ceil(this.clock_width * 0.14085714);
			this.clockBox.style.height =this.clock_height +'px';
			this.clockBox.style.width =this.clock_width + 2 +'px';
			this.clockBox.style.boxSizing = 'border-box';
		}

		//向父元素添加所有子元素
		EleWatch.prototype.createNumBox = function(){
			var allClockEle = `<div class="numBox">
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
		</div>
		<div class="numBox">
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
		</div>
		<div class="pointBox">
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
		</div>
		<div class="numBox">
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
		</div>
		<div class="numBox">
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
		</div>
		<div class="pointBox">
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
		</div>
		<div  class="numBox">
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
		</div>
		<div class="numBox">
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
		</div>
		<div class="numBox">
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
		</div>
		<div class="numBox">
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
			<span></span><span></span><span></span><span></span><span></span>
		</div>`;
			this.clockBox.innerHTML = allClockEle; 
		}