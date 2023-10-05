import createElement from "../../assets/lib/create-element.js";
import SortableTableParent from "../../05-dom-document-loading/2-sortable-table-v1/index.js";

export default class SortableTable extends SortableTableParent {
  #isSortLocally = null;

  constructor(headerConfig = [], { data = [], sorted = {} } = {}, isSortLocally = true) {
    super(headerConfig, data);
    this.#isSortLocally = isSortLocally;
    this.sort(sorted?.id, sorted?.order);
    this.createListeners();
  }

  sortOnClient(field, order) {
    super.sort(field, order);
  }

  sortOnServer() {

  }

  sort(field, order) {
    if (this.#isSortLocally) {
      this.sortOnClient(field, order);
    } else {
      this.sortOnServer(field, order);
    }
  }

  handlerHeaderClick = (e) => {
    const targetCellElement = e.target.closest('.sortable-table__cell');

    if (targetCellElement.dataset.sortable === "true") {
      const field = targetCellElement.dataset.id;
      const order = targetCellElement.dataset.order === "desc" ? "asc" : "desc";
      this.sort(field, order);
    }
  }

  createListeners() {
    this.subElements.header.addEventListener("pointerdown", this.handlerHeaderClick);
  }

  destroyListeners() {
    this.subElements.header.removeEventListener("pointerdown", this.handlerHeaderClick);
  }

  destroy() {
    super.destroy();
    this.destroyListeners();
  }
}
