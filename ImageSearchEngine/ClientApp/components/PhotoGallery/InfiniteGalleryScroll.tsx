import * as React from 'react';
import * as $ from 'jquery';

import InfiniteScroll from 'react-infinite-scroller';
import PhotoGallery, { GalleryItem, LightboxItem } from '../PhotoGallery/PhotoGallery';
import { BarLoader } from 'react-spinners';

import FlickrService from '../../services/images/FlickrService';
import PixabayService from '../../services/images/PixabayService';
import IImageService, { SearchData, ImageData } from '../../services/images/IImageService';

export interface InfiniteScrollerProps {
	startLoading: () => void;
	finishLoading: () => void;
	tags: string[];
}

export interface InfiniteScrollerState {
	galleryItems: GalleryItem[];
	lightboxItems: LightboxItem[];
	currentPage: number;
	allowNextPage: boolean;
}

export default class InfiniteGalleryScroll extends React.Component<InfiniteScrollerProps, InfiniteScrollerState> {
	constructor(props) {
		super(props);

		this.state = {
			galleryItems: [],
			lightboxItems: [],
			currentPage: 1,
			allowNextPage: true
		};

		this.imageSearchServices = [
			new FlickrService(),
			new PixabayService()
		];
	}

	imageSearchServices: IImageService[];

	public SearchForImages(tags: string[]) {
		this.setState({
			galleryItems: [],
			lightboxItems: [],
			currentPage: 1,
			allowNextPage: true			
		});

		this.loadImages();
	}

	loadImages() {
		var perPage = this.getPerPageNumber(this.state.currentPage);
		var searchPromises = this.imageSearchServices.map((service: IImageService) => {
			return service.Search(this.props.tags, this.state.currentPage, perPage)
		});
		$.when(...searchPromises).then((...searchDatas: SearchData[]) => {
			var newGalleryItems = [...this.state.galleryItems];
			var newLightboxItems = [...this.state.lightboxItems];

			searchDatas.map((searchData: SearchData) => {
				searchData.imageData.map((imageData: ImageData) => {
					newGalleryItems.push(new GalleryItem(imageData.src, imageData.width, imageData.height));
					newLightboxItems.push(new LightboxItem(imageData.srcLarge, ''));
				});
			});

			debugger;
			var newCurrentPage = newGalleryItems.length === 0 ? this.state.currentPage : this.state.currentPage + 1;
			var allowNextPage = newGalleryItems.length !== 0;
			this.setState({
				galleryItems: newGalleryItems,
				lightboxItems: newLightboxItems,
				currentPage: newCurrentPage,
				allowNextPage: allowNextPage
			});
		});
	}

	getPerPageNumber(currentPage: number): number {
		return currentPage == 1 ? 15 : 9;
	}

	//getFlickrPhotos() {
	//	if (!this.state.flickrStatus.allowNextPage) {
	//		this.setFlickrStateProperty("isLoading", false);
	//		return;
	//	}
	//	this.setFlickrStateProperty("isLoading", true);
	//	var perPage = this.state.flickrStatus.currentPage == 1 ? 15 : 10;

	//	debugger;
	//	var tagsCopy = [ ...this.state.tags ];
	//	var tags = tagsCopy.join('+');
	//	var url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=47762016173aaf8893440f423c81542a&tags=${tags}&format=json&nojsoncallback=1&page=${this.state.flickrStatus.currentPage}&per_page=${perPage}`;
	//	$.getJSON(url)
	//		.done((data: any) => {
	//			var defers = [];
	//			data.photos.photo.forEach((photo: any) => {
	//				defers.push(this.getFlickrPhoto(photo));
	//			});
	//			$.when(...defers).then(() => {
	//				this.forceUpdate();
	//				this.setFlickrStateProperty("isLoading", false);
	//			});
	//			if (this.state.flickrStatus.currentPage < data.photos.pages) {
	//				this.setFlickrStateProperty("allowNextPage", true);
	//				this.setFlickrStateProperty("currentPage", this.state.flickrStatus.currentPage + 1);
	//			}
	//			else {
	//				this.setFlickrStateProperty("allowNextPage", false);
	//			}
	//		}).fail((jqXHR, errorText) => { console.log(jqXHR, errorText); });
	//}

