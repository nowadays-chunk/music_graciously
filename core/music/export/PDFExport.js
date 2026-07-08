// core/music/export/PDFExport.js
import { jsPDF } from "jspdf";

export default class PDFExport {
  static generate(svgElement, title = "Score") {
    const pdf = new jsPDF({
      unit: "pt",
      format: "a4",
    });

    const svgString = new XMLSerializer().serializeToString(svgElement);

    pdf.svg(svgString, {
      x: 10,
      y: 10,
      width: 580,
    });

    pdf.save(`${title}.pdf`);
  }
}
