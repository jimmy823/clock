;
(function($){
    $.fn.clickQu = function(options){
        var pointTimer;
        //var forClickEl = this;//可点击地区
        var startPoint = options.startPoint.get(0);//开始点
        var pointSize = options.pointSzie;
        var pointNum = options.pointNum;
        //获取开始元素坐标(中心点)
        var startElheight = $(startPoint).height();
        var startElwidth = $(startPoint).width();

        var yS= (startPoint.offsetTop + document.body.scrollTop) + (startElheight/2);
        var xS= (startPoint.offsetLeft + document.body.scrollLeft + (startElwidth/2));
        
        this.on('click',function(e){

            if(pointTimer){
                clearInterval(pointTimer);
                $('.theShowSpan').remove();
            }
            
            //获取点击坐标
            var xC= getMousePos(e).x;
            var yC= getMousePos(e).y;

            var computeArray = [{ x: xS, y: yS }]

            var noteMidXslice = (xS - xC ) / 8;
            var noteMidYslice = (yC - yS) / 4;

            var noteX = xC + noteMidXslice*3;
            var noteY = yC - noteMidYslice*3;

            var noteMidArray = {x:noteX,y:noteY}

            computeArray.push(noteMidArray);
            
            var psTwo = { x: xC, y: yC };
            
            computeArray.push(psTwo);
            

            var pointArray = CreateBezierPoints(computeArray,pointNum);
            
            pointArray.push({ x: xC, y: yC });//多家最后一个点

            animatePoint(pointArray);
        })

        function animatePoint(theArray){
            var theKey = 0;
            pointTimer = setInterval(function(){
                
                if(theKey >= theArray.length){
                    clearInterval(pointTimer);
                }else{
                    
                    if(theKey !== 0){
                        if(theKey == theArray.length-1){
                            var spanColor = 'background-color:#fff;'
                        }else{
                            var spanColor = 'background-color:black;'
                        }
                        var spanStyle = "margin:0px;padding:0px;display:block;position:absolute;border-radius:50%;";
                        var spanPosition = spanStyle+ spanColor + 'left:'+(theArray[theKey].x-(pointSize/2))+'px;'+'top:'+(theArray[theKey].y-pointSize/2)+'px;'+'height:'+pointSize+'px;width:'+pointSize+'px;'
                        var CircleSpan = '<span class="theShowSpan" style=" '+spanPosition+' "></span>'
                        $('body').append(CircleSpan);
                    }
                    theKey++;
                }
            },10)
        }

        function getMousePos(event) {
            var e = event || window.event;
            var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
            var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
            var x = e.pageX || e.clientX + scrollX;
            var y = e.pageY || e.clientY + scrollY;
            //alert('x: ' + x + '\ny: ' + y);
            return { 'x': x, 'y': y };
        } 

        //anchorpoints：贝塞尔基点

                //pointsAmount：生成的点数

        　　　　//return 路径点的Array
        function CreateBezierPoints(anchorpoints, pointsAmount) {
          
            var points = [];

            for (var i = 0; i < pointsAmount; i++) {

                var point = MultiPointBezier(anchorpoints, i / pointsAmount);

                points.push(point);

            }

            return points;

        }

        function MultiPointBezier(points, t) {

            var len = points.length ;

            var x = 0, y = 0;

            var erxiangshi = function (start, end) {

                var cs = 1, bcs = 1;

                while (end > 0) {

                    cs *= start;

                    bcs *= end;

                    start--;

                    end--;

                }

                return (cs / bcs);

            };

            for (var i = 0; i < len; i++) {

                var point = points[i];

                x += point.x * Math.pow((1 - t), (len - 1 - i)) * Math.pow(t, i) * (erxiangshi(len - 1, i));

                y += point.y * Math.pow((1 - t), (len - 1 - i)) * Math.pow(t, i) * (erxiangshi(len - 1, i));

            }

            return { x: x, y: y };

        }
    }
})($)