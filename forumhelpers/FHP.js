var membersList = [];
var curatorsList = [];
var managersList = [];
function getData(dataSet) {
	var grabDelay = 0;
	fetch("https://mybearworld.github.io/tfh/forumhelpers/users.json")
		.then(response => response.json())
		.then(data => {
			for (j = 0; j < data.length; j++) {
				var name = data[j].name;
				membersList.push(name);
				var id = data[j].id;
				var bio = data[j].bio;
				var role = data[j].role;
				var addition = `
				<div class="profileContainer" id="${name.toUpperCase()}">
					<div class="profileTop">
						<h4 class="profileName"><a href="https://scratch.mit.edu/users/${name}/">${name}</a><span id="${name}Posts"></span></h4>
						<div class="badgeBlock" id="${name}BadgeBlock"></div>
					</div>

					<div class="profileInner">
						<a href="https://scratch.mit.edu/users/${name}/"><img src="https://uploads.scratch.mit.edu/get_image/user/${id}_60x60.png" class="profilePicture" id="${name}pfp" loading="lazy" alt="${name}'s Profile Picture"></a>
						<p class="profileBio">${bio}</p>
					</div>
					<p class="ocularStatusBox" id="${name}Ocular" title="Ocular Status"><span class="ocularStatus" id="${name}Status">Loading Status...</span></p>
					<br>
					<hr>
				</div>`;
				if (role == "m") {
					var section = document.getElementById("managersList").innerHTML;
					document.getElementById("managersList").innerHTML = section + addition;
					managersList.push(name);
				}
				else {
					var section = document.getElementById("curatorsList").innerHTML;
					document.getElementById("curatorsList").innerHTML = section + addition;
					curatorsList.push(name);
				}
				if (j == data.length-1) {
					document.getElementById("managersNumber").innerText = managersList.length;
					document.getElementById("curatorsNumber").innerText = curatorsList.length;
					document.getElementById("totalNumber").innerHTML = parseInt(document.getElementById("managersNumber").innerHTML) + parseInt(document.getElementById("curatorsNumber").innerHTML);
					var loadingHide = document.getElementsByClassName("listLoading");
					for (i = 0; i < loadingHide.length; i++) {
						loadingHide[i].style.display = "none";
					}
				}
				grabDelay = grabDelay + 1000;
				getOcular(name);
				setTimeout(getCount, grabDelay, name);
				addBadges(name);
			}
		});

}

function getOcular(name) {
	fetch("https://my-ocular.jeffalo.net/api/user/"+name)
		.then(response => response.json())
		.then(data => {
			var status = data.status;
			status ??= "none";
			var ocularDiv = document.getElementById(name+"Ocular");
			if (status != "none") {
				document.getElementById(name+"Status").innerText = status;
				ocularDiv.style.borderColor = data.color;
			}
			else {
				ocularDiv.style.display = "none";
			}
			if (document.getElementById(name+"Status").innerText === "" && data.color != undefined) {
				ocularDiv.style.backgroundColor = data.color;
				ocularDiv.style.width = "0px";
			}
		});
}

function getCount(name) {
	fetch("https://scratchdb.lefty.one/v3/forum/user/info/"+name)
		.then(response => response.json())
		.then(data => {
			var posts = data.counts.total.count;
			document.getElementById(name+"Posts").innerText = " - "+posts+" Posts";
		});
}

function addBadges(name) {
	var badgeBlock = document.getElementById(name+"BadgeBlock");
	if (memberDashboardAdmins.includes(name)) {
		badgeBlock.innerHTML = badgeBlock.innerHTML + '<img src="../resources/admin.png" class="memberBadge" width="32px" height="32px" title="Dashboard Admin">';
	}
	if (memberSiteContributor.includes(name)) {
		badgeBlock.innerHTML = badgeBlock.innerHTML + '<img src="../resources/coder.png" class="memberBadge" width="32px" height="32px" title="Site Contributer">';
	}
	if (memberOriginalStudio.includes(name)) {
		badgeBlock.innerHTML = badgeBlock.innerHTML + '<img src="../resources/original.png" class="memberBadge" width="32px" height="32px" title="Original Studio Member">';
	}
}


//Search for a user
var searchBar = document.getElementById("searchBar");
var searchButton = document.getElementById("searchButton");
var complexSearch
var storedSearchOption = localStorage.getItem("complexSearch")
if (storedSearchOption == false || storedSearchOption == null) {
	document.getElementById("searchCheckbox").checked = false;
	complexSearch = 0;
}
else {
	document.getElementById("searchCheckbox").checked = true;
	complexSearch = 1;
}

var searchOptions = [];
function updateUserChoice() {
	document.getElementById("searchOptions").innerHTML = "";
	searchOptions = [];
	var searchedLetters = searchBar.value;
	if (complexSearch == 0) {
		for (k = 0; k < membersList.length; k++) {
			if (membersList[k].toUpperCase().includes(searchedLetters.toUpperCase()) && searchOptions.length != 5 && searchedLetters != "") {
				searchOptions.push(membersList[k]);
			}
			document.getElementById(membersList[k].toUpperCase()).style.display = "block";
		}

		for (k = 0; k < searchOptions.length; k++) {
			var searchOptionBox = document.createElement("DIV");
			searchOptionBox.innerText = searchOptions[k];
			searchOptionBox.setAttribute("class", "searchOption");
			searchOptionBox.setAttribute("onclick", `autoFill("${searchOptions[k]}")`);
			document.getElementById("searchOptions").appendChild(searchOptionBox);
		}
	}
	else if (complexSearch == 1) {
		for (k = 0; k < membersList.length; k++) {
			if (membersList[k].toUpperCase().includes(searchedLetters.toUpperCase())) {
				searchOptions.push(membersList[k].toUpperCase());
			}
		}

		var profileContainers = document.getElementById("forumHelpersList").getElementsByClassName("profileContainer");
		for (k = 0; k < profileContainers.length; k++) {
			if (searchOptions.includes(profileContainers[k].id) == false) {
				profileContainers[k].style.display = "none";
			}
			else {
				profileContainers[k].style.display = "block";
			}
		}
	}
}

function autoFill(fillValue) {
	searchBar.value = fillValue;
	checkUser();
	updateUserChoice();
	searchUser();
}

function hideMatchingResults() {
	var searchCheckbox = document.getElementById("searchCheckbox");
	if (searchCheckbox.checked == true) {
		complexSearch = 1;
		localStorage.setItem("complexSearch", true);
	}
	else {
		complexSearch = 0;
		localStorage.setItem("complexSearch", false);
	}
	updateUserChoice();
}

function checkUser() {
	var searchedUser = searchBar.value.toUpperCase();
	if (document.getElementById(searchedUser) != undefined) {
		searchBar.style.borderColor = "green";
		searchButton.style.borderColor = "green";
		searchButton.disabled = false;
		searchButton.title = "Search!";
	}
	else if (searchedUser != "") {
		searchBar.style.borderColor = "#cc0000";
		searchButton.style.borderColor = "#cc0000";
		searchButton.disabled = true;
		searchButton.title = "Invalid Username";
	}
	else {
		searchBar.style.borderColor = "black"
		searchButton.style.borderColor = "black";
		searchButton.disabled = true;
		searchButton.title = "Invalid Username";
	}
}

function searchUser() {
	var searchedUser = searchBar.value.toUpperCase();
	if (document.getElementById(searchedUser) != undefined) {
		document.getElementById(searchedUser).scrollIntoView();
	}
}
