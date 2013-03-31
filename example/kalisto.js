/**
* kalisto v0.9
*
*
* Copyright (c) 2013 Cristobal Chao
* MIT License
**/
(function( window, $, undefined ){

	if ( !$.cssHooks ) {
		throw("jQuery 1.4.3+ is needed for this plugin to work");
		return;
	}

	function styleSupport( prop ) {
		var vendorProp, supportedProp,
			capProp = prop.charAt(0).toUpperCase() + prop.slice(1),
			prefixes = [ "Moz", "Webkit", "O", "ms" ],
			newprefixes = [ "-moz-", "-webkit-", "-o-", "-ms-" ],
			div = document.createElement( "div" );

		if ( prop in div.style ) {
			supportedProp = prop;
		} else {
			for ( var i = 0; i < prefixes.length; i++ ) {
				vendorProp = prefixes[i] + capProp;
				if ( vendorProp in div.style ) {
					supportedProp = newprefixes[i]+prop;
					break;
				}
			}
		}

		div = null;
		$.support[ prop ] = supportedProp;
		return supportedProp;
	}

	var kalisto = styleSupport( "transform" ),
		kalisto_transition = styleSupport( "transition" ),
		kalisto_duration = kalisto_transition+'-duration',
		kalisto_timing = kalisto_transition+'-timing-function';

	$.cssHooks.translate = {
		get: function( elem, computed, extra ) {
			return elem.style[ kalisto ];
		},
		set: function( elem, value) {
			var _x = value[0];
			var _y = value[1];
			elem.style[ kalisto ] = "translate("+_x+"px,"+_y+"px) ";
		}
	};

	$.fn.setDuration = function(time) { //Set duration (ms)
		this.css(kalisto_duration,time+'ms');
	}

	$.fn.getDuration = function(){ //Get duration (ms)
		return this.css(kalisto_duration);
	}

	$.fn.setTiming = function(timing) { //Set Timing
		this.css(kalisto_timing,timing);
	}

	$.fn.getTiming = function(){ //Get Timing
		return this.css(kalisto_timing);
	}

	//Animating the elements
	$.fn.animate = function(){
		var $this = this,
			_time = $this.getDuration(),
			_index = $this.index(),
			i = 0;

		$this.addClass('active').css('translate',[0,$kalisto.arrayPositions[$kalisto.arrayPositions.length-1]]);

		$($kalisto.element).each(function(){
			if (i > _index){
				$(this).css('translate',[0,$kalisto.arrayPositions[i-1]]);
			}
			i++;
		});

		$kalisto.container.addClass('active');

		setTimeout(function(){
			$this.insertAfter($($kalisto.element).last()).removeClass('active');
			$kalisto.container.removeClass('active');
		}, parseFloat(_time)*1000);
	}

	//Kalisto INIT - Setting init properties
	function init(){
		var i = 0;

		$($kalisto.element).each(function(){
			$kalisto.arrayPositions.push($(this).offset().top - $kalisto.containerPosition);
		});

		$($kalisto.element).each(function(){
			$(this).setDuration(0);
			$(this).setTiming($kalisto.timing);
			$(this).addClass('absolute').css('translate',[0,$kalisto.arrayPositions[i++]]).delay(500)
			.queue(function() {
				$(this).setDuration($kalisto.duration);
			});
		});

		//Triggering the elements ON CLICK
		$($kalisto.element).on('click',function(){
			if (!!!$kalisto.container.hasClass('active')){
				$(this).animate();
			}
		});
	}

	// *** Kalisto START ***
	$.fn.kalisto = function(args) {
		var $this = this,
			_element = (!!args.element) && args.element || '#' + $this.attr('id') + ' > ' + $this.children().get(0).tagName,
			_timing = (!!args.timing) && args.timing || 'linear',
			_duration = (!!args.duration) && args.duration || 1000;

		$kalisto = {
			container: $this,
			element: _element,
			timing: _timing,
			duration: _duration,
			arrayPositions: new Array(),
			containerPosition: $this.offset().top
		}

		init();

		return true;

	}


})( window, jQuery );