chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    switch (request.type) {
    case "getUrl_tco":
    	ClassDataDownload(sendResponse, request.url);
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
        sendResponse({status: true, htmlStr: html, urlStr: url});
    })
    .catch(error => {
        sendResponse({status: false, htmlStr: "", urlStr: url});
    });
}
