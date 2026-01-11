
let X_OPTION;
let X_OPTION_SAFE_USER;
window.onload = function(){
    document.getElementById("version").innerText = chrome.runtime.getManifest().version;
    EventSet();
    LoadOption();
};

const INTERVAL_TIME = 200;
const TARGET_URL = [
"twitter.com/search",
"twitter.com/hashtag"
];
const DEFAULT_ICON_NAME = "default_profile_normal.png";
const POST_CLASS = [
    ["tweet", 3, "article"],
    ["css-1rynq56 r-8akbws r-krxsd3 r-dnmrzs r-1udh08x r-bcqeeo r-qvutc0 r-37j5jr r-1b43r93 r-14yzgew r-16dba41 r-bnwqim", 9, "div"],   /* PC      White    */
    ["css-1rynq56 r-8akbws r-krxsd3 r-dnmrzs r-1udh08x r-bcqeeo r-qvutc0 r-37j5jr r-1b43r93 r-14yzgew r-16dba41 r-bnwqim", 9, "div"],    /* PC      DarkBlue */
    ["css-1rynq56 r-8akbws r-krxsd3 r-dnmrzs r-1udh08x r-bcqeeo r-qvutc0 r-37j5jr r-1b43r93 r-14yzgew r-16dba41 r-bnwqim", 9, "div"],   /* PC      Black    */
    ["css-901oao css-cens5h r-18jsvk2 r-37j5jr r-1b43r93 r-16dba41 r-hjklzo r-bcqeeo r-bnwqim r-qvutc0", 9, "div"],  /* Android White    */
    ["css-901oao css-cens5h r-vlxjld r-37j5jr r-1b43r93 r-16dba41 r-hjklzo r-bcqeeo r-bnwqim r-qvutc0", 9, "div"],   /* Android DarkBlue */
    ["css-901oao css-cens5h r-1nao33i r-37j5jr r-1b43r93 r-16dba41 r-hjklzo r-bcqeeo r-bnwqim r-qvutc0", 9, "div"]   /* Android Black    */
];

const TYPE_ARRAY = 0;
const TYPE_INTEGER = 1;
const TYPE_BOOL = 2;
const TYPE_STRING = 3;

