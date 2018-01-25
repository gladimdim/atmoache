type state = {cityName: string};

type action =
  | CityNameChanged(string);

let component = ReasonReact.reducerComponent("Controls");

let make = (~onCitySet, _children) => {
  ...component,
  initialState: () => {cityName: "Kyiv"},
  reducer: action =>
    switch action {
    | CityNameChanged(s) => (_state => ReasonReact.Update({cityName: s}))
    },
  render: self =>
    <div className="div-container">
      <form className="mui-form">
        <legend> (ReasonReact.stringToElement("Enter City Name")) </legend>
        <div className="mui-textfield">
          <input
            _type="text"
            value=self.state.cityName
            placeholder="City Name"
            onChange=(
              event =>
                self.send(
                  CityNameChanged(
                    ReactDOMRe.domElementToObj(ReactEventRe.Form.target(event))##value
                  )
                )
            )
          />
        </div>
      </form>
      <button
        className="mui-btn mui-btn--raised mui-btn--danger"
        onClick=((_) => onCitySet(self.state.cityName))>
        (ReasonReact.stringToElement("Get Pressure Changes"))
      </button>
    </div>
};
