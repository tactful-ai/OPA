package example

default allow := false                              # unless otherwise defined, allow is false


allow := true { 
   input.role == "admin" 
}

kak

allow := true { 
  some i
  input.role == data.permissions[input.resource][input.scope][i]
}

