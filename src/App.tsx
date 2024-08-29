import { SetStateAction, useState } from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [word, setWord] = useState("");
  const [dispWord, setDispWord] = useState("");
  // const [dispPos, setDispPos] = useState("");
  const [dispPronunciation, setDispPronunciation] = useState("");
  const [dispDefinition, setDispDefinition] = useState("");
  // const [dispExample, setDipExample] = useState("");
  console.log(word);

  const fetchMerriamData = async () => {
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Hero-Dictionary Data:", data[0]);
      setWord(" ");

      setDispWord(`${data[0].word}`);

      const prsTemplate = data?.[0]?.phonetics?.[0]?.text;
      if (typeof prsTemplate !== "undefined" && prsTemplate.trim() !== "") {
        console.log(prsTemplate);
        setDispPronunciation(prsTemplate);
      } else {
        setDispPronunciation("");
      }

      const arrDef = data[0].meanings;
      const combinedDef = arrDef.map(
        (def: {
          partOfSpeech: string;
          definitions: { example?: string; definition: string }[];
          example: string;
        }) => {
          const definition =
            def.definitions[0]?.definition || "No Definition Available";
          const example = def.definitions[0]?.example
            ? `${def.definitions[0].example}`
            : "";
          return (
            <div className="def-wrapper">
              <div key={def.partOfSpeech} className="wrapper-container">
                <span className="pos-container">{def.partOfSpeech}</span>
                <p className="ml-4">{definition}</p>
                {example && (
                  <p className="ml-5 italic text-gray-800">
                    Example: {example}
                  </p>
                )}
              </div>
            </div>
          );
        }
      );

      setDispDefinition(combinedDef);
    } catch (error) {
      console.error("Error fetching Merriam-Webster data:", error);
    }
  };

  const handleChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setWord(event.target.value);
  };
  return (
    <>
      <div className="wrapper">
        <div className="nav-wrapper">
          <input
            type="text"
            id="inputBox"
            value={word}
            placeholder="Enter a word"
            onChange={handleChange}
            className="inputField"
          />{" "}
          <button type="button" onClick={fetchMerriamData}>
            Search
          </button>
        </div>
        <FontAwesomeIcon icon={faVolumeHigh} className="text-gray-700" />
        <div className="content-wrapper">
          <h2 className="word">{dispWord}</h2>
          <p className="text-gray-400">{dispPronunciation}</p>
          <div className="p-2">
            <pre>{dispDefinition}</pre>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
