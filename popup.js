/**
 * Created by SPalermo on 9/26/2017.
 */
$(document).ready(function(){
    $('body').on('click', 'a', function(){
        chrome.tabs.create({url: $(this).attr('href')});
        return false;
    });
});