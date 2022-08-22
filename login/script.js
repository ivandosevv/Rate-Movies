function checkValidEmail(email) {
    return String(email).toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

const login = document.getElementById("login-form");

function showErrorMessage(error) {
    const errorId = document.getElementById("error-message");
    errorId.innerHTML = error;
}
window.onload = function(){
    login.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const currEmail = document.getElementById("email").value;
        const currPassword = document.getElementById("password").value;
    
        if (currEmail.length === 0 || currPassword === 0) {
            showErrorMessage("Fields must not be empty!");
            return;
        }
    
        if (!checkValidEmail(currEmail)) {
            showErrorMessage("Invalid email!");
        }
    
        let allUsersItem = localStorage.getItem("users");
    
        if (allUsersItem) {
            const allUsers = JSON.parse(allUsersItem);
    
            const currUser = allUsers.filter(x => currEmail === x.email);
    
            if (currUser.length === 0) {
                showErrorMessage("User with this email address doesn't exist");
                return;
            } else {
                if (currUser[0].password === currPassword) {
                    localStorage.setItem("currUser", JSON.stringify(currUser[0]));
                    window.location.href = "../recipes";
                } else {
                    showErrorMessage("Wrong password!")
                }
            }
        } else {
            showErrorMessage("User with this email address doesn't exist");
            return;
        }
    })
}