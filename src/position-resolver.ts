import { Injectable, ElementRef } from "@angular/core";
import { AxisResolver } from './axis-resolver';

interface PositionElements {
  container: ElementRef;
  documentElement: any;
  isContainerWindow: boolean;
  horizontal: boolean;
}

@Injectable()
export class PositionResolver {
  private options: PositionElements; 

  constructor(private axis: AxisResolver) {
  }

  setDirection (horizontal: boolean) {
    this.axis.setVertical(!horizontal);
  }

  config (options: PositionElements) {
    this.options = options;
  }

  calculatePoints (element: ElementRef) {
    return this.options.isContainerWindow
			? this.calculatePointsForWindow(element)
			: this.calculatePointsForElement(element);
	}

	calculatePointsForWindow (element: ElementRef) {
		// container's height
		const height = this.height(this.options.container);
		// scrolled until now / current y point
		const scrolledUntilNow = height + this.pageYOffset(this.options.documentElement);
		// total height / most bottom y point
		const totalToScroll = this.offsetTop(element.nativeElement) + this.height(element.nativeElement);
		return { height, scrolledUntilNow, totalToScroll };
	}

	calculatePointsForElement (element: ElementRef) {
		let scrollTop    = this.axis.scrollTopKey();
		let scrollHeight = this.axis.scrollHeightKey();

		const height = this.height(this.options.container);
		// perhaps use this.container.offsetTop instead of 'scrollTop'
		const scrolledUntilNow = this.options.container[scrollTop];
		let containerTopOffset = 0;
		const offsetTop = this.offsetTop(this.options.container);
		if (offsetTop !== void 0) {
			containerTopOffset = offsetTop;
		}
		const totalToScroll = this.options.container[scrollHeight];
		// const totalToScroll = this.offsetTop(this.$elementRef.nativeElement) - containerTopOffset + this.height(this.$elementRef.nativeElement);
		return { height, scrolledUntilNow, totalToScroll };
	}

  private height (elem: any) {
		let offsetHeight = this.axis.offsetHeightKey();
		let clientHeight = this.axis.clientHeightKey();

		// elem = elem.nativeElement;
		if (isNaN(elem[offsetHeight])) {
			return this.options.documentElement[clientHeight];
		} else {
			return elem[offsetHeight];
		}
	}

  private offsetTop (elem: any) {
		let top = this.axis.topKey();

		// elem = elem.nativeElement;
		if (!elem.getBoundingClientRect) { // || elem.css('none')) {
			return;
		}
		return elem.getBoundingClientRect()[top] + this.pageYOffset(elem);
	}

  pageYOffset (elem: any) {
		let pageYOffset = this.axis.pageYOffsetKey();
		let scrollTop   = this.axis.scrollTopKey();
		let offsetTop   = this.axis.offsetTopKey();

		// elem = elem.nativeElement;
		if (isNaN(window[pageYOffset])) {
			return this.options.documentElement[scrollTop];
		} else if (elem.ownerDocument) {
			return elem.ownerDocument.defaultView[pageYOffset];
		} else {
			return elem[offsetTop];
		}
	}
}