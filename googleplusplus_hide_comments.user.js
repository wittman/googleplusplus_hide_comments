// ==UserScript==
// @name           googleplusplus_hide_comments
// @author         Micah Wittman
// @namespace      http://wittman.org/projects/googleplusplus_hide_comments
// @include        *plus.google.com*
// @description    Adds a Hide Comments or Show Comments link on each post; this feature is sticky (the hidden or shown state is recorded in the browser's local storage). /*___*/
// @version        0.2.2
// ==/UserScript==

function hideComments(){ // v0.2.2
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
	function scrollTo(t){
		$('html,body').animate({
			scrollTop: t.offset().top},
			'slow');
	}
	function editor_present(update){
		//return update.find('.a-f-i-Xb .tk3N6e-e-vj[role]').length > 0; OLD
		return update.find('.l-e-O[role]').length > 0; //NEW
	}
	function remove_red_color_of_number(comment_count_display){
		if(comment_count_display.length > 0){
			comment_count_display.find('.gpp__hide_comments_recent_number').css({color:'#999',fontWeight:'normal'});
		}
	}


	function main_loop(){
		var i = 0;
		
		//$("[id^='update']").find(".a-f-i-Xb").each(function(){ OLD
		$("[id^='update'] > .Wh .Oq").each(function(){ //NEW
			var t = $(this);
			var update = t.parentsUntil("[id^='update']");
			//var plust1_and_comments_link = t.parent().find(".a-f-i-bg"); //OLD
			var plust1_and_comments_link = update.find(".Xn"); //NEW
			var comments = update.find('.em');

			//var old_comment_count_span = comments.find("div.a-f-i-WXPuNd span[role]"); //OLD
			var old_comment_count_span = comments.find("div.Lt span[role]"); //NEW
			
			if( old_comment_count_span.hasClass('gpp__comments_hidden_old_shown') ){
				old_comment_count_span.addClass('gpp__comments_hidden_old_shown');
				remove_red_color_of_number(comment_count_display);
			}
			var old_comment_count = 0;
			var old_comment_count_display = '';
			if(old_comment_count_span.length > 0){
				old_comment_count = old_comment_count_span.text().match(/\d+/);
				old_comment_count_display = '&nbsp;&nbsp;(OLD: <span class="gpp__hide_comments_old_number">' + old_comment_count + '</span>)';
			}

			//var recent_comments = update.find('.a-b-f-i-Xb-oa .a-b-f-i-W-r'); //OLD
			//<div class="Py vl"><div class="Lt Lq"><span role="button" class="d-k Yk" tabindex="0">4 more comments</span> <span class="jv">from <span class="mr">Evelyn Barney, Jorge Escobar, Martin Watson&nbsp;and&nbsp;Rae Ouzts</span></span></div><div class="Zn"></div></div>
			var recent_comments = update.find('.Oy'); //NEW
			var recent_comment_count = 0;
			if(recent_comments.length > 0){
				recent_comment_count = recent_comments.length;
			}

			var show_hide;
			if( recent_comment_count > 0 ){
				var post = comments.parent().parent();
				var postID = post.attr('id');
				var hiddenPostID = GM_getValue('gpp__hidden_post_id_' + postID, '');
				var hidden_by_default = false;
				if( visibility_default == 'hidden' && !comments.hasClass('gpp__comments_hidden_by_default') ){
					hidden_by_default = true;
				}
				
				
				if( !comments.hasClass('gpp__comments') ){
					comments.addClass('gpp__comments_' + i).addClass('gpp__comments');
					//button_html = '<br><span role="button" class="d-h a-b-f-i-gc-cf-Xb-h gpp__comment_show_hide gpp__comment_show_hide_' + i + '" tabindex="0">Hide Comments</span> <span style="font-size:10pt;color:#999" class="gpp__comment_count_container"></span><br><br>'; OLD
					button_html = '<br><span role="button" class="d-k gpp__comment_show_hide gpp__comment_show_hide_' + i + '" tabindex="0">Hide Comments</span> <span style="font-size:10pt;color:#999" class="gpp__comment_count_container"></span><br><br>';//NEW
					comments.after(button_html);

					//console.log('editor_present:'+editor_present);
					var show_hide = comments.parent().find('.gpp__comment_show_hide_' + i);
					show_hide.click(function(e){
						var t = $(this);
						comments.addClass('gpp__comments_hidden_by_default');
						if( t.text().indexOf('Hide Comments') > -1 ){
							if(editor_present(update)){
								//console.log('editor_present:'+editor_present);
								if( t.parent().find('.gpp__hide_comments_close_editor_tip').length == 0 ){
									//console.log('need tip');
									t.parent().find('.gpp__comment_count_container').append(' <span style="color:darkorange;font-size:9pt" class="gpp__hide_comments_close_editor_tip"><br>Comment Editor must be closed before hiding comments.</span>');
								}
							}else{
								t.parent().find('.gpp__hide_comments_close_editor_tip').remove();
							}
							
							comments.removeClass('gpp__comments_shown');
							comments.hide();
							GM_setValue('gpp__hidden_post_id_' + postID, postID);
							t.text('Show Comments');
							scrollTo(plust1_and_comments_link);
						}else{
							//console.log('click_show');
							comments.addClass('gpp__comments_shown');
							comments.show();
							GM_removeItem('gpp__hidden_post_id_' + postID);
							t.text('Hide Comments');
							remove_red_color_of_number(comment_count_display);
							if(editor_present(update)){
								comments.hide();
								comments.removeClass('gpp__comments_shown');
							}
							scrollTo(plust1_and_comments_link);
						}
						e.preventDefault();
					});
				}else{
					show_hide = t.parent().find('.gpp__comment_show_hide');
				}
				if(hiddenPostID != '' || hidden_by_default){
					if( !editor_present(update) && !comments.hasClass('gpp__comments_shown') ){ //don't hide if comment editor in DOM
						comments.hide();
						show_hide.text('Show Comments');
					}
				}
				
				var comment_count_display = show_hide.parent().find('.gpp__comment_count_container');
				if(editor_present(update)){
					show_hide.text('Hide Comments'); //also set link to Hide Comments if editor present
					comments.show();
					comments.addClass('gpp__comments_shown');
					remove_red_color_of_number(comment_count_display);
				}
				if(recent_comment_count > 0 || old_comment_count > 0){
					
					var display_recent = comment_count_display.find('.gpp__hide_comments_recent_number');
					var display_recent_number = 0;
					var display_old = comment_count_display.find('.gpp__hide_comments_old_number');
					var display_old_number = 0;
					if(display_recent.length > 0 && display_recent.text().length > 0){
						display_recent_number = display_recent.text();
					}
					if(display_old.length > 0 && display_old.text().length > 0){
						display_old_number = display_old.text();
					}

					var recent_number_html = '<span class="gpp__hide_comments_recent_number">' + recent_comment_count + '</span>';
					if(loop_count > 0 && show_hide.text().indexOf('Show Comments') > -1 ){
						try{
							if(parseInt(recent_comment_count, 10) != parseInt(display_recent_number,10)){
								recent_number_html = '<span class="gpp__hide_comments_recent_number" style="color:red;font-weight:bold">' + recent_comment_count + '</span>';
							}
						}catch(e){}
					}
					var comment_count_html = '<span style="font-size:8pt;color:#999">(RECENT: ' + recent_number_html + ')' + old_comment_count_display + '</span> ';
					
					if( (recent_comment_count != display_recent_number) || (old_comment_count != display_old_number) ){
						comment_count_display.empty().append(comment_count_html);
					}
				}
				i++;
			}
		});
		loop_count++;
		url_current = window.location.href;
		if( url_current != url_prev){
			$('.gpp__hide_comments_recent_number').css({color:'#999',fontWeight:'normal'});
			loop_count = 0; //reset to clear rea numbers
		}
		url_prev = url_current;
	}
	
	/****** Before Loop Variables ******/
	/*** Options ***/
	//Set to 'hidden' to hide all comments by default, or 'shown' to show by default.
	var visibility_default = 'shown'; /*___hidden*/
	var loop_count = 0;
	var url_current = window.location.href;
	var url_prev = url_current;
	

	/****** Start main_loop ******/
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
//if(window.location.href.indexOf('/photos') == -1){ //Doesn't work on photos page right now.
	addJQuery(hideComments);
//}