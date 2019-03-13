const { toPositiveInt } = require("./utils");
const { newReserve } = require('../common_utils/Reserve');
const { noop } = require('../common_utils/Utils');

const STARTING_PAGE = 1;
const SEARCH_REQUEST_SIZE = 20;

function newPhotoProvider(photoService) {
  let page = STARTING_PAGE;
  let reserve = newReserve(100);
  let tags = defaultTags();

  let onPhotosFoundCb = noop;

  return Object.freeze({
    setTags(requestedTags) {
      let newTags = defaultTags(requestedTags);
      if (newTags !== tags) {
        tags = newTags;
        resetSearch();
      }
      return this;
    },
    requestPhotos(count) {
      reserve.add(toPositiveInt(count));
      requestPhotos();
      return this;
    },
    onPhotosFound(cb) {
      onPhotosFoundCb = cb;
      return this;
    },
    stop() {
      reserve.reset();
      return this;
    }
  });

  function resetSearch() {
    page = STARTING_PAGE;
  }

  function requestPhotos() {
    console.log(`Requesting search service for photos.`);

    photoService.search(SEARCH_REQUEST_SIZE, page++, tags)
      .then(photos => {
        let filtered = photos.filter(hasShortTitle);

        onPhotosFoundCb(filtered);

        reserve.remove(filtered.length);
        console.log(`${reserve.reserved} photos left to find`);
        if (!reserve.isEmpty()) {
          requestPhotos();
        }
      });
  }
}

function defaultTags(tags) {
  if (tags === null || tags === undefined || tags === "") {
    return "nature,science,food,cat,car";
  }
  return tags;
}

function hasShortTitle(photo) {
  let titleLength = photo.title.length;
  return titleLength > 0 && titleLength <= 30;
}

module.exports = {
  newPhotoProvider
};