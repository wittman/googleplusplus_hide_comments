
def find_and_replace(tag, filename, output_filename)
  File.open(filename, 'r') do |fo|
    
    # all alt versions #######################################################
    find_description = %^// @description    Adds a Hide Comments or Show Comments link on each post; this feature is sticky (the hidden or shown state is recorded in the browser's local storage). /*___*/^
    
    if tag == "___hidden" ###################################################
      #Find-replace pairs
      find_shown = %^var visibility_default = 'shown'; /*#{tag}*/^
      repl_shown = find_shown.sub("'shown'", "'hidden'")
  
      repl_description = find_description.sub("/*___*/", " ALTERNATE VERSION: hidden. This version hides all comments by default (as opposed to the standard version shows all comments by default). /*___*/")
        
      #Do replacing
      content = fo.read
      output = content
    
      output = output.sub(find_shown, repl_shown)
      output = output.sub(find_description, repl_description) #final replace is description
    
      #Output alternate version file
      output_file(output_filename, output)
    end

  end
end

def output_file(output_filename, output)
  output_file = File.open(output_filename, "w")
  output_file << output
  output_file.close
end

# hidden ###########################################  
filename = "googleplusplus_hide_comments.user.js" 
tag = "___hidden"
output_filename = "./alt/googleplusplus_hide_comments__hidden.user.js"
find_and_replace(tag, filename, output_filename)
