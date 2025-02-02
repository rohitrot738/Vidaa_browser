function loadPage() {
  var url = document.getElementById("url").value;
  if (url) {
    document.getElementById("browser").src = url;
  } else {
    alert("Please enter a valid URL.");
  }
}
