# up-dep

# Usage
install
```
npm install -g up-dep # not yet
```

check your dependency update

```
up-dep -c 'yarn build' -b 'dist'
```

you can specify clean command

```
up-dep -c 'yarn build' -b 'dist' -C 'yarn cache clean && rm -rf node_modules'
```