function LoadOption(){
        chrome.storage.local.get(["XFILTER_OPTION"]).then((result) => {
            let r;
            let noDataFlag = false;
            try{
                r = JSON.parse(result.XFILTER_OPTION);
                if(r == void 0){r = {};noDataFlag = true;}
            } catch(e){
                r = {};
            }
            X_OPTION = {};
            X_OPTION.BLOCK_WORDS = getOptionPram(r.BLOCK_WORDS, [], TYPE_ARRAY);
            X_OPTION.EXCLUDE_WORDS = getOptionPram(r.EXCLUDE_WORDS, [], TYPE_ARRAY);
            X_OPTION.TAG_BORDER = getOptionPram(r.TAG_BORDER, 0, TYPE_INTEGER);
            X_OPTION.DEFAULT_ICON_BLOCK = getOptionPram(r.DEFAULT_ICON_BLOCK, false, TYPE_BOOL);
            X_OPTION.BLOCK_COUNT_VIEW = getOptionPram(r.BLOCK_COUNT_VIEW, true, TYPE_BOOL);
            X_OPTION.SPACE_BORDER = getOptionPram(r.SPACE_BORDER, 0, TYPE_INTEGER);
            X_OPTION.HIRA_KATA_COV = getOptionPram(r.HIRA_KATA_COV, true, TYPE_BOOL);
            X_OPTION.CASE_CONV = getOptionPram(r.CASE_CONV, false, TYPE_BOOL);
            X_OPTION.INTERVAL_TIME = getOptionPram(r.INTERVAL_TIME, INTERVAL_TIME, TYPE_INTEGER);
            X_OPTION.TARGET_URL = getOptionPram(r.TARGET_URL, TARGET_URL, TYPE_ARRAY);
            X_OPTION.URL_XT_CONVERT = getOptionPram(r.URL_XT_CONVERT, true, TYPE_BOOL);
            X_OPTION.REG_EXP = getOptionPram(r.REG_EXP, false, TYPE_BOOL);
            X_OPTION.DEFAULT_ICON_NAME = getOptionPram(r.DEFAULT_ICON_NAME, DEFAULT_ICON_NAME, TYPE_STRING);
            X_OPTION.TAG_START_BORDER = getOptionPram(r.TAG_START_BORDER, 0, TYPE_INTEGER);
            X_OPTION.ONLINE_UPDATE = getOptionPram(r.ONLINE_UPDATE, false, TYPE_BOOL);
            X_OPTION.POST_CLASS = getOptionPram(r.POST_CLASS, POST_CLASS, TYPE_ARRAY);
            X_OPTION.INSERT_DEFAULT_CLASS = getOptionPram(r.INSERT_DEFAULT_CLASS, true, TYPE_BOOL);
            X_OPTION.LINK_EMPHASIS = getOptionPram(r.LINK_EMPHASIS, true, TYPE_BOOL);
            X_OPTION.LINK_EMPHASIS_ALL = getOptionPram(r.LINK_EMPHASIS_ALL, true, TYPE_BOOL);
            X_OPTION.VERIFIED_HDN = getOptionPram(r.VERIFIED_HDN, false, TYPE_BOOL);
            X_OPTION.POST_CHECK_ALL = getOptionPram(r.POST_CHECK_ALL, false, TYPE_BOOL);
            X_OPTION.ONLINE_SPAM_LIST = getOptionPram(r.ONLINE_SPAM_LIST, false, TYPE_BOOL);
            X_OPTION.MANUAL_SPAM_LIST = getOptionPram(r.MANUAL_SPAM_LIST, false, TYPE_ARRAY);
            X_OPTION.ACCOUNTNAME_SPACE_BORDER = getOptionPram(r.ACCOUNTNAME_SPACE_BORDER, 0, TYPE_INTEGER);
            X_OPTION.SEARCH_HIT_USERNAME_BLOCK = getOptionPram(r.SEARCH_HIT_USERNAME_BLOCK, false, TYPE_BOOL);
            X_OPTION.LINK_CARD_URL_VIEW = getOptionPram(r.LINK_CARD_URL_VIEW, false, TYPE_BOOL);
            X_OPTION.LINK_CARD_URL_VIEW_ONELINE = getOptionPram(r.LINK_CARD_URL_VIEW_ONELINE, false, TYPE_BOOL);
            X_OPTION.LINK_CARD_MISMATCH_WARNING = getOptionPram(r.LINK_CARD_MISMATCH_WARNING, false, TYPE_BOOL);
            X_OPTION.LINK_CARD_URL_SAFE = getOptionPram(r.LINK_CARD_URL_SAFE, [], TYPE_ARRAY);
            X_OPTION.LINK_CARD_URL_VIEW_VIDEO_DISABLE = getOptionPram(r.LINK_CARD_URL_VIEW_VIDEO_DISABLE, true, TYPE_BOOL);
            X_OPTION.TREND_WORD_BORDER_TEXT = getOptionPram(r.TREND_WORD_BORDER_TEXT, 0, TYPE_INTEGER);
            X_OPTION.TREND_WORD_BORDER_NAME = getOptionPram(r.TREND_WORD_BORDER_NAME, 0, TYPE_INTEGER);
            X_OPTION.DEFAULT_SELECTED_FOLLOW_TAB = getOptionPram(r.DEFAULT_SELECTED_FOLLOW_TAB, false, TYPE_BOOL);
            X_OPTION.LINK_CLICK_URL_CHECK = getOptionPram(r.LINK_CLICK_URL_CHECK, false, TYPE_BOOL);
            X_OPTION.FROM_SEARCH_HIDDEN_STOP = getOptionPram(r.FROM_SEARCH_HIDDEN_STOP, true, TYPE_BOOL);
            X_OPTION.REPLY_VERIFIED_HDN = getOptionPram(r.REPLY_VERIFIED_HDN, false, TYPE_BOOL);
            X_OPTION.REPLY_EMOJI_ONLY_HDN = getOptionPram(r.REPLY_EMOJI_ONLY_HDN, false, TYPE_BOOL);
            X_OPTION.REPLY_NO_TEXT_HDN = getOptionPram(r.REPLY_NO_TEXT_HDN, false, TYPE_BOOL);
            X_OPTION.REPLY_JPN_RATIO_HDN = getOptionPram(r.REPLY_JPN_RATIO_HDN, 0, TYPE_INTEGER);
            X_OPTION.REPLY_MULTI_COUNT_BORDER = getOptionPram(r.REPLY_MULTI_COUNT_BORDER, 0, TYPE_INTEGER);
            X_OPTION.DEFAULT_SELECTED_FOLLOW_TAB_LATEST_SELECT = getOptionPram(r.DEFAULT_SELECTED_FOLLOW_TAB_LATEST_SELECT, false, TYPE_BOOL);

            document.getElementById("mute_words").value = ArrayObjtoText(X_OPTION.BLOCK_WORDS);
            document.getElementById("exclude_words").value = ArrayObjtoText(X_OPTION.EXCLUDE_WORDS);
            document.getElementById("reg_exp").checked = X_OPTION.REG_EXP ? true : false;
            document.getElementById("hashtag_border").value = X_OPTION.TAG_BORDER;
            document.getElementById("space_border").value = X_OPTION.SPACE_BORDER;
            document.getElementById("short_post_border").value = X_OPTION.TAG_START_BORDER;
            document.getElementById("default_icon_block").checked = X_OPTION.DEFAULT_ICON_BLOCK ? true : false;
            document.getElementById("default_icon_name").value = X_OPTION.DEFAULT_ICON_NAME;
            document.getElementById("block_count_view").checked = X_OPTION.BLOCK_COUNT_VIEW;
            document.getElementById("hira_kata_conv").checked = X_OPTION.HIRA_KATA_COV;
            document.getElementById("case_conv").checked = X_OPTION.CASE_CONV;
            document.getElementById("interval_time").value = X_OPTION.INTERVAL_TIME;
            document.getElementById("target_url").value = ArrayObjtoText(X_OPTION.TARGET_URL);
            document.getElementById("x_conv").checked = X_OPTION.URL_XT_CONVERT;
            document.getElementById("post_class_area").value = ArrayObjtoText(X_OPTION.POST_CLASS);
            document.getElementById("insert_default_class").checked = X_OPTION.INSERT_DEFAULT_CLASS;
            document.getElementById("link_card_emphasis").checked = X_OPTION.LINK_EMPHASIS;
            document.getElementById("link_card_emphasis_all").checked = X_OPTION.LINK_EMPHASIS_ALL;
            document.getElementById("verified_hidden").checked = X_OPTION.VERIFIED_HDN;
            document.getElementById("post_check_all").checked = X_OPTION.POST_CHECK_ALL;
            document.getElementById("accountname_space_border").value = X_OPTION.ACCOUNTNAME_SPACE_BORDER;
            document.getElementById("search_hit_username_block").checked = X_OPTION.SEARCH_HIT_USERNAME_BLOCK;
            document.getElementById("link_card_url_view").checked = X_OPTION.LINK_CARD_URL_VIEW;
            document.getElementById("link_card_url_view_oneLine").checked = X_OPTION.LINK_CARD_URL_VIEW_ONELINE;
            document.getElementById("link_card_mismatch_warning").checked = X_OPTION.LINK_CARD_MISMATCH_WARNING;
            document.getElementById("link_card_url_safe").value = ArrayObjtoText(X_OPTION.LINK_CARD_URL_SAFE);
            document.getElementById("link_card_url_view_video_disable").checked = X_OPTION.LINK_CARD_URL_VIEW_VIDEO_DISABLE;
            document.getElementById("trend_word_border_text").value = X_OPTION.TREND_WORD_BORDER_TEXT;
            document.getElementById("trend_word_border_name").value = X_OPTION.TREND_WORD_BORDER_NAME;
            document.getElementById("default_selected_follow_tab").checked = X_OPTION.DEFAULT_SELECTED_FOLLOW_TAB;
            document.getElementById("link_click_url_check").checked = X_OPTION.LINK_CLICK_URL_CHECK;
            document.getElementById("from_search_hidden_stop").checked = X_OPTION.FROM_SEARCH_HIDDEN_STOP;
            document.getElementById("reply_verified_hdn").checked = X_OPTION.REPLY_VERIFIED_HDN;
            document.getElementById("reply_emoji_only_hdn").checked = X_OPTION.REPLY_EMOJI_ONLY_HDN;
            document.getElementById("reply_no_text_hdn").checked = X_OPTION.REPLY_NO_TEXT_HDN;
            document.getElementById("reply_jpn_ratio_hdn").value = X_OPTION.REPLY_JPN_RATIO_HDN;
            document.getElementById("reply_multi_count_border").value = X_OPTION.REPLY_MULTI_COUNT_BORDER;
            document.getElementById("default_selected_follow_tab_latest_select").checked = X_OPTION.DEFAULT_SELECTED_FOLLOW_TAB_LATEST_SELECT;

            if(X_OPTION.MANUAL_SPAM_LIST != void 0 && X_OPTION.MANUAL_SPAM_LIST != null){
                if(0 < X_OPTION.MANUAL_SPAM_LIST.length){
                    document.getElementById("manual_import_status").innerText = X_OPTION.MANUAL_SPAM_LIST.length + "件インポートされています";
                    document.getElementById("manual_import_delete").disabled = false;
                }
            }
            LoadOption_SwitchUpdate();
            ManualExportSetting();
            LinkOptionChange();
            BackupExport(X_OPTION);
            if(noDataFlag){
                OptionSave();
                return;
            }
        });

        chrome.storage.local.get(["XFILTER_OPTION_SAFE_USER"]).then((result) => {
            try{
                X_OPTION_SAFE_USER = JSON.parse(result.XFILTER_OPTION_SAFE_USER);
            } catch(e){
                X_OPTION_SAFE_USER = {};
            }
            document.getElementById("safe_user").value = ArrayObjtoText(X_OPTION_SAFE_USER);
            BackupExport(X_OPTION);
        });
}

