let prompt;
	
if ('serviceWorker' in navigator) {
	
  	navigator.serviceWorker.register('/metronome/sw.js', { scope: '/metronome/' }).then(function(reg) {

	    if(reg.installing) {
	      console.log('Service worker installing');
	    } else if(reg.waiting) {
	      console.log('Service worker installed');
	    } else if(reg.active) {
	      console.log('Service worker active');
	    }

	}).catch(function(error) { // registration failed
	    console.log('Registration failed with ' + error);
	});
} else {
	console.log('Service worker not available');
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/metronome/',
        '/metronome/index.html',
        '/metronome/css/root.css',
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
        '/metronome/js/cookies.js',
        '/metronome/js/range_control.js',
        '/metronome/js/time_view.js',
        '/metronome/js/audio_controller.js',
        '/metronome/js/tap_controller.js',
        '/metronome/js/keyboard_shortcuts.js',
        '/metronome/js/alert.js',
        '/metronome/js/install.js',
        '/metronome/js/information.js',
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

window.addEventListener('beforeinstallprompt', function(e){
  	e.preventDefault(); // Prevent the mini-infobar from appearing on mobile
  	prompt = e;
});

window.addEventListener('appinstalled', async function(e) {
	//installButton.style.display = "none";
	install.showAlert(function(){
   		prompt.prompt();
	})
});



