var LOG_NON_ERROR_MESSAGES = true;//false;

function log(msg){
	if (LOG_NON_ERROR_MESSAGES)
		console.log(msg);
}
function logE(msg){
	console.log("%c ERROR: " + msg, "background: red; color: white; display: block;");
}
