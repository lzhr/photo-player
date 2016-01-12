$(function() {
    var Player = (function() {

        // rely on animate.css
        // https://github.com/daneden/animate.css
        var pickAnimateStyle = (function() {
            var style = [
                "bounce", "flash", "pulse", "rubberBand", "shake",
                "swing", "tada", "wobble", "jello", "bounceIn",
                "bounceInDown", "bounceInLeft", "bounceInRight",
                "fadeIn", "fadeInDown", "fadeInDownBig",
                "fadeInLeft", "fadeInLeftBig", "fadeInRight",
                "fadeInRightBig", "fadeInUp", "fadeInUpBig",
                "flipInX", "flipInY", "lightSpeedIn",
                "rotateIn", "rotateInDownLeft", "rotateInDownRight",
                "rotateInUpLeft", "rotateInUpRight", "bounceInUp",
                "rollIn", "zoomIn", "zoomInDown", "zoomInLeft",
                "zoomInRight", "zoomInUp", "slideInDown",
                "slideInLeft", "slideInRight", "slideInUp"
            ];
            return function() {
                var len = style.length,
                    index = Math.floor(Math.random() * len);
                return "animated " + style[index];
            }
        })();

        var imageSet = (function() {
            var urls = [],
                index = 0,
                preloadImage = new Image();
            return {
                clear: function() {
                    urls = [];
                    index = 0;
                },
                isEmpty: function() {
                    return urls.length === 0;
                },
                next: function() {
                    index += 1;
                    if (index == urls.length) {
                        index = 0;
                    }
                    preloadImage.src = this._getNext();
                    return urls[index];
                },
                last: function() {
                    index -= 1;
                    if (index == -1) {
                        index = urls.length - 1;
                    }
                    preloadImage.src = this._getLast();
                    return urls[index];
                },
                // only get next image's url don't change index
                _getNext: function() {
                    var _index = index;
                    _index++;
                    if (_index == urls.length) {
                        _index = 0;
                    }
                    return urls[_index];
                },
                // only get last image's url don't change index
                _getLast: function() {
                    var _index = index;
                    _index--;
                    if (_index == -1) {
                        _index = urls.length - 1;
                    }
                    return urls[_index];
                },
                random: function() {
                    index = Math.floor(Math.random() * urls.length);
                    return urls[index];
                },
                add: function(_urls) {
                    if (Array.isArray(_urls)) {
                        urls = urls.concat(_urls);
                    } else if (typeof _urls == 'string') {
                        urls.push(_urls);
                    }
                }
            }
        })();

        var $img = $('#photo'),
            $audio = $('audio');

        $img.on({
            resize: function(event) {
                resize($img);
                event.stopPropagation();
            },
            load: function(event) {
                $img.trigger('resize');
            },
            next: function(event) {
                $(this).attr({
                    'src': imageSet.next(),
                    'class': pickAnimateStyle()
                });
            },
            last: function(event) {
                $(this).attr({
                    'src': imageSet.last(),
                    'class': pickAnimateStyle()
                });
            },
            random: function() {
                $(this).attr({
                    'src': imageSet.random(),
                    'class': pickAnimateStyle()
                });
            },
            toggleAutoPlay: function(event, isRandom) {
                $this = $(this);
                if ($this.data('playing') === true) {
                    $this.data('playing', false);
                    var id = $this.data('intervalId');
                    clearInterval(id);
                    $('#random-play').text('随机播放');
                    $('#order-play').text('顺序播放');
                } else {
                    // play immediately
                    if (isRandom == true) {
                        $this.trigger('random');
                    } else {
                        $this.trigger('next');
                    }
                    var id = setInterval(function(isRandom) {
                        if (isRandom == true) {
                            $this.trigger('random');
                        } else {
                            $this.trigger('next');
                        }
                    }, 2000);
                    $img.data('intervalId', id);
                    $img.data('playing', true);
                    $('#random-play').text('暂停播放');
                    $('#order-play').text('暂停播放');
                }
            }
        });

        $audio.on({
            toggle: function() {
                $this = $(this);
                if ($this.data('playing') === true) {
                    this.pause();
                } else {
                    this.play();
                }
            },
            play: function() {
                $(this).data('playing', true);
                $('#music-toggle').text('暂停音乐');
            },
            pause: function() {
                $(this).data('playing', false);
                $('#music-toggle').text('播放音乐');
            }
        });

        (function() {
            var $panel = $('.panel'),
                $orderPlay = $('#order-play'),
                $randomPlay = $('#random-play'),
                $musicToggle = $('#music-toggle'),
                $fullscreenToggle = $('#fullscreen-toggle');

            $('body').click(function() {
                $panel.toggleClass('panel-show');
            });

            $(window).resize(function() {
                $img.trigger('resize');
            });

            $orderPlay.click(function(event) {
                Player.toggleAutoPlay();
                event.stopPropagation();
            });

            $randomPlay.click(function(event) {
                Player.toggleAutoPlay( /*isRandom = */ true);
                event.stopPropagation();
            });

            $musicToggle.click(function(event) {
                Player.toggleMusic();
                event.stopPropagation();
            });

            $fullscreenToggle.click(function(event) {
                var fullScreenElement = document.fullscreenElement ||
                    document.webkitFullscreenElement ||
                    document.mozFullScreenElement ||
                    document.msFullscreenElement;
                if (fullScreenElement) {
                		// exit full-screen
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                    $fullscreenToggle.text('进入全屏');
                } else {
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
                    $fullscreenToggle.text('退出全屏');
                }
                event.stopPropagation();
            });

            function FShandler(event) {
                $img.trigger('resize');
            }
            document.addEventListener("fullscreenchange", FShandler);
            document.addEventListener("webkitfullscreenchange", FShandler);
            document.addEventListener("mozfullscreenchange", FShandler);
            document.addEventListener("MSFullscreenChange", FShandler);
        })();





        var init = function() {
            $.getJSON("http://wy-ei.com/photo-player/src/urls.json", function(data) {
                imageSet.add(data.urls);
            });
        };

        var toggleAutoPlay = function(isRandom) {
            $img.trigger('toggleAutoPlay');
        };

        var showNext = function() {
            $img.trigger('next');
        };

        var showLast = function() {
            $img.trigger('last')
        };
        var showRandom = function() {
            $img.trigger('random');
        };
        var toggleMusic = function() {
            $audio.trigger('toggle');
        }

        return {
            toggleAutoPlay: toggleAutoPlay,
            showNext: showNext,
            showLast: showLast,
            toggleMusic: toggleMusic,
            init: init
        };

    })();

    Player.init();

    // key board Event
    $('body').keyup(function(event) {
        var key = event.which;

        // up or left --> show previous 
        if (key == 37 || key == 38) {
            Player.showLast();
        }
        // down or right --> show next 
        else if (key == 39 || key == 40) {
            Player.showNext();
        }
        // 'p' --> autoplay or stop autoplay 
        else if (key == 80) {
            Player.toggleAutoPlay();
        }
        // 'm' --> start or stop music
        else if (key == 77) {
            Player.toggleMusic();
        }
    });


    // touch event
    (function() {
        var touchInfo = {
            start: {
                x: 0,
                y: 0
            },
            end: {
                x: 0,
                y: 0
            },
            getDirection: function() {
                var direction = '',
                    xdiff = this.start.x - this.end.x,
                    ydiff = this.start.y - this.end.y;
                if (Math.abs(xdiff) > 10 || Math.abs(ydiff) > 10) {
                    if (Math.abs(xdiff) > Math.abs(ydiff)) {
                        direction = xdiff < 0 ? 'right' : 'left';
                    } else {
                        direction = ydiff < 0 ? 'down' : 'up';
                    }
                }
                return direction;
            }
        };
        var body = document.body;
        body.addEventListener("touchmove", function(event) {
            event.preventDefault();
        }, false);
        body.addEventListener("touchstart", function(event) {
            touchInfo.start.x = event.changedTouches[0].pageX;
            touchInfo.start.y = event.changedTouches[0].pageY;
        }, false);
        body.addEventListener("touchend", function(event) {
            touchInfo.end.x = event.changedTouches[0].pageX;
            touchInfo.end.y = event.changedTouches[0].pageY;

            var direction = touchInfo.getDirection();
            switch (direction) {
                case 'left':
                    Player.showNext();
                    break;
                case 'up':
                    Player.toggleAutoPlay();
                    break;
                case 'right':
                    Player.showLast();
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


function resize($img) {
    $img.css({
        height: "",
        width: ""
    });

    var windowWidth = $('body').width(),
        windowHeight = $('body').height(),
        imgWidth = $img.width(),
        imgHeight = $img.height();
    //  desktop
    if (windowWidth > windowHeight) {
        if (imgWidth > windowWidth) {
            $img.css({
                width: windowWidth * 0.9 + 'px',
                height: imgHeight * ((windowWidth * 0.9) /
                    imgWidth) + 'px'
            });
        }
    }
    // phone or pad
    else {
        if (imgHeight > windowHeight) {
            $img.css({
                height: windowHeight + 'px',
                width: imgWidth * (windowWidth / imgWidth) + 'px'
            });
        }
    }
    $img.css({
        marginTop: (windowHeight - $img.height()) / 2 + 'px'
    });
}


$(window).load(function() {
	$('#photo').trigger('resize');
});