# up-dep

# Usage
install
```
npm install -g up-dep # not yet
```

check your dependency update

```
up-dep -c 'yarn build' -d 'dist'
```

you can specify clean command

```
up-dep -c 'yarn build' -d 'dist' -C 'yarn cache clean && rm -rf node_modules'
```

latest update check
```
up-dep -c 'yarn build' -d 'dist' -l
```
