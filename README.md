# VIDAA Browser

Experimental browser app shell for VIDAA OS.

## Goal
Build a TV-first browser experience for VIDAA with a Chrome-like UI, remote-control navigation, tabs/history/bookmarks, fullscreen browsing, downloads where the platform permits them, and a native/privileged browser adapter when the VIDAA DevKit exposes one.

## Current architecture

- `index.html` — TV browser UI shell
- `style.css` — Chrome-like 10-foot TV interface
- `browser-core.js` — URL normalization, history and native adapter abstraction
- `remote.js` — D-pad/Enter/Back focus navigation
- `script.js` — UI/controller layer
- `manifest.template.json` — placeholder only; replace with the exact VIDAA Partner/DevKit manifest schema before packaging

## Important platform constraint
VIDAA third-party applications use an HTML5 web-app model on the platform web engine. A normal HTML5 app cannot create a second Chromium engine or bypass websites' `X-Frame-Options` / CSP frame restrictions. The project therefore keeps the browser UI separate from the browsing adapter.

If a privileged VIDAA browser/webview API is available in the Partner DevKit, expose it as:

```js
window.VIDAA_BROWSER_ADAPTER = {
  open: function (url) {
    // VIDAA privileged browser/webview call here
  }
};
```

`browser-core.js` will use that adapter automatically. Until such an API is supplied, the project keeps an iframe only as a development fallback for sites that permit embedding and can fall back to the system browser for other sites.

## Packaging
The developer build is hosted at:

`https://rohitrot738.github.io/Vidaa_browser/`

Run `scripts/build-package.sh` to create a versioned DevKit/source bundle and SHA-256 checksum in `dist/`. GitHub Actions also publishes the same files as a rolling `devkit-latest` pre-release whenever `main` changes.

The ZIP is a developer/source bundle, not a VIDAA App Store-signed package. Do not treat `manifest.template.json` as a confirmed production manifest. VIDAA's current partner documentation is access-controlled; an official store package must use the manifest schema and signing/certification supplied to the approved Partner account.

For installation on a real TV, open the hosted URL through VIDAA DevKit App Manager. See [`VIDAA_INSTALL_HINDI.md`](VIDAA_INSTALL_HINDI.md) for the Hisense U7K steps.

## Next milestones

1. Obtain/confirm the target TV's VIDAA version and Partner/DevKit browser/webview APIs.
2. Implement the privileged adapter if available.
3. Add multi-tab state and persistent history/bookmarks.
4. Add download manager hooks supported by the platform.
5. Add TV-safe virtual keyboard/search integration.
6. Test the hosted developer build on the real VIDAA TV.
