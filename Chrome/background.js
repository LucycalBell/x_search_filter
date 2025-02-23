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
        let match = html.match(/<title>(.*?)<\/title>/i);
        if (match) {
          sendResponse({status: true, url: match[1]});
        }
        sendResponse({status: false, url: ""});
    })
    .catch(error => {
        console.error(error);
        sendResponse({status: false, url: ""});
    });
}