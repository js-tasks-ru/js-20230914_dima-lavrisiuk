import createElement from "../../assets/lib/create-element.js";

export default class SortableTable {
  #headerConfig = null;
  #data         = null;
  #element      = null;
  #subElements  = { header: null, body: null, loading: null, placeholder: null };

  constructor(headerConfig = [], data = []) {
    this.#headerConfig = headerConfig;
    this.#data = data;
    this.render();
  }

  get element() { return this.#element; }
  get subElements() { return this.#subElements; }


  render() {
    this.#element = createElement(this.template());
    this.#element.querySelector(".sortable-table").append(
      this.#subElements.header = createElement(this.templateHeader()),
      this.#subElements.body = createElement(this.templateBody()),
      this.#subElements.loading = createElement(this.templateLoading()),
      this.#subElements.placeholder = createElement(this.templatePlaceholder())
    );
  }

  sort(field, order) {
    switch(this.getSortTypeForTheField(field)) {
      case "string":
        this.#data = (order === 'asc')
          ? [...this.#data].sort((a,b) => a[field].localeCompare(b[field], ['ru','en'], {caseFirst:'upper'}))
          : [...this.#data].sort((b,a) => a[field].localeCompare(b[field], ['ru','en'], {caseFirst:'upper'}));
        break;
      case "number":
        this.#data = (order === 'asc')
          ? [...this.#data].sort((a,b) => a[field] - b[field])
          : [...this.#data].sort((b,a) => a[field] - b[field]);
        break;
    }

    this.update(field, order);
  }

  update(field, order) {
    [...this.#subElements.header.children]
      .forEach(cell => cell.dataset.order = (cell.dataset.id === field) ? order : '' );

    this.#subElements.body.remove();
    this.#subElements.body = createElement(this.templateBody());

    this.#subElements.header.insertAdjacentElement("afterend", this.#subElements.body);
  }

  getSortTypeForTheField(field) {
    return (this.#headerConfig.find(cell => cell.id === field)).sortType;
  }

  remove() {
    this.#element.remove();
  }

  destroy() {
    this.remove();
  }


  templateLoading() {
    return `<div data-element="loading" class="loading-line sortable-table__loading-line"></div>`;
  }

  templatePlaceholder() {
    return `
      <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
        <div>
          <p>No products satisfies your filter criteria</p>
          <button type="button" class="button-primary-outline">Reset all filters</button>
        </div>
      </div>
    `;
  }

  templateBodyCell(value) {
    return `<div class="sortable-table__cell">${ value }</div>`;
  }

  templateBodyRow(row) {
    const cellGroup = this.#headerConfig.reduce((html, item) => {
      return ( item.template )
        ? html + item.template(row.images)
        : html + this.templateBodyCell(row[item.id]);
    }, "");

    return `<a href="/products/${ row.id }" class="sortable-table__row">${ cellGroup }</a>`;
  }

  templateBody() {
    return `
      <div data-element="body" class="sortable-table__body">
        ${ this.#data.reduce((html, row) => html + this.templateBodyRow(row), "") }
      </div>
    `;
  }

  templateHeaderCell({id, title, sortable}) {
    return `
      <div class="sortable-table__cell" data-id="${ id }" data-sortable="${ sortable }">
        <span>${ title }</span>
        <span data-element="arrow" class="sortable-table__sort-arrow"><span class="sort-arrow"></span></span>
      </div>
    `;
  }

  templateHeader() {
    return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${ this.#headerConfig.reduce((html, item) => html + this.templateHeaderCell(item), "") }
      </div>
    `;
  }

  template() {
    return `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table"></div>
      </div>
    `;
  }
}
