import photos, { Size } from './Photos';

it(`provides a list of photo objects`, () => {
  let resultPhotos = photos.getMultiple(5, Size.m);

  expect(resultPhotos).toEqual([
    {}
  ])
});