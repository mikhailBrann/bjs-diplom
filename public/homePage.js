'use strict'

/*logout start*/
const logout = new LogoutButton();

logout.action = () => ApiConnector.logout((response) => {
    if(!response.success) {
        return response.error;
    }

    location.reload();
});
/*logout end*/

/*currentUser start*/
const currentUser = (() => {
    ApiConnector.current((response) => {
        if(!response.success) {
            return response.error;
        }

        ProfileWidget.showProfile(response.data);
    });
})();
/*currentUser end*/

/*currencyRate start*/
function updateRateBoardView(boardObj, delay=60000)  {
    let intervalId = null;
    let flag = false;
    const getCurrency = (boardObj) => {
        ApiConnector.getStocks((response) => {
            if(!response.success) {
                return response.error;
            }

            boardObj.clearTable();
            boardObj.fillTable(response.data);
        });
    };

    if(!flag) {
        getCurrency(boardObj);
    }

    if(intervalId != null) {
        return;
    }

   intervalId = setInterval(() => {
       flag = true;
       getCurrency(boardObj);
   }, delay);
};

const currencyRateBoard = new RatesBoard();
updateRateBoardView(currencyRateBoard, 60000);
/*currencyRate end*/

/*MoneyManager start*/
const moneyManager = new MoneyManager();
const updateMoneyManager = (response, message='') => {
    if(!response.success) {
        moneyManager.setMessage(response.success, response.error);
        return;
    }

    ProfileWidget.showProfile(response.data);
    moneyManager.setMessage(response.success, message);
};

moneyManager.addMoneyCallback = (...args) => {
    ApiConnector.addMoney(...args, (response) => {
        updateMoneyManager(
            response,
            `Кошелек успешно пополнен на ${args[0].amount} ${args[0].currency}`
        );
    });
};

moneyManager.conversionMoneyCallback = (...args) => {
    ApiConnector.convertMoney(...args, (response) => {
        updateMoneyManager(
            response,
            `Успешная конвертация из ${args[0].fromCurrency} в ${args[0].targetCurrency}`
        );
    });
};

moneyManager.sendMoneyCallback = (...args) => {
    ApiConnector.transferMoney(...args, (response) => {
        updateMoneyManager(
            response,
            `Успешно переведено ${args[0].amount} ${args[0].currency} пользователю из Адресной книги(ID:${args[0].to})`
        );
    });
};
/*MoneyManager end*/

/*favorites start*/
const favorites = new FavoritesWidget();
const getFavorites = (response, message='')=> {
    if(!response.success) {
        favorites.setMessage(response.success, response.error);
        return;
    }

    favorites.clearTable();
    favorites.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
    favorites.setMessage(response.success, message);
};

favorites.addUserCallback = (...args) => {
    ApiConnector.addUserToFavorites(...args, (response) => {
        getFavorites(response, `Пользователь c ID:${args[0].id} добавлен в книгу`);
    });
};

favorites.removeUserCallback = (id) => {
    ApiConnector.removeUserFromFavorites(id, (response) => {
        getFavorites(response, `Пользователь c ID:${id} удален из книги`);
    });
};

//запрос списка при загрузке страницы
ApiConnector.getFavorites((response) => {
    getFavorites(response);
});
/*favorites start*/