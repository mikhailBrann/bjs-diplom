'use strict'

/*logout start*/
const logout = new LogoutButton();
logout.action = () => {
    ApiConnector.logout((response) => {
        if(!response.success) {
            return response.error;
        }

        location.reload();
    });
};
/*logout end*/

/*currentUser start*/
const currentUser = (() => {
    ApiConnector.current((response) => {
        if(!response.success) {
            return response.error;
        }

        return ProfileWidget.showProfile(response.data);
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