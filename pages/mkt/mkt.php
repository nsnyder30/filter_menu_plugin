<?php 
/*
	Created by Neil Snyder 
	File Function: Sample application of AngularJS filter menu plugin
*/
include($_SERVER['DOCUMENT_ROOT'] . '/filter_menu_plugin/includes/page_init.php');
?>
<html>
<head>
	<title>Test</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.css">
	<!-- <link rel="stylesheet" href="/filter_menu_plugin/lib_css/bootstrap/bootstrap.css?modtime=<?php #echo filemtime($_SERVER['DOCUMENT_ROOT'] . '/filter_menu_plugin/lib_css/bootstrap/bootstrap.css'); ?>"> -->
	<link rel="stylesheet" href="/filter_menu_plugin/lib_css/standard.css?modtime=<?php echo filemtime($_SERVER['DOCUMENT_ROOT'] . '/filter_menu_plugin/lib_css/standard.css'); ?>">
</head>
<body>
<?php 
	include($_SERVER['DOCUMENT_ROOT'] . '/filter_menu_plugin/includes/header.php'); 
	ob_start() ?>
		<div id="data_controller" class="js-load_wait" data-ng-controller="data_ctl" data-ng-show="mkt_data.options.data_loaded" style="display:none">
			<table class="table">
				<thead>
					<tr class="thead-dark">
						<th class="text-center a-clickable" data-ng-click="toggle_group_sort('mkt_sort','Year_Birth')">Birth Year</th>
						<th class="text-center a-clickable" data-ng-click="toggle_group_sort('mkt_sort','Education')">Education</th>
						<th class="text-center text-nowrap a-clickable" data-ng-click="toggle_group_sort('mkt_sort','Marital_Status')">Marital Status</th>
						<th class="text-center a-clickable" data-ng-click="toggle_group_sort('mkt_sort','Income')">Income</th>
						<th class="text-center text-nowrap a-clickable" data-ng-click="toggle_group_sort('mkt_sort','Kidhome')">Kids at Home</th>
						<th class="text-center text-nowrap a-clickable" data-ng-click="toggle_group_sort('mkt_sort','Teenhome')">Teens at Home</th>
					</tr>
				</thead>
				<tbody>
					<tr data-ng-repeat="row in mkt_data.data | filter: mkt_filters() | orderBy: mkt_sort['col'] : mkt_sort[mkt_sort['col']]">
						<td class="text-center">{{row.Year_Birth}}</td>
						<td class="text-center">{{row.Education}}</td>
						<td class="text-center">{{row.Marital_Status}}</td>
						<td class="text-center">{{number_format(row.Income)}}</td>
						<td class="text-center">{{row.Kidhome}}</td>
						<td class="text-center">{{row.Teenhome}}</td>
					</tr>
				</tbody>
			</table>
		</div>
	<?php 
	$data_dom_append = ob_get_clean();
	
	include($_SERVER['DOCUMENT_ROOT'] . '/filter_menu_plugin/includes/filter_menu.php');
	ob_start() ?>
	<?php 
	$filter_menu_append = ob_get_clean();
	include($_SERVER['DOCUMENT_ROOT'] . '/filter_menu_plugin/includes/footer.php'); ?>
	</div>

	<!------------------------------------------------INCLUDE PAGE FOOTER-------------------------------------------------->


	<!----------------------------------------INCLUDE JAVASCRIPT DEPENDENCIES---------------------------------------------->
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular-messages.min.js"></script>
	<!-- <script src="/filter_menu_plugin/lib_js/standard_functions.js?modtime=<?php #echo filemtime($_SERVER['DOCUMENT_ROOT'] . '/filter_menu_plugin/lib_js/standard_functions.js'); ?>"></script> -->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.5.6/ui-bootstrap-tpls.min.js"></script>
	<script src="/filter_menu_plugin/lib_js/filter_menu.js?modtime=<?php echo filemtime($_SERVER['DOCUMENT_ROOT'] . '/filter_menu_plugin/lib_js/filter_menu.js'); ?>" autoload="true"></script>
	<!--------------------------------------------------------------------------------------------------------------------->


	<!----------------------------------------DEFINE ANGULARJS I/O FUNCTIONS----------------------------------------------->
	<script>	
		var uri_vars = window.location.search.substr(1).split("&");
		var $_GET = {};
		for(i in uri_vars)
		{
			$_GET[decodeURIComponent(uri_vars[i].split("=")[0])] = decodeURIComponent(uri_vars[i].split("=")[1]);
		}

		/*-----------------------------------CONTROLLER: MODULE TABLE & CONTROL BUTTONS-----------------------------------*/
		app.controller('data_ctl', dataCtl);
		dataCtl.$inject = ['$scope', '$http', '$uibModal', '$interval', '$timeout', 'shareFact'];
		function dataCtl($scope, $http, $uibModal, $interval, $timeout, shareFact){
console.log(shareFact);			
			$scope.mkt_data = shareFact;
			$scope.mkt_data.options.data_loaded = false;
			init_sort = true;
			$scope.mkt_sort = {col: 'Year_Birth', Year_Birth:true};
			var mkt_data = [];

			$scope.mkt_data.data_timeout = function()
			{
				if(init_sort)
				{
					//$scope.toggle_group_sort('mkt_sort','Year_Birth');
					//init_sort = false;
				}
				$scope.mkt_data.options.data_loaded = true;
				console.log('data timeout triggered');
				console.log($scope.mkt_data);
			}
			$scope.number_format = function(v,d){
				d = d || 0;
				return v == null ? '' : formatNumber(v, d);
			}

			var timeoutId = 0;
			/*-----------------------------------SCOPE FUNCTION: DYNAMICALLY PULL DATA------------------------------------*/
			$scope.query = function(action, params){
console.log({msg:'scope query called', action:action, params:params});			
				let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
				let config = {headers: {'Content-Type' : 'application/x-www-form-urlencoded;charset=utf-8;'}};
				params = params || {};
			};
			/*------------------------------------------------------------------------------------------------------------*/


			/*--------------------------------FUNCTION: FORMAT NUMERIC VALUES WITH COMMAS---------------------------------*/
			$scope.number_format = function(v, d){
				return formatNumber(v, d);
			}
			/*------------------------------------------------------------------------------------------------------------*/


			/*--------------------------------FUNCTION: SORT DATA SET BY SPECIFIED COLUMN---------------------------------*/
			$scope.toggle_group_sort = function(arr,col){
				$scope[arr]['col'] = col;
				$scope[arr][col] = !$scope[arr][col];
			}
			/*------------------------------------------------------------------------------------------------------------*/
			

			/*---------------------------------DEFINE DEFAULT NGMODEL VALUS AND LOAD DATA---------------------------------*/
			$scope.csv_downloads = [];
			/*-------------------------------------------------------------------------------------------------------------*/
			

			/*-------------------------------TABLE FILTERS: DEFINE FILTER ELEMENT BEHAVIORS-------------------------------*/
			$scope.mkt_filters = function(){
				return function(row) {
					
					flt_pass = true;
					flt_pass = flt_pass && $scope.mkt_data.selections.flt_select_lists.marital_status.filter(function(d){return d == 'ALL' || d == row.Marital_Status;}).length > 0;
					flt_pass = flt_pass && $scope.mkt_data.selections.flt_select_lists.education.filter(function(d){return d == 'ALL' || d == row.Education;}).length > 0;
					return flt_pass
				};
			};
			/*------------------------------------------------------------------------------------------------------------*/			
		};		
		/*----------------------------------------------------------------------------------------------------------------*/
		
		
		/*----------------------------------PAGE LOAD FUNCTION: DISPLAY HIDDEN ELEMENTS-----------------------------------*/
		// AngularJS elments hidden using data-ng-if are not hidden until the AngularJS app is loaded, causing a brief "flicker"
		// effect unless they are initially hidden by CSS.
		// js-load-wait class is used to remove "display:none" propertes on elements once AngularJS app is loaded
		$(document).ready(function(){
			$('.js-load_wait').show();			
		});
		/*----------------------------------------------------------------------------------------------------------------*/
	</script>
</body>
</html>