function LoadOption_SwitchUpdate(){
    if(Number(X_OPTION.TAG_BORDER)){
        if(0 < X_OPTION.TAG_BORDER){
            document.getElementById("hashtag_border_switch").checked = true;
        }
    }
    if(Number(X_OPTION.SPACE_BORDER)){
        if(0 < X_OPTION.SPACE_BORDER){
            document.getElementById("space_border_switch").checked = true;
        }
    }
    if(Number(X_OPTION.TAG_START_BORDER)){
        if(0 < X_OPTION.TAG_START_BORDER){
            document.getElementById("short_post_border_switch").checked = true;
        }
    }
    if(Number(X_OPTION.ACCOUNTNAME_SPACE_BORDER)){
        if(0 < X_OPTION.ACCOUNTNAME_SPACE_BORDER){
            document.getElementById("accountname_space_border_switch").checked = true;
        }
    }
    if(Number(X_OPTION.TREND_WORD_BORDER_TEXT)){
        if(0 < X_OPTION.TREND_WORD_BORDER_TEXT){
            document.getElementById("trend_word_border_text_switch").checked = true;
        }
    }
    if(Number(X_OPTION.TREND_WORD_BORDER_NAME)){
        if(0 < X_OPTION.TREND_WORD_BORDER_NAME){
            document.getElementById("trend_word_border_name_switch").checked = true;
        }
    }
    if(Number(X_OPTION.REPLY_JPN_RATIO_HDN)){
        if(0 < X_OPTION.REPLY_JPN_RATIO_HDN){
            document.getElementById("reply_jpn_ratio_hdn_switch").checked = true;
        }
    }
    if(Number(X_OPTION.REPLY_MULTI_COUNT_BORDER)){
        if(1 < X_OPTION.REPLY_MULTI_COUNT_BORDER){
            document.getElementById("reply_multi_count_border_switch").checked = true;
        }
    }
    SubOptionVisibleSwitch();
}

