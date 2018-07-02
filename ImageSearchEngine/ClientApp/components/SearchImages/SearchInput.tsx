import * as React from 'react';
import * as $ from 'jquery';

import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css'
import { BarLoader } from 'react-spinners';

interface SearchInputProps {
	tags: string[]
	search: (tags: string[]) => {}
}

interface SearchInputState {
	//tags: string[]
}

export default class SearchInput extends React.Component<SearchInputProps, SearchInputState> {
	private inputElement: TagsInput;

	constructor() {
		super();

		//this.state = {
		//	tags: []
		//};
	}

	//changeHander(tags) {
	//	this.setState({ tags })
	//	this.props.search(tags);
	//}

	public render() {
		return <div className="search-input navbar-fixed-top">
			<div className="col-md-6 col-md-offset-3">
				<TagsInput
					ref={(inp) => this.inputElement = inp}
					value={this.props.tags}
					onChange={(tags) => this.props.search(tags)}
					inputProps={{ placeholder: "Add search tag" }} />
			</div>
			<BarLoader loading={false} color={'#638421'} height={2} heightUnit={'px'} width={100} widthUnit={'%'} />
		</div>;
	}

	componentDidMount() {
		this.inputElement.focus();
	}
}
