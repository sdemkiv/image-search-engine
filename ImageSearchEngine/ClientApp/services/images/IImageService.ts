export class ImageData {
	constructor(public src: string, public srcLarge: string, public width: number, public height: number) { }
}

export class SearchData {
	constructor(public imageData: ImageData[], public totalResults: number) { }
}

export default interface IImageService {
	Search(tags: string[], currentPage: number, perPage: number): JQueryPromise<SearchData>
}
