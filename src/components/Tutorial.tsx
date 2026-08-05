import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CodeRunner from './CodeRunner';
import type { ReactNode } from 'react';

const Tooltip = ({ word, text, children }: { word: string; text?: string; children?: ReactNode }) => {
  const definitions: Record<string, string> = {
    "keyword": "A reserved word built directly into the language (like 'let', 'set', 'if', 'while'). You cannot use these as variable names.",
    "primitives": "The most basic types of data a computer understands, like numbers, text (strings), true/false (booleans), and nil.",
    "assignment": "Giving a variable a specific value to hold on to.",
    "spaced identifiers": "Variables and phrases made of multiple words separated by spaces, like 'user name' or 'first name'.",
    "broadcasting": "Assigning a single value to multiple variables simultaneously in a single let statement.",
    "interpolation": "Inserting the value of a variable or expression directly into a string using backticks ` `.",
    "lists": "An ordered collection of items written with square brackets.",
    "dictionaries": "A collection of items stored as key-value pairs written with curly braces.",
    "appends": "Adding an item to the very end of a list.",
    "chained comparisons": "Checking multiple conditions in a single continuous mathematical inequality, like 10 < age <= 100.",
    "sticky subjects": "Moon automatically remembers the subject of your logical comparisons across 'and' and 'or' without having to repeat the variable name.",
    "comprehensions": "A quick, one-line expression to build a new list or dictionary by transforming or filtering elements.",
    "phrasal": "Written like a natural English sentence rather than conventional cryptic code.",
    "multiple dispatch": "Writing multiple versions of a function that Moon dynamically routes based on runtime parameter types.",
    "union types": "Allowing a parameter to match any of multiple specified types (e.g. Number or String).",
    "infix": "Phrasal functions where an argument leads the sentence, such as 'text repeated 3 times'.",
    "instantiate": "Creating a concrete, working copy of a blueprint in memory with Type { ... }.",
    "index": "The numbered position of an item in a list (starting from 1 in Moon).",
    "1-based": "In Moon, list indexing starts at 1 just like natural human counting, rather than machine 0.",
    "bipolar indexing": "Accessing items relative to the end of a list using negative numbers, like list[-1] for the last element.",
    "blueprint": "A custom type template defining default properties and methods for structured objects.",
    "extension methods": "Adding new methods and active properties to types from anywhere using possessive 's phrasing.",
    "type casting": "Explicitly converting a value from one type to another or hydrating a dictionary with the 'as' keyword.",
    "comments": "Lines starting with # or indented blocks starting with ## that are ignored by the compiler.",
    "multiline strings": "Strings spanning across multiple lines using triple single-quotes '''...'''."
  };

  const definition = definitions[word.toLowerCase()] || "Definition not found.";
  const displayText = children || text || word;

  return (
    <span className="relative group/tooltip inline-block cursor-help border-b border-dashed border-moon-accent text-moon-accent hover:bg-moon-accent/10 transition-colors rounded px-1">
      {displayText}
      <span className="max-md:fixed max-md:bottom-4 max-md:left-4 max-md:right-4 max-md:w-auto max-md:translate-x-0 max-md:mb-0 max-md:before:hidden absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-moon-pane border border-moon-border text-white text-sm rounded-lg shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-50 pointer-events-none before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-moon-border">
        <strong className="text-moon-accent">{word}</strong>: {definition}
      </span>
    </span>
  );
};

