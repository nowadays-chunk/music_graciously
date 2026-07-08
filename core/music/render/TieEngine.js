// core/music/render/TieEngine.js
import { VF } from "./VexflowExtensions.js";

export default class TieEngine {
  static renderTies(context, voices, tickables) {
    const ties = [];

    voices.forEach((voice) => {
      voice.elements.forEach((el, i) => {
        if (el.tieStart) {
          const from = tickables[i];
          const to = tickables[i + 1];
          if (to)
            ties.push(new VF.StaveTie({
              first_note: from,
              last_note: to,
            }));
        }
      });
    });

    ties.forEach((t) => t.setContext(context).draw());
  }
}
