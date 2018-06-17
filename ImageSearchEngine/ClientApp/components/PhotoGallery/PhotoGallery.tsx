import * as React from 'react';
import Gallery from 'react-photo-gallery';
import Lightbox from 'react-images';

interface PhotoGalleryProps {
	galleryImages: GalleryItem[];
	lightboxImages: LightboxItem[];
}

interface PhotoGalleryState {
	currentImage: number;
	lightboxIsOpen: boolean;
}

export class GalleryItem {
	constructor(public src: string, public width: number, public height: number) { }
}

export class LightboxItem {
	constructor(public src: string, public caption) { }
}

export default class PhotoGallery extends React.Component<PhotoGalleryProps, PhotoGalleryState> {
	constructor() {
		super();

		this.state = {
			currentImage: 0,
			lightboxIsOpen: false
		};

		this.closeLightbox = this.closeLightbox.bind(this);
		this.openLightbox = this.openLightbox.bind(this);
		this.gotoNext = this.gotoNext.bind(this);
		this.gotoPrevious = this.gotoPrevious.bind(this);
	}

	public render() {
		return (<div>
			<Gallery photos={this.props.galleryImages} onClick={this.openLightbox} margin={1} />
			<Lightbox images={this.props.lightboxImages}
				onClose={this.closeLightbox}
				onClickPrev={this.gotoPrevious}
				onClickNext={this.gotoNext}
				currentImage={this.state.currentImage}
				isOpen={this.state.lightboxIsOpen}
				backdropClosesModal={true}
			/>
		</div>);
	}

	openLightbox(event, obj) {
		this.setState({
			currentImage: obj.index,
			lightboxIsOpen: true,
		});
	}
	closeLightbox() {
		this.setState({
			currentImage: 0,
			lightboxIsOpen: false,
		});
	}
	gotoPrevious() {
		this.setState({
			currentImage: this.state.currentImage - 1,
		});
	}
	gotoNext() {
		this.setState({
			currentImage: this.state.currentImage + 1,
		});
	}
}
