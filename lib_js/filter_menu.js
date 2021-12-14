/*----------------------------------------------------DESCRIPTION---------------------------------------------------------//
# This plugin defines the controller and jQuery behavior for the AngularJS filter menu tool
//------------------------------------------------------------------------------------------------------------------------*/


/*---------------------------------------------------USAGE INSTRUCTIONS---------------------------------------------------//
#	- In the following instructions, replace "path_to_php" and "path_to_js" with the directories of your .php and .js
#		filter menu files, respectively.
#	- In your PHP file, define your data controller within the php functions ob_start() and ob_get_clean(), then include filter_menu.php, like so:

		ob_start() ?>
		[DATA CONTROLLER DOM APPLIED HERE]
		<?php
		$filter_dom_append = ob_get_clean();
		include($_SERVER['DOCUMENT_ROOT'] . '/path_to_php/filter_menu.php');

#	- Include filter_menu.js with parameters in your JavaScript includes

		<script src="/filter_menu_plugin/lib_javascript/angular.min.js?modtime=<?php echo filemtime($_SERVER['DOCUMENT_ROOT'] . '/filter_menu_plugin/lib_javascript/angular.min.js'); ?>"></script>
		<script src="/filter_menu_plugin/lib_javascript/angular-message.min.js?modtime=<?php echo filemtime($_SERVER['DOCUMENT_ROOT'] . '/filter_menu_plugin/lib_javascript/angular-message.min.js'); ?>"></script>
		<script src="/filter_menu_plugin/lib_javascript/ui-bootstrap-tpls-1.1.0.js?modtime=<?php echo filemtime($_SERVER['DOCUMENT_ROOT'] . '/filter_menu_plugin/lib_javascript/ui-bootstrap-tpls-1.1.0.js'); ?>"></script>
		<script src="/filter_menu_plugin/lib_javascript/bootstrap/bootstrap.min.js?modtime=<?php echo filemtime($_SERVER['DOCUMENT_ROOT'] . '/filter_menu_plugin/lib_javascript/bootstrap/bootstrap.js'); ?>"></script>
		<script src="/filter_menu_plugin/lib_javascript/filter_menu.js?modtime=<?php echo filemtime($_SERVER['DOCUMENT_ROOT'] . '/filter_menu_plugin/lib_javascript/filter_menu.js'); ?>" queries="hourly_moves_queries.php"></script>
		<script src="/filter_menu_plugin/lib_javascript/ajax_popup.js?modtime=<?php echo filemtime($_SERVER['DOCUMENT_ROOT'] . '/filter_menu_plugin/lib_javascript/ajax_popup.js'); ?>"></script>
		<script src="/filter_menu_plugin/lib_javascript/drag_element.js?modtime=<?php echo filemtime($_SERVER['DOCUMENT_ROOT'] . '/filter_menu_plugin/lib_javascript/drag_element.js'); ?>"></script>
		
		
		<script src="/path_to_js/filter_menu.js?modtime=<?php echo filemtime($_SERVER['DOCUMENT_ROOT'] . '/path_to_js/filter_menu.js'); ?>" 	queries="my_queries.php" autoload="true"></script>

#	- Note that the queries parameter can be used to reference a php source for the filter menu config other than the default "queries.php"
//------------------------------------------------------------------------------------------------------------------------*/


/*---------------------------------------DEFINE DEFAULT VALUES FOR INPUT PARAMETERS---------------------------------------*/
var autoload = document.scripts[document.scripts.length-1].getAttribute('autoload') || null;
var query_file = document.scripts[document.scripts.length-1].getAttribute('queries') || 'queries.php';
/*------------------------------------------------------------------------------------------------------------------------*/


/*-----------------------------------------------INSTANTIATE ANGULARJS APP------------------------------------------------*/
var app = angular.module('filter_app', ['ui.bootstrap','ngMessages']);
/*------------------------------------------------------------------------------------------------------------------------*/


/*-----------------------------------------------DEFINE REQUIRED FUNCTIONS------------------------------------------------*/
// detect_ie: detects whether browser is internet explorer or not
if(typeof detect_ie !== 'function')
{
	function detect_ie() 
	{
		var ua = window.navigator.userAgent;
		return ua.indexOf("MSIE ") > -1 || ua.indexOf('Internet Explorer') > -1 || ua.indexOf('Trident/7.0') > -1 || ua.indexOf('rv:11.0') > -1;
	}
}

