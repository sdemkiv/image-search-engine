import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
//import SearchPhotos from './SearchPhotos/SearchPhotos';
import InfiniteScroller from './PhotoGallery/InfiniteScroller';

export default class Home extends React.Component<RouteComponentProps<{}>, {}> {
	public render() {
		return <InfiniteScroller />;
	}
}
