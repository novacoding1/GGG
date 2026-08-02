import dagre from 'dagre';
import { ShezhirePerson } from '@/entities/node.types';
import { Node, Edge, Position } from '@xyflow/react';

const NODE_WIDTH = 220;
const NODE_HEIGHT = 90;

export const getLayoutedElements = (
  persons: ShezhirePerson[],
  direction: 'horizontal' | 'vertical' = 'horizontal'
) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === 'horizontal';
  dagreGraph.setGraph({
    rankdir: isHorizontal ? 'LR' : 'TB',
    nodesep: 50,
    ranksep: 90,
  });

  // Create Flow Nodes
  const flowNodes: Node[] = persons.map((person) => {
    return {
      id: person.id,
      type: 'shezhireNode',
      data: person as unknown as Record<string, unknown>,
      position: person.position || { x: 0, y: 0 },
    };
  });

  // Create Flow Edges
  const flowEdges: Edge[] = persons
    .filter((person) => person.parentId && person.parentId !== null)
    .map((person) => {
      const edgeColor = person.nodeColor || '#BDBDBD';
      return {
        id: `edge-${person.parentId}-${person.id}`,
        source: person.parentId!,
        target: person.id,
        type: 'smoothstep',
        animated: false,
        style: {
          stroke: edgeColor,
          strokeWidth: 3,
          transition: 'stroke 0.3s ease, stroke-width 0.3s ease',
        },
      };
    });

  // Add elements to dagre
  flowNodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  flowEdges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Calculate layout
  dagre.layout(dagreGraph);

  // Position nodes
  const layoutedNodes: Node[] = flowNodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges: flowEdges };
};
