import CodeRunner from './CodeRunner';

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
            <p>In Moon, variables are declared using the <code>let</code> and <code>be</code> keywords. Moon handles strings, numbers, booleans, and <code>nil</code>. You can also assign multiple variables at once.</p>
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
            <p>Strings are wrapped in double quotes. To inject logic into a string, wrap the expression in backticks <code>\` \`</code>. Moon also provides built-in phrasal math and string functions.</p>
            <CodeRunner initialCode={`let number be 10
show "The square of \`number\` is \`number * number\`!"

let random_num be random from 1 to 10
let floored be floor of(2.8)
let upper be uppercase "moon"

show "Random: \`random_num\`, Floored: \`floored\`, Upper: \`upper\`"`} />
          </div>
        </details>

        <details className="tutorial-chapter">
          <summary>3. Data Actions (State Mutation)</summary>
          <div className="chapter-content">
            <p>Moon avoids arbitrary symbols for actions and relies on English verbs instead.</p>
            <ul>
              <li><code>set</code> performs assignment.</li>
              <li><code>update</code> performs in-place arithmetic (like +=).</li>
              <li><code>add</code> appends items to lists. You can even add multiple items at once!</li>
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
          <summary>4. Control Flow & Magical Comparisons</summary>
          <div className="chapter-content">
            <p>Blocks are opened with a colon <code>:</code> and must be closed with the <code>end</code> keyword. Moon supports standard <code>if</code>, <code>else if</code>, and <code>unless</code>. It also supports <strong>chained comparisons</strong> and <strong>sticky subjects</strong>.</p>
            <CodeRunner initialCode={`let power be 50

# Chained comparisons!
if 10 < power <= 100:
  show "Power is in the sweet spot."
end

# Sticky comparisons (implied subject)
let n be 5
if n is 5:
  show "n is 5!"
end

# Ruby-esque trailing modifiers
show "Danger!" unless power > 20`} />
          </div>
        </details>

        <details className="tutorial-chapter">
          <summary>5. Loops, Unpacking, and Comprehensions</summary>
          <div className="chapter-content">
            <p>Moon provides a rich set of looping constructs. You can unpack lists or dictionaries seamlessly. Comprehensions can be written in a single line, or as multi-line blocks!</p>
            <CodeRunner initialCode={`# Functional comprehensions with sticky 'is'
let evens be [for each x in 1 to 10 keep x if x mod 2 is 0]
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
          <summary>6. Blueprints, Instantiation & Cloning</summary>
          <div className="chapter-content">
            <p>Moon uses <code>type</code> to define data blueprints. You can instantiate them using <code>with ... end</code> or the `{}` shorthand. You can even embed "active properties" (methods) right inside the type!</p>
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
          <summary>7. Phrasal Functions & Multiple Dispatch</summary>
          <div className="chapter-content">
            <p>Functions in Moon are written as natural language phrases. Even better, you can overload the exact same phrase to do different things depending on the parameter types (Multiple Dispatch)!</p>
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
          <summary>8. Advanced Slicing & Access</summary>
          <div className="chapter-content">
            <p>Moon provides incredibly clean syntax for manipulating lists. You can use <code>end</code> in slices, and even use dot-notation for quick bracketless access!</p>
            <CodeRunner initialCode={`let items be [ 10, 20, 30, 40, 50 ]

show "Items: \`items\`"
# Quick 1-indexed bracketless access
let first be items.1
show "First in items: \`first\`"

# Slicing with the 'end' keyword
let rest be items[2 to end]
show "2nd till end: \`rest\`"

# Slicing backwards
let backwards be items[end to 1]
show "Backwards: \`backwards\`"
`} />
          </div>
        </details>

      </div>
    </div>
  );
}
