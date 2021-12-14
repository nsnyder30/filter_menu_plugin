<!----------------------------------------------------DESCRIPTION---------------------------------------------------------//
// This plugin defines the DOM elements within the AngularJS filter menu app
//------------------------------------------------------------------------------------------------------------------------->
<div data-ng-app="filter_app">
	<div id="filter_controller" data-ng-controller="filter_ctl">
		<!-------------------------------------------LOADING FILTES INDICATOR--------------------------------------------->
		<div data-ng-show="filters_loading" class="js-load_wait m-1 bg-success text-white font-weight-bold" style="display:none">Loading Filters{{ellipses}}</div>
		<!----------------------------------------------------------------------------------------------------------------->


		<form class="m-2 border border-dark js-load_wait" data-ng-show="filters_loaded" style="display: none">
			<h6 class="p-1 bg-dark font-weight-bold text-white mb-0">{{title}}</h6>
			<section class="bg-light p-1">
				<!--------------------------------------PRINT <SELECT> INPUT CONTROLS-------------------------------------->
				<table class="c-input-params__table" data-ng-if="filter_options.show_lists">
					<tr data-ng-if="subset_selectors > 0">
						<td class="px-2 text-center" data-ng-repeat="(key, filter_list) in filter_options.flt_select_lists" data-ng-class="{'bg-warning':highlight_list[key]}">
							<select class="w-100" data-ng-if="filter_list.subset_selector !== undefined" data-ng-model="$parent.filter_selections.flt_select_list_subsets[key]" data-ng-init="$parent.filter_selections.flt_select_list_subsets[key] = $parent.filter_list.subset_selector[0]" data-ng-options="list as list.text for list in $parent.filter_list.subset_selector"></select>
						</td>
					</tr>
					<tr>
						<td class="px-2 text-center" data-ng-repeat="(key, filter_list) in filter_options.flt_select_lists" data-ng-class="{'bg-warning':highlight_list[key]}">
							<h6 class="text-center font-weight-bold mb-1">{{title_case(key.replaceAll('_', ' '))}}</h6>
							<select class="w-100" data-ng-if="filter_list.subset_selector === undefined || $parent.filter_selections.flt_select_list_subsets[key].id == -1" multiple="multiple" size="20" data-ng-model="$parent.filter_selections.flt_select_lists[key]" data-ng-options="val for val in $parent.filter_list.vals" data-ng-change="validate_submit()"></select>
							<select class="w-100" data-ng-if="filter_list.subset_selector !== undefined && $parent.filter_selections.flt_select_list_subsets[key].id != -1" multiple="multiple" size="20" data-ng-model="$parent.filter_selections.flt_select_lists[key]" data-ng-options="val for val in $parent.filter_selections.flt_select_list_subsets[key].subset" data-ng-change="validate_submit()"></select>
						</td>
					</tr>
				</table>
				<!--------------------------------------------------------------------------------------------------------->


				<!----------------------------PRINT STANDARD CALENDAR EPORTING PERIOD CONTROLS----------------------------->
				<table class="mt-2 align-top" style="display:inline-block" data-ng-if="filter_options.show_reporting_period">
					<tr>
						<td class="text-right font-weight-bold">Report Start:</td>
						<td><input type="datetime-local" data-ng-model="filter_selections.flt_report_start"></td>
					</tr>
					<tr>
						<td class="text-right font-weight-bold">Report End:</td>
						<td><input type="datetime-local" data-ng-model="filter_selections.flt_report_end"></td>
					</tr>
				</table>
				<!--------------------------------------------------------------------------------------------------------->


				<!--------------------------------------PRINT RADIO <INPUT> CONTROLS--------------------------------------->
				<table class="mt-2 ml-2 align-top" style="display:inline-block" data-ng-if="filter_options.show_radios" data-ng-repeat="(radio_header, radio_list) in filter_options.flt_radio_lists">
					<tr>
						<td class="font-weight-bold text-center"><u>{{title_case(radio_header.replaceAll('_', ' '))}}</u></td>
					</tr>
					<tr data-ng-repeat="(text, val) in radio_list.vals" >
						<td><input class="mr-2" data-ng-model="filter_selections.flt_radio_lists[radio_header]" type="radio" name="{{radio_header}}" data-ng-value="val">{{text}}</td>
					</tr>
				</table>
				<!--------------------------------------------------------------------------------------------------------->


				<!------------------------------------PRINT CHECKBOX <INPUT> CONTROLS-------------------------------------->
				<table class="mt-2 ml-2 align-top" style="display:inline-block" data-ng-if="filter_options.show_checkboxes">
					<tr data-ng-repeat="(text, checked) in filter_options.flt_checkboxes">
						<td><input class="mr-1" data-ng-model="filter_selections.flt_checkboxes[text]" type="checkbox" id="{{text}}" name="{{text}}" data-ng-checked="checked"><label for="{{text}}">{{title_case(text.replaceAll('_', ' '))}}</label></td>
						<td></td>
					</tr>
				</table>
				<!--------------------------------------------------------------------------------------------------------->


				<!------------PHP VARIABLE ALLOWS DEVELOPER TO INJECT CUSTOM ELEMENTS INTO THE FILTER MENU DOM------------->
				<?php if(isset($filter_dom_append)){echo $filter_dom_append;} ?>
				<!--------------------------------------------------------------------------------------------------------->
				<br>
				<button class="mt-2" data-ng-disabled="submit_disabled" data-ng-click="query('run_report')">Refresh Data</button>
			</section>


			<!-----------------------DEBUG MODE: SHOW FILTER_OPTIONS AND FILTER_SELECTIONS OBJECTS------------------------->
			<div data-ng-if="filter_options.debug_mode"><b>Filter Options:</b><br>{{filter_options}}</div>
			<div data-ng-if="filter_options.debug_mode"><b>Filter Selections:</b><br>{{filter_selections}}</div>
			<!------------------------------------------------------------------------------------------------------------->
		</form>
		<div data-ng-class="{'bg-success':data_loading, 'text-white':data_loading}">&nbsp;<span data-ng-show="data_loading" class="m-1 bg-success text-white js-load_wait font-weight-bold" style="display:none">Loading Data{{ellipses}}</span></div>
	</div>
	<!--------------------PHP VARIABLE ALLOWS DEVELOPER TO INJECT DATA CONTROLLER INTO FILTER MENU APP--------------------->
	<?php if(isset($data_dom_append)){echo $data_dom_append;} ?>
</div>
	<!--------------------------------------------------------------------------------------------------------------------->
