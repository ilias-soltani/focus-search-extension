# Focus Search Bar

A Firefox extension that focuses the search bar on the current website using a keyboard shortcut.

## Features

- Focuses the main search field on the active tab
- Uses a keyboard shortcut
- Works with host-specific and generic search selectors
- Built for Firefox using WebExtensions APIs

## Files

- `manifest.json` — extension config
- `background.js` — shortcut handling and search focus logic

## Development

### Temporary install in Firefox

1. Open `about:debugging`
2. Go to **This Firefox**
3. Click **Load Temporary Add-on**
4. Select `manifest.json`

## Shortcut

Default shortcut: `Alt+Shift+K`

## Notes

- Works best on sites with standard search inputs
- Some websites may need custom selectors
- Restricted browser pages do not allow script injection

## License

MIT
