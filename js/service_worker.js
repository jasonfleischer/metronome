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



