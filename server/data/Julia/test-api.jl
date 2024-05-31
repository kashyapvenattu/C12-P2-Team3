module App
using Genie
include("julia-modules/DataCheck.jl")

module Test
function calc(data)
  result = data + 3
  return result
end

end

module API
using Genie.Requests
using Genie.Renderer.Json
using ..Test
using ..DataCheck

test() = json(:x => Test.calc(payload(:data)))


end

route("/api/test/:data::Int", API.test)

up() # start the server

end