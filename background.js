var s = document.createElement('script');
s.src = chrome.extension.getURL('script.js');
(document.head || document.documentElement).appendChild(s);
s.onload = function() {
    s.parentNode.removeChild(s);
};
// chrome.browserAction.onClicked.addListener(function(tab) {

//     chrome.tabs.executeScript(tab.ib, {
//         file: 'script.js'
//     });
// });
