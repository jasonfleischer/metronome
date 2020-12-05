var range_control = {

	color_track: '#077bff',
	color_background_track: getComputedStyle(document.documentElement).getPropertyValue("--tertiary-background-color"),
	color_font: getComputedStyle(document.documentElement).getPropertyValue("--primary-font-color"),
	color_button: getComputedStyle(document.documentElement).getPropertyValue("--secondary-background-color"),
	color_stroke: getComputedStyle(document.documentElement).getPropertyValue("--primary-background-color"),

	percent_value: 0,
	WIDTH: 0,
	HEIGHT: 0,
	radius: 0,
	track_width: 0,

	startAngleInRadians: 2 * Math.PI *.35,
	endAngleInRadians: 2 * Math.PI *.15,
	controlAngleInRadians: 0,

	minusX: 0,
	minusY: 0,
	plusX: 0,
	plusY: 0,

	on_range_control_changed: {},
	units: "",
	min: 0,
	max: 0,
	step: 0,
	value: 0, 
	show_percent: false,
	decimal_places: 1,
	special_cased_values: []
}

range_control.load = function(on_range_control_changed, units, min , max, step, value, show_percent, decimal_places, special_cased_values) {

	range_control.show_percent = typeof show_percent !== 'undefined' ? show_percent : false;
	range_control.decimal_places = typeof decimal_places !== 'undefined' ? decimal_places : 1;
	range_control.special_cased_values = typeof special_cased_values !== 'undefined' ? special_cased_values : [];
		
	range_control.on_range_control_changed = on_range_control_changed;
	range_control.min = min;
	range_control.max = max;
	range_control.step = step;  
	range_control.value = value;
	range_control.units = units;
	
	var canvas = document.getElementById("dial_canvas");
	range_control.WIDTH = canvas.width > canvas.height ? canvas.width : canvas.height;
	canvas.width=range_control.WIDTH;
	canvas.height=range_control.WIDTH;

	range_control.HEIGHT = range_control.WIDTH;
	range_control.radius = range_control.WIDTH / 2.0;
	range_control.track_width = range_control.radius*0.26;

	range_control.minusX = range_control.getXofCircle(range_control.radius- range_control.track_width/2, range_control.WIDTH/2.0, range_control.startAngleInRadians);
	range_control.minusY = range_control.getYofCircle(range_control.radius- range_control.track_width/2, range_control.HEIGHT/2.0, range_control.startAngleInRadians);
	range_control.plusX = range_control.getXofCircle(range_control.radius- range_control.track_width/2, range_control.WIDTH/2.0, range_control.endAngleInRadians);
	range_control.plusY = range_control.getYofCircle(range_control.radius- range_control.track_width/2, range_control.HEIGHT/2.0, range_control.endAngleInRadians);

	range_control.percent_value = parseInt(value).to_percent(min, max);
	range_control.draw(range_control.percent_value);

	// todo turn_on_listeners
	canvas.addEventListener('mousedown', range_control.mouse_down);
	canvas.addEventListener('mousemove', range_control.mouse_move);
	canvas.addEventListener('mouseup', range_control.mouse_up);
	canvas.addEventListener('mouseout', range_control.mouse_out);	

	// mobile TODO
	canvas.addEventListener('touchstart', range_control.mouse_down);
	canvas.addEventListener('touchmove', range_control.mouse_move);
	canvas.addEventListener('touchend', range_control.mouse_up);
	canvas.addEventListener('touchcancel', range_control.mouse_out);	

}


range_control.unload = function() {

	slide_left("#range_page");
	turn_off_listeners();

	function turn_off_listeners() {	
		$("#dial_canvas").off('mousedown').off('mousemove').off('mouseup').off('mouseout');
	}
}

range_control.mouse_events = {
	mouse_active_pt: { x: 0, y: 0 },
	mouse_move_pt: { x: 0, y: 0},
	mouse_is_active: false,
	minus_down_event: false,
	plus_down_event: false
}

