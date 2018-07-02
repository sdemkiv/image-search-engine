import * as React from 'react';

import SearchInput from './SearchInput';
import InfiniteGalleryScroll from '../PhotoGallery/InfiniteGalleryScroll';

export interface SearchImagesProps {

}

export interface SearchImagesState {
	tags: string[];
	noResults: boolean;
	isLoading: boolean;
}

export default class SearchImages extends React.Component<SearchImagesProps, SearchImagesState> {
	constructor(props) {
		super(props);

		this.state = {
			tags: [],
			isLoading: false,
			noResults: false,
		};
	}

	searchForImages(tags: string[]) {
		debugger;
		var newTags = [...tags];
		this.setState({ tags: newTags });
	}

	startLoading() {
		this.setState({ isLoading: true });
	}

	finishLoading() {
		this.setState({ isLoading: false });
	}

	render() {
		return <div>
			<SearchInput
				tags={this.state.tags}
				search={this.searchForImages.bind(this)} />
			<InfiniteGalleryScroll
				tags={this.state.tags}
				startLoading={this.startLoading}
				finishLoading={this.finishLoading} />
		</div>;
	}
};