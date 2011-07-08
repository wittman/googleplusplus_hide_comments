// ==UserScript==
// @name           googleplusplus_hide_comments
// @author		   Micah Wittman
// @namespace      http://wittman.org/projects/googleplusplus_hide_comments
// @include        *plus.google.com*
// @description	   Adds a Hide Comments or Show Comments link on each post; this feature is sticky (the hidden or shown state is recorded in the browser's local storage). /*___top*/
// @version		   0.1.2
// ==/UserScript==


function hideComments(){
	var logging = false;

	function log(txt) {
	  if(logging) {
	    console.log(txt);
	  }
	}

	//sets the item in the localstorage
	function setItem(key, value) {
	  try {
	    log("Inside setItem:" + key + ":" + value);
	    window.localStorage.removeItem(key);
	    window.localStorage.setItem(key, value);
	  }catch(e) {
	    log("Error inside setItem");
	    log(e);
	  }
	  log("Return from setItem" + key + ":" +  value);
	}
	//Gets the item from local storage with the specified
	//key
	function getItem(key) {
	  var value;
	  log('Get Item:' + key);
	  try {
	    value = window.localStorage.getItem(key);
	  }catch(e) {
	    log("Error inside getItem() for key:" + key);
		  log(e);
		  value = "null";
	  }
	  log("Returning value: " + value);
	  return value;
	}
	//Clears all the key value pairs in the local storage
	function clearStrg() {
	  log('about to clear local storage');
	  window.localStorage.clear();
	  log('cleared');
	}

	function GM_setValue(name, value){
		setItem(name);
	}

	function GM_getValue(name, oDefault){
		var v = getItem(name);
		if(v == null){
			return oDefault;
		}else{
			return v;
		}
	}

	function GM_listValues(){
		return localStorage;
	}

	function GM_deleteValue(name){
		window.localStorage.removeItem(name);
	}
	
	//clearStrg(); return;
	
	function main_loop(){
		var i = 0;
		$("[id^='update']").find(":contains('Add a comment...')").each(function(){
			var t = $(this);
			var comments = t.prev();
			var each_comment = comments.find('a.a-f-i-do');
			if( each_comment.length > 0 ){
				var post = comments.parent().parent();
				var postID = post.attr('id');
				var hiddenPostID = GM_getValue('gpp__hidden_post_id_' + postID, '');
				if( !comments.hasClass('gpp__comments') ){
					comments.addClass('gpp__comments_' + i).addClass('gpp__comments');
					comments.after('<a style="line-height: 2em" class="gpp__comment_show_hide_' + i + '">Hide Comments</a>'); /*___top*/
				}
				var show_hide = $('.gpp__comment_show_hide_' + i);
				show_hide.click(function(){
					var t = $(this);
					if( t.text().indexOf('Hide Comments') > -1 ){
						comments.hide();
						GM_setValue('gpp__hidden_post_id_' + postID, postID);
						t.text('Show Comments');
					}else{
						comments.show();
						GM_deleteValue('gpp__hidden_post_id_' + postID);
						t.text('Hide Comments');
					}
				});
				
				if(hiddenPostID != ''){
					comments.hide();
					show_hide.text('Show Comments');
				}
				i++;
			}
		});
	}
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