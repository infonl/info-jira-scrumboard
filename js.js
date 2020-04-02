//
// Create a copy-pastable list of issuetitle + links. Easy for in Slack, Powerpoint
// Create a copy-pastable list of HTML-tablerows for testscenarios which can be used in Confluence or any othe HTML page.
//
// click on Backlog-header to open a new tab with the name + link of each issues
// @author Oebe, Stefan
//



// IDEA: if story is Done (.ghx-info span = To Do) , collapse it (.ghx-swimlane needs .ghx-closed)


function appendLink() {
	$('.js-marker-backlog-header .ghx-name').html('Backlog - <u>show copyable list</u>');

	// when clicked on Backlog-header 
	$('.js-marker-backlog-header .ghx-name').on('click', function () {
		var copyText  = '';
		var copyText2 = '';
		var copyText3 = '';
		var copyTextTestScenarioTable = '';
		var copyText5 = '';
		
		$( ".js-issue-list .ghx-selected" ).each(function( index ) {
		
			var storyTitle = $( this ).find('.ghx-summary').text();
			var escapedStoryTitle = storyTitle.replace(/&/g, "&amp;amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
			//console.log(escapedStoryTitle);
			var storyId = $( this ).find('.ghx-key a').text();
			var storyLink = window.location.origin + $( this ).find('.ghx-key a').attr('href');
			var storyPoints = $( this ).find('.ghx-estimate').text();
			
			
			// for POs copy-paste into Slack
			  copyText += storyTitle;
			  copyText += "<br>";
			  copyText += storyLink;
			  copyText += "<br>";
			  
			// for SMs (for Powerpoint presentation)
			  copyText2 += '<b>'+storyTitle + '</b>';
			  copyText2 += "<br>";
			  copyText2 += storyId + ' (' + storyPoints + ' SP) - ' ;
			  copyText2 += "<br>";	 
			  
			// for SMs (for printed stories - JIRA has an option for this as well)
			  copyText5 += '<h2>'+storyTitle + '</h2>';
			  //copyText5 += "<br>";
			  copyText5 += '<h3>' + storyId + ' ' + storyPoints + ' SP</h3>' ;
			  copyText5 += "<br><hr><br>";
			  
			// for POs copy-paste into Slack
			  copyText3 += storyTitle;
			  copyText3 += "<br>";
			  
			// for Testers (for Confluence page)
				copyTextTestScenarioTable += '<tr>\
      <td class="highlight-blue" colspan="5" data-highlight-colour="blue">\
        <div class="content-wrapper">\
          <p> \
            <ac:structured-macro ac:macro-id="e8ecdcdd-735c-46d6-9457-8fb9a71f4600" ac:name="jira" ac:schema-version="1">\
              <ac:parameter ac:name="server">JIRA</ac:parameter>\
              <ac:parameter ac:name="serverId">dc4113ac-c9e8-3325-8d4b-2d59cfd3df7b</ac:parameter>\
              <ac:parameter ac:name="key">'+storyId+'</ac:parameter>\
            </ac:structured-macro>\
          </p>\
          <h4>'+storyId+' - '+escapedStoryTitle+'</h4>\
        </div>\
      </td>\
    </tr>\
    <tr>\
      <th colspan="1">Test user(s) /<br/>Test data</th>\
      <th colspan="1">Scenario/ steps to execute</th>\
      <th colspan="1">Expected result</th>\
      <th colspan="1">Actual result \
      <ac:structured-macro ac:macro-id="9f354d68-9d24-463c-a6da-89e18d4b7b3a" ac:name="status" ac:schema-version="1"> \
              <ac:parameter ac:name="title">Not completed</ac:parameter>\
            </ac:structured-macro>\
      </th>\
      <th colspan="1">Remarks</th>\
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
      <td colspan="1"><br/></td>\
      <td colspan="1"><br/></td>\
      <td colspan="1"><br/></td>\
      <td colspan="1"><br/></td>\
    </tr>\
    <tr>\
      <td colspan="1"><br/></td>\
      <td colspan="1"> \
      Check all the above scenarios in below browsers for a desktop:<br/>\
		- IE11<br/>\
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
    </tr>' + 'newtablerow';
			 
			
		});
		copyTextTestScenarioTable = escapeHtml(copyTextTestScenarioTable)
		
		// make the source a bit readable
		copyTextTestScenarioTable = copyTextTestScenarioTable.replace(/newtablerow/g, "<br/>");
		
		var copyTextAll = copyText + '<br><hr><br>' + copyText2 + '<br><hr><br>' + copyText3 + '<br><hr><br>&lt;!-- start test scenario tablerows --&gt;' + copyTextTestScenarioTable + '&lt;!-- end test scenario tablerows --&gt;<br><hr><br>' + copyText5;
		window.open('about:blank').document.body.innerHTML = copyTextAll;
	});

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
$(function () {
	// wait 2 secs for the navbar / header to popup
	setTimeout(function() {
		$('.aui-nav-item').on('click', function () {
			if ($.contains(this, $('.agile-icon-plan').get(0))) {
				setTimeout(function () {
					appendLink();
				}, 1200);
			}
		});
		appendLink();
	}, 4000); // wait for ajax-list to be loaded.. if link fails to show: increase amount here
});
