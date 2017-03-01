#r "../node_modules/fable-core/Fable.Core.dll"
open Fable.Core
open Fable.Import.Browser
let greeting = "Dima"
let city = document.getElementById("city")
printfn "got city %s" (city.getAttribute "value")
city.setAttribute ("value", "New York")
let () = printfn "got city %s" (city.getAttribute "value")