function OptionSave(){
    LinkOptionChange();
    let SAVE_OBJ = {};
    SAVE_OBJ.ONLINE_UPDATE = false;
    SAVE_OBJ.ONLINE_SPAM_LIST = false;
    SAVE_OBJ.BLOCK_WORDS = document.getElementById("mute_words").value.split(/\n/);
    SAVE_OBJ.EXCLUDE_WORDS = document.getElementById("exclude_words").value.split(/\n/);
    SAVE_OBJ.REG_EXP = document.getElementById("reg_exp").checked;
    if(document.getElementById("hashtag_border_switch").checked){
        SAVE_OBJ.TAG_BORDER = document.getElementById("hashtag_border").value;
    } else {
        SAVE_OBJ.TAG_BORDER = "0";
    }
    if(document.getElementById("space_border_switch").checked){
        SAVE_OBJ.SPACE_BORDER = document.getElementById("space_border").value;
    } else {
        SAVE_OBJ.SPACE_BORDER = "0";
    }
    if(document.getElementById("short_post_border_switch").checked){
        SAVE_OBJ.TAG_START_BORDER = document.getElementById("short_post_border").value;
    } else {
        SAVE_OBJ.TAG_START_BORDER = "0";
    }
    if(document.getElementById("reply_jpn_ratio_hdn_switch").checked){
        SAVE_OBJ.REPLY_JPN_RATIO_HDN = document.getElementById("reply_jpn_ratio_hdn").value;
    } else {
        SAVE_OBJ.REPLY_JPN_RATIO_HDN = "0";
    }
    if(document.getElementById("reply_multi_count_border_switch").checked){
        SAVE_OBJ.REPLY_MULTI_COUNT_BORDER = document.getElementById("reply_multi_count_border").value;
    } else {
        SAVE_OBJ.REPLY_MULTI_COUNT_BORDER = "0";
    }
    SAVE_OBJ.DEFAULT_ICON_BLOCK = document.getElementById("default_icon_block").checked;
    SAVE_OBJ.DEFAULT_ICON_NAME = document.getElementById("default_icon_name").value;
    SAVE_OBJ.BLOCK_COUNT_VIEW = document.getElementById("block_count_view").checked;
    SAVE_OBJ.HIRA_KATA_COV = document.getElementById("hira_kata_conv").checked;
    SAVE_OBJ.CASE_CONV = document.getElementById("case_conv").checked;
    SAVE_OBJ.INTERVAL_TIME = document.getElementById("interval_time").value;
    SAVE_OBJ.TARGET_URL = document.getElementById("target_url").value.split(/\n/);
    SAVE_OBJ.URL_XT_CONVERT = document.getElementById("x_conv").checked;
    SAVE_OBJ.POST_CLASS = MakeClassArray(document.getElementById("post_class_area").value);
    SAVE_OBJ.INSERT_DEFAULT_CLASS = document.getElementById("insert_default_class").checked;
    SAVE_OBJ.LINK_EMPHASIS = document.getElementById("link_card_emphasis").checked;
    SAVE_OBJ.LINK_EMPHASIS_ALL = document.getElementById("link_card_emphasis_all").checked;
    SAVE_OBJ.VERIFIED_HDN = document.getElementById("verified_hidden").checked;
    SAVE_OBJ.POST_CHECK_ALL = document.getElementById("post_check_all").checked;
    SAVE_OBJ.MANUAL_SPAM_LIST = X_OPTION.MANUAL_SPAM_LIST;
    if(document.getElementById("accountname_space_border_switch").checked){
        SAVE_OBJ.ACCOUNTNAME_SPACE_BORDER = document.getElementById("accountname_space_border").value;
    } else {
        SAVE_OBJ.ACCOUNTNAME_SPACE_BORDER = "0";
    }
    
    SAVE_OBJ.SEARCH_HIT_USERNAME_BLOCK = document.getElementById("search_hit_username_block").checked;
    SAVE_OBJ.LINK_CARD_URL_VIEW = document.getElementById("link_card_url_view").checked;
    SAVE_OBJ.LINK_CARD_URL_VIEW_ONELINE = document.getElementById("link_card_url_view_oneLine").checked;
    SAVE_OBJ.LINK_CARD_MISMATCH_WARNING = document.getElementById("link_card_mismatch_warning").checked;
    SAVE_OBJ.LINK_CARD_URL_SAFE = document.getElementById("link_card_url_safe").value.split(/\n/);
    SAVE_OBJ.LINK_CARD_URL_VIEW_VIDEO_DISABLE = document.getElementById("link_card_url_view_video_disable").checked;
    SAVE_OBJ.DEFAULT_SELECTED_FOLLOW_TAB = document.getElementById("default_selected_follow_tab").checked;
    SAVE_OBJ.LINK_CLICK_URL_CHECK = document.getElementById("link_click_url_check").checked;
    SAVE_OBJ.FROM_SEARCH_HIDDEN_STOP = document.getElementById("from_search_hidden_stop").checked;
    SAVE_OBJ.REPLY_VERIFIED_HDN = document.getElementById("reply_verified_hdn").checked;
    SAVE_OBJ.REPLY_EMOJI_ONLY_HDN = document.getElementById("reply_emoji_only_hdn").checked;
    SAVE_OBJ.REPLY_NO_TEXT_HDN = document.getElementById("reply_no_text_hdn").checked;
    SAVE_OBJ.DEFAULT_SELECTED_FOLLOW_TAB_LATEST_SELECT = document.getElementById("default_selected_follow_tab_latest_select").checked;
    if(document.getElementById("trend_word_border_text_switch").checked){
        SAVE_OBJ.TREND_WORD_BORDER_TEXT = document.getElementById("trend_word_border_text").value;
    } else {
        SAVE_OBJ.TREND_WORD_BORDER_TEXT = "0";
    }
    if(document.getElementById("trend_word_border_name_switch").checked){
        SAVE_OBJ.TREND_WORD_BORDER_NAME = document.getElementById("trend_word_border_name").value;
    } else {
        SAVE_OBJ.TREND_WORD_BORDER_NAME = "0";
    }
    chrome.storage.local.set({"XFILTER_OPTION": JSON.stringify(SAVE_OBJ)}, function() {
        ;
    });
    chrome.storage.local.set({"XFILTER_OPTION_SAFE_USER": JSON.stringify(document.getElementById("safe_user").value.split(/\n/))}, function() {
        ;
    });
    SubOptionVisibleSwitch();
    ManualExportSetting();
    BackupExport(SAVE_OBJ);
}

