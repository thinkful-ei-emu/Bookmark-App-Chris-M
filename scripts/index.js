'use strict';
/* global bookmarklist, store, api */
/*eslint-env jquery*/
// eslint-disable-next-line no-unused-vars
$(document).ready(function() {
  bookmarklist.bindEventListeners();
  bookmarklist.render();

  api.getBookmarks()
    .then((bookmarks) => {
      bookmarks.forEach((bookmark) => store.addBookmark(bookmark));
      bookmarklist.render();
    });
});