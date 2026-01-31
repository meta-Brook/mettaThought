'use client'

import CytoscapeComponent from "react-cytoscapejs";
import { useEffect, useState, useRef } from "react";
import cytoscape from "cytoscape";

export default function GraphView({ view = "default", centerName ="" }) {
  console.log("GraphView load");
  const [elements, setElements] = useState([]);
  const [cyInstance, setCyInstance] = useState(null);

  useEffect(() => {
    let url = `/api/graph?view=${view}`;
    if (centerName) {
      url += `&name=${encodeURIComponent(centerName)}`;
    }

    fetch(url)
      .then(res => res.json())
      .then(data => setElements(data));

    
  }, [view, centerName]);

  // Whenever elements change, run layout
const layoutRunRef = useRef(false);

console.log("elements",elements.map(el => (el.data?.source)));

// const unlabeledNodes = elements.filter(el => !el.data?.source.label);
// console.log("unlabeled nodes",unlabeledNodes);

useEffect(() => {
  if (!cyInstance || elements.length === 0) return;
  if (layoutRunRef.current) return;

  cyInstance.layout({
    name: "cose",
    animate: true,
    fit: true,
    padding: 50
  }).run();

  layoutRunRef.current = true;
}, [cyInstance, elements]);



  return (
    <CytoscapeComponent
      elements={elements}

      style={{ width: "50vw", height: "600px", border: "1px solid #ccc" }}
      cy={(cy) => {
        setCyInstance(cy);
        // Register a double-click handler for nodes
        cy.on("dblclick", "node", (evt) => {
          const node = evt.target;
          const nodeLabel = node.data("uuid"); //This is currently returning a number when I need it to return the label. this is name or text

          // Example: navigate to a page using node ID or label
         // window.location.href = `/concept/${encodeURIComponent(nodeLabel)}`;
        });
      }}
      stylesheet={[
        {
          selector: "node",
          style: {
            //label: "data(label)",
            //the label often has problems when the node is atypical. This is set in
            shape: "ellipse",
            //width: (node) => { return node.data('label').length * 2 },
            //height: (node) => { return node.data('label').length * 1.5 },
            backgroundColor: "#4f46e5",
            color: "#fff",
            textValign: "center",
            textHalign: "center",
            textWrap: "wrap",
            textMaxWidth: 120,

            padding: "10px",
            borderWidth: 1,
            borderColor: "#000"
          }
        },
        {
          selector: "edge",
          style: {
            label: "data(label)",
            fontSize: "12px",
            color: "#fff",
            width: 2,
            padding: "10px",
            lineColor: "#999",
            targetArrowShape: "triangle",
            curveStyle: "bezier"
          }
        }
      ]}
    />
  );
}
