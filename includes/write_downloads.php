<?php
include($_SERVER['DOCUMENT_ROOT'] . '/filter_menu_plugin/includes/page_init.php');

// Parse input data to $_POST variable
// Initialize output variable ($results)
$_POST = !isset($_POST['action']) ? json_decode(file_get_contents('php://input'), true) : $_POST;
$results = array('post' => $_POST);

if(isset($_POST['action']))
{
	switch($_POST['action'])
	{
		case 'write_csvs':
			if(isset($_POST['file_list']))
			{
				$results['file_list'] = array();
				foreach($_POST['file_list'] as $array)
				{
					$filename = isset($array['filename']) ? $array['filename'] : 'temp_data_'.date('YmdHis');
					$url = $_GLOBALS['csv_path'] . $filename . '.csv';
					$csv = new csv_interface($url);
					$csv->write_data($array['data']);
					$results['file_list'][] = array('name' => $filename, 'url' => $url);
				}
			}
			break;
	}
}
echo json_encode($results);
?>