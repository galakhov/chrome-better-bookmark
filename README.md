## Tree First Bookmarks

# This fork of <a href="https://github.com/ardcore/chrome-better-bookmark">"Better Bookmark"</a> is heavily optimised for people who likes the hierarchical folders' structure in their bookmarks and wants to stick to it having tons of (organised) folders.

- Better Bookmark has been renamed to "Tree First Bookmarks" and gets a new icon from now on.
- The redesign has happened.
- Better-Bookmark-Button extension is now equipped with captions showing up the full path to the current bookmark on hovered category.
- Now you can also choose the parent directory for the new folder that is being created (in the original version all folders were put into the "Other Bookmarks" with a flat structure first).
- Another new feature — The Sub Tree — helps you to get a quick overview of sub-folders in a chosen directory (click on any radio button to activate it).
- UI has been also improved. Arrows, breadcrumb and descriptions were added, input fields and text blocks were moved to key positions.
- Fuse.js library (fuzzy search) updated to v3.3.0 and max amount of characters for the search pattern has been changed, therefore, "Pattern length is too long" error shouldn't now block the search (or bitapRegexSearch will be used instead).
- Clickable breadcrumbs allow you to change a parent directory (to go up/down the tree) by clicking on one of the links in a breadcrumb (start by clicking any radio button).

<p align="center"><img width="320" src="https://raw.githubusercontent.com/galakhov/tree-first-bookmarks/master/screenshot.png" title="Tree First Bookmarks" alt="Tree First Bookmarks"></p>

# chrome-better-bookmark

Chrome Extension that lets you easily add bookmarks to any category. Includes spotlight-like weighted search (http://fusejs.io) with mouse/keyboard support.

WebStore URL: https://chrome.google.com/webstore/detail/tree-first-bookmarks/lempbilidejiiljkciadplnekoflbmnl

# key binding: cmd + b / ctrl + b

Chrome allows you to set your own key binding for every extension. See https://github.com/ardcore/chrome-better-bookmark/issues/1

# TODO

- Show the location of bookmarked page as the full path in a breadcrumb when the extension was opened
- Add options (font size and style, focus style, key bindings, sorting options)
- Add position of the tooltip into extension's options
- TBD: icon should be greyed out by default, highlighted if the page is already bookmarked
- TBD: subcategory indentation?
