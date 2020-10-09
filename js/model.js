// Model

const MODE = Object.freeze({
	NORMAL: 0,
	TALKING: 1,
	SYLLABLES: 2
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
	accent_first_beat: false,
	beat_division: 1,
	normal_mode_settings: {
		can_accent_first_beat: true
	},
	talking_mode_settings: {
		can_accent_first_beat: false
	},
	syllable_mode_settings: {
		can_accent_first_beat: false
	},

	darkmode: false
}
