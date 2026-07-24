import MoonModule from './src/moon.js';

MoonModule().then(engine => {
  engine._initMoonWeb();
  
  const setCompilerFlags = engine.cwrap('setCompilerFlags', 'void', ['boolean', 'boolean', 'boolean', 'boolean']);
  const executeMoonCode = engine.cwrap('executeMoonCode', 'void', ['string']);

  // Set AST flag to true
  setCompilerFlags(true, false, false, false);

  console.log("Executing code with AST flag ON...");
  executeMoonCode('let x be 1');
});
