/************************************** Splendid *************************************
* Created By:		Ed Hasting-Evans
* Creation Date:	22th January 2011
* Edited ----------------------------------------------------------------------------
*       By:              On:  
* Description -----------------------------------------------------------------------
*       Created tabbed navigation in an accessible way.
*
*       Dependancies:
*       - JQuery plugin v1.4.1
*
*       Usage:
*       HTML The ID in the HREF Must match the id of the content div's to work
*        <ul>
*		 	<li id="tabOne"><a href="#areaGuide" id="tabOne">The D&amp;G area guides</a></li> // In the HTML <a> is an anchor to the div
*			<li id="tabTwo"><a href="#ourOffices">Where are our offices?</a></li>
*			<li id="tabThree"><a href="#weCover">The area we cover</a></li>
*		</ul>
*       <div class="infoArea" id="areaGuide">
*       	Tab 1 content
*       </div>
*       
*       Page JS
*		splendid.tabbedContent({
*			targetDiv : '#tabbedContent', 							// ID of div that the tabbed content lives in
*			tabSelectedClass : 'current', 							// The class for the selected state of the tab
*			content : ['#areaGuide', '#ourOffices', '#weCover'],  	// IDs of the divs you wish to hide, first item is given the selected state (so is visible)
*			targetTab: '#tabTwo',  									// It will add the above defined selected class to this tab
*			selectedDiv: '#ourOffices' 								// It will make this content visible on load
*		});
*          
**************************************************************************************/

/* CHECKS AND IF MISSING CREATES splendid NAMESPACE */ 
if(!splendid) {
	// Binds a 'splendid' namespace version of $ for jQuery so you can use other libraries without conflict, e.g. jQuery.noConflict();...
	var splendid={jQueryShortCut: $ = jQuery};
}


splendid.tabbedContent = function(options) {
	
	// Default settings (can be overwritten)
	var settings = {
		count: 0, // Used to count through the tabbed divs to hide
		tabSelectedClass: 'selected', // default class name for the selected tab
		selectedDiv: options.content[0] // makes the first div, as set in the options object, the current selected item
	};
	
	var methods = {
		init: function() {
				// Hides tabbed content on load	
				for(count=0; count<=settings.content.length; count++) {
					$(settings.content[count]).css('display', 'none');
				}
				
				// Creates selected tabs and content
				$(settings.targetTab).addClass(settings.tabSelectedClass); // Adds selected class to the specified tab
				$(settings.selectedDiv).css('display', 'block'); // Makes the relevant content block visible
				
				// Adds click events to the a tags
				methods.addClickHandler();
			},
			
		addClickHandler: function() {
				// Adds click events to the various tabs
				$(settings.targetDiv + ' li a').click(function(event){
				    // Pulls the DIV ID from the URL string
					var theLink = this;
					var linkParent = $(this).parent().attr('id');
					var currentTab = '#' + linkParent;
					
					var tabToShow = function() {
			          	var theURL = '[\\#]([^&#]*)';
			          	var regex = new RegExp(theURL);
			          	var tabHrefID = regex.exec(theLink);
			        	return tabHrefID[0];
			        };
					
					// Passes the information to the clickEvent method
			        methods.clickEvent(tabToShow(), currentTab);
			        
			        // Kills the default link behaviour so the URL is consistent (otherwise it adds #[ID] to the URL)
			        return false;
				});
			},
			
		clickEvent: function(theDiv, theTab) {
				if(theDiv != settings.selectedDiv) {			
					$(settings.selectedDiv).css('display', 'none'); // Hides the current view
					$(theDiv).css('display', 'block'); // Shows the next view
					settings.selectedDiv = theDiv; // Sets the newly shown div as the current selected div
					
					// Changes the class on the tabs
					$(settings.targetTab).removeClass(settings.tabSelectedClass);
					$(theTab).addClass(settings.tabSelectedClass);
					settings.targetTab = theTab;
				}
			}
	};
	
	// Overwrites the default settings with those defined in the function call (options object)
	if (options) { 
		$.extend(settings, options);
    }
	
	// Executes the code
	methods.init();
	
	// Returns 'this'
	return this;
};





