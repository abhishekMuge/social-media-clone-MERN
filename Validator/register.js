const validator = require('validator');
const isEmpty = require('./is-empty');
module.exports = function validateRegisterInput(data) {
    let errors = {};

    data.Name= !isEmpty(data.Name) ? data.Name : '';
    data.Email = !isEmpty(data.Email) ? data.Email : '';
    data.Password = !isEmpty(data.Password) ? data.Password : ''
    data.Password2 = !isEmpty(data.Password2) ? data.Password2 : '';


    if(!validator.isLength(data.Name, { min: 5, max: 30})){
        errors.name = 'Name must be between 2 and 30 characters'
    }
    if(validator.isEmpty(data.Name)){
        errors.name =  'Name is required';
    }
    if(validator.isEmpty(data.Email)){
        errors.Email =  'Email is required';
    }
    if(!validator.isEmail(data.Email)){
        errors.Email =  'Email is invalid';
    }
    if(validator.isEmpty(data.Password)){
        errors.Password =  'Password is required';
    }
    if(!validator.isLength(data.Password, { min: 8, max: 30})){
        errors.Password = 'password must be between 8 and 30 characters'
    }
    if(validator.isEmpty(data.Password2)){
        errors.Password2 =  'confirm Password field required';
    }
    if(!validator.equals(data.Password, data.Password2)){
        errors.Password2 = 'passwords must matched  '
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}