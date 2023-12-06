class RatingWidget extends HTMLElement
{
    constructor()
    {
        super();

        this.attachShadow({mode: 'open'});
    }

    connectedCallback()
    {
        this.shadowRoot.innerHTML =
        `<style>
            :host {
                display: inline-block;
                background-color: lightgray;
            }

            label {
                font-size: 2rem;
                color: gray;
                line-height: 0;
            }

            label:hover, label:has(~ label:hover) {
                color: orange;
            }

            p {
                opacity: 0;
            }

            input {
                display: none;
            }
        </style>

        <h2>Ratings Widget</h2>

        <p>Rating Message</p>

        <label for='1'>&starf;</label>
        <input id='1' type='button'></input>
        <label for='2'>&starf;</label>
        <input id='2' type='button'></input>
        <label for='3'>&starf;</label>
        <input id='3' type='button'></input>
        <label for='4'>&starf;</label>
        <input id='4' type='button'></input>
        <label for='5'>&starf;</label>
        <input id='5' type='button' value='&starf;'></input>`

        const inputElList = this.shadowRoot.querySelectorAll('input');
        const pEl = this.shadowRoot.querySelector('p');

        for (let i = 0; i < inputElList.length; i++)
        {
            inputElList[i].addEventListener('click', processRequest);
        }
        
        function processRequest(e)
        {
            const xhr = new XMLHttpRequest();
            const rating = e.target.id;

            xhr.open('POST', 'https://httpbin.org/post', true);
    
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.setRequestHeader('X-Sent-By', 'JS');
    
            xhr.onreadystatechange = () =>
            {
                if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
                {
                    console.log(xhr.responseText);
                    
                    pEl.style.opacity = 1;

                    if (rating > 3)
                    {
                        pEl.innerHTML = 'Thanks for ' + rating + ' star rating!';
                    }
                    else
                    {
                        pEl.innerHTML = `Thanks for your feedback of ` + rating + ` stars. We'll try to do better!`;
                    }
                }
                else
                {
                    if (xhr.status !== 200)
                    {
                        pEl.innerHTML = 'Unsuccessful transfer!';
                    }
                }
            };
    
            xhr.send("question=How+satisfied+are+you%3F&sentBy=JS&rating=" + rating);
        }
    }

    disconnectedCallback() {

    }
}

window.customElements.define('rating-widget', RatingWidget);