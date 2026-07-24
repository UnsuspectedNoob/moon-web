const output = `=== ABSTRACT SYNTAX TREE ===
[BLOCK: 2 statements]
 ├─ [LET DECLARATION: 1 variables]
     ├─ Var: message
 │   ├─ [LITERAL: Hello World]
 ├─ [EXPR STMT]
 │   ├─ [PHRASAL CALL: show$1]
 │   │   ├─ [VARIABLE: message]
============================`;

function parseAST(text) {
  const lines = text.split('\n');
  const tree = [];
  
  // Skip the header/footer
  const dataLines = lines.filter(l => !l.startsWith('===') && l.trim() !== '');

  dataLines.forEach(line => {
    // A regex to match any sequence of " │  ", " ├─ ", or "    "
    // Since these are 4 chars each visually, let's just count leading whitespace + box drawing chars
    const prefixMatch = line.match(/^[\s│├─]*/);
    const prefix = prefixMatch ? prefixMatch[0] : '';
    const content = line.substring(prefix.length);
    
    // Each level is 4 chars. But wait, " ├─ " is actually 1 space, 1 box, 1 box, 1 space.
    // In JS string length, '├' is 1 char, '─' is 1 char. 
    // So " ├─ " is length 4.
    const level = prefix.length / 4;
    tree.push({ level, content, raw: line });
  });

  console.log(tree);
}

parseAST(output);
