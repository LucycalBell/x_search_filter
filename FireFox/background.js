browser.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    switch (request.type) {
    case "getUrl_tco":
      if(!request.url.startsWith("https://t.co")){
        sendResponse({statusCode: 10, htmlStr: "", urlStr: request.url, });
        return true;
      }
    	ClassDataDownload(sendResponse, request.url);
	  return true;
    case "openOptions":
      chrome.runtime.openOptionsPage();
      return true;
    default:
      console.log("Error: Unkown request.");
	  return;
    }
  }
);

function ClassDataDownload(sendResponse, url){
    fetch(url)
    .then((response) => {
        if (!response.ok) {
            throw new Error('Error');
        }
        return response.text();
    })
    .then(html => {
        sendResponse({statusCode: 0, htmlStr: html, urlStr: url});
    })
    .catch(error => {
        sendResponse({statusCode: -1, htmlStr: "", urlStr: url});
    });
}

browser.action.onClicked.addListener(() => {
  browser.runtime.openOptionsPage();
});