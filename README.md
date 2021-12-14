# Filter Menu Plugin
This repository is a reference to the backend code for a working sample of an AngularJS filter menu plugin. The plugin is designed to streamline the process of writing a UI for filtering tabular report data. The core files for the plugin are: 
/includes/filter_menu.php
 - Generates the AngularJS model for the filter menu UI
/lib_js/filter_menu.js
 - Generates the AngularJS controller for the filter menu UI
 - Creates 'shareFact' factory exposing selected filters and queried data to developer's controllers
 - Receives filter menu UI config as JSON object
/pages/mkt/mkt.php
 - Example implementation
 - Defines custom controller for user data which keys off methods in 'shareFact'
/pages/mkt/mkt.php
 - Example generation of filter menu UI JSON config


## Sample Site
You can view a sample of the plugin in action with test data at <a href="https://metdatmgmt.com/filter_menu_plugin/pages/mkt/mkt.php" target="_blank">This Link</a>. To login, username="test_user", password="test_pw".
