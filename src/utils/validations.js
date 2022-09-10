module.exports.validateEmail = (email) => {
    let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

module.exports.validatePassword = (password) => {
    let re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    return re.test(password);
};

module.exports.validatePhnNumber = (phone_number) => {
    let phoneNo = /^(?:[0-9] ?){7,12}[0-9]$/;
    return phoneNo.test(phone_number)
};

module.exports.validateEmailPhoneNumber = (value) => {
    let mailFormat = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})|([0-9]{10})+$/;
    return mailFormat.test(value)
};

module.exports.validateUserName = (value) => {
    let nameFormat = /^(?:[A-Za-z'’‘’-]+)$/;
    // let nameFormat = /^[\u00C0-\u017Fa-zA-Z'’‘’][\u00C0-\u017Fa-zA-Z’‘’' -]+[\u00C0-\u017Fa-zA-Z'’‘’]?$/;
    return nameFormat.test(value)
};
