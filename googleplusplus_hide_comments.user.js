// ==UserScript==
// @name           googleplusplus_hide_comments
// @author         Micah Wittman
// @namespace      http://wittman.org/projects/googleplusplus_hide_comments
// @include        *plus.google.com*
// @description    Adds a Hide Comments or Show Comments link on each post; this feature is sticky (the hidden or shown state is recorded in the browser's local storage). /*___*/
// @version        0.2.8
// ==/UserScript==

function hideComments(){
    var logging = false;

	function log(txt) {
	  if(logging) {
	    console.log(txt);
	  }
	}
	function re_map(mappings){
		if(mappings == null)
			return false; //Scripts without a default (bundled) mapping resource
		var m = mappings;
		SEL = {
			'post' : "[id^='update-']", //"[id^='update-']"
			'posts' : m['XVDd7kiawTA9Z68I'], //".tn"
			'comments_wrap' : m['nqBp6N6dKqueig2R'], //".Ij"
			'comment_editor_cancel' : "[id*='.cancel']", //[id*='.cancel']
			'plust1_and_comments_link_wrap' : m['YAnwDHrlMoy67el9'], //".Bl"
			'old_comment_count_span' : m['9Iug6cv5o3NgTEEv'], //".Gw"
			'recent_comments_wrap' : m['CgYb1dbCZGVfpUAj'], //'.mf'
			'circle_links_wrap' : '#content ' + m['tZ7bxNTZEoVrcPyj'] + ' + div', //"#content .a-ud-B + div"		
			'circle_links' : "#content " + m['NCQTv2BvLd3MFT9q'].replace(':hover','') + " a[href*='stream/']", //"#content .a-ob-j-X a[href*='stream/']"
			'stream_link' : "#content " + m['XLINtDfuUFUIgeVl'] + " + a[href='/stream']:first", //"#content .a-ob-Fd a[href='/stream']:first"
			'stream_link_active' : "#content " + m['XLINtDfuUFUIgeVl'] + " + a[href='/stream']" + m['oL8HuLz0SCCVwtPK'] + ":first", //"#content .a-f-ob-B a[href='/stream'].a-ob-j-ia:first"
			'user_link' : m['tuVm7xq63YKbjl9u'] + ' a:first', //'.Nw a:first'
			'share_link' : m['xG7OYDQoYoP4QS0R'] + ' a:first', //'.gx a:first'
			'permalink_wrap' : m['tuVm7xq63YKbjl9u'], //'.Nw',
			'img_divs' :  "#content " + m['rWCWLOSJ4yQRU41j'] + "[data-content-url]", //#contentPane .F-y-Ia[data-content-url]
			'search_input_classes' : m['ikY6QG1yVApfM0ib'].replace('.','') + ' ' + m['9WbMI68ODRm5sxgV'].replace('.','') + ' ' + m['QvnLjkPdyzwsVmEq'].replace('.',''), //'a-pu-z a-x-z Ka-z-Ka'
			'___' : ''
		};
	}

	function set_selector_mappings(){
		
		/*** Scripts without a default (bundled) mapping resource ***/
		var default_selector_map = {
			'mapping date right' : '0000-00-00.000',
			'mappings' : null
			};
		/***********************************************************/
		
		var mappings = {};
		try{
			//console.log(SEL);
			/*stor_del('GPlus CSS Map');
			stor_del('Last Got GPlus CSS Map Date');
			stor_del('GPlus CSS Map Date');
			return;*/

			//var now = new Date("August 25, 2011 22:27:00"); //new Date();
			var now = new Date();

			var stored_mappings;
			var stored_last_check_for_map_update;
			var stored_map_date;

			//Check for resume flag
			var uncheckable_dom_litmus_location = false;
			var path = window.location.pathname;
			if( path !=  '/' && path.indexOf('/stream/') == -1 && path.indexOf('/posts') == -1 ){
				uncheckable_dom_litmus_location = true;
			}

			//Set mappings if first time upon page load
			if( !SET_SELECTOR_MAPPINGS_DONE_ONCE ){
				stored_mappings = $.parseJSON(stor_get('GPlus CSS Map', null));
				stored_last_check_for_map_update = stor_get('Last Got GPlus CSS Map Date', 0);
				stored_map_date = stor_get('GPlus CSS Map Date', '');

				//User stored mapping if newer than default mappings
				if((stored_last_check_for_map_update != 0) && (stored_mappings) && (stored_map_date > default_selector_map['mapping date right'])){
					mappings = stored_mappings; //local storage copy of map
					default_selector_map['mapping date right'] = stored_map_date; //Scripts without a default (bundled) mapping resource
				}else{
					mappings = default_selector_map.mappings; //included default map file
				}

				//console.log('mappings_before_remap:');
				//console.log(default_selector_map.mappings);
				re_map(mappings);
				//console.log(SEL);
			}else{
				SET_SELECTOR_MAPPINGS_DONE_ONCE = true; //done once, set flag
			}

			//Check if resume mode is needed
			if(uncheckable_dom_litmus_location){
				RESUME_MAP_CHECK_UPON_ROOT_PATH = true; //flag to re-run when at root URL
				return;
			}

			RESUME_MAP_CHECK_UPON_ROOT_PATH = false; //unset flag

			//Check remote mappings in case of update
			var timediff = now.getTime() - stored_last_check_for_map_update;
			//console.log('timediff:');
			//console.log(timediff/60*1000*60);
			//console.log('stored_last:');
			//console.log(stored_last_check_for_map_update);
			//console.log('stored_map:');
			//console.log(stored_map_date + ' and ' + stored_map_date);
			//console.log('stored_last:' + stored_last_check_for_map_update); console.log('timediff:' + (timediff > 30*60*1000)); console.log('force:' + SET_SELECTOR_MAPPINGS_FORCED);
			if((default_selector_map.mappings == null) || (stored_last_check_for_map_update == 0) || (timediff > 30*60*1000) || (SET_SELECTOR_MAPPINGS_FORCED)){ /* 30*60*1000 = 0.5 hour interval*/
				SET_SELECTOR_MAPPINGS_FORCED = false; //unset flag
				//console.log('past interval');
				$.get('http://goldenview.wittman.org/map/current_gplus_mappings_timestamp.txt', function(data){
					//console.log(data);
					var remote_date = data;
					if((remote_date.length > 8 && remote_date.length < 16 && remote_date[0] == 2) && (remote_date > default_selector_map['mapping date right'])){ //2010-01-01.123
						$.getJSON('http://goldenview.wittman.org/map/current_gplus_mappings.json', function(data){
							//console.log('ajax map pull:'); console.log(data);
							var date_right = typeof data['mapping date right'] == 'undefined' ? default_selector_map['mapping date right'] : data['mapping date right'];	
							var mappings_length = Object.keys(data.mappings).length;
							//console.log('date_right, default_date');
							//console.log(date_right); console.log(default_selector_map['mapping date right']);
							if(date_right > default_selector_map['mapping date right'] && mappings_length > 999 && (!$(SEL.posts).length || !$(SEL.comments_wrap).length || !$(SEL.circle_links).length)){
								mappings = data.mappings;
								re_map(mappings);
								stor_set('GPlus CSS Map', JSON.stringify(mappings));
								stor_set('GPlus CSS Map Date', date_right);
								//console.log('update local from remote');
								//console.log(mappings);
							}
						});
					}
				});
				stor_set('Last Got GPlus CSS Map Date', now.getTime());
				//console.log('stored:'+now.getTime());
			}
			//console.log(mappings);
		}catch(e){
			SET_SELECTOR_MAPPINGS_DONE_ONCE = true; //done once, set flag
			////mappings = default_selector_map.mappings; //If all else fails, use included default map file
			////re_map(mappings);
			//console.log('exception caught, using default');
			//console.log('Remote map not pulled yet.')
			//console.log(e.message);
			//console.log(mappings);
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
	function set_item(key, value) {
		try{
			window.localStorage.removeItem(key);
			window.localStorage.setItem(key, value);
		}catch(e){
			log(e);
		}
	}

	function get_item(key){
		var v;
		try{
			v = window.localStorage.getItem(key);
		}catch(e){
			log(e);
			v = null;
		}
		return v;
	}
	function del_item(key) {
		try{
			window.localStorage.removeItem(key);
		}catch(e){
			log(e);
		}
		log("Return from removeItem" + key);
	}
	function stor_clear(){
		log('about to clear local storage');
		window.localStorage.clear();
		log('cleared');
	}
	function stor_del(name){
		del_item(name);
	}
	function stor_set(name, value){
		set_item(name, value);
	}
	function stor_get(name, dfault){
		var v = get_item(name);
		if(v == null){
			return dfault;
		}else{
			return v;
		}
	}
	
	var SEL = {};
	var RESUME_MAP_CHECK_UPON_ROOT_PATH = false;
	var SET_SELECTOR_MAPPINGS_DONE_ONCE = false;
	var SET_SELECTOR_MAPPINGS_FORCED = false;
	var SET_SELECTOR_MAPPINGS_FORCED_ONCE = false;

	set_selector_mappings();

	function scrollTo(t){
		$('html,body').animate({
			scrollTop: t.offset().top},
			'slow');
	}
	function editor_present(update){
		//return update.find('.a-f-i-Xb .tk3N6e-e-vj[role]').length > 0; OLD
		//return update.find('.l-e-O[role]').length > 0; //OLD
		//return update.find('.c-m-l[role]').length > 0; //OLD
        return update.find(SEL.comment_editor_cancel).length > 0; //NEW
	}
	function remove_red_color_of_number(comment_count_display){
		if(comment_count_display.length > 0){
			comment_count_display.find('.gpp__hide_comments_recent_number').css({color:'#999',fontWeight:'normal'});
		}
	}


	function main_loop(){
		var i = 0;
		
		//$("[id^='update']").find(".a-f-i-Xb").each(function(){ OLD
		//$("[id^='update'] > .Wh .Oq").each(function(){ //OLD
		//$("[id^='update'] .Gq").each(function(){ //OLD
		//$("[id^='update'] .Ol").each(function(){ //OLD
		//$("[id^='update'] .Vg").each(function(){ //OLD
		//$("[id^='update'] .Ag").each(function(){ //NEW
		$(SEL.comments_wrap).each(function(){ //TMP
			var t = $(this);
			var update = t.parentsUntil(SEL.post);
			//var plust1_and_comments_link = t.parent().find(".a-f-i-bg"); //OLD
			//var plust1_and_comments_link = update.find(".Xn"); //OLD
			//var plust1_and_comments_link = update.find(".Jn"); //OLD
			//var plust1_and_comments_link = update.find(".ol"); //OLD
            var plust1_and_comments_link = update.find(SEL.plust1_and_comments_link_wrap); //NEW
			//var comments = update.find('.em');
			var comments = t; //.find('.Ly');

			//var old_comment_count_span = comments.find("div.a-f-i-WXPuNd span[role]"); //OLD
			//var old_comment_count_span = comments.find("div.Lt span[role]"); //OLD
			//var old_comment_count_span = comments.find("div.Ft span[role]"); //OLD
			//var old_comment_count_span = comments.find(".xx[role]"); //OLD
            var old_comment_count_span = comments.find(SEL.old_comment_count_span); //NEW
			
			if( old_comment_count_span.hasClass('gpp__comments_hidden_old_shown') ){
				old_comment_count_span.addClass('gpp__comments_hidden_old_shown');
				remove_red_color_of_number(comment_count_display);
			}
			var old_comment_count = 0;
			var old_comment_count_display = '';
			if(old_comment_count_span.length > 0){
				old_comment_count = old_comment_count_span.text().match(/\d+/);
				if(old_comment_count > 0){
					old_comment_count_display = '&nbsp;&nbsp;(OLD: <span class="gpp__hide_comments_old_number">' + old_comment_count + '</span>)';
				}
			}

			//var recent_comments = update.find('.a-b-f-i-Xb-oa .a-b-f-i-W-r'); //OLD
			//var recent_comments = update.find('.Gq .Ly'); //OLD
			//var recent_comments = update.find('.sx'); //OLD
            var recent_comments = update.find(SEL.recent_comments_wrap); //NEW
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
					comments.addClass('gpp__comments');
					//button_html = '<br><span role="button" class="b-j gpp__comment_show_hide" tabindex="0">Hide Comments</span> <span style="font-size:10pt;color:#999" class="gpp__comment_count_container"></span><br><br>';
					button_html = '<br><a class="gpp__comment_show_hide" tabindex="0">Hide Comments</a> <span style="font-size:10pt;color:#999" class="gpp__comment_count_container"></span><br><br>';
					comments.after(button_html);

					//console.log('editor_present:'+editor_present);
					var show_hide = comments.parent().find('.gpp__comment_show_hide:first');
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
addJQuery(hideComments);
