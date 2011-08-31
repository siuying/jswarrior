class Utils
  @toCamelCase: (string) ->
    camelParts = (name.replace(/^[a-z]/, ($1) -> $1.toUpperCase()) for name in string.split("_"))
    camelParts.join("")
  
  @basename: (path) ->
    path.replace(/^.*[\/\\]/g, '')
    
  @lpad: (str, padString, length) ->
    (str = padString + str) while (str.length < length)      
    str

  @rpad: (str, padString, length) ->
    (str = str + padString) while (str.length < length)
    str

root = exports ? window
root.Utils = Utils