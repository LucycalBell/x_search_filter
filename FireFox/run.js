
const TARGET_URL = [
    "twitter.com/search",
    "twitter.com/hashtag"
    ];
    const DEFAULT_ICON_NAME = "default_profile_normal.png";
    const POST_CLASS = [
        ["tweet", 3, "article"]
    ];
    const TWEET_DATA = "tweet";
    const TWEET_TEXT = "tweetText";
    const LINK_IMG_STR = "card.layoutLarge.media";
    const LINK_NO_IMG_STR = "card.wrapper";
    const DATA_XFILTER_HIDDEN = "data-xfilter-hidden";
    const TYPE_ARRAY = 0;
    const TYPE_INTEGER = 1;
    const TYPE_BOOL = 2;
    const TYPE_STRING = 3;
    const BLOCK_TYPE_TEXT = {
        0:"ミュートワード一致",
        1:"ハッシュタグ数超過",
        2:"スペース数超過",
        3:"ハッシュタグ行超過",
        4:"デフォルトアイコン",
        5:"認証済みアカウント",
        6:"オンラインスパムリスト一致",
        7:"インポートミュートリスト一致",
        8:"アカウント名スペース数超過",
        9:"ユーザー名のみ一致",
        10:"トレンドワード数超過(ポスト)",
        11:"トレンドワード数超過(ユーザー名)"
    };
    const CLASS_LINK_ICON = "gX5c7aMKHJte";
    const CLASS_LINK_TEXT = "38vLw0IMLBxf";
    const TREND_URL = "https://x.com/explore/tabs/trending";
    
    let postBlockViewNumber = 0;
    let hidden_posts = [];
    let postClass_Hierarchy;
    let X_OPTION;
    let block_type;
    let view_url = "";
    let manual_spam_list;
    let safe_user_list = [];
    let cnt_x;
    let cnt_y;
    let cardLink_id_count = 0;
    let trend_save_flag = false;
    let trend_save_datetime = -1;
    let trend_word_list = [];
    let trend_data_enable = false;
    let followingTabClick = false;
    let postHiddenStop = false;
    
    function TwitterSearchBlockMain(){
        OptionLoad_run();
    }

    function SafeListLoad(cb){
        browser.storage.local.get(["XFILTER_OPTION_SAFE_USER"]).then((result) => {
            try{
                safe_user_list = JSON.parse(result.XFILTER_OPTION_SAFE_USER);
                if(safe_user_list == void 0 || safe_user_list == null){ safe_user_list = [];}
                for(let i=0;i<safe_user_list.length;i++){
                    if(safe_user_list[i].startsWith("@")){
                        safe_user_list[i] = safe_user_list[i].replace("@", "");
                    }
                }
            } catch(e){
                safe_user_list = [];
            }
            if(cb != null){
                cb();
            }
        });
    }

    function SafeListSave(cb){
        let saveList = safe_user_list.filter(checkEmpty);
        browser.storage.local.set({"XFILTER_OPTION_SAFE_USER": JSON.stringify(saveList)}, function() {
            if(cb != null){
                cb();
            }
        });
    }

    function TrendDataLoad(){
        browser.storage.local.get(["XFILTER_OPTION_TREND_SAVE"]).then((result) => {
            let r;
            try{
                r = JSON.parse(result.XFILTER_OPTION_TREND_SAVE);
            } catch(e){
                r = [];
            }
            if(r == void 0 || r == null){ r = []; }
            trend_word_list = r;
            browser.storage.local.get(["XFILTER_OPTION_TREND_SAVE_DATETIME"]).then((result) => {
                let r;
                try{
                    r = JSON.parse(result.XFILTER_OPTION_TREND_SAVE_DATETIME);
                } catch(e){
                    r = 0;
                }
                if(r == void 0 || r == null){ r = 0; }
                trend_save_datetime = r;
            });
        });
    }

    function checkEmpty(el) {
        return el !== undefined && el !== 0 && el !== null && el.trim() != "";
    }

    function OptionLoad_run(){
        SafeListLoad();
        browser.storage.local.get(["XFILTER_OPTION"]).then((result) => {
            let r;
            try{
                r = JSON.parse(result.XFILTER_OPTION);
            } catch(e){
                r = {};
            }
            if(r == void 0){r = {};}
            X_OPTION = {};
            X_OPTION.BLOCK_WORDS = getOptionPram(r.BLOCK_WORDS, [], TYPE_ARRAY);
            X_OPTION.EXCLUDE_WORDS = getOptionPram(r.EXCLUDE_WORDS, [], TYPE_ARRAY);
            X_OPTION.TAG_BORDER = getOptionPram(r.TAG_BORDER, 0, TYPE_INTEGER);
            X_OPTION.DEFAULT_ICON_BLOCK = getOptionPram(r.DEFAULT_ICON_BLOCK, false, TYPE_BOOL);
            X_OPTION.BLOCK_COUNT_VIEW = getOptionPram(r.BLOCK_COUNT_VIEW, true, TYPE_BOOL);
            X_OPTION.SPACE_BORDER = getOptionPram(r.SPACE_BORDER, 0, TYPE_INTEGER);
            X_OPTION.HIRA_KATA_COV = getOptionPram(r.HIRA_KATA_COV, true, TYPE_BOOL);
            X_OPTION.CASE_CONV = getOptionPram(r.CASE_CONV, false, TYPE_BOOL);
            X_OPTION.INTERVAL_TIME = getOptionPram(r.INTERVAL_TIME, 350, TYPE_INTEGER);
            X_OPTION.TARGET_URL = getOptionPram(r.TARGET_URL, TARGET_URL, TYPE_ARRAY);
            X_OPTION.URL_XT_CONVERT = getOptionPram(r.URL_XT_CONVERT, true, TYPE_BOOL);
            X_OPTION.REG_EXP = getOptionPram(r.REG_EXP, false, TYPE_BOOL);
            X_OPTION.DEFAULT_ICON_NAME = getOptionPram(r.DEFAULT_ICON_NAME, DEFAULT_ICON_NAME, TYPE_STRING);
            X_OPTION.TAG_START_BORDER = getOptionPram(r.TAG_START_BORDER, 0, TYPE_INTEGER);
            X_OPTION.ONLINE_UPDATE = false
            X_OPTION.LINK_EMPHASIS = getOptionPram(r.LINK_EMPHASIS, true, TYPE_BOOL);
            X_OPTION.POST_CLASS = getOptionPram(r.POST_CLASS, POST_CLASS, TYPE_ARRAY);
            X_OPTION.INSERT_DEFAULT_CLASS = getOptionPram(r.INSERT_DEFAULT_CLASS, true, TYPE_BOOL);
            X_OPTION.LINK_EMPHASIS_ALL = getOptionPram(r.LINK_EMPHASIS_ALL, true, TYPE_BOOL);
            X_OPTION.VERIFIED_HDN = getOptionPram(r.VERIFIED_HDN, false, TYPE_BOOL);
            X_OPTION.POST_CHECK_ALL = getOptionPram(r.POST_CHECK_ALL, false, TYPE_BOOL);
            X_OPTION.ONLINE_SPAM_LIST = false;
            X_OPTION.MANUAL_SPAM_LIST = getOptionPram(r.MANUAL_SPAM_LIST, false, TYPE_ARRAY);
            X_OPTION.ACCOUNTNAME_SPACE_BORDER = getOptionPram(r.ACCOUNTNAME_SPACE_BORDER, 0, TYPE_INTEGER);
            X_OPTION.SEARCH_HIT_USERNAME_BLOCK = getOptionPram(r.SEARCH_HIT_USERNAME_BLOCK, false, TYPE_BOOL);
            X_OPTION.LINK_CARD_URL_VIEW = getOptionPram(r.LINK_CARD_URL_VIEW, false, TYPE_BOOL);
            X_OPTION.LINK_CARD_URL_VIEW_ONELINE = getOptionPram(r.LINK_CARD_URL_VIEW_ONELINE, false, TYPE_BOOL);
            X_OPTION.LINK_CARD_MISMATCH_WARNING = getOptionPram(r.LINK_CARD_MISMATCH_WARNING, false, TYPE_BOOL);
            X_OPTION.LINK_CARD_URL_SAFE = getOptionPram(r.LINK_CARD_URL_SAFE, [], TYPE_ARRAY).filter(item => item !== "");
            X_OPTION.LINK_CARD_URL_VIEW_VIDEO_DISABLE = getOptionPram(r.LINK_CARD_URL_VIEW_VIDEO_DISABLE, true, TYPE_BOOL);
            X_OPTION.TREND_WORD_BORDER_TEXT = getOptionPram(r.TREND_WORD_BORDER_TEXT, 0, TYPE_INTEGER);
            X_OPTION.TREND_WORD_BORDER_NAME = getOptionPram(r.TREND_WORD_BORDER_NAME, 0, TYPE_INTEGER);
            X_OPTION.DEFAULT_SELECTED_FOLLOW_TAB = getOptionPram(r.DEFAULT_SELECTED_FOLLOW_TAB, false, TYPE_BOOL);
            X_OPTION.LINK_CLICK_URL_CHECK = getOptionPram(r.LINK_CLICK_URL_CHECK, false, TYPE_BOOL);

            TrendDataLoad();

            if(X_OPTION.MANUAL_SPAM_LIST == void 0 || X_OPTION.MANUAL_SPAM_LIST == null || X_OPTION.MANUAL_SPAM_LIST.length == 0){
                X_OPTION.MANUAL_SPAM_LIST = [];
                manual_spam_list = [];
            } else {
                manual_spam_list = [];
                for(let i=0;i<X_OPTION.MANUAL_SPAM_LIST.length;i++){
                    if(X_OPTION.MANUAL_SPAM_LIST[i] != void 0 && X_OPTION.MANUAL_SPAM_LIST[i] != null && X_OPTION.MANUAL_SPAM_LIST[i].trim() != ""){
                        manual_spam_list.push(X_OPTION.MANUAL_SPAM_LIST[i].replace("@", ""));
                    }
                }
            }

            browser.storage.local.get(["XFILTER_ON_CLASS"]).then((result) => {
                let c;
                try{
                    if(result.XFILTER_ON_CLASS != void 0){
                        c = JSON.parse(result.XFILTER_ON_CLASS);
                    } else {
                        c = {};
                    }
                } catch(e){
                    console.error(e);
                    c = {};
                }
                X_OPTION.POST_CLASS = getOptionPram(c, X_OPTION.POST_CLASS, TYPE_ARRAY);
                MainLoopX();
            });
            FollowTabCheck();
        });
    }

    function getOptionPram(opt, defaultValue, type){
        if(opt == void 0 || opt == null)return defaultValue;
        switch(type){
            case TYPE_ARRAY:
                if(Array.isArray(opt)){ return opt; }
            break;
            case TYPE_INTEGER:
                if(Number.isInteger(Number(opt))){ return opt; }
            break;
            case TYPE_BOOL:
                if(typeof opt === "boolean"){ return opt; }
            break;
            case TYPE_STRING:
                if(typeof opt === "string"){ return opt; }
            break;
        }
        return defaultValue;
    }
    
    let activeUrl;
    function MainLoopX(){
        let postList;
        activeUrl = FilterActiveCheck();

        FollowTabCheck();

        if(0 < X_OPTION.TREND_WORD_BORDER_TEXT || 0 < X_OPTION.TREND_WORD_BORDER_NAME || true){
            if((trend_word_list.length < 30 || !trend_save_flag || 1000 * 60 * 60 < (new Date().getTime() - trend_save_datetime)) && trend_save_datetime != -1){
                if(isTrendPage()){
                    if(isTrendPageLoadingEnd()){
                        SaveTrend(getTrend());
                    }
                }
            }
        }

        if((new Date().getTime() - trend_save_datetime) < 1000 * 60 * 60 && 0 < trend_word_list.length){
            trend_data_enable = true;
        } else {
            trend_data_enable = false;
        }

        if(view_url != location.href){
            postBlockViewNumber = 0;
            hidden_posts = [];
        }
        BlockCount();

        postList = getPostList();

        view_url = location.href;

        if(activeUrl && X_OPTION.BLOCK_COUNT_VIEW){
            if(document.getElementById("x9uVvQH") != null){
                if(document.getElementById("x9uVvQH").style.display == "none"){
                    postBlockViewNumber = 0;
                    hidden_posts = [];
                    BlockCount();
                }
                document.getElementById("x9uVvQH").style.display = "block";
            }
        } else {
            if(document.getElementById("x9uVvQH") != null){
                document.getElementById("x9uVvQH").style.display = "none";
            }
        }

        if((X_OPTION.LINK_EMPHASIS || X_OPTION.LINK_CARD_URL_VIEW) && (activeUrl || X_OPTION.LINK_EMPHASIS_ALL)) {
            CardLinkEmphasis();
        }

        for(let i=0;i<postList.length;i++){
            if(activeUrl && PostBlockCheck(postList[i])){
                PostBlock(postList[i]);
            } else {
                if(activeUrl || X_OPTION.LINK_EMPHASIS_ALL){
                    AddLinkClickListener(postList[i]);
                }
            }
        }
        setTimeout(MainLoopX, X_OPTION.INTERVAL_TIME);
    }

    function getPostList() {
        let postList = [];
        if(postClass_Hierarchy == null || postClass_Hierarchy == void 0){
            postClass_Hierarchy = getPostClass();
        }
        if(postClass_Hierarchy == void 0){
            return postList;
        }
        if(postClass_Hierarchy[0] == TWEET_DATA){
            postList = [];
            let allDiv = document.getElementsByTagName("article");
            for(let i=0;i<allDiv.length;i++){
                if(allDiv[i].dataset.testid == TWEET_DATA){
                    postList.push(allDiv[i]);
                }
            }
        } else {
            postList = document.getElementsByClassName(postClass_Hierarchy[0]);
        }
        return postList;
    }

    function CardLinkEmphasis(){
        let a;
        let cardList = [];
        let b;
        let labeltxt = "";
        let linkDomain = "";
        let viewDomain = "";
        b = document.getElementsByTagName("div");

        a = document.getElementsByTagName("div");
        for(let i=0;i<a.length;i++){
            if(a[i].dataset.testid != void 0 && a[i].dataset.testid == LINK_IMG_STR){
                linkDomain = "";
                viewDomain = "";
                if(0 < a[i].getElementsByTagName("a").length && a[i].getElementsByTagName("a")[0].ariaLabel != null){
                    linkDomain = a[i].getElementsByTagName("a")[0].href;
                    viewDomain = a[i].getElementsByTagName("a")[0].ariaLabel.split(" ")[0];
                }
                cardList.push([a[i], viewDomain, linkDomain]);
            }
        }

        for(let i=0;i<cardList.length;i++){
            labeltxt = "";
            b = cardList[i][0].getElementsByTagName("a");
            for(let q=0;q<b.length;q++){
                if(b[q] != void 0 && b[q].ariaLabel != null && b[q].ariaLabel.includes(".")){
                    labeltxt = b[q].ariaLabel.trim();
                    break;
                }
            }
            if(cardList[i][0].getElementsByClassName("XGarIO3t").length == 0) {
                const videoCheck = isVideoCard(cardList[i][0]);
                if (videoCheck === null) {
                    continue;
                }
                if (!X_OPTION.LINK_CARD_URL_VIEW_VIDEO_DISABLE || !videoCheck) {
                    let createNode = document.createElement("div");
                    if(X_OPTION.LINK_EMPHASIS) {
                        const iconSpan = document.createElement("span");
                        iconSpan.className = CLASS_LINK_ICON;
                        iconSpan.textContent = "🔗";
                        iconSpan.style.fontSize = "2rem";
                        iconSpan.style.width = "3rem";
                        iconSpan.style.textAlign = "center";

                        const textSpan = document.createElement("span");
                        textSpan.className = CLASS_LINK_TEXT;
                        textSpan.textContent = labeltxt;
                        textSpan.style.position = "absolute";
                        textSpan.style.top = "50%";
                        textSpan.style.transform = "translateY(-50%)";
                        textSpan.style.left = "3rem";
                        textSpan.style.padding = "0 0.2rem 0.2rem 0.2rem";
                        textSpan.style.fontSize = "0.85rem";
                        textSpan.style.fontWeight = "bold";
                        textSpan.style.display = "-webkit-box";
                        textSpan.style.setProperty("-webkit-box-orient", "vertical");
                        textSpan.style.setProperty("-webkit-line-clamp", "2");
                        textSpan.style.overflow = "hidden";
                        textSpan.style.color = "#000";

                        createNode.className = "XGarIO3t";
                        createNode.style.backgroundColor = "rgba(245,245,245,0.9)";
                        createNode.style.position = "absolute";
                        createNode.style.height = "3rem";
                        createNode.style.width = "100%";
                        createNode.style.top = "0";
                        createNode.style.left = "0";
                        createNode.style.textAlign = "left";
                        createNode.style.display = "flex";
                        createNode.style.pointerEvents = "none";

                        createNode.appendChild(iconSpan);
                        createNode.appendChild(textSpan);
                        cardList[i][0].appendChild(createNode);
                    }
                    if(X_OPTION.LINK_CARD_URL_VIEW){
                        UrlDomainCheck(cardList[i]);
                    }
                    break;
                }
            }
        }
    }

    function getCardDomain(post) {
        let aList = post.getElementsByTagName("div");
        for (const item of aList) {
            if(item.dataset.testid !== void 0 && item.dataset.testid !== LINK_IMG_STR){
                return item;
            }
        }
        return null;
    }

    function getCardDomainUrl(card) {
        let aList = card.parentElement.parentElement.getElementsByTagName("a");
        for(const item of aList){
            if(item.ariaLabel !== void 0 && item.ariaLabel.includes(".")){
                return item.ariaLabel.split(" ")[0];
            }
        }
        return null;
    }

    function getCardLink(card) {
        let aList = card.parentElement.parentElement.getElementsByTagName("a");
        for(const item of aList){
            if(item.ariaLabel == void 0 && item.href.startsWith("http")){
                return item;
            }
        }
        return null;
    }

    function getNodeText(node) {
        if (!node) {
            return "";
        }
        let text = "";
        for (let i = 0; i < node.childNodes.length; i++) {
            if (node.childNodes[i].nodeType === Node.TEXT_NODE) {
                text += node.childNodes[i].nodeValue;
            }
        }
        return text;
    }

    function UrlDomainCheck(cardData) {
        if(cardData[0].dataset.urlWkxChecked === "true"){
            return;
        }
        cardData[0].dataset.urlWkxChecked = "true";

        browser.runtime.sendMessage({
            type:"getUrl_tco",
            url: cardData[2]
        },
        function (response) {
            let resultUrl;
            if(response.statusCode == 0){
                resultUrl = refreshUrl(response.htmlStr);
            } else if(response.statusCode == 10){
                resultUrl = response.urlStr;
            } else {
                return;
            }
            let link_icon = cardData[0].getElementsByClassName(CLASS_LINK_ICON);
            let link_text = cardData[0].getElementsByClassName(CLASS_LINK_TEXT);
            let linka_a = getCardLink(cardData[0]);
            cardLink_id_count++;
            
            let urlSpan = document.createElement('span');
            urlSpan.id = 'cHXCcZlv_' + cardLink_id_count;
            urlSpan.setAttribute('data-cardLinkUrl', resultUrl);
            urlSpan.textContent = '（URL：' + resultUrl + '）';
            
            if(X_OPTION.LINK_CARD_MISMATCH_WARNING && !X_OPTION.LINK_CARD_URL_SAFE.includes(getDomain(resultUrl)) && getDomain(resultUrl) != getDomain(cardData[1])){
                urlSpan.style.color = 'red';
                urlSpan.style.fontWeight = 'bold';
                linka_a.appendChild(urlSpan);
                if(0 < link_icon.length){
                    link_icon[0].textContent = "⚠";
                    link_icon[0].style.backgroundColor = "#eeff00";
                }
                if(0 < link_text.length){
                    link_icon[0].style.color = "red";
                }
            } else {
                linka_a.appendChild(urlSpan);
            }
            document.getElementById("cHXCcZlv_" + String(cardLink_id_count)).addEventListener("click", function(ev){
                ev.stopPropagation()
                ev.preventDefault();
                if(window.confirm("【X検索ミュートツール】\n以下URLをコピーしますか？\n" + ev.target.dataset.cardlinkurl)){
                    navigator.clipboard.writeText(ev.target.dataset.cardlinkurl)
                    .then(() => {
                        alert("コピーしました");
                    })
                    .catch((error) => {
                        alert("コピーできませんでした", error);
                    });
                }
            }, false);
            if(X_OPTION.LINK_CARD_URL_VIEW_ONELINE){
                linka_a.style.whiteSpace = "nowrap";
                linka_a.style.overflow = "hidden";
                linka_a.style.textOverflow = "ellipsis";
                linka_a.style.display = "inline-block";
            }
        });
    }

    function LinkClickCheck(linkElement, event){
        let href = linkElement.href;
        if(!href || !href.startsWith("http")){
            return true;
        }
        
        if(!href.includes("t.co")){
            return true;
        }

        let displayText = getDisplayDomain(linkElement);

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        
        let responseReceived = false;
        let userChoice = null;
        let loadingDialogId = 'ndRmlbG_ld_' + Date.now();
        
        // 1秒後にローディングダイアログを表示
        let timeoutTimer = setTimeout(function(){
            if(!responseReceived){
                showLoadingDialog(href, loadingDialogId, function(choice){
                    userChoice = choice;
                    if(choice === 'proceed'){
                        // ユーザーが「このまま遷移」を選択
                        window.open(href, '_blank');
                    }
                    // キャンセルの場合は何もしない
                });
            }
        }, 1000);
        
        browser.runtime.sendMessage({
            type:"getUrl_tco",
            url: href
        },
        function (response) {
            responseReceived = true;
            clearTimeout(timeoutTimer);
            
            // ローディングダイアログが表示されている場合は閉じる
            let loadingDialog = document.getElementById(loadingDialogId);
            if(loadingDialog){
                loadingDialog.remove();
            }
            
            // ユーザーが既に選択していた場合は処理しない
            if(userChoice !== null){
                return;
            }

            if(!response || browser.runtime.lastError || (response.statusCode !== 0 && response.statusCode !== 10)){
                showErrorDialog(href, function(shouldProceed){
                    if(shouldProceed){
                        window.open(href, '_blank');
                    }
                });
                return;
            }
            
            let resultUrl = href;
            if(response.statusCode == 0){
                resultUrl = refreshUrl(response.htmlStr);
            } else if(response.statusCode == 10){
                resultUrl = response.urlStr;
            } else {
                resultUrl = null;
            }
            
            let isWarning = false;
            
            // 表示テキストのドメインと実際の遷移先のドメインを比較
            if(X_OPTION.LINK_CARD_URL_SAFE && X_OPTION.LINK_CARD_URL_SAFE.includes(getDomain(resultUrl))){
                isWarning = false;
            } else if(displayText && getDomain(resultUrl) != getDomain(displayText)){
                isWarning = true;
            }
            
            if(isWarning){
                showCustomConfirmDialog(displayText, resultUrl, function(isConfirmed, addToSafelist){
                    if(isConfirmed){
                        if(addToSafelist){
                            addDomainToSafelist(getDomain(resultUrl));
                        }
                        if(resultUrl !== null) {
                            window.open(resultUrl, '_blank');
                        }
                    }
                });
            } else {
                if(resultUrl !== null) {
                    window.open(resultUrl, '_blank');
                }
            }
        });
        return false;
    }

    function showErrorDialog(href, callback){
        let existingDialog = document.getElementById('ndRmlbG_ed');
        if(existingDialog){
            existingDialog.remove();
        }

        let dialogOverlay = document.createElement('div');
        dialogOverlay.id = 'ndRmlbG_ed';
        dialogOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.35);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
        `;

        let dialogBox = document.createElement('div');
        dialogBox.style.cssText = `
            background: #fffaf3;
            border: 2px solid #f6c97f;
            border-radius: 16px;
            box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28);
            max-width: 500px;
            width: 90%;
            padding: 24px;
        `;

        let titleEl = document.createElement('h2');
        titleEl.textContent = '【X検索ミュートツール】';
        titleEl.style.cssText = `
            margin: 0 0 16px 0;
            font-size: 18px;
            font-weight: 600;
            color: #0f1419;
        `;

        let messageEl = document.createElement('p');
        messageEl.style.cssText = `
            margin: 0 0 16px 0;
            font-size: 14px;
            color: #b45309;
            line-height: 1.5;
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        let errorIcon = document.createElement('span');
        errorIcon.textContent = '⚠️';
        errorIcon.style.fontSize = '20px';
        let errorText = document.createElement('span');
        errorText.textContent = 'リンク先の確認に失敗しました。';
        messageEl.appendChild(errorIcon);
        messageEl.appendChild(errorText);

        let detailEl = document.createElement('p');
        detailEl.textContent = 'オフラインまたは通信エラーのため、移動先URLを確認できませんでした。';
        detailEl.style.cssText = `
            margin: 0 0 16px 0;
            font-size: 13px;
            color: #536471;
            line-height: 1.5;
        `;

        let urlInfoEl = document.createElement('div');
        urlInfoEl.style.cssText = `
            background: #f7f9fa;
            border-radius: 12px;
            padding: 12px;
            margin: 0 0 16px 0;
            font-size: 13px;
            color: #0f1419;
            word-break: break-all;
        `;
        let urlTitle = document.createElement('strong');
        urlTitle.textContent = '移動先:';
        let urlBr = document.createElement('br');
        let urlSpan = document.createElement('span');
        urlSpan.style.color = '#536471';
        urlSpan.textContent = href;
        urlInfoEl.appendChild(urlTitle);
        urlInfoEl.appendChild(urlBr);
        urlInfoEl.appendChild(urlSpan);

        let buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        `;

        let cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'キャンセル';
        cancelBtn.style.cssText = `
            padding: 10px 20px;
            border: 1px solid #cfd9de;
            background: white;
            color: #0f1419;
            border-radius: 9999px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s;
        `;
        cancelBtn.onmouseover = function(){
            this.style.background = '#f7f9fa';
        };
        cancelBtn.onmouseout = function(){
            this.style.background = 'white';
        };
        cancelBtn.onclick = function(){
            dialogOverlay.remove();
            callback(false);
        };

        let proceedBtn = document.createElement('button');
        proceedBtn.textContent = 'このまま移動';
        proceedBtn.style.cssText = `
            padding: 10px 20px;
            border: none;
            background: #ef4444;
            color: white;
            border-radius: 9999px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
        `;
        proceedBtn.onmouseover = function(){
            this.style.background = '#dc2626';
        };
        proceedBtn.onmouseout = function(){
            this.style.background = '#ef4444';
        };
        proceedBtn.onclick = function(){
            dialogOverlay.remove();
            callback(true);
        };

        buttonContainer.appendChild(cancelBtn);
        buttonContainer.appendChild(proceedBtn);

        dialogBox.appendChild(titleEl);
        dialogBox.appendChild(messageEl);
        dialogBox.appendChild(detailEl);
        dialogBox.appendChild(urlInfoEl);
        dialogBox.appendChild(buttonContainer);

        dialogOverlay.appendChild(dialogBox);
        document.body.appendChild(dialogOverlay);

        // Escキーでキャンセル
        let escapeHandler = function(e){
            if(e.key === 'Escape'){
                document.removeEventListener('keydown', escapeHandler);
                dialogOverlay.removeEventListener('click', overlayClickHandler);
                let dialog = document.getElementById('ndRmlbG_ed');
                if(dialog){
                    dialog.remove();
                    callback(false);
                }
            }
        };
        document.addEventListener('keydown', escapeHandler);

        // オーバーレイクリックでキャンセル
        let overlayClickHandler = function(e){
            if(e.target === dialogOverlay){
                document.removeEventListener('keydown', escapeHandler);
                dialogOverlay.removeEventListener('click', overlayClickHandler);
                dialogOverlay.remove();
                callback(false);
            }
        };
        dialogOverlay.addEventListener('click', overlayClickHandler);
    }

    function showLoadingDialog(href, dialogId, callback){
        let existingDialog = document.getElementById(dialogId);
        if(existingDialog){
            existingDialog.remove();
        }

        let dialogOverlay = document.createElement('div');
        dialogOverlay.id = dialogId;
        dialogOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.35);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
        `;

        let dialogBox = document.createElement('div');
        dialogBox.style.cssText = `
            background: #ffffff;
            border: 2px solid #1d9bf0;
            border-radius: 16px;
            box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28);
            max-width: 500px;
            width: 90%;
            padding: 24px;
        `;

        let titleEl = document.createElement('h2');
        titleEl.textContent = '【X検索ミュートツール】';
        titleEl.style.cssText = `
            margin: 0 0 16px 0;
            font-size: 18px;
            font-weight: 600;
            color: #0f1419;
        `;

        let messageEl = document.createElement('p');
        messageEl.textContent = 'リンク先を確認しています...';
        messageEl.style.cssText = `
            margin: 0 0 16px 0;
            font-size: 14px;
            color: #536471;
            line-height: 1.5;
        `;

        let loadingEl = document.createElement('div');
        loadingEl.style.cssText = `
            text-align: center;
            margin: 16px 0;
            font-size: 24px;
        `;
        loadingEl.textContent = '⏳';

        let urlInfoEl = document.createElement('div');
        urlInfoEl.style.cssText = `
            background: #f7f9fa;
            border-radius: 12px;
            padding: 12px;
            margin: 0 0 16px 0;
            font-size: 13px;
            color: #0f1419;
            word-break: break-all;
        `;
        let urlTitle = document.createElement('strong');
        urlTitle.textContent = 'URL:';
        let urlBr = document.createElement('br');
        let urlSpan = document.createElement('span');
        urlSpan.style.color = '#536471';
        urlSpan.textContent = href;
        urlInfoEl.appendChild(urlTitle);
        urlInfoEl.appendChild(urlBr);
        urlInfoEl.appendChild(urlSpan);

        let buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        `;

        let cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'キャンセル';
        cancelBtn.style.cssText = `
            padding: 10px 20px;
            border: 1px solid #cfd9de;
            background: white;
            color: #0f1419;
            border-radius: 9999px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s;
        `;
        cancelBtn.onmouseover = function(){
            this.style.background = '#f7f9fa';
        };
        cancelBtn.onmouseout = function(){
            this.style.background = 'white';
        };
        cancelBtn.onclick = function(){
            dialogOverlay.remove();
            callback('cancel');
        };

        let proceedBtn = document.createElement('button');
        proceedBtn.textContent = 'このまま移動';
        proceedBtn.style.cssText = `
            padding: 10px 20px;
            border: none;
            background: #1d9bf0;
            color: white;
            border-radius: 9999px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
        `;
        proceedBtn.onmouseover = function(){
            this.style.background = '#1a8cd8';
        };
        proceedBtn.onmouseout = function(){
            this.style.background = '#1d9bf0';
        };
        proceedBtn.onclick = function(){
            dialogOverlay.remove();
            callback('proceed');
        };

        buttonContainer.appendChild(cancelBtn);
        buttonContainer.appendChild(proceedBtn);

        dialogBox.appendChild(titleEl);
        dialogBox.appendChild(messageEl);
        dialogBox.appendChild(loadingEl);
        dialogBox.appendChild(urlInfoEl);
        dialogBox.appendChild(buttonContainer);

        dialogOverlay.appendChild(dialogBox);
        document.body.appendChild(dialogOverlay);

        // Escキーでキャンセル
        let escapeHandler = function(e){
            if(e.key === 'Escape'){
                document.removeEventListener('keydown', escapeHandler);
                let dialog = document.getElementById(dialogId);
                if(dialog){
                    dialog.remove();
                    callback('cancel');
                }
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    function refreshUrl(htmlStr){
        let parser = new DOMParser();
        let doc = parser.parseFromString(htmlStr, 'text/html');
        let metaTag = doc.head ? doc.head.querySelector('meta[http-equiv="refresh"]') : null;
        if (!metaTag) return null;
        let content = metaTag.getAttribute("content");
        if (!content) return null;
        let match = content.match(/url\s*=\s*(.+)/i);
        if (match && match[1]) {
            return match[1].trim();
        }
        return null;
    }

    function getDomain(url){
        if(!url){ return null; }
        const match = url.match(/^(?:https?:\/\/)?(?:www.)?([^/]+)/i);
        return (match && match[1]) ? match[1] : null;
    }

    function getDisplayDomain(linkElement){
        let text = "";
        if(linkElement.ariaLabel){
            text = linkElement.ariaLabel.split(" ")[0].trim();
        } else if(linkElement.textContent){
            let spanLst = linkElement.getElementsByTagName("span");
            for(const span of spanLst) {
                const nodeText = getNodeText(span);
                if(isDomainText(nodeText)) {
                    text = nodeText;
                    break;
                }
            }
        }

        if(!text){
            return null;
        }

        const domainMatch = text.match(/\b((?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,})\b/);
        if(domainMatch && domainMatch[1]){
            return domainMatch[1];
        }

        return text.split(/\s+/)[0];
    }

    function isDomainText(text) {
        if (!text || typeof text !== 'string') {
            return false;
        }
        
        text = text.trim();
        
        if (/\s/.test(text)) {
            return false;
        }
        
        const domainPattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
        
        if (!domainPattern.test(text)) {
            return false;
        }
        
        const parts = text.split('.');
        const tld = parts[parts.length - 1];
        if (tld.length < 2) {
            return false;
        }
        
        return true;
    }
    
    function getPostClass(){
        let l;
        let classList = [];
        let searchTag;

        if(X_OPTION.INSERT_DEFAULT_CLASS){
            classList = POST_CLASS.concat(X_OPTION.POST_CLASS);
        } else {
            classList = X_OPTION.POST_CLASS;
        }

        for(let i=0;i<classList.length;i++){
            if(classList[i][2] != void 0){
                searchTag = classList[i][2].trim();
            } else {
                searchTag = "div";
            }
            let t = document.getElementsByTagName(searchTag);
            let cnt = 0;
            for(let x=0;x<t.length;x++){
                if(t[x].dataset.testid == TWEET_DATA){
                    cnt++
                }
            }
            if(0 < cnt){ return classList[i]; }
        }

        for(let i=0;i<classList.length;i++){
            l = document.getElementsByClassName(classList[i][0]);
            if(0 < l.length){
                return classList[i];
            }
        }
    }
    
    function PostBlockCheck(post){
        block_type = -1;
        let postl;

        if(getUrlUserName() != "" && getUrlUserName() == getPostUserName(post, true)){
            return false;
        }

        if(isDialog(post)){
            return false;
        }

        if(safe_user_list.includes(getPostUserName(post, true))){
            return false;
        }

        if(X_OPTION.POST_CHECK_ALL){
            postl = getPostParent(post, postClass_Hierarchy[1]).innerText.split(/\n/);
        } else {
            postl = getPostTextTag(post).innerText.split(/\n/);
        }
        if(X_OPTION.REG_EXP){
            for(let i=0;i<X_OPTION.EXCLUDE_WORDS.length;i++){
                if(X_OPTION.EXCLUDE_WORDS[i].trim() != ""){
                    for(let p=0;p<postl.length;p++){
                        if(ConvertUppercase(HiraToKana(postl[p])).match(ConvertUppercase(HiraToKana(X_OPTION.EXCLUDE_WORDS[i])))){ return false; }
                    }
                }
            }
            for(let i=0;i<X_OPTION.BLOCK_WORDS.length;i++){
                if(X_OPTION.BLOCK_WORDS[i].trim() != ""){
                    for(let p=0;p<postl.length;p++){
                        if(ConvertUppercase(HiraToKana(postl[p])).match(ConvertUppercase(HiraToKana(X_OPTION.BLOCK_WORDS[i])))){ block_type = 0;return true; }
                    }
                }
            }
        } else {
            for(let i=0;i<X_OPTION.EXCLUDE_WORDS.length;i++){
                if(X_OPTION.EXCLUDE_WORDS[i].trim() != ""){
                    for(let p=0;p<postl.length;p++){
                        if(ConvertUppercase(HiraToKana(postl[p])).includes(ConvertUppercase(HiraToKana(X_OPTION.EXCLUDE_WORDS[i])))){ return false; }
                    }
                }
            }
            for(let i=0;i<X_OPTION.BLOCK_WORDS.length;i++){
                if(X_OPTION.BLOCK_WORDS[i].trim() != ""){
                    for(let p=0;p<postl.length;p++){
                        if(ConvertUppercase(HiraToKana(postl[p])).includes(ConvertUppercase(HiraToKana(X_OPTION.BLOCK_WORDS[i])))){ block_type = 0;return true; }
                    }
                }
            }
        }

        if(0 < manual_spam_list.length){
            if(manual_spam_list.includes(getPostUserName(post, true))){
                block_type = 7;
                return true;
            }
        }

        if(0 < X_OPTION.TAG_BORDER){
            if(X_OPTION.TAG_BORDER <= TagCount(post)){
                block_type = 1;
                return true;
            }
        }
        if(0 < X_OPTION.SPACE_BORDER){
            if(X_OPTION.SPACE_BORDER  <= SpaceCount(post)){
                block_type = 2;
                return true;
            }
        }
        if(0 < X_OPTION.TAG_START_BORDER){
            if(X_OPTION.TAG_START_BORDER <= HashtagStartLine(post)){
                block_type = 3;
                return true;
            }
        }
        if(X_OPTION.DEFAULT_ICON_BLOCK){
            if(DefaultIcon(post)){
                block_type = 4;
                return true;
            }
        }
        if(X_OPTION.VERIFIED_HDN){
            if(isVerified(post)){
                block_type = 5;
                return true;
            }
        }
        if(0 < X_OPTION.ACCOUNTNAME_SPACE_BORDER){
            if(X_OPTION.ACCOUNTNAME_SPACE_BORDER <= AccountSpaceCount(post)){
                block_type = 8;
                return true;
            }
        }
        if(X_OPTION.SEARCH_HIT_USERNAME_BLOCK){
            if(isSearchPage()){
                if(0 < getSearchWordList().length){
                    if(!(getSearchWordList().some(item => getPostTextTag(post).innerText.toUpperCase().includes(item.toUpperCase())))){
                        if((getSearchWordList().some(item => getPostUserName(post).toUpperCase().includes(item.toUpperCase())))){
                            block_type = 9;
                            return true;
                        }
                    }
                }
            }
        }
        if(0 < X_OPTION.TREND_WORD_BORDER_TEXT){
            if(X_OPTION.TREND_WORD_BORDER_TEXT <= getTrendWordCount(getPostTextTag(post).innerText.toUpperCase())){
                block_type = 10;
                return true;
            }
        }

        if(0 < X_OPTION.TREND_WORD_BORDER_NAME){
            if(X_OPTION.TREND_WORD_BORDER_NAME <= getTrendWordCount(getPostAccountName(post).toUpperCase())){
                block_type = 11;
                return true;
            }
        }
        return false;
    }
    
    function PostBlock(post){
        if(postHiddenStop){
            return;
        }
        let post_parent = getPostParent(post, postClass_Hierarchy[1]);
        if(post_parent.style.visibility != "hidden"){
            hidden_posts.unshift([post.innerText, block_type, getPostUserName(post, false), getPostUrl(post), getPostAccountName(post), getPostTextTag(post).innerText]);
            post_parent.style.visibility = "hidden";
            post_parent.style.height = "0px";
            post_parent.setAttribute(DATA_XFILTER_HIDDEN, "true");
            postBlockViewNumber++;
            if(X_OPTION.BLOCK_COUNT_VIEW){
                BlockCount();
            }
        }
    }

    function PostBlockRelease() {
        let postList = getPostList();
        for(const post of postList){
            let post_parent = getPostParent(post, postClass_Hierarchy[1]);
            if(post_parent.getAttribute(DATA_XFILTER_HIDDEN) == "true"){
                post_parent.style.visibility = "visible";
                post_parent.style.height = "";
                post_parent.removeAttribute(DATA_XFILTER_HIDDEN);
            }
        }
        postBlockViewNumber = 0;
        if(X_OPTION.BLOCK_COUNT_VIEW){
            BlockCount();
        }
    }

    function PostBlockRestart() {
        hidden_posts = [];
    }

    function AddLinkClickListener(post){
        if(!X_OPTION.LINK_CLICK_URL_CHECK){
            return;
        }
        
        let links = post.getElementsByTagName("a");
        for(let i=0;i<links.length;i++){
            let link = links[i];
            if(link.href && link.href.startsWith("http") && !link.hasAttribute("data-link-check-added")){
                link.setAttribute("data-link-check-added", "true");
                link.addEventListener("click", function(event){
                    LinkClickCheck(this, event);
                }, false);
            }
        }
    }
    
    function HiraToKana(str){
        if(X_OPTION.HIRA_KATA_COV){
            return str.replace( /[\u3042-\u3093]/g, m => String.fromCharCode(m.charCodeAt(0) + 96));
        } else {
            return str;
        }
    };

    function ConvertUppercase(str){
        if(X_OPTION.CASE_CONV){
            return str.toUpperCase();
        } else {
            return str;
        }
    }
    
    function TagCount(post){
        let cnt = 0;
        let a = post.getElementsByTagName("a");
        for(let i=0;i<a.length;i++){
            if(a[i].href.includes("?src=hashtag_click")){
                cnt++;
            }
        }
        return cnt;
    }

    function HashtagStartLine(post){
        let cnt = 0;
        let a = getPostTextTag(post).innerText.split(/\n/);
        for(let i=0;i<a.length;i++){
            if(a[i].trim().startsWith("#")){
                cnt++;
            }
        }
        return cnt;
    }

    function SpaceCount(post){
        let cnt = 0;
        let a = getPostTextTag(post).innerText.split(/\n/);
        let r;
        for(let i=0;i<a.length;i++){
            r = a[i].trim().match(/[ ][ぁ-んァ-ヶー一-龯]/g);
            if(r != null){
                cnt += r.length;
            }
        }
        cnt = cnt == null ? 0 : cnt;
        return cnt;
    }
    
    function DefaultIcon(post){
        let a = getPostParent(post, postClass_Hierarchy[1]).getElementsByTagName("img");
        for(let i=0;i<a.length;i++){
            if(a[i].src.endsWith(X_OPTION.DEFAULT_ICON_NAME)){
                return true;
            }
        }
    }
    
    function FilterActiveCheck(){
        let url = getLUrl().replace("https://", "");
        for(let i=0;i<X_OPTION.TARGET_URL.length;i++){
            if(url.match(X_OPTION.TARGET_URL[i])){ return true; }
        }
        return false;
    }

    function getTrend(){
        let trend = new Array();
        let doc = document.getElementsByTagName("div");
        for(let i=0;i<doc.length;i++){
            if(doc[i].dataset.testid == "trend"){
                try{
                    if(doc[i].children[0].children[1].innerText.trim() != ""){
                        trend.push(doc[i].children[0].children[1].innerText.replace("#", "").toUpperCase());
                    }
                } catch(e){;}
            }
        }
        return trend;
    }

    function isTrendPageLoadingEnd(){
        let doc = document.getElementsByTagName("div");
        for(let i=0;i<doc.length;i++){
            if(doc[i].dataset.testid == "trend"){
                return true;
            }
        }
        return false;
    }

    function isTrendPage(){
        return location.href == TREND_URL;
    }

    function isVideoCard(card) {
        try {
            if (card == null) { return null; }
            if (card.dataset == null) { return null; }
            if (card.dataset.xsfSeenAt == void 0) {
                card.dataset.xsfSeenAt = String(Date.now());
                return null;
            }
            if ((Date.now() - Number(card.dataset.xsfSeenAt)) < 800) {
                return null;
            }
            const container = card.closest('article') || (card.parentElement && card.parentElement.parentElement) || card;
            if (!container) { return null; }
            if (container.querySelector('[data-testid="videoComponent"]')) {
                return true;
            }
            if (container.querySelector('video')) {
                return true;
            }
            return false;
        } catch(e) {
            return null;
        }
    }

    function SaveTrend(trend){
        if(trend.length == 0){ return; }
        browser.storage.local.set({"XFILTER_OPTION_TREND_SAVE": JSON.stringify(trend)});
        browser.storage.local.set({"XFILTER_OPTION_TREND_SAVE_DATETIME": new Date().getTime()});
        trend_word_list = trend;
        trend_save_datetime = new Date().getTime();
        trend_save_flag = true;
    }
    
    function BlockCount(){
        if(!X_OPTION.BLOCK_COUNT_VIEW){
            if(document.getElementById("x9uVvQH") != null){
                HiddenPostList_Cls();
            }
            return;
        }
        if(document.getElementById("x9uVvQH") == null){
            let addtag = document.createElement("div");
            addtag.id = "x9uVvQH";
            addtag.style.position = "fixed";
            addtag.style.top = "0.5em";
            addtag.style.left = "0.5em";
            document.body.appendChild(addtag);
            
            let buttonDiv = document.createElement("div");
            buttonDiv.id = "x9uVvQH_ar";
            buttonDiv.style.border = "solid 1px #cdcdcd";
            buttonDiv.style.backgroundColor = "#1DA1F2";
            buttonDiv.style.color = "#FFF";
            buttonDiv.style.cursor = "pointer";
            buttonDiv.style.padding = "0.3em 1em";
            buttonDiv.style.fontSize = "small";
            buttonDiv.style.borderRadius = "10px";
            buttonDiv.style.userSelect = "none";
            
            let iconSpan = document.createElement("span");
            iconSpan.id = "YgE1WQLD";
            
            let numSpan = document.createElement("span");
            numSpan.id = "x9uVvQH_num";
            numSpan.style.textAlign = "center";
            numSpan.style.marginRight = "0.2em";
            numSpan.style.marginLeft = "0.1em";
            numSpan.style.userSelect = "none";
            
            buttonDiv.appendChild(iconSpan);
            buttonDiv.appendChild(numSpan);
            addtag.appendChild(buttonDiv);
            
            document.getElementById("x9uVvQH_ar").addEventListener("click", HiddenPostList, false);
            CountBtn_MoveAction();
        }
        if((0 < X_OPTION.TREND_WORD_BORDER_NAME || 0 < X_OPTION.TREND_WORD_BORDER_TEXT) && trend_data_enable){
            document.getElementById("YgE1WQLD").innerText = "💾";
        } else {
            document.getElementById("YgE1WQLD").innerText = "";
        }
        document.getElementById("x9uVvQH_ar").style.display = "block";
        if(postHiddenStop) {
            document.getElementById("x9uVvQH_num").innerText = "⏸";
        } else {
            document.getElementById("x9uVvQH_num").innerText = postBlockViewNumber;
        }
    }

    function CountBtn_MouseDown(e) {
        CountBtnMoveStartTime = new Date();
        this.classList.add("drag");
        if(e.type === "mousedown") {
            var event = e;
        } else {
            var event = e.changedTouches[0];
        }
        var rect = this.getBoundingClientRect();
        cnt_x = event.clientX - rect.left;
        cnt_y = event.clientY - rect.top;
        document.body.addEventListener("mousemove", CountBtn_MouseMove, false);
        document.body.addEventListener("touchmove", CountBtn_MouseMove, false);
    }

    function CountBtn_MouseMove(e) {
        var drag = document.getElementsByClassName("drag")[0];
        if(e.type === "mousemove") {
            var event = e;
        } else {
            var event = e.changedTouches[0];
        }

        var newLeft = event.clientX - cnt_x;
        var newTop = event.clientY - cnt_y;
        
        var rect = drag.getBoundingClientRect();
        var maxLeft = window.innerWidth - rect.width;
        var maxTop = window.innerHeight - rect.height;
        
        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        newTop = Math.max(0, Math.min(newTop, maxTop));
        
        drag.style.left = newLeft + "px";
        drag.style.top = newTop + "px";

        drag.addEventListener("mouseup", CountBtn_MoveEnd, false);
        document.body.addEventListener("mouseleave", CountBtn_MoveEnd, false);
        drag.addEventListener("touchend", CountBtn_MoveEnd, false);
        document.body.addEventListener("touchleave", CountBtn_MoveEnd, false);
    }

    function CountBtn_MoveEnd(e) {
        var drag = document.getElementsByClassName("drag")[0];
        try {
            document.body.removeEventListener("mousemove", CountBtn_MouseMove, false);
            drag.removeEventListener("mouseup", CountBtn_MoveEnd, false);
            document.body.removeEventListener("touchmove", CountBtn_MouseMove, false);
            drag.removeEventListener("touchend", CountBtn_MoveEnd, false);
            drag.classList.remove("drag");
        } catch(err){;}
    }

    let CountBtnMoveStartTime;
    function CountBtn_MoveAction(e){
        var elements = document.getElementById("x9uVvQH");
        elements.addEventListener("mousedown", CountBtn_MouseDown, false);
        elements.addEventListener("touchstart", CountBtn_MouseDown, false);
    }

    function HiddenPostList(){
        CountBtn_MoveEnd();
        if(200 < new Date().getTime() - CountBtnMoveStartTime.getTime()){ return; }
        if(document.getElementById("x9uVvQH_lst_base") == null){
            let addtag = document.createElement("div");
            addtag.id = "x9uVvQH_lst_base";
            addtag.style.position = "fixed";
            addtag.style.width = "100%";
            addtag.style.height = "100%";
            addtag.style.top = "0";
            addtag.style.left = "0";
            addtag.style.backgroundColor = "rgba(0,0,0,0.4)";
            addtag.style.backdropFilter = "blur(2px)";
            addtag.style.zIndex = "9999";
            
            let lstArea = document.createElement("div");
            lstArea.id = "x9uVvQH_lst_area";
            lstArea.style.backgroundColor = "rgba(207, 207, 207, 0.9)";
            lstArea.style.position = "fixed";
            lstArea.style.height = "90%";
            lstArea.style.width = "95%";
            lstArea.style.top = "5%";
            lstArea.style.left = "50%";
            lstArea.style.transform = "translateX(-50%)";
            lstArea.style.borderRadius = "12px";
            lstArea.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)";
            lstArea.style.overflow = "hidden";
            
            let lstDiv = document.createElement("div");
            lstDiv.id = "x9uVvQH_lst";
            lstDiv.style.position = "absolute";
            lstDiv.style.top = "2.5rem";
            lstDiv.style.left = "0";
            lstDiv.style.height = "calc(100% - 5.5rem)";
            lstDiv.style.overflowY = "auto";
            lstDiv.style.width = "100%";
            lstDiv.style.padding = "1rem";
            lstDiv.style.boxSizing = "border-box";
            
            let toggleBtn = document.createElement("div");
            toggleBtn.id = "x9uVvQH_toggle";
            toggleBtn.textContent = postHiddenStop ? "一時停止中⏸" : "実行中▶";
            toggleBtn.style.position = "absolute";
            toggleBtn.style.top = "0";
            toggleBtn.style.left = "0";
            toggleBtn.style.height = "2.5rem";
            toggleBtn.style.lineHeight = "2.5rem";
            toggleBtn.style.padding = "0 1rem";
            toggleBtn.style.backgroundColor = postHiddenStop ? "#ff9800" : "#4CAF50";
            toggleBtn.style.color = "#fff";
            toggleBtn.style.fontWeight = "bold";
            toggleBtn.style.cursor = "pointer";
            toggleBtn.style.transition = "background-color 0.2s";
            toggleBtn.style.borderRadius = "8px 0 0 0";
            toggleBtn.style.zIndex = "10000";
            toggleBtn.onmouseover = function(){
                this.style.opacity = "0.8";
            };
            toggleBtn.onmouseout = function(){
                this.style.opacity = "1";
            };
            toggleBtn.addEventListener("click", function(e){
                e.stopPropagation();
                if(postHiddenStop){
                    PostBlockRestart();
                    postHiddenStop = false;
                    toggleBtn.textContent = "実行中▶";
                    toggleBtn.style.backgroundColor = "#4CAF50";
                } else {
                    PostBlockRelease();
                    postHiddenStop = true;
                    toggleBtn.textContent = "一時停止中⏸";
                    toggleBtn.style.backgroundColor = "#ff9800";
                }
            }, false);
            lstArea.appendChild(toggleBtn);
            
            let closeBtn = document.createElement("div");
            closeBtn.id = "x9uVvQH_cls";
            closeBtn.textContent = "閉じる";
            closeBtn.style.position = "absolute";
            closeBtn.style.bottom = "0";
            closeBtn.style.height = "3rem";
            closeBtn.style.lineHeight = "3rem";
            closeBtn.style.width = "100%";
            closeBtn.style.textAlign = "center";
            closeBtn.style.fontWeight = "bold";
            closeBtn.style.fontSize = "1.1rem";
            closeBtn.style.background = "linear-gradient(135deg, #4562e6ff 0%, #9c77c0ff 100%)";
            closeBtn.style.color = "#fff";
            closeBtn.style.borderTop = "none";
            closeBtn.style.cursor = "pointer";
            closeBtn.style.transition = "opacity 0.2s";
            closeBtn.onmouseover = function(){ this.style.opacity = "0.9"; };
            closeBtn.onmouseout = function(){ this.style.opacity = "1"; };
            
            lstArea.appendChild(lstDiv);
            lstArea.appendChild(closeBtn);
            addtag.appendChild(lstArea);
            
            document.body.appendChild(addtag);
            document.getElementById("x9uVvQH_cls").addEventListener("click", HiddenPostList_Cls, false);
            document.getElementById("x9uVvQH_lst_base").addEventListener("click", HiddenPostList_Cls, false);
            document.getElementById("x9uVvQH_lst").addEventListener("click", function(e){e.stopPropagation();}, false);
        } else {
            document.getElementById("x9uVvQH_lst_base").style.display = "block";
        }
        
        let listFragment = document.createDocumentFragment();
        
        let titleDiv = document.createElement('div');
        titleDiv.textContent = '【非表示にしたポスト】';
        titleDiv.style.textAlign = 'center';
        titleDiv.style.fontSize = 'large';
        titleDiv.style.color = '#000';
        titleDiv.style.marginTop = '10px';
        listFragment.appendChild(titleDiv);
        
        let mainDiv = document.createElement('div');
        mainDiv.style.color = '#000';
        listFragment.appendChild(mainDiv);

        if(0 < X_OPTION.TAG_BORDER || X_OPTION.DEFAULT_ICON_BLOCK || 0 < X_OPTION.SPACE_BORDER){
            let hr1 = document.createElement('hr');
            mainDiv.appendChild(hr1);
            
            let optionTitle = document.createElement('p');
            optionTitle.textContent = '※以下のオプションが設定されています';
            mainDiv.appendChild(optionTitle);
            
            let ul = document.createElement('ul');
            
            if(0 < X_OPTION.TAG_BORDER){
                let li = document.createElement('li');
                li.textContent = 'ハッシュタグが' + X_OPTION.TAG_BORDER + '以上あるポストを非表示';
                ul.appendChild(li);
            }
            if(0 < X_OPTION.TAG_START_BORDER){
                let li = document.createElement('li');
                li.textContent = 'ハッシュタグから始まる行が' + X_OPTION.TAG_START_BORDER + '行以上あるポストを非表示';
                ul.appendChild(li);
            }
            if(0 < X_OPTION.ACCOUNTNAME_SPACE_BORDER){
                let li = document.createElement('li');
                li.textContent = 'ひらがなカタカナ漢字の直前にスペースが' + X_OPTION.ACCOUNTNAME_SPACE_BORDER + '以上あるアカウント名のポストを非表示';
                ul.appendChild(li);
            }
            if(X_OPTION.DEFAULT_ICON_BLOCK){
                let li = document.createElement('li');
                li.textContent = 'プロフィールアイコン未設定アカウントからのポストを非表示';
                ul.appendChild(li);
            }
            if(0 < X_OPTION.SPACE_BORDER){
                let li = document.createElement('li');
                li.textContent = 'ひらがなカタカナ漢字の直前にスペースが' + X_OPTION.SPACE_BORDER + '以上あるポストを非表示';
                ul.appendChild(li);
            }
            if(X_OPTION.VERIFIED_HDN){
                let li = document.createElement('li');
                li.textContent = '認証済みアカウントのポストを非表示';
                ul.appendChild(li);
            }
            if(X_OPTION.SEARCH_HIT_USERNAME_BLOCK){
                let li = document.createElement('li');
                li.textContent = '検索ワードがアカウント名にしか存在しないポストを非表示';
                ul.appendChild(li);
            }
            
            mainDiv.appendChild(ul);
        }
        
        let hr2 = document.createElement('hr');
        mainDiv.appendChild(hr2);
        
        let postsContainer = document.createElement('div');
        postsContainer.style.margin = '0 0.2rem';
        
        for(let i=0;i<hidden_posts.length;i++){
            if(hidden_posts[i] != null || hidden_posts[i] != void 0){
                let btn = document.createElement('button');
                btn.id = 'hl_' + i;
                btn.setAttribute('data-huserid', hidden_posts[i][2]);
                btn.textContent = 'Safe';
                btn.style.marginRight = '0.4em';
                btn.style.padding = '0em 0.4em';
                btn.style.border = 'none';
                btn.style.borderRadius = '4px';
                btn.style.cursor = 'pointer';
                btn.style.fontWeight = 'bold';
                btn.style.fontSize = '0.8em';
                
                if(!(safe_user_list != void 0 && safe_user_list.includes(hidden_posts[i][2].replace("@", "")))){
                    btn.style.backgroundColor = '#4CAF50';
                    btn.style.color = '#fff';
                } else {
                    btn.style.backgroundColor = '#cccccc';
                    btn.style.color = '#666';
                    btn.disabled = true;
                    btn.style.cursor = 'not-allowed';
                }
                postsContainer.appendChild(btn);
                
                if(hidden_posts[i][3] != null){
                    let bracket1 = document.createElement('span');
                    bracket1.textContent = '[ ';
                    postsContainer.appendChild(bracket1);
                    
                    let link = document.createElement('a');
                    link.href = hidden_posts[i][3];
                    link.target = '_blank';
                    link.textContent = '表示';
                    link.style.color = 'blue';
                    link.style.textDecoration = 'underline';
                    postsContainer.appendChild(link);
                    
                    let bracket2 = document.createElement('span');
                    bracket2.textContent = ' ]';
                    postsContainer.appendChild(bracket2);
                }
                
                let contentSpan = document.createElement('span');
                if(X_OPTION.POST_CHECK_ALL) {
                    contentSpan.textContent = hidden_posts[i][0];
                } else {
                    contentSpan.textContent = '【' + hidden_posts[i][4] + ' (' + hidden_posts[i][2] + ')' + '】' + hidden_posts[i][5];
                }
                postsContainer.appendChild(contentSpan);
                
                let reasonSpan = document.createElement('span');
                reasonSpan.textContent = '（非表示理由：' + BLOCK_TYPE_TEXT[hidden_posts[i][1]] + '）';
                reasonSpan.style.fontWeight = 'bold';
                postsContainer.appendChild(reasonSpan);
                
                let hr = document.createElement('hr');
                postsContainer.appendChild(hr);
            }
        }
        
        mainDiv.appendChild(postsContainer);
        document.getElementById("x9uVvQH_lst").innerHTML = '';
        document.getElementById("x9uVvQH_lst").appendChild(listFragment);
        document.getElementById("x9uVvQH_ar").style.display = "none";
        for(let i=0;i<hidden_posts.length;i++){
            if(hidden_posts[i] != null || hidden_posts[i] != void 0){
                if(document.getElementById("hl_" + i) && document.getElementById("hl_" + i).dataset.huserid != void 0){
                    document.getElementById("hl_" + i).addEventListener("click", AddSafe, false);
                }
            }
        }
    }

    function AddSafe(ev){
        let idName = ev.target.dataset.huserid;
        if(confirm("ID「" + idName + "」をセーフリストに追加しますか？（設定の「セーフユーザー」に追加されます）")){
            SafeListLoad(function(){
                safe_user_list.push(idName.replace("@", ""));
                SafeListSave(function(){
                    alert("セーフリストに追加しました。");
                });
                ev.target.disabled = true;
                HiddenPostList();
            });
        }
    }

    function HiddenPostList_Cls(e){
        if(document.getElementById("x9uVvQH_lst_base") != null){
            document.getElementById("x9uVvQH_lst_base").style.display = "none";
            document.getElementById("x9uVvQH_ar").style.display = "block";
        }
    }
    
    function getPostParent(post, h){
        let r = post;
        for(let i=0;i<h;i++){
            r = r.parentElement;
        }
        return r;
    }

    function getPostTextTag(post){
        let r = post.getElementsByTagName("div");
        for(let i=0;i<r.length;i++){
            if(r[i].dataset.testid == TWEET_TEXT){
                return r[i];
            }
        }
        return document.createElement("div");
    }

    function getTrendWordCount(text){
        let cnt = 0;
        for(const item of trend_word_list){
            if(text.includes(item)){
                cnt++;
            }
        }
        return cnt;
    }
    
    function getLUrl(){
        let url = location.href;
        if(X_OPTION.URL_XT_CONVERT){
            url = url.replace('x.com', 'twitter.com');
        }
        return url;
    }

    function isVerified(post){
        let a = getPostParent(post, postClass_Hierarchy[1]).getElementsByTagName("svg");
        let t;
        for(let i=0;i<a.length;i++){
            if(a[i].dataset.testid == "icon-verified"){
                t = a[i];
                while(t != null && t != void 0 && t.role != "article"){
                    if(t.role == "link" &&  t.tagName.toLowerCase() == "div"){
                        return false;
                    }
                    t = t.parentElement;
                }
                if(getComputedStyle(a[i]).color != "rgb(29, 155, 240)"){
                    return false;
                }
                return true;
            }
        }
        return false;
    }

    function isDialog(post){
        let a = post.parentElement;
        while(a != null && a != void 0){
            if(a.role == "dialog"){
                return true;
            }
            a = a.parentElement;
        }
        return false;
    }

    function getUrlUserName(){
        let url = getLUrl().split("/");
        let res = "";
        for(let i=0;i<url.length;i++){
            if(url[i] == "status"){
                res = url[i-1];
                break;
            }
        }
        return res;
    }

    function getPostUserName(post, dltAt){
        let a = getPostParent(post, postClass_Hierarchy[1]).getElementsByTagName("a");
        for(let i=0;i<a.length;i++){
            if(a[i].href.split("/")[a[i].href.split("/").length-1].replace("/", "").trim() == a[i].innerText.replace("@", "")){
                if(dltAt){
                    return a[i].innerText.replace("@", "");
                } else {
                    return a[i].innerText;
                }
                
            }
        }
        return "";
    }

    function getPostUrl(post){
        let a = post.getElementsByTagName("a");
        for(let i=0;i<a.length;i++){
            if(0 < a[i].getElementsByTagName("time").length){
                return a[i].href;
            }
        }
        return null;
    }

    function AccountSpaceCount(post){
        let name = getPostAccountName(post);
        return (name.trim().match(/[ \u3000][ぁ-んァ-ヶー一-龯]/g) || []).length;
    }

    function getPostAccountName(post){
        let a = post.getElementsByTagName("a");
        let postId = getPostUserName(post, true);
        for(let i=0;i<a.length;i++){
            if(a[i].role == "link" && a[i].href.endsWith(postId) && a[i].innerText.trim() != ""){
                return a[i].innerText;
            }
        }
        return "";
    }

    function getSearchWordList(){
        if(document.getElementById("typeaheadDropdown-3") != null){ return [];}
        let input_lst = document.getElementsByTagName("input");
        let wordLst;
        let res = [];
        for(const item of input_lst){
            if(item.enterKeyHint == "search" && item.dataset.testid == "SearchBox_Search_Input"){
                wordLst = item.value.replaceAll("　", " ").split(" ");
                break;
            }
        }
        if(0 < wordLst.length){
            for(const item of wordLst){
                if(item.trim() != "" && /.+:.+/.test(item) == false){
                    res.push(item);
                }
            }
        }
        return res;
    }
    function isSearchPage(){
        let url = getLUrl().replace("https://", "");
        if(url.match("twitter.com/search")){ return true; }
        return false;
    }

    function FollowingTabClick(retryCount = 0) {
        if(followingTabClick) { return; }
        let tabList, tabs;
        try {
            tabList = document.querySelector('[role="tablist"]');
            if (!tabList) {
                if (retryCount < 10) {
                    retryCount++;
                    setTimeout(function() { FollowingTabClick(retryCount); }, 100);
                } else {
                    return false;
                }
            }
            tabs = tabList.querySelectorAll('[role="tab"]');
            const followingTab = tabs[1];
            if (!followingTab) {
                if (retryCount < 10) {
                    retryCount++;
                    setTimeout(function() { FollowingTabClick(retryCount); }, 100);
                } else {
                    return false;
                }
            }
            followingTab.click();
            followingTabClick = true;
        } catch (e) {
            if (retryCount < 10) {
                retryCount++;
                setTimeout(function() { FollowingTabClick(retryCount); }, 100);
            } else {
                return false;
            }
        }
    }
    
    function FollowTabCheck() {
        if(X_OPTION.DEFAULT_SELECTED_FOLLOW_TAB && location.href.startsWith("https://x.com/home")) {
            setTimeout(FollowingTabClick, 100);
        }
    }

    function showCustomConfirmDialog(displayText, resultUrl, callback){
        let existingDialog = document.getElementById('ndRmlbG_cd');
        if(existingDialog){
            existingDialog.remove();
        }

        let dialogOverlay = document.createElement('div');
        dialogOverlay.id = 'ndRmlbG_cd';
        dialogOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.35);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
        `;

        let dialogBox = document.createElement('div');
        dialogBox.style.cssText = `
            background: #fffaf3;
            border: 2px solid #f6c97f;
            border-radius: 16px;
            box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28);
            max-width: 500px;
            width: 90%;
            padding: 24px;
            max-height: 80vh;
            overflow-y: auto;
        `;

        let titleEl = document.createElement('h2');
        titleEl.textContent = '【X検索ミュートツール】';
        titleEl.style.cssText = `
            margin: 0 0 16px 0;
            font-size: 18px;
            font-weight: 600;
            color: #0f1419;
        `;

        let messageEl = document.createElement('p');
        messageEl.textContent = '注意: 表示されているURLと移動先が異なります。';
        messageEl.style.cssText = `
            margin: 0 0 16px 0;
            font-size: 14px;
            color: #b45309;
            line-height: 1.5;
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        messageEl.prepend('⚠️');

        let urlInfoEl = document.createElement('div');
        urlInfoEl.style.cssText = `
            background: #f7f9fa;
            border-radius: 12px;
            padding: 12px;
            margin: 0 0 16px 0;
            font-size: 13px;
            color: #0f1419;
        `;

        let displayUrlEl = document.createElement('div');
        displayUrlEl.style.cssText = 'margin-bottom: 8px;';
        let displayTitle = document.createElement('strong');
        displayTitle.textContent = '表示URL:';
        let displayBr = document.createElement('br');
        let displaySpan = document.createElement('span');
        displaySpan.style.cssText = 'word-break: break-all; color: #9a3412; padding: 6px 8px; border-radius: 8px; display: inline-block; font-weight: 600;';
        displaySpan.textContent = displayText;
        displayUrlEl.appendChild(displayTitle);
        displayUrlEl.appendChild(displayBr);
        displayUrlEl.appendChild(displaySpan);

        let resultUrlEl = document.createElement('div');
        let resultTitle = document.createElement('strong');
        resultTitle.textContent = '移動先:';
        let resultBr = document.createElement('br');
        let resultSpan = document.createElement('span');
        resultSpan.style.cssText = 'word-break: break-all; color: #9a3412; padding: 6px 8px; border-radius: 8px; display: inline-block; font-weight: 600;';
        resultSpan.textContent = resultUrl;
        resultUrlEl.appendChild(resultTitle);
        resultUrlEl.appendChild(resultBr);
        resultUrlEl.appendChild(resultSpan);

        urlInfoEl.appendChild(displayUrlEl);
        urlInfoEl.appendChild(resultUrlEl);

        // セーフリストチェックボックス
        let checkboxContainer = document.createElement('label');
        checkboxContainer.style.cssText = `
            display: flex;
            align-items: center;
            margin: 0 0 20px 0;
            cursor: pointer;
            font-size: 13px;
            color: #1b2025ff;
        `;

        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.style.cssText = `
            margin-right: 8px;
            cursor: pointer;
            width: 16px;
            height: 16px;
        `;

        let checkboxLabel = document.createElement('span');
        let labelText = document.createElement('span');
        labelText.textContent = '【' + getDomain(resultUrl) + '】では今後ダイアログを表示しない';
        let labelBr = document.createElement('br');
        let labelSubText = document.createElement('span');
        labelSubText.textContent = '（設定のセーフリストに追加）';
        checkboxLabel.appendChild(labelText);
        checkboxLabel.appendChild(labelBr);
        checkboxLabel.appendChild(labelSubText);

        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(checkboxLabel);

        // ボタンコンテナ
        let buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        `;

        // キャンセルボタン
        let cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'キャンセル';
        cancelBtn.style.cssText = `
            padding: 10px 20px;
            border: 1px solid #cfd9de;
            background: white;
            color: #0f1419;
            border-radius: 9999px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s;
        `;
        cancelBtn.onmouseover = function(){
            this.style.background = '#f7f9fa';
        };
        cancelBtn.onmouseout = function(){
            this.style.background = 'white';
        };
        cancelBtn.onclick = function(){
            dialogOverlay.remove();
            callback(false, false);
        };

        // 移動ボタン
        let confirmBtn = document.createElement('button');
        confirmBtn.textContent = '移動する';
        confirmBtn.style.cssText = `
            padding: 10px 20px;
            border: none;
            background: #1d9bf0;
            color: white;
            border-radius: 9999px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
        `;
        confirmBtn.onmouseover = function(){
            this.style.background = '#1a8cd8';
        };
        confirmBtn.onmouseout = function(){
            this.style.background = '#1d9bf0';
        };
        confirmBtn.onclick = function(){
            dialogOverlay.remove();
            callback(true, checkbox.checked);
        };

        buttonContainer.appendChild(cancelBtn);
        buttonContainer.appendChild(confirmBtn);

        // ダイアログの構成
        dialogBox.appendChild(titleEl);
        dialogBox.appendChild(messageEl);
        dialogBox.appendChild(urlInfoEl);
        dialogBox.appendChild(checkboxContainer);
        dialogBox.appendChild(buttonContainer);

        // オーバーレイに追加
        dialogOverlay.appendChild(dialogBox);

        // ページに追加
        document.body.appendChild(dialogOverlay);

        // Escキーでキャンセル
        let escapeHandler = function(e){
            if(e.key === 'Escape'){
                document.removeEventListener('keydown', escapeHandler);
                dialogOverlay.remove();
                callback(false, false);
            }
        };
        document.addEventListener('keydown', escapeHandler);

        // オーバーレイクリックでキャンセル
        dialogOverlay.addEventListener('click', function(e){
            if(e.target === dialogOverlay){
                document.removeEventListener('keydown', escapeHandler);
                dialogOverlay.remove();
                callback(false, false);
            }
        });
    }

    function escapeHtml(text){
        if(!text){ return ""; }
        let map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m){
            return map[m];
        });
    }

    function addDomainToSafelist(domain){
        if(X_OPTION.LINK_CARD_URL_SAFE){
            if(!X_OPTION.LINK_CARD_URL_SAFE.includes(domain)){
                X_OPTION.LINK_CARD_URL_SAFE.push(domain);
                browser.storage.local.set({"XFILTER_OPTION": JSON.stringify(X_OPTION)});
            }
        }
    }

    TwitterSearchBlockMain();
