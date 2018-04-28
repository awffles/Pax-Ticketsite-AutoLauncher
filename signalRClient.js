/**
 * Created by SPalermo on 2/14/2017.
*/

var chat = $.connection.paxNotificationHub;
$.connection.hub.url = "http://spc-g.dynamic-dns.net:8088/signalr";
//$.connection.hub.url = "http://localhost:63949/signalr";
var reconnectProcess;
var paxUrlOpened = new Audio("webaudio/master_sword.mp3");

$.connection.hub.stateChanged(function (state) {
    //state values { 0: 'connecting', 1: 'connected', 2: 'reconnecting', 4: 'disconnected' };
    switch(state.newState)
    {
        case 1:
            console.log("SignalR Connected");
            chrome.browserAction.setIcon({path: 'webimages/connectedIcon.png'});
            chrome.browserAction.setPopup({popup: 'web/connectedPopup.html'});
            clearInterval(reconnectProcess);
            break;
        case 4:
            //reconnect();
            clearInterval(reconnectProcess);//must remove here also or else the interval gets created over and over
            console.log("SignalR Disconnected");
            chrome.browserAction.setIcon({path: 'webimages/disconnectedIcon.png'});
            chrome.browserAction.setPopup({popup: 'web/popup.html'});
            reconnectProcess = setInterval(reconnect,10000);//
            break;
    }
});

connectSignalR();

chat.client.paxTweetReceived = function(url) {
    console.log("Pax Tweet Received:" + url);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if(tabs[0])
        {
            chrome.tabs.create({'url':url});
        }
        else
        {
            chrome.windows.create({'url':url, 'state': "maximized"});
        }
        paxUrlOpened.play();
    });
};

chat.client.normalTweetReceived = function(user,message) {
    console.debug("Normal Tweet Received From:" + user);
    console.debug(message);
};

chat.client.unexpectedStreamEvent = function(event) {
    console.debug("Unexpected Event Occurred:" + event);
}

chat.client.announcement = function (announcement) {
    var opt = {
        type: "basic",
        title: "PAX TicketSite Autolauncher Test",
        priority: 1,
        message: announcement,
        //contextMessage: "Click to bringup/create contact.",
        eventTime: Date.now(),
        iconUrl: "webimages/connectedIcon.png",
        isClickable: true,
        requireInteraction: true
    };

chrome.notifications.create(opt);
}

function connectSignalR(){

    $.connection.hub.stop();
    $.connection.hub.start({transport: 'webSockets'}).done(function(){
        clearInterval(reconnectProcess);
    });
}

function reconnect(){
    console.debug("Reconnecting SignalR");
    connectSignalR();
}