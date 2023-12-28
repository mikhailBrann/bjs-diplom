'use strict'

const userForm = new UserForm();

userForm.loginFormCallback = function(data) {
    const formObj = this;

    ApiConnector.login(data, (response) => {
        if(!response.success) {
            formObj.setLoginErrorMessage(response.error);
            return response.error;
        }

        location.reload();
    });
};

userForm.registerFormCallback = function(data) {
    const formObj = this;

    ApiConnector.register(data, (response) => {
        if(!response.success) {
            formObj.setRegisterErrorMessage(response.error);
            return response.error;
        }

        location.reload();
    });
};