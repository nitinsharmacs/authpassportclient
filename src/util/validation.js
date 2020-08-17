export const validator = (value, rules) => {
	
	let valid = true;
	let result = {
		...rules
	}
	if(rules['isRequired']){
		let res = value !== '';
		result['isRequired'].valid = res;
		valid = valid&&res;
	}
	if(rules['lowerCase']){
		const regex = /[a-z]/;
		let res;
		res = regex.test(value);
		result['lowerCase'].valid = res;
		valid = valid&&res;

	}
	if(rules['upperCase']){
		const regex = /[A-Z]/;
		let res;
		res = regex.test(value);
		result['upperCase'].valid = res;
		valid = valid&&res;
	}
	if(rules['noSpace']){
		const regex = / /;
		let res = regex.test(value);
		result['noSpace'].valid = !res;
		valid = valid&&!res
	}
	if(rules['minLength']){
		let res;
		res = value.length >= rules['minLength'].value;
		result['minLength'].valid = res;
		valid = valid&&res;
	}
	if(rules['maxLength']){
		let res;
		res = value.length <= rules['maxLength'].value;
		result['maxLength'].valid = res;
		valid = valid&&res;
	}
	if(rules['isEmail']){
		const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
		let res;
	    res = pattern.test(value);
	    result['isEmail'].valid = res;
	    valid = valid&&res;
	}
	if(rules['specialChar']){
		const regex = /[!@#$%&?]/;
		let res = regex.test(value);
		result['specialChar'].valid = res;
		valid = valid&&res;
	}
	if(rules['numerical']){
		const regex = /[0-9]/;
		let res = regex.test(value);
		result['numerical'].valid = res;
		valid = valid&&res;
	}

	result.valid = valid;
	return result;

};
