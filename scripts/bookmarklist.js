'use strict';
/* global store, $, api*/

// eslint-disable-next-line no-unused-vars
const bookmarklist = (function(){

  function generateBookmarkElement(bookmark) {
    const expandClass = bookmark.expanded ? '' : 'hidden';

    return `
    <li class="js-bookmark-element" data-bookmark-id="${bookmark.id}">
        <p class='list-header'>
            <span class="bookmark-title">${bookmark.title}</span>
            <span>rating:${bookmark.rating}</span>
            <button type="button" class="js-expand">expand</button>
        </p>
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
    console.log(store.filterTerm);
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
    return JSON.stringify(o);
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
      console.log('hello');
      $('.error-message').addClass('hidden');
    });
  }

  function handleBookmarkExpandClicked() {
    $('.js-bookmark-list').on('click', '.js-expand', event => {
      console.log('`handleItemCheckClicked` ran');
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

  function bindEventListeners() {
    handleNewBookmarkSubmit();
    handleDeleteBookmarkClicked();
    handleAddBookmarkFormClick();
    handleBookmarkExpandClicked();
    handleRatingsFilter();
    handleCloseButtonSubmit();
    handleErrorMessageClose();
  }

  return {
    render,
    bindEventListeners
  };
}());