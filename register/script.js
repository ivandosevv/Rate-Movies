function checkValidEmail(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

const register = document.getElementById("signup-form");

function showErrorMessage(errorMessage) {
    //const errorDiv = document.getElementById("error-message");
    //errorDiv.innerHTML = errorMessage;
    alert(errorMessage);
}
window.onload = function(){
    register.addEventListener("submit", (e) => {
        e.preventDefault();
    
        const currEmail = document.getElementById("email").value;
        const currPassword = document.getElementById("password").value;
        const passwordToConfirm = document.getElementById("confirm-password").value;
    
        if (currEmail.length === 0 || currPassword.length === 0 || passwordToConfirm.length === 0) {
            showErrorMessage("Fields must not be empty");
            return;
        }
    
        if (currPassword.length < 6) {
            showErrorMessage("Password must be at least 6 characters");
            return;
        }
    
        if (!checkValidEmail(currEmail)) {
            showErrorMessage("Invalid email!");
            return;
        }
    
        let allUsersItems = localStorage.getItem("users");
    
        //If no one's registered before, then we create an array with users
        if (!allUsersItems) {
            if (currPassword !== passwordToConfirm) {
                showErrorMessage("Passwords do not match!");
            } else {
                localStorage.setItem("users", JSON.stringify([{
                    email: currEmail,
                    password: currPassword
                }]));
                localStorage.setItem("currUser", JSON.stringify({
                    email: currEmail
                }))
                window.location.href = "../movies";
            }
        } else {
            //If there are registered users, then we just add this user
            const allUsers = JSON.parse(allUsersItems);
    
            const currentUserExists = allUsers.filter(x => currEmail === x.email).length !== 0;
    
            if (currentUserExists) {
                showErrorMessage("User with this email address already exists!");
                return;
            } else {
                if (currPassword !== passwordToConfirm) {
                    showErrorMessage("Passwords do not match!");
                } else {
                    allUsers.push({
                        email: currEmail,
                        password: currPassword
                    });
    
                    localStorage.setItem("users", JSON.stringify(allUsers));
                    
                    localStorage.setItem("currUser", JSON.stringify({
                        email: currEmail
                    }));
                    
                    window.location.href = "../movies";
                }
            }
        }
    })
}