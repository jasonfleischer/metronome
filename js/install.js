var install = {}

install.showAlert = function(install_action){

	let contents = `
		<p>Install this app on your device to easily access it anytime. Installing this app will result in better performance, improved fullscreen experience, and usage without an internet connection.</p>
		<br/>
	`

	var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
	var isSafariMobile = window.mobileCheck() && isSafari
	if (isSafariMobile){
		contents += `
			<div id="ios_install_instructions">
				<p>1. Tap on <img src="img/export.png" alt="export"/></p>
				<p>2. Select 'Add to Home Screen'</p>
			</div>`
	} else {
		contents += '<button id="install">Install</button>'
	}

	alert.show("Install App", contents)

	if (!isSafariMobile) {
		let installButton = document.getElementById("install");
		installButton.addEventListener('click', install_action);
	}
}