## Documentation
- Need to prepare complete documentation for the framework

## Test coverage
- Need to add tests

## Logging
- Need to add logger interface
- Need to inject logging into the handling flow

## Cleanup exported interface
- Remove unnecessary exported interfaces

## Iterare package migration
- Move iterations to use iterare package (this will optimize time spending on chain iterations)

## Build publishing script
- @microsoft/rush publish doesn't allow to remove unnecessary files from published repository,
so we need to make a new customr publishing script that will allow us to make minified package
version without unnecessary files using builded files (minified, cleaned up etc.).
