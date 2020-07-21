const validator = require('validator');
const isEmpty = require('./is-empty');
module.exports = function validateProfileFieldInput(data) {
    let errors = {};

    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : ''
    data.skills = !isEmpty(data.skills) ? data.skills : ''

    if(!validator.isLength(data.handle, { min: 2, max: 40 })){
        errors.handle = 'handle must be between 5 to 20 character';
    }
    if(validator.isEmpty(data.handle)){
        errors.handle = 'profile handle is required';
    }
    if(validator.isEmpty(data.status)){
        errors.status = 'status field is required';
    }
    if(validator.isEmpty(data.skills)){
        errors.skills = 'skills are required';
    }
    
    if(!isEmpty(data.website)){
        if(!validator.isURL(data.website)){
            errors.website = 'invalid website url'
        }
    }
    if(!isEmpty(data.youtube)){
        if(!validator.isURL(data.youtube)){
            errors.youtube = 'invalid youtube url'
        }
    }
    if(!isEmpty(data.twitter)){
        if(!validator.isURL(data.twitter)){
            errors.twitter = 'invalid twitter url'
        }
    }
    if(!isEmpty(data.instagram)){
        if(!validator.isURL(data.instagram)){
            errors.instagram = 'invalid instagram url'
        }
    }
    if(!isEmpty(data.facebook)){
        if(!validator.isURL(data.facebook)){
            errors.facebook = 'invalid facebook url'
        }
    }
    if(!isEmpty(data.linkedin)){
        if(!validator.isURL(data.linkedin)){
            errors.linkedin = 'invalid linkedin url'
        }
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}