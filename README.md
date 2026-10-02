```txt
npm install
npm run dev
```

`npm run dev` binds `localhost` only. To serve the Flutter debug app running on a
physical device, use:

```txt
npm run dev:lan
```

This binds `0.0.0.0:8787`, matching the app's debug default
(`http://192.168.0.11:8787`). The device must be on the same LAN, port 8787 must
be open, and the API key configured in the app's settings must match `API_KEY`.

```txt
npm run deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/cf/projects/):

```txt
npm run cf-typegen
```
