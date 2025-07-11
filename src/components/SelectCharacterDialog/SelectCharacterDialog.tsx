import { Modal } from "../Modal/Modal";

import "./SelectCharacterDialog.css";
import { ChangeEventHandler, useState } from "preact/compat";
import { shuffle } from "../../utils/shuffle";
import { usePersisted } from "../../hooks/usePersistedState";
// import TROUBLE_BREWING from "../../data/scripts/trouble_brewing.json";
import ALL_CHARS from "../../data/all_characters.json";

type SelectCharacterDialogProps = {
  isOpen: boolean;
  close: () => void;
};

type CharType =
  | "townsfolk"
  | "outsider"
  | "minion"
  | "demon" /* | "traveller" */;

type CharacterData = {
  name: string;
  ability: string;
  setup_text?: string;
  setup_change?: { [K in CharType]?: number };
  bag_change?: { [K in CharType]?: number };
  type: CharType;
  icon: string;
  first_night: boolean;
  other_nights: boolean;
  reminders: string[];
  affects_setup: boolean;
  home_script: string;
};

export type Setup = Record<CharType, number>;

const PLAYER_SETUP: Record<number, Setup> = {
  5: { townsfolk: 3, outsider: 0, minion: 1, demon: 1 },
  6: { townsfolk: 3, outsider: 1, minion: 1, demon: 1 },
  7: { townsfolk: 5, outsider: 0, minion: 1, demon: 1 },
  8: { townsfolk: 5, outsider: 1, minion: 1, demon: 1 },
  9: { townsfolk: 5, outsider: 2, minion: 1, demon: 1 },
  10: { townsfolk: 7, outsider: 0, minion: 2, demon: 1 },
  11: { townsfolk: 7, outsider: 1, minion: 2, demon: 1 },
  12: { townsfolk: 7, outsider: 2, minion: 2, demon: 1 },
  13: { townsfolk: 9, outsider: 0, minion: 3, demon: 1 },
  14: { townsfolk: 9, outsider: 1, minion: 3, demon: 1 },
  15: { townsfolk: 9, outsider: 2, minion: 3, demon: 1 },
};

