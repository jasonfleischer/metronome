class RadialPercentView {
	
	constructor(id = "percent_view_id"){
		this.id = id;
		let rootView = document.getElementById(this.id);
		this.diameter = rootView.clientWidth;
		this.canvas = this.buildCanvas(rootView);
	}

	buildCanvas(rootView){
		
		let canvas = document.createElement('canvas'); 
	    canvas.id = this.id + "_canvas";
	    canvas.style.position = "absolute"
	    canvas.style.left = "0px"
	    canvas.style.right = "0px"

		canvas.width = this.diameter;
		canvas.height = this.diameter;
		canvas.style.width = this.diameter+'px';
		canvas.style.height = this.diameter+'px';

	    rootView.appendChild(canvas);
	    return canvas;
	}

	draw(percentage = 100, color = "#FFF", innerRadiusPercent = 0.8, innerColor = "#000") {

		var ctx = this.canvas.getContext("2d");
		percentage = Math.max(Math.min(100, percentage), 0);
		ctx.clearRect(0, 0, this.diameter, this.diameter);
		if(percentage == 0) return;

		let radius = this.diameter/2;
		ctx.beginPath();
		ctx.fillStyle = color;
		let offset = 2 * Math.PI *.75;
		ctx.arc(radius, radius, radius, offset, offset+(2 * Math.PI * percentage /100));
		ctx.lineTo(radius, radius);
		ctx.fill();

		let innerRadius = radius * innerRadiusPercent;
		ctx.beginPath();
		ctx.fillStyle = innerColor;
		ctx.arc(radius, radius, innerRadius, 0, 2 * Math.PI);
		ctx.fill();
	}
}