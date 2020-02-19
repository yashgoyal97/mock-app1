import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/iron-ajax/iron-ajax.js';

/**
 * @customElement
 * @polymer
 */
class TestApp extends PolymerElement {
  static get template() {
    return html`
      <iron-form id="myForm">
        <form>
          <paper-input id="name" name="name" label="Enter Name" allowed-pattern="[a-zA-Z]" required></paper-input>
          <paper-input id="phoneNo" name="phoneNo" label="Enter Phone No" allowed-pattern="[0-9]" maxlength="10" minlength="10" required></paper-input>
          <paper-button id="submitFormBtn" name="submitFormBtn" raised on-click="_handleSubmitForm">Submit</paper-button>
        </form>
      </iron-form>
      <iron-ajax id="ajax" on-response="_handleResponse" handle-as="json" content-type="application/json"></iron-ajax>
    `;
  }
  static get properties() {
    return {
      action: {
        type: String,
        value: 'default'
      },
      responseArray: {
        type: Array,
        value: []
      }
    };
  }

  _handleResponse(event) {
    switch (this.action) {
      case 'default':
        this.$.myForm.reset();
        this.responseArray = event.detail.response;
        console.log(this.responseArray);
        break;
    }
  }

  _handleSubmitForm() {
    if (this.$.myForm.validate()) {
      let detailObj = { name: this.$.name.value, phoneNo: this.$.phoneNo.value };
      this._makeAjaxCall(' http://localhost:3000/users', 'post', detailObj);
    }
  }


  _makeAjaxCall(url, method, postObj) {
    let ajax = this.$.ajax;
    ajax.url = url;
    ajax.method = method;
    ajax.body = postObj ? JSON.stringify(postObj) : undefined;
    ajax.generateRequest();
  }
}

window.customElements.define('test-app', TestApp);
