package example

test_admin{
      allow with input as {
        "role": "user",
        "resource":"email",
        "scope":"read"
    }
}
