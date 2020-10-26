// Model

const MODE = Object.freeze({
	NORMAL: 0,
	DRUM: 1,
	TALKING: 2
});

const TIME_SIGNATURE = Object.freeze({
	TS_2_4: 2,
	TS_3_4: 3,
	TS_4_4: 4,
	TS_5_4: 5,
	TS_6_4: 6,
	TS_7_4: 7,
	TS_8_4: 8,
	TS_9_4: 9
});

const MAX_BPM = 208;
const MIN_BPM = 40;

var model = {

	mode: MODE.NORMAL,
	BPM: 120,
	time_signature: TIME_SIGNATURE.TS_4_4,
	accent_first_beat: true,
	beat_division: 1,
	darkmode: false
}

function modelHasChanged(other_model){
	return other_model.mode != model.mode || other_model.BPM != model.BPM || other_model.time_signature != model.time_signature || 
			other_model.accent_first_beat != model.accent_first_beat || other_model.beat_division != model.beat_division; 
}
