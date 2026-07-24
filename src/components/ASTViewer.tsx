import React from 'react';
import { ChevronRight, ChevronDown, Folder, Code, Hash, Type, Box, Zap } from 'lucide-react';
import './ASTViewer.css';

interface ASTNode {
  id: number;
  level: number;
  content: string;
  raw: string;
  children: ASTNode[];
  isExpanded: boolean;
}

interface Props {
  logs: string[];
}

export default function ASTViewer({ logs }: Props) {
  const [expandedNodes, setExpandedNodes] = React.useState<Record<number, boolean>>({});

  // 1. Parse flat lines into a nested tree structure
  const tree = React.useMemo(() => {
    const rootNodes: ASTNode[] = [];
    const stack: ASTNode[] = [];
    let idCounter = 0;

    for (const line of logs) {
      if (line.trim() === '') continue;

      // The C backend outputs 4-character blocks per depth level ("├── ", "│   ", "└── ", "    ")
      // We count the number of box-drawing characters and spaces to find depth.
      const prefixMatch = line.match(/^[\s│├└─]*/);
      const prefix = prefixMatch ? prefixMatch[0] : '';
      const content = line.substring(prefix.length);
      const level = Math.floor(prefix.length / 4);

      const node: ASTNode = {
        id: idCounter++,
        level,
        content,
        raw: line,
        children: [],
        isExpanded: true // default state
      };

      if (level === 0) {
        rootNodes.push(node);
        stack.length = 0;
        stack.push(node);
      } else {
        // Pop stack until we find the parent (which should be at level - 1)
        while (stack.length > 0 && stack[stack.length - 1].level >= level) {
          stack.pop();
        }
        
        if (stack.length > 0) {
          stack[stack.length - 1].children.push(node);
        } else {
          // Fallback if parsing fails
          rootNodes.push(node);
        }
        stack.push(node);
      }
    }
    return rootNodes;
  }, [logs]);

  const toggleNode = (id: number) => {
    setExpandedNodes(prev => ({
      ...prev,
      [id]: prev[id] !== undefined ? !prev[id] : false
    }));
  };

  const renderNode = (node: ASTNode) => {
    const isExpanded = expandedNodes[node.id] !== undefined ? expandedNodes[node.id] : node.isExpanded;
    const hasChildren = node.children.length > 0;
    
    // Determine Icon based on content
    let Icon = Code;
    let iconColor = '#c084fc';
    if (node.content.includes('BLOCK') || node.content.includes('DECLARATION')) {
      Icon = Folder;
      iconColor = '#38bdf8';
    } else if (node.content.startsWith('Var:')) {
      Icon = Hash;
      iconColor = '#f472b6';
    } else if (node.content.includes('LITERAL')) {
      Icon = Type;
      iconColor = '#4ade80';
    } else if (node.content.includes('OPERATOR')) {
      Icon = Zap;
      iconColor = '#facc15';
    } else if (node.content.startsWith('[')) {
      Icon = Box;
      iconColor = '#c084fc';
    }

    return (
      <div key={node.id} className="ast-tree-node-container">
        <div 
          className={`ast-tree-node ${hasChildren ? 'has-children' : ''}`}
          onClick={() => hasChildren && toggleNode(node.id)}
          style={{ paddingLeft: `${node.level * 16}px` }}
        >
          <div className="ast-tree-toggle">
            {hasChildren ? (
              isExpanded ? <ChevronDown size={14} color="#94a3b8" /> : <ChevronRight size={14} color="#94a3b8" />
            ) : (
              <span style={{ width: 14, display: 'inline-block' }} />
            )}
          </div>
          <Icon size={14} color={iconColor} className="ast-tree-icon" />
          <div className="ast-tree-content">
            {highlightContent(node.content)}
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div className="ast-tree-children">
            {node.children.map(renderNode)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="ast-viewer">
      {tree.map(renderNode)}
      {tree.length === 0 && <div className="ast-empty">Run the code to generate the AST.</div>}
    </div>
  );
}

// Basic syntax highlighting for the AST components
function highlightContent(text: string) {
  if (text.startsWith('[') && text.includes(']')) {
    const splitIndex = text.indexOf(']');
    const inside = text.substring(1, splitIndex);
    const remainder = text.substring(splitIndex + 1);
    
    // Check if there is a colon inside the brackets for property splits (e.g. [BLOCK: 2 statements])
    if (inside.includes(':')) {
      const [type, ...rest] = inside.split(':');
      return (
        <span className="ast-pill block-pill">
          <span className="ast-type">{type}</span>
          <span className="ast-value">{rest.join(':')}</span>
        </span>
      );
    }
    
    return (
      <>
        <span className="ast-pill type-pill">
          <span className="ast-type">{inside}</span>
        </span>
        {remainder && <span className="ast-remainder">{remainder}</span>}
      </>
    );
  }
  
  if (text.startsWith('Var:')) {
    return (
      <>
        <span className="ast-variable">{text.substring(4).trim()}</span>
      </>
    );
  }
  
  return <span className="ast-text">{text}</span>;
}
