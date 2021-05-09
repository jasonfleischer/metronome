// Model

const TONE = Object.freeze({
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

const DURATION = Object.freeze({
    FIVE_MINUTE: 5,
    TEN_MINUTES: 10,
    FIFTEEN_MINUTES: 15,
    TWENTY_MINUTES: 20,
    THIRTY_MINUTES: 30,
    FORTY_FIVE_MINUTES: 45,
    SIXTY_MINUTES: 60,
    INFINITE: -1
});

const MAX_BPM = 208;
const MIN_BPM = 40;

var model = {
	tone: TONE.NORMAL,
	BPM: 120,
	volume_percent: 100,
	duration: DURATION.INFINITE,
	time_signature: TIME_SIGNATURE.TS_4_4,
	accent_first_beat: true,
	beat_division: 1,
	darkmode: false,
	flash_screen: false
}
