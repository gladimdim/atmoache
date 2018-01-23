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
      <form className="mui-form">
        <legend> (ReasonReact.stringToElement("City Name")) </legend>
        <div className="mui-textfield">
          <input
            _type="text"
            value=self.state.cityName
            placeholder="Enter City Name"
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
        className="mui-btn mui-btn--raised"
        onClick=((_) => onCitySet(self.state.cityName))>
        (ReasonReact.stringToElement("Get Atmo"))
      </button>
    </div>
};
