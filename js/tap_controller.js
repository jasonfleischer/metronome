var tap_controller = {

	timeout_timer: {},
	queue: [],
	TAPS_NEEDED_TO_CALCULATE: Object.freeze(5),
	state : Object.freeze({
		IDLE: 0,
		KEEP_TAPPING: 1,
		HAS_VALUE: 2
	}),
	calculatedBPM: 0,
	current_state: 0 //tap_controller.state.IDLE
};

tap_controller.tap = function(){
	
	var date = new Date();
	var timeStamp = date.getTime();
	
	tap_controller.queue.push(timeStamp);

	if(tap_controller.queue.length >= tap_controller.TAPS_NEEDED_TO_CALCULATE){
		tap_controller.calculatedBPM = tap_controller.calculateBPMValue();
		tap_controller.current_state = tap_controller.state.HAS_VALUE;
		if(window.mobileCheck()){
			setupMobileOscillator()
		}
	} else {
		tap_controller.current_state = tap_controller.state.KEEP_TAPPING;
	}
	tap_controller.updateUI();

	clearInterval(tap_controller.timeout_timer);
	tap_controller.timeout_timer = setTimeout(tap_controller.timeout_taps, 2000);
}

tap_controller.timeout_taps = function() {
	tap_controller.queue = [];
	tap_controller.current_state = tap_controller.state.IDLE;
	tap_controller.updateUI()
}

tap_controller.calculateBPMValue = function() {
	
	var time_diff_array = [];
	var i;
	for(i = tap_controller.queue.length - tap_controller.TAPS_NEEDED_TO_CALCULATE; i<tap_controller.queue.length-1; i++){
		timeStamp1 = tap_controller.queue[i];
		timeStamp2 = tap_controller.queue[i+1];
		time_diff_array.push(timeStamp2 - timeStamp1);
	}
	var sum = 0;
	var j;
	for(j=0; j< time_diff_array.length; j++){
		sum = sum + time_diff_array[j];
	}
	var time_between_beats_ms = sum / time_diff_array.length;
	var BPM = Math.round(60000 / time_between_beats_ms);

	BPM = Math.max(Math.min(BPM, MAX_BPM), MIN_BPM);
	return BPM;
}

tap_controller.updateUI = function() {
	if (tap_controller.current_state == tap_controller.state.KEEP_TAPPING){
		$("status_msg").innerHTML = TR("Keep Tapping");
	} else { // IDLE or HAS_VALUE
		if (tap_controller.current_state == tap_controller.state.HAS_VALUE){
			setBPM(tap_controller.calculatedBPM);
			function setBPM(bpm){
	  			model.BPM = bpm;
				log("on BPM tap changed: " + model.BPM);
				range_control.load(range_control.on_range_control_changed, "", MIN_BPM , MAX_BPM, 1, model.BPM, false, 0);
				cookies.set_BPM(model.BPM);
				update_UI_BPM(model.BPM);
				forcePlay();
  			}
		}
		$("status_msg").innerHTML =  TR("Configure then press 'Play' to begin");
	} 
}

