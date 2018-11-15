var categoryNodes = [];
var wrapper;
var focusedElement;
var fuzzySearch;
var currentNodeCount = 0;
var parentClicked = false;

var DOWN_KEYCODE = 40;
var UP_KEYCODE = 38;
var CONFIRM_KEYCODE = 13;

function filterRecursively(nodeArray, childrenProperty, filterFn, results) {
  results = results || [];

  nodeArray.forEach(function(node) {
    if (filterFn(node)) {
      results.push(node);
    }
    if (node.children) {
      filterRecursively(node.children, childrenProperty, filterFn, results);
    }
  });

  return results;
}

function setFullPathRecursively(el, node, titles) {
  var currentNode = node;

  var getParentNode = chrome.bookmarks.get(currentNode.parentId, function(
    parentNode
  ) {
    if (parentNode[0] && parentNode[0].parentId > 0) {
      titles.unshift(parentNode[0].title);
      currentNode = parentNode[0];
      setFullPathRecursively(el, currentNode, titles);
    } else {
      setTimeout(function() {
        el.setAttribute("data-tooltip", titles.join(" > "));
      }, 0);
    }
  });
}

function createUiElement(node, captions = true) {
  var el = document.createElement("div");
  el.setAttribute("data-id", node.id);
  el.setAttribute("data-count", node.children.length);
  el.setAttribute("data-title", node.title);
  el.setAttribute("data-parent-id", node.parentId);
  el.classList.add("bookmark");
  if (captions) {
    var getParentNode = chrome.bookmarks.get(node.parentId, function(
      parentNode
    ) {
      if (parentNode[0] && parentNode[0].parentId > 0) {
        setFullPathRecursively(el, node, []);
      }
    });
  }
  // TODO: get position of the tooltip from the extension options and pass it over here
  el.setAttribute("data-tooltip-position", "bottom"); // position of the tooltip
  el.innerHTML = "<span class='bookmark__title'>" + node.title + "</span>";
  el = appendRadioButtonParentSelector(el, node.parentId);
  return el;
}

function showFullPathOfParentDir(parentSelected) {
  if (parentSelected != null) {
    var dirName = parentSelected.getAttribute("data-tooltip");
    if (dirName != null) {
      dirName += " > ";
    } else {
      dirName = "";
    }
    dirName += parentSelected.getElementsByTagName("span")[0].textContent;

    var output = document.querySelector(".bookmark__parent-output header");
    if (output != null) {
      // TODO: change parent directory by clicking on one dir in a breadcrumb
      output.innerHTML =
        "<p class='bookmark__parent-chosen'><b>" +
        dirName +
        "</b></p><aside class='bookmark__parent-create-icon'>" +
        chrome.i18n.getMessage("icondown") +
        "</aside><p class='bookmark__parent-text'>" +
        chrome.i18n.getMessage("anotherparentdir") +
        "</p>";
      if (!output.parentNode.classList.contains("visible")) {
        output.parentNode.classList.add("visible");
      }
      var hiddenInput = document.querySelector(".bookmark__parent-hidden");
      hiddenInput.setAttribute("value", parentSelected.getAttribute("data-id"));
    }
  }
}

function showTreeOfSelectedNode(parentNodeId) {
  if (parentNodeId) {
    chrome.bookmarks.getSubTree(parentNodeId, drawTree);
  }
}

function getDirectoriesInChildren(categoryNodes) {
  return filterRecursively(categoryNodes, "children", function(node) {
    return !node.url && node.id > 0;
  });
}

function drawTree(categoryNodes) {
  if (categoryNodes[0] && categoryNodes[0].children.length > 0) {
    var footer = document.querySelector(".bookmark__parent-output footer");
    while (footer.firstChild) {
      // remove the previously generated tree first
      footer.removeChild(footer.firstChild);
    }
    footer.removeEventListener("click", handleAddBookmark);

    var categoryChildren = getDirectoriesInChildren(categoryNodes[0].children);
    var elementsWithUi = [];
    categoryChildren.forEach(function(node) {
      elementsWithUi.push(createUiElement(node, false));
    });

    if (categoryChildren.length > 0) {
      // if there are children: i.e. subdirectories
      var footerUl = document.createElement("ul");
      var rootNodeId = categoryNodes[0].id;
      var secondParent, currentNodeParentId, newEl, firstLevel;
      secondParent = rootNodeId;
      elementsWithUi.forEach(function(element) {
        // make a tree
        currentNodeParentId = element.getAttribute("data-parent-id");
        if (currentNodeParentId !== rootNodeId) {
          var footerUlLi = document.createElement("li");
          if (currentNodeParentId === secondParent && firstLevel === true) {
            // append another element (indented of two levels)
            newEl = document.createElement("i");
            newEl.innerHTML = "&nbsp;&nbsp;&nbsp;&#8627;";
            element.insertBefore(newEl, element.firstChild);
          } else {
            firstLevel = true;
            secondParent = element.getAttribute("data-id");
          }
          // append a list element (indented of one level)
          footerUlLi.appendChild(element);
          footerUl.appendChild(footerUlLi);
        } else {
          // append a root element without a list wrapper
          footerUl.appendChild(element);
          firstLevel = false;
        }
      });
      footer.appendChild(footerUl);
      footer.addEventListener("click", handleAddBookmark);
    }
  }
}

