import React from "react";

export default function Country(props) {
  return (
    <div className="country-card">
      <h2>{props.label}</h2>
      <img
        className="flag"
        alt={props.country.name}
        src={props.country.flags.png}
      ></img>
      <h2>Capital: {props.country.capital}</h2>
      <h3>Local Time {props.weather.location.localtime.slice(-5)}</h3>
      <div className="weather">
        <h3>Current Temp: {props.weather.current.temp_c} &#176;C</h3>
        <img src={props.weather.current.condition.icon}></img>
      </div>
      <h3>
        Language: {props.country.languages[0].name}{" "}
        {props.country.languages[0].name === "English"
          ? ""
          : "(" + props.country.languages[0].nativeName + ")"}
      </h3>
      <div className="currency">
        <h1>{props.country.currencies[0].symbol}</h1>
        {props.label === "FROM" ? (
          <input onChange={props.convert} type="number"></input>
        ) : (
          <h1>{props.cur}</h1>
        )}
      </div>
    </div>
  );
}
