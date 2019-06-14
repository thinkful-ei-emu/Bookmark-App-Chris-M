'use strict';
/* global cuid */

// eslint-disable-next-line no-unused-vars
const bookmark = (function() {

  const validateName = function(title) {
    if(!title) throw new TypeError('Name must not be blank');
  };

  const validateUrl= function(url) {
    if(!url) throw new TypeError('Url must not be blank');
  };
    
  const create = function(title, url, desc, rating) {
    return {
      id: cuid(),
      title,
      url,
      desc,
      rating,      
      expanded: false,
      edit: false
    };
  };

  return {
    validateName,
    validateUrl,
    create
  };
}());