function appendRadioButtonParentSelector(el, parentId) {
  var theInput = document.createElement("input");
  theInput.setAttribute("type", "radio");
  theInput.setAttribute("name", "parent-id");
  theInput.setAttribute("class", "bookmark__parent-id-selector");
  theInput.setAttribute("value", parentId);
  // if radio button was clicked grab the value of the parent and pass it over
  theInput.addEventListener("click", function(e) {
    parentClicked = true;
    var parentSelected = this.parentNode;
    showFullPathOfParentDir(parentSelected);
    showTreeOfSelectedNode(parentSelected.getAttribute("data-id"));
  });
  el.appendChild(theInput);

  return el;
}

function handleAddBookmark(e) {
  triggerClick(e.target);
}

function triggerClick(element) {
  if (element.nodeName.toLowerCase() === "span") {
    // clicked on .bookmark__parent-create-dir-name span
    element = element.parentNode;
  }
  // else if (element.nodeName.toLowerCase() === "p") {
  //   // clicked on p.bookmark__parent-create-dir-name
  //   element = element.parentNode;
  // }

  var categoryId = element.getAttribute("data-id");
  var newCategoryTitle;

  if (categoryId == "NEW") {
    newCategoryTitle = element.getAttribute("data-title");

    var checkedElId = document.querySelector(".bookmark__parent-hidden");
    var selectedParentId = checkedElId.value != "" ? checkedElId.value : null;
    chrome.bookmarks.create(
      {
        parentId: selectedParentId,
        title: newCategoryTitle
      },
      function(res) {
        processBookmark(res.id);
      }
    );
  } else {
    processBookmark(categoryId);
  }
}

function processBookmark(categoryId) {
  getCurrentUrlData(function(url, title) {
    if (title && categoryId && url) {
      addBookmarkToCategory(categoryId, title, url);
      window.close();
    }
  });
}

function addBookmarkToCategory(categoryId, title, url) {
  chrome.bookmarks.create({
    parentId: categoryId,
    title: title,
    url: url
  });
}

function getCurrentUrlData(callbackFn) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    callbackFn(tabs[0].url, tabs[0].title);
  });
}

function createUiFromNodes(categoryNodes) {
  var categoryUiElements = [];
  currentNodeCount = categoryNodes.length;

  categoryNodes.forEach(function(node) {
    categoryUiElements.push(createUiElement(node));
  });

  categoryUiElements.forEach(function(element) {
    wrapper.appendChild(element);
  });
}

function resetUi() {
  var newDirInputWrapper = document.querySelector(
    ".bookmark__parent-create-wrapper"
  );
  var newDirInput = newDirInputWrapper.querySelector(
    ".bookmark__parent-create"
  );
  if (newDirInput) {
    // remove existing input field before the next update (see addCreateCategoryButton)
    newDirInputWrapper.removeChild(newDirInput);
  }
  // update the folders in the whole tree according to the entered search string
  wrapper.innerHTML = "";
}

function focusItem(index) {
  if (focusedElement) {
    focusedElement.classList.remove("focus");
  }
  focusedElement = wrapper.childNodes[index];
  focusedElement.classList.add("focus");
  focusedElement.scrollIntoView(false);
}

function addCreateCategoryButton(categoryName) {
  // TODO: create options
  // TODO: parse the position of the tooltip from extension's options
  var el = document.createElement("div");
  el.setAttribute("data-id", "NEW");
  el.setAttribute("data-title", categoryName);
  el.setAttribute("data-tooltip-position", "bottom"); // set position of the tooltip
  el.classList.add("bookmark__parent-create");
  el.setAttribute("data-tooltip", chrome.i18n.getMessage("caption"));
  el.innerHTML =
    "<span class='bookmark__parent-create-dir-name'>" + categoryName + "</p>";
  document.querySelector(".bookmark__parent-create-wrapper").appendChild(el);
  currentNodeCount = currentNodeCount + 1;
}

