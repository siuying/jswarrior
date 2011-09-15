class Utils
  @toCamelCase: (string) ->
    camelParts = (name.replace(/^[a-z]/, ($1) -> $1.toUpperCase()) for idx, name of string.split("_"))
    camelParts.join("")
    
  @toUnderscoreCase: (string) ->
    under = string.replace(/[A-Z]/, ($1) -> "_#{$1.toLowerCase()}")
    under.replace(/^_/, "")

  @toMethodCase: (string) ->
    camelParts = Utils.toCamelCase(string)
    camelParts.replace(/^[A-Z]/, ($1) -> $1.toLowerCase())
  
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