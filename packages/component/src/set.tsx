export class DOMSet<T extends HTMLElement> {
  elements: T[] = [];

  add(element: T) {
    if (this.elements.some((el) => el.isEqualNode(element))) {
      return;
    }
    this.elements.push(element);
  }

  remove(element: T) {
    this.elements = this.elements.filter((el) => !el.isEqualNode(element));
  }

  length() {
    return this.elements.length;
  }

  forEach(callback: (element: T) => void) {
    this.elements.forEach(callback);
  }
}
