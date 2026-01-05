'use client'

import CytoscapeComponent from "react-cytoscapejs";
import { useEffect, useState } from "react";
import cytoscape from "cytoscape";

export default function GraphView() {
  const [elements, setElements] = useState([]);
  const [cyInstance, setCyInstance] = useState(null);

  useEffect(() => {
    fetch("/api/graph")
      .then(res => res.json())
      .then(data => setElements(data));
  }, []);

  // Whenever elements change, run layout
  useEffect(() => {
    if (cyInstance && elements.length > 0) {
      const layout = cyInstance.layout({ name: "cose", animate: true });
      layout.run();
    }
  }, [elements, cyInstance]);

  return (
    <CytoscapeComponent
      elements={elements}
      style={{ width: "50vw", height: "600px", border: "1px solid #ccc" }}
      cy={(cy) => setCyInstance(cy)}
      stylesheet={[
        {
          selector: "node",
          style: {
            label: "data(label)",
            "background-color": "#4f46e5",
            color: "#fff",
            "text-valign": "center",
            "text-halign": "center",
            "text-wrap": "wrap",
            width: "label",
            height: "label",
            padding: "10px",
            "border-width": 1,
            "border-color": "#000"
          }
        },
        {
          selector: "edge",
          style: {
            label: "data(label)",
            width: 2,
            "line-color": "#999",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier"
          }
        }
      ]}
    />
  );
}
