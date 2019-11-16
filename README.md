# jira-scrumboard
Tweaking the JIRA scrumboard.

Requires a Chrome extension (User JavaScript and CSS) which allows you to inject your own JavaScript and CSS rules to any page, like your JIRA page. So this tweak does not require any change in JIRA, since it's not a JIRA plugin.

Active Sprints board
===========================
- Adapt the Active Sprints-board so more issues fit on. 
- Creates 2-1-1-2 columns instead of 1-1-1-1 and reduces the height of a card

Condensed High Contract-view (press Z multiple times). 
Optimal for larger screens for Daily Scrums/Daily standups.
- Creates 3-1-1-3 columns 
- Hides IDs, labels and priorities of subtasks: more space for titles + assignees
- Hides Details-pane to create a steady, non-moving screen while dragging (press Z to show/hide Details pana, use A to assign people)


Backlog
=====================
- Create a copy-pastable list of issuetitles + links. Easy for in Slack/Mail (share list of stories that need refinement) and Powerpoint/Keynote (List stories in the Sprint Review presentation)
- Experimental: HTML blocks for adding a test-results table to Confluence/wiki
- Click on Backlog-header to open a new tab with the name + link of each issues
(if this link doesn't show up: refresh the page)

Install
=====================
1. Download Zip from this repo (green button)
2. Unzip zipfile and extract user-js-css-v8-xxxxxx.json file 
3. install 'User JavaScript and CSS' extension for Chrome
https://chrome.google.com/webstore/detail/user-javascript-and-css/nbhcbdghjpllgmfilhnhkllmkecfmpld?hl=en
4. Click 'User JavaScript and CSS' icon 
5. Go to Settings -> Settings
6. Choose 'Upload and Apply' under Backup if you did not use this plugin before
7. Select user-js-css-v8-xxxxxx.json file that you downloaded -> this should upload some settings and some css/js for your JIRA
8. Edit the url under the Sites-tab -> should become your JIRA url

Refresh page with JIRA opened.. and have fun!

ps css.css and js.js are updated more frequently than the settings-file since that is easier to update for us. So we recommend updating your freshly installed version with the procedure below.

Update
=====================
To get the lastest version:
1. Go to your JIRA
2. Click 'User JavaScript and CSS' icon 
3. Open the two panes (js/css) in the plugin
4. Open https://raw.githubusercontent.com/infonl/jira-scrumboard/master/css.css And copy-paste content in the CSS pane. This will replace the old css.
5. Open https://raw.githubusercontent.com/infonl/jira-scrumboard/master/js.js And copy-paste content in the JS pane. This will replace the old js.
6. Save

Go to your JIRA and refresh page and have fun!

Happy paperless standups!




