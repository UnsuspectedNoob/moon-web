import CodeRunner from './CodeRunner';

export default function Tutorial() {
  return (
    <div className="tutorial-container">
      <header className="tutorial-header">
        <h2>Moon Syntax Guide</h2>
        <p>Welcome to the definitive guide to the Moon programming language. The examples below are fully interactive!</p>
      </header>

      <div className="tutorial-content">

        <section className="tutorial-chapter">
          <h3>1. Variables and Types</h3>
          <p>In Moon, variables are declared using the <code>let</code> and <code>be</code> keywords. Moon is dynamically typed, so you don't need to specify types upfront.</p>
          <CodeRunner initialCode={`let age be 27\nlet name be "Munachi"\nshow name + " is " + age + " years old."\n`} />
          <p>You can also use numbers in Decimal, Hex, or Binary formats:</p>
          <CodeRunner initialCode={`let hex be 0xFF\nlet bin be 0b1010\nshow hex\nshow bin\n`} />
        </section>

        <section className="tutorial-chapter">
          <h3>2. Strings & Interpolation</h3>
          <p>Strings are wrapped in double quotes. To inject logic into a string, wrap the expression in backticks <code>\` \`</code>.</p>
          <CodeRunner initialCode={`let number be 10\nshow "The square of \`number\` is \`number * number\`!"\n`} />
        </section>

        <section className="tutorial-chapter">
          <h3>3. Data Actions</h3>
          <p>Moon avoids arbitrary symbols for actions and relies on English verbs instead.</p>
          <ul>
            <li><code>set</code> performs assignment.</li>
            <li><code>update</code> performs in-place arithmetic (like +=).</li>
          </ul>
          <CodeRunner initialCode={`let hp be 100\nshow "Starting HP: \`hp\`"\n\nupdate hp - 20\nshow "Took 20 damage! HP is now: \`hp\`"\n\nset hp to 100\nshow "Healed back to full: \`hp\`"\n`} />
        </section>

        <section className="tutorial-chapter">
          <h3>4. Control Flow (If / Unless)</h3>
          <p>Blocks are opened with a colon <code>:</code> and must be closed with the <code>end</code> keyword.</p>
          <CodeRunner initialCode={`let stamina be 50\n\nif stamina > 70:\n  show "You can run!"\nelse if stamina > 30:\n  show "You can jog."\nelse:\n  show "You are exhausted."\nend\n`} />
        </section>

        <section className="tutorial-chapter">
          <h3>5. Loops (For Each)</h3>
          <p>Moon has loop blocks.</p>
          <CodeRunner initialCode={`let count be 1\nfor i from 1 to 5:\n  show "Count is \`count\`"\n  update count + 1\nend\n`} />
        </section>

      </div>
    </div>
  );
}
