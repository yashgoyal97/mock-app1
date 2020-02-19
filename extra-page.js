import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@vaadin/vaadin-date-picker/vaadin-date-picker.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-radio-button/paper-radio-button.js';
import '@polymer/paper-radio-group/paper-radio-group.js';
import '@polymer/paper-slider/paper-slider.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/app-route/app-location.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';


/**
 * @customElement
 * @polymer
 */
class HomePage extends PolymerElement {
    static get template() {
        return html`
    <style>
      .container{
        display:grid;
        grid-template-rows:2fr 8fr;
        grid-template-columns:1fr 9fr;
        grid-template-areas:"h h" "f m";
        grid-gap:5px;
      }
      .header{
        grid-area:h;
        display:flex;
        flex-direction:row;
        justify-content:center;
        align-items:baseline;
        border:2px solid;
      }
      paper-input{
          width:90px;
      }
      .filter{
        grid-area:f;
        border:2px solid;
        padding:15px;
      }
      .main{
        grid-area:m;
        border:2px solid;
      }
      .option{
        margin-right:10px;
      }
      paper-card{
          display:flex;
          flex-direction:row;
          width:700px;
          margin-left:50px;
      }
    </style>

    <app-location route="{{route}}"></app-location>
    <div class="container">
    <div class="header">
        <div id="options">
        <iron-form id="form">            
            <paper-dropdown-menu label="From" class="option" on-selected-item-changed="_handleFromLocation" id="from" >
            <paper-listbox slot="dropdown-content">
            <template is="dom-repeat" items={{locations}}>
                <paper-item value={{item}}>{{item.locationName}}</paper-item>
            </template>
            </paper-listbox>
            </paper-dropdown-menu>

            <paper-dropdown-menu label="To" class="option" on-selected-item-changed="_handleToLocation" id="from" >
            <paper-listbox slot="dropdown-content">
            <template is="dom-repeat" items={{locations}}>
                <paper-item value={{item}}>{{item.locationName}}</paper-item>
            </template>
            </paper-listbox>
            </paper-dropdown-menu>

            <vaadin-date-picker label="Departure Date" placeholder="Pick a date" class="option" id="departDate"></vaadin-date-picker>

            <paper-dropdown-menu label="No of seats" class="option" id="noOfSeats">
            <paper-listbox slot="dropdown-content" selected="0">
                <paper-item>1</paper-item>
                <paper-item>2</paper-item>
                <paper-item>3</paper-item>
                <paper-item>4</paper-item>
            </paper-listbox>
            </paper-dropdown-menu>

            <paper-dropdown-menu label="Class" class="option" id="flightClass" >
            <paper-listbox slot="dropdown-content" selected="0">
            <paper-item>economy</paper-item> 
            <paper-item>business</paper-item>                  
            </paper-listbox>
            </paper-dropdown-menu>

            <paper-button on-click="_handleSubmitOptions">GO</paper-button>

        </iron-form>

        </div>

        <div id="myTicket">
        <input type="text" name="yourTicket" id="yourTicket" placeholder="View your ticket"><iron-icon icon="send"></iron-icon>
        </div>

    </div>
    <div class="filter">

        <paper-dropdown-menu label="Company" class="option" on-selected-item-changed="_handleFlightCompany" id="companyId" >
            <paper-listbox slot="dropdown-content">
            <template is="dom-repeat" items={{companyList}}>
                <paper-item value={{item}}>{{item.companyName}}</paper-item>
            </template>
            </paper-listbox>
            </paper-dropdown-menu>
        

        <div>Price: <span id="priceLabel" class="caption"></span></div><br>
        <paper-slider id="price" pin snaps min="1000" max="10000" step="100" on-change="_handlePriceFilter"></paper-slider>
    </div>
    <paper-button on-click="_filterFlights">FILTER</paper-button>
    <div class="main">
        
    <template is="dom-repeat" items={{flightList}}>
    <paper-card>
        <div class="card-content">
        Company Name:{{item.companyName}}<br>
        Date:{{item.date}}<br>
        Arrival Time:{{item.arrivalTime}}<br>
        Departure Time:{{item.departureTime}}<br>
        From Location: {{item.fromLocation}}<br>
        To Location:{{item.toLocation}}<br>
        Business Class Price:{{item.businessPrice}}<br>
        Economy Class Price:{{item.economyPrice}}
        </div>
        <div class="card-actions">
            <paper-button on-click="_handleBookTicket">BOOK</paper-button>
        </div>
    </paper-card>
    </template>
    </div>
    </div>
    <iron-ajax id="ajax" handle-as="json" content-type="application/json"></iron-ajax>
    `;
    }
    static get properties() {
        return {
            action: {
                type: String,
                value: 'List'
            },
            flightList: {
                type: Array,
                value: []
            },
            fromLocationId: String,
            toLocationId: String,
            price: Number,
            companyId: Number,
            locations: {
                type: Array,
                value: []
            },
            companyList: {
                type: Array,
                value: []
            }
        };
    }

