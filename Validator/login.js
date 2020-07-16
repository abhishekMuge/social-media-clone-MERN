const validator = require('validator');
const isEmpty = require('./is-empty');
module.exports = function validateLoginInput(data) {
    let errors = {};

    data.Email = !isEmpty(data.Email) ? data.Email : '';
    data.Password = !isEmpty(data.Password) ? data.Password : ''

    if(!validator.isEmail(data.Email)){
        errors.Email =  'Email is invalid';
    }
                if(validator.isEmpty(data.Email)){
                    errors.Email =  'Email is required';
                }
    if(validator.isEmpty(data.Password)){
        errors.Password =  'Password is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}