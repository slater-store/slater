![repo-banner](https://user-images.githubusercontent.com/4732330/59070492-e925a900-8888-11e9-9dd5-90fb7b8da034.png)

```bash
npm i slater@alpha -g
```
<br />

A Shopify theme management tool.

<br />

## Features
- sync & remove files from a remote theme
- watch theme directory for changes and sync updates

## Config
```javascript
module.exports = {
  themes: {
    dev: {
      id: '12345...',
      password: 'abcde...',
      store: 'store-name.myshopify.com',
      ignore: [
        'settings_data.json'
      ]
    }
  }
}
```

## CLI
```bash
slater watch
slater sync [...paths]
slater unsync [...paths]
```

Also try `slater --help` for more info and options.

## License
MIT License © [The Couch](https://thecouch.nyc)
