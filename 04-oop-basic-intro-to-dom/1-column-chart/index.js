import createElement from "../../assets/lib/create-element.js";

export default class ColumnChart {
  #config = { data: null, label: null, value: null, link: null, chartHeight: null, formatHeading: null };
  #element = null;

  /**
   * Create a chart.
   * @property {Object} config - Settings object
   * @property {array}  config.data - Data array for the chart
   * @property {string} config.label - Chart Title
   * @property {number} config.value - Number of chart headings
   * @property {string} config.link - The value of the href attribute
   * @property {number} config.chartHeight - Chart Height
   * @property {function} config.formatHeading - Function for output Number of chart headings
   */
  constructor(config) {
    this.data           = config?.data;
    this.label          = config?.label;
    this.value          = config?.value;
    this.link           = config?.link;
    this.chartHeight    = config?.chartHeight;
    this.formatHeading  = config?.formatHeading;

    this.#element = createElement(this._template());
    this.update(this.data);
  }

  get element() { return this.#element; }

  get data() { return this.#config.data; }
  set data(array) { this.#config.data = Array.isArray(array) ? array : []; }

  get label() { return this.#config.label; }
  set label(string) { this.#config.label = (typeof string === "string") ? string : ""; }

  get value() { return this.#config.value; }
  set value(number) { this.#config.value = Number.isInteger(number) ? number : 0; }

  get link() { return this.#config.link; }
  set link(string) { this.#config.link = (typeof string === "string") ? string : ""; }

  get chartHeight() { return this.#config.chartHeight; }
  set chartHeight(number) { this.#config.chartHeight = Number.isInteger(number) ? number : 50; }

  get formatHeading() { return this.#config.formatHeading; }
  set formatHeading(fn) { this.#config.formatHeading = (typeof fn === "function") ? fn : (s) => s; }

  update(data = []) {
    if (data.length) {
      this.data = data;
      this.element.classList.remove("column-chart_loading");
      this.element.querySelector(".column-chart__chart").innerHTML = this._createChartLines();
    } else {
      this.element.classList.add("column-chart_loading");
    }
  }

  destroy() {
    this.remove();
  }

  remove() {
    this.element.remove();
  }

  _createChartLines() {
    const max = Math.max(...this.data);
    const coefficientOfProportionality = max / this.chartHeight;

    return this.data.reduce((str, x) => {
      return str += this._templateChartLine(x / coefficientOfProportionality, (x * 100) / max);
    }, "");
  }

  _templateChartLine(value, tooltip) {
    return `<div style="--value: ${ Math.floor(value) }" data-tooltip="${ Math.round(tooltip) }%"></div>`;
  }

  _template() {
    return `
      <div class="column-chart" style="--chart-height: ${ this.chartHeight }">
        <div class="column-chart__title">Total ${ this.label }
          ${ this.link ? `<a class="column-chart__link" href="${ this.link }">View all</a>` : "" }
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">
            ${ this.formatHeading( new Intl.NumberFormat().format(this.value) ) }
          </div>
          <div data-element="body" class="column-chart__chart"></div>
        </div>
      </div>
    `;
  }
}
