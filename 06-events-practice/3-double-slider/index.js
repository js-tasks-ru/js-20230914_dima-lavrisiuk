import createElement from "../../assets/lib/create-element.js";
export default class DoubleSlider {
  options       = {};
  subElements   = {};
  element       = null;

  activeTarget = null;
  progressBarBoundingClientRectX = null;

  constructor({ min, max, formatValue, selected } = {}) {
    this.options.min          = min || 0;
    this.options.max          = max || 10000;
    this.options.selected     = selected || { from: this.options.min, to: this.options.max };
    this.options.formatValue  = formatValue || (x => Number(x));

    this.render();
    this.updateLeftSide(this.from);
    this.updateRightSide(this.to);
    this.createEventListeners();
  }

  updateLeftSide(value) {
    const shiftPercentLeft = ((value - this.min) / this.minMaxDifference) * 100;
    this.updateElementSpan(this.subElements.span.left, value);
    this.updateElementSlider(this.subElements.slider.left, "left", shiftPercentLeft);
    this.updateElementProgressBar("left", shiftPercentLeft);

    this.options.selected.from = value;
  }

  updateRightSide(value) {
    const shiftPercentRight = 100 -(((value - this.min) / this.minMaxDifference) * 100);
    this.updateElementSpan(this.subElements.span.right, value);
    this.updateElementSlider(this.subElements.slider.right, "right", shiftPercentRight);
    this.updateElementProgressBar("right", shiftPercentRight);

    this.options.selected.to = value;
  }

  updateElementSlider(element, prop = "", value = 0) {
    element.style[prop] = `${ value }%`;
  }

  updateElementSpan(element, value = 0) {
    element.innerHTML = this.options.formatValue(value);
  }

  updateElementProgressBar(prop = "", value = 0) {
    this.subElements.progress.style[prop] = `${ value }%`;
  }

  get min() { return this.options.min }
  get max() { return this.options.max }
  get from() { return Number(this.options.selected.from) }
  get to() { return Number(this.options.selected.to) }
  get progressBarWidth() { return this.subElements.inner.offsetWidth }
  get minMaxDifference() { return this.max - this.min }
  get progressBarClientRectX() { return this.subElements.inner.getBoundingClientRect().x }

  handlerSliderPointerDown = (event) => {
    event.preventDefault();
    this.element.classList.add('range-slider_dragging');
    this.activeTarget = event.target;
    this.progressBarBoundingClientRectX = this.progressBarClientRectX;
    document.addEventListener("pointerup", this.handlerDocumentPointerUp, { once: true });
    document.addEventListener("pointermove", this.handlerDocumentPointerMove);
  }

  handlerDocumentPointerUp = (event) => {
    event.preventDefault();
    this.element.classList.remove('range-slider_dragging');
    this.activeTarget = null;
    this.progressBarBoundingClientRectX = null;
    document.removeEventListener("pointermove", this.handlerDocumentPointerMove);

    this.generateCustomEvent();
  }

  handlerDocumentPointerMove = (event) => {
    event.preventDefault();
    // event.target.setPointerCapture(event.pointerId); - Ломает тесты
    // this.activeTarget - фиксирую event.target

    const shiftX = Number(event.clientX) - this.progressBarBoundingClientRectX;
    const shiftPercent = (shiftX / this.progressBarWidth) * 100;
    const newValue = this.min + ((this.minMaxDifference / 100) * shiftPercent);

    if (this.activeTarget === this.subElements.slider.left) {

      if (shiftX < 0) { this.updateLeftSide(this.min) }
      else if (newValue > this.to) { this.updateLeftSide(this.to) }
      else { this.updateLeftSide(newValue.toFixed(0)) }

    } else if (this.activeTarget === this.subElements.slider.right) {

      if (shiftX > this.progressBarWidth) { this.updateRightSide(this.max) }
      else if (this.from > newValue) { this.updateRightSide(this.from) }
      else { this.updateRightSide(newValue.toFixed(0)) }

    }
    console.log(`shiftX: ${ shiftX }\nfrom: ${ newValue }\n(this.from, this.to): ${ this.from } ${ this.to }`);
  }

  generateCustomEvent() {
    this.element.dispatchEvent(
      new CustomEvent('slider-change', {
        bubbles: true,
        detail: { from: this.from, to: this.to }
      }, { once: true })
    );
  }

  createEventListeners() {
    this.subElements.slider.left.addEventListener('pointerdown', this.handlerSliderPointerDown);
    this.subElements.slider.right.addEventListener('pointerdown', this.handlerSliderPointerDown);
  }

  destroyEventListeners() {
    this.subElements.slider.left.removeEventListener('pointerdown', this.handlerSliderPointerDown)
    this.subElements.slider.right.removeEventListener('pointerdown', this.handlerSliderPointerDown)
  }

  render() {
    this.element = createElement(this.template());
    this.subElements.inner = this.element.querySelector('[data-element="inner"]');
    this.subElements.progress = this.element.querySelector('[data-element="progress"]');

    this.subElements.span = {};
    this.subElements.span.left = this.element.querySelector('[data-element="from"]');
    this.subElements.span.right = this.element.querySelector('[data-element="to"]');

    this.subElements.slider = {};
    this.subElements.slider.left = this.element.querySelector('[data-element="sliderLeft"]');
    this.subElements.slider.right = this.element.querySelector('[data-element="sliderRight"]');
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.destroyEventListeners();
  }

  template() {
    return `
      <div class="range-slider">
        <span data-element="from">${ this.options.formatValue(this.options.selected.from) }</span>
        <div data-element="inner" class="range-slider__inner">
          <span data-element="progress" class="range-slider__progress"></span>
          <span data-element="sliderLeft" class="range-slider__thumb-left"></span>
          <span data-element="sliderRight" class="range-slider__thumb-right"></span>
        </div>
        <span data-element="to">${ this.options.formatValue(this.options.selected.to) }</span>
      </div>
    `;
  }
}