function addHiddenOutput() {
  // add hidden element to output a parent directory later
  var output = document.createElement("div");
  output.setAttribute("class", "bookmark__parent-output");
  var header = document.createElement("header");
  output.appendChild(header);
  var input = document.createElement("input");
  input.setAttribute("type", "hidden");
  input.setAttribute("name", "parentid");
  input.setAttribute("class", "bookmark__parent-hidden");
  output.appendChild(input);
  var footer = document.createElement("footer");
  output.appendChild(footer);

  return output;
}

function addNewDirectoryTextAbove() {
  var newDirWrapperCaptionsAbove = document.createElement("div");
  newDirWrapperCaptionsAbove.setAttribute(
    "class",
    "bookmark__parent-create-wrapper-desc"
  );
  newDirWrapperCaptionsAbove.innerHTML =
    "<aside class='bookmark__parent-create-icon'>" +
    chrome.i18n.getMessage("iconup") +
    "</aside><p>" +
    chrome.i18n.getMessage("new") +
    "</p>";
  return newDirWrapperCaptionsAbove;
}

function addNewDirectoryTextBelow() {
  var newDirWrapperCaptionsBelow = document.createElement("div");
  newDirWrapperCaptionsBelow.setAttribute(
    "class",
    "bookmark__parent-create-wrapper-desc"
  );
  newDirWrapperCaptionsBelow.innerHTML =
    "<aside class='bookmark__parent-create-icon icon-right'>" +
    chrome.i18n.getMessage("icondown") +
    "</aside><p class='bookmark__parent-create-dir-caption'>" +
    chrome.i18n.getMessage("chooseparent") +
    "</p>";
  return newDirWrapperCaptionsBelow;
}

function addNewDirectoryClickableWrapper() {
  var newDirWrapper = document.createElement("div");
  newDirWrapper.setAttribute("class", "bookmark__parent-create-wrapper");
  return newDirWrapper;
}

function createInitialTree() {
  chrome.bookmarks.getTree(function(t) {
    wrapper = document.getElementById("wrapper");

    var options = {
      shouldSort: true,
      threshold: 0.4,
      location: 0,
      distance: 100,
      maxPatternLength: 150,
      minMatchCharLength: 2,
      keys: ["title"]
    };

    categoryNodes = filterRecursively(t, "children", function(node) {
      return !node.url && node.id > 0; // include folders only
    }).sort(function(a, b) {
      return b.dateGroupModified - a.dateGroupModified;
    });

    createUiFromNodes(categoryNodes);

    wrapper.style.width = wrapper.clientWidth + "px";

    if (currentNodeCount > 0) {
      focusItem(0);
    }

    fuzzySearch = new Fuse(categoryNodes, options);

    var newDirWrapperAbove = addNewDirectoryTextAbove();
    wrapper.parentNode.insertBefore(newDirWrapperAbove, wrapper);
    var newDirInputWrapper = addNewDirectoryClickableWrapper();
    wrapper.parentNode.insertBefore(newDirInputWrapper, wrapper);
    var newDirWrapperBelow = addNewDirectoryTextBelow();
    wrapper.parentNode.insertBefore(newDirWrapperBelow, wrapper);
    var hiddenOutput = addHiddenOutput();
    wrapper.parentNode.insertBefore(hiddenOutput, wrapper);
    // Add bookmarks' clicks for the tree
    wrapper.addEventListener("click", handleAddBookmark);
    // Add a bookmarks' click to the bookmark__parent-create-wrapper
    newDirInputWrapper.addEventListener("click", handleAddBookmark);
  });
}

(function() {
  var searchElement = document.getElementById("search");
  var text = "";
  var newNodes;
  var index = 0;

  createInitialTree();

  searchElement.addEventListener("keydown", function(e) {
    if (e.keyCode == UP_KEYCODE) {
      e.preventDefault();
      index = index - 1;
      if (index < 0) {
        index = currentNodeCount - 1;
      }
      focusItem(index);
    } else if (e.keyCode == DOWN_KEYCODE) {
      e.preventDefault();
      index = index + 1;
      if (index >= currentNodeCount) {
        index = 0;
      }
      focusItem(index);
    } else if (e.keyCode == CONFIRM_KEYCODE) {
      if (currentNodeCount > 0) {
        triggerClick(focusedElement);
      }
    } else {
      // to get updated input value, we need to schedule it to the next tick
      setTimeout(function() {
        text = document.getElementById("search").value;
        if (text.length) {
          newNodes = fuzzySearch.search(text);
          resetUi();
          createUiFromNodes(newNodes);

          if (newNodes.length && parentClicked === false) {
            focusItem(0);
          }

          if (!newNodes.length || text !== newNodes[0].title) {
            addCreateCategoryButton(text);
          }
        } else {
          resetUi();
          createUiFromNodes(categoryNodes);
          if (currentNodeCount > 0) {
            focusItem(0);
          }
        }
        index = 0;
      }, 0);
    }
  });

  searchElement.focus();
})();