range_control.mouse_down = function(e) {  
	e.stopPropagation();
	
	var m_e = range_control.mouse_events;
	var pt;  

	if(range_control.is_mobile_touch_event(e)){
		pt = range_control.get_mouse_point(this, { x: e.touches[0].pageX, y: e.touches[0].pageY });
		log("mobile touch_down: " + pt.x + " - " + pt.y);
	} else if(range_control.is_desktop_touch_event(e)){
		pt = range_control.get_mouse_point(this, { x: e.clientX, y: e.clientY });
		log("mousedown " + pt.x + " - " + pt.y);
	} else {
		logE("mouse_down pt not found");
		return;
	}

    if(range_control.getDistance(pt.x, pt.y, range_control.minusX, range_control.minusY) < range_control.track_width /2){
    	log("minusDown")
    	m_e.minus_down_event = true;

    	if(range_control.is_mobile_touch_event(e))
    		range_control.minus_pressed();
    } else if (range_control.getDistance(pt.x, pt.y, range_control.plusX, range_control.plusY) < range_control.track_width /2){
    	log("plus Down")
    	m_e.plus_down_event = true;

    	if(range_control.is_mobile_touch_event(e))
		   	range_control.plus_pressed();
    } else if (range_control.getDistance(pt.x, pt.y, range_control.WIDTH/2.0, range_control.HEIGHT/2.0) > range_control.radius - range_control.track_width*2) {
    	m_e.mouse_is_active = true;
    	log("move down")
    	m_e.mouse_active_pt = { x: pt.x, y: pt.y};
    }

    return false;
}


var previous_change_value = -1;
range_control.mouse_move = function(e) { 

	e.stopPropagation();

	var m_e = range_control.mouse_events;

	if(m_e.mouse_is_active){
    	var pt;  
		if(range_control.is_mobile_touch_event(e)){
			pt = range_control.get_mouse_point(this, { x: e.touches[0].pageX, y: e.touches[0].pageY });
			m_e.mouse_move_pt = pt;
		} else if(range_control.is_desktop_touch_event(e)){
			pt = range_control.get_mouse_point(this, { x: e.clientX, y: e.clientY });
			m_e.mouse_move_pt = pt;
		} else {
			logE("mouse_move pt not found");
			return;
		}

    	if(range_control.getDistance(pt.x, pt.y, range_control.WIDTH/2.0, range_control.HEIGHT/2.0) <= range_control.radius - range_control.track_width*2) {
    		log("mouse move out of bounds")
    		m_e.mouse_is_active = false;
    		range_control.emit_change(range_control.to_range_value(range_control.percent_value));
    	} else {
    		var centerPt = { x: range_control.WIDTH/2, y: range_control.HEIGHT/2};
    		var rad1 = range_control.getRadiansFromPt(m_e.mouse_active_pt, centerPt);
    		var rad2 = range_control.getRadiansFromPt(pt, centerPt);
    		var radian_value = (range_control.percent_to_radian(range_control.percent_value) - (rad1- rad2));
    		
			var temp = range_control.percent_value;
    		range_control.percent_value = range_control.radian_to_percent(radian_value);
    		
    		if(Math.abs(range_control.percent_value - temp) > 50){ // prevents error
    			range_control.percent_value = temp;
    		}

    		range_control.percent_value = Math.max(0, Math.min(100, range_control.percent_value));
    		range_control.value = range_control.to_range_value(range_control.percent_value);
    		range_control.draw(range_control.percent_value);


    		
    		var new_change_value =range_control.to_range_value(range_control.percent_value) 
    		if(new_change_value != previous_change_value) {
    			previous_change_value = new_change_value;
    			range_control.on_range_control_changed(new_change_value);
    		}

    		m_e.mouse_active_pt =  { x: pt.x, y: pt.y};

    		if(range_control.percent_value === 100 || range_control.percent_value ===0){
    			m_e.mouse_is_active = false;
    			range_control.emit_change( range_control.to_range_value(range_control.percent_value));
    		}
    	}
    }
    return false;
}

range_control.mouse_up = function(e) {

	e.stopPropagation();

	var m_e = range_control.mouse_events;
	var pt;

    if(range_control.is_mobile_touch_event(e)){
		pt = m_e.mouse_move_pt ;

		logE("range mobile mouseup wrong value: " + pt.x + " - " + pt.y);
	} else if(range_control.is_desktop_touch_event(e)){
		pt = range_control.get_mouse_point(this, { x: e.clientX, y: e.clientY });
		log("mouseup " + pt.x + " - " + pt.y);
	} else {
		logE("mouseup pt not found");
		return;
	}

    if(m_e.mouse_is_active){
    	// emit change to socket
    	range_control.emit_change( range_control.to_range_value(range_control.percent_value));
    }
    m_e.mouse_is_active = false;

    if(range_control.is_desktop_touch_event(e) && m_e.minus_down_event && range_control.getDistance(pt.x, pt.y, range_control.minusX, range_control.minusY) < range_control.track_width /2){
		range_control.minus_pressed();
	}
    m_e.minus_down_event = false;

	if(range_control.is_desktop_touch_event(e) && m_e.plus_down_event && range_control.getDistance(pt.x, pt.y, range_control.plusX, range_control.plusY) < range_control.track_width /2){
		range_control.plus_pressed();
    }
    m_e.plus_down_event = false;

    return false;
} 

