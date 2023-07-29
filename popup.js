// Get the current tab's URL
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var currentUrl = tabs[0].url;
  
    // Display the URL in the popup.html
    document.getElementById('url-display').textContent = currentUrl;
    document.getElementById('report-link').href = "http://localhost/pdadmin/report?urlStr=" + currentUrl;
});
  