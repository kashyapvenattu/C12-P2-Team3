module DataCheck

export DataCheck

import JSON3

#=
Wraping JSON3 functions into our own to 
make it easier to read and write json
=#
function json_read(path::String)
    json_string = read(path, String)
    return JSON3.read(json_string, Dict{})
end

function json_write(name, path::String)
    open(path, "w") do io
        JSON3.pretty(io, name)
    end
end      

#function transit_flag

#=
Will check if transit data is the same
or if something has changed.
will then clean up data folder by removing
new transit data if there is not a change,
or, if there is a change, then it will
remove the old transit data, and rename
it to "transit.json" to avoid any
confusion going further.
=#

og = json_read("./data/transit.json")
copy = json_read("./data/transit copy.json")
print(og)

function transit_change(transit_old, transit_new)
    if transit_old == transit_new
        #remove transit_new from directory
        rm("./data/transit_new.json")
        transit = transit_old
    else
        #remove unchanged file from directory.
        #rename transit_new to transit
        rm("./data/transit.json")
        mv("./data/transit_new.json","./data/transit.json")
        transit = transit_new
    end
    return transit
end

#end for module
end