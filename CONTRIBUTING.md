# Contribution guidelines.

## Bugs, feature requests, questions

Use the [GitLab issue tracker](https://github.com/jitesoft/yolog/issues) for any issues.   
Please, try to follow the supplied issue template when reporting an issue to make it as easy to evaluate and fix any potential issues.

## Security vulnerabilities

If you find a security vulnerability in the module, please, start with sending an email to `sec@jitesoft.com` and allow us to evaluate
and try to patch the vulnerability before announcing it public.  

Any security vulnerabilities that we fix will be announced after a security patch have been made and a timespan have passed allowing 
users to update their installation.

## Code standard

This repository uses a custom JavaScript standard derived from `standard` while more close to `semistandard`.  
The package.json file contains said standard as a eslint plugin, which should be used before creating any pull request.  
If the there are eslint issues, the tests will fail, hence the PR will not be accepted!

## Testing

We strive to keep Yolog as close to 100% coverage as possible. This might not always be needed or even possible, but 
any new features should be covered with tests and any changes made should allow the tests to succeed too.  

## Pull requests

Pull requests are greatly appreciated, but please try to be as descriptive in both the commit log and in your PR description,
this makes it a lot more easy to manage the changelog and to know if a new major version is required for a specific change.

## Commit messages

Commits should include messages with a description of the changes. You don't have to write an essay, just a line or two.  

Example:

> New log tag: lolzerz.  
> Added a new default tag named `lolzers` which is super good and cool.

