import { Modal } from "../Modal/Modal";

import "./SelectCharacterDialog.css";
import { ChangeEventHandler } from "preact/compat";
import { shuffle } from "../../utils/shuffle";
import { usePersisted } from "../../hooks/usePersistedState";

type SelectCharacterDialogProps = {
  isOpen: boolean;
  close: () => void;
};
type Setup = {
  townsfolk: number;
  outsiders: number;
  minions: number;
  demons: number;
};

const PLAYER_SETUP: Record<number, Setup> = {
  5: { townsfolk: 3, outsiders: 0, minions: 1, demons: 1 },
  6: { townsfolk: 3, outsiders: 1, minions: 1, demons: 1 },
  7: { townsfolk: 5, outsiders: 0, minions: 1, demons: 1 },
  8: { townsfolk: 5, outsiders: 1, minions: 1, demons: 1 },
  9: { townsfolk: 5, outsiders: 2, minions: 1, demons: 1 },
  10: { townsfolk: 7, outsiders: 0, minions: 2, demons: 1 },
  11: { townsfolk: 7, outsiders: 1, minions: 2, demons: 1 },
  12: { townsfolk: 7, outsiders: 2, minions: 2, demons: 1 },
  13: { townsfolk: 9, outsiders: 0, minions: 3, demons: 1 },
  14: { townsfolk: 9, outsiders: 1, minions: 3, demons: 1 },
  15: { townsfolk: 9, outsiders: 2, minions: 3, demons: 1 },
};

export const SelectCharacterDialog = (props: SelectCharacterDialogProps) => {
  const [numberOfPlayers, setNumberOfPlayers] = usePersisted("playerCount", 7);
  const [selectedCharacters, setSelectedCharacters] = usePersisted<
    Record<string, boolean>
  >("selectedCharacters", {});

  const baseSetup = PLAYER_SETUP[numberOfPlayers];

  const handleSelect = (name: string) => {
    console.log("selecting", name);
    if (selectedCharacters[name]) {
      setSelectedCharacters({ ...selectedCharacters, [name]: false });
    } else {
      setSelectedCharacters({ ...selectedCharacters, [name]: true });
    }
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    console.log("e.currentTarget:", e.currentTarget);
    setNumberOfPlayers(parseInt(e.currentTarget?.value, 10));
  };

  const randomise = () => {
    const setup = { ...baseSetup };
    const selectedCharacters: Record<string, boolean> = {};

    const demons = shuffle(DEMONS);
    for (let i = 0; i < setup.demons; i++) {
      const char = demons.pop()!;
      selectedCharacters[char] = true;
    }

    const minions = shuffle(MINIONS);
    for (let i = 0; i < setup.minions; i++) {
      const char = minions.pop()!;
      if (char === "Baron") {
        setup.outsiders += 2;
        setup.townsfolk -= 2;
      }
      selectedCharacters[char] = true;
    }

    const outsiders = shuffle(OUTSIDERS);
    for (let i = 0; i < setup.outsiders; i++) {
      const char = outsiders.pop()!;
      if (char === "Drunk") {
        setup.townsfolk += 1;
      }
      selectedCharacters[char] = true;
    }

    const townsfolk = shuffle(TOWNSFOLK);
    for (let i = 0; i < setup.townsfolk; i++) {
      const char = townsfolk.pop()!;
      selectedCharacters[char] = true;
    }

    setSelectedCharacters(selectedCharacters);
  };

  const n_demon = baseSetup.demons;
  const n_minions = baseSetup.minions;
  const n_outsiders =
    baseSetup.outsiders + (selectedCharacters["Baron"] ? 2 : 0);
  const n_town =
    baseSetup.townsfolk +
    (selectedCharacters["Baron"] ? -2 : 0) +
    (selectedCharacters["Drunk"] ? 1 : 0);

  return (
    <Modal title="Select Characters" isOpen={props.isOpen} close={props.close}>
      <label for="players-slider">Number of Players</label>
      <div class="players-slider">
        <input
          id="players-slider"
          type="range"
          min="5"
          max="20"
          value={numberOfPlayers}
          onInput={handleChange}
        ></input>
        <span class="players-display">{numberOfPlayers}</span>
      </div>
      <div class="checkbox-section">
        <input type="checkbox" id="show-abilities"></input>
        <label for="show-abilities">Show ability text</label>
      </div>
      <div class="checkbox-section">
        <input type="checkbox" id="allow-duplicates"></input>
        <label for="allow-duplicates">Allow duplicate characters</label>
      </div>
      <button class="random-button" onClick={randomise}>
        Select Random
      </button>
      Townsfolk{" "}
      {
        Object.keys(selectedCharacters).filter(
          (c) => selectedCharacters[c] && TOWNSFOLK.includes(c)
        ).length
      }{" "}
      / {n_town}
      <div class="character-select">
        {TOWNSFOLK.map((c) => (
          <Character
            name={c}
            type="townsfolk"
            selected={selectedCharacters[c]}
            onSelect={() => handleSelect(c)}
          />
        ))}
      </div>
      Outsiders{" "}
      {
        Object.keys(selectedCharacters).filter(
          (c) => selectedCharacters[c] && OUTSIDERS.includes(c)
        ).length
      }{" "}
      / {n_outsiders}
      <div class="character-select">
        {OUTSIDERS.map((c) => (
          <Character
            name={c}
            type="outsider"
            selected={selectedCharacters[c]}
            onSelect={() => handleSelect(c)}
          />
        ))}
      </div>
      Minions{" "}
      {
        Object.keys(selectedCharacters).filter(
          (c) => selectedCharacters[c] && MINIONS.includes(c)
        ).length
      }{" "}
      / {n_minions}
      <div class="character-select">
        {MINIONS.map((c) => (
          <Character
            name={c}
            type="minion"
            selected={selectedCharacters[c]}
            onSelect={() => handleSelect(c)}
          />
        ))}
      </div>
      Demon{" "}
      {
        Object.keys(selectedCharacters).filter(
          (c) => selectedCharacters[c] && DEMONS.includes(c)
        ).length
      }{" "}
      / {n_demon}
      <div class="character-select">
        {DEMONS.map((c) => (
          <Character
            name={c}
            type="demon"
            selected={selectedCharacters[c]}
            onSelect={() => handleSelect(c)}
          />
        ))}
      </div>
    </Modal>
  );
};

const TOWNSFOLK = [
  "Washerwoman",
  "Librarian",
  "Investigator",
  "Chef",
  "Empath",
  "Fortune_Teller",
  "Undertaker",
  "Monk",
  "Ravenkeeper",
  "Virgin",
  "Slayer",
  "Soldier",
  "Mayor",
];

const DEMONS = ["Imp"];
const MINIONS = ["Poisoner", "Baron", "Scarlet_Woman", "Spy"];
const OUTSIDERS = ["Drunk", "Recluse", "Saint", "Butler"];

type CharacterProps = {
  type: "townsfolk" | "outsider" | "minion" | "demon" | "traveller";
  name: string;
  onSelect: () => void;
  selected: boolean;
};

function Character(props: CharacterProps) {
  return (
    <div
      class={props.selected ? "character selected" : "character"}
      role="button"
      onClick={props.onSelect}
    >
      <img
        src={`${import.meta.env.BASE_URL}/characters/${props.type}/${
          props.name
        }.png`}
      ></img>
      <p>{props.name}</p>
    </div>
  );
}
