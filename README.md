# Mail Mirror Lite

Create a mobile clone of @connector:google_mail:"Gmail" account and also ensure the contents in it has the following components that a @connector:google_mail:"Gmail" has and also use the @connector:google_mail:"Gmail" icons and fonts everything matching the same UI a copy of @connector:google_mail:"Gmail" only and the following buttons everyhting must have there own functionality such the back button and the reply button forward button archieve button delete button everything and also refer one my mail where there is security details clickable and this must also be there and also add a config file for all the contents such that I can edit whatever content I like I will make the content for all every field the content must be there in th e following config file Primarly make this for Mobile right now and ensure the copy must match exactly like the @connector:google_mail:"Gmail" and icons and must have a light and dark themed action also.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://mail-mirror-lite.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/092c7760-0f64-4884-998d-8b7b863698f5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Install on Android

The app is configured as an installable Progressive Web App. After the latest version is live at <https://mail-mirror-lite.lovable.app>, open that address in Chrome on Android, tap **⋮**, then **Install app**. It launches in standalone mode without browser controls.

To package a shareable APK without Android Studio, enter the live HTTPS address at [PWABuilder](https://pwabuilder.com), select **Package for stores** → **Android** → **Other Android**, and download the generated package. Choose a signing key and keep the downloaded key and password safe; future APK updates must use the same key.

For the APK to open as a verified full-screen Trusted Web Activity, publish the `assetlinks.json` provided by the package builder at `public/.well-known/assetlinks.json`, then deploy the site again. Android checks that file against the APK signing certificate; without a matching fingerprint, it falls back to browser controls. The Chrome-installed PWA still opens in standalone mode.
