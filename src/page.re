type state = {cityName: string};

type action =
  | LoadPressure;

let component = ReasonReact.reducerComponent("Page");

let handleClick = (_event, _self) => Js.log("clicked!");

let make = (~message, children) => {
  ...component,
  initialState: () => {cityName: "Kyiv"},
  reducer: (action, state) =>
    switch action {
    | LoadPressure =>
      Js.log("lol" ++ state.cityName);
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
