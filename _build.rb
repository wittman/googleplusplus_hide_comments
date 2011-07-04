filename = "googleplusplus_hide_comments.user.js"
File.open(filename, 'r') do |fo|
  output_filename = "./alt/googleplusplus_hide_comments__top.user.js"
  
  #Find-replace pairs
  find_after = %^comments.after('<a style="line-height: 2em" class="gpp__comment_show_hide_' + i + '">Hide Comments</a>'); /*___top*/^
  repl_after = find_after.sub(".after", ".before")
  
  find_description = %^// @description	   Adds a Hide Comments or Show Comments link on each post; this feature is sticky (the hidden or shown state is recorded in the browser's local storage). /*___top*/^
  repl_description = find_description.sub("/*___top*/", " ALTERNATE VERSION: top. This version place the Hide/Show link at the top (as opposed to the bottom of the stack of comments). /*___top*/")
  
  #Do replacing
  content = fo.read
  output = content
  output = output.sub(find_after, repl_after)
  output = output.sub(find_description, repl_description)
  
  #Output alternate version file
  output_file = File.open(output_filename, "w")
  output_file << output
  output_file.close
end

