/* eslint-disable no-console */
'use strict';
/* global store, $, api*/

// eslint-disable-next-line no-unused-vars
const bookmarklist = (function(){

  function generateBookmarkElement(bookmark) {
    const expandClass = bookmark.expanded ? '' : 'hidden';

    if (bookmark.edit) {
      return `        
        <li class="js-bookmark-element" data-bookmark-id="${bookmark.id}">
        <form class="js-edit-bookmark" id="js-edit-bookmark">
        <p class='list-header'>
            <input class="title" name="title" type="text" value="${bookmark.title}" />
            <select type="number" name="rating">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
            </select>
            <button type="button" class="js-expand">expand</button>
        </p>
        <div class="${expandClass} js-expand-collapse">
            <p class='description-title'>Description</p>
            <textarea type="text" name="desc" placeholder="Enter Description">${bookmark.desc}</textarea>
            <button type="submit" name="submit" id="submit" value="Submit">Submit</button>
            <div class="bookmark-controls">
                <button class="bookmark-site js-visit-site" target="_blank" onclick="window.open('${bookmark.url}','newwindow');">
                    <span class="button-label">Visit Site</span>
                </button>                
                <button class="bookmark-edit js-bookmark-edit">
                    <span class="button-label">edit</span>
                </button>
                <button class="bookmark-remove js-bookmark-remove">
                    <span class="button-label">remove</span>
                </button>
            </div>
        </div>
        </form>
    </li>`;
    }
    else {
      return `
        <li class="js-bookmark-element" data-bookmark-id="${bookmark.id}">
            <div class='list-header'>
                <p class="bookmark-title title">${bookmark.title}</p>
                <p class="ratings-text title">Rating: ${bookmark.rating} stars</p>
                <p class="margin-right title"><button type="button" class="js-expand" id="js-expand">expand</button></p>
            </div>
            <div class="${expandClass} js-expand-collapse">
                <p class='description-title'>Description</p>
                <p class='description-text'>${bookmark.desc}</p>
                <div class="bookmark-controls">
                <button class="bookmark-site js-visit-site" target="_blank" onclick="window.open('${bookmark.url}','newwindow');">
                    <span class="button-label">Visit Site</span>
                </button>                
                <button class="bookmark-edit js-bookmark-edit">
                    <span class="button-label">edit</span>
                </button>
                <button class="bookmark-remove js-bookmark-remove">
                    <span class="button-label">remove</span>
                </button>
                </div>
            </div>
        </li>`;
    }
  }

  function generateBookmarkString(bookmarklist) {
    const items = bookmarklist.map((bookmark) => generateBookmarkElement(bookmark));
    return items.join('');
  }

  function render() {
    if(store.errorKey){
      $('.error-message').html(`<p> ${api.error}</p>
            <button type="button" id="js-error-close" class="js-error-close">Click to Exit</button>`
      );
      
      $('.error-message').removeClass('hidden');
    }

    let bookmarks = [ ...store.bookmarks ];
    if (store.filterTerm) {
      bookmarks = bookmarks.filter(bookmark => bookmark.rating >= store.filterTerm);
    }
    const bookmarkListString = generateBookmarkString(bookmarks);
    $('.js-bookmark-list').html(bookmarkListString);

  }

  function handleAddBookmarkFormClick() {
    $('#js-bookmark-button-form').click(event => {
      event.preventDefault();
      $('#js-submit-bookmark-form').removeClass('hidden');
      $('#js-bookmark-button-form').addClass('hidden');
    });
  }

  function serializeJson(form) {
    const formData = new FormData(form);
    let o = {};
    formData.forEach((val, name) => o[name] = val);
    return o;
  }

  function handleCloseButtonSubmit() {
    $('#close-button').click(event => {
      event.preventDefault();
      $('#js-bookmark-button-form').removeClass('hidden');
      $('#js-submit-bookmark-form').addClass('hidden');
      $('#js-submit-bookmark-form')[0].reset();
    });
  }

  function handleNewBookmarkSubmit() {
    $('#js-submit-bookmark-form').submit(event => {
      event.preventDefault();
      let formElement = $('#js-submit-bookmark-form')[0];
      let newBookmarkName = serializeJson(formElement);
      $('#js-bookmark-button-form').removeClass('hidden');
      $('#js-submit-bookmark-form').addClass('hidden');
      $('#js-submit-bookmark-form')[0].reset();
      
      api.createBookmark(newBookmarkName)
        .then((newBookmark) => {
          store.addBookmark(newBookmark);          
          render();
        })
        .catch(err => {
          store.errorKey = `Error, try again. ${api.error}`;
          render();
        });
    });
  }

  function getBookmarkIdFromElement(bookmark) {
    return $(bookmark)
      .closest('.js-bookmark-element')
      .data('bookmark-id');
  }

  function handleDeleteBookmarkClicked() {
    $('.js-bookmark-list').on('click', '.js-bookmark-remove', event => {
      const id = getBookmarkIdFromElement(event.currentTarget);
      
      api.deleteBookmark(id)
        .then(() => {
          store.findAndDelete(id);
          render();        
        })
        .catch(err => {
          store.errorKey = `Error, try again. ${api.error}`;
          render();
        });
    });
  }

  function handleErrorMessageClose() {
    $('.error-message').on('click','#js-error-close',event => {
      event.preventDefault();
      $('.error-message').addClass('hidden');
    });
  }

  function handleBookmarkExpandClicked() {
    $('.js-bookmark-list').on('click', '.js-expand', event => {
      console.log('`handleBookmarkExpandClicked` ran');
      const id = getBookmarkIdFromElement(event.target);
      let bookmark = store.findById(id);
      let opposite = {
        expanded: !bookmark.expanded
      };
      //   if (!bookmark.expanded) {
      //     $('.js-expand').text('expand');
      //   }
      //   else {
      //     $('.js-expand').text('collapse');
      //   }
      store.findAndUpdate(id, opposite);
      render();    
    });
  }

  function handleRatingsFilter() {
    $('#rating-filter').on('change', event => {
      const val = $(event.currentTarget).val();
      store.setFilterTerm(val);
      render();
    });
  }

  function handleBookmarkStartEditing() {
    $('.js-bookmark-list').on('click', '.js-bookmark-edit', event => {
      console.log('`handleBookmarkStartEditing` ran');
      const id = getBookmarkIdFromElement(event.target);
      store.setBookmarkIsEditing(id, true);
      render();
    });
  }

  function handleEditBookmarkItemSubmit() {
    $('.js-bookmark-list').on('submit', '.js-edit-bookmark', event => {
      event.preventDefault();
      console.log('`handleEditBookmarkItemSubmit` ran');
      const id = getBookmarkIdFromElement(event.currentTarget);
      let formElement = $('#js-edit-bookmark')[0]; //should use event.currentTarget to hit the right form
      let newBookmarkName = serializeJson(formElement);
      api.updateBookmark(id, newBookmarkName)
        .then(() => {
          store.findAndUpdate(id, newBookmarkName);
          store.setBookmarkIsEditing(id, false);
          render();        
        })
        .catch(err => {
          store.errorKey = `Error, try again. ${api.error.message}`;
          render();
        });
    });
  }

  function bindEventListeners() {
    handleNewBookmarkSubmit();
    handleDeleteBookmarkClicked();
    handleAddBookmarkFormClick();
    handleBookmarkExpandClicked();
    handleRatingsFilter();
    handleCloseButtonSubmit();
    handleErrorMessageClose();
    handleBookmarkStartEditing();
    handleEditBookmarkItemSubmit();
  }

  return {
    render,
    bindEventListeners
  };
}());