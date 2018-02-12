type tPressure = float;

type tArrayPressures = array(tPressure);

type state = {
  cityName: string,
  pressures: tArrayPressures,
  failed: bool,
  errorMessage: option(string)
};

type action =
  | PressureLoaded(tArrayPressures)
  | FailedToGetCity(string, string)
  | UpdateCity(string)
  | LoadPressure;

let component = ReasonReact.reducerComponent("MainApp");

module Decode = {
  let pressure = jsonPressure : tPressure =>
    jsonPressure |> Json.Decode.field("pressure", Json.Decode.float);
  let listArray = json => json |> Json.Decode.array(pressure);
  let pressures = json : tArrayPressures =>
    Array.map(
      pressure => pressure,
      json |> Json.Decode.field("list", listArray)
    );
  let success = json => {
    let result = Json.Decode.(json |> field("cod", string));
    switch result {
    | "200" => (true, "")
    | "404" => (false, Json.Decode.(json |> field("message", string)))
    | _ => raise(Not_found)
    };
  };
};

let calc = (t: tArrayPressures) : array(float) =>
  Array.mapi(
    (index, _item) =>
      switch index {
      | 0 => 0.0
      | _ => t[index] -. t[index - 1]
      },
    t
  );

let dropFirst = input =>
  if (Array.length(input) > 0) {
    Array.sub(input, 1, Array.length(input) - 1);
  } else {
    input;
  };

let indexToDate = (input: int) : string => {
  let indexToDayName = input => {
    let current = Js.Date.make();
    let dayWeek = Js.Date.getDay(current) |> int_of_float;
    let next = ref(dayWeek + input);
    if (next^ >= 7) {
      next := next^ - 7;
    } else {
      next := next^;
    };
    switch next^ {
    | 0 => "Sunday"
    | 1 => "Monday"
    | 2 => "Tuesday"
    | 3 => "Wednesday"
    | 4 => "Thursday"
    | 5 => "Friday"
    | 6 => "Saturday"
    | _ => raise(Not_found)
    };
  };
  switch input {
  | 0 => "Today"
  | 1 => "Tomorrow"
  | _ => indexToDayName(input)
  };
};

let make = (_) => {
  ...component,
  initialState: () => {
    cityName: ReasonReact.Router.dangerouslyGetInitialUrl().hash,
    pressures: [||],
    failed: false,
    errorMessage: None
  },
  subscriptions: self => [
    Sub(
      () =>
        ReasonReact.Router.watchUrl(url => self.send(UpdateCity(url.hash))),
      ReasonReact.Router.unwatchUrl
    )
  ],
  reducer: (action, state) =>
    switch action {
    | UpdateCity(s) =>
      ReasonReact.UpdateWithSideEffects(
        {...state, cityName: s},
        (
          self =>
            if (s != state.cityName) {
              ReasonReact.Router.push("/#" ++ s);
            } else {
              self.send(LoadPressure);
            }
        )
      )
    | PressureLoaded(pressures) =>
      ReasonReact.Update({
        pressures,
        cityName: state.cityName,
        failed: false,
        errorMessage: None
      })
    | LoadPressure =>
      ReasonReact.SideEffects(
        (
          self =>
            Fetch.fetch(
              "http://api.openweathermap.org/data/2.5/forecast/daily?q="
              ++ state.cityName
              ++ "&cnt=7&mode=json&appid=e896545ab1632674c8cadbc58b500605"
            )
            |> Js.Promise.then_(Fetch.Response.json)
            |> Js.Promise.then_(json => {
                 let (cityFound, message) = Decode.success(json);
                 if (cityFound) {
                   json
                   |> Decode.pressures
                   |> (
                     pressures => {
                       self.send(PressureLoaded(pressures)) |> ignore;
                       Js.Promise.resolve(pressures);
                     }
                   );
                 } else {
                   self.send(FailedToGetCity(message, self.state.cityName))
                   |> ignore;
                   Js.Promise.resolve([||]);
                 };
               })
            |> ignore
        )
      )
    | FailedToGetCity(sMessage, sCity) =>
      ReasonReact.Update({
        pressures: [||],
        failed: true,
        cityName: sCity,
        errorMessage: Some(sMessage)
      })
    },
  render: self =>
    switch self.state.errorMessage {
    | Some(v) =>
      <div>
        <Controls
          onCitySet=(newCity => self.send(UpdateCity(newCity)))
          cityName=self.state.cityName
        />
        <div className="mui-panel mui--text-danger">
          (
            ReasonReact.stringToElement(
              "Cannot find weather forecast, the error is: " ++ v
            )
          )
        </div>
      </div>
    | None =>
      <div>
        <Controls
          onCitySet=(newCity => self.send(UpdateCity(newCity)))
          cityName=self.state.cityName
        />
        <div className="mui-container">
          (
            calc(self.state.pressures)
            |> dropFirst
            |> Array.mapi((index, pressure) =>
                 <PressureItem
                   key=(string_of_int(index))
                   pressure
                   date=(indexToDate(index))
                 />
               )
            |> ReasonReact.arrayToElement
          )
        </div>
      </div>
    }
};
