#!/bin/bash

# requirements:
# npm, uglifycss, browserify

# $ npm install -g uglifycss
# $ npm install -g uglify-js
# $ npm install -g browserify

CWD=`pwd`


uglifycss css/alert.css css/button.css css/main.css css/root.css css/select.css css/slider.css css/switch.css > css/bundle.css

uglifyjs  js/midi/midi_sounds.js js/midi/click_midi_controller.js js/midi/drum_midi_controller.js js/model.js js/translations/generated.js js/translations/translations.js js/prototypes.js js/storage.js js/range_control.js js/time_view.js js/audio_controller.js js/tap_controller.js js/keyboard_shortcuts.js js/alert.js js/information.js js/main.js js/install.js service_worker.js -o js/bundle.js
browserify js/bundle.js -o js/bundle.js
uglifyjs js/bundle.js -o js/bundle.js

git add *; git commit -m 'update'; git push;

cd $CWD