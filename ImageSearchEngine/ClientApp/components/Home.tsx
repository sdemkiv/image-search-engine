import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import SearchImages from './SearchImages/SearchImages';

export default class Home extends React.Component<RouteComponentProps<{}>, {}> {
	public render() {
		return <SearchImages />;
	}
}
