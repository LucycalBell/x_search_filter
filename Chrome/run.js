
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
        7:"インポートスパムリスト一致",
        8:"アカウント名スペース数超過",
        9:"ユーザー名のみ一致"
    };
    const CLASS_LINK_ICON = "gX5c7aMKHJte";
    const CLASS_LINK_TEXT = "38vLw0IMLBxf";
    
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
    
    function TwitterSearchBlockMain(){
        OptionLoad_run();
    }

    function SafeListLoad(cb){
        chrome.storage.local.get(["XFILTER_OPTION_SAFE_USER"]).then((result) => {
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
        chrome.storage.local.set({"XFILTER_OPTION_SAFE_USER": JSON.stringify(saveList)}, function() {
            if(cb != null){
                cb();
            }
        });
    }

    function checkEmpty(el) {
        return el !== undefined && el !== 0 && el !== null && el.trim() != "";
      }

    function OptionLoad_run(){
        SafeListLoad();
        chrome.storage.local.get(["XFILTER_OPTION"]).then((result) => {
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
            X_OPTION.LINK_CARD_URL_VIEW = getOptionPram(r.LINK_CARD_URL_VIEW, true, TYPE_BOOL);
            X_OPTION.LINK_CARD_URL_VIEW_ONELINE = getOptionPram(r.LINK_CARD_URL_VIEW_ONELINE, true, TYPE_BOOL);
            X_OPTION.LINK_CARD_MISMATCH_WARNING = getOptionPram(r.LINK_CARD_MISMATCH_WARNING, true, TYPE_BOOL);
            X_OPTION.LINK_CARD_URL_SAFE = getOptionPram(r.LINK_CARD_URL_SAFE, [], TYPE_ARRAY).filter(item => item !== "");
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

            chrome.storage.local.get(["XFILTER_ON_CLASS"]).then((result) => {
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

        if(view_url != location.href){
            postBlockViewNumber = 0;
            hidden_posts = [];
            BlockCount();
        }

        if(postClass_Hierarchy == null || postClass_Hierarchy == void 0){
            postClass_Hierarchy = getPostClass();
        }
        if(postClass_Hierarchy == void 0){
            setTimeout(MainLoopX, X_OPTION.INTERVAL_TIME);
            return;
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

        if((activeUrl && X_OPTION.LINK_EMPHASIS) || X_OPTION.LINK_EMPHASIS_ALL){
            CardLinkEmphasis();
        }

        for(let i=0;i<postList.length;i++){
            if(activeUrl && PostBlockCheck(postList[i])){
                PostBlock(postList[i]);
            }
        }
        setTimeout(MainLoopX, X_OPTION.INTERVAL_TIME);
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
            if(cardList[i][0].getElementsByClassName("XGarIO3t").length == 0){
                let createNode = document.createElement("div");
                createNode.innerHTML = "<span style='font-size:2rem;width:3rem;text-align:center;' class='" + CLASS_LINK_ICON + "'>🔗</span>" + "<span class='" + CLASS_LINK_TEXT + "' style='position:absolute;top:50%;transform:translateY(-50%);left:3rem;padding:0 0.2rem 0.2rem 0.2rem;font-size:0.85rem;font-weight:bold;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;color:#000;'>" + labeltxt + "</span>";
                createNode.setAttribute("class", "XGarIO3t")
                createNode.setAttribute("style", "background-color:rgba(245,245,245,0.9);position:absolute;height:3rem;width:100%;top:0;left:0;text-align:left;display:flex;pointer-events:none;");
                cardList[i][0].appendChild(createNode);
                if(X_OPTION.LINK_CARD_URL_VIEW){
                    UrlDomainCheck(cardList[i]);
                }
                break;
            }
        }
    }

    function getCardDomain(card){
        let aList = card.parentElement.parentElement.getElementsByTagName("a");
        for(const item of aList){
            if(item.ariaLabel == void 0 && item.href.startsWith("https://t.co/")){
                return item;
            }
        }
    }

    function UrlDomainCheck(cardData){
        chrome.runtime.sendMessage({
            type:"getUrl_tco",
            url: cardData[2]
        },
        function (response) {
            resultUrl = refreshUrl(response.htmlStr);
            if(resultUrl == null){ return; }
            let link_icon = cardData[0].getElementsByClassName(CLASS_LINK_ICON);
            let link_text = cardData[0].getElementsByClassName(CLASS_LINK_TEXT);
            let linka_a = getCardDomain(cardData[0]);
            cardLink_id_count++;
            if(X_OPTION.LINK_CARD_MISMATCH_WARNING && !X_OPTION.LINK_CARD_URL_SAFE.includes(getDomain(resultUrl)) && getDomain(resultUrl) != getDomain(cardData[1])){
                linka_a.innerHTML += "<span style='color:red;font-weight:bold;'" + "id='cHXCcZlv_" + cardLink_id_count + "' data-cardLinkUrl='" + resultUrl + "'>（URL：" + resultUrl + ")</span>";
                if(0 < link_icon.length){
                    link_icon[0].innerText = "⚠";
                    link_icon[0].style.backgroundColor = "#eeff00";
                }
                if(0 < link_text.length){
                    link_icon[0].style.color = "red";
                }
            } else {
                linka_a.innerHTML += "<span id='cHXCcZlv_" + cardLink_id_count + "' data-cardLinkUrl='" + resultUrl + "'>（URL：" + resultUrl + ")</span>";
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
        return url.match(/^(?:https?:\/\/)?(?:www.)?([^/]+)/i)[1];
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
                        if((getSearchWordList().some(item => getPostAccountName(post).toUpperCase().includes(item.toUpperCase())))){
                            block_type = 9;
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }
    
    function PostBlock(post){
        let post_parent = getPostParent(post, postClass_Hierarchy[1]);
        if(post_parent.style.visibility != "hidden"){
            hidden_posts.unshift([post.innerText, block_type, getPostUserName(post, false), getPostUrl(post)]);
            post_parent.style.visibility = "hidden";
            post_parent.style.height = "0px";
            postBlockViewNumber++;
            if(X_OPTION.BLOCK_COUNT_VIEW){
                BlockCount();
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
            document.getElementById("x9uVvQH").insertAdjacentHTML("afterbegin", "<div style='border:solid 1px #cdcdcd;background-color:#1DA1F2;color:#FFF;cursor:pointer;padding:0.3em;font-size:small;border-radius:15px;border:1px solid #1DA1F2; user-select: none;' id='x9uVvQH_ar'><span id='x9uVvQH_num' style='text-align:center;margin-right:0.2em;user-select: none;'></span>posts</div>");
            document.getElementById("x9uVvQH_ar").addEventListener("click", HiddenPostList, false);
            CountBtn_MoveAction();
        }
        document.getElementById("x9uVvQH_ar").style.display = "block";
        document.getElementById("x9uVvQH_num").innerText = postBlockViewNumber;
    }

    function CountBtn_MouseDown(e) {
        console.log(e);
        CountBtnMoveStartTime = new Date();
        this.classList.add("drag");
        if(e.type === "mousedown") {
            var event = e;
        } else {
            var event = e.changedTouches[0];
        }
        cnt_x = event.pageX - this.offsetLeft;
        cnt_y = event.pageY - this.offsetTop;
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
        e.preventDefault();

        drag.style.top = event.pageY - cnt_y + "px";
        drag.style.left = event.pageX - cnt_x + "px";

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
            addtag.setAttribute("style", "position:fixed;width:100%;height:100%;top:0;left:0;background-color:rgba(255,255,255,0.5);");
            addtag.innerHTML = "<div style='background-color:rgba(205,205,205,0.95);position:fixed;height:90%;width:90%;top:5%;left:5%;border:solid 2px #000;' id='x9uVvQH_lst_area'><div id='x9uVvQH_lst' style='position:absolute;top:0;left:0;height:calc(100% - 3rem);overflow-y: scroll;width:100%;'></div><div style='position:absolute;bottom:0;height:3rem;line-height:3rem;width:100%;text-align:center;font-weight:bold;font-size:1.3rem;background-color:#f5bd4d;color:#fff;border-top:solid 1px #000;' id='x9uVvQH_cls'>閉じる</div></div>";
            document.body.appendChild(addtag);
            document.getElementById("x9uVvQH_cls").addEventListener("click", HiddenPostList_Cls, false);
            document.getElementById("x9uVvQH_lst_base").addEventListener("click", HiddenPostList_Cls, false);
            document.getElementById("x9uVvQH_lst").addEventListener("click", function(e){e.stopPropagation();}, false);
        } else {
            document.getElementById("x9uVvQH_lst_base").style.display = "block";
        }

        let addtxt = "";
        addtxt += "<div style='text-align:center;font-size:large;color:#000;margin-top:10px;'>【非表示にしたポスト】</div><div style='color:#000;'>";

        if(0 < X_OPTION.TAG_BORDER || X_OPTION.DEFAULT_ICON_BLOCK || 0 < X_OPTION.SPACE_BORDER){
            addtxt += "<hr><p>※以下のオプションが設定されています</p>";
            addtxt += "<ul>";
        
            if(0 < X_OPTION.TAG_BORDER){
                addtxt += "<li>ハッシュタグが" + X_OPTION.TAG_BORDER + "以上あるポストを非表示</li>";
            }
            if(0 < X_OPTION.TAG_START_BORDER){
                addtxt += "<li>ハッシュタグから始まる行が" + X_OPTION.TAG_START_BORDER + "行以上あるポストを非表示</li>";
            }
            if(0 < X_OPTION.ACCOUNTNAME_SPACE_BORDER){
                addtxt += "<li>ひらがなカタカナ漢字の直前にスペースが" + X_OPTION.ACCOUNTNAME_SPACE_BORDER + "以上あるアカウント名のポストを非表示</li>";
            }
            if(X_OPTION.DEFAULT_ICON_BLOCK){
                addtxt += "<li>プロフィールアイコン未設定アカウントからのポストを非表示</li>";
            }
            if(0 < X_OPTION.SPACE_BORDER){
                addtxt += "<li>ひらがなカタカナ漢字の直前にスペースが" + X_OPTION.SPACE_BORDER + "以上あるポストを非表示</li>";
            }
            if(X_OPTION.VERIFIED_HDN){
                addtxt += "<li>認証済みアカウントのポストを非表示</li>";
            }
            if(X_OPTION.SEARCH_HIT_USERNAME_BLOCK){
                addtxt += "<li>検索ワードがアカウント名にしか存在しないポストを非表示</li>";
            }
            addtxt += "</ul>";
        }
        addtxt += "<hr><div style='margin:0 0.2rem;'>";
        for(let i=0;i<hidden_posts.length;i++){
            if(hidden_posts[i] != null || hidden_posts[i] != void 0){
                if(!(safe_user_list != void 0 && safe_user_list.includes(hidden_posts[i][2].replace("@", "")))){
                    addtxt += "<button id='hl_" + i + "' data-huserid=\"" + hidden_posts[i][2] + "\"' style='margin-right:0.5em; background-color:#cdcdcd;'>Safe</button>";
                } else {
                    addtxt += "<button id='hl_" + i + "' data-huserid=\"" + hidden_posts[i][2] + "\"' disabled style='margin-right:0.5em; background-color:#cdcdcd;'>Safe</button>";
                }
                if(hidden_posts[i][3] != null){
                    addtxt += "[ <a href='" + hidden_posts[i][3] + "' target='_blank' style='color:blue;text-decoration: underline;'>表示</a> ]";
                }
                addtxt += hidden_posts[i][0];
                addtxt += "<span style='font-weight:bold;'>（非表示理由：" + BLOCK_TYPE_TEXT[hidden_posts[i][1]] + "）</span>";
                addtxt += "<hr>";
            }
        }
        addtxt += "</div></div>";
        document.getElementById("x9uVvQH_lst").innerHTML = addtxt;
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
        if(confirm("ID「" + idName + "」をセーフリストに追加しますか？（次回からこのアカウントのポストが表示されるようになります）")){
            SafeListLoad(function(){
                safe_user_list.push(idName.replace("@", ""));
                SafeListSave();
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

    TwitterSearchBlockMain();
