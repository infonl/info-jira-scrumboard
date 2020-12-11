//
// Create a copy-pastable list of issuetitle + links. Easy for in Slack, Powerpoint
// Create a copy-pastable list of HTML-tablerows for testscenarios which can be used in Confluence or any othe HTML page.
//
// click on Backlog-header to open a new tab with the name + link of each issues
// @author Oebe, Stefan, Leroy, Rinki, Vlad, Javad
//

var jiraServerId = ''; // fill for Confluence macros to JIRA stories
var timer;

function appendLoader() {
	//$('.js-marker-backlog-header .ghx-name').append('Backlog - loading copyable list...');
}

function appendLink() {
	$('.js-marker-backlog-header .ghx-name').append(' <span class="customMiniBtn">show copyable list</span>');	

	// specific css for 4 or 5 columns scrumboard
	var iAmountOfColumns = $( "#ghx-column-header-group .ghx-column").length;
	if (iAmountOfColumns == 5 ) {
		// no changes (yet)
	} else {
		// wide - small - small - wide (more space in columns that often have a lot of stories)
		var gridtemplatecolumns = "33% 16% 16% 33%";
		$( ".ghx-rapid-views #gh #ghx-work #ghx-pool-column .ghx-columns, .ghx-rapid-views #gh #ghx-work #ghx-pool-column #ghx-column-headers, .ghx-rapid-views #gh #ghx-work #ghx-pool-column .ghx-zone-overlay-table" ).css("grid-template-columns", gridtemplatecolumns);
	}
	
	// loop all stories and add SPs to titles
	$( ".ghx-swimlane" ).each(function( index, val ) {
		var storyId = $( this ).find(".ghx-parent-key").text();

		if (!storyId) {
			return true;
		}
		
		// get SPs
		var storySP;
		var storyTitle = $( this ).find('.ghx-swimlane-header .ghx-summary');
		
		// get story information
		$.getJSON( "/jira/rest/greenhopper/1.0/xboard/issue/details.json?rapidViewId=88&issueIdOrKey=" + storyId, function( data ) {
			// get SPs
			storySP = data.tabs.defaultTabs[0].fields[2].value;
			
			// add SPs to title
			if (typeof storySP == "undefined") {
				storyTitle.html(storyTitle.html() + " unestimated");
			} else {
				storyTitle.html(storyTitle.html() + ' <span class="storyEstimation">' + storySP + ' SP</span>');
			}
		});
	});

	// add Collapse Done button
	$('.ghx-column:nth-last-child(1) .ghx-column-title').append(' <span class="customMiniBtn">Collapse Done only</span>');
	
	// when clicked on "Collapse Done" button
	$('.ghx-column:nth-last-child(1) .ghx-column-title').on('click', function () {
		
		// loop all stories
		$( ".ghx-swimlane" ).each(function( index, val ) {

			// collapse all
			$( this ).removeClass('ghx-closed');
		
			var	story = $( this )
			// find story status
			var storyStatus = story.find(".jira-issue-status-lozenge").text();
			
			// open In Progress / To do ones
			if (storyStatus == 'Done') {
				$( this ).addClass('ghx-closed');
			}
		});
	});

	// when clicked on Backlog-header 
	$('.js-marker-backlog-header .ghx-name').on('click', function () {
		
		var jsonDescription = {};
		var counter = 0;
		$( ".js-issue-list .ghx-selected" ).each(function( index) {
			
			var listlength = $( ".js-issue-list .ghx-selected" ).length;
			var storyId = $( this ).find('.ghx-key a').text();
			
			// get story information
			$.getJSON( "/jira/rest/greenhopper/1.0/xboard/issue/details.json?rapidViewId=88&issueIdOrKey=" + storyId, function( data ) {
				// get SPs
				jsonDescription[storyId] = data.tabs.defaultTabs[2].sections[0].html;
				counter++;
				
				// only render text if all async processes are done
				if (counter == listlength) {
					RenderText (jsonDescription);
				}
			});
		});
		
	
	});

}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function RenderText (description) {
		var copyTextAndLink  = '';
		var copyTextPresentation = '';
		var copyTextTitles = '';
		var copyTextTestScenarioTable = '';
		var copyTextLarge = '';
		var copyTextSlack = '';
		
		$( ".js-issue-list .ghx-selected" ).each(function( index ) {
		
			var storyTitle = $( this ).find('.ghx-summary').text();
			var escapedStoryTitle = storyTitle.replace(/&/g, "&amp;amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
			//console.log(escapedStoryTitle);
			var storyId = $( this ).find('.ghx-key a').text();
			var storyLink = window.location.origin + $( this ).find('.ghx-key a').attr('href');
			var storyType = $( this ).find('.ghx-type').attr('title');
			var storyPoints = $( this ).find('.ghx-estimate').text();
			
			
			// for POs copy-paste into Slack
			  copyTextAndLink += storyTitle;
			  copyTextAndLink += "<br>";
			  copyTextAndLink += storyLink;
			  copyTextAndLink += "<br>";
			  
			 // for POs copy-paste into Slack
			  copyTextSlack += '<a href="' + storyLink + '">';
			  copyTextSlack += storyId + '</a> - ' + storyTitle + " (" + storyPoints + ")";
			  copyTextSlack += "</a>";
			  copyTextSlack += "<br>";
			
			// for SMs (for Powerpoint presentation)
			  copyTextPresentation += '<b>'+storyTitle + '</b>';
			  copyTextPresentation += "<br>";
			  copyTextPresentation += storyId + ' (' + storyPoints + ' SP) - ' ;
			  copyTextPresentation += "<br>";	 
			  
			// for SMs (for printed stories - JIRA has an option for this as well)
			  copyTextLarge += '<h2>'+storyTitle + '</h2>';
			  copyTextLarge += '<h3>' + storyId + ' ' + storyPoints + ' SP</h3>' ;
			  copyTextLarge += "<br><hr><br>";
			  
			// for POs copy-paste clean list
			  copyTextTitles += storyTitle;
			  copyTextTitles += "<br>";
			  
			// for Testers (for Confluence page)
				var colHeader1 = 'Test user(s) /<br/>Test data';
				var colHeader2 = 'Scenario/ steps to execute';
				var colHeader3 = 'Expected result';
				var colHeader4 = 'Actual result';
				var colHeader5 = 'Remarks';
			
				copyTextTestScenarioTable += '<h2>'+storyId+' - '+escapedStoryTitle+'</h2>\
	<table><tr>\
      <td class="highlight-blue" colspan="5" data-highlight-colour="blue">\
        <div class="content-wrapper">\
          <p> \
            <ac:structured-macro ac:macro-id="e8ecdcdd-735c-46d6-9457-8fb9a71f4600" ac:name="jira" ac:schema-version="1">\
              <ac:parameter ac:name="server">JIRA</ac:parameter>\
              <ac:parameter ac:name="serverId">'+jiraServerId+'</ac:parameter>\
              <ac:parameter ac:name="key">'+storyId+'</ac:parameter>\
            </ac:structured-macro>\
          </p>\
        </div>\
      </td>\
    </tr>\
    <tr>\
      <th colspan="1">'+colHeader1+'</th>\
      <th colspan="1">'+colHeader2+'</th>\
      <th colspan="1">'+colHeader3+'</th>\
      <th colspan="1">'+colHeader4+' \
      <ac:structured-macro ac:macro-id="9f354d68-9d24-463c-a6da-89e18d4b7b3a" ac:name="status" ac:schema-version="1"> \
              <ac:parameter ac:name="title">Not completed</ac:parameter>\
            </ac:structured-macro>\
      </th>\
      <th colspan="1">'+colHeader5+'</th>\
    </tr>\
    <tr>\
      <td colspan="1"><br/></td>\
      <td colspan="1">'+description[storyId]+'</td>\
      <td colspan="1"><br/></td>\
      <td colspan="1"><br/></td>\
      <td colspan="1"><br/></td>\
    </tr>\
    <tr>\
      <td colspan="1"><br/></td>\
      <td colspan="1"><br/></td>\
      <td colspan="1"><br/></td>\
      <td colspan="1"><br/></td>\
      <td colspan="1"><br/></td>\
    </tr>\
    <tr>\
      <td colspan="1"><br/></td>\
      <td colspan="1"> \
      Check all the above scenarios in below browsers for a desktop:<br/>\
		- IE11 (not supported, but tested for awareness)<br/>\
		- Edge<br/>\
		- Firefox<br/>\
		- Mac Safari<br/>\
      </td>\
      <td colspan="1">All test scenarios must look good in these browsers, devices.</td>\
      <td colspan="1"><br/></td>\
      <td colspan="1"><br/></td>\
    </tr>\
    <tr>\
      <td colspan="1"><br/></td>\
      <td colspan="1">\
      Check all the above scenarios in below browsers for a Android mobile devices:<br/> \
		- iPad Air 2/ iPad 2017, Safari, landscape<br/> \
		- iPad Air 2/ iPad 2017, Safari, portrait \
      </td>\
      <td colspan="1">All test scenarios must look good in these browsers, devices.</td> \
      <td colspan="1"><br/></td>\
      <td colspan="1"><br/></td>\
    </tr>\
    <tr>\
      <td colspan="1"><br/></td>\
      <td colspan="1"> \
		Check all the above scenarios in below browsers for a iOS mobile devices:<br/>\
		- iPhone 8, Safari, iOS11, portrait <br/>\
		- iPhone 8, Safari, iOS11, landscape\
      </td>\
	  <td colspan="1">All test scenarios must look good in these browsers, devices.</td>\
      <td colspan="1"><br/></td>\
      <td colspan="1"><br/></td>\
    </tr>\
    <tr>\
      <td colspan="1"><br/></td>\
      <td colspan="1">\
      Check the 3 languages:<br/>\
		- English<br/>\
		- Dutch<br/>\
		- French\
      </td>\
      <td colspan="1">Languages must be correct on the web page.</td>\
      <td colspan="1"><br/></td>\
      <td colspan="1"><br/></td>\
    </tr>\
    <tr>\
      <td colspan="1"><br/></td>\
      <td colspan="1">Check in PDF</td>\
      <td colspan="1">\
        Changes must be correct and in sync with PDF in all languages \
      </td>\
      <td colspan="1"><br/></td>\
      <td colspan="1"><br/></td>\
    </tr></table>' + 'newtablerow';
			 
			
		});	// each : end
		
			copyTextTestScenarioTable = escapeHtml(copyTextTestScenarioTable)
		
		// make the source a bit readable
		copyTextTestScenarioTable = copyTextTestScenarioTable.replace(/newtablerow/g, "<br/>");
		
		var copyTextAll = copyTextAndLink + '<br><hr><br>' + copyTextSlack + '<br><hr><br>' + copyTextPresentation + '<br><hr><br>' + copyTextTitles + '<br><hr>&lt;!-- start test scenario  --&gt;' + copyTextTestScenarioTable + '&lt;!-- end test scenario html --&gt;<br><br><hr><br>' + copyTextLarge;
		window.open('about:blank').document.body.innerHTML = copyTextAll;
}

function escapeHtml(text) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}


(function () {
	// show loader
	setTimeout(function() {
		appendLoader();
	}, 500); 
	
	// wait 2 secs for the navbar / header to popup
	setTimeout(function() {
		$('.aui-nav-item').on('click', function () {
			// click on Backlog view button
			//if ($.contains(this, $('.agile-icon-plan').get(0))) {
				setTimeout(function () {
					appendLink();
				}, 1200);
		//	}
		});
		
		// change of Quick filter or Release/Epic
		$(document).on('click', '.js-quickfilter-button, .ghx-classification-item', function (e) {
			clearTimeout(timer);
			timer = setTimeout(function() {
				appendLink();
			}, 2000)
		})		
		// change of search-filter (at left side of Quick filters)
		$(document).on('blur', '#ghx-backlog-search-input', function (e) {
			clearTimeout(timer);
			timer = setTimeout(function() {
				appendLink();
			}, 2000)
		})

		appendLink();
	}, 2000); // wait for ajax-list to be loaded.. if link fails to show: increase amount here
})();
