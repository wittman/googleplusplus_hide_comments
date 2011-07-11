# GooglePlusPlus Hide Comments

## General Information
The `googleplusplus_hide_comments` userscript for Google Plus (aka Google+ aka G+) adds a Hide Comments or Show Comments link on each post; this feature is sticky (the hidden or shown state is recorded in the browser's local storage).

>**Install**: <http://go.wittman.org/aua5>

>_Discussion_: <https://plus.google.com/111309687695898923996/posts/FD9URaSoFnk>

There is also an alternate version that hides all comments by default (see below under the _Alternate Version_ section).

So far, this userscript / extension was tested on Google Chrome 12 and Firefox 5 with [Greasemonkey](http://www.greasespot.net/) ([download](https://addons.mozilla.org/firefox/748/)) and should also work in Safari with the plugin [NinjaKit](http://d.hatena.ne.jp/os0x/20100612/1276330696) ([download](http://ss-o.net/safari/extension/NinjaKit.safariextz)).

Feedback is welcome.

## Alternate Versions

Alt version **"hidden"** hides all comments by default (as opposed to comments being visible by default using the standard version). The standard and alt versions work exactly the same in all other ways.

>**Install Alternate Version "hidden" - Hide all comments by default"**: <http://go.wittman.org/aydn>

***Installing more than one version***:
The scripts are named, namespaced and versioned exactly the same so installing one over-writes a previous primary or alt version. In the description will be an ALTERNATE VERSION clause only in an alt script.

_Note to Developers_:
The _build.rb build script creates alternate script versions. At this time there is one currently supported alt version, "hidden".

## Deprecated Alternate Versions

Alt version "top" is deprecated after reworking the script to fix some deficiencies and accommodate the new hidden alt version.

Though deprecated, the "top" script is still available at the same short/redirect URL:

***Install Alternate Version "top" - Places Hide Comments link on top"***: <http://go.wittman.org/auzv>

## Change Log

### Version 0.1.3

- Show/Hide link sometimes not working on first click resolved (enclosing div click event was interfering). FIXED.
- Alt version "top" deprecated. REMOVED
- Alt version "hidden" added. Using this script version hides comments by default. NEW
- DOM selector for comments improved. FIXED