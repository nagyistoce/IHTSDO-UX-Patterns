/************************************** Splendid *************************************
* Created By:		Jo munro
* Creation Date:	18th July 2014
* Edited ----------------------------------------------------------------------------
*       By:              On:  
* Description -----------------------------------------------------------------------
    jQuery plugin to create accessible tooltips

    Dependancies:
    - JQuery plugin v1.7+

    Usage:
    HTML - The HREF of the opening link must match the id of the tooltip div
    <a href="#tooltip1">Open tooltip</a>
    <div id="tooltip1" class="tooltip">
        <a class="tipClose">close</a>
        <p>Tooltip content</p>
        <div class="arrow"></div>
    </div>
       
    Page JS
    $("#tooltip1").tooltip(); //use default options for 1 tooltip

    $("#tooltip1, #tooltip2").tooltip(); //use default options for 2 tooltips

     //specify tooltip options
    $("#tooltip1").tooltip({
        pointer: '.arrow', //default selector for tooltip pointer
        triggerEvent: 'mouseenter', //default event to bind to, options are mouseenter or click
        close: '.tipClose', //default selector for link to close popup, leave blank if not required
        position: 'top', //default position for tooltip (if enough available space), options are top, right, bottom and left
        delayClose: 200 //for hover event, default delay after mouse moves away from tooltip before closing
    });
**************************************************************************************/

