# up-dep
*note: this cli use git & yarn directory. And use git reset --hard command. This may break local git status.*


# Usage
install
```
npm install -g up-dep # not yet
```
or checkout this code.
```
git clone <this repo>
yarn && yarn build
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

ignore packages
```
up-dep -c 'yarn build' -d 'dist' -i '@babel/core,webpack'
```
