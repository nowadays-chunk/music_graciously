// core/music/render/BeamEngine.js
import { VF } from "./VexflowExtensions.js";

export default class BeamEngine {
  static renderBeams(context, tickables) {
    const groups = VF.Beam.generateBeams(tickables, {
      beam_rests: false,
      beam_middle_only: false,
    });

    groups.forEach((beam) => beam.setContext(context).draw());
  }
}
