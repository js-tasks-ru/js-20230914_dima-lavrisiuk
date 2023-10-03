import createElement from "../../assets/lib/create-element.js";

export default class NotificationMessage {
  static #current = null;
  #element        = null;
  #content        = null;
  #type           = null;
  #duration       = null;
  #timeoutID      = null;

  constructor(content = "", options = {}) {
    this.content  = content;
    this.type     = options?.type;
    this.duration = options?.duration;
    this.render();
  }

  static get current() { return NotificationMessage.#current; }
  static set current(self) { NotificationMessage.#current = self; }

  get element() { return this.#element; }

  get content() { return this.#content; }
  set content(content) { this.#content = (typeof content === "string") ? content : "Notification message!"; }

  get type() { return this.#type; }
  set type(string) { this.#type = (typeof string === "string") ? string : "error"; }

  get duration() { return this.#duration; }
  set duration(number) { this.#duration = Number.isInteger(number) ? number : 20; }

  get timeoutID() { return this.#timeoutID; }
  set timeoutID(fn) { this.#timeoutID = (typeof fn === "function") ? fn : (s) => s; }

  show(node = document.body) {
    if( NotificationMessage.current ) {
      this.destroy.call(NotificationMessage.current);
      NotificationMessage.current = null;
    }

    NotificationMessage.current = this;
    this.timeoutID = setTimeout(() => {
      this.destroy();
      NotificationMessage.current = null;
    }, this.duration);
    node.insertAdjacentElement('beforeend', this.element);
  }

  render() {
    this.#element = createElement(this.template());
  }

  remove() {
    this.#element.remove();
  }

  destroy() {
    this.remove();
    clearTimeout(this.timeoutID);
  }

  template() {
    return `
      <div class="notification ${ this.type }" style="--value:${ this.duration / 1000 }s">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${ this.type }</div>
          <div class="notification-body">${ this.content }</div>
        </div>
      </div>
    `;
  }
}
