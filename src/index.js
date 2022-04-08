import { GiphyFetch } from "@giphy/js-fetch-api";
import { Grid, Gif } from "@giphy/react-components";
import React, { useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import clsx from "clsx";
import ContentEditable from "react-contenteditable";

function App() {
  const [value, setValue] = useState("");
  const [trend, setTrend] = useState(false);
  const [search, setSearch] = useState(false);
  const [sendlGif, setSendGif] = useState([]);
  const [date, setDate] = useState(new Date());
  const gifRef = useRef();
  const giphyFetch = new GiphyFetch("sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh"),
    trendGifs = (offset: number) =>
      giphyFetch.trending({
        offset,
        limit: 10
      }),
    searchGifs = (offset: number) =>
      giphyFetch.search(value.replace("/gif"), {
        offset,
        limit: 10
      });

  const classGrid = clsx({
    grid: true,
    show: trend === true || search === true
  });

  function handleGifClick(gif, e) {
    e.preventDefault();
    setSendGif([...sendlGif, gif]);
    setTrend(false);
    setSearch(false);
    setValue("");
    gifRef.current.scrollIntoView({ behavior: "smooth" });
  }

  function handleChangeInput(e) {
    setValue(e.target.value);
    if (e.target.value.startsWith("/gif") && e.target.value.length <= 4) {
      setTrend(true);
      setSearch(false);
    } else if (e.target.value.startsWith("/gif") && e.target.value.length > 5) {
      setTrend(false);
      setSearch(true);
    } else {
      setTrend(false);
      setSearch(false);
    }
  }

  const item = sendlGif.map((gif) => (
    <li className="gif-message">
      <Gif
        className="gif"
        gif={gif}
        width={322}
        hideAttribution="false"
        noLink="false"
      />
      <span className="gif-message__data">
        {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </span>
    </li>
  ));

  return (
    <div className="wrapper">
      <div className="page">
        <ul className="message-wrapp">
          {sendlGif && item}
          <div ref={gifRef}> </div>
        </ul>
        <Grid
          className={classGrid}
          fetchGifs={trend ? trendGifs : searchGifs}
          width={380}
          columns={3}
          gutter={3}
          key={value}
          borderRadius={9}
          onGifClick={handleGifClick}
          hideAttribution="false"
          loader={null}
        />
      </div>
      <ContentEditable
        className="text-area"
        html={value}
        disabled={false}
        onChange={handleChangeInput}
      />
    </div>
  );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App tab="home" />);
