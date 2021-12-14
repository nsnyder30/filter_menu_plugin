<nav class="navbar navbar--nopad navbar-expand-sm bg-dark navbar-dark sticky-top">
	<ul class="navbar-nav">
		<li class="nav-item">
			<a class="nav-link text-white js-tabindex" href="/filter_menu_plugin/pages/mkt/mkt.php" tabindex="2">Sample: Customer Profile Data</a>
		</li>
	</ul>
	<ul class="navbar-nav ml-auto">
		<?php if(isset($_SESSION['marketing_user']))
			{echo '<li class="nav-item"><a class="nav-link js-tabindex" href="/filter_menu_plugin/utils/login.php?logout=y" tabindex="5">Logout</a></li>';} 
		else 
			{echo '<li class="nav-item"><a class="nav-link" href="/filter_menu_plugin/utils/login.php" tabindex="6">Log In</a></li>';} 
		?>
	</ul>
</nav>