$(function(){
	var  animate ={
	    style:["bounce","flash","pulse","rubberBand","shake","swing","tada","wobble","jello","bounceIn","bounceInDown",
	            "bounceInLeft","bounceInRight","bounceInUp",
	            "fadeIn","fadeInDown","fadeInDownBig","fadeInLeft","fadeInLeftBig","fadeInRight","fadeInRightBig",
	            "fadeInUp","fadeInUpBig",
	            "flipInX","flipInY","lightSpeedIn",
	            "rotateIn","rotateInDownLeft","rotateInDownRight","rotateInUpLeft","rotateInUpRight",
	            "rollIn","zoomIn","zoomInDown","zoomInLeft",
	            "zoomInRight","zoomInUp","slideInDown","slideInLeft",
	            "slideInRight","slideInUp"],
	    pickStyle:function(){
	        var len = this.style.length;
	        var i = Math.floor(Math.random()*len);
	        return "animated " + this.style[i];
	    }
	};	

	var imagesData = (function(){
		var urls = [];
		var index = 0;
		return {
			clear:function(){
				urls = [],
				index = 0;
			},
			isEmpty:function(){
				return urls.length === 0;
			},
			getNext:function(){
				index ++;
				if(index == urls.length){
					index = 0;
				}
				return urls[index];
			},
			getPrevious:function(){
				index --;
				if(index == -1){
					index = urls.length - 1;
				}
				return urls[index];
			},
			next:function(){
				var _index = index;
				_index ++;
				if(_index == urls.length){
					_index = 0;
				}
				return urls[_index];
			},
			previous:function(){
				var _index = index;
				_index --;
				if(_index == -1){
					_index = urls.length - 1;
				}
				return urls[_index];	
			},
			random:function(){
				index = Math.floor(Math.random()*urls.length);
				return urls[index];
			},
			addUrls:function(_urls){
				if(Array.isArray(urls)){
					urls = _urls;
				}else if(typeof _urls == 'string'){
					urls.push(_urls);
				}
			}
		}
	})();

	(function(){
		var $img = $('img'),
			windowWidth = $('body').width(),
			windowHeight = $('body').height(),
			imgWidth = $img.width(),
			imgHeight = $img.height(),
			marginTop = (windowHeight - imgHeight) / 2;

		$img.css("marginTop",marginTop+'px');
	})();

	function resize($img){
		$img.css({
			height:"",
			width:""
		});
		
		var	windowWidth = $('body').width(),
			windowHeight = $('body').height(),
			imgWidth = $img.width(),
			imgHeight = $img.height();

		//  desktop
		if( windowWidth > windowHeight ){
			if( imgWidth > windowWidth ){
				$img.css({
					width:windowWidth * 0.9 +'px',
					height:imgHeight * ( (windowWidth * 0.9)/imgWidth) + 'px'
				});
			}
		}		
		// phone or pad
		else{
			if( imgHeight > windowHeight ){
				$img.css({
					height:windowHeight + 'px',
					width:imgWidth * (windowWidth/imgWidth) + 'px'
				});
			}
		}
		$img.css({
			marginTop:(windowHeight - $img.height())/2 + 'px'
		});	
	}

	var Player = (function(){
		var preLoadImage = new Image();
		var $img = $('#photo');
		var _isPlaying = false;

		var toggleAutoPlay = (function(){
			var intervalId;			
			return function(isRandom){
				if(_isPlaying === false){
					_isPlaying = true;
					if(isRandom == true){
						showRandom();
					}else{
						showNext();
					}
					intervalId = setInterval(function(){
						if(isRandom == true){
							showRandom();
						}else{
							showNext();
						}
					},2000);
				}else{
					_isPlaying = false;
					clearInterval(intervalId);
				}
				if(_isPlaying == false){
					$('#sequence').text('顺序播放');
					$('#random').text('随机播放');
				}else{
					$('#sequence').text('暂停播放');
					$('#random').text('暂停播放');
				}
			}
		})();
		var isPlaying = function(){
			return _isPlaying;
		}
		var showNext = function(){
			var	style = animate.pickStyle(),
				url = '';

			url = imagesData.getNext();
			preLoadImage.src = imagesData.next();
			$img.attr('src', url );
			$img.attr('class',style);
			resize($img);	
		};

		var showPrevious = function(){
			var	style = animate.pickStyle(),
				url = '';

			url = imagesData.getPrevious();
			preLoadImage.src = imagesData.previous();
			$img.attr('src', url );
			$img.attr('class',style);
			resize($img);	
		};
		var showRandom = function(){
			var	style = animate.pickStyle(),
				url = '';

			url = imagesData.random();
			preLoadImage.src = imagesData.previous();
			$img.attr('src', url );
			$img.attr('class',style);
			resize($img);	
		};
		var toggleMusic = (function(){
			var audio = $('audio').get(0);
			var isPlayingMusic = false;
			return function(){
				if(isPlayingMusic == false){
					isPlayingMusic = true;
					audio.play();
				}else{
					isPlayingMusic = false;
					audio.pause();
				}
				if(isPlayingMusic == false){
					$('#music-control').text('播放音乐');
				}else{
					$('#music-control').text('暂停音乐');
				}
			}
		})();
		return {
			toggleAutoPlay:toggleAutoPlay,
			showNext:showNext,
			showPrevious:showPrevious,
			toggleMusic:toggleMusic,
			showRandom:showRandom,
			isPlaying:isPlaying
		};
	})(); 


	(function(){
		$.getJSON("../src/urls.json",function(data){
			imagesData.addUrls(data.urls);
			Player.showNext();
		});
	})();

	$('body').keyup(function(event){
		var key = event.which;
		console.log(key);

		if( key == 37 || key == 38 ){ // pre
			Player.showPrevious();
		}else if( key == 39  || key == 40 ){ // next
			Player.showNext();
		}else if( key == 80 ){  //press 'p' autoplay or stop autoplay
			Player.toggleAutoPlay();
		}else if( key == 77){ // 'm'  music
			Player.toggleMusic();
		}
	});

	$('body').click(function(){
		$('.control').toggleClass('control-show');
	});

	$('#sequence').click(function(){
		Player.toggleAutoPlay();
	});

	$('#random').click(function(){
		Player.toggleAutoPlay(/*isRandom = */ true);
	});

	$('#music-control').click(function(){
		Player.toggleMusic();
	});

	$('#full-screen').click(function(){
		var fullScreenElement = document.fullscreenElement ||  
		    document.webkitFullscreenElement ||  
		    document.mozFullScreenElement ||  
		    document.msFullscreenElement;
		if ( fullScreenElement ){
			if (document.exitFullscreen) {  
			    document.exitFullscreen();  
			} else if (document.webkitExitFullscreen) {  
			    document.webkitExitFullscreen();  
			} else if (document.mozCancelFullScreen) {  
			    document.mozCancelFullScreen();  
			} else if (document.msExitFullscreen) {  
			    document.msExitFullscreen();  
			}
			$(this).text('进入全屏');
		}else{
			var i = document.documentElement;  
			// go full-screen  
			if (i.requestFullscreen) {  
			    i.requestFullscreen();  
			} else if (i.webkitRequestFullscreen) {  
			    i.webkitRequestFullscreen();  
			} else if (i.mozRequestFullScreen) {  
			    i.mozRequestFullScreen();  
			} else if (i.msRequestFullscreen) {  
			    i.msRequestFullscreen();  
			}
			$(this).text('退出全屏');
		}

	});
	function FShandler(event){
		var $img = $("#photo");
		resize($img);
	}
	document.addEventListener("fullscreenchange", FShandler);  
	document.addEventListener("webkitfullscreenchange", FShandler);  
	document.addEventListener("mozfullscreenchange", FShandler);  
	document.addEventListener("MSFullscreenChange", FShandler);  
	
	// touch event
	(function(){
		var touchPoint = {
			start:{x:0,y:0},
			end:{x:0,y:0}
		};
		var body = document.body;
		body.addEventListener("touchmove", function(event){
			event.preventDefault();
		}, false);
	 	body.addEventListener("touchstart", function(event){
	 		touchPoint.start.x = event.changedTouches[0].pageX;
			touchPoint.start.y = event.changedTouches[0].pageY;	
 			
	 	}, false);
		body.addEventListener("touchend", function(event){	
	 		
	 		touchPoint.end.x = event.changedTouches[0].pageX;
			touchPoint.end.y = event.changedTouches[0].pageY;	
	 		

	 		var direction = '';
	 		var xdiff = touchPoint.start.x - touchPoint.end.x;
	 		var ydiff = touchPoint.start.y - touchPoint.end.y;
	 		if(Math.abs(xdiff)>10||Math.abs(ydiff)>10){
		 		if(Math.abs(xdiff)>Math.abs(ydiff)){
		 			if(xdiff<0){
		 				direction = 'right';
		 			}else{
		 				direction = 'left';
		 			}
		 		}else{
		 			if(ydiff<0){
		 				direction = 'down';
		 			}else{
		 				direction = 'up';
		 			}
		 		}
	 		}
			switch(direction){
				case 'left':
					Player.showNext();
					break;
				case 'up':
					Player.toggleAutoPlay();
				break;
				case 'right':
					Player.showPrevious();
				break;
				case 'down':
					Player.toggleMusic();
				break;
				default:
				break;
			}
  		}, false);
	})();
});