# ns8-modal

At first I thought the issue was to do with not being able to use the `@NativeClass()` decorator on my extended classes in `packages/mobile-app/src/app/utils` but when I leave it out everything builds with no issues.

The problem may actually be that the current method of navigation being used within a modal is not working.

The modal is opened, containing a page-router-outlet, and onInit it will load it's inital route via the router. While this worked in NS6, it appears as though it is not in NS8 (and appears to be loading in the main router outlet).

## Run example

Make sure you have yarn set in the nativescript cli.
`ns package-manager set yarn`

Run with emulator. (currently only testing android)
`yarn run mobile:android`
or run `ns run android` from `/packages/mobile-app`.
