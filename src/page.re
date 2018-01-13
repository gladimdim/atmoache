type state = {
  cityName: string,
  pressures: list(float)
};

type action =
  | LoadPressure;

let component = ReasonReact.reducerComponent("Page");

let handleClick = (_event, _self) => Js.log("clicked!");

type tPressure = {pressure: float};

type tArrayPressures = {pressure: list(tPressure)};

module Decode = {
  let pressure = jsonPressure : tPressure => {
    pressure: jsonPressure |> Json.Decode.field("pressure", Json.Decode.float)
  };
  let listArray = json => json |> Json.Decode.list(pressure);
  let pressures = json : tArrayPressures =>
    Json.Decode.{pressure: json |> field("list", listArray)};
};

let make = (~message, children) => {
  ...component,
  initialState: () => {cityName: "Kyiv", pressures: []},
  reducer: (action, state) =>
    switch action {
    | LoadPressure =>
      Js.Promise.(
        Fetch.fetch(
          "http://api.openweathermap.org/data/2.5/forecast/daily?q="
          ++ state.cityName
          ++ "&cnt=7&mode=json&appid=e896545ab1632674c8cadbc58b500605"
        )
        |> then_(Fetch.Response.json)
        |> then_(json => {
             Js.log(json);
             json
             |> Decode.pressures
             |> (
               pressures => {
                 List.iter(pressure => Js.log(pressure), pressures.pressure);
                 resolve(pressures);
               }
             );
           })
        |> ignore
      );
      ReasonReact.NoUpdate;
    },
  render: self =>
    <div>
      <div>
        (ReasonReact.stringToElement(message ++ self.state.cityName))
      </div>
      <button onClick=(_event => self.send(LoadPressure))>
        (ReasonReact.stringToElement("Get Atmopressure"))
      </button>
    </div>
};
