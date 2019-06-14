'use strict';
/* global  */
// eslint-disable-next-line no-unused-vars
const store = (function(){

  const addBookmark = function(bookmark) {
    bookmark.expanded = false;
    bookmark.edit = false;
    this.bookmarks.push(bookmark);
  };

  const findById = function(id) {
    return this.bookmarks.find(bookmark => bookmark.id === id);
  };

  const findAndDelete = function(id) {
    this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
  };

  const toggleExpandedBookmark = function(id, expanded) {
    const bookmark = this.findById(id);
    bookmark.expanded = expanded;
  };

  function findAndUpdate(id, newData){
    let target = this.findById(id);
    return Object.assign(target, newData);
  }

  const setFilterTerm = function(term) {
    this.filterTerm = term;
  };

  const setBookmarkIsEditing = function(id, edit) {
    const bookmark = this.findById(id);
    bookmark.edit = edit;
  };

  return {
    bookmarks: [],
    newBMButton: false,
    filterTerm: 1,
    errorKey: '',
    addBookmark,
    findById,
    findAndDelete,
    toggleExpandedBookmark,
    findAndUpdate,
    setFilterTerm,
    setBookmarkIsEditing
  };
}());