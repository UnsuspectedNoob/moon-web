import CodeRunner from './CodeRunner';
import { useState } from 'react';

const Tooltip = ({ word, text }: { word: string; text?: string }) => {
  const definitions: Record<string, string> = {
    "primitives": "The most basic types of data a computer understands, like numbers, text (strings), and true/false (booleans).",
    "assignment": "Giving a variable a specific value to hold on to.",
    "interpolation": "Inserting the value of a variable directly into a string (text) so it becomes part of the sentence.",
    "lists": "An ordered collection of items, like a shopping list. Written with square brackets.",
    "dictionaries": "A collection of items stored as name-value pairs, like a real dictionary mapping words to definitions.",
    "appends": "Adding an item to the very end of a list.",
    "chained comparisons": "Checking multiple conditions in a single continuous math line, like 1 < age < 18.",
    "sticky subjects": "Moon remembers what you were just talking about for logical operations, so you don't have to repeat the variable name (e.g. x < 100 and is not 30).",
    "comprehensions": "A quick, one-line way to build a new list by filtering or modifying an existing list or range.",
    "phrasal": "Written like a natural English sentence, rather than typical computer code.",
    "multiple dispatch": "Writing multiple versions of the same function, and letting Moon automatically pick the right one based on the type of data you give it."
  };

  const definition = definitions[word.toLowerCase()] || "Definition not found.";
  const displayText = text || word;

  return (
    <span className="tooltip-wrapper">
      {displayText}
      <span className="tooltip-box">
        <strong>{word}</strong>: {definition}
      </span>
    </span>
  );
};

