
Number.prototype.to_percent = function(min, max){
    return 100.0 * (this - min) / (max - min);
};

// util
function $(id){
	return document.getElementById(id);
}