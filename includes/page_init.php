<?php
session_start();
#-----------------------------------------DECLARE CONSTANTS-------------------------------------------------#
$input_clean_regex = '[^A-Za-z0-9\!\@\#\$\%\^\&\*\(\)\-\_]';
#-----------------------------------------------------------------------------------------------------------#


#------------------------------------DEFAULT CLASS INCLUSIONS-----------------------------------------------#
# dataSource: Handles connections to databases.
# csv_interface: Conversion from CSV data to 2D associative arrays
if($_SERVER['REMOTE_ADDR'] == '127.0.0.1')
	{$GLOBALS['cfg_file'] = "/home2/metdatmg/etc/metdatmgmt.com/connections.ini";} 
if(!class_exists('dataSource')){include($_SERVER['DOCUMENT_ROOT'] . '/filter_menu_plugin/includes/datasource.php');}
if(!class_exists('csv_interface')){include($_SERVER['DOCUMENT_ROOT'] . '/filter_menu_plugin/includes/csv_interface.php');}
#-----------------------------------------------------------------------------------------------------------#


#------------------------------------CHECK FOR AUTHORIZED USER----------------------------------------------#
$file = str_replace('\\', '/', __FILE__);
$page = current(array_slice(explode('/', $_SERVER['REQUEST_URI']), -1, 1));
$page = current(explode('?', $page));

if((!isset($_SESSION['marketing_user']) || !isset($_SESSION['permissions']) || count($_SESSION['permissions']) == 0) && $page != 'login.php')
{
	$_SESSION['url_return'] = $_SERVER['REQUEST_URI'];
	header('Location: /filter_menu_plugin/utils/login.php');	
	exit();
}
#-----------------------------------------------------------------------------------------------------------#


#------------------------------------------DEFINE GLOBAL CONSTANTS-------------------------------------------#
$_GLOBALS['csv_path'] = $_SERVER['DOCUMENT_ROOT'] . '/filter_menu_plugin/cache/';
#-----------------------------------------------------------------------------------------------------------#


#---------------------------------------SET ERROR HANDLING--------------------------------------------------#
set_error_handler('err_default');

function err_default($errno, $errstr, $errfile, $errline)
{
	$errstr = htmlspecialchars($errstr);
	echo json_encode(array('err_no' => $errno, 'err_str' => $errstr, 'err_file' => $errfile, 'err_line' => $errline));
}
#-----------------------------------------------------------------------------------------------------------#


#------------------------------------DEFINE CUSTOM FUNCTIONS------------------------------------------------#

// testprint_table: Quickly print 2D associative array as formatted HTML table
if(!function_exists('testprint_table'))
{
    function testprint_table($table_array)
    {
        $print_headers = TRUE;
        echo '<table>';
        foreach($table_array as $array)
        {
            if($print_headers)
            {
                echo '<tr>';
                foreach($array as $header => $value)
                {
                    echo '<th class="a-bgcolor--darkblue a-color--white font-weight-bold text-center border px-2 py-1 '.str_replace(' ', '_', $header).'">'.$header.'</th>';
                }
                echo '</tr>';
                $print_headers = FALSE;
            }
            
            echo '<tr>';
            foreach($array as $header => $value)
            {
                echo '<td class="border px-1 '.str_replace(' ', '_', $header).'">'.$value.'</td>';
            }
            echo '</tr>';
        }
        echo '</table>';
    }
}

//detect_ie: Boolean check for whether the client is using internet explorer
if(!function_exists('detect_ie'))
{
	function detect_ie()
	{
		$ua = htmlentities($_SERVER['HTTP_USER_AGENT'], ENT_QUOTES, 'UTF-8');
		return preg_match('~MSIE|Internet Explorer~i', $ua) || (strpos($ua, 'Trident/7.0') !== false && strpos($ua, 'rv:11.0') !== false);
	}	
}

#-----------------------------------------------------------------------------------------------------------#	
?>