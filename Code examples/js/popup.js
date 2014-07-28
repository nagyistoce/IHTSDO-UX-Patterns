/************************************** Splendid *************************************
* Created By:		Jo munro
* Creation Date:	17th July 2014
* Edited ----------------------------------------------------------------------------
*       By:              On:  
* Description -----------------------------------------------------------------------
    jQuery plugin to create accessible popup windows

    Dependancies:
    - JQuery plugin v1.4.1+

    Usage:
    HTML - The ID in the HREF Must match the id of the popup div, One instance of background (deafult is popupBg) required per page

    <div id="popup1">
        <a class="popupOpen" href="#popup1">Open popup window</a>
        <div class="popup">
            <p>popup content</p>
            <a class="popupClose">Close</a>
        </div>
    </div> 
    <div class="popupBg"></div>
       
    Page JS
    $("#popup1").popup({
        content: '.popup',
	    open: '.popupOpen', 
	    close: '.popupClose',
        bg: '.popupBg' 
    });    
**************************************************************************************/

(function ($) {
    $.fn.popup = function (options) {
        var settings = $.extend({
            content: '.popup', //default selector for popup content
            open: '.popupOpen', //default selector for link to open popup
            close: '.popupClose', //default selector for link to close popup
            bg: '.popupBg' //default selector for background for popup window
        }, options);

        return this.each(function () {
            var $elem = $(this);

            $elem.$popup = $elem.find(settings.content),
            $elem.$open = $elem.find(settings.open),
            $elem.$close = $elem.find(settings.close),
            $elem.$bg = $(settings.bg),
            $elem.$window = $(window),
            $elem.init = function () {
                $elem.$popup.css("position","absolute").hide();//hide content for those with JS
                $elem.$open.click(function () {
                    //position popup in center of screen
                    var pHeight = $elem.$popup.outerHeight(true);
                    var pWidth = $elem.$popup.outerWidth(true);
                    var wHeight = $elem.$window.outerHeight(true);
                    var wWidth = $elem.$window.outerWidth(true);
                    var diffH = (wHeight - pHeight) / 2;
                    var diffW = (wWidth - pWidth) / 2;
                    $elem.$popup.css({ "top": $elem.$window.scrollTop() + diffH, "left": diffW }).show();
                    //show popup background
                    $elem.$bg.show();
                    return false;//prevent default link behaviour
                });
                $elem.$close.click(function () {
                    $elem.$popup.hide();
                    $elem.$bg.hide();
                });
            }
            $elem.init();
        });
    };
}(jQuery));






