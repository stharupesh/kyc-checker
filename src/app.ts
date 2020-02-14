import express from 'express';
import axios, { AxiosError, AxiosResponse } from "axios";

const app = express();
const port = 3000;

/**
 * For calling the third party API
 */
function callAPI() {
	return axios({
		method: 'post',
		url: 'https://sandbox.ridx.io/international',
		headers: {
		token: "ba3c114b6fe336e9a558bb40b4cc2ca949d5c15eb6396fcaebdf3fa937045483",
			"Content-Type": "application/json"
		},
		data: {
			"countryCode": "AU",
			"address": {
				"addressLine1": "123 Fake Street",
				"locality": "Sydney",
				"postCode": "2000",
				"province": "NSW"
			},
			"identity": {
				"dob": "1965-01-01",
				"firstName": "John",
				"lastName": "Smith"
			}
		}
	});
}

/**
 * performs KYC checking on response
 * @param {AxiosResponse} response
 */
function performKYCCheckOnResponse(response: AxiosResponse) {
	let messages = response.data.codes.messages;

	for(let i = 0; i < messages.length; i++) {
		if(messages[i].value == "Full Match for 1+1 verification" || messages[i].value == "Full Match for 2+2 verification")
			return { KYCresult : true };
	}

	return { KYCresult : false };
}

/**
 * shows the KYC check results in the main page
 **/

app.get('/', (req, res) => {
  callAPI()
  .then((response: AxiosResponse) => {
  		res.status(200).send(performKYCCheckOnResponse(response));
	})
  .catch((error: AxiosError) => {
  	console.log(error);
	});
});

app.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});