export const chapters = [
  {
    title: "Variables and Primitives",
    content: (
      <p>Every story starts somewhere! In Moon, we declare variables using <Tooltip word="keyword"><code>let</code></Tooltip> and <Tooltip word="keyword"><code>be</code></Tooltip>. Identifiers can be single words or natural multi-word <Tooltip word="spaced identifiers">spaced identifiers</Tooltip> like <code>user name</code>. You can store basic <Tooltip word="primitives">primitives</Tooltip> like numbers, text, booleans, and <code>nil</code>. Moon also supports multi-variable <Tooltip word="assignment" text="declarations" /> and 1-to-N <Tooltip word="broadcasting" /> on a single line! Print anything to the console using <code>show</code>, and write <Tooltip word="comments"># comments</Tooltip> for developer notes.</p>
    ),
    code: `## VARIABLES & PRIMITIVES
   Demonstrates spaced identifiers, multi-variable declarations,
   and 1-to-N broadcasting.

let age be 27
let is_active be true
let nothing be nil

# Natural multi-word spaced identifiers!
let user name be "Munachi"

# Multi-variable spaced declarations
let first name, last name be "Munachiso", "Ukpai"

# 1-to-N broadcasting
let width, height be 100

show "\`first name\` \`last name\` is \`age\` years old."
show "Dimensions: \`width\` x \`height\`"
`
  },
  {
    title: "Setting and Reassigning",
    content: (
      <p>While <Tooltip word="keyword"><code>let</code></Tooltip> declares new variables, use <Tooltip word="keyword"><code>set</code></Tooltip> and <code>to</code> to reassign variables, mutate dictionary properties, or update list items. Moon also supports multi-variable <code>set</code> reassignments in a single statement. Attempting to <code>set</code> an undeclared variable produces a helpful compile-time error.</p>
    ),
    code: `## SET & REASSIGNING
   Updating variables, dictionaries, and multiple targets.

let player score be 0
show "Initial score: \`player score\`"

# Updating single variables
set player score to 100
show "New score: \`player score\`"

# Multi-variable reassignment
let x, y be 10, 20
set x, y to 30, 40
show "Coordinates: \`x\`, \`y\`"

# Modifying dictionaries with bracket or possessive notation
let config be { difficulty: "Easy" }
set config["difficulty"] to "Hard"
set config's difficulty to "Nightmare"
show "Difficulty: \`config's difficulty\`"
`
  },
  {
    title: "Multiline Comments",
    content: (
      <p>Moon features elegant, brace-free <Tooltip word="comments">multiline comments</Tooltip> driven purely by indentation. Instead of clunky closing tags, you start a block with <code>##</code>. As long as the following lines are indented past the <code>##</code>, they are safely ignored by the compiler. It's a clean way to write documentation or temporarily disable code blocks!</p>
    ),
    code: `## This is an indentation-based multiline comment!
   Notice how there are no closing tags required!
   As long as we indent past the start of the ##,
   the compiler ignores all of this completely.

let greeting be "Hello from Moon!"
show greeting

## We can also use multiline comments to easily
   disable blocks of code without prepending '#' to each line.
   
   let inactive (x):
     give x * 2
   end

show "The disabled code above was safely ignored."
`
  },
  {
    title: "String Interpolation & Multiline Strings",
    content: (
      <p>Double-quoted strings support dynamic <Tooltip word="interpolation" /> by wrapping variables or calculations in backticks <code>\` \`</code>. For text that spans multiple lines, Moon provides <Tooltip word="multiline strings" /> using triple single-quotes <code>'''...'''</code>, which also fully support interpolation!</p>
    ),
    code: `## STRINGS & INTERPOLATION
   Backtick interpolation and triple-quoted multiline strings.

let item, price, qty be "Potion", 15, 3
show "Purchased \`qty\`x \`item\` for $\`price * qty\`."

let letter be '''Dear Adventurer,
Welcome to the realm of Moon.
Your current gold is: $\`price * qty * 2\`.
Safe travels!'''

show letter
`
  },
  {
    title: "Lists & 1-Based / Negative Indexing",
    content: (
      <p><Tooltip word="lists">Lists</Tooltip> are ordered sequences enclosed in <code>[ ]</code>. Moon uses <Tooltip word="1-based">1-based indexing</Tooltip> for human-friendly counting (<code>list[1]</code>), fast bracketless dot notation (<code>list.1</code>), and <Tooltip word="bipolar indexing">bipolar / negative indexing</Tooltip> from the end (<code>list[-1]</code>). Access list size anytime using <code>list's length</code>.</p>
    ),
    code: `## LISTS & BIPOLAR INDEXING
   1-based counting, dot-indexing, and negative indexing.

let party be [ "Warrior", "Mage", "Rogue", "Healer" ]

# 1-based bracket indexing
show "First hero: \`party[1]\`"

# Bracketless dot indexing
show "Second hero: \`party.2\`"

# Negative / bipolar indexing from the end
show "Last hero: \`party[-1]\`"
show "Second to last: \`party[-2]\`"

show "Party size: \`party's length\`"
`
  },
  {
    title: "Dictionaries & Property Access",
    content: (
      <p><Tooltip word="dictionaries">Dictionaries</Tooltip> store key-value mappings wrapped in <code>{'{ }'}</code>. You can read and write values using standard bracket notation (<code>dict["key"]</code>), dot notation (<code>dict.key</code>), or Moon's natural possessive syntax (<code>dict's key</code>).</p>
    ),
    code: `## DICTIONARIES
   Key-value pairs with bracket, dot, and possessive access.

let player be {
  name: "Emrys",
  level: 42,
  class: "Archmage"
}

# Possessive access
show "Player: \`player's name\` (Lvl \`player's level\`)"

# Bracket access
let player class be player["class"]
show "Class: \`player class\`"

# Mutating dictionary values
set player's level to 43
show "Leveled up! New level: \`player's level\`"
`
  },
  {
    title: "Ranges & Slices",
    content: (
      <p>Generate numeric sequences effortlessly with <code>to</code> and <code>by</code>. Slice lists forwards with <code>list[start to end]</code>, slice in reverse with <code>list[end to 1]</code>, and compose ranges directly inside list literals!</p>
    ),
    code: `## RANGES & ADVANCED SLICING
   Generating ranges, slicing forwards, and slicing backwards.

let odd numbers be 1 to 9 by 2
show odd numbers

let inventory be [ "Sword", "Shield", "Potion", "Map", "Key" ]

# Slicing from index 2 to the end
let sub items be inventory[2 to end]
show "Sub-inventory: \`sub items\`"

# Slicing backwards
let reversed items be inventory[end to 1]
show "Reversed: \`reversed items\`"

# Combining ranges into a list
let sequence be [ 1 to 3, 7 to 9 ]
show sequence
`
  },
  {
    title: "List & Dictionary Comprehensions",
    content: (
      <p><Tooltip word="comprehensions">Comprehensions</Tooltip> provide a concise, expressive syntax for building transformed and filtered lists or dictionaries in a single line using <code>[ for each x in ... keep ... if ... ]</code> and <code>{'{ for each k in ... keep k: v }'}</code>.</p>
    ),
    code: `## COMPREHENSIONS
   Inline creation of filtered lists and transformed dictionaries.

# Filtered list comprehension
let evens be [ for each x in 1 to 10 keep x if x mod 2 = 0 ]
show "Even numbers: \`evens\`"

# List comprehension with transformation
let squares be [ for each n in 1 to 5 keep n * n ]
show "Squares: \`squares\`"

# Dictionary comprehension
let powers be { for each n in 1 to 4 keep n: n * n * n }
show "Cubes map: \`powers\`"
`
  },
  {
    title: "Data Actions (State Mutation)",
    content: (
      <>
        <p>Moon replaces cryptic symbol reassignment with clean English action verbs:</p>
        <ul className="list-disc pl-6 my-4 space-y-2 text-slate-300">
          <li><code>set</code> to reassign variables or properties (<Tooltip word="assignment" />).</li>
          <li><code>update</code> to perform in-place arithmetic (<code>+</code>, <code>-</code>, <code>*</code>, <code>/</code>).</li>
          <li><code>add</code> to increment numbers, concatenate strings, or <Tooltip word="appends" text="append" /> items to lists!</li>
        </ul>
      </>
    ),
    code: `## DATA ACTIONS
   Expressive state mutations with 'set', 'update', and 'add'.

let hp be 100
update hp - 25
show "HP after hit: \`hp\`"

add 10 to hp
show "HP after heal: \`hp\`"

let title be "Arch"
add "mage" to title
show "Title: \`title\`"

let inventory be [ "Dagger" ]
add "Shield", "Potion" to inventory
show "Inventory: \`inventory\`"
`
  },
  {
    title: "Control Flow & Modifiers",
    content: (
      <p>Control flow in Moon uses <code>if</code>, <code>else if</code>, <code>else</code>, and <code>unless</code> (the intuitive opposite of <code>if</code>). Code can be written as multi-line blocks with <code>: ... end</code>, concise single-line statements (<code>if cond show ...</code>), or trailing postfix statement modifiers (<code>show ... if cond</code>).</p>
    ),
    code: `## CONTROL FLOW & STATEMENT MODIFIERS
   Blocks, single-line conditionals, and postfix modifiers.

let power be 85

# Multi-line block
if power >= 90:
  show "Rank: S-Class"
else if power >= 75:
  show "Rank: A-Class"
else:
  show "Rank: B-Class"
end

# Single-line if statement
if power > 50 show "Power is sufficient!"

# 'unless' is the opposite of 'if'
unless power < 50 show "Status: Combat Ready."

# Postfix statement modifiers
show "Unleashing ultimate move!" if power >= 80
show "Need more energy!" unless power >= 100
`
  },
  {
    title: "Chained Comparisons & Sticky Subjects",
    content: (
      <p>Write natural mathematical inequalities with <Tooltip word="chained comparisons" /> (like <code>50 &lt;= power &lt; 100</code>). Moon also features <Tooltip word="sticky subjects" />, automatically remembering the subject across <code>and</code> / <code>or</code> operators so you don't have to repeat variable names!</p>
    ),
    code: `## CHAINED COMPARISONS & STICKY SUBJECTS
   Mathematical chains and automatic subject retention.

let power be 75

# Chained mathematical comparison
if 50 <= power < 100:
  show "Power is within optimal operational limits."
end

let n be 7
let role be "moderator"

# Sticky subjects automatically reuse 'n'
if n > 0 and is not 10:
  show "n is positive and not equal to 10."
end

# Sticky subjects with 'or'
if role is "admin" or is "moderator":
  show "Access granted to administration console."
end
`
  },
  {
    title: "Inline Ternary Expressions",
    content: (
      <p>Need to pick a value based on a condition without writing a full <code>if/else</code> block? Moon provides fluid inline ternary expressions that read like spoken English: <code>let result be X if condition else Y</code>.</p>
    ),
    code: `## TERNARY EXPRESSIONS
   Clean inline value selection.

let score be 85
let grade be "Distinction" if score >= 80 else "Pass"
show "Result: \`grade\`"

let is_vip be true
let discount be 25 if is_vip else 0
show "Discount applied: \`discount\`%"
`
  },
  {
    title: "Loops (While, Until, For)",
    content: (
      <p>Repeat logic with <code>while</code>, <code>until</code> (runs until a condition turns true), and <code>for</code> loops. For loops support iterating over collections with <code>in</code>, numeric ranges with <code>from</code>, and automatic value &amp; index unpacking!</p>
    ),
    code: `## LOOPS
   Iterate over items, ranges, and conditions with while, until, and for.

let tick be 1
until tick > 3:
  show "Until tick: \`tick\`"
  update tick + 1
end

let hp be 15
while hp > 0:
  show "Fighting boss... HP: \`hp\`"
  update hp - 5
end

let heroes be [ "Ada", "Alan", "Grace" ]
for each hero, idx in heroes:
  show "#\`idx\`: \`hero\`"
end

for i from 10 to 30 by 10:
  show "Step: \`i\`"
end
`
  },
  {
    title: "Phrasal Functions & Union Types",
    content: (
      <p>Functions in Moon are declared as natural <Tooltip word="phrasal">phrasal</Tooltip> sentences using <code>let ... : ... give ... end</code>. Parameters can have explicit type annotations or flexible <Tooltip word="union types">Union Types</Tooltip> (e.g. <code>(val: Number or String)</code>) allowing functions to accept multiple distinct types seamlessly.</p>
    ),
    code: `## PHRASAL FUNCTIONS & UNION TYPES
   Natural phrasal signatures and flexible union types.

let greet (person: String) with title (title: String):
  give "Greetings, \`title\` \`person\`!"
end

show greet "Lovelace" with title "Lady"

# Union types: accept either Number or String
let format value (val: Number or String):
  give "Formatted: [ \`val\` ]"
end

show format value 42
show format value "Moon Language"
`
  },
  {
    title: "Infix Phrases & Custom Operators",
    content: (
      <p>Moon allows you to define custom <Tooltip word="infix">infix phrases</Tooltip> and argument-led operations where the first argument leads the expression (like <code>let (s: String) repeated (n: Number) times:</code>), providing extreme expressiveness that blends right into natural language.</p>
    ),
    code: `## INFIX PHRASES & ARGUMENT-LED OPERATORS
   Define fluid infix expressions with leading argument receivers.

let (s: String) repeated (n: Number) times:
  let result be ""
  for i from 1 to n:
    add s to result
  end
  give result
end

show "Echo! " repeated 3 times

let (s: String) is a palindrome:
  let rev be join (reverse s as List) with ""
  give s = rev
end

let word1, word2 be "racecar", "moon"
show "Is '\`word1\`' a palindrome? \`word1 is a palindrome\`"
show "Is '\`word2\`' a palindrome? \`word2 is a palindrome\`"
`
  },
  {
    title: "Type Blueprints & Object Semantics",
    content: (
      <p>Define custom structured data templates using the <code>type</code> keyword. <Tooltip word="blueprint">Blueprints</Tooltip> support default values and internal methods that access instance state using <code>my</code>. <Tooltip word="instantiate">Instantiate</Tooltip> typed objects with <code>Type {'{ property: value }'}</code>.</p>
    ),
    code: `## TYPE BLUEPRINTS
   Define prototypes with default fields and internal methods.

type Player:
  name is "Anonymous",
  health is 100,
  mana is 50,

  take damage (amount):
    set my health to my health - amount
    if my health < 0:
      set my health to 0
    end
  end
end

let hero be Player {
  name: "Artorias",
  health: 120
}

show "Hero: \`hero's name\` with \`hero's health\` HP"
hero's take damage 45
show "Hero HP after battle: \`hero's health\`"
`
  },
  {
    title: "Possessive Extension Methods",
    content: (
      <p>Add new methods and active properties to blueprints from anywhere using Moon's <Tooltip word="extension methods">possessive extension methods</Tooltip>: <code>let (receiver: Type)'s method (params): ... end</code>. These methods are invoked cleanly using the natural possessive <code>'s</code> syntax!</p>
    ),
    code: `## POSSESSIVE EXTENSION METHODS
   Extend types from outside their definition with natural 's phrasing.

type Hero:
  name is "Knight",
  health is 80
end

# Define an extension method on Hero
let (h: Hero)'s heal (amount: Number):
  set h's health to h's health + amount
  give h's health
end

# Define a boolean property extension
let (h: Hero)'s is_alive:
  give h's health > 0
end

let player be Hero { name: "Galahad", health: 40 }
show "Is player alive? \`player's is_alive\`"

player's heal 30
show "Healed \`player's name\` to \`player's health\` HP"
`
  },
  {
    title: "Type Casting & Hydration (as)",
    content: (
      <p>Explicitly convert values between types or hydrate unstructured dictionaries into typed blueprints using the <Tooltip word="type casting"><code>as</code></Tooltip> keyword (e.g. <code>"123" as Number</code>, <code>42 as String</code>, <code>rawDict as Blueprint</code>).</p>
    ),
    code: `## TYPE CASTING & BLUEPRINT HYDRATION
   Converting types and hydrating dictionaries into typed blueprints with 'as'.

let raw input be "420"
let parsed number be raw input as Number
show "Parsed + 10: \`parsed number + 10\`"

let text be 99.5 as String
show "Converted to string: " + text

type Config:
  theme is "Dark",
  volume is 80
end

let raw data be { theme: "Moonlight", volume: 100 }
let typed config be raw data as Config

show "Theme: \`typed config's theme\`, Volume: \`typed config's volume\`"
`
  },
  {
    title: "Standard Library Tour & Interactive I/O",
    content: (
      <p>Moon includes a rich standard library with built-in phrases for math, string manipulation, list operations, and the interactive <code>ask</code> command, which pauses execution to receive real-time user input in the terminal!</p>
    ),
    code: `## STANDARD LIBRARY TOUR & INTERACTIVE I/O
   Math phrases, string transformations, and the interactive 'ask' command.

# Math phrases
show "Square root of 64: \`square root of 64\`"
show "2 to power of 8: \`power of 2 to 8\`"
show "Floor of 7.89: \`floor of 7.89\`"
show "Random 1 to 10: \`random from 1 to 10\`"

# String phrases
let message be "  welcome to moon  "
show "Uppercase: \`uppercase message\`"
show "Trimmed: '\`trim message\`'"
let parts be split "apple,banana,orange" by ","
show "Split list: \`parts\`"
let rejoined be join parts with " - "
show "Joined back: \`rejoined\`"

# Interactive prompt (ASYNCIFY in browser!)
let user input be ask "What is your quest? "
show "Your quest: \`user input\`"
`
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
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12">
      <header className="mb-12 border-b border-white/10 pb-8">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">Moon Syntax Guide</h2>
        <p className="text-moon-muted text-lg md:text-xl max-w-2xl">Welcome to the definitive guide to the Moon programming language. The examples below are fully interactive!</p>
      </header>

      <div className="tutorial-content flex flex-col gap-6">
        {chapters.map((chapter, i) => (
          <details key={i} className="group bg-moon-pane border border-moon-border rounded-2xl shadow-lg transition-all" id={`chapter-${i + 1}`} open={i === 0}>
            <summary className="p-5 md:p-6 text-xl md:text-2xl font-bold text-white cursor-pointer select-none list-none flex justify-between items-center hover:bg-white/5 transition-colors group-open:rounded-t-2xl rounded-2xl">
              <span><span className="text-moon-accent mr-3">{i + 1}.</span> {chapter.title}</span>
              <span className="transform group-open:rotate-180 transition-transform text-moon-muted">▼</span>
            </summary>
            <div className="p-5 md:p-6 pt-0 border-t border-white/5 bg-[#020617]/50 mt-2 rounded-b-2xl">
              <div className="text-slate-200 text-base md:text-lg mb-8 leading-relaxed">
                {chapter.content}
              </div>
              <CodeRunner initialCode={chapter.code} />
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
