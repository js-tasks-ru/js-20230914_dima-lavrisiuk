import createElement from "../../assets/lib/create-element.js";

class Tooltip {
  static get INDENTS_X() { return 10; }
  static get INDENTS_Y() { return 10; }
  static #onlyInstance = null;
  #element = null;
  #content = null;

  constructor() {
    if (Tooltip.#onlyInstance) {
      return Tooltip.#onlyInstance;
    } else {
      Tooltip.#onlyInstance = this;
    }
  }

  get element() { return this.#element; }
  set element(value) { this.#element = value; }

  get content() { return this.#content; }
  set content(value) { this.#content = value; }

  initialize () {
    this.createEventListeners();
  }

  handlerDocumentPointerOver = (e) => {
    const target = e.target?.dataset.tooltip || e.target.closest('[data-tooltip]').dataset.tooltip;

    if (!target) return;

    this.content = target;
    this.render();
    document.addEventListener('pointermove', this.handlerDocumentPointerMove);
    document.addEventListener("pointerout", this.handlerDocumentPointerOut);
  }

  handlerDocumentPointerOut = () => {
    this.remove();
    document.removeEventListener('pointermove', this.handlerDocumentPointerMove);
    document.removeEventListener("pointerout", this.handlerDocumentPointerOut);
  }

  handlerDocumentPointerMove = (e) => {
    this.element.style.position = `absolute`;
    this.element.style.left = `${ Tooltip.INDENTS_X + e.clientX }px`;
    this.element.style.top = `${ Tooltip.INDENTS_Y + e.clientY }px`;
  }

  createEventListeners() {
    document.addEventListener("pointerover", this.handlerDocumentPointerOver);
  }

  destroyEventListeners() {
    document.removeEventListener("pointerover", this.handlerDocumentPointerOver);
  }

  render() {
    this.element = createElement(this.template());
    document.body.append(this.element);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.destroyEventListeners();
    Tooltip.#onlyInstance = null;
  }

  template() {
    return `<div class="tooltip">${ this.content }</div>`;
  }
}

export default Tooltip;