range_control.mouse_out = function(e) {

	e.stopPropagation();

	var m_e = range_control.mouse_events;

	if(m_e.mouse_is_active)
		range_control.emit_change( range_control.to_range_value(range_control.percent_value));
	m_e.mouse_is_active = false;
	m_e.minus_down_event = false;
	m_e.plus_down_event = false;

	return false;
}

range_control.is_mobile_touch_event = function(e){
	return typeof e.touches !== 'undefined';
}
range_control.is_desktop_touch_event = function(e){
	return typeof e.clientX !== 'undefined' && typeof e.clientY !== 'undefined';
}

range_control.get_mouse_point = function(canvas, evt_pt) {
	var rect = canvas.getBoundingClientRect(); // abs. size of element
	var scaleX = canvas.width / rect.width;    // relationship bitmap vs. element for X
	var scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y
	// scale mouse coordinates after they have been adjusted to be relative to element
	return { x: (evt_pt.x - rect.left) * scaleX, y: (evt_pt.y - rect.top) * scaleY }
}

range_control.minus_pressed = function(){
	log("minus trigger")
	handle_range_minus_button_click($(".minus"));
	function handle_range_minus_button_click(element){
		var new_value = range_control.value - range_control.step;
		if(new_value >= range_control.min)	
			range_control.emit_change(new_value);
	}
}

range_control.plus_pressed = function(){
	log("plus trigger")
	handle_range_plus_button_click($(".plus"));
	function handle_range_plus_button_click(element){
		var new_value = range_control.value + range_control.step;
		if(new_value <= range_control.max)	
			range_control.emit_change(new_value);
	}
}

range_control.reload_colors = function(){
	range_control.color_background_track = model.darkmode ? getComputedStyle(document.documentElement).getPropertyValue("--primary-background-color") : getComputedStyle(document.documentElement).getPropertyValue("--tertiary-background-color");
	range_control.color_font = getComputedStyle(document.documentElement).getPropertyValue("--primary-font-color");
	range_control.color_button = getComputedStyle(document.documentElement).getPropertyValue("--secondary-background-color");
	range_control.color_stroke = getComputedStyle(document.documentElement).getPropertyValue("--primary-background-color");
	range_control.draw(range_control.percent_value);
}

