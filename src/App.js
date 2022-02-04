import { useState, useRef, useEffect } from "react";
import Country from "./Country";
import "./App.css";

function App() {
  const [startCountry, setStartCountry] = useState();
  const [destCountry, setDestCountry] = useState();
  const [startWeather, setStartWeather] = useState();
  const [destWeather, setDestWeather] = useState();
  const [exchangeRate, setExchangeRate] = useState(1);
  const [convertedCur, setConvertedCur] = useState(0);

  const startCountryInputRef = useRef();
  const destCountryInputRef = useRef();

  useEffect(() => {
    getJSON(`https://restcountries.com/v2/name/Canada`)
      .then((data) => {
        setStartCountry(data[0]);

        getJSON(
          `http://api.weatherapi.com/v1/current.json?key=bb376e439b044a33ad4205730220202&q=${data[0].capital}&aqi=no`
        ).then((data) => setStartWeather(data));
      })
      .catch((err) => renderError(`${err}`));
  }, []);

  useEffect(() => {
    if (!destCountry) return;

    getJSON(
      `http://api.weatherapi.com/v1/current.json?key=bb376e439b044a33ad4205730220202&q=${
        destCountry.capital.split(",")[0]
      }&aqi=no`
    )
      .then((data) => setDestWeather(data))
      .catch((err) => renderError(`${err}`));

    getJSON(
      `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${startCountry.currencies[0].code.toLowerCase()}/${destCountry.currencies[0].code.toLowerCase()}.json`
    )
      .then((data) => {
        setExchangeRate(
          data[`${destCountry.currencies[0].code.toLowerCase()}`]
        );
      })
      .catch((err) => renderError(`${err}`));
  }, [destCountry]);

  const searchCountry = () => {
    let startCountry = startCountryInputRef.current.value;
    let destCountry = destCountryInputRef.current.value;

    // When South Korea is sent to API, returns with North Korea, so need this for UX improvement to return South Korea correctly
    startCountry =
      startCountry.toUpperCase() === "SOUTH KOREA"
        ? "Korea (Republic of)"
        : startCountry;
    destCountry =
      destCountry.toUpperCase() === "SOUTH KOREA"
        ? "Korea (Republic of)"
        : destCountry;

    if (startCountry) {
      getJSON(`https://restcountries.com/v2/name/${startCountry}`)
        .then((data) => {
          if (!data[0])
            throw new Error(
              "Could not find country: " + startCountryInputRef.current.value
            );

          setStartCountry(data[0]);
        })
        .catch((err) => renderError(`${err}`));
    }

    if (destCountry) {
      getJSON(`https://restcountries.com/v2/name/${destCountry}`)
        .then((data) => {
          if (!data[0])
            throw new Error(
              "Could not find country: " + destCountryInputRef.current.value
            );

          setDestCountry(data[0]);
        })
        .catch((err) => renderError(`${err}`));
    }
  };

  const getJSON = (url, errMsg = "Something went wrong ") => {
    return fetch(url).then((res) => {
      if (!res.ok) throw new Error(`${errMsg} (${res.status})`);

      return res.json();
    });
  };

  const convertCur = (e) => {
    let converted = (e.target.value * exchangeRate).toFixed(2);
    setConvertedCur(converted);
  };

  const renderError = (msg) => {
    alert(msg);
  };

  return (
    <div className="App">
      <div id="header">
        <div id="inputs">
          <input
            className="countryInput"
            ref={startCountryInputRef}
            type="text"
            placeholder="Enter Starting Country"
          ></input>
          <input
            className="countryInput"
            ref={destCountryInputRef}
            type="text"
            placeholder="Enter Destination Country"
          ></input>
        </div>
        <button id="confirm-btn" onClick={searchCountry}>
          Confirm
        </button>
      </div>
      <div id="country-display">
        {destWeather ? (
          <>
            <Country
              label="FROM"
              weather={startWeather}
              country={startCountry}
              cur={null}
              convert={convertCur}
            />
            <Country
              label="TO"
              weather={destWeather}
              country={destCountry}
              cur={convertedCur}
            />
          </>
        ) : (
          <h1>Please Enter a Destination</h1>
        )}
      </div>
    </div>
  );
}

export default App;
