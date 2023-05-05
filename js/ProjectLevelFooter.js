fetch('../footer-in-projects.html')
.then(response => response.text())
.then(data => {
  document.getElementById("Footer").innerHTML = data;
});
