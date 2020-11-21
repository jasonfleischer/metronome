var time_view = {

	HEIGHT: 0,
	WIDTH: 0,
	radius: 0,
	start_time: 0,

	color_primary: {},
	color_secondary: {},

	animation_request_id: {},
	percent_buffer: 0,
	point_size: 0,
	array_of_lines: []
}

const TWO_PI = 2 * Math.PI;

time_view.init = function(){
	time_view.resize();
}

time_view.resize = function(){
	var content_view = document.getElementById("content_view");

	var DIMENSION = Math.round((content_view.offsetWidth > content_view.offsetHeight ? content_view.offsetHeight : content_view.offsetWidth) * 0.80);
	time_view.WIDTH = DIMENSION;
	time_view.HEIGHT = DIMENSION;
	time_view.radius = DIMENSION / 2.0;
	time_view.point_size = (DIMENSION * 0.025)

	var container = document.getElementById("time_view_container");
	container.style.width = DIMENSION + "px";
	container.style.height = DIMENSION + "px";
	container.style.marginTop = ((content_view.offsetHeight - DIMENSION ) * 0.5) + "px";

	var canvas = document.getElementById("time_view_canvas");
	canvas.width = DIMENSION;
	canvas.height = DIMENSION;	

	var canvas_background = document.getElementById("time_view_background_canvas");
	canvas_background.width = DIMENSION;
	canvas_background.height = DIMENSION;

	var count_text = document.getElementById("count_text");
	count_text.style.lineHeight = DIMENSION + "px";
	count_text.style.fontSize = (DIMENSION * 0.40) + "px"; 
}

var number_of_beats = 0;
var time_division_milli_seconds = 0;
time_view.start =  function(time_signature, BPM){

	var container = document.getElementById("time_view_container");
	container.style.display = "block";

	number_of_beats = time_signature

	time_view.start_time = Date.now() ;
	function BPMtoMilliSeconds(BPM) { return 1000 / (BPM / 60); }

	time_division_milli_seconds = BPMtoMilliSeconds(model.BPM) * number_of_beats;
	
	time_view.percent_buffer = 0;

	time_view.draw_background();
	time_view.draw();
}

time_view.reloadBPM = function(index){

	function BPMtoMilliSeconds(BPM) { return 1000 / (BPM / 60); }
	time_division_milli_seconds = BPMtoMilliSeconds(model.BPM) * number_of_beats;
	var percent = index/ (number_of_beats * model.beat_division);
	time_view.percent_buffer = percent;

	time_view.start_time = Date.now();
	time_view.draw();
}

time_view.stop = function(){

	var container = document.getElementById("time_view_container");
	container.style.display = "none";

	var canvas = document.getElementById("time_view_canvas");
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, time_view.WIDTH, time_view.HEIGHT);

	var canvas_background = document.getElementById("time_view_background_canvas");
	ctx = canvas_background.getContext("2d");
	ctx.clearRect(0, 0, time_view.WIDTH, time_view.HEIGHT);

	cancelAnimationFrame(time_view.animation_request_id);
}

time_view.reload_colors = function(){

	function clear_background (){
		var canvas = document.getElementById("time_view_background_canvas");
		var ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, time_view.WIDTH, time_view.HEIGHT);
	}
	clear_background();
	time_view.color_primary = getComputedStyle(document.documentElement).getPropertyValue("--primary-font-color");
	time_view.color_secondary = getComputedStyle(document.documentElement).getPropertyValue("--primary-background-color");
	time_view.draw_background();
}

class Point{
	constructor(x, y){
		this.x = x;
		this.y = y;
	}

	draw(ctx, diameter, color="#000") {
		if(this.isValid){
			ctx.beginPath();
			ctx.fillStyle = color;
			ctx.lineWidth = 0;
			ctx.arc(this.x, this.y, diameter, 0, TWO_PI);
			ctx.fill();
		}
	}

	isValid(){
		return this.x >= 0 && this.y >= 0;
	}
}

class Line {
	constructor(pt1, pt2){
		this.pt1 = pt1;
		this.pt2 = pt2;
	}

	draw(ctx, color = '#000') {
		ctx.beginPath();
		ctx.strokeStyle = color;
		ctx.lineWidth = 10;
		ctx.moveTo(this.pt1.x, this.pt1.y);
		ctx.lineTo(this.pt2.x, this.pt2.y);
		ctx.stroke();
	}

	getIntersectionPtBetweenTwoLines(other_line){
		var l1 = this;
		var l2 = other_line;
		var a1 = l1.pt2.y - l1.pt1.y;
        var b1 = l1.pt1.x - l1.pt2.x;
        var c1 = a1 * l1.pt1.x + b1 * l1.pt1.y;
 
        var a2 = l2.pt2.y - l2.pt1.y;
        var b2 = l2.pt1.x - l2.pt2.x;
        var c2 = a2 * l2.pt1.x + b2 * l2.pt1.y;
 
        var delta = a1 * b2 - a2 * b1;
        var pt = new Point((b2 * c1 - b1 * c2) / delta, (a1 * c2 - a2 * c1) / delta);
        return pt;
	}
}

class Polygon {
	constructor(array_of_pts){
		this.points = array_of_pts;
	}

