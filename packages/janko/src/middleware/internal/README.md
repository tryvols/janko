# Internal Middleware

Some middlewares are using inside the framework's sources, so to prevent
cyclic dependencies between the packages - these middlewares should
locate within the framework's main repo.

# List of the internal middlewares
## Logging Middleware
This middleware allows to implement logging around the application.
