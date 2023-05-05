fetch('../nav-bar-in-projects.html')
.then(response => response.text())
.then(data => {
  if (document.getElementById("NavBarProjects") !== null) document.getElementById("NavBarProjects").innerHTML = data;
});