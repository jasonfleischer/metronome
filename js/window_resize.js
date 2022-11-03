var window_resize_start_event_occured = false;
var resized_timer;
window.onresize = function(){
	clearTimeout(resized_timer);
	resized_timer = setTimeout(window_resized_end, 200);
	if(!window_resize_start_event_occured) {
		window_resized_start();
		window_resize_start_event_occured = true;
	}
};

function window_resized_start(){
	$("bpm_text").style.display = "none"; // hide
	$("time_view_container").style.display = "none"; // hide
	$("status_msg").style.display = "none"; // hide
	$("nav-side-menu").style.display = "none"; // hide
	dismissInfo();	
}

function window_resized_end(){

	window_resize_start_event_occured = false;

	if(is_compact_window()) {
		hide_settings();
	} else {
		$("nav-side-menu").style.display = "block";
		$("kofi_button").style.display = "block";
		$("info_button").style.display = "block";
	}

	if(audio_controller.playing){
		$("time_view_container").style.display = "block"; // show
	} else {
		$("status_msg").style.display = "block"; // show
	}
	time_view.resize();
	time_view.draw_background();
	
	$("bpm_text").style.display = "block"; // show
	range_control.resize_bpm_text();
}