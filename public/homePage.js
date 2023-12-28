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

/*MoneyManager end*/

/*favorites start*/
const favorites = new FavoritesWidget();
const getFavorites = (data)=> {
    favorites.clearTable();
    favorites.fillTable(data);
    moneyManager.updateUsersList(data);
};

favorites.addUserCallback = (...args) => {
    ApiConnector.addUserToFavorites(...args, (response) => {
        if(!response.success) {
            favorites.setMessage(response.success, response.error);
            return response.error;
        }

        favorites.setMessage(response.success, `Пользователь c ID:${args[0].id} добавлен в книгу`);
        getFavorites(response.data);
    });
};

favorites.removeUserCallback = (id) => {
    ApiConnector.removeUserFromFavorites(id, (response) => {
        if(!response.success) {
            favorites.setMessage(response.success, response.error);
            return response.error;
        }

        favorites.setMessage(response.success, `Пользователь c ID:${id} удален из книги`);
        getFavorites(response.data);
    });
};

//запрос списка при загрузке страницы
ApiConnector.getFavorites((response) => {
    if(!response.success) {
        favorites.setMessage(response.success, response.error);
        return response.error;
    }

    getFavorites(response.data);
});
/*favorites start*/