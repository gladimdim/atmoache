type tPressure = {pressure: float};

type tListPressures = list(tPressure);

type state = {
  cityName: string,
  pressures: tListPressures
};

type action =
  | PressureLoaded(tListPressures)
  | LoadPressure;

let component = ReasonReact.reducerComponent("Page");

let handleClick = (_event, _self) => Js.log("clicked!");

type tStrangeType = {press: tListPressures};

module Decode = {
  let pressure = jsonPressure : tPressure => {
    pressure: jsonPressure |> Json.Decode.field("pressure", Json.Decode.float)
  };
  let listArray = json => json |> Json.Decode.list(pressure);
  let pressures = json : tListPressures =>
    List.map(
      pressure => pressure,
      Json.Decode.{press: json |> field("list", listArray)}.press
    );
};

let make = (~message, children) => {
  ...component,
  initialState: () => {cityName: "Kyiv", pressures: []},
  reducer: (action, state) =>
    switch action {
    | PressureLoaded(pressures) =>
      Js.log("Loaded: " ++ string_of_int(List.length(pressures)));
      ReasonReact.Update({pressures, cityName: state.cityName});
    | LoadPressure =>
      ReasonReact.SideEffects(
        (
          self =>
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
                       List.iter(pressure => Js.log(pressure), pressures);
                       Js.log(string_of_int(List.length(pressures)));
                       self.send(PressureLoaded(pressures)) |> ignore;
                       resolve(pressures);
                     }
                   );
                 })
              |> ignore
            )
        )
      )
    },
  render: self => {
    Js.log("LOL");
    <div>
      <div>
        (
          ReasonReact.stringToElement(
            message
            ++ "HAHA"
            ++ string_of_int(List.length(self.state.pressures))
          )
        )
      </div>
      <button onClick=(_event => self.send(LoadPressure))>
        (ReasonReact.stringToElement("Get Atmopressure"))
      </button>
    </div>;
  }
};
