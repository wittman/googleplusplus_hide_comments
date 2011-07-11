// ==UserScript==
// @name           googleplusplus_hide_comments
// @author         Micah Wittman
// @namespace      http://wittman.org/projects/googleplusplus_hide_comments
// @include        *plus.google.com*
// @description    Adds a Hide Comments or Show Comments link on each post; this feature is sticky (the hidden or shown state is recorded in the browser's local storage).  ALTERNATE VERSION: hidden. This version hides all comments by default (as opposed to the standard version shows all comments by default). /*___*/
// @version        0.1.3
// ==/UserScript==


function hideComments(){
	var logging = false;

	function log(txt) {
	  if(logging) {
	    console.log(txt);
	  }
	}

	function setItem(key, value) {
		try{
			log("Inside setItem: " + key + ":" + value);
			window.localStorage.removeItem(key);
			window.localStorage.setItem(key, value);
		}catch(e){
			log("Error inside setItem");
			log(e);
		}
		log("Return from setItem" + key + ":" +  value);
	}

	function getItem(key){
		var v;
		log('Get Item: ' + key);
		try{
			v = window.localStorage.getItem(key);
		}catch(e){
			log("Error inside getItem() for key: " + key);
			log(e);
			v = null;
		}
		log("Returning value: " + v);
		return v;
	}
	function removeItem(key) {
		try{
			log("Inside removetItem: " + key);
			window.localStorage.removeItem(key);
		}catch(e){
			log("Error inside removeItem");
			log(e);
		}
		log("Return from removeItem" + key);
	}
	function clearStorage(){
		log('about to clear local storage');
		window.localStorage.clear();
		log('cleared');
	}
	function GM_removeItem(name){
		removeItem(name);
	}
	function GM_setValue(name, value){
		setItem(name, value);
	}

	function GM_getValue(name, oDefault){
		var v = getItem(name);
		if(v == null){
			return oDefault;
		}else{
			return v;
		}
	}
	
	function main_loop(){
		var i = 0;
		$("[id^='update']").find(":contains('Add a comment...')").each(function(){
			var t = $(this);
			var comments = t.prev();
			var each_comment = comments.find('a.a-f-i-do, .a-f-i-W-r');
			if( each_comment.length > 0 ){
				var post = comments.parent().parent();
				var postID = post.attr('id');
				var hiddenPostID = GM_getValue('gpp__hidden_post_id_' + postID, '');
				var hidden_by_default = false;
				if( visibility_default == 'hidden' && !comments.hasClass('gpp__comments_hidden_by_default') ){
					hidden_by_default = true;
				}
				if( !comments.hasClass('gpp__comments') ){
					comments.addClass('gpp__comments_' + i).addClass('gpp__comments');
					button_html = '<br><span role="button" class="d-h a-b-f-i-gc-cf-Xb-h gpp__comment_show_hide_' + i + '" tabindex="0">Hide Comments</span><br><br>';
					comments.after(button_html);
				}
				var show_hide = comments.parent().find('.gpp__comment_show_hide_' + i);
				show_hide.click(function(){
					var t = $(this);
					comments.addClass('gpp__comments_hidden_by_default');
					if( t.text().indexOf('Hide Comments') > -1 ){
						comments.fadeOut();
						GM_setValue('gpp__hidden_post_id_' + postID, postID);
						t.text('Show Comments');
					}else{
						comments.fadeIn();
						GM_removeItem('gpp__hidden_post_id_' + postID);
						t.text('Hide Comments');
					}
					return false;
				});
				
				if(hiddenPostID != '' || hidden_by_default){
					comments.fadeOut();
					show_hide.text('Show Comments');
				}
				i++;
			}
		});
	}
	/****** Before Loop Variables ******/
	/*** Options ***/
	//Set to 'hidden' to hide all comments by default, or 'shown' to show by default.
	var visibility_default = 'hidden'; /*___hidden*/
	
	/****** Start main_loop ******/
	main_loop();
	setInterval(main_loop, 2000);
}

/****** Load jQuery then callback upon load function ******/
function addJQuery(callback){
	var script = document.createElement("script");
	script.setAttribute("src", protocol + "ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js");
	script.addEventListener('load', function() {
		var script = document.createElement("script");
		script.textContent = "(" + callback.toString() + ")();";
		document.body.appendChild(script);
	}, false);
	document.body.appendChild(script);
}

/****** Call Load jQuery + callback function ******/
var protocol = window.location.protocol + '//';
if(window.location.href.indexOf('/photos') == -1){ //Doesn't work on photos page right now.
	addJQuery(hideComments);
}