function SubOptionVisibleSwitch(){
    if(document.getElementById("hashtag_border_switch").checked){
        document.getElementById("hashtag_border_subOption").classList.add("suboption_open");
        document.getElementById("hashtag_border_subOption").classList.remove("suboption_close");
    } else {
        document.getElementById("hashtag_border_subOption").classList.add("suboption_close");
        document.getElementById("hashtag_border_subOption").classList.remove("suboption_open");
    }

    if(document.getElementById("space_border_switch").checked){
        document.getElementById("space_border_subOption").classList.add("suboption_open");
        document.getElementById("space_border_subOption").classList.remove("suboption_close");
    } else {
        document.getElementById("space_border_subOption").classList.add("suboption_close");
        document.getElementById("space_border_subOption").classList.remove("suboption_open");
    }

    if(document.getElementById("short_post_border_switch").checked){
        document.getElementById("short_post_border_subOption").classList.add("suboption_open");
        document.getElementById("short_post_border_subOption").classList.remove("suboption_close");
    } else {
        document.getElementById("short_post_border_subOption").classList.add("suboption_close");
        document.getElementById("short_post_border_subOption").classList.remove("suboption_open");
    }

    if(document.getElementById("accountname_space_border_switch").checked){
        document.getElementById("accountname_space_border_subOption").classList.add("suboption_open");
        document.getElementById("accountname_space_border_subOption").classList.remove("suboption_close");
    } else {
        document.getElementById("accountname_space_border_subOption").classList.add("suboption_close");
        document.getElementById("accountname_space_border_subOption").classList.remove("suboption_open");
    }

    if(document.getElementById("trend_word_border_text_switch").checked){
        document.getElementById("trend_word_border_text_subOption").classList.add("suboption_open");
        document.getElementById("trend_word_border_text_subOption").classList.remove("suboption_close");
    } else {
        document.getElementById("trend_word_border_text_subOption").classList.add("suboption_close");
        document.getElementById("trend_word_border_text_subOption").classList.remove("suboption_open");
    }

    if(document.getElementById("trend_word_border_name_switch").checked){
        document.getElementById("trend_word_border_name_subOption").classList.add("suboption_open");
        document.getElementById("trend_word_border_name_subOption").classList.remove("suboption_close");
    } else {
        document.getElementById("trend_word_border_name_subOption").classList.add("suboption_close");
        document.getElementById("trend_word_border_name_subOption").classList.remove("suboption_open");
    }

    if(document.getElementById("reply_jpn_ratio_hdn_switch").checked){
        document.getElementById("reply_jpn_ratio_hdn_subOption").classList.add("suboption_open");
        document.getElementById("reply_jpn_ratio_hdn_subOption").classList.remove("suboption_close");
    } else {
        document.getElementById("reply_jpn_ratio_hdn_subOption").classList.add("suboption_close");
        document.getElementById("reply_jpn_ratio_hdn_subOption").classList.remove("suboption_open");
    }

    if(document.getElementById("reply_multi_count_border_switch").checked){
        document.getElementById("reply_multi_count_border_subOption").classList.add("suboption_open");
        document.getElementById("reply_multi_count_border_subOption").classList.remove("suboption_close");
    } else {
        document.getElementById("reply_multi_count_border_subOption").classList.add("suboption_close");
        document.getElementById("reply_multi_count_border_subOption").classList.remove("suboption_open");
    }
}

