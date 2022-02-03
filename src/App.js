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

  const countryInputRef = useRef();

  useEffect(() => {
    getJSON(`https://restcountries.com/v2/name/Canada`)
      .then((data) => {
        setStartCountry(data[0]);

        getJSON(
          `http://api.weatherapi.com/v1/current.json?key=bb376e439b044a33ad4205730220202&q=${data[0].capital}&aqi=no`
        ).then((data) => setStartWeather(data));
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (!destCountry) return;

    getJSON(
      `http://api.weatherapi.com/v1/current.json?key=bb376e439b044a33ad4205730220202&q=${
        destCountry.capital.split(",")[0]
      }&aqi=no`
    ).then((data) => setDestWeather(data));

    getJSON(
      `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${startCountry.currencies[0].code.toLowerCase()}/${destCountry.currencies[0].code.toLowerCase()}.json`
    ).then((data) => {
      setExchangeRate(data[`${destCountry.currencies[0].code.toLowerCase()}`]);
    });
  }, [destCountry]);

  const searchCountry = () => {
    let country = countryInputRef.current.value;

    // When South Korea is sent to API, returns with North Korea, so need this for UX improvement to return South Korea correctly
    country =
      country.toUpperCase() === "SOUTH KOREA" ? "Korea (Republic of)" : country;

    getJSON(`https://restcountries.com/v2/name/${country}`)
      .then((data) => {
        if (!data[0])
          throw new Error(
            "Could not find country: " + countryInputRef.current.value
          );

        setDestCountry(data[0]);
      })
      .catch((err) => console.error(err));
  };

  const getJSON = (url, errMsg = "Something went wrong :(") => {
    return fetch(url).then((res) => {
      if (!res.ok) throw new Error(`${errMsg} (${res.status})`);

      return res.json();
    });
  };

  const convertCur = (e) => {
    let converted = (e.target.value * exchangeRate).toFixed(2);
    setConvertedCur(converted);
  };

  return (
    <div className="App">
      <div id="header">
        <input
          ref={countryInputRef}
          type="text"
          placeholder="Enter a Country"
        ></input>
        <button onClick={searchCountry}>Confirm</button>
      </div>
      {destWeather ? (
        <div id="country-display">
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
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
