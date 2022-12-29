## Documentation
- Need to prepare complete documentation for the framework
- Main topics:
    - Application from scratch
    - Routing
    - Inversify
    - Telegram API
    - Architecture of the framework
    - Middleware
        - Internal/External
    - Core services
        - Their description and role
        - How to override/extend them
    - Decorators
        - Routing decorators (available decorators and their description)
        - Custom decorators
        - Combining of decorators
    - Constants
        - HandlerTypes (it seems should be covered within Telegram API or Routing)
    - Errors
    - Handler descriptors and their usage
    - Logging


## Test coverage
- Need to add unit tests

## Complete example app
- Implement routing example
- Implement location example
- Implement schedule example

## Cleanup exported interface
- Remove unnecessary exported interfaces

## Build publishing script
- @microsoft/rush publish doesn't allow to remove unnecessary files from published repository, so we need to make a new customr publishing script that will allow us to make minified package version without unnecessary files using builded files (minified, cleaned up etc.).

## Check events order
- It's possible that when node-telegram-bot-api send few messages after one was processed it can affect another one in case we get few events at the same time (like Message & Text).
- Example:
    - We get 2 events - Message & Text
    - We have handlers for both of them
    - We processed Message event and updated user's location
    - Is it a problem as a whole while Text event will be executed (if it will be executed not asynchronously) after we finished handling of the Message event
    - Need to check a real order of their handling

## Simplify injecting of services
- Some symbols are redundant. It's better to remove them and use injecting directly by service classes.

## Take care that application doesn't begin it's work until it's completely inited
- It's possible that middleware can get telegram api and begin fetching of the events before application has been initialized.

## Middleware dependencies and relations
- Different middleware can be dependent on each other. It's required to provide such an option.
- For example, location middleware can be dependent on session middleware, to make it possible divide location handling for the different users.

## Customize documentation color schema
- Logo is based on red color, but the site is using violet, so it looks inconsystent.

## Remove required Node version 14.x from packages
- Now each package require 14 version of Node.js

## Improve location middleware
- Now Location middleware is designed in vacuum, but it's not enough data to narrow location for a specific user (need to pass response (message) data with location to a location service)

## Migration to NestJS
- Figured out that Telegraf and grammY already allow to use them within NestJS, but there is still a problem. They provide simple api and simple functions, but they aren't a really frameworks, so it makes sense to extend their functionality with ecosystem that would allow much more flaxibility and abilities.
