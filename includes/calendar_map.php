<?php 
if(!class_exists('dataSourceODBC')){include($_SERVER['DOCUMENT_ROOT'] . '/marketing/includes/page_init.php'); }
$_POST = !isset($_POST['action']) ? json_decode(file_get_contents('php://input'), true) : $_POST;
$results = array('input' => $_POST);

if(!function_exists('load_calendars'))
{
	function load_calendars($level = 'shift', $show_future = FALSE, $apf_repo_limit = TRUE)
	{
		$ds_apf = new dataSource('test_db');
		$level = in_array($level, array('shift','day','week','month')) ? $level : 'shift';
		switch($level)
		{
			case 'shift': 
				$fields[] = 'cal_shift';
			case 'day': 
				$fields[] = 'cal_day';
			case 'week': 
				$fields[] = 'cal_week';
			default: 
				$fields[] = 'cal_month';
		}
		
		$calendar = array();
		$conditions = array("1");
		if(!$show_future)
			{$conditions[] = "cal_month IN (SELECT DISTINCT cal_month FROM calendar_maps WHERE cal_start <= NOW())";}
		if($apf_repo_limit)
			{$conditions[] = "cal_month IN (SELECT DISTINCT cal_month FROM calendar_maps WHERE cal_end > '".date('Y-m-d H:i:s', strtotime('-1063 days'))."')";}

		$query = "SELECT ".implode(", ", $fields).", MIN(cal_start) AS cal_start, MAX(cal_end) AS cal_end 
					FROM calendar_maps 
				   WHERE ".implode(" AND ", $conditions)." 
				GROUP BY ".implode(", ", $fields)." 
				ORDER BY cal_start ASC";
		$ds_apf->execQuery($query);
		while($ds_apf->result != FALSE && $data = $ds_apf->fetchArray())
		{
			$calendar[] = $data;
		}
		$ds_apf->closeDataSource();
		return $calendar;
	}
}


if(isset($_POST['action']))
{
	switch($_POST['action'])
	{
		case 'load_calendar':
			$level = isset($_POST['level']) ? $_POST['level'] : 'shift';
			$future = isset($_POST['show_future']);
			$cal_table = load_calendars($level, $future);
			$cal = array();
			$max_weeks = 0;
			$current_month = null;
			$ie = detect_ie();
			foreach($cal_table as $array)
			{
				$m = isset($array['cal_month']) ? $array['cal_month'] : null;
				$w = isset($array['cal_week']) ? $array['cal_week'] : null;
				$d = isset($array['cal_day']) ? $array['cal_day'] : null;
				$s = isset($array['cal_shift']) ? $array['cal_shift'] : null;
				if($ie)
				{
					$start = isset($array['cal_start']) ? $start = date('Y-m-d\TH:i:s\Z', strtotime($array['cal_start'])) : null;
					$end = isset($array['cal_end']) ? $end = date('Y-m-d\TH:i:s\Z', strtotime($array['cal_end'])) : null;
				} else {
					$start = isset($array['cal_start']) ? $array['cal_start'] : null;
					$end = isset($array['cal_end']) ? $array['cal_end'] : null;
				}
				
				if(!isset($cal[$m]['weeks']))
					{$wk_count = 0;}
				elseif(count(array_intersect(array_column($cal[$m]['weeks'], 'text'), array($w))) == 0)
					{$wk_count = count($cal[$m]['weeks']);}				
				$max_weeks = max($max_weeks, $wk_count);
				switch($level)
				{
					case 'shift': 
						$cal[$m]['weeks'][$wk_count]['days'][$d]['shifts'][] = array('text' => $s, 's' => $start, 'e' => $end);
					case 'day': 
						$cal[$m]['weeks'][$wk_count]['days'][$d]['text'] = $d;
						$cal[$m]['weeks'][$wk_count]['days'][$d]['s'] = isset($cal[$m]['weeks'][$wk_count]['days'][$d]['s']) ? min($start, $cal[$m]['weeks'][$wk_count]['days'][$d]['s']) : $start;
						$cal[$m]['weeks'][$wk_count]['days'][$d]['e'] = isset($cal[$m]['weeks'][$wk_count]['days'][$d]['e']) ? max($end, $cal[$m]['weeks'][$wk_count]['days'][$d]['e']) : $end;
					case 'week': 
						$cal[$m]['weeks'][$wk_count]['text'] = $w;
						$cal[$m]['weeks'][$wk_count]['s'] = isset($cal[$m]['weeks'][$wk_count]['s']) ? min($start, $cal[$m]['weeks'][$wk_count]['s']) : $start;
						$cal[$m]['weeks'][$wk_count]['e'] = isset($cal[$m]['weeks'][$wk_count]['e']) ? max($end, $cal[$m]['weeks'][$wk_count]['e']) : $end;
					default: 
						$cal[$m]['text'] = $m;
						$cal[$m]['s'] = isset($cal[$m]['s']) ? min($start, $cal[$m]['s']) : $start;
						$cal[$m]['e'] = isset($cal[$m]['e']) ? max($end, $cal[$m]['e']) : $end;
						$cal[$m]['display'] = strtotime('Now') < strtotime($cal[$m]['e']) && strtotime('Now') >= strtotime($cal[$m]['s']);
						$current_month = $cal[$m]['display'] ? $m : $current_month;
				}
			}
			$weeks = array();
			for($i=0;$i<=$max_weeks;$i++)
			{
				$weeks[] = $i;
			}
			
			switch($level)
			{
				case 'month': $results['level'] = 1;
				case 'week': $results['level'] = 2;
				case 'day': $results['level'] = 3;
				case 'shift': $results['level'] = 4;
			}
			$results['weeks'] = $weeks;
			$results['calendar'] = $cal;	
			$results['current_month'] = $current_month;
		default:
	}
}

echo json_encode($results);
?>