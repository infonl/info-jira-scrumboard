//
// Create a copy-pastable list of issuetitle + links. Easy for in Slack, Powerpoint
// Create a copy-pastable list of HTML-tablerows for testscenarios which can be used in Confluence or any othe HTML page.
//
// click on Backlog-header to open a new tab with the name + link of each issues
// @author Oebe, Stefan, Leroy, Rinki, Vlad, Javad
//

// =========== configuration : start ===============

// Show the amount of Story Point on the Active Sprints board aka scrumboard
var bShowStoryPointsOnScrumboard = true;

// Adjust the sizes of the columns on the Active Sprints board aka scrumboard
var bAdjustColumnSizesOnScrumboard = true;

// Hide Done subtasks above threshold amount
var doneSubtasksLimit = 5;

/* Test Sceanrios feature ======= */

// Show HTML for Test Scenarios when clicking on Show copyable list
var bShowTestScenarios = true;

// Add rows for browsertest in the Test Scenarios (set to false for backend-teams)
var bAddBrowserchecksInTestScenarios = false;

// set columnheaders in the Test Scenarios
var colHeader1 = 'Test user(s) /<br/>Test data';
var colHeader2 = 'Scenario/ steps to execute';
var colHeader3 = 'Expected result';
var colHeader4 = 'Actual result';
var colHeader5 = 'Remarks';

// Fill in jiraServerId for Confluence macros to JIRA stories
// You can get this ID by looking into the source of a confluence page while you added a JIRA marcro in that page, or ask your admin: https://confluence.atlassian.com/adminjiraserver/finding-your-server-id-938847652.html
var jiraServerId = '';

// =========== configuration : end ===============

