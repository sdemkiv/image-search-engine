import * as React from 'react';

const ImageComponent = ({ index, onClick, photo, margin }) => {
	var dynamicContainerStyle = {
		margin: margin
	};

	return <div className={'gallery-image-container'} style={{ margin: margin }}>
		<img className={'gallery-image'} {...photo} onClick={(e) => onClick(e, { index, photo })} />
	</div>;
};

export default ImageComponent;
