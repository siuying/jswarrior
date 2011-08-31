class Utils
  @toCamelCase: (string) ->
    camelParts = (name.replace(/^[a-z]/, ($1) -> $1.toUpperCase()) for name in string.split("_"))
    camelParts.join("")
    
root = exports ? window
root.Utils = Utils