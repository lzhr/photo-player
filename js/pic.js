$(function(){
	var info = '载入以逗号分隔的图片的URL文件，即可使用方向键，浏览URL对应的图片'; 
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
			addUrls:function(_urls){
				if(Array.isArray(urls)){
					urls = _urls;
				}else if(typeof _urls == 'string'){
					urls.push(_urls);
				}
			}
		}
	})();

	var preLoadImage = new Image();
	var $img = $('#photo');
	
	var togglePlay = (function(){
		var isPlaying = false;
		var intervalId;
		return function(){
			if(isPlaying === false){
				isPlaying = true;
				showNext();
				intervalId = setInterval(function(){
					showNext();
					console.log('-->');
				},2000);
			}else{
				isPlaying = false;
				clearInterval(intervalId);
				console.log('stop');
			}
		}
	})();

	var showNext = function(){
		var	style = animate.pickStyle(),
			url = '';

		url = imagesData.getNext();
		preLoadImage.src = imagesData.next();
		$img.attr('src', url );
		$img.attr('class',style);
	};

	var showPrevious = function(){
		var	style = animate.pickStyle(),
			url = '';

		url = imagesData.getPrevious();
		preLoadImage.src = imagesData.previous();
		$img.attr('src', url );
		$img.attr('class',style);	
	};
	var toggleMusic = (function(){
		var audio = $('audio').get(0);
		var isPlaying = false;
		return function(){
			if(isPlaying == false){
				isPlaying = true;
				audio.play();
			}else{
				isPlaying = false;
				audio.pause();
			}
		}
	})();


	(function(){
		var	$img = $('img'),
			windowHeight = $('body').height(),
			imgHeight = $img.height(),
			marginTop = (windowHeight - imgHeight) / 2;
		$img.css('marginTop',marginTop + 'px');
	})();

	$('input').on("change",function(){
		if(this.files.length == 0){
			return;
		}
		var fileReader = new FileReader();
		
		fileReader.readAsText(this.files[0]);
		fileReader.onload = function(){
			imagesData.clear();
			imagesData.addUrls(fileReader.result.split(/,|,\n/));
			showNext();
		}
	});

	$('input').hover(
	function(){
		$('input').animate({
			left:'5px'
		},500);
	},
	function(){
		$('input').animate({
			left:'-180px'
		},500);	
	});

	$('body').keyup(function(event){
		var key = event.which;
		console.log(key);

		if( key == 37 || key == 38 ){ // pre
			showPrevious();
		}else if( key == 39  || key == 40 ){ // next
			showNext();
		}else if( key == 80 ){  //press 'p' autoplay or stop autoplay
			togglePlay();
		}else if( key == 77){ // 'm'  music
			toggleMusic();
		}
	});
});