import express from 'express';
import axios, { AxiosError, AxiosResponse } from "axios";

const app = express();
const port = 3000;

/**
 * For calling the third party API
 */
function callAPI(requestData) {
	return axios({
		method: 'post',
		url: 'https://sandbox.ridx.io/international',
		headers: {
		token: "ba3c114b6fe336e9a558bb40b4cc2ca949d5c15eb6396fcaebdf3fa937045483",
			"Content-Type": "application/json"
		},
		data: requestData
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
 * Main function required for the excercise
 * This functions retuns a Promise which contains {"KYCresult":true} or {"KYCresult":false}
 * As the function uses async method that is calling the API, the Promise object 
 * has been used to return the KYC check result.
 * @param {String} addressLine1 [description]
 * @param {String} city         [description]
 * @param {Number} postCode     [description]
 * @param {String} state        [description]
 * @param {String} dateOfBirth  [description]
 * @param {String} firstName    [description]
 * @param {String} lastName     [description]
 */
function main(addressLine1: String, city: String, postCode: Number, state: String, dateOfBirth: String, firstName: String, lastName: String) : Promise<Object> {
	let data = {
			"countryCode": "AU",
			"address": {
				"addressLine1": addressLine1,
				"locality": city,
				"postCode": postCode,
				"province": state
			},
			"identity": {
				"dob": dateOfBirth,
				"firstName": firstName,
				"lastName": lastName
			}
		};
	
	return new Promise(function(resolve, reject) {
    	// performing async job (calling API)

		callAPI(data)
		.then((response: AxiosResponse) => {
		  	resolve(performKYCCheckOnResponse(response));
		})
		.catch((error: AxiosError) => {
		  	reject(error);
		});
    });
}

/**
 * shows the KYC check results in the main page
 **/

app.get('/', (req, res) => {
	main("123 Fake Street", "Sydney", 2000, "NSW", "1965-01-01", "John", "Smith") // testing
	.then(function(result) {
		res.status(200).send(result);
	}, function(error) {
		console.log(error);
	})
});

app.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});