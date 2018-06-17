import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import SearchPhotos from './SearchPhotos/SearchPhotos';

export default class Home extends React.Component<RouteComponentProps<{}>, {}> {
	public render() {
		return <SearchPhotos />;
	}
}
