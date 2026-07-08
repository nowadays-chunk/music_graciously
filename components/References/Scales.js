import React from "react";

export default function MusicTables() {
  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      <main className="py-8 space-y-16">
        {/* ------------------ FIRST TABLE ------------------ */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-4">Scales and Notes</h2>

          <table className="table-auto w-3/4 mx-auto border border-gray-200 shadow-lg">
            <thead className="bg-gray-200">
              <tr className="text-center">
                <th className="p-4 border">Root Key</th>
                <th className="p-4 border">Major</th>
                <th className="p-4 border">Minor</th>
                <th className="p-4 border">Harmonic</th>
                <th className="p-4 border">Melodic</th>
                <th className="p-4 border">Blues minor</th>
                <th className="p-4 border">Blues major</th>
              </tr>
              <tr className="text-center">
                <td className="p-4 border font-bold">Formulas</td>
                <td className="p-4 border">1, 2, 3, 4, 5, 6, 7</td>
                <td className="p-4 border">1, 2, b3, 4, 5, b6, b7</td>
                <td className="p-4 border">1, 2, b3, 4, 5, b6, 7</td>
                <td className="p-4 border">1, 2, b3, 4, 5, 6, 7</td>
                <td className="p-4 border">1, b3, 4, b5, 5</td>
                <td className="p-4 border">1, 2, b3, 3, 5</td>
              </tr>
            </thead>

            <tbody>
              {[
                { key: "C", notes: [
                  "C, C#, D, D#, E, F, F#",
                  "C, C#, D, D#, E, F, F#",
                  "C, C#, D, D#, E, F, F#",
                  "C, C#, D, D#, E, F, F#",
                  "C, C#, D, D#, E",
                  "C, C#, D, D#, E",
                ]},
                { key: "C#", notes: [
                  "C#, D, D#, E, F, F#, G",
                  "C#, D, D#, E, F, F#, G",
                  "C#, D, D#, E, F, F#, G",
                  "C#, D, D#, E, F, F#, G",
                  "C#, D, D#, E, F",
                  "C#, D, D#, E, F",
                ]},
                { key: "D", notes: [
                  "D, D#, E, F, F#, G, G#",
                  "D, D#, E, F, F#, G, G#",
                  "D, D#, E, F, F#, G, G#",
                  "D, D#, E, F, F#, G, G#",
                  "D, D#, E, F, F#",
                  "D, D#, E, F, F#",
                ]},
                { key: "D#", notes: [
                  "D#, E, F, F#, G, G#, A",
                  "D#, E, F, F#, G, G#, A",
                  "D#, E, F, F#, G, G#, A",
                  "D#, E, F, F#, G, G#, A",
                  "D#, E, F, F#, G",
                  "D#, E, F, F#, G",
                ]},
                { key: "E", notes: [
                  "E, F, F#, G, G#, A, A#",
                  "E, F, F#, G, G#, A, A#",
                  "E, F, F#, G, G#, A, A#",
                  "E, F, F#, G, G#, A, A#",
                  "E, F, F#, G, G#",
                  "E, F, F#, G, G#",
                ]},
                { key: "F", notes: [
                  "F, F#, G, G#, A, A#, B",
                  "F, F#, G, G#, A, A#, B",
                  "F, F#, G, G#, A, A#, B",
                  "F, F#, G, G#, A, A#, B",
                  "F, F#, G, G#, A",
                  "F, F#, G, G#, A",
                ]},
                { key: "F#", notes: [
                  "F#, G, G#, A, A#, B, C",
                  "F#, G, G#, A, A#, B, C",
                  "F#, G, G#, A, A#, B, C",
                  "F#, G, G#, A, A#, B, C",
                  "F#, G, G#, A, A#",
                  "F#, G, G#, A, A#",
                ]},
                { key: "G", notes: [
                  "G, G#, A, A#, B, C, C#",
                  "G, G#, A, A#, B, C, C#",
                  "G, G#, A, A#, B, C, C#",
                  "G, G#, A, A#, B, C, C#",
                  "G, G#, A, A#, B",
                  "G, G#, A, A#, B",
                ]},
                { key: "G#", notes: [
                  "G#, A, A#, B, C, C#, D",
                  "G#, A, A#, B, C, C#, D",
                  "G#, A, A#, B, C, C#, D",
                  "G#, A, A#, B, C, C#, D",
                  "G#, A, A#, B, C",
                  "G#, A, A#, B, C",
                ]},
                { key: "A", notes: [
                  "A, A#, B, C, C#, D, D#",
                  "A, A#, B, C, C#, D, D#",
                  "A, A#, B, C, C#, D, D#",
                  "A, A#, B, C, C#, D, D#",
                  "A, A#, B, C, C#",
                  "A, A#, B, C, C#",
                ]},
                { key: "A#", notes: [
                  "A#, B, C, C#, D, D#, E",
                  "A#, B, C, C#, D, D#, E",
                  "A#, B, C, C#, D, D#, E",
                  "A#, B, C, C#, D, D#, E",
                  "A#, B, C, C#, D",
                  "A#, B, C, C#, D",
                ]},
                { key: "B", notes: [
                  "B, C, C#, D, D#, E, F",
                  "B, C, C#, D, D#, E, F",
                  "B, C, C#, D, D#, E, F",
                  "B, C, C#, D, D#, E, F",
                  "B, C, C#, D, D#",
                  "B, C, C#, D, D#",
                ]},
              ].map((row, i) => (
                <tr key={i} className="text-center">
                  <td className="p-4 border font-bold">{row.key}</td>
                  {row.notes.map((n, idx) => (
                    <td key={idx} className="p-4 border">{n}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      <footer className="py-4 bg-gray-800 text-white text-center">
        <p>© 2024 Music Theory Generator</p>
      </footer>
    </div>
  );
}