export const SelectCharacterDialog = (props: SelectCharacterDialogProps) => {
  const [numberOfPlayers, setNumberOfPlayers] = usePersisted("playerCount", 7);
  const [selectedCharacters, setSelectedCharacters] = usePersisted(
    "selectedCharacters",
    {}
  );
  const [showAbilityText, setShowAbilityText] = useState(false);

  const baseSetup = PLAYER_SETUP[numberOfPlayers];
  const [setup, setSetup] = usePersisted("setup", baseSetup);

  const handleSelect = (name: string) => {
    setSelectedCharacters({
      ...selectedCharacters,
      [name]: !selectedCharacters[name],
    });
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setNumberOfPlayers(parseInt(e.currentTarget?.value, 10));
  };

  const randomiseChars = () => {
    const [randomisedChars, adjustedSetup] = randomise(baseSetup);
    setSelectedCharacters(randomisedChars);
    setSetup(adjustedSetup);
  };

  return (
    <Modal title="Select Characters" isOpen={props.isOpen} close={props.close}>
      <label for="players-slider">Number of Players</label>
      <div class="players-slider">
        <input
          id="players-slider"
          type="range"
          min="5"
          max="15"
          value={numberOfPlayers}
          onInput={handleChange}
        ></input>
        <span class="players-display">{numberOfPlayers}</span>
      </div>
      <div class="checkbox-section">
        <input
          type="checkbox"
          id="show-abilities"
          checked={showAbilityText}
          onChange={() => setShowAbilityText(!showAbilityText)}
        ></input>
        <label for="show-abilities">Show ability text</label>
      </div>
      <div class="checkbox-section">
        <input type="checkbox" id="allow-duplicates"></input>
        <label for="allow-duplicates">Allow duplicate characters</label>
      </div>
      <button class="random-button" onClick={randomiseChars}>
        Select Random
      </button>
      <CharacterSection
        characterType={"townsfolk"}
        selectedCharacters={selectedCharacters}
        setup={setup}
        onSelectChar={handleSelect}
        showAbilityText={showAbilityText}
      />
      <CharacterSection
        characterType={"outsider"}
        selectedCharacters={selectedCharacters}
        setup={setup}
        onSelectChar={handleSelect}
        showAbilityText={showAbilityText}
      />
      <CharacterSection
        characterType={"minion"}
        selectedCharacters={selectedCharacters}
        setup={setup}
        onSelectChar={handleSelect}
        showAbilityText={showAbilityText}
      />
      <CharacterSection
        characterType={"demon"}
        selectedCharacters={selectedCharacters}
        setup={setup}
        onSelectChar={handleSelect}
        showAbilityText={showAbilityText}
      />
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

type CharacterSectionProps = {
  characterType: CharType;
  selectedCharacters: Record<string, boolean>;
  setup: Setup;
  onSelectChar: (c: string) => void;
  showAbilityText: boolean;
};

function CharacterSection({
  characterType,
  selectedCharacters,
  setup,
  onSelectChar,
  showAbilityText,
}: CharacterSectionProps) {
  const n_expected = setup[characterType];
  let title;
  switch (characterType) {
    case "townsfolk":
      title = "Townsfolk";
      break;
    case "outsider":
      title = "Outsiders";
      break;
    case "minion":
      title = "Minions";
      break;
    case "demon":
      title = "Demon";
      break;
  }

  const allChars = Object.values(
    ALL_CHARS as Record<string, CharacterData>
  ).filter((c) => c.type === characterType);

  return (
    <>
      {title}{" "}
      {
        Object.keys(selectedCharacters).filter(
          (c) => selectedCharacters[c] && allChars.find((ch) => ch.name === c)
        ).length
      }{" "}
      / {n_expected}
      <div class="character-select">
        {allChars.map((c) => (
          <Character
            character={c}
            selected={selectedCharacters[c.name]}
            onSelect={() => onSelectChar(c.name)}
            showAbilityText={showAbilityText}
          />
        ))}
      </div>
    </>
  );
}

type CharacterProps = {
  character: CharacterData;
  onSelect: () => void;
  selected: boolean;
  showAbilityText: boolean;
};

function Character(props: CharacterProps) {
  let classes = ["character", props.character.type];
  if (props.selected) classes.push("selected");
  if (props.showAbilityText) classes.push("align-left");
  return (
    <div class={classes.join(" ")} role="button" onClick={props.onSelect}>
      <div class="image-and-title">
        <img
          src={`${import.meta.env.BASE_URL}/characters/${props.character.icon}`}
          class={
            props.showAbilityText
              ? "character-icon smaller-image"
              : "character-icon"
          }
        ></img>
        <p>{props.character.name}</p>
        <p aria-hidden="true" class="hidden-bold" tabIndex={-1}>
          {props.character.name}
        </p>
      </div>
      <p class="ability-text" hidden={!props.showAbilityText}>
        {props.character.ability}
      </p>
    </div>
  );
}

function randomise(baseSetup: Setup): [Record<string, boolean>, Setup] {
  const setup = { ...baseSetup };
  const selectedCharacters: Record<string, boolean> = {};

  const demons = shuffle(DEMONS);
  for (let i = 0; i < setup.demon; i++) {
    const char = demons.pop()!;
    selectedCharacters[char] = true;
  }

  const minions = shuffle(MINIONS);
  for (let i = 0; i < setup.minion; i++) {
    const char = minions.pop()!;
    if (char === "Baron") {
      setup.outsider += 2;
      setup.townsfolk -= 2;
    }
    selectedCharacters[char] = true;
  }

  const outsiders = shuffle(OUTSIDERS);
  for (let i = 0; i < setup.outsider; i++) {
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

  return [selectedCharacters, setup];
}
