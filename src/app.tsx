import { useState } from "preact/hooks";

import PWABadge from "./PWABadge.tsx";
import { SelectCharacterDialog } from "./components/SelectCharacterDialog/SelectCharacterDialog.tsx";

import "./app.css";

export function App() {
  const [state, setState] = useState({});
  const [dialog, setDialog] = useState<Dialog>(null);

  return (
    <>
      <h1>Clocktower Companion</h1>
      <SetupCard state={state} openDialog={dialog} setDialog={setDialog} />
      <details class="card">
        <summary>Grimoire</summary>
      </details>
      <details class="card">
        <summary>Jinxes</summary>
      </details>
      <details class="card">
        <summary>Night Order</summary>
      </details>
      <details class="card">
        <summary>Info Tokens</summary>
      </details>
      <details class="card">
        <summary>Storyteller Notes</summary>
      </details>
      <details class="card">
        <summary>Acknowledgements</summary>
        <p>Based on Pocket Grimoire</p>
      </details>
      <SelectCharacterDialog
        isOpen={dialog === "choose-characters"}
        close={() => setDialog(null)}
      />
      <PWABadge />
    </>
  );
}

type Dialog = "choose-characters" | null;

type CardProps = {
  openDialog: Dialog;
  setDialog: (d: Dialog) => void;
  state: {};
};

function SetupCard(props: CardProps) {
  return (
    <details class="card">
      <summary>Setup</summary>
      <div class="buttons">
        <button>Choose Script</button>
        <button onClick={() => props.setDialog("choose-characters")}>
          Choose Characters
        </button>
        <button>Character Sheet</button>
        <button>Reset</button>
      </div>
      <div class="language-selection">
        <span class="language-icon" aria-hidden="true">
          🌍
        </span>
        <select
          id="language-select"
          name="language"
          aria-label="Select Language"
        >
          <option value="EN-GB" selected>
            English
          </option>
          <option value="XX-XX">Bahasa Indonesia</option>
        </select>
        <input type="submit">✔️</input>
      </div>
    </details>
  );
}
