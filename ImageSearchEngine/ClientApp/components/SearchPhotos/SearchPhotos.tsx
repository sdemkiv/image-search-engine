import * as React from 'react';
import * as $ from 'jquery';

import SearchInput from './SearchInput';
import PhotoGallery, { GalleryItem, LightboxItem } from '../PhotoGallery/PhotoGallery';

interface SearchPhotosState {
	galleryPhotos: GalleryItem[];
	lightboxPhotos: LightboxItem[];
}

export default class SearchPhotos extends React.Component<{}, SearchPhotosState> {
	constructor() {
		super();

		this.state = {
			galleryPhotos: [],
			lightboxPhotos: []
		};
	}

	public render() {
		return <div>
			<SearchInput search={this.searchForImages.bind(this)} />
			<PhotoGallery galleryImages={this.state.galleryPhotos} lightboxImages={this.state.lightboxPhotos} />
		</div>;
	}

	searchForImages(tags: string[]) {
		var searchTags = tags.join('+');
		this.getFlickrPhotos(searchTags);
		this.getPixabayPhotos(searchTags);
	}

	getFlickrPhotos(tags: string) {
		this.state.galleryPhotos.splice(0, this.state.galleryPhotos.length);
		this.state.lightboxPhotos.splice(0, this.state.lightboxPhotos.length);

		var url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=47762016173aaf8893440f423c81542a&tags=${tags}&format=json&nojsoncallback=1`;
		$.getJSON(url)
			.done((data: any) => {
				data.photos.photo.forEach((photo: any) => {
					this.getFlickrPhoto(photo);
				});
			}).fail((jqXHR, errorText) => { console.log(jqXHR, errorText); });
	}

	getFlickrPhoto(photo: any) {
		var src = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + ".jpg";
		var sizeUrl = `https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=47762016173aaf8893440f423c81542a&photo_id=${photo.id}&format=json&nojsoncallback=1`;
		$.getJSON(sizeUrl).done((sizeData: any) => {
			var size = sizeData.sizes.size.filter(s => s.label == 'Thumbnail')[0];
			//var size = sizeData.sizes.size[sizeData.sizes.size.length - 1];
			var width = 1;
			if (+size.width) {
				width = +size.width;
			}
			var height = 1;
			if (+size.height) {
				height = +size.height;
			}
			var largeSize = sizeData.sizes.size.filter(s => s.label == 'Large')[0];
			if (!largeSize) {
				largeSize = sizeData.sizes.size[sizeData.sizes.size.length - 1];
			}

			this.addPhotoToGallery(
				new GalleryItem(src, width, height),
				new LightboxItem(largeSize.source, 'Flickr'));

			this.forceUpdate();
		}).fail((jqXHR, errorText) => { console.log(jqXHR, errorText); });
	}

	getPixabayPhotos(tags: string) {
		var url = `https://pixabay.com/api/?key=9203582-9000065cb9ad2532b64e56d06&q=${tags}&image_type=photo&pretty=true`;
		$.getJSON(url).done((data) => {
			data.hits.forEach(photo => {
				//var src = photo.largeImageURL;
				var width = photo.webformatWidth;
				var height = photo.webformatHeight;

				this.addPhotoToGallery(
					new GalleryItem(photo.webformatURL, width, height),
					new LightboxItem(photo.largeImageURL, 'Pixabay'));

				this.forceUpdate();
			});
		}).fail((jqXHR, errorText) => { console.log(jqXHR, errorText); });
	}

	addPhotoToGallery(galleryPhoto: GalleryItem, lightboxItem: LightboxItem) {
		this.state.galleryPhotos.push(galleryPhoto);
		this.state.lightboxPhotos.push(lightboxItem);
	}
}
