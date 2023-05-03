fetch('../footer.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById("Footer").innerHTML = data;
  });