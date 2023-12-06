class RatingWidget extends HTMLElement
{
    constructor()
    {
        super();

        this.attachShadow({mode: 'open'});
    }

    connectedCallback()
    {
        // basic styling
        this.shadowRoot.innerHTML =
        `<style>
            h2 {
                margin: 0;
            }

            p {
                opacity: 0;
            }

            div {
                display: flex;
                flex-flow: row nowrap;
                justify-content: center;
            }

            label {
                font-size: 2rem;
                color: var(--rating-def-color, #808080);
            }

            label:hover, label:has(~ label:hover) {
                color: var(--rating-hover-color, yellow);
            }

            input {
                display: none;
            }
        </style>

        <h2>Rating Widget</h2>

        <p>Rating Message</p>

        <div>
            <label for='1'>&starf;</label>
            <input id='1' type='button'></input>
            <label for='2'>&starf;</label>
            <input id='2' type='button'></input>
            <label for='3'>&starf;</label>
            <input id='3' type='button'></input>
            <label for='4'>&starf;</label>
            <input id='4' type='button'></input>
            <label for='5'>&starf;</label>
            <input id='5' type='button'></input>
        </div>`

        const shadow = this.shadowRoot;
        const inputElList = shadow.querySelectorAll('input');
        const pEl = shadow.querySelector('p');

        // add event listeners to every button input
        for (let i = 0; i < inputElList.length; i++)
        {
            inputElList[i].addEventListener('click', processRequest);
        }
        
        // function for web requests
        function processRequest(e)
        {
            const xhr = new XMLHttpRequest();
            const rating = e.target.id;

            // send POST request to httpbin
            xhr.open('POST', 'https://httpbin.org/post', true);

            // set content-type to form default, set custom header to JS
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.setRequestHeader('X-Sent-By', 'JS');
    
            xhr.onreadystatechange = () =>
            {
                // show the feedback message
                pEl.style.opacity = 1;

                // check for success
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
                {
                    // echo response
                    console.log(xhr.responseText);

                    // check if rating >= 80% and respond accordingly
                    if (rating > 3)
                    {
                        pEl.innerHTML = 'Thanks for ' + rating + ' star rating!';
                    }
                    else
                    {
                        pEl.innerHTML = `Thanks for your feedback of ` + rating + ` stars. We'll try to do better!`;
                    }

                    // remove the stars
                    shadow.removeChild(shadow.lastChild);
                }
                else
                {
                    // indicate that an error occurred
                    if (xhr.status !== 200)
                    {
                        pEl.innerHTML = 'Error Occurred!';
                    }
                }
            };
    
            // send the request with the query string
            xhr.send("question=How+satisfied+are+you%3F&sentBy=JS&rating=" + rating);
        }
        
    }

    // echo message on widget deletion
    disconnectedCallback() {
        console.log('Ratings Widget deleted!');
    }
}

class WeatherWidget extends HTMLElement
{
    constructor()
    {
        super();

        this.attachShadow({mode: 'open'});
    }

    connectedCallback()
    {
        // basic styling
        this.shadowRoot.innerHTML =
        `<style>
            h2 {
                margin: 0;
            }
        </style>

        <h2>Current Weather</h2>

        <p>Weather</p>`

        const shadow = this.shadowRoot;
        const pEl = shadow.querySelector('p');
        const xhr = new XMLHttpRequest();

        // send GET request to weather API
        xhr.open('GET', 'https://api.weather.gov/points/32.84,-117.24', true);

        xhr.onreadystatechange = () =>
        {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
            {
                // echo response
                console.log(xhr.responseText);

                const link = JSON.parse(xhr.responseText);
                const xhr2 = new XMLHttpRequest();

                // send GET request to a link provided by the API
                xhr2.open('GET', link['properties']['forecastHourly'], true);

                xhr2.onreadystatechange = () =>
                {
                    // show the feedback message
                    pEl.style.opacity = 1;

                    // check for success
                    if (xhr2.readyState === XMLHttpRequest.DONE && xhr2.status === 200)
                    {
                        // echo response
                        console.log(xhr2.responseText);

                        // parse the JSON for specific weather data of the current hour
                        const data = JSON.parse(xhr2.responseText);
                        const currentHour = data['properties']['periods'][0];

                        let icon;

                        // display certain character entity icon based on the weather condition (very basic)
                        if (currentHour['shortForecast'].includes('Funnel') || currentHour['shortForecast'].includes('Tornado') || currentHour['shortForecast'].includes('Hurricane')
                        || currentHour['shortForecast'].includes('Tropical') || currentHour['shortForecast'].includes('Dust') || currentHour['shortForecast'].includes('Sand')
                        || currentHour['shortForecast'].includes('Smoke') || currentHour['shortForecast'].includes('Haze') || currentHour['shortForecast'].includes('Hot')
                        || currentHour['shortForecast'].includes('Cold') || currentHour['shortForecast'].includes('Blizzard'))
                        {
                            icon = '&#9888; ';
                        }
                        else
                        {
                            if (currentHour['shortForecast'].includes('Cloud') || currentHour['shortForecast'].includes('Overcast'))
                            {
                                icon = '&#9729; ';
                            }
                            else
                            {
                                if (currentHour['shortForecast'].includes('Thunderstorm'))
                                {
                                    icon = '&#9928; ';
                                }
                                else
                                {
                                    if (currentHour['shortForecast'].includes('Snow') || currentHour['shortForecast'].includes('Pellet') || currentHour['shortForecast'].includes('Hail') || currentHour['shortForecast'].includes('Ice'))
                                    {
                                        icon = '&#10054; ';
                                    }
                                    else
                                    {
                                        if (currentHour['shortForecast'].includes('Rain') || currentHour['shortForecast'].includes('Drizzle') || currentHour['shortForecast'].includes('Showers'))
                                        {
                                            icon = '&#9926; ';
                                        }
                                        else
                                        {
                                            if (currentHour['shortForecast'].includes('Cloud'))
                                            {
                                                icon = '&#9729; ';
                                            }
                                            else
                                            {
                                                if (currentHour['shortForecast'].includes('Fog'))
                                                {
                                                    icon = '&#127787; ';
                                                }
                                                else
                                                {
                                                    const time = Number(currentHour['startTime'].split('T')[1].split(':')[0]);

                                                    if (time > 6 && time < 17)
                                                    {
                                                        icon = '&#9728; ';
                                                    }
                                                    else
                                                    {
                                                        icon = '&#9790; ';
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        
                        // set the text to be the weather
                        pEl.innerHTML = icon + currentHour['shortForecast'] + ' ' + currentHour['temperature'] + '&deg;' + currentHour['temperatureUnit'];
                    }
                    else
                    {
                        // indicate that an error occurred
                        if (xhr2.status !== 200)
                        {
                            pEl.innerHTML = 'Error Occurred!';
                        }
                    }
                };

                // send the request with no body
                xhr2.send();
            }
            else
            {
                // indicate that an error occurred
                if (xhr.status !== 200)
                {
                    pEl.innerHTML = 'Error Occurred!';
                }
            }
        };

        // send the request
        xhr.send();   
    }

    // echo message on widget deletion
    disconnectedCallback() {
        console.log('Weather Widget deleted!');
    }
}

// define the custom elements based on the classes
window.customElements.define('rating-widget', RatingWidget);
window.customElements.define('weather-widget', WeatherWidget);