function LinkOptionChange(){
    if(!document.getElementById("link_card_emphasis").checked){
        document.getElementById("link_card_url_view_video_disable").checked = false;
        document.getElementById("link_card_url_view_video_disable").disabled = true;
    } else {
        document.getElementById("link_card_url_view_video_disable").disabled = false;
    }

    if(!document.getElementById("link_card_url_view").checked){
        document.getElementById("link_card_url_view_oneLine").disabled = true;
        document.getElementById("link_card_mismatch_warning").disabled = true;
        document.getElementById("link_card_url_view_oneLine").checked = false;
        document.getElementById("link_card_mismatch_warning").checked = false;
    } else {
        document.getElementById("link_card_url_view_oneLine").disabled = false;
        document.getElementById("link_card_mismatch_warning").disabled = false;
    }

    if(!document.getElementById("default_selected_follow_tab").checked){
        document.getElementById("default_selected_follow_tab_latest_select").disabled = true;
         document.getElementById("default_selected_follow_tab_latest_select").checked = false;
    } else {
        document.getElementById("default_selected_follow_tab_latest_select").disabled = false;
    }
}

function ArrayObjtoText(arr){
    if(arr == void 0){ return "";}
    let str = "";
    for(let i=0;i<arr.length;i++){
        if(0<i){ str += "\n"; }
        str += arr[i];
    }
    return str;
}

function MakeClassArray(str){
    if(str == void 0 || str == null || str.trim().length == 0){ return ""; }
    let res = [];
    let b = str.split(/\n/);
    let c;
    for(let i=0;i<b.length;i++){
        c = b[i].split(",");
        res.push([c[0], c[1], c[2]]);
    }
    return res;
}

