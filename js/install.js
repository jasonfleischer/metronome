var install = {
	prompt: {}
}

if ('serviceWorker' in navigator) {
  	navigator.serviceWorker.register('/metronome/service_worker.js', { scope: '/metronome/' }).then(function(reg) {
	    if(reg.installing) {
	      console.log('metronome: Service worker installing');
	    } else if(reg.waiting) {
	      console.log('metronome: Service worker installed');
	    } else if(reg.active) {
	      console.log('metronome: Service worker active');
	    }
	}).catch(function(error) { // registration failed
	    console.log('Registration failed with ' + error);
	});
} else {
	console.log('Service worker not available');
}

window.onload = function() {
	init();
};

window.addEventListener('beforeinstallprompt', function(e){
  	e.preventDefault(); // Prevent the mini-infobar from appearing on mobile
  	install.prompt = e;
  	if (window.mobileAndTabletCheck()) {
	  	install.showAlert(function(){
	   		install.prompt.prompt();
		});
  	}
});

window.addEventListener('appinstalled', async function(e) {
	alert.dismiss();
});

install.showAlert = function(install_action){

	let contents = `
		<p>`+TR("Install this app on your device to easily access it anytime. Installing this app will result in better performance, improved fullscreen experience, and usage without an internet connection.")+`</p>
		<br/>
	`

	var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
	var isSafariMobile = window.mobileAndTabletCheck() && isSafari
	if (isSafariMobile){
		contents += `
			<div id="ios_install_instructions">
				<p>1. `+TR("Tap on")+` <img src="img/export.png" alt="export"/></p>
				<p>2. `+TR("Select 'Add to Home Screen'")+`</p>
			</div>`
	} else {
		contents += '<button id="install">Install</button>'
	}

	alert.show(TR("Install App"), contents)

	if (!isSafariMobile) {
		let installButton = document.getElementById("install");
		installButton.addEventListener('click', install_action);
	}
}