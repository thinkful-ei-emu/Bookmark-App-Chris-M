'use strict';
/* global  */
/*eslint-env jquery*/

// eslint-disable-next-line no-unused-vars
let api = (function() {
  function listApiFetch(...args) {
    let error;
    return fetch(...args)
      .then(res => {
        if (!res.ok) {
          // Valid HTTP response but non-2xx status - let's create an error!
          error = { code: res.status };
        }
  
        // In either case, parse the JSON stream:
        return res.json();
      })
  
      .then(data => {
        // If error was flagged, reject the Promise with the error object
        if (error) {
          error.message = data.message;
          return Promise.reject(error);
        }
  
        // Otherwise give back the data as resolved Promise
        return data;
      });
  }

  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/chrismartin';

  function getBookmarks(){
    return listApiFetch(`${BASE_URL}/bookmarks`);
  }

  function createBookmark(newBookmarkName) {
    return listApiFetch(`${BASE_URL}/bookmarks`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: newBookmarkName
    });
  }

  function deleteBookmark(id){
    return listApiFetch(`${BASE_URL}/bookmarks/${id}`, {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
    });
  }

  return {
    getBookmarks,
    createBookmark,
    deleteBookmark
  };

}());