// format_datetime: Convert JavaScript date values to formatted string
if(typeof format_datetime !== 'function')
{
	function format_datetime(d, f) {
		d = d || new Date();
		f = f || 'YmdHis';
		date_arr = [];
		time_arr = [];
		if(detect_ie()) {
			let arr = new Intl.DateTimeFormat('en', {hour: '2-digit', hour12: false, second: 'numeric'}).format(d).split(' ');
			date_arr = arr[0].split('/');
			let ye = date_arr[2];
			let mo = date_arr[0];
			let da = date_arr[1];
			mo = mo.length == 3 ? '0' + mo : mo;
			da = da.length == 3 ? '0' + da : da;
			
			time_arr = arr[1].split(':');
			let hr = time_arr[0];
			hr = hr.length == 3 ? '0' + hr: hr;
			let mi = time_arr[1];
			mi = mi.length == 3 ? '0' + mi: mi;
			let se = time_arr[2];
			se = se.length == 3 ? '0' + se: se;

			date_arr = [];
			time_arr = [];

			if(f.indexOf('Y') > -1){date_arr.push(ye);}
			if(f.indexOf('m') > -1){date_arr.push(mo);}
			if(f.indexOf('d') > -1){date_arr.push(da);}
			if(f.indexOf('H') > -1){time_arr.push(hr);}
			if(f.indexOf('i') > -1){time_arr.push(mi);}
			if(f.indexOf('s') > -1){time_arr.push(se);}
		} else {
			if(f.indexOf('Y') > -1)
			{
				let ye = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(d);
				date_arr.push(ye);
			}
			
			if(f.indexOf('m') > -1)
			{
				let mo = new Intl.DateTimeFormat('en', {month: '2-digit'}).format(d);
				date_arr.push(mo);
			}
			
			if(f.indexOf('d') > -1)
			{
				let da = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(d);
				date_arr.push(da);
			}

			if(f.indexOf('H') > -1)
			{
				let hr = new Intl.DateTimeFormat('en', {hour: 'numeric', hour12: false}).format(d);
				hr = hr.length == 1 ? "0" + hr : hr;
				time_arr.push(hr);
			}
			
			if(f.indexOf('i') > -1)
			{
				let mn = new Intl.DateTimeFormat('en', {minute: 'numeric'}).format(d);
				mn = mn.length == 1 ? "0" + mn : mn;
				time_arr.push(mn);
			}
			
			if(f.indexOf('s') > -1)
			{
				let sc = new Intl.DateTimeFormat('en', {second: 'numeric'}).format(d);
				sc = sc.length == 1 ? "0" + sc : sc;
				time_arr.push(sc);
			}

		}

		ret_arr = [];
		if(date_arr.length > 0){ret_arr.push(date_arr.join('-'));}
		if(time_arr.length > 0){ret_arr.push(time_arr.join(':'));}
		return ret_arr.join(' ');
	}
}

