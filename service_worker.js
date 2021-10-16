let CACHE_NAME = 'v3';
const CACHE = [
        '/metronome/index.html',
        '/metronome/fonts/SF_Pro_Display_Thin.woff2',
        '/metronome/css/bundle.css',
        '/metronome/js/bundle.js',
        /*'/metronome/css/root.css',
        '/metronome/css/main.css',
        '/metronome/css/select.css',
        '/metronome/css/slider.css',
        '/metronome/css/switch.css',
        '/metronome/css/button.css',
        '/metronome/css/alert.css',
        '/metronome/js/midi/webAudioFontPlayer.js',
        '/metronome/js/log.js',
        '/metronome/js/midi/midi_sounds.js',
        '/metronome/js/midi/click_midi_controller.js',
        '/metronome/js/midi/drum_midi_controller.js',
        '/metronome/js/model.js',
        '/metronome/js/translations/generated.js',
        '/metronome/js/translations/translations.js',
        '/metronome/js/prototypes.js',
        '/metronome/js/storage.js',
        '/metronome/js/range_control.js',
        '/metronome/js/time_view.js',
        '/metronome/js/audio_controller.js',
        '/metronome/js/tap_controller.js',
        '/metronome/js/keyboard_shortcuts.js',
        '/metronome/js/alert.js',
        '/metronome/js/information.js',
        '/metronome/js/main.js',
        '/metronome/js/install.js'*/
      ];
	
self.addEventListener('install', function(event) {
    console.log('metronome: install');
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(CACHE);
        })
    );
});

self.addEventListener('fetch', function(event) {
    console.log('metronome: fetch');
    event.respondWith(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.match(event.request).then(function(response) {
                return response || fetch(event.request).then(function(response) {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});

self.addEventListener('activate', function activator(event) {
    console.log('metronome: activate');
    event.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(keys
                .filter(function(key) {
                    return key.indexOf(CACHE_NAME) !== 0;
                })
                .map(function(key) {
                    return caches.delete(key);
                })
            );
        })
    );
});
