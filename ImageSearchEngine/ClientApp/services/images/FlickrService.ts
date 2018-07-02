import * as $ from 'jquery';
import IImageService, { ImageData, SearchData } from './IImageService';
import { GalleryItem, LightboxItem } from '../../components/PhotoGallery/PhotoGallery';

export default class FlickrService implements IImageService {
	static readonly API_KEY: string = '47762016173aaf8893440f423c81542a';

	public Search(tags: string[], currentPage: number, perPage: number): JQueryPromise<SearchData> {
		var deferr = $.Deferred<SearchData>();
		debugger;
		if (tags.length === 0) {
			deferr.resolve(new SearchData(new Array<ImageData>(), 0));
			return deferr;
		}

		var searchTags = tags.join('+');
		var searchUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&nojsoncallback=1'
			+ `&api_key=${FlickrService.API_KEY}&tags=${searchTags}&page=${currentPage}&per_page=${perPage}`;

		$.getJSON(searchUrl)
			.done((data: any) => {
				var imagePromises = new Array<JQueryPromise<ImageData>>();
				data.photos.photo.forEach((photo: any) => {
					imagePromises.push(this.getFlickrPhoto(photo));
				});

				$.when(...imagePromises).then((...imageDatas: ImageData[]) => {
					debugger;
					deferr.resolve(new SearchData(imageDatas, data.total));
				});
			}).fail((jqXHR, errorText) => { console.log(jqXHR, errorText); });
		return deferr.promise();
	}

	private getFlickrPhoto(photo: any): JQueryPromise<ImageData> {
		var src = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;
		var sizeUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes" +
			`&api_key=${FlickrService.API_KEY}&photo_id=${photo.id}&format=json&nojsoncallback=1`;

		var deferr = $.Deferred<ImageData>();
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

			//this.addPhotoToGallery(
			//	new GalleryItem(src, width, height),
			//	new LightboxItem(largeSize.source, 'Flickr'));
			deferr.resolve(new ImageData(src, largeSize.source, width, height));
		}).fail((jqXHR, errorText) => { console.log(jqXHR, errorText); deferr.resolve() });
		return deferr.promise();
	}
}
