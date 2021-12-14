<nav class="navbar navbar--nopad navbar-expand-sm text-white bg-dark navbar-dark sticky-bottom">Downloadable Data</nav>
<ul data-ng-show="csv_downloads.length > 0">
	<li class="text-nowrap" data-ng-repeat="file in csv_downloads">
		<a href="/marketing/includes/file_download.php?file={{file.url}}" target="_blank">{{file.name}}</a>
		<span data-ng-if="file.desc != null"> - {{file.desc}}</span>
	</li>
</ul>