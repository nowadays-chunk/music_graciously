// core/editor/SelectionManager.js
export default class SelectionManager {
  constructor() {
    this.selected = null;
    this.listeners = new Set();
  }

  select(obj) {
    this.selected = obj;
    this.listeners.forEach(cb => cb(obj));
  }

  clear() {
    this.selected = null;
    this.listeners.forEach(cb => cb(null));
  }

  subscribe(cb) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }
}
