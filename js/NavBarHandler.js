fetch('../nav-bar-featured.html')
.then(response => response.text())
.then(data => {
  if (document.getElementById("NavBarFeatured") !== null) document.getElementById("NavBarFeatured").innerHTML = data;
});

fetch('../nav-bar-projects.html')
.then(response => response.text())
.then(data => {
  if ( document.getElementById("NavBarProjects") !== null) document.getElementById("NavBarProjects").innerHTML = data;
});

fetch('../nav-bar-resume.html')
.then(response => response.text())
.then(data => {
  if (document.getElementById("NavBarResume") !== null)  document.getElementById("NavBarResume").innerHTML = data;
});

fetch('../nav-bar-blog.html')
.then(response => response.text())
.then(data => {
  if (document.getElementById("NavBarBlog") !== null)  document.getElementById("NavBarBlog").innerHTML = data;
});

fetch('../nav-bar-none.html')
.then(response => response.text())
.then(data => {
  if (document.getElementById("NavBarNone") !== null)  document.getElementById("NavBarNone").innerHTML = data;
});