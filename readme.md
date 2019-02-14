## clone

```bash
$ git clone https://github.com/uu-z/gqml-examples
$ cd tweet
```

## instation

```bash
$ yarn install
$ npm install prisma -g
```

## start

```bash
$ mv ./prisma/prisma.exampleyml ./prisma/prisma.yml
$ prisma deploy
$ yarn start
```

## build&docker

```bash
$ yarn build
$ docker build . -t foo
$ docker run -d -p 3000:3000 foo
```
