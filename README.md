## Tree Bookmarks

# This fork of [https://github.com/ardcore/chrome-better-bookmark]("Better Bookmark") is heavily optimised for people who likes the hierarchical folders' structure in their bookmarks and want to stick to it having tons of (organised) folders.

- Better Bookmark has been renamed to "Tree Bookmarks" and get a new icon from now on.
- The redesign has happened.
- Better-Bookmark-Button extension is now equipped with captions showing up the full path to the current hovered category.
- Now you can also choose the parent directory for the new folder that is being created (in the original version all folders were put into the "Other Bookmarks" with flat structure first).
- Another new feature helps you to get a quick overview of child folders (to see the sub tree) in a chosen directory.
- UI has been improved a bit. Icons, breadcrumb and descriptions were added, input fields and text blocks were moved to key positions.
- Fuse.js library updated to v3.3.0 and max amount of characters for the search pattern is set to 150, therefore, "Pattern length is too long" error shouldn't now block the search (or bitapRegexSearch will be used instead).

<!--<p align="center"><img width="320" src="http://res.cloudinary.com/rootless/image/upload/v1542242610/public/better-bookmark-ui-improved.jpg" title="New Better Bookmark" alt="New Better Bookmark"></p>-->

<p align="center"><img width="320" src="https://github.com/galakhov/chrome-better-bookmark/raw/master/screenshot.png" title="Tree Bookmarks" alt="Tree Bookmarks"></p>

# chrome-better-bookmark

Chrome Extension that lets you easily add bookmarks to any category. Includes spotlight-like weighted search (http://fusejs.io) with mouse/keyboard support.

WebStore URL: https://chrome.google.com/webstore/detail/better-bookmark/pniopfmciclllcpockpkgceikipiibol

# key binding: cmd + b / ctrl + b

Chrome allows you to set your own key binding for every extension. See https://github.com/ardcore/chrome-better-bookmark/issues/1

# TODO

- If a page was bookmarked and the extension was opened, show the full path (location) in a breadcrumb
- Clickable breadcrumb: change parent directory (go up) by clicking on one of directories in a breadcrumb
- Add options (font size and style, focus style, key bindings, sorting options)
- Add position of the tooltip into extension options
- TBD: icon should be greyed out by default, highlighted if the page is already bookmarked
- TBD: subcategory indentation?