function EventSet(){
    document.getElementById("mute_words").addEventListener("input", OptionSave, false);
    document.getElementById("exclude_words").addEventListener("input", OptionSave, false);
    document.getElementById("reg_exp").addEventListener("click", OptionSave, false);
    document.getElementById("hashtag_border").addEventListener("input", OptionSave, false);
    document.getElementById("space_border").addEventListener("input", OptionSave, false);
    document.getElementById("short_post_border").addEventListener("input", OptionSave, false);
    document.getElementById("default_icon_block").addEventListener("click", OptionSave, false);
    document.getElementById("default_icon_name").addEventListener("input", OptionSave, false);
    document.getElementById("block_count_view").addEventListener("click", OptionSave, false);
    document.getElementById("hira_kata_conv").addEventListener("click", OptionSave, false);
    document.getElementById("case_conv").addEventListener("click", OptionSave, false);
    document.getElementById("interval_time").addEventListener("input", OptionSave, false);
    document.getElementById("target_url").addEventListener("input", OptionSave, false);
    document.getElementById("post_class_area").addEventListener("input", OptionSave, false);
    document.getElementById("insert_default_class").addEventListener("click", OptionSave, false);
    document.getElementById("x_conv").addEventListener("click", OptionSave, false);
    document.getElementById("link_card_emphasis").addEventListener("click", OptionSave, false);
    document.getElementById("link_card_emphasis_all").addEventListener("click", OptionSave, false);
    document.getElementById("verified_hidden").addEventListener("click", OptionSave, false);
    document.getElementById("post_check_all").addEventListener("click", OptionSave, false);
    document.getElementById("safe_user").addEventListener("input", OptionSave, false);
    document.getElementById("manual_spamList").addEventListener("input", ManualListOptionSave, false);
    document.getElementById("manual_import_delete").addEventListener("click", ManualListDelete, false);
    document.getElementById("accountname_space_border").addEventListener("input", OptionSave, false);
    document.getElementById("search_hit_username_block").addEventListener("click", OptionSave, false);
    document.getElementById("link_card_url_view").addEventListener("click", OptionSave, false);
    document.getElementById("link_card_url_view_oneLine").addEventListener("click", OptionSave, false);
    document.getElementById("link_card_mismatch_warning").addEventListener("click", OptionSave, false);
    document.getElementById("link_card_url_safe").addEventListener("input", OptionSave, false);
    document.getElementById("link_card_url_view_video_disable").addEventListener("click", OptionSave, false);
    document.getElementById("hashtag_border_switch").addEventListener("change", OptionSave, false);
    document.getElementById("space_border_switch").addEventListener("change", OptionSave, false);
    document.getElementById("short_post_border_switch").addEventListener("change", OptionSave, false);
    document.getElementById("accountname_space_border_switch").addEventListener("change", OptionSave, false);
    document.getElementById("backup_import").addEventListener("input", BackupImport, false);
    document.getElementById("trend_word_border_text").addEventListener("input", OptionSave, false);
    document.getElementById("trend_word_border_text_switch").addEventListener("change", OptionSave, false);
    document.getElementById("trend_word_border_name").addEventListener("input", OptionSave, false);
    document.getElementById("trend_word_border_name_switch").addEventListener("change", OptionSave, false);
    document.getElementById("default_selected_follow_tab").addEventListener("change", OptionSave, false);
    document.getElementById("link_click_url_check").addEventListener("change", OptionSave, false);
    document.getElementById("from_search_hidden_stop").addEventListener("change", OptionSave, false);
    document.getElementById("reply_verified_hdn").addEventListener("change", OptionSave, false);
    document.getElementById("reply_emoji_only_hdn").addEventListener("change", OptionSave, false);
    document.getElementById("reply_no_text_hdn").addEventListener("change", OptionSave, false);
    document.getElementById("reply_jpn_ratio_hdn_switch").addEventListener("change", OptionSave, false);
    document.getElementById("reply_jpn_ratio_hdn").addEventListener("input", OptionSave, false);
    document.getElementById("reply_multi_count_border_switch").addEventListener("change", OptionSave, false);
    document.getElementById("reply_multi_count_border").addEventListener("input", OptionSave, false);
    document.getElementById("default_selected_follow_tab_latest_select").addEventListener("change", OptionSave, false);

    document.getElementById("default_set_1").addEventListener("click", function(){
        document.getElementById("default_icon_name").value = DEFAULT_ICON_NAME;
        OptionSave();
    }, false);
    document.getElementById("default_set_2").addEventListener("click", function(){
        document.getElementById("interval_time").value = INTERVAL_TIME;
        OptionSave();
    }, false);
    document.getElementById("default_set_3").addEventListener("click", function(){
        let a = "";
        for(let i=0;i<TARGET_URL.length;i++){
            if(0 < i){ a += "\n";}
            a += TARGET_URL[i];
        }
        document.getElementById("target_url").value = a;
        OptionSave();
    }, false);
    document.getElementById("default_set_4").addEventListener("click", function(){
        let a = "";
        for(let i=0;i<POST_CLASS.length;i++){
            if(0 < i){ a += "\n";}
            a += POST_CLASS[i];
        }
        document.getElementById("post_class_area").value = a;
        OptionSave();
    }, false);
}

