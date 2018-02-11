type state = {cityName: string};

type action =
  | CityNameChanged(string);

let component = ReasonReact.reducerComponentWithRetainedProps("Controls");

let make = (~onCitySet, ~cityName: string, _children) => {
  ...component,
  initialState: () => {cityName: cityName},
  retainedProps: {
    cityName: cityName
  },
  didUpdate: ({newSelf, oldSelf}) => {
    if (newSelf.retainedProps.cityName != oldSelf.retainedProps.cityName) {
      newSelf.send(CityNameChanged(newSelf.retainedProps.cityName));
    };
    ();
  },
  reducer: action =>
    switch action {
    | CityNameChanged(s) => (_state => ReasonReact.Update({cityName: s}))
    },
  render: self =>
    <div className="div-container mui-container">
      <form className="mui-form">
        <legend> (ReasonReact.stringToElement("Enter City Name")) </legend>
        <div className="mui-textfield">
          <input
            _type="text"
            value=self.state.cityName
            placeholder="City Name"
            autofocus
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