	draw(ctx, color = "#eee"){

		var i;
		ctx.beginPath();
		if(color == 'clear')
			ctx.globalCompositeOperation = 'destination-out';
		ctx.lineWidth = 0;
		ctx.fillStyle = color;
		var first_pt = this.points[0]; 
		ctx.moveTo(first_pt.x, first_pt.y);
		

		for(i=1; i<this.points.length; i++){
			var pt = this.points[i];
			ctx.lineTo(pt.x, pt.y);
		}
		ctx.closePath();
		ctx.fill();

		if(color == 'clear')
			ctx.globalCompositeOperation = 'source-over';
	}
}

time_view.draw_background = function(){

	var canvas = document.getElementById("time_view_background_canvas");
	var ctx = canvas.getContext("2d");
	var centerPt = new Point(time_view.WIDTH/2.0, time_view.HEIGHT/2.0);
	var track_width = time_view.point_size * 2;


	if (number_of_beats == 2) { // draw arc
		
		ctx.beginPath();
		ctx.strokeStyle = time_view.color_secondary;
		ctx.lineWidth = track_width;
		ctx.arc(centerPt.x, centerPt.y, time_view.radius - track_width/2, 0, TWO_PI);
		ctx.stroke();

		return;
	}
	
	var angle = TWO_PI /4 *-1;
	
	time_view.array_of_lines = []; 

	var prev_pt = new Point(time_view.getXofCircle(time_view.radius - time_view.point_size,  centerPt.x, angle), 
								time_view.getYofCircle(time_view.radius - time_view.point_size,  centerPt.y, angle));
	var array_of_points = []; 
	array_of_points.push(prev_pt);

	var prev_outer_pt = new Point(time_view.getXofCircle(time_view.radius, centerPt.x, angle), 
								time_view.getYofCircle(time_view.radius, centerPt.y, angle));
	var array_of_outer_points = [];
	array_of_outer_points.push(prev_outer_pt);
	

	var prev_inner_pt = new Point(time_view.getXofCircle(time_view.radius - time_view.point_size * 2, centerPt.x, angle), 
								time_view.getYofCircle(time_view.radius - time_view.point_size * 2, centerPt.y, angle));
	var array_of_inner_points = [];
	array_of_inner_points.push(prev_inner_pt);


	var i;
	for(i=0; i <number_of_beats; i++){
       
		var angle = angle + TWO_PI/number_of_beats;

		var next_pt = new Point(time_view.getXofCircle(time_view.radius - time_view.point_size, centerPt.x, angle), 
								time_view.getYofCircle(time_view.radius - time_view.point_size, centerPt.y, angle));

		var next_outer_pt = new Point(time_view.getXofCircle(time_view.radius, centerPt.x, angle), 
								time_view.getYofCircle(time_view.radius, centerPt.y, angle));

		var next_inner_pt = new Point(time_view.getXofCircle(time_view.radius - time_view.point_size * 2, centerPt.x, angle), 
								time_view.getYofCircle(time_view.radius - time_view.point_size * 2, centerPt.y, angle));

		var line = new Line(prev_pt, next_pt);
		//line.draw(ctx);

		time_view.array_of_lines.push(line);
		array_of_points.push(next_pt);
		array_of_outer_points.push(next_outer_pt);
		array_of_inner_points.push(next_inner_pt);

		prev_pt = next_pt

	}

	var outer_polygon = new Polygon(array_of_outer_points);
	outer_polygon.draw(ctx, time_view.color_secondary);

	var inner_polygon = new Polygon(array_of_inner_points);
	inner_polygon.draw(ctx, 'clear');
}

time_view.draw = function(){

	var canvas = document.getElementById("time_view_canvas");
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, time_view.WIDTH, time_view.HEIGHT);
	var centerPt = new Point(time_view.WIDTH/2.0, time_view.HEIGHT/2.0);

	var delta = Date.now() - time_view.start_time;	
	percentage = ((delta%time_division_milli_seconds))/time_division_milli_seconds;
	percentage = (percentage + time_view.percent_buffer) % 1.000;

	var angle = (TWO_PI*percentage) - (TWO_PI /4);
	var	pt = new Point(time_view.getXofCircle(time_view.radius - time_view.point_size, centerPt.x, angle), 
									time_view.getYofCircle(time_view.radius - time_view.point_size, centerPt.y, angle));

	if(number_of_beats > 2){
		pt.draw(ctx, time_view.point_size - 3, time_view.color_secondary);
		var reference_line = new Line(centerPt, pt);
		var beat = parseInt(percentage*number_of_beats)
		var line = time_view.array_of_lines[beat];
		var pt2 = reference_line.getIntersectionPtBetweenTwoLines(line);
		if (pt2.isValid) pt2.draw(ctx, time_view.point_size -3, time_view.color_primary);
	} else {
		pt.draw(ctx, time_view.point_size - 3, time_view.color_primary);
	}
  	time_view.animation_request_id = requestAnimationFrame(time_view.draw);
}

time_view.getXofCircle = function(radius, centerX, angleInRadians){
	return centerX + radius * Math.cos(angleInRadians);
}
time_view.getYofCircle = function(radius, centerY, angleInRadians){
	return centerY + radius * Math.sin(angleInRadians);
}