(function ($) {
    'use strict';

    function Tooltip(el, options) {
        this.$el = $(el);
        this.options = options;
        this.$pointer = this.$el.find(this.options.pointer);
        this.$open = $("[href='#" + this.$el.attr("id") + "']");
        if (this.options.close != "") {
            this.$close = this.$el.find(this.options.close);
        }
        this.timer = "";
        this.tipWidth = this.$el.outerWidth(true);
        this.tipHeight = this.$el.outerHeight(true);
        this.pointHeight = (this.$pointer.outerHeight(true) + 5) / 2;
        this.openWidth = this.$open.outerWidth(true);
        this.openHeight = this.$open.outerHeight(true);
        this.init();
    }
    Tooltip.prototype = {
        init: function () {
            var _self = this;

            _self.$el.css("position","absolute").hide();//hide tooltip content for those with JS
            //set up events to show tooltip
            _self.$open.on(_self.options.triggerEvent, function () {
                _self.showTip();
            });
            _self.$el.on(_self.options.triggerEvent, function () {
                _self.showTip();
            });
            //set up events to hide tooltip
            if (this.options.triggerEvent == "mouseenter") {//if tooltip triggered by mouseenter, add corresponding mouseleave event
                _self.$open.on("mouseleave", function () {
                    _self.hideTip();
                });
                _self.$el.on("mouseleave", function () {
                    _self.hideTip();
                });
            }
            if (this.options.close.length) {//if a close selector has been supplied
                _self.$close.click(function () {
                    _self.hideTip();
                });
            }
        },
        showTip: function () {
            clearTimeout(this.timer);//clear any previous timers
            this.positionTip();
            this.$el.show();
            return false;//prevent default link behaviour
        },
        hideTip: function () {
            var _self = this;
            this.timer = setTimeout(function () { _self.$el.hide(); }, this.options.delayClose);
        },
        positionTip: function () {
            var $win = $(window);
            var winH = $win.height();
            var winW = $win.width();
            var scrollTop = $win.scrollTop();
            var scrollLeft = $win.scrollLeft();
            var openOffsetX = this.$open.offset().left;
            var openOffsetY = this.$open.offset().top;

            //calculate which positions have enough space
            var spaceTop = this.tipHeight <= (openOffsetY - scrollTop);
            var spaceBot = this.tipHeight <= (winH - ((openOffsetY - scrollTop) + this.openHeight));
            var spaceLeft = this.tipWidth <= (openOffsetX - scrollLeft);
            var spaceRight = this.tipWidth <= (winW - ((openOffsetX - scrollLeft) + this.openWidth));

            var position = -1;

            //save priority order of positions to test along with the results of space calculations
            if (this.options.position == "top") { 
                var testOrder = new Array([spaceTop, "top"], [spaceBot, "bottom"], [spaceLeft, "left"], [spaceRight, "right"], [spaceTop, "top"]);
            }else if (this.options.position == "bottom") {
                var testOrder = new Array([spaceBot, "bottom"], [spaceTop, "top"], [spaceLeft, "left"], [spaceRight, "right"], [spaceBot, "bottom"]);
            } else if (this.options.position == "left") {
                var testOrder = new Array([spaceLeft, "left"], [spaceRight, "right"], [spaceTop, "top"], [spaceBot, "bottom"], [spaceTop, "top"]);
            } else if (this.options.position == "right") {
                var testOrder = new Array([spaceRight, "right"], [spaceLeft, "left"], [spaceTop, "top"], [spaceBot, "bottom"], [spaceRight, "right"]);
            }

            //position tooltip where space is available, test in priority order
            if (testOrder[0][0]) {
                position = 0;
                this.calculatePos(testOrder[0][1], openOffsetX, openOffsetY, winH, winW, scrollTop, scrollLeft);
            }
            if (position<0 && testOrder[1][0]) {
                position = 1;
                this.calculatePos(testOrder[1][1], openOffsetX, openOffsetY, winH, winW, scrollTop, scrollLeft);
            }
            if (position<0 && testOrder[2][0]) {
                position = 2;
                this.calculatePos(testOrder[2][1], openOffsetX, openOffsetY, winH, winW, scrollTop, scrollLeft);
            }
            if (position<0 && testOrder[3][0]) {
                position = 3;
                this.calculatePos(testOrder[3][1], openOffsetX, openOffsetY, winH, winW, scrollTop, scrollLeft);
            }
            if (position < 0) {//if not enough space anywhere position in specified direction
                position = 4;
                this.calculatePos(testOrder[position][1], openOffsetX, openOffsetY, winH, winW, scrollTop, scrollLeft);
            }
        },
        calculatePos: function (pos, openOffsetX, openOffsetY, winH, winW, scrollTop, scrollLeft) {
            var tipLeft, tipTop, pointLeft, pointTop = 0;
            if (pos == "top") {
                pointLeft = (this.tipWidth / 2) - this.pointHeight;//default to center horizontally
                pointTop = this.tipHeight - this.pointHeight;
                tipTop = openOffsetY - (this.pointHeight / 2) - this.tipHeight;
                tipLeft = openOffsetX + (this.openWidth / 2) - (this.tipWidth / 2);
                this.$pointer.removeClass("right bottom left").addClass("top");
            } else if (pos == "bottom") {
                pointLeft = (this.tipWidth / 2) - this.pointHeight;
                pointTop = -this.pointHeight;
                tipTop = openOffsetY + this.openHeight + this.pointHeight;
                tipLeft = openOffsetX + (this.openWidth / 2) - (this.tipWidth / 2);
                this.$pointer.removeClass("top right left").addClass("bottom");
            } else if (pos == "left") {
                pointLeft = this.tipWidth - this.pointHeight;
                pointTop = (this.tipHeight / 2) - this.pointHeight;
                tipTop = openOffsetY + (this.openHeight / 2) - (this.tipHeight / 2);
                tipLeft = openOffsetX - this.tipWidth - this.pointHeight;
                this.$pointer.removeClass("top right bottom").addClass("left");
            } else if (pos == "right") {
                pointLeft = -this.pointHeight;
                pointTop = (this.tipHeight / 2) - this.pointHeight;
                tipTop = openOffsetY + (this.openHeight / 2) - (this.tipHeight / 2);
                tipLeft = openOffsetX + this.openWidth + this.pointHeight;
                this.$pointer.removeClass("top bottom left").addClass("right");
            }
            if (pos == "top" || pos=="bottom") {
                if (tipLeft + this.tipWidth - scrollLeft > winW) {//not enough space on right to center horizontally, right align
                    tipLeft = scrollLeft + winW - this.tipWidth;
                    pointLeft = openOffsetX + (this.openWidth / 2) - tipLeft;
                } else if (tipLeft < scrollLeft) {//not enough space on left to center horizontally, left align
                    tipLeft = scrollLeft;
                    pointLeft = openOffsetX + (this.openWidth / 2) - tipLeft;
                }
                
            } else if (pos == "left" || pos == "right") {
                if (tipTop < scrollTop) {//not enough space on top to center vertically, top align
                    tipTop = scrollTop;
                    pointTop = openOffsetY - tipTop;
                } else if ((tipTop + this.tipHeight) > (scrollTop + winH)) {//not enough space on bottom to center vertically, top align
                    tipTop = winH - this.tipHeight + scrollTop;
                    pointTop = openOffsetY - tipTop;
                }
            }
            this.$pointer.css({ "left": pointLeft, "top": pointTop });
            this.$el.css({ "left": tipLeft, "top": tipTop });
        }
    }

    $.fn.tooltip = function (options) {
        var settings = $.extend({
            pointer: '.arrow', //default selector for tooltip pointer
            triggerEvent: 'mouseenter', //default event to bind to, options are mouseenter or click
            close: '.tipClose', //default selector for link to close popup, leave blank if not required
            position: 'top', //default position for tooltip (if enough available space), options are top, right, bottom and left
            delayClose: 200 //for hover event, default delay after mouse moves away from tooltip before closing
        }, options);
        
        return this.each(function () {
            //var tooltip = new Tooltip($(this), settings);
            new Tooltip($(this), settings)
        });
    };
}(jQuery));