range_control.draw = function(percent_value){
	if(range_control.show_percent){
		draw_dial(percent_value, percent_value.toFixed(range_control.decimal_places) + " %");
	
	} else {

		var text_value = parseInt(range_control.value).toFixed(range_control.decimal_places);
		if(range_control.special_cased_values.length > 0){
			var i;
			for(i=0;i<range_control.special_cased_values.length;i++){
				var obj = range_control.special_cased_values[i];
				if(obj.value === parseInt(text_value)){
					text_value = obj.text;
					break;
				}
				text_value = text_value  + " " + range_control.units;
			}

		} else {
			text_value = text_value  + " " + range_control.units;
		}
		draw_dial(percent_value, text_value);
	}
	function draw_dial(percent, text_value){

		var canvas = document.getElementById("dial_canvas");
		var ctx = canvas.getContext("2d");
		const TWO_PI = 2 * Math.PI;

		ctx.clearRect(0, 0, range_control.WIDTH, range_control.HEIGHT);

		range_control.controlAngleInRadians = range_control.percent_to_radian(percent);

		// fulltrack
		
		ctx.beginPath();
		ctx.strokeStyle = range_control.color_background_track;
		ctx.lineWidth = range_control.track_width;
		ctx.arc(range_control.WIDTH/2.0, range_control.HEIGHT/2.0, range_control.radius - range_control.track_width/2, 0, TWO_PI);
		ctx.stroke();

		// color track

		ctx.beginPath();
		ctx.strokeStyle = range_control.color_track;
		ctx.lineWidth = range_control.track_width;
		ctx.arc(range_control.WIDTH/2.0, range_control.HEIGHT/2.0, range_control.radius - range_control.track_width/2,
			range_control.startAngleInRadians, range_control.controlAngleInRadians);
		ctx.stroke();

		// control indicator

		ctx.beginPath();
		ctx.fillStyle = range_control.color_button;
		ctx.strokeStyle = range_control.color_stroke;
		ctx.lineWidth = 2;
		ctx.arc(range_control.getXofCircle(range_control.radius - range_control.track_width/2, range_control.WIDTH/2.0, range_control.controlAngleInRadians), 
			range_control.getYofCircle(range_control.radius- range_control.track_width/2, range_control.HEIGHT/2.0, range_control.controlAngleInRadians), 
			range_control.track_width/2, 0, 2 * Math.PI);
		ctx.fill();

		// minus button

		ctx.beginPath();
		ctx.fillStyle = range_control.color_button;
		ctx.strokeStyle = range_control.color_stroke;
		ctx.lineWidth = 1;
		ctx.arc(range_control.minusX, range_control.minusY, range_control.track_width/2, 0, TWO_PI);
		ctx.fill();
		ctx.stroke();
		
		ctx.beginPath();
		ctx.strokeStyle = range_control.color_font;
		var pad = range_control.WIDTH * 0.017;
		ctx.lineWidth = range_control.WIDTH *0.008;
		ctx.moveTo(range_control.minusX-pad, range_control.minusY);
		ctx.lineTo(range_control.minusX+pad, range_control.minusY);
		ctx.stroke();

		// plus button

		ctx.beginPath();
		//ctx.fillStyle = "#2d2d2d";
		ctx.strokeStyle = range_control.color_stroke;
		ctx.lineWidth = 1;
		ctx.arc(range_control.plusX, range_control.plusY, range_control.track_width/2, 0, TWO_PI);
		ctx.fill();
		ctx.stroke();

		ctx.beginPath();
		ctx.strokeStyle = range_control.color_font;
		pad = range_control.WIDTH * 0.022;
		ctx.lineWidth = range_control.WIDTH *0.006;
		ctx.moveTo(range_control.plusX-pad, range_control.plusY);
		ctx.lineTo(range_control.plusX+pad, range_control.plusY);
		ctx.stroke();
		ctx.moveTo(range_control.plusX, range_control.plusY-pad);
		ctx.lineTo(range_control.plusX, range_control.plusY+pad);
		ctx.stroke();

		// value text

		//blurry
		//ctx.font = "75px SF Display Thin";
		//ctx.fillStyle = "#fff";
		//ctx.textAlign = "center";
		//ctx.textBaseline = "middle";
		//ctx.fillText(text_value, Math.round(range_control.WIDTH/2), Math.round(range_control.HEIGHT/2));

		var bpm_text_object = $("bpm_text");
		bpm_text_object.innerHTML = text_value;
		range_control.resize_bpm_text();
	}
}

range_control.resize_bpm_text = function(){
	var canvas = document.getElementById("dial_canvas");
	var bpm_text_object = $("bpm_text");
	bpm_text_object.style.left = Math.round((canvas.offsetWidth - bpm_text_object.offsetWidth) / 2) + "px";
}

range_control.getDistance = function(x1, y1, x2, y2){
	var xs = x2 - x1;
	var ys = y2 - y1;		
	xs *= xs;
	ys *= ys;
	return Math.sqrt( xs + ys );
}
range_control.percent_to_radian = function(percent){
	return ((percent /100) * Math.PI * 1.6) + ( Math.PI * 0.7);
}
range_control.radian_to_percent = function(radian){
	return 100 * ((radian - ( Math.PI * 0.7)) / (Math.PI * 1.6));
}
range_control.getXofCircle = function(radius, centerX, angleInRadians){
	return centerX + radius * Math.cos(angleInRadians);
}
range_control.getYofCircle = function(radius, centerY, angleInRadians){
	return centerY + radius * Math.sin(angleInRadians);
}
range_control.getRadiansFromPt = function(pt, centerPt){
	return Math.atan2(pt.y - centerPt.y, pt.x - centerPt.x);
} 
range_control.to_range_value = function(percent){

	var value =  range_control.min + (  (percent * (range_control.max-range_control.min)) / 100.0  );

	var stepped_value = range_control.min;
	var smallest_diff = range_control.step*2;
	var i;
	for(i=range_control.min; i <= range_control.max; i=i+range_control.step ){
		var diff = Math.abs(i-value);
		if(diff<smallest_diff){
			smallest_diff = diff;
			stepped_value = i;
		}
	}
	return stepped_value;
}
range_control.emit_change = function(value){
	log("on range change: " + value);
	range_control.on_range_control_changed(value);

	range_control.value = value;
	range_control.percent_value = range_control.value.to_percent(range_control.min, range_control.max);
	range_control.draw(range_control.percent_value);
}

