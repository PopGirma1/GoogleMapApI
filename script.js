const input = document.getElementById("search");
const error = document.getElementById("error")
const country_information = document.getElementById("country_information")
var user_searched_country_list = $("#country-list");
var country_property_section = $("#country_property_section")

var countries_array = [];

$("#search").on('keyup', function (e) {

    e.preventDefault()
    if (e.key === 'Enter' || e.keyCode === 13) {

        // This line will grab the country from the input box
        var country = $("#search").val().trim();

        // Return from function early if submitted country is blank
        if (country === "") {
            setTimeout(function () {
                document.getElementById('error').className = 'waa';
                error.style.display = "block"
            }, 2000);

            return;
        }

        else {

            //Adding country-input to the country array
            countries_array.push(country);
            // Store updated countries_array in localStorage, re-render the list
            storecountries_array();
            returns_countries_array();

            let inputValue = input.value
            getCountryName(inputValue)
            input.value = ""
        }
    }

    else {
        setTimeout(function () {
            error.innerHTML = ""
        }, 2000);
    }
});


const getCountryName = function (countryName) {

    let headers = new Headers();

    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Origin', '*');

    fetch(`https://restcountries.com/v3.1/name/${countryName}`, {
        mode: 'cors',
        credentials: 'include',
        method: 'GET',
        headers: headers
    }).then(function (res) {


        if (!res.ok) {

            $("#right_section").empty()

            throw new Error(`country not found (${res.status})`)
        }

        return res.json();

    }).then((data) => {

        initMap(data[0])

    }).catch(error => {

        $(".country_property").empty();

        var countrie_not_found = $("<div>");

        countrie_not_found.attr("class", "countrie_not_found")

        error = $("<div>").text("Country Not Found");

        countrie_not_found.append(error)

        $(".country_property").append(countrie_not_found);

    })

}


function initMap(data) {

    if (data === undefined && data !== null) {
        getLocation()

    }

    $(".country_property").empty();

    const currency = data?.currencies
    const language = data?.languages

    // map starts here

    let lat = parseFloat(data?.latlng[0]);

    let lng = parseFloat(data?.latlng[1]);

    let country_name = data?.name.common;

    var map;

    map = new google.maps.Map(document.getElementById("right_section"), {

        center: { lat: +lat, lng: +lng },
        zoom: 10
    });

    new google.maps.Marker(
        {
            position: { lat: +lat, lng: +lng },
            map: map,
            label: country_name,
            animation: google.maps.Animation.DROP,
            draggable: true

        })

    // map ends here

    const cur = [...Object.values(currency) || {}]

    const lang = [...Object.values(language) || {}]

    // country information

    var five_day_div_container = $("<div>");

    five_day_div_container.attr("class", "country_property_section1")

    var flag = $("<img>");

    flag.attr("src", `${data?.flags.png}`)

    five_day_div_container.append(flag)

    country_name = $("<h2>").text("Country Name: " + data?.name.common);

    five_day_div_container.append(country_name)

    var currencny = $("<p>").text("Currency: " + `${cur[0]?.name ? cur[0].name : "Currency not known"}`);

    five_day_div_container.append(currencny)

    var Language = $("<p>").text("Language: " + `${lang[0] ? lang[0] : "Language not known"}`);

    five_day_div_container.append(Language)

    var Capital = $("<p>").text("Capital: " + `${data?.capital ? data.capital : "Capital City Known"}`);

    five_day_div_container.append(Capital)

    var Population = $("<p>").text("Population: " + ` ${(data?.population / 100000).toFixed(1)}`);

    five_day_div_container.append(Population)

    var Content = $("<p>").text("Continent: " + ` ${data?.continents}`);

    five_day_div_container.append(Content)


    $(".country_property").append(five_day_div_container);

}


//Calling function getCountryArrayFromLocalStorageAndReturn();
getCountryArrayFromLocalStorageAndReturn();

//Function getCountryArrayFromLocalStorageAndReturn();
function getCountryArrayFromLocalStorageAndReturn() {
    //Get stored countries_array from localStorage
    //Parsing the JSON string to an object
    var storedcountries_array = JSON.parse(localStorage.getItem("countries_array"));

    // If countries_array were retrieved from localStorage, update the countries_array array to it
    if (storedcountries_array !== null) {
        countries_array = storedcountries_array;
    }
    // Render countries_array to the DOM
    returns_countries_array();
    // console.log(countries_array);
}


//Function Storecountries_array()
function storecountries_array() {
    // Stringify and set "countries_array" key in localStorage to countries_array 
    localStorage.setItem("countrie_array", JSON.stringify(countries_array));

}

//Function returns_countries_array()
function returns_countries_array() {
    // Clear user_searched_country_list element
    // user_searched_country_list.text = "";
    // user_searched_country_list.HTML = "";
    user_searched_country_list.empty();
    country_property_section.empty()

    // Render a new li for each country
    for (var i = 0; i < countries_array.length; i++) {
        var country = countries_array[i];

        var li = $("<li>").text(country);
        li.attr("id", "listC");
        li.attr("data-country", country);
        li.attr("class", "list-group-item");

        user_searched_country_list.prepend(li);
    }
    //Get Response weather for the first country only
    if (!country) {
        return
    }
    else {
        getCountryName(country)
    };
}

//Click function to each Li 
$(document).on("click", "#listC", function () {
    var thisCountry = $(this).attr("data-country");
    getCountryName(thisCountry);
});



//display current day & time into this format by using moment js
$("#currentDay").text(moment().format("YYYY"));

// get user current location

var current_location = $("#right_section")

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        current_location.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {

    var map;

    map = new google.maps.Map(document.getElementById("right_section"), {

        center: { lat: +position.coords.latitude, lng: +position.coords.longitude },
        zoom: 10
    });

    new google.maps.Marker(
        {
            position: { lat: +position.coords.latitude, lng: +position.coords.longitude },
            map: map,
            animation: google.maps.Animation.DROP,
            draggable: true,
        })
}