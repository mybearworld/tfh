fetch("https://mybearworld.github.io/tfh/apply/status.json")
	.then(response => response.json())
	.then(data => {
		var applicationStatus = data.status;
		var codeword = data.codeword;
		document.getElementById("applicationStatus").innerText = applicationStatus;
		document.getElementById("codeword").innerText = codeword;
	});
