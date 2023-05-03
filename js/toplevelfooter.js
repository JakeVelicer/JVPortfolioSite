fetch('../footer.html')
  .then(response => response.text())
  .then(data => {
    document.body.appendChild(data);
  });