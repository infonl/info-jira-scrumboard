# jira-scrumboard
Tweaking the JIRA scrumboard.

We used a Chrome extension (User JavaScript and CSS) which allows you to inject your own JavaScript and CSS rules to any page, like your JIRA page. So this tweak does not require any change in JIRA, since its not a JIRA plugin.

Active Sprints board
===========================
- Adapt the Active Sprints-board so more issues fit on. 
- Creates 2-1-1-2 columns instead of 1-1-1-1 and reduces the height of a card
- Show even more condensed version of Active Sprints board with in High Contract-view (press Z multiple times). Optimal for larger screens for Daily Scrums/Daily standups.
-- Creates 3-1-1-3 columns 
-- hides Details-pane (press Z to show/hide it)


Backlog
=====================
- Create a copy-pastable list of issuetitle + links. Easy for in Slack and Powerpoint (Sprint Review presentation)
- Click on Backlog-header to open a new tab with the name + link of each issues

Install / update
=====================
0. Download user-js-css-v8-xxxxxx.json file from this repo
1. install 'User JavaScript and CSS' extension for Chrome
https://chrome.google.com/webstore/detail/user-javascript-and-css/nbhcbdghjpllgmfilhnhkllmkecfmpld?hl=en
2. Click 'User JavaScript and CSS' icon 
3. Go to Settings -> Settings
4. Choose 'Upload and Apply' under Backup if you did not use this plugin before
5. Select user-js-css-v8-xxxxxx.json file that you downloaded -> this should upload some settings and some css/js for your JIRA
6. Edit the url under the Sites-tab -> should become your JIRA url

Refresh page with JIRA opened.. and have fun!

To get the lastest version:
7. Go to your JIRA
8. Click 'User JavaScript and CSS' icon 
9. Copy-paste content of css.css and js.js into the two panes in the plugin
10. Save
11. Go to your JIRA and refresh page

ps css.css and js.js are updated more frequently than the settings-file since that is easier to update.


