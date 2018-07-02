import * as $ from 'jquery';
import IImageService, { ImageData, SearchData } from './IImageService';
import { GalleryItem, LightboxItem } from '../../components/PhotoGallery/PhotoGallery';

export default class PixabayService implements IImageService {
	static readonly API_KEY: string = '9203582-9000065cb9ad2532b64e56d06';

	public Search(tags: string[], currentPage: number, perPage: number): JQueryPromise<SearchData> {
		var deferr = $.Deferred<SearchData>();

		if (tags.length === 0) {
			deferr.resolve(new SearchData(new Array<ImageData>(), 0));
			return deferr;
		}

		var searchTags = tags.join('+');
		var url = `https://pixabay.com/api/?key=${PixabayService.API_KEY}&q=${searchTags}&image_type=photo&pretty=true&page=${currentPage}&per_page=${perPage}`;
		$.getJSON(url).done((data) => {
			var images = new Array<ImageData>();

			data.hits.forEach(photo => {
				var width = photo.webformatWidth;
				var height = photo.webformatHeight;

				images.push(new ImageData(photo.webformatURL, photo.largeImageURL, width, height));
			});

			deferr.resolve(new SearchData(images, data.total));
		}).fail((jqXHR, errorText) => {
			console.log(jqXHR, errorText);
			deferr.reject();
		});
		return deferr.promise();
	}
}