// formatNumber: Converts JavaScript numeric values to formatted strings
if(typeof formatNumber !== 'function')
{
	function formatNumber(x, d) {
		d = d || 0;
		let scale = Math.pow(10, d);
		let val = parseFloat((Math.round(x*scale)/scale)).toFixed(d).toLocaleString();
		let val_split = val.toString().split('.');
		val = val_split[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		if(typeof val_split[1] !== 'undefined')
			{val = val + '.'+val_split[1];}
		return val;
	}
}
/*------------------------------------------------------------------------------------------------------------------------*/

/*------------------------------FILTER: FILTER OBJECT FOR UNIQUE LIST OF VALUES BY SINGLE KEY-----------------------------*/
app.filter('unique', function() {
	return function(data, col){
		if(typeof data != 'undefined')
		{
			let col_vals = data.map(function(d){return d[col];});
			let result = data.filter(function(d,i){return i == col_vals.indexOf(d[col]);});
			return result;
		} else 
			{return data;}
	}
});
/*------------------------------------------------------------------------------------------------------------------------*/


/*----------------------------------------FILTER: CONVERT TEXT STRING TO TITLE CASE---------------------------------------*/
app.filter('titleCase', function() {
	return function(str) {
		str = str || '';
		return str.replace(/^_*(.)|_+(.)/g, function(s, c, d){return c ? c.toUppderCase() : ' ' + d.toUppderCase();});
	};
});
/*------------------------------------------------------------------------------------------------------------------------*/


/*---------------------------FACTORY: EXPOSE DATA, CONFIGS, AND METHODS TO EXTERNAL CONTROLLERS---------------------------*/
app.factory('shareFact', function(){
	return {
		data: [],
		options: {}, 
		filter_options: {}, 
		selections: {}, 
		data_timeout: function(){}, 
		filter_timeout: function(){}, 
		el_recompile: function(){}, 
		refresh_data: function(){}
	};
});
/*------------------------------------------------------------------------------------------------------------------------*/


/*--------------------------------------------DEFINE CONTROLLER FOR FILTER MENU-------------------------------------------*/
// Key $scope variables:
// 		filter_options: Container for all filter menu input configs and data
//		filter_selections: Container for all selections, to be passed to the shared factory and used in data controller
app.controller('filter_ctl', FilterCtl);
FilterCtl.$inject = ['$scope','$http','$uibModal','$interval','$timeout','$compile','shareFact'];
function FilterCtl($scope, $http, $uibModal, $interval, $timeout, $compile, shareFact){
	var headers = {'Content-Type': 'application/x-www-form-urlencoded'};
	var config = {headers: {'Content-Type' : 'application/x-www-form-urlencoded;charset=utf-8;'}};


	/*------------------------------------SIMPLE INDCATOR TO SHOW USER DATA IS LOADING------------------------------------*/
	ellipses = $interval(function(){
		let dt = new Date();
		$scope.ellipses = '.'.repeat(Math.ceil((dt.getSeconds()*1000+dt.getMilliseconds())/500) % 4);
	}, 500)
	/*--------------------------------------------------------------------------------------------------------------------*/


	/*--------------------------------------------CONNECT CONTROLLER TO FACTORY-------------------------------------------*/
	$scope.share_data = shareFact;
	/*--------------------------------------------------------------------------------------------------------------------*/

	
	/*----------------------------------------SCOPE FUNCTION: DYNAMICALLY PULL DATA---------------------------------------*/
	$scope.query = function(action, params){
		params = params || {};
		switch(action){
			// load_filter_options call receives a JSON config which defines which controls to add to the filter menu and 
			// which options to populate in controls such as multi-select inputs.
			// JSON PARAMETERS:
			//		filter_options: Defines config and data for filter menu controls
			//			flt_select_lists: Object defining <select> elements to display and their configs
			//				[KEYS] - Each key represents a distinct <select> element. flt_select_lists keys will be used
			//							as headers above each <select> control
			//					sort_desc: If defined, reverses the sort order of values in the <select> element
			//					single_select: Limits each <select> element to single-select (multi-select is default)
			//					subset_selector: List of named subsets of the values shown in each <select> element
			//										Allows users to reduce the number of displayed options on 
			//										the filter menu.
			//						id: Unique ID identifying each subset of values
			//						text: Text to be displayed in the subset dropdown control on the filter menu
			//						subset: array of values representing the subset of the <select> element values to
			//									display when the given option is selected from the subset_selector
			//					remove_selectall: By default, each <select> element has the "ALL" option prepended as 
			//										its first value. This parameter removes the "ALL" value.
			//					vals: List of items to display in each <select> element
			//			show_lists: Boolean value indicating whether or not to display the <select> section of
			//							the filter menu DOM element
			//
			//			flt_radio_lists: Object defining radio <input> elemets to display and their configs
			//				[KEYS] - Each key represents a distinct set of input <radio> controls. flt_radio_lists keys 
			//							will be used as headers above each set of input <radio> controls
			//					init: Identifies the default selected input <radio> control when the filter menu DOM 
			//							element is first written
			//					vals: List of key-value pairs where the keys represent the text to be displayed next
			//							to each radio button, and the value is the value it represents in the 
			//							filter menu controller.
			//			show_radios: Boolean value indicating whether or not to display the radio <input> section of 
			//							the filter menu DOM element 
			//
			//			flt_checkboxes: Object defining checkbox <input> elements to display and their configs
			//				[KEYS] - Each key represents a distinct checkbox control. flt_checkboxes keys 
			//							will be used as the text valu to display next to each checkbox.
			//				[VALUES] - Each value is a boolean indicating whether the checkbox should be checked 
			//							by default.
			//			show_checkboxes: Boolean value inidicating whether or not to display the checkbox <input> section 
			//								the filter menu DOM element
			//
			//			flt_report_start: For reports that require an adjustable reporting period, represents the start
			//								date and time for the default reporting period.
			//			flt_report_end: For reports that require an adjustable reporting period, represents the end
			//								date and time for the default reporting period.
			//
			//		debug_mode: Boolean value. When TRUE, displays the filter_options and filter_selections objects
			//					in the DOM.
			case 'load_filter_options':
				$scope.filters_loading = true;
				var obj = {action: action};
				obj.ie_browser = detect_ie();
				var retdata = $http({
					method: 'POST', 
					url: query_file, 
					data: JSON.stringify(obj), 
					headers: headers
				}).then(function(response) {
						console.log({load_filters_success:response, data:response['data']});
						filter_options = response['data']['filter_options'];
						$scope.title = typeof filter_options.title != 'undefined' ? filter_options.title : 'Select Filters';
						filter_selections = {};
						if(typeof filter_options.flt_select_lists != 'undefined')
						{
							filter_options.show_lists = true;
							filter_selections.flt_select_lists = {};
							filter_selections.flt_select_list_subsets = {};
							for(idx in filter_options.flt_select_lists)
							{
								sort_coeff = typeof filter_options.flt_select_lists[idx].sort_desc != 'undefined' ? 1 : -1;
								if(typeof filter_options.flt_select_lists[idx].no_sort == 'undefined')
									{filter_options.flt_select_lists[idx].vals.sort(function(a, b){return a < b ? 1*sort_coeff : -1*sort_coeff;});}
								if(typeof filter_options.flt_select_lists[idx].single_select == 'undefined' && typeof filter_options.flt_select_lists[idx].remove_selectall == 'undefined')
								{
									filter_options.flt_select_lists[idx].vals.unshift('ALL');
									filter_selections.flt_select_lists[idx] = ['ALL'];
								}
								
								if(typeof filter_options.flt_select_lists[idx].subset_selector != 'undefined')
								{
									$scope.subset_selectors = $scope.subset_selectors + 1;
									filter_options.flt_select_lists[idx].subset_selector.push({id:-1, text:'Show All', subset:[]});
									filter_options.flt_select_lists[idx].subset_selector.sort(function(a, b){return a.text < b.text ? -1 : 1;});
									filter_options.flt_select_lists[idx].subset_selector.sort(function(a, b){return a.id == -1 ? -1 : 1;});
									for(ss_idx in filter_options.flt_select_lists[idx].subset_selector)
									{
										filter_options.flt_select_lists[idx].subset_selector[ss_idx].subset.sort(function(a, b){return a < b ? -1 : 1;});
									}
								}
							}
						} else 
							{filter_options.show_lists = false;}
						
						if(typeof filter_options.flt_radio_lists != 'undefined')
						{
							filter_options.show_radios = true;
							filter_selections.flt_radio_lists = {};
							for(idx in filter_options.flt_radio_lists)
							{
								filter_selections.flt_radio_lists[idx] = '';
								if(typeof filter_options.flt_radio_lists[idx].init == 'undefined')
								{
									filter_options.flt_radio_lists[idx].init = filter_options.flt_radio_lists[idx][0];
									filter_selections.flt_radio_lists[idx] = filter_options.flt_radio_lists[idx][0];
								} else 
									{filter_selections.flt_radio_lists[idx] = filter_options.flt_radio_lists[idx].init;}
							}
						} else 
							{filter_options.show_radios = false;}
						
						if(typeof filter_options.flt_checkboxes != 'undefined')
						{
							filter_options.show_checkboxes = true;
							filter_selections.flt_checkboxes = {};
							for(idx in filter_options.flt_checkboxes)
							{
								filter_selections.flt_checkboxes[idx] = filter_options.flt_checkboxes[idx];
							}
							
						}
						else 
							{filter_options.show_checkboxes = false;}
									 
						if(typeof filter_options.flt_report_start != 'undefined' && typeof filter_options.flt_report_end != 'undefined')
						{
							if(typeof filter_options.reporting_period_mode != 'undefined' && filter_options.reporting_period_mode == 'fiscal')
								{filter_options.show_fiscal_reporting_period = true;}
							else
								{filter_options.show_reporting_period = true;}
							if(detect_ie())
							{
								let s = filter_options.flt_report_start;
								filter_selections.flt_report_start = new Date(s['Y'], s['m'], s['d'], s['H'], s['i'], s['s']);
								let e = filter_options.flt_report_end;
								filter_selections.flt_report_end = new Date(e['Y'], e['m'], e['d'], e['H'], e['i'], e['s']);
							} else {
								filter_selections.flt_report_start = new Date(filter_options.flt_report_start);
								filter_selections.flt_report_end = new Date(filter_options.flt_report_end);
							}
						}

						$scope.filter_options = filter_options;
						$scope.share_data.filter_options = $scope.filter_options;
						$scope.filter_selections = filter_selections;
						$scope.share_data.selections = filter_selections;
						if(autoload !== null)
							{$scope.query('run_report');}
						$scope.filters_loading = false;
						$scope.filters_loaded = true;
						$timeout(function(){
							$scope.share_data.filter_timeout();
						}, 0);
				}, function(response) {
						console.log({load_modules_fail:response});
						$scope.filters_loading = false;
				});
				break;
			// load_calendar call receives a JSON object representing a fiscal calendar for which each month begins and ends
			// by an integer number of weeks (Months begin and end between Sundays & Saturdays). Enables a custom date & time
			// selector interface as an alternative to conventional date <input> elements
			case 'load_calendar':
				var obj = {action: action};
				var retdata = $http({
					method: 'POST', 
					url: '/filter_menu_plugin/includes/calendar_map.php', 
					data: JSON.stringify(obj), 
					headers: headers
				}).then(function(response) {
						console.log({load_calendar_success:response});
						$scope.months = response['data']['calendar'];
						$scope.month_list = Object.keys($scope.months).map(function(k){return $scope.months[k].text;});
						$scope.level = response['data']['level'];
						for(m in $scope.months)
						{
							$scope.months[m]['s'] = $scope.string_to_date($scope.months[m]['s']);
							$scope.months[m]['e'] = $scope.string_to_date($scope.months[m]['e']);
							if($scope.level > 1)
							{
								for(w in $scope.months[m]['weeks'])
								{
									$scope.months[m]['weeks'][w]['s'] = $scope.string_to_date($scope.months[m]['weeks'][w]['s']);
									$scope.months[m]['weeks'][w]['e'] = $scope.string_to_date($scope.months[m]['weeks'][w]['e']);
									if($scope.level > 2)
									{
										for(d in $scope.months[m]['weeks'][w]['days'])
										{
											$scope.months[m]['weeks'][w]['days'][d].date_text = $scope.months[m]['weeks'][w]['days'][d]['s'].substring(5, 10);
											$scope.months[m]['weeks'][w]['days'][d]['s'] = $scope.string_to_date($scope.months[m]['weeks'][w]['days'][d]['s']);
											$scope.months[m]['weeks'][w]['days'][d]['e'] = $scope.string_to_date($scope.months[m]['weeks'][w]['days'][d]['e']);
											if($scope.level > 3)
											{
												for(s in $scope.months[m]['weeks'][w]['days'][d]['shifts'])
												{
													$scope.months[m]['weeks'][w]['days'][d]['shifts'][s]['s'] = $scope.string_to_date($scope.months[m]['weeks'][w]['days'][d]['shifts'][s]['s']);
													$scope.months[m]['weeks'][w]['days'][d]['shifts'][s]['e'] = $scope.string_to_date($scope.months[m]['weeks'][w]['days'][d]['shifts'][s]['e']);
												}
											}
										}
									}
								}
							}
						}
						$scope.selected_month = response['data']['current_month'];
				}, function(response) {
						console.log({load_user_fail:response});
				});
				break;
			// run_report call passes the filter_selections object to another file to retrieve report data, then passes
			// a data object and options object to the shared factory for use in the data controller. data and options
			// objects can have any structure based on the developer's needs. filter_selections is automatically generated
			// and mirrors the format of the filter_options object
			case 'run_report':
				$scope.data_loading = true;
				$scope.filter_selections.submit_report_start = format_datetime($scope.filter_selections.flt_report_start);
				$scope.filter_selections.submit_report_end = format_datetime($scope.filter_selections.flt_report_end);
				var obj = {action: action, filter_selections: $scope.filter_selections};
				var retdata = $http({
					method: 'POST', 
					url: query_file, 
					data: JSON.stringify(obj), 
					headers: headers
				}).then(function(response) {
						console.log({run_report_success:response, data:response['data']});
						$scope.share_data.data = response['data']['query_data'];
						if(typeof response['data']['options'] != 'undefined')
							{$scope.share_data.options = response['data']['options'];}
						$scope.data_loading = false;
						$scope.data_loaded = true;
						$timeout(function(){
							$scope.share_data.data_timeout();
						}, 0);
				}, function(response) {
						console.log({load_modules_fail:response});
						$scope.data_loading = false;
				});
				break;
		}
	};
	/*--------------------------------------------------------------------------------------------------------------------*/


	/*-------------------------------------DEFINE DEFAULT NGMODEL VALUES AND LOAD DATA------------------------------------*/
	// subset_selectors: Count of the number of dropdown menus to display above <select> elements in the filter menu
	//
	// calendar: Object for controlling calendar configuration, including location and selection mode
	//		top: DOM top position to plase the calendar control when display calendar button is selected
	//		left: DOM left position to plase the calendar control when display calendar button is selected
	//		target: List of variable names to allow the calendar interface to access the correct date when indicating
	//					which dates have already been selected. First value in this array needs to be a variable name
	//					accessible by the $scope variable, and each successive value needs to be a variable accessible
	//					by the previous variable. Allows the calendar functions to traverse multi-dimensional objects
	//		selector: Controls the selection mode when the calendar interface is shown. 
	//					's' sets it to update the report start date when user selects a date.
	//					'e' sets it to update the report end date when user selects a date.
	//
	// submit_disabled: Controls whether to enable the default "Submit" button for calling run_report query
	//
	// highlight_list: List of <select> elements to highlight to indicate invalid selections
	//
	// ie: Boolean value indicating whether the plugin has been loaded in internet explorer. Used for adapting behavior
	//		around ie specific restrictions. detect_ie() is defined in standard_functions.js
	$scope.subset_selectors = 0;
	$scope.query('load_filter_options');
	$scope.query('load_calendar');
	$scope.calendar = {top: '0px', left: '0px', target:[], selector:'s'};
	$scope.submit_disabled = false;
	$scope.highlight_list = {};
	$scope.ie = detect_ie();
	/*--------------------------------------------------------------------------------------------------------------------*/
	

	/*----------------------------------SCOPE FUNCTIONS: DELETE MODULE, GROUP, OR FIELD-----------------------------------*/
	// Allows developer to trigger data refreshes using events in the data controller
	$scope.share_data.refresh_data = function(){
		$scope.query('run_report');
	};
	
	// Convert numeric values to formatted text. References standard_functions.js
	$scope.number_format = function(val, d)
	{
		d = d || 0;
		return formatNumber(val, d);
	}

	// Convert date values to formatted text. References standard_functions.js
	$scope.date_format = function(dt, f){
		f = f || 'YmdHis';
		return format_datetime(dt, f);
	};

	// Converst string valus to JavaScript Date values. Requires yyyy-mm-dd HH:ii:mm format for internet explorer
	$scope.string_to_date = function(str)
	{
		if($scope.ie) {
			let dt = str.split(/[TZ\-\:]/);
			for(k in dt)
				{dt[k] = parseInt(dt[k]);}
			return new Date(dt[0], dt[1]-1, dt[2], dt[3], dt[4], dt[5]);
		} else
			{return new Date(str);}
	}

	// Capitalize the first letter of each word in a string
	$scope.title_case = function(str)
	{
		str = str || '';
		return str.replace(/\w[_\S]*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}
	
	// Automatically update string equivalents of flt_report_start and flt_report_end variables
	$scope.$watchGroup(['filter_selections.flt_report_start','filter_selections.flt_report_end'], function(newVal, oldVal, scope){
		if(newVal[0] || newVal[1])
		{
			$scope.filter_selections.flt_report_start_string = format_datetime($scope.filter_selections.flt_report_start, 'YmdHi');
			$scope.filter_selections.flt_report_end_string = format_datetime($scope.filter_selections.flt_report_end, 'YmdHi');
		}

		if(newVal[0] != oldVal[0] && $scope.filter_selections.flt_report_end < $scope.filter_selections.flt_report_start)
			{$scope.filter_selections.flt_report_end = $scope.filter_selections.flt_report_start;}
		else if(newVal[1] != oldVal[1] && $scope.filter_selections.flt_report_end < $scope.filter_selections.flt_report_start) 
			{$scope.filter_selections.flt_report_start = $scope.filter_selections.flt_report_end;} 
	});
	
	// Function for iterating to the previous month in the fiscal calendar interface
	$scope.prev_month = function() {
		let idx = $scope.month_list.indexOf($scope.selected_month);
		if(idx > 0)
		{
			$scope.months[$scope.selected_month].display = false;
			$scope.selected_month = $scope.month_list[idx-1];
			$scope.months[$scope.selected_month].display = true;
		}
	};

	// Function for iterating to the next month in the fiscal calendar interface
	$scope.next_month = function() {
		let idx = $scope.month_list.indexOf($scope.selected_month);
		if(idx < $scope.month_list.length - 1)
		{
			$scope.months[$scope.selected_month].display = false;
			$scope.selected_month = $scope.month_list[idx+1];
			$scope.months[$scope.selected_month].display = true;
		}
	};

	// Event triggered when a date is selected from the fiscal calendar interface. 
	// Sets flt_report_start or flt_report end depending on the calendar.selector variable
	$scope.date_select = function(obj){
		var ie = detect_ie();
		if($scope.calendar.target.length > 0)
		{
			var root = $scope;
			for(i = 0 ; i < $scope.calendar.target.length; i++)
			{
				idx = $scope.calendar.target[i];
				if(i == $scope.calendar.target.length - 1)
					{root[idx] = obj[$scope.calendar.selector];}
				else
					{root = root[idx];}
			}
		}
		$scope.show_calendar = false;
	};
	
	// Brings up the fiscal calendar interface. Displaying the calendar involves identifying the selected date, showing 
	// only the DOM elements contained within the corresponding month, and highlighting all dates within the selection
	// range.
	$scope.display_calendar = function(event, indices, ref_point)
	{
		ref_point = ref_point || 's';
		$scope.calendar.selector = ref_point == 'e' ? 'e' : 's';
		$scope.calendar.target = indices;
		date_val = null;
		if($scope.calendar.target.length > 0)
		{
			var root = $scope;
			for(i = 0 ; i < $scope.calendar.target.length; i++)
			{
				idx = $scope.calendar.target[i];
				if(i == $scope.calendar.target.length - 1)
				{
					date_val = root[idx];
					for(m in $scope.months)
					{
						if($scope.calendar.selector == 's' && date_val >= new Date($scope.months[m]['s']) && date_val < new Date($scope.months[m]['e']) ||
						   $scope.calendar.selector == 'e' && date_val > new Date($scope.months[m]['s']) && date_val <= new Date($scope.months[m]['e']))
						{
							$scope.months[$scope.selected_month].display = false;
							$scope.selected_month = $scope.months[m]['text'];
							$scope.months[$scope.selected_month].display = true;
						}
					}
				}
				else
					{root = root[idx];}
			}
		}
		$scope.show_calendar = !$scope.show_calendar;
		if($scope.show_calendar)
		{
			$timeout(function(){
				$scope.calendar.top = '1px';
				$scope.calendar.left = '1px';
				var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
				var scrollLeft = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
				
				target = event.currentTarget;
				ttbc = document.querySelector('#calendar_selector').getBoundingClientRect();
				tgbc = target.getBoundingClientRect();

				$scope.calendar.top = (tgbc.top + scrollTop - ttbc.height) + "px";
				$scope.calendar.left = (tgbc.left + tgbc.width + scrollLeft) + "px";
			}, 0);
		}
	}
	
	// Controls whether the filter menu submit button is clickable based on filter selections
	$scope.validate_submit = function()
	{
		$scope.submit_disabled = false;
		if(typeof $scope.filter_selections !== 'undefined' && typeof $scope.filter_selections.flt_select_lists != 'undefined')
		{
			for(idx in $scope.filter_selections.flt_select_lists)
			{
				if($scope.filter_selections.flt_select_lists[idx].length == 0 && typeof $scope.filter_options.flt_select_lists[idx].not_required == 'undefined')
				{
					$scope.submit_disabled = true;
					$scope.highlight_list[idx] = true;
				} else
					{$scope.highlight_list[idx] = false;}
			}
		}
	}
	/*--------------------------------------------------------------------------------------------------------------------*/
};
/*------------------------------------------------------------------------------------------------------------------------*/


/*--------SET ONCLICK EVENTS TO AUTOMATICALLY HIDE FISCAL CALENDAR INTERFACE IF THE INTEFACE ITSELF WAS NOT CLICKED-------*/
$(document).on('click', function(event){
	if($(event.target).closest('#calendar_selector, .calendar_button').length === 0)
	{
		let scope = angular.element($('#filter_controller')).scope();
		scope.$apply(function(){
			scope.show_calendar = false;;
		})
	}
});
/*------------------------------------------------------------------------------------------------------------------------*/
