# Introduction to the documentation
This project is using [Github Pages](https://docs.github.com/en/pages) to generate a static site with the documentation that is located at [jankojs.com](https://www.jankojs.com/). Github Pages is a service that is using [Jekyll](https://jekyllrb.com/) engine which allows to make the documentation very simple and fast by writting only important content. Anything else is covering by the awesome site templates developed for Jekyll. Decided to choose [Just the Docs](https://just-the-docs.github.io/just-the-docs/) template because of the awesome UI/UX.

# Development of the documentation
As you may assume, it's critically important to preserve documentation highly robust and reliable. So it's required to test everything locally before the deployment.

To prepare Jekyll's local environment follow [the instructions](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/testing-your-github-pages-site-locally-with-jekyll).

Use this commands to execute site locally:
```
cd docs
bundle install
bundle exec jekyll 
```
