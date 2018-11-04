# This fork is heavily optimised for people who sticks to the hierarchical folder structure in their bookmarks

- Better-Bookmark-Button extension is now equipped with captions showing up the full path to the current hovered category.
- Now you can also choose the parent directory for the new folder that is being created (in the original version all folders were put into the "Other Bookmarks" with flat structure first).
- Another new feature helps you to get a quick overview of child folders (to see the sub tree) in a chosen directory.
- Fuse.js library updated to v3.3.0 and max amount of characters for the search pattern is set to 150, therefore, "Pattern length is too long" error shouldn't now block the search (or bitapRegexSearch will be used instead).

# chrome-better-bookmark

Chrome Extension that lets you easily add bookmarks to any category. Includes spotlight-like weighted search (http://fusejs.io) with mouse/keyboard support.

WebStore URL: https://chrome.google.com/webstore/detail/better-bookmark/pniopfmciclllcpockpkgceikipiibol

# key binding: cmd + b / ctrl + b

Chrome allows you to set your own key binding for every extension. See https://github.com/ardcore/chrome-better-bookmark/issues/1

# TODO

- Add options (font size and style, focus style, key bindings, sorting options)
- Add position of the tooltip into extension options
- TBD: icon should be greyed out by default, highlighted if the page is already bookmarked
- TBD: subcategory indentation?
