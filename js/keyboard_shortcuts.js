
function setup_keyboard_listeners() {

	document.addEventListener('keyup', function(event){

		//log(event.code)
		var code = event.code;
		if (code === 'Space') {
			var play_button = is_compact_window() ? $("mobile_play_pause_button"): $('play_pause_button');
			if(document.activeElement !== play_button) { // prevents double call with focus on play
				playPause();
				play_button.focus();
			}
		} else if (code === 'ArrowUp' || code === 'NumpadAdd' || code === 'Equal') {
			range_control.plus_pressed();
		} else if (code === 'ArrowDown' || code === 'NumpadSubtract' || code === 'Minus') {
			range_control.minus_pressed();
		} else if (code === 'ArrowLeft') {
			decrementDivision();
		} else if (code === 'ArrowRight') {
			incrementDivision();
		} else if (code == 'KeyT') {
			tap_controller.tap();
		} else if (code == 'KeyD') {
			var new_BPM = model.BPM*2;
			if(new_BPM <= MAX_BPM && new_BPM >= MIN_BPM) setBPM(new_BPM);
		} else if (code == 'KeyH') {
			var new_BPM = Math.round(model.BPM/2); 
			if(new_BPM <= MAX_BPM && new_BPM >= MIN_BPM) setBPM(new_BPM);
		} else if (code == 'Digit1' || code == 'Numpad1') {
			setBPM(60);
		} else if (code == 'Digit2' || code == 'Numpad2') {
			setBPM(75);
		} else if (code == 'Digit3' || code == 'Numpad3') {
			setBPM(90);
		} else if (code == 'Digit4' || code == 'Numpad4') {
			setBPM(105);
		} else if (code == 'Digit5' || code == 'Numpad5') {
			setBPM(120);
		} else if (code == 'Digit6' || code == 'Numpad6') {
			setBPM(135);
		} else if (code == 'Digit7' || code == 'Numpad7') {
			setBPM(150);
		} else if (code == 'Digit8' || code == 'Numpad8') {
			setBPM(165);
		} else if (code == 'Digit9' || code == 'Numpad9') {
			setBPM(180);
		} else if (code == 'Digit0' || code == 'Numpad0') {
			setBPM(195);
		}

		function setBPM(bpm){
			model.BPM = bpm;
			log("on BPM change: " + model.BPM);
			range_control.load(range_control.on_range_control_changed, "", MIN_BPM , MAX_BPM, 1, model.BPM, false, 0);
			cookies.set_BPM(model.BPM);
			update_UI_BPM(model.BPM);
			reloadBPM();
		}

		function decrementDivision(){
			var new_division;
			if(new_beat_division == 0){
				new_division = Math.max(model.beat_division - 1, 1);	
			}else{
				new_division = Math.max(new_beat_division - 1, 1);
			}
			$("division_select").value = new_division;
			reloadDivisions(new_division);
		}
		function incrementDivision(){
			var new_division;
			if(new_beat_division == 0){
				new_division = Math.min(model.beat_division + 1, 4);	
			}else{
				new_division = Math.min(new_beat_division + 1, 4);
			}
			$("division_select").value = new_division;
			reloadDivisions(new_division);
		}
	});
}

function show_keyboard_shortcuts(){
	dismissInfo();
	var keyboard_shorcut_window = window.open("Keyboard Shortcuts", "_blank", "width=370,height=450,titlebar=no,toolbar=no,status=no,location=no,menubar=no", true);
	keyboard_shorcut_window.document.title = "Keyboard Shortcuts";

	var contents = "<table style='width:100%; text-align: left;'>"+
			"<tr><th>"+TR("Key")+"</th><th>"+TR("Command")+"</th></tr>"+
			"<tr><td>"+TR("Space")+"</td><td>"+TR("Play or stop")+"</td></tr>"+
			"<tr><td>"+TR("Up arrow")+"</td><td>"+TR("Increment tempo")+"</td></tr>"+
			"<tr><td>"+TR("Down arrow")+"</td><td>"+TR("Decrement tempo")+"</td></tr>"+
			"<tr><td>"+TR("Left arrow")+"</td><td>"+TR("Decrement subdivision")+"</td></tr>"+
			"<tr><td>"+TR("Right arrow")+"</td><td>"+TR("Increment subdivision")+"</td></tr>"+
			"<tr><td>"+TR("Letter")+" T</td><td>"+TR("Tap tempo")+"</td></tr>"+
			"<tr><td>"+TR("Letter")+" D</td><td>"+TR("Double tempo")+"</td></tr>"+
			"<tr><td>"+TR("Letter")+" H</td><td>"+TR("Half tempo")+"</td></tr>"+
			"<tr><td>"+TR("Digit")+" 1</td><td>60 BPM</td></tr>"+
			"<tr><td>"+TR("Digit")+" 2</td><td>75 BPM</td></tr>"+
			"<tr><td>"+TR("Digit")+" 3</td><td>90 BPM</td></tr>"+
			"<tr><td>"+TR("Digit")+" 4</td><td>105 BPM</td></tr>"+
			"<tr><td>"+TR("Digit")+" 5</td><td>120 BPM</td></tr>"+
			"<tr><td>"+TR("Digit")+" 6</td><td>135 BPM</td></tr>"+
			"<tr><td>"+TR("Digit")+" 7</td><td>150 BPM</td></tr>"+
			"<tr><td>"+TR("Digit")+" 8</td><td>165 BPM</td></tr>"+
			"<tr><td>"+TR("Digit")+" 9</td><td>180 BPM</td></tr>"+
			"<tr><td>"+TR("Digit")+" 0</td><td>195 BPM</td></tr>" +
		"</table>";
	contents = contents.replaceAll("< tr>", "<tr>");
	keyboard_shorcut_window.document.write(contents);
}
