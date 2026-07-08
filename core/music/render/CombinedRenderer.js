import NotationRenderer from "./NotationRenderer";
import TabRenderer from "./TabRenderer";

export default class CombinedRenderer {
  constructor({ container, notationContainer, tabContainer, score, selection, interactive = true }) {
    this.container = container;
    this.notationContainer = notationContainer;
    this.tabContainer = tabContainer;
    this.score = score;
    this.selection = selection;
    this.interactive = interactive;
  }

  render() {
    if (!this.score) return;

    // Backward compatibility for older callers that pass separate containers.
    if (this.notationContainer && this.tabContainer) {
      this.notationContainer.innerHTML = "";
      this.tabContainer.innerHTML = "";

      new NotationRenderer({
        container: this.notationContainer,
        score: this.score,
        selection: this.selection,
        interactive: this.interactive,
      }).render();

      new TabRenderer({
        container: this.tabContainer,
        score: this.score,
        selection: this.selection,
        interactive: this.interactive,
      }).render();
      return;
    }

    if (!this.container) return;
    this.container.innerHTML = "";

    const isMobile = (this.container.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 1024)) < 600;

    const root = document.createElement("div");
    root.style.width = "100%";
    root.style.display = "grid";
    root.style.gridTemplateColumns = "1fr";
    root.style.gap = isMobile ? "4px" : "8px";
    root.style.padding = isMobile ? "0px" : "8px";
    root.style.boxSizing = "border-box";

    const scoreCard = document.createElement("section");
    scoreCard.style.background = "var(--compose-paper, #fff)";
    scoreCard.style.border = isMobile ? "none" : "1px solid rgba(15,23,42,0.1)";
    scoreCard.style.boxSizing = "border-box";

    const tabCard = document.createElement("section");
    tabCard.style.background = "var(--compose-paper, #fff)";
    tabCard.style.border = isMobile ? "none" : "1px solid rgba(15,23,42,0.1)";
    tabCard.style.boxSizing = "border-box";

    root.appendChild(scoreCard);
    root.appendChild(tabCard);
    this.container.appendChild(root);

    new NotationRenderer({
      container: scoreCard,
      score: this.score,
      selection: this.selection,
      compact: true,
      interactive: this.interactive,
    }).render();

    new TabRenderer({
      container: tabCard,
      score: this.score,
      selection: this.selection,
      compact: true,
      interactive: this.interactive,
    }).render();
  }
}
