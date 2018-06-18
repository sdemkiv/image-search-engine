import * as React from 'react';
import * as $ from 'jquery';

import InfiniteScroll from 'react-infinite-scroller';
import PhotoGallery, { GalleryItem, LightboxItem } from '../PhotoGallery/PhotoGallery';
import SearchInput from '../SearchPhotos/SearchInput';

export interface InfiniteScrollerProps {

}

export interface InfiniteScrollerState {
	galleryPhotos: GalleryItem[];
	lightboxPhotos: LightboxItem[];
	flickrStatus: SourceStatus;
	pixabayStatus: SourceStatus;
	tags: string[];
	noResults: boolean;
}

interface SourceStatus {
	isLoading: boolean;
	currentPage: number;
	allowNextPage: boolean;
}

export default class InfiniteScroller extends React.Component<InfiniteScrollerProps, InfiniteScrollerState> {
	constructor(props) {
		super(props);

		this.state = {
			galleryPhotos: [],
			lightboxPhotos: [],
			flickrStatus: {
				isLoading: true,
				currentPage: 1,
				allowNextPage: true
			},
			pixabayStatus: {
				isLoading: true,
				currentPage: 1,
				allowNextPage: true
			},
			tags: [],
			noResults: false
		};
	}

	searchForImages(tags: string[]) {
		this.state.galleryPhotos.splice(0, this.state.galleryPhotos.length);
		this.state.lightboxPhotos.splice(0, this.state.lightboxPhotos.length);
		this.state.tags.splice(0, this.state.tags.length);

		for (var i = 0; i < tags.length; i++) {
			this.state.tags.push(tags[i]);
		}

		this.state.flickrStatus.currentPage = 1;
		this.state.pixabayStatus.currentPage = 1;
		this.state.flickrStatus.allowNextPage = true;
		this.state.pixabayStatus.allowNextPage = true;
		this.state.flickrStatus.isLoading = true;
		this.state.pixabayStatus.isLoading = true;

		this.loadImages();
	}

	loadImages() {
		this.getFlickrPhotos();
		this.getPixabayPhotos();
	}

	setFlickrStateProperty(properyName: string, value: any) {
		var currFlickrStatus = { ...this.state.flickrStatus };
		currFlickrStatus[properyName] = value;
		this.setState({ flickrStatus: currFlickrStatus });
	}

	setPixabayStateProperty(properyName: string, value: any) {
		var currPixabayStatus = { ...this.state.pixabayStatus };
		currPixabayStatus[properyName] = value;
		this.setState({ pixabayStatus: currPixabayStatus });
	}

	getFlickrPhotos() {
		if (!this.state.flickrStatus.allowNextPage) {
			this.setFlickrStateProperty("isLoading", false);
			return;
		}
		this.setFlickrStateProperty("isLoading", true);
		var perPage = this.state.flickrStatus.currentPage == 1 ? 15 : 10;

		debugger;
		var tagsCopy = [ ...this.state.tags ];
		var tags = tagsCopy.join('+');
		var url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=47762016173aaf8893440f423c81542a&tags=${tags}&format=json&nojsoncallback=1&page=${this.state.flickrStatus.currentPage}&per_page=${perPage}`;
		$.getJSON(url)
			.done((data: any) => {
				var defers = [];
				data.photos.photo.forEach((photo: any) => {
					defers.push(this.getFlickrPhoto(photo));
				});
				$.when(...defers).then(() => {
					this.forceUpdate();
					this.setFlickrStateProperty("isLoading", false);
				});
				if (this.state.flickrStatus.currentPage < data.photos.pages) {
					this.setFlickrStateProperty("allowNextPage", true);
					this.setFlickrStateProperty("currentPage", this.state.flickrStatus.currentPage + 1);
				}
				else {
					this.setFlickrStateProperty("allowNextPage", false);
				}
			}).fail((jqXHR, errorText) => { console.log(jqXHR, errorText); });
	}

	getFlickrPhoto(photo: any): JQueryDeferred<any> {
		var src = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + ".jpg";
		var sizeUrl = `https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=47762016173aaf8893440f423c81542a&photo_id=${photo.id}&format=json&nojsoncallback=1`;
		var deferr = $.Deferred();
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
			deferr.resolve();
		}).fail((jqXHR, errorText) => { console.log(jqXHR, errorText); deferr.resolve() });
		return deferr;
	}

	getPixabayPhotos() {
		if (!this.state.pixabayStatus.allowNextPage) {
			this.setPixabayStateProperty("isLoading", false);
			return;
		}
		this.setPixabayStateProperty("isLoading", true);
		var perPage = 10;
		debugger;
		var tagsCopy = [ ...this.state.tags ];
		var tags = tagsCopy.join('+');
		var url = `https://pixabay.com/api/?key=9203582-9000065cb9ad2532b64e56d06&q=${tags}&image_type=photo&pretty=true&page=${this.state.pixabayStatus.currentPage}&per_page=${perPage}`;
		$.getJSON(url).done((data) => {
			data.hits.forEach(photo => {
				//var src = photo.largeImageURL;
				var width = photo.webformatWidth;
				var height = photo.webformatHeight;

				this.addPhotoToGallery(
					new GalleryItem(photo.webformatURL, width, height),
					new LightboxItem(photo.largeImageURL, 'Pixabay'));
			});
			if (this.state.pixabayStatus.currentPage < Math.ceil(data.total / perPage)) {
				this.setPixabayStateProperty("allowNextPage", true);
				this.setPixabayStateProperty("currentPage", this.state.flickrStatus.currentPage + 1);
			} else {
				this.setPixabayStateProperty("allowNextPage", false);
			}
			this.setPixabayStateProperty("isLoading", false);
			this.forceUpdate();
		}).fail((jqXHR, errorText) => { console.log(jqXHR, errorText); });
	}

	addPhotoToGallery(galleryPhoto: GalleryItem, lightboxItem: LightboxItem) {
		console.log(galleryPhoto, lightboxItem)
		if (this.state.galleryPhotos.filter(x => x.src == galleryPhoto.src).length == 0) {
			console.log('true');
			this.state.galleryPhotos.push(galleryPhoto);
			this.state.lightboxPhotos.push(lightboxItem);
		}
	}

	loadItems(page) {
		if (this.state.flickrStatus.isLoading || this.state.pixabayStatus.isLoading) {
			return;
		}
		this.loadImages();
	}

	render() {
		const loader = <div className="loader"></div>;
		return <div>
			<SearchInput 
				search={this.searchForImages.bind(this)}  />
			<InfiniteScroll
				pageStart={0}
				loadMore={this.loadItems.bind(this)}
				hasMore={this.state.flickrStatus.allowNextPage || this.state.pixabayStatus.allowNextPage}
				loader={loader}>
				<PhotoGallery galleryImages={this.state.galleryPhotos} lightboxImages={this.state.lightboxPhotos} />
			</InfiniteScroll>
		</div>;
	}
};