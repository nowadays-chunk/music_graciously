import React from "react";

export default function MusicTables() {
  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      <main className="py-8 space-y-16">
        {/* ------------------ SECOND TABLE ------------------ */}
        <section>
          <h2 className="text-3xl font-bold mb-4 text-center">Guitar Reference Table</h2>

          <table className="min-w-full bg-white border border-gray-300 w-3/4 mx-auto shadow-lg">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-800">Key</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-800">Relative Minor</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-800">Chords</th>
              </tr>
            </thead>

            <tbody>
              {[
                { key: "C", rel: "Am", chords: ["C maj","D min","E min","F maj","G maj","A min","B dim"]},
                { key: "G", rel: "Em", chords: ["G maj","A min","B min","C maj","D maj","E min","F# dim"]},
                { key: "D", rel: "Bm", chords: ["D maj","E min","F# min","G maj","A maj","B min","C# dim"]},
                { key: "A", rel: "F#m", chords: ["A maj","B min","C# min","D maj","E maj","F# min","G# dim"]},
                { key: "E", rel: "Dbm", chords: ["E maj","F# min","G# min","A maj","B maj","C# min","D# dim"]},
                { key: "B", rel: "Abm", chords: ["B maj","Db min","Eb min","E maj","Gb maj","Ab min","Bb dim"]},

                // Completed Missing Keys
                { key: "Gb", rel: "Ebm", chords: ["Gb maj","Ab min","Bb min","Cb maj","Db maj","Ebm","F dim"]},
                { key: "Db", rel: "Bbm", chords: ["Db maj","Eb min","F min","Gb maj","Ab maj","Bbm","C dim"]},
                { key: "Ab", rel: "Fm", chords: ["Ab maj","Bb min","C min","Db maj","Eb maj","F min","G dim"]},
                { key: "Eb", rel: "Cm", chords: ["Eb maj","F min","G min","Ab maj","Bb maj","C min","D dim"]},
                { key: "Bb", rel: "Gm", chords: ["Bb maj","C min","D min","Eb maj","F maj","G min","A dim"]},
                { key: "F", rel: "Dm", chords: ["F maj","G min","A min","Bb maj","C maj","D min","E dim"]},
              ].map((row, i) => (
                <tr key={i} className="border-b border-gray-300">
                  <td className="px-4 py-2 font-medium text-gray-800">{row.key}</td>
                  <td className="px-4 py-2">{row.rel}</td>
                  <td className="px-4 py-2">
                    <div className="grid gap-1">
                      {row.chords.map((c, idx) => (
                        <div key={idx}>{c}</div>
                      ))}
                    </div>
                  </td>
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
