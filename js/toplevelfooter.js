fetch('../footer.html')
  .then(response => response.text())
  .then(data => {
    document.querySelector('body').innerHTML += data;
  });