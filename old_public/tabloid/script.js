


$(document).ready(function () {
	var md = new Showdown.converter(),
		text, html,
		article = $('article'),
		textarea = $('textarea');

	// get text
	text = textarea.val();
	html = md.makeHtml(text);
	article.html(html);

	textarea.bind('keydown', function (e){
		if(e.keyCode === 13) {
			// user hit return

			// get text
			text = textarea.val();
			html = md.makeHtml(text);
			article.html(html);

		}
	});
});