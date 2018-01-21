type tPressure = {pressure: float};

type tListPressures = list(tPressure);

type state = {
  cityName: string,
  pressures: tListPressures
};

type action =
  | PressureLoaded(tListPressures)
  | UpdateCity(string)
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

let make = (_) => {
  ...component,
  initialState: () => {cityName: "Kyiv", pressures: []},
  reducer: (action, state) =>
    switch action {
    | UpdateCity(s) =>
      ReasonReact.UpdateWithSideEffects(
        {...state, cityName: s},
        (self => self.send(LoadPressure))
      )
    | PressureLoaded(pressures) =>
      ReasonReact.Update({pressures, cityName: state.cityName})
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
  render: self =>
    <div>
      <Controls onCitySet=(newCity => self.send(UpdateCity(newCity))) />
      <div>
        (
          self.state.pressures
          |> List.mapi((index, pressure) =>
               <div key=(string_of_int(index))>
                 (
                   ReasonReact.stringToElement(
                     string_of_float(pressure.pressure)
                   )
                 )
               </div>
             )
          |> Array.of_list
          |> ReasonReact.arrayToElement
        )
      </div>
    </div>
  /* <button onClick=(_event => self.send(LoadPressure))>
       (ReasonReact.stringToElement("Get Atmopressure"))
     </button> */
};
