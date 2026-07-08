// core/music/render/TupletEngine.js
import { VF } from "./VexflowExtensions.js";

export default class TupletEngine {
  static renderTuplets(context, tickables) {
    // Group by tuplets
    let current = [];
    let lastTuplet = null;

    tickables.forEach((t) => {
      const tupleInfo = t.tupletInfo;

      if (tupleInfo == null) {
        if (current.length > 0 && lastTuplet) {
          new VF.Tuplet(current, {
            num_notes: lastTuplet.actual,
            notes_occupied: lastTuplet.normal,
          })
            .setContext(context)
            .draw();
        }
        current = [];
        lastTuplet = null;
        return;
      }

      if (lastTuplet && tupleInfo.id !== lastTuplet.id) {
        new VF.Tuplet(current, {
          num_notes: lastTuplet.actual,
          notes_occupied: lastTuplet.normal,
        })
          .setContext(context)
          .draw();

        current = [];
      }

      current.push(t);
      lastTuplet = tupleInfo;
    });
  }
}
