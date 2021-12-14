<nav class="navbar navbar--nopad navbar-expand-sm bg-dark navbar-dark sticky-top">
	<ul class="navbar-nav">
		<li class="nav-item">
			<a class="nav-link text-white js-tabindex" href="/marketing/pages/home.php" tabindex="1">Home</a>
		</li>
		<li class="nav-item">
			<a class="nav-link text-white js-tabindex" href="/marketing/pages/contacts/contacts.php" tabindex="2">Contacts</a>
		</li>
	</ul>
	<ul class="navbar-nav ml-auto">
		<?php if(isset($_SESSION['marketing_user']))
			{echo '<li class="nav-item"><a class="nav-link js-tabindex" href="/marketing/utils/login.php?logout=y" tabindex="5">Logout</a></li>';} 
		else 
			{echo '<li class="nav-item"><a class="nav-link" href="/marketing/utils/login.php" tabindex="6">Log In</a></li>';} 
		?>
	</ul>
</nav>