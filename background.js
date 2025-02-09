const CLASS_DOWNLOAD_URL = "https://lucycal.stars.ne.jp/x_mute_filter/updateFile/post_text_class.json";
const SPAM_LIST_DOWNLOAD_URL = "https://lucycal.stars.ne.jp/x_mute_filter/updateFile/spam_list.txt";
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    switch (request.type) {
    case "class_request":
    	ClassDataDownload(sendResponse, false);
	  return true;
	case "class_request_force":
		ClassDataDownload(sendResponse, true);
	case "spam_list_request":
		SpamListDownload(sendResponse, false);
	return true;
    default:
      console.log("Error: Unkown request.");
	  return;
    }
  }
);

function ClassDataDownload(response, force){
	let version = "";
	let url;
	chrome.storage.local.get(["XFILTER_ON_CLASS_VERSION"]).then((result) => {
		try{
			version = result.XFILTER_ON_CLASS_VERSION;
		} catch(e){
			version = "";
		}
		let dt = new Date();
		url = CLASS_DOWNLOAD_URL + "?date=" + dt.getFullYear() + String(dt.getMonth()).padStart(2, 0) + String(dt.getDate()).padStart(2, 0) + String(dt.getHours()).padStart(2, 0) + String(dt.getMinutes()).padStart(2, 0);
		fetch(url)
		.then((response) => response.json()).then(function (jsonData) {
			let cList = jsonData.Definition;
			let jversion = jsonData.VERSION;
			if(DownloadVersionCheck(jversion)){
				if(!force){
					if(jversion == version){
						response(1);
						return;
					}
				}
			} else {
				code = "";
			}
			if(Array.isArray(cList)){
				for(let i=0;i<cList.length;i++){
					if(DownloadDataCheck(cList[i])){
						response(-1);
						return;
					}
				}
				chrome.storage.local.set({"XFILTER_ON_CLASS": JSON.stringify(cList)}, function() {
					chrome.storage.local.set({"XFILTER_ON_CLASS_VERSION": jversion}, function() {
						response(0);
					});
				});
			}
		});
	});
}

function SpamListDownload(response){
	let url;
	let dt = new Date();
	url = SPAM_LIST_DOWNLOAD_URL + "?date=" + dt.getFullYear() + String(dt.getMonth()).padStart(2, 0) + String(dt.getDate()).padStart(2, 0) + String(dt.getHours()).padStart(2, 0);
	fetch(url)
	.then((response) => response.text()).then(function (sList) {
		let lst = sList.split(/\r\n|\n/);
		chrome.storage.local.set({"XFILTER_ON_SPAM_LIST": JSON.stringify(lst)}, function() {
			response(0);
		});
	});
}

function DownloadVersionCheck(str){
	if(/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])_[0-9]{2}$/.test(str))return true;
	return false;
}

function DownloadDataCheck(str){
	if(/^[a-zA-Z-_]+$/.test(str))return true;
	return false;
}