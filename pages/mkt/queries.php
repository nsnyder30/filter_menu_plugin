<?php
/*
	Created by Neil Snyder 
	File Function: Database interface for contacts front-end UI
*/
include($_SERVER['DOCUMENT_ROOT'] . '/filter_menu_plugin/includes/page_init.php');

// Parse input data to $_POST variable
// Initialize output variable ($results)
$_POST = !isset($_POST['action']) ? json_decode(file_get_contents('php://input'), true) : $_POST;
$results = array('post' => $_POST);

if(isset($_POST['action']))
{
	$mkt = new dataSource('test_db');
	switch($_POST['action'])
	{
		case 'load_filter_options':
			$marketing_data = array();
			$query = "SELECT Year_Birth, Education, Marital_Status, Income, Kidhome, Teenhome, Dt_Customer FROM marketing_campaign";
			$mkt->execQuery($query);
			while($mkt->result != FALSE && $data = $mkt->fetchArray())
			{
				$marketing_data[] = $data;
			}
			
			$marital = array_unique(array_column($marketing_data, 'Marital_Status'));
			$education = array_unique(array_column($marketing_data, 'Education'));
			list($inc_min, $inc_max) = array(min(array_column($marketing_data, 'Income')), max(array_column($marketing_data, 'Income')));
			list($date_min, $date_max) = array(min(array_column($marketing_data, 'Dt_Customer')), max(array_column($marketing_data, 'Dt_Customer')));
			list($kh_min, $kh_max) = array(min(array_column($marketing_data, 'Kidhome')), max(array_column($marketing_data, 'Kidhome')));
			list($th_min, $th_max) = array(min(array_column($marketing_data, 'Teenhome')), max(array_column($marketing_data, 'Teenhome')));
			list($byear_min, $byear_min) = array(min(array_column($marketing_data, 'Year_Birth')), max(array_column($marketing_data, 'Year_Birth')));
			
			asort($marital);
			asort($education);
			$results['filter_options']['flt_select_lists']['marital_status']['vals'] = array_values($marital);
			$results['filter_options']['flt_select_lists']['education']['vals'] = array_values($education);
			$results['filter_options']['title'] = "Marketing Data Filters";
			break;
// Define READ operations
		case 'run_report':
			$results['contacts_data'] = array();
			$query = "SELECT * FROM marketing_campaign";
			$mkt->execQuery($query);
			while($mkt->result != FALSE && $data = $mkt->fetchArray())
			{
				$results['query_data'][] = $data;
			}
			break;
// Define WRITE & UPDATE operations
		case 'insert':
		case 'edit':
			$query = "INSERT INTO contacts (cnt_id, cnt_first, cnt_last, cnt_email_1, cnt_email_2, cnt_phone_1, cnt_phone_2, 
											cnt_street_addr, cnt_city, cnt_state, cnt_zip, cnt_country, cnt_birthday)
						   VALUES (:cnt_id, :cnt_first, :cnt_last, :cnt_email_1, :cnt_email_2, :cnt_phone_1, :cnt_phone_2, 
								   :cnt_street_addr, :cnt_city, :cnt_state, :cnt_zip, :cnt_country, :cnt_birthday)
		  ON DUPLICATE KEY UPDATE cnt_first = :upd_first, cnt_last = :upd_last, 
								  cnt_email_1 = :upd_email_1, cnt_email_2 = :upd_email_2, 
								  cnt_phone_1 = :upd_phone_1, cnt_phone_2 = :upd_phone_2, 
								  cnt_street_addr = :upd_street_addr, cnt_city = :upd_city, cnt_state = :upd_state, 
								  cnt_zip = :upd_zip, cnt_country = :upd_country, cnt_birthday = :upd_birthday";
			$params = array(array('query_key' => 0, 'params' => array('cnt_id' => $_POST['cnt_id'], 
																	  'cnt_first' => $_POST['cnt_first'], 
																	  'cnt_last' => $_POST['cnt_last'], 
																	  'cnt_email_1' => $_POST['cnt_email_1'], 
																	  'cnt_email_2' => $_POST['cnt_email_2'], 
																	  'cnt_phone_1' => $_POST['cnt_phone_1'], 
																	  'cnt_phone_2' => $_POST['cnt_phone_2'], 
																	  'cnt_street_addr' => $_POST['cnt_street_addr'], 
																	  'cnt_city' => $_POST['cnt_city'], 
																	  'cnt_state' => $_POST['cnt_state'], 
																	  'cnt_zip' => $_POST['cnt_zip'], 
																	  'cnt_country' => $_POST['cnt_country'], 
																	  'cnt_birthday' => $_POST['cnt_birthday'], 
																	  'upd_first' => $_POST['cnt_first'], 
																	  'upd_last' => $_POST['cnt_last'], 
																	  'upd_email_1' => $_POST['cnt_email_1'], 
																	  'upd_email_2' => $_POST['cnt_email_2'], 
																	  'upd_phone_1' => $_POST['cnt_phone_1'], 
																	  'upd_phone_2' => $_POST['cnt_phone_2'], 
																	  'upd_street_addr' => $_POST['cnt_street_addr'], 
																	  'upd_city' => $_POST['cnt_city'], 
																	  'upd_state' => $_POST['cnt_state'], 
																	  'upd_zip' => $_POST['cnt_zip'], 
																	  'upd_country' => $_POST['cnt_country'], 
																	  'upd_birthday' => $_POST['cnt_birthday'])));
			$mkt->execQuery($query, TRUE, $params);
			if($mkt->result != FALSE)
				{$results['edit_result'] = 'success';}
			$results['query'] = $query;
			$results['params'] = $params;
			break;
// Define DELETE operations			
		case 'delete':
			$queries = array();
			$params = array();
			$queries[] = "DELETE FROM contacts WHERE cnt_id = :cnt_id";
			$params[] = array('query_key' => 0, 'params' => array('cnt_id' => $_POST['cnt_id']));
			$results['queries'] = $queries;
			$results['params'] = $params;
			$mkt->execQuery($queries, TRUE, $params);
			break;
	}
	$mkt->closeDataSource();
}
echo json_encode($results);
?>