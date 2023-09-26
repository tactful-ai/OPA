package example

test_admin{
      allow with input as {
        "role": "user",
        "resource":"email",
        "scope":"read"
    }
}

test_admin{
      not allow with input as {
        "role": "developer",
        "resource":"email",
        "scope":"read"
    }
}
