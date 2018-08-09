function hash(str) {
  var buffer = new TextEncoder("utf-8").encode(str);
  return crypto.subtle.digest("SHA-1", buffer).then(function (hash) {
    return hex(hash);
  });
}

// hex function from https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
function hex(buffer) {
  var hexCodes = [];
  var view = new DataView(buffer);
  for (var i = 0; i < view.byteLength; i += 4) {
    var value = view.getUint32(i)
    var stringValue = value.toString(16)
    var padding = '00000000'
    var paddedValue = (padding + stringValue).slice(-padding.length)
    hexCodes.push(paddedValue);
  }
  return hexCodes.join("");
}

function checkAPI(hash) {

	let request = new XMLHttpRequest();
	request.open('POST', '/check', true);
	request.setRequestHeader("Content-Type", "application/json")
	request.onload = function (e) {
    if (request.readyState === 4) {
        // Check if the get was successful.
        if (request.status === 200) {
            console.log(request.responseText);
						document.querySelector("#result").textContent = request.responseText
        } else {
            console.error(request.statusText);
						document.querySelector("#result").textContent = request.statusText
        }
    }
	}

	request.onerror = function (e) {
    console.error(request.statusText);
		document.querySelector("#result").textContent = request.statusText
	}

	payload = {'hash':hash}
	request.send(JSON.stringify(payload))
}

function isSecure() {
	return (document.location.protocol === 'https');
}


// show warning if page is not delivered via https
function checkTLS() {
	if (isSecure()) {
		let warning = document.querySelector("#tls-warning")
		warning.parentNode.removeChild(warning)
	}
}

function onClickHandler(){
	hash(document.querySelector("#password").value).then(function(digest){
		checkAPI(digest);
	});
}

document.addEventListener("DOMContentLoaded", function(event) { 
	checkTLS();
	document.getElementById('check').onclick=function(){
		onClickHandler();
	}

	document.getElementById('password').onkeypress = function(e) {
		if (e.keyCode == 13) {
			onClickHandler();
			e.preventDefault();
		}
	}
});
