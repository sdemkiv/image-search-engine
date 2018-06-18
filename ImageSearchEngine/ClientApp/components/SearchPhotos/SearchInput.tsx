import * as React from 'react';
import * as $ from 'jquery';

import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css'

interface SearchInputProps {
	search: (tags: string[]) => {}
}

interface SearchInputState {
	tags: string[]
}

export default class SearchInput extends React.Component<SearchInputProps, SearchInputState> {
	private inputElement: TagsInput;

	constructor() {
		super();

		this.state = {
			tags: []
		};
	}

	changeHander(tags) {
		this.setState({ tags })
		this.props.search(tags);
	}

	public render() {
		return <div className="search-input navbar-fixed-top">
			<div className="col-md-6 col-md-offset-3">
				<TagsInput
					ref={(inp) => this.inputElement = inp}
					value={this.state.tags}
					onChange={(tags) => this.changeHander(tags)}
					inputProps={{ placeholder: "Add search tag" }} />
			</div>
		</div>;
	}

	componentDidMount() {
		this.inputElement.focus();
	}
}