export default function Tutorial() {
  return (
    <div className="tutorial-container">
      <header className="tutorial-header">
        <h2>Moon Syntax Guide</h2>
        <p>Welcome to the definitive guide to the Moon programming language. The examples below are fully interactive!</p>
      </header>

      <div className="tutorial-content">

        <details className="tutorial-chapter" open>
          <summary>1. Variables and Primitives</summary>
          <div className="chapter-content">
            <p>In Moon, variables are declared using the <code>let</code> and <code>be</code> keywords. Moon handles <Tooltip word="primitives">strings, numbers, booleans, and <code>nil</code></Tooltip>. You can also perform multiple <Tooltip word="assignment" text="assignments" /> at once.</p>
            <CodeRunner initialCode={`let age be 27
let name be "Munachi"
let is_active be true
let nothing be nil

let a, b be [ ]

show name + " is " + age
show a`} />
          </div>
        </details>

        <details className="tutorial-chapter">
          <summary>2. String Interpolation & Built-ins</summary>
          <div className="chapter-content">
            <p>Strings are wrapped in double quotes. For string <Tooltip word="interpolation" />, wrap the expression in backticks <code>\` \`</code>. Moon also provides built-in <Tooltip word="phrasal" /> math and string functions.</p>
            <CodeRunner initialCode={`let number be 10
show "The square of \`number\` is \`number * number\`!"

let random_num be random from 1 to 10
let floored be floor of(2.8)
let upper be uppercase "moon"

show "Random: \`random_num\`, Floored: \`floored\`, Upper: \`upper\`"`} />
          </div>
        </details>

        <details className="tutorial-chapter">
          <summary>3. Lists and Dictionaries</summary>
          <div className="chapter-content">
            <p><Tooltip word="lists" text="Lists" /> and <Tooltip word="dictionaries" /> are powerful ways to store collections of data. You can access their items using brackets <code>[]</code> or the natural <code>'s</code> syntax.</p>
            <CodeRunner initialCode={`let inventory be [ "sword", "shield" ]
show inventory[1]

let user be {
  name: "Emrys",
  speed: "Fast"
}
show user's name`} />
          </div>
        </details>

        <details className="tutorial-chapter">
          <summary>4. Ranges</summary>
          <div className="chapter-content">
            <p>Ranges allow you to generate a sequence of numbers effortlessly using the <code>to</code> and <code>by</code> keywords. They can even be embedded directly inside <Tooltip word="lists" />!</p>
            <CodeRunner initialCode={`let my_range be 1 to 10 by 2
show my_range

let combined be [ 5 to 7, 10 to 12 ]
show combined`} />
          </div>
        </details>

        <details className="tutorial-chapter">
          <summary>5. Data Actions (State Mutation)</summary>
          <div className="chapter-content">
            <p>Moon avoids arbitrary symbols for actions and relies on English verbs instead.</p>
            <ul>
              <li><code>set</code> performs <Tooltip word="assignment" />.</li>
              <li><code>update</code> performs in-place arithmetic (like +=).</li>
              <li><code>add</code> <Tooltip word="appends" /> items to lists. You can add multiple items at once!</li>
            </ul>
            <CodeRunner initialCode={`let hp be 100
update hp - 20
show "Took damage! HP is now: \`hp\`"

set hp to 100
show "Healed back to full: \`hp\`"

let inventory be []
add "sword", "shield" to inventory
show inventory`} />
          </div>
        </details>

        <details className="tutorial-chapter">
          <summary>6. Control Flow</summary>
          <div className="chapter-content">
            <p>Blocks are opened with a colon <code>:</code> and must be closed with the <code>end</code> keyword. Moon supports standard <code>if</code>, <code>else if</code>, and <code>unless</code> blocks.</p>
            <CodeRunner initialCode={`let power be 50

if power > 70:
  show "You are very strong."
else if power > 30:
  show "You are average."
else:
  show "You are weak."
end

# Ruby-esque trailing modifiers
show "Danger!" unless power > 20`} />
          </div>
        </details>

        <details className="tutorial-chapter">
          <summary>7. Chained Comparisons</summary>
          <div className="chapter-content">
            <p>Moon allows you to perform <Tooltip word="chained comparisons" /> naturally, without having to split them up with 'and'.</p>
            <CodeRunner initialCode={`let power be 50

if 10 < power <= 100:
  show "Power is in the sweet spot."
end`} />
          </div>
        </details>

        <details className="tutorial-chapter">
          <summary>8. Sticky Subjects</summary>
          <div className="chapter-content">
            <p>When chaining conditions, Moon supports <Tooltip word="sticky subjects" />. The language remembers the variable you were testing so you don't have to repeat it!</p>
            <CodeRunner initialCode={`let n be 5

if n > 0 and is not 10:
  show "n is greater than 0, and n is not 10!"
end`} />
          </div>
        </details>

        <details className="tutorial-chapter">
          <summary>9. Inline Conditions</summary>
          <div className="chapter-content">
            <p>Instead of writing a full <code>if/else</code> block just to pick between two values, you can use inline conditions. It reads perfectly as English: "Assign X if condition, else Y".</p>
            <CodeRunner initialCode={`let score be 85
let grade be "Pass" if score >= 50 else "Fail"

show grade`} />
          </div>
        </details>

        <details className="tutorial-chapter">
          <summary>10. Loops, Unpacking, and Comprehensions</summary>
          <div className="chapter-content">
            <p>Moon provides a rich set of looping constructs. You can unpack <Tooltip word="lists" /> or <Tooltip word="dictionaries" /> seamlessly. <Tooltip word="Comprehensions" /> can be written in a single line, or as multi-line blocks!</p>
            <CodeRunner initialCode={`# Functional comprehensions using ranges and sticky subjects
let evens be [for each x in 1 to 10 keep x if is not 5]
show evens

# Dictionary block comprehensions with unpacking!
let data be ["alpha", "beta"]
let dict be {
  for each file, index in data:
    keep file: index * 10
  end
}
show dict

let p be 1
until p > 3:
  show p
  update p + 1
end`} />
          </div>
        </details>

        <details className="tutorial-chapter">
          <summary>11. Blueprints, Instantiation & Cloning</summary>
          <div className="chapter-content">
            <p>Moon uses <code>type</code> to define data blueprints. You can instantiate them using <code>with ... end</code> or the <code>{}</code> shorthand. You can even embed "active properties" (methods) right inside the type!</p>
            <CodeRunner initialCode={`type Player:
  name, health: 100,
  my info:
    give "\`my name\` has \`my health\` health."
  end,
  my (self) take_damage(dmg):
    update self.health - dmg
  end
end

let p1 be Player with name: "Emrys" end
p1.take_damage(20)

show p1's info`} />
          </div>
        </details>

        <details className="tutorial-chapter">
          <summary>12. Phrasal Functions & Multiple Dispatch</summary>
          <div className="chapter-content">
            <p>Functions in Moon are written as natural language phrases. Even better, you can use <Tooltip word="Multiple Dispatch" text="multiple dispatch" /> to overload the exact same phrase to do different things depending on the parameter types!</p>
            <CodeRunner initialCode={`type Node: ip end
type Firewall: strength end

let breach system (target: Node):
  show "Hacking node at \`target's ip\`!"
end

let breach system (target: Firewall):
  show "Bypassing firewall with strength \`target's strength\`!"
end

let n be Node { ip: "192.168.1.1" }
let fw be Firewall { strength: 1024 }

breach system n
breach system fw`} />
          </div>
        </details>

        <details className="tutorial-chapter">
          <summary>13. Advanced Slicing & Access</summary>
          <div className="chapter-content">
            <p>Moon provides incredibly clean syntax for manipulating <Tooltip word="lists" />. You can use <code>end</code> in slices, and even use dot-notation for quick bracketless access!</p>
            <CodeRunner initialCode={`let items be [ 10, 20, 30, 40, 50 ]

# Quick 1-indexed bracketless access
let first be items.1
show first

# Slicing with the 'end' keyword
let rest be items[2 to end]
show rest

# Slicing backwards
let backwards be items[end to 1]
show backwards`} />
          </div>
        </details>

      </div>
    </div>
  );
}
