let installable = false
let installed = false
let prompt;
//let installButton = document.getElementById("install");
		
if ('serviceWorker' in navigator) {
	installable = true
  	navigator.serviceWorker.register('/synth/sw.js', { scope: '/synth/' }).then(function(reg) {

	    if(reg.installing) {
	      console.log('Service worker installing');
	    } else if(reg.waiting) {
	      console.log('Service worker installed');
	    } else if(reg.active) {
	      console.log('Service worker active');
	      //init()
	    }

	}).catch(function(error) {
	    // registration failed
	    console.log('Registration failed with ' + error);
	});
} else {
	console.log('Service worker not available');
}

window.addEventListener('beforeinstallprompt', function(e){
  	// Prevent the mini-infobar from appearing on mobile
  	e.preventDefault();
  	// Stash the event so it can be triggered later.
  	prompt = e;
});


/*installButton.addEventListener('click', function(){
   	prompt.prompt();

   	/*let result = await that.prompt.userChoice;
	if (result&&result.outcome === 'accepted') {
	    installed = true;
	}* /
})*/

window.addEventListener('appinstalled', async function(e) {
	//installButton.style.display = "none";
});