    connectedCallback() {
        super.connectedCallback();
        let companyReq = (this._getAjaxConfig('http://localhost:3000/company', 'get')).generateRequest();
        let locationReq = (this._getAjaxConfig('http://10.117.189.177:8087/flightbooking/locations', 'get')).generateRequest();

        let thisContext = this;
        Promise.all([companyReq.completes, locationReq.completes]).then(function (requests) {
            thisContext.companyList = requests[0].response;
            thisContext.locations = requests[1].response;
        });
    }
    _getAjaxConfig(url, method) {
        let ajax = this.$.ajax;
        ajax.url = url;
        ajax.method = method;
        return ajax;
    }

    _postAjaxConfig(url, method, postObj) {
        let ajax = this.$.ajax;
        ajax.url = url;
        ajax.method = method;
        ajax.body = postObj ? JSON.stringify(postObj) : undefined;
        return ajax;
    }


    _handleResponse(event) {
        console.log(this.action, event.detail.response);
        switch (this.action) {
            case 'List':
                this.flightList = event.detail.reponse;
                break;

            default: break;
        }
    }

    _handleFlightCompany(event) {
        if (event.target.selectedItem) {
            this.companyId = event.target.selectedItem.value.companyId;
        }
    }

    _handleSubmitOptions() {
        let flightRequestDto = { date: this.$.departDate.value, fromLocationId: this.fromLocationId, toLocationId: this.toLocationId, noOfSeats:parseInt(this.$.noOfSeats.value), flightClass:this.$.flightClass.value}
        let optionReq = (this._postAjaxConfig('http://10.117.189.177:8087/flightbooking/flights', 'post', flightRequestDto)).generateRequest();
        let thisContext = this;
        Promise.all([optionReq.completes]).then(function (requests) {
            thisContext.flightList = requests[0].response;
            console.log(requests[0].response)
         });
    }

    _handleFromLocation(event) {
        if (event.target.selectedItem) {
            console.log(event.target.selectedItem.value.locationName);
            this.fromLocationId = event.target.selectedItem.value.locationId;
        }
    }

    _handleToLocation(event) {
        if (event.target.selectedItem) {
            this.toLocationId = event.target.selectedItem.value.locationId;
        }
    }

    /**
     * 
     */
    _handleBookTicket() {
        this.set('route.path', '/user');
    }

    //function to display the price value selected by paper-slider
    _handlePriceFilter() {
        let price = this.shadowRoot.querySelector('#price');
        console.log(price.value)
        this.shadowRoot.querySelector('#priceLabel').innerHTML = price.value;
        this.price = price.value;
    }

    /**
     * 
     * @param {*} url 
     * @param {*} method 
     * @param {*} postObj 
     */
    _makeAjax(action, url, method, postObj) {
        this.action = action;
        let ajax = this.$.ajax;
        ajax.url = url;
        ajax.method = method;
        ajax.body = postObj ? JSON.stringify(postObj) : undefined;
        ajax.generateRequest();
    }

}

window.customElements.define('home-page', HomePage);