	//getFlickrPhoto(photo: any): JQueryDeferred<any> {
	//	var src = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + ".jpg";
	//	var sizeUrl = `https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=47762016173aaf8893440f423c81542a&photo_id=${photo.id}&format=json&nojsoncallback=1`;
	//	var deferr = $.Deferred();
	//	$.getJSON(sizeUrl).done((sizeData: any) => {
	//		var size = sizeData.sizes.size.filter(s => s.label == 'Thumbnail')[0];
	//		//var size = sizeData.sizes.size[sizeData.sizes.size.length - 1];
	//		var width = 1;
	//		if (+size.width) {
	//			width = +size.width;
	//		}
	//		var height = 1;
	//		if (+size.height) {
	//			height = +size.height;
	//		}
	//		var largeSize = sizeData.sizes.size.filter(s => s.label == 'Large')[0];
	//		if (!largeSize) {
	//			largeSize = sizeData.sizes.size[sizeData.sizes.size.length - 1];
	//		}

	//		this.addPhotoToGallery(
	//			new GalleryItem(src, width, height),
	//			new LightboxItem(largeSize.source, 'Flickr'));
	//		deferr.resolve();
	//	}).fail((jqXHR, errorText) => { console.log(jqXHR, errorText); deferr.resolve() });
	//	return deferr;
	//}

	//getPixabayPhotos() {
	//	if (!this.state.pixabayStatus.allowNextPage) {
	//		this.setPixabayStateProperty("isLoading", false);
	//		return;
	//	}
	//	this.setPixabayStateProperty("isLoading", true);
	//	var perPage = 10;
	//	debugger;
	//	var tagsCopy = [ ...this.state.tags ];
	//	var tags = tagsCopy.join('+');
	//	var url = `https://pixabay.com/api/?key=9203582-9000065cb9ad2532b64e56d06&q=${tags}&image_type=photo&pretty=true&page=${this.state.pixabayStatus.currentPage}&per_page=${perPage}`;
	//	$.getJSON(url).done((data) => {
	//		data.hits.forEach(photo => {
	//			//var src = photo.largeImageURL;
	//			var width = photo.webformatWidth;
	//			var height = photo.webformatHeight;

	//			this.addPhotoToGallery(
	//				new GalleryItem(photo.webformatURL, width, height),
	//				new LightboxItem(photo.largeImageURL, 'Pixabay'));
	//		});
	//		if (this.state.pixabayStatus.currentPage < Math.ceil(data.total / perPage)) {
	//			this.setPixabayStateProperty("allowNextPage", true);
	//			this.setPixabayStateProperty("currentPage", this.state.flickrStatus.currentPage + 1);
	//		} else {
	//			this.setPixabayStateProperty("allowNextPage", false);
	//		}
	//		this.setPixabayStateProperty("isLoading", false);
	//		this.forceUpdate();
	//	}).fail((jqXHR, errorText) => { console.log(jqXHR, errorText); });
	//}

	//addPhotoToGallery(galleryPhoto: GalleryItem, lightboxItem: LightboxItem) {
	//	console.log(galleryPhoto, lightboxItem)
	//	if (this.state.galleryPhotos.filter(x => x.src == galleryPhoto.src).length == 0) {
	//		console.log('true');
	//		this.state.galleryPhotos.push(galleryPhoto);
	//		this.state.lightboxPhotos.push(lightboxItem);
	//	}
	//}

	//loadItems(page) {
	//	if (this.state.flickrStatus.isLoading || this.state.pixabayStatus.isLoading) {
	//		return;
	//	}
	//	this.loadImages();
	//}

	componentWillReceiveProps(nextProps) {
		debugger;
		// You don't have to do this check first, but it can help prevent an unneeded render
		this.setState({
			galleryItems: [],
			lightboxItems: [],
			currentPage: 1,
			allowNextPage: true
		});
		//if (nextProps.startTime !== this.state.startTime) {
		//	this.setState({ startTime: nextProps.startTime });
		//}
	}

	render() {
		//const loader = <div className="loader"></div>;
		debugger;
		const loader = <BarLoader loading={false} color={'#638421'} height={2} heightUnit={'px'} width={100} widthUnit={'%'} key="loader" />;
		return <div>
			<InfiniteScroll
				pageStart={0}
				loadMore={this.loadImages.bind(this)}
				hasMore={this.state.allowNextPage}
				loader={loader}
				initialLoad={true}>
				<PhotoGallery galleryImages={this.state.galleryItems} lightboxImages={this.state.lightboxItems} />
			</InfiniteScroll>
		</div>;
	}
};