var timer;
function appendLink() {
	$('.ghx-mode-planning .js-quickfilter-selector').append('| <span class="customMiniBtn showCopyableListButton">Show copyable list</span>');

	if (bAdjustColumnSizesOnScrumboard) {
		// specific column width for 4 or 5 columns scrumboard
		var iAmountOfColumns = $( "#ghx-column-header-group .ghx-column").length;
		if (iAmountOfColumns == 5 ) {
			// no changes (yet)
		} else {
			// wide - small - small - wide (more space in columns that often have a lot of stories)
			var gridtemplatecolumns = "33% 16% 16% 33%";
			$( ".ghx-rapid-views #gh #ghx-work #ghx-pool-column .ghx-columns, .ghx-rapid-views #gh #ghx-work #ghx-pool-column #ghx-column-headers, .ghx-rapid-views #gh #ghx-work #ghx-pool-column .ghx-zone-overlay-table" ).css("grid-template-columns", gridtemplatecolumns);
		}
	}

	// loop all stories and add SPs to titles
	if (bShowStoryPointsOnScrumboard) {
		$( ".ghx-swimlane" ).each(function( index, val ) {
			var storyId = $( this ).find(".ghx-parent-key").text();

			if (!storyId) {
				return true;
			}

			// get SPs
			var storySP;
			var storyTitle = $( this ).find('.ghx-swimlane-header .ghx-summary');
			var urlParams = new URLSearchParams(window.location.search);
			var rapidViewId = urlParams.get('rapidView');
			
			// get story information
			$.getJSON( "../rest/greenhopper/1.0/xboard/issue/details.json?rapidViewId=" + rapidViewId + "&issueIdOrKey=" + storyId, function( data ) {
				// get SPs
				if (data) storySP = data.tabs.defaultTabs[0].fields[2].value;
				var storyHtml = storyTitle.html();

				// add SPs to title (if it isnt in there already)
				if (storyHtml.indexOf('storyEstimation') === -1) {
					if (typeof storySP == "undefined") {
						storyTitle.html(storyTitle.html() + ' <span class="storyEstimation">unestimated</span>');
					} else {
						storyTitle.html(storyTitle.html() + ' <span class="storyEstimation">' + storySP + ' SP</span>');
					}
				}
			});
		});
	}

	// add Collapse Done Only button
	$('.ghx-column:nth-last-child(1) .ghx-column-title').append(' <span class="customMiniBtn collapseDoneBtn">Collapse Done only</span>');

	// when clicked on "Collapse Done Only" button
	$('.collapseDoneBtn').on('click', function () {
		// loop all stories and expand them all first
		$( ".ghx-swimlane.ghx-closed" ).each(function( index, val ) {
			// collapse all
			$( this ).find(".js-expander").click();
			// ps we're using the .click() here because JIRA has some internal logic connected to it, like storing the setting in memory and localStorage.
		});
		
		// then collapse the Done ones
		$( ".ghx-swimlane" ).each(function( index, val ) {
			
			var	story = $( this )
			// find story status
			var storyStatus = story.find(".jira-issue-status-lozenge").text();

			// Close Done ones
			if (storyStatus == 'Done') {
				$( this ).find(".js-expander").click();
			}
		});
	});

	// when clicked on "Show copyable list"-button
	$('.showCopyableListButton').on('click', function () {

		var jsonDescription = {};
		var counter = 0;
		
		// if no issue selected: select all from sprint
		if ($( ".js-issue-list .ghx-selected" ).length === 0) {
			$( ".ghx-sprint-group .js-issue" ).addClass('ghx-selected');
		}
		
		
		// loop all selected stories
		$( ".js-issue-list .ghx-selected" ).each(function( index) {

			var listlength = $( ".js-issue-list .ghx-selected" ).length;
			var storyId = $( this ).find('.ghx-key a').text();
			var urlParams = new URLSearchParams(window.location.search);
			var rapidViewId = urlParams.get('rapidView');
			
			// get story information
			$.getJSON( "../rest/greenhopper/1.0/xboard/issue/details.json?rapidViewId=" + rapidViewId + "&issueIdOrKey=" + storyId, function( data ) {

				// get Description
				if (data) jsonDescription[storyId] = data.tabs.defaultTabs[2].sections[0].html;
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
    </tr>';

	if (bAddBrowserchecksInTestScenarios) {
  	copyTextTestScenarioTable += '<tr>\
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
    </tr>';
	}

  	copyTextTestScenarioTable += '</table>' + 'newtablerow';


		});	// each : end

			copyTextTestScenarioTable = escapeHtml(copyTextTestScenarioTable)

		// make the source a bit readable
		copyTextTestScenarioTable = copyTextTestScenarioTable.replace(/newtablerow/g, "<br/>");

		var copyTextAll = 'CHAT/MESSAGING (that dont accept links)<br><br>' + copyTextAndLink + '<br><hr>CHAT/MESSAGING/SLACK<br><br>' + copyTextSlack + '<br><hr>PRESENTATIONS<br><br>' + copyTextPresentation + '<br><hr><br>' + copyTextTitles;
		
		// show output in separate tab(s)
		if (bShowTestScenarios) {
			// separate tab for easier copy-pasting
			window.open('about:blank').document.body.innerHTML = '&lt;!-- start test scenario HTML --&gt;<br>' +  copyTextTestScenarioTable;
		}
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

function hideSomeSubtasks() {
			// Hide Done subtasks above threshold amount
		$('.ghx-columns').find('.ghx-column:last').each(function (index) {
			var issues = $(this).find('.ghx-issue');
			var doneCount = issues.length;
			if(doneCount > doneSubtasksLimit) {
				var showButton = issues.eq(doneSubtasksLimit).clone();
				showButton.addClass('showMoreSubtasks');
				showButton.html('Show more (+' + (doneCount - doneSubtasksLimit) + ')');
				$(this).append(showButton);
				showButton.on('click', function(){
					$(this).hide().parent().find('.hiddenSubtask').show();
				})

				issues.each(function(index){
					if(index >= doneSubtasksLimit) $(this).addClass('hiddenSubtask').hide();
				})
			}
		})
}


(function () {

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

		// Reinitiate after a click on the 3rd cell of the (Review?)table header of scrum board (workaround for SPs dissappearing after moving a subtask)
		$(document).on('click', '.ghx-column:nth-child(3) .ghx-column-title', function (e) {
			clearTimeout(timer);
			timer = setTimeout(function() {
				appendLink();
			}, 500)
		})


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

		// Make all ticket links open in a new tab
		$(document).on('click', 'a.js-detailview, a.js-key-link',
			function(e) {
				var href = $(this).attr('href');
				if (href) {
					window.open(href, '_blank');
					e.stopPropagation();
				}
			}
		);

		hideSomeSubtasks();

		appendLink();
	}, 2000); // wait for ajax-list to be loaded.. if link fails to show: increase amount here
})();
