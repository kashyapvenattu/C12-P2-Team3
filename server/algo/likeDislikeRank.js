//import {Client} from "@googlemaps/google-maps-services-js";
//TODO: get json file from google api
//TODO: get transit number from google api
//TODO: integerate those into logic below

//for now, try with dummy data

//simulated data from google-api

/*
const dummy = {
    step1: {
        route: "68",
        time: "2100"
    },
    step2: {
        route: "301",
        time: "1620"
    },
    step3: {
        route: "202",
        time: "3020"
    }
}

*/


//simulated data from user selection.

// const userSelection = ["like", "dislike", "neutral"]

/* 
const userSelection1 = ["like", "like", "dislike"]
const userSelection2 = ["neutral", "dislike", "dislike"]
const userSelection3 = ["dislike", "neutral", "like"]
const userSelection4 = ["like", "neutral", "neutral"]
const userSelection5 = ["like", "dislike", "dislike"]
*/

/*
In final file, we will have to have an onClick() function that updates 
elements of an array with "like" or "dislike". If the button belongs to the 
first displayed route, add the selection to array[0]. If the button belongs 
to the second displayed route, add the selection to array[1], and so on.
The default values of the array will be a string with "neither" in it.
"neither" will not change the value of the rank.
*/

// function to match the array with the route
function likeDislikeMatch(routes, userSelection) {
    let key = Object.keys(routes)
    let routeArray = []
    let timeArray = []
    let timeDisplayArray = []
    let matchingArray = []

    for(let i=0; i <= routes.routes.length-1; i++) {
        routeArray.push(routes.routes[i].summary)
        timeArray.push(routes.routes[i].legs[0].duration.value)
        timeDisplayArray.push(routes.routes[i].legs[0].duration.text)
     }
    // routeArray.push(routes.routes[i].summary) //used [] notation to allow the use of key[i]
    // timeArray.push(routes[key[i]].time)

    // for (let i=0; i <= key.length-1; i++) {
    //     intermediateRouteArray = []
    // }

    console.log(routeArray)
    for (let i=0; i <= userSelection.length-1; i++) {
        matchingArray.push({name: routeArray[i], like: userSelection[i], time: timeArray[i], timeDisplay: timeDisplayArray[i]})
    }

    return matchingArray
}

//let match = likeDislikeMatch(dummy, userSelection4)
//console.log("not sorted array:",match)

/*
Function to rank the matching array returned from the last function. First by time, then by likes/dislikes.
Doing it this way ensures that we correctly rank likes/dislikes, as well as maintain correct time order (less time to more),
within each like, netural, and dislike. In other words, multiple likes, neutrals, and dislikes will be ordered by time.
*/
function rank(matchingArray) {
    //sort by time
    let sortedTime = []
    sortedTime = matchingArray.sort((a,b) => {
        return a.time - b.time
    })

    //now, sort by likes/dislike
    let likeValues = {like: -1, neutral: 0, dislike: 1} // -1 for like, because returning a negative number for sort moves up the element in the array
    let sortedArray = []
    sortedArray = sortedTime.sort((a,b) => {
        return likeValues[a.like]-likeValues[b.like]
    })

    //console.log("final sorted array: ", sortedArray)
    return sortedArray
}

//rank(match)

export default {likeDislikeMatch, rank}