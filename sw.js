self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/metronome/',
        '/metronome/index.html',
        '/metronome/css/main.css',
        '/metronome/css/select.css',
        '/metronome/css/slider.css',
        '/metronome/css/switch.css',
        '/metronome/js/midi/webAudioFontPlayer.js',
        '/metronome/js/log.js',
        '/metronome/js/midi/midi_sounds.js',
        '/metronome/js/midi/click_midi_controller.js',
        '/metronome/js/midi/drum_midi_controller.js',
        '/metronome/js/model.js',
        '/metronome/js/translations/generated.js',
        '/metronome/js/translations/translations.js',
        '/metronome/js/prototypes.js',
        '/metronome/js/cookies.js',
        '/metronome/js/range_control.js',
        '/metronome/js/time_view.js',
        '/metronome/js/audio_controller.js',
        '/metronome/js/tap_controller.js',
        '/metronome/js/keyboard_shortcuts.js',
        '/metronome/js/main.js',
        '/metronome/js/service_worker.js'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request).then(function(response) {
    // caches.match() always resolves
    // but in case of success response will have value
    if (response !== undefined) {
      return response;
    } else {
      return fetch(event.request).then(function (response) {
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        let responseClone = response.clone();
        
        console.log("fetch event")

        caches.open('v1').then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function () {
        console.log("error")
        return caches.match('/sw-test/gallery/myLittleVader.jpg');
      });
    }
  }));
});