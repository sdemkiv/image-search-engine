import * as React from 'react';
import * as $ from 'jquery';

interface SearchInputProps {
	search: () => {}
}

export default class SearchInput extends React.Component<SearchInputProps, {}> {
	public render() {
		return <div className="row search-input">
			<div className="col-md-6 col-md-offset-3">
				<div className="input-group">
					<input id="tagsInput" type="text" className="form-control" />
					<div className="input-group-btn">
						<button className="btn btn-default" type="button" onClick={this.props.search}> Search </button>
					</div>
				</div>
			</div>
		</div>;
	}
}
