//
// Create a copy-pastable list of issuetitle + links. Easy for in Slack.
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
		var copyText4 = '';
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
			  
			// for SMs (for Powerpoint presentation)
			  copyText5 += '<h2>'+storyTitle + '</h2>';
			  //copyText5 += "<br>";
			  copyText5 += '<h3>' + storyId + ' ' + storyPoints + ' SP</h3>' ;
			  copyText5 += "<br><hr><br>";
			  
			// for POs copy-paste into Slack
			
			  copyText3 += storyTitle;
			  copyText3 += "<br>";
			  
			// for Testers (for Confluence page)
				copyText4 += '&lt;tr&gt; \
      &lt;td class="highlight-blue" colspan="6" data-highlight-colour="blue"&gt; \
        &lt;div class="content-wrapper"&gt; \
          &lt;p&gt; \
            &lt;ac:structured-macro ac:macro-id="e8ecdcdd-735c-46d6-9457-8fb9a71f4600" ac:name="jira" ac:schema-version="1"&gt; \
              &lt;ac:parameter ac:name="server"&gt;JIRA&lt;/ac:parameter&gt; \
              &lt;ac:parameter ac:name="serverId"&gt;dc4113ac-c9e8-3325-8d4b-2d59cfd3df7b&lt;/ac:parameter&gt; \
              &lt;ac:parameter ac:name="key"&gt;'+storyId+'&lt;/ac:parameter&gt; \
            &lt;/ac:structured-macro&gt; \
          &lt;/p&gt; \
          &lt;h4&gt;'+storyId+' '+escapedStoryTitle+'&lt;/h4&gt; \
        &lt;/div&gt; \
      &lt;/td&gt; \
    &lt;/tr&gt; \
    &lt;tr&gt; \
      &lt;th colspan="1"&gt;Test data&lt;/th&gt; \
      &lt;th colspan="1"&gt;Test user(s)&lt;/th&gt; \
      &lt;th colspan="1"&gt;Scenario/ steps to execute.&lt;/th&gt; \
      &lt;th&gt;Expected result&lt;/th&gt; \
      &lt;th&gt; \
        &lt;div class="content-wrapper"&gt; \
          &lt;p&gt;Actual result&lt;/p&gt; \
        &lt;/div&gt; \
      &lt;/th&gt; \
      &lt;th colspan="1"&gt;Remarks&lt;/th&gt; \
    &lt;/tr&gt; \
    &lt;tr&gt; \
      &lt;td colspan="1"&gt;&lt;br/&gt;&lt;/td&gt; \
      &lt;td colspan="1"&gt;&lt;p&gt;&lt;br/&gt;&lt;/p&gt;&lt;/td&gt; \
      &lt;td colspan="1"&gt;&lt;br/&gt;&lt;/td&gt; \
      &lt;td colspan="1"&gt;&lt;p&gt;&lt;br/&gt;&lt;/p&gt;&lt;/td&gt; \
      &lt;td colspan="1"&gt; \
        &lt;div class="content-wrapper"&gt; \
          &lt;p&gt; \
            &lt;br/&gt; \
            &lt;span style="color: rgb(0,128,0);"&gt; \
              &lt;br/&gt; \
            &lt;/span&gt; \
          &lt;/p&gt; \
          &lt;p class="checked"&gt; \
            &lt;span style="color: rgb(0,128,0);"&gt; \
              &lt;br class="_mce_tagged_br"/&gt; \
            &lt;/span&gt; \
          &lt;/p&gt; \
        &lt;/div&gt; \
      &lt;/td&gt; \
      &lt;td colspan="1"&gt; \
        &lt;p&gt;&lt;br/&gt;&lt;/p&gt; \
      &lt;/td&gt; \
    &lt;/tr&gt; \
    &lt;tr&gt; \
      &lt;td colspan="1"&gt;&lt;br/&gt;&lt;/td&gt; \
      &lt;td colspan="1"&gt;&lt;br/&gt;&lt;/td&gt; \
      &lt;td colspan="1"&gt; \
        &lt;span style="color: rgb(0,0,0);"&gt;Check all this in IE11 and Firefox.&lt;/span&gt; \
      &lt;/td&gt; \
      &lt;td colspan="1"&gt; \
        &lt;span style="color: rgb(0,0,0);"&gt;All test scenarios must look good in these browsers&lt;/span&gt; \
      &lt;/td&gt; \
      &lt;td colspan="1"&gt; \
        &lt;div class="content-wrapper"&gt; \
          &lt;p&gt; \
            &lt;ac:emoticon ac:name="light-off"/&gt; \
          &lt;/p&gt; \
        &lt;/div&gt; \
      &lt;/td&gt; \
      &lt;td colspan="1"&gt; \
        &lt;br/&gt; \
      &lt;/td&gt; \
    &lt;/tr&gt;' + '<br>';
			 
			
		});
		
		var copyTextAll = copyText + '<br><hr><br>' + copyText2 + '<br><hr><br>' + copyText3 + '<br><hr><br>' + copyText4 + '<br><hr><br>' + copyText5;
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
	// wait 1 sec for the navbar / header to popup
	setTimeout(function() {
		$('.aui-nav-item').on('click', function () {
			if ($.contains(this, $('.agile-icon-plan').get(0))) {
				setTimeout(function () {
					appendLink();
				}, 1200);
			}
		});
		appendLink();
	}, 1000); // wait for ajax-list to be loaded
});
