type state = {cityName: string};

type action =
  | CityNameChanged(string);

let component = ReasonReact.reducerComponent("Controls");

let make = (~onCitySet, _children) => {
  ...component,
  initialState: () => {cityName: "Kyiv"},
  reducer: action =>
    switch action {
    | CityNameChanged(s) => (state => ReasonReact.Update({cityName: s}))
    },
  render: self =>
    <div>
      <input
        _type="text"
        value=self.state.cityName
        onChange=(
          event =>
            self.send(
              CityNameChanged(
                ReactDOMRe.domElementToObj(ReactEventRe.Form.target(event))##value
              )
            )
        )
      />
      <button onClick=((_) => onCitySet(self.state.cityName))>
        (ReasonReact.stringToElement("Get Atmo"))
      </button>
    </div>
};
