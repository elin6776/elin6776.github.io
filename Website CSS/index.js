function myDropdownFunction() {
  var linksDiv = document.getElementById("theLinks");
  
  if (linksDiv.style.display === "block") {
    linksDiv.style.display = "none";
  }
  else {
    linksDiv.style.display = "block";
  }
}
