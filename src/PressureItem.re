let component = ReasonReact.statelessComponent("PressureItem");

let calculateDiff = (diff: float) : string => {
  let red = ref(0.4588 +. (1.0 -. 0.4588) *. diff /. 10.0);
  let green = ref(0.7020);
  let blue = ref(0.6078);
  if (diff < 5.0) {
    green := green^ +. (0.8 -. green^) *. diff /. 4.0;
    blue := blue^ +. (0.6588 -. blue^) *. diff /. 10.0;
  } else {
    green := green^ -. (green^ -. 0.0235) *. diff /. 20.0;
    blue := blue^ -. (blue^ -. 0.1216) *. diff /. 20.0;
  };
  "rgb("
  ++ Js_float.toFixed(red^ *. 255.0)
  ++ ", "
  ++ Js_float.toFixed(green^ *. 255.0)
  ++ ", "
  ++ Js_float.toFixed(blue^ *. 255.0)
  ++ ")";
};

let calculateStyle = (pressure: float) : ReactDOMRe.style =>
  ReactDOMRe.Style.make(~backgroundColor=calculateDiff(pressure), ());

let make = (~pressure: float, ~date: string, _children) => {
  ...component,
  render: _self =>
    <div
      className="div-diff"
      style=(calculateStyle(Js_math.abs_float(pressure)))>
      (ReasonReact.string(date))
    </div>,
};