function ManualListOptionSave(){
    var item = document.getElementById("manual_spamList").files;
    var reader = new FileReader();
    reader.readAsText(item[0]);
    reader.onload = function(ev){
        let rd = reader.result.split(/\r\n|\n/);
        let lst = [];
        if(document.getElementById("manual_import_type_addition").checked){
            lst = X_OPTION.MANUAL_SPAM_LIST;
        }
        if(rd != void 0 && rd != null && 0 < rd.length){
            for(let i=0;i<rd.length;i++){
                if(rd[i] != void 0 && rd[i] != null && rd[i].trim() != ""){
                    lst.push(rd[i].trim());
                }
            }
            X_OPTION.MANUAL_SPAM_LIST = [...new Set(lst)];
            if(0 < lst.length){
                document.getElementById("manual_import_status").innerText = X_OPTION.MANUAL_SPAM_LIST.length + "件インポートされています";
                document.getElementById("manual_import_delete").disabled = false;
            } else {
                document.getElementById("manual_import_status").innerText = "インポートされていません";
                document.getElementById("manual_import_delete").disabled = true;
            }
        } else {
            document.getElementById("manual_import_status").innerText = "インポートされていません";
            document.getElementById("manual_import_delete").disabled = true;
        }
        OptionSave();
    }
}

function ManualListDelete(){
    if(confirm("インポートしたデータを削除しますか？")){
        X_OPTION.MANUAL_SPAM_LIST = [];
        document.getElementById("manual_import_status").innerText = "インポートされていません";
        document.getElementById("manual_import_delete").disabled = true;
        OptionSave();
    }
}

function getOptionPram(opt, defaultValue, type){
    if(opt == null)return defaultValue;
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

function ManualExportSetting(){
    let content = "";
    if(X_OPTION.MANUAL_SPAM_LIST != null && 0 < X_OPTION.MANUAL_SPAM_LIST.length){
        document.getElementById("manual_export").disabled = false;
        document.getElementById("manual_export_link").disabled = false;
        for(const item of X_OPTION.MANUAL_SPAM_LIST){
            content += item + "\n";
        }
        let blob = new Blob([ content ], { "type" : "text/plain" });
        document.getElementById("manual_export_link").href = window.URL.createObjectURL(blob);
        window.URL.revokeObjectURL(blob);
    } else {
        document.getElementById("manual_export_link").href = "#";
        document.getElementById("manual_export").disabled = true;
        document.getElementById("manual_export_link").removeAttribute("href");
    }
}

function BackupExport(option_obj){
    let exportObj = option_obj;
    exportObj.SAFE_USER = (document.getElementById("safe_user").value).split(/\n/);
    let content = JSON.stringify(exportObj);
    let blob = new Blob([ content ], { "type" : "text/plain" });
    let url = window.URL.createObjectURL(blob);
    let a = document.getElementById("backup_export_link");
    a.href = window.URL.createObjectURL(blob);
    a.download = "XFilter_Backup_" + new Date().getTime() + ".json";
    window.URL.revokeObjectURL(url);
}

function BackupImport(){
    let item = document.getElementById("backup_import").files;
    let reader = new FileReader();
    if(window.confirm("バックアップファイルを適用しますか？（現在の設定は上書きされます）")){
        reader.readAsText(item[0]);
        reader.onload = function(ev){
            let rd = reader.result;
            try{
                let r = JSON.parse(rd);
                if(r != void 0 && r != null){
                    let safeUser = r.SAFE_USER || [];
                    delete r.SAFE_USER;
                    X_OPTION = r;
                    chrome.storage.local.set({"XFILTER_OPTION": JSON.stringify(X_OPTION)}, function() {
                        chrome.storage.local.set({"XFILTER_OPTION_SAFE_USER": JSON.stringify(safeUser)}, function() {
                            alert("バックアップファイルを読み込みました。\n画面を再読み込みします。");
                            LoadOption();
                            window.scrollTo(0, 0);
                            window.location.reload();
                        });
                    });
                }
            } catch(e){
                console.error(e);
                alert("バックアップファイルの読み込みに失敗しました。");
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalClose = document.getElementById('modalClose');
    const imageButtons = document.querySelectorAll('.image-button');

    function openModal(imagePath) {
        modalImage.src = imagePath;
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }

    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    imageButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const imagePath = this.getAttribute('data-image');
            openModal(imagePath);
        });
    });

    modalClose.addEventListener('click', function() {
        closeModal();
    });

    modal.addEventListener('click', function(e) {
        closeModal();
    });

    modalImage.addEventListener('click', function() {
        closeModal();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
});