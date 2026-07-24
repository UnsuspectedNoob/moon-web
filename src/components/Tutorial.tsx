import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CodeRunner from './CodeRunner';
import type { ReactNode } from 'react';

const Tooltip = ({ word, text, children }: { word: string; text?: string; children?: ReactNode }) => {
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
    "multiple dispatch": "Writing multiple versions of the same function, and letting Moon automatically pick the right one based on the type of data you give it.",
    "instantiate": "To bring a blueprint to life by creating an actual working copy of it in memory.",
    "index": "The numbered position of an item in a list (starting from 1 in Moon).",
    "blueprint": "A custom template (or 'type') that defines how a piece of data should look and behave."
  };

  const definition = definitions[word.toLowerCase()] || "Definition not found.";
  const displayText = children || text || word;

  return (
    <span className="tooltip-wrapper">
      {displayText}
      <span className="tooltip-box">
        <strong>{word}</strong>: {definition}
      </span>
    </span>
  );
};

export const chapters = [
  {
    title: "Variables and Primitives",
    content: (
      <p>Every story starts somewhere! In Moon, we start by creating variables using the <code>let</code> and <code>be</code> keywords. You can store basic data types (called <Tooltip word="primitives">primitives</Tooltip>) like numbers, text (strings), true/false values, and even <code>nil</code> (which means nothing). You can print anything to the screen using the <code>show</code> command. Notice how you can also group multiple <Tooltip word="assignment" text="assignments" /> on a single line!</p>
    ),
    code: `let age be 27
let name be "Munachi"
let is_active be true
let nothing be nil

# Multiple assignments at once!
let a, b be [ ]

show name + " is " + age
show a`
  },
  {
    title: "String Interpolation",
    content: (
      <p>Now that we have variables, let's mix them with text! Strings are wrapped in double quotes. To instantly insert a variable inside a string, we use <Tooltip word="interpolation" /> by wrapping the variable in backticks <code>\` \`</code>.</p>
    ),
    code: `let number be 10
show "The square of \`number\` is \`number * number\`!"`
  },
  {
    title: "Native Phrases (Standard Library)",
    content: (
      <p>Moon comes with built-in <Tooltip word="phrasal">phrasal functions</Tooltip> that read like natural English! You can use <code>random from X to Y</code>, <code>floor of</code>, <code>uppercase</code>, and <code>lowercase</code>.<br/><br/>Moon also features the incredible <code>ask</code> command, which pauses your program, prompts the user for input right here in the terminal, and waits for their response! Try it out below!</p>
    ),
    code: `let name be ask "What is your name? "
let choice be random from 1 to 10
let upper be uppercase name

show "Hello \`upper\`, your lucky number is \`choice\`!"`
  },
  {
    title: "Lists and Dictionaries",
    content: (
      <p>Beyond single values, you'll often want to group data together. We use <Tooltip word="lists">lists</Tooltip> (square brackets) for ordered items, and <Tooltip word="dictionaries">dictionaries</Tooltip> (curly braces) for labeled items. You can access what's inside them using standard brackets <code>[]</code>, or by using Moon's natural <code>'s</code> syntax which reads just like English!</p>
    ),
    code: `let inventory be [ "sword", "shield" ]
show "Second item is: " + inventory[1]

let user be {
  name: "Emrys",
  speed: "Fast"
}
show "The user's name is: " + user's name`
  },
  {
    title: "Ranges",
    content: (
      <p>What if you need a long sequence of numbers, like 1 to 100? Instead of typing them out in a list, Moon gives you Ranges. Using the <code>to</code> and <code>by</code> keywords, you can effortlessly generate sequences. You can even embed these ranges directly inside your <Tooltip word="lists" />!</p>
    ),
    code: `let my_range be 1 to 10 by 2
show my_range

let combined be [ 5 to 7, 10 to 12 ]
show combined`
  },
  {
    title: "Data Actions (State Mutation)",
    content: (
      <>
        <p>We've created variables and collections, but how do we change them? Most programming languages use confusing math symbols (like <code>+=</code>), but Moon prefers clear English verbs.</p>
        <ul>
          <li>Use <code>set</code> when you want to change a variable's value (<Tooltip word="assignment" />).</li>
          <li>Use <code>update</code> when you want to perform math on a variable.</li>
          <li>Use <code>add</code> to mathematically add numbers together, stitch text strings together, or to <Tooltip word="appends" text="append" /> items to the end of a list!</li>
        </ul>
      </>
    ),
    code: `let hp be 100
update hp - 20
add 10 to hp
show "HP is now: \`hp\`"

let greeting be "Hello"
add " World!" to greeting
show greeting

let inventory be []
add "sword", "shield" to inventory
show inventory`
  },
  {
    title: "Control Flow & Blocks",
    content: (
      <>
        <p>Sometimes you only want code to run if a certain condition is met. This is where <code>if</code>, <code>else if</code>, and <code>else</code> come in. If you have multiple things to do, you can open a block using a colon <code>:</code> and close it with the <code>end</code> keyword.</p>
        <p>But here's a secret: if you only have a single statement to execute, you can skip the block entirely! Moon also provides the intuitive opposite of <code>if</code>: <code>unless</code>. These can even be placed at the end of a line!</p>
      </>
    ),
    code: `# A multi-line block requires a colon and an 'end'
let power be 50

if power > 70:
  show "You are very strong."
  show "You are ready for battle."
end

# A single statement doesn't need a block!
if power <= 70 show "You are weak."

# 'unless' is the exact opposite of 'if'
unless power > 70 show "You need to train more!"`
  },
  {
    title: "Chained Comparisons",
    content: (
      <p>Now let's supercharge our control flow! In standard programming, checking if a number is between two values forces you to write the variable twice (like <code>if power &gt; 10 and power &lt;= 100</code>). Moon allows you to write <Tooltip word="chained comparisons" /> naturally, exactly how you would write it in math.</p>
    ),
    code: `let power be 50

if 10 < power <= 100:
  show "Power is in the sweet spot."
end`
  },
  {
    title: "Sticky Subjects",
    content: (
      <p>Moon has another trick for logical operations called <Tooltip word="sticky subjects" />. When you use <code>and</code> or <code>or</code>, Moon remembers the variable you were just talking about! This means you don't have to repeat the variable name, saving you time and making the code read beautifully.</p>
    ),
    code: `let n be 5

# Notice we don't have to say 'and n is not 10'!
if n > 0 and is not 10:
  show "n is greater than 0, and n is not 10!"
end`
  },
  {
    title: "Inline Conditions",
    content: (
      <p>Writing a full <code>if/else</code> block just to assign a single variable can feel bulky. Moon provides a quick, one-line shortcut. It reads perfectly as an English sentence: "Let this variable be X if the condition is true, else let it be Y".</p>
    ),
    code: `let score be 85
let grade be "Pass" if score >= 50 else "Fail"

show "Your grade is: \`grade\`"`
  },
  {
    title: "Condition-Based Loops (While/Until)",
    content: (
      <p>If you want a block of code to repeat continuously based on a condition, you can use <code>while</code>. Moon also provides its intuitive opposite, <code>until</code>. These loops read naturally and are perfect for when you don't know exactly how many times the loop will run!</p>
    ),
    code: `let p be 1

until p > 3:
  show "Loop tick: \`p\`"
  update p + 1
end

let hp be 10
while hp > 0:
  show "Health is \`hp\`, still fighting!"
  update hp - 5
end`
  },
  {
    title: "For Loops",
    content: (
      <>
        <p>When you have a collection or range, you usually want to loop over it. Moon provides incredibly flexible <code>for</code> loops.</p>
        <ul>
          <li>The word <code>each</code> is completely optional—use it if it helps the sentence read better!</li>
          <li>Use <code>in</code> when iterating over a collection (like a list), and <code>from</code> when iterating over a numeric range.</li>
          <li>You can unpack multiple values at once! E.g. <code>for value, <Tooltip word="index">index</Tooltip> in ...</code> to grab both the item and its numbered position.</li>
        </ul>
      </>
    ),
    code: `let items be ["apple", "banana"]

# Unpacking both the value and its index
for each food, i in items:
  show "Item \`i\` is \`food\`."
end

# 'each' is optional! Notice 'from' for ranges:
for i from 1 to 3:
  show "Count: \`i\`"
end`
  },
  {
    title: "Comprehensions",
    content: (
      <p>Once you've mastered loops, you can unlock the ultimate shortcut: <Tooltip word="Comprehensions" text="comprehensions" />! These allow you to rapidly build a brand new list or dictionary by filtering an existing one in just a single line of code.</p>
    ),
    code: `# Building a list of even numbers from a range
let evens be [for each x in 1 to 10 keep x if is not 5]
show "Evens without 5: " + evens

# Building a dictionary from a list, using unpacking!
let data be ["alpha", "beta"]
let dict be {
  for each file, index in data:
    keep file: index * 10
  end
}
show dict`
  },
  {
    title: "Blueprints, Instantiation & Cloning",
    content: (
      <p>Now we enter advanced territory! If lists and dictionaries aren't enough, you can create your own custom data <Tooltip word="blueprint">blueprints</Tooltip> using the <code>type</code> keyword. Once defined, you can <Tooltip word="instantiate">instantiate</Tooltip> them using <code>with ... end</code>. You can even embed special commands right inside the blueprint, like "active properties" which run code when you ask for them!</p>
    ),
    code: `type Player:
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

show p1's info`
  },
  {
    title: "Phrasal Functions & Multiple Dispatch",
    content: (
      <p>Functions in Moon are written as natural language <Tooltip word="phrasal">phrases</Tooltip>, making them incredibly easy to read. Even better, you can use <Tooltip word="Multiple Dispatch" text="multiple dispatch" /> to write the exact same phrase multiple times, but have it do completely different things depending on the <code>type</code> of data you feed it!</p>
    ),
    code: `type Node: ip end
type Firewall: strength end

# The phrase "breach system" handles Nodes
let breach system (target: Node):
  show "Hacking node at \`target's ip\`!"
end

# The exact same phrase handles Firewalls differently!
let breach system (target: Firewall):
  show "Bypassing firewall with strength \`target's strength\`!"
end

let n be Node { ip: "192.168.1.1" }
let fw be Firewall { strength: 1024 }

breach system n
breach system fw`
  },
  {
    title: "Advanced Slicing & Access",
    content: (
      <p>To wrap things up, here are some pro-tips for working with <Tooltip word="lists" />. Moon provides incredibly clean syntax for manipulating lists. You can use the <code>end</code> keyword in slices to grab everything up to the end, or even slice backwards! You can also use a quick dot-notation for grabbing items by their 1-based <Tooltip word="index">index</Tooltip> without using brackets.</p>
    ),
    code: `let items be [ 10, 20, 30, 40, 50 ]

# Quick 1-indexed bracketless access
let first be items.1
show "First item is: \`first\`"

# Slicing with the 'end' keyword
let rest be items[2 to end]
show "Rest of items: \`rest\`"

# Slicing backwards
let backwards be items[end to 1]
show "Backwards: \`backwards\`"`
  }
];


export default function Tutorial() {
  const location = useLocation();
  
  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (el.tagName === 'DETAILS' && !(el as HTMLDetailsElement).open) {
          (el as HTMLDetailsElement).open = true;
        }
      }
    }
  }, [location.hash]);

  return (
    <div className="tutorial-container">
      <header className="tutorial-header">
        <h2>Moon Syntax Guide</h2>
        <p>Welcome to the definitive guide to the Moon programming language. The examples below are fully interactive!</p>
      </header>

      <div className="tutorial-content">
        {chapters.map((chapter, i) => (
          <details key={i} className="tutorial-chapter" id={`chapter-${i}`} open={i === 0}>
            <summary>{i + 1}. {chapter.title}</summary>
            <div className="chapter-content">
              {chapter.content}
              <CodeRunner initialCode={chapter.code} />
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
