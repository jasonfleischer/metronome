var alert = {}

alert.init = function(){
	$("alert_container").addEventListener("click", function(event){
		alert.dismiss()
	});
	$("dismiss_alert_button").addEventListener("click", function(event){
		alert.dismiss()
	});
	$("alert").addEventListener("click", function(event){
		event.stopPropagation();
		return false;
	});
}

alert.show = function(title, contents){
	$("alert_title").innerHTML = title
	$("alert_contents").innerHTML = contents
	$("alert_container").style.display = "block";
}

alert.dismiss = function(){
	$("alert_container").style.display = "none";
}