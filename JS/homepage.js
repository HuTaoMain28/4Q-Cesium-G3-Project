function greetUser() {
    let Player = localStorage.getItem("username");
    if (Player) {
      document.getElementById("username").innerHTML = "GREETINGS " + Player  + "!!! "  + "WELCOME BACK TO CESIARA!";
    }
  }
  function getUsername() {
    let Nameusername = "username";
    let ValueUsername = document.getElementById("textbox").value;
    if (/^[A-Za-z0-9]+$/.test(ValueUsername)) {
      localStorage.setItem(Nameusername, ValueUsername);
      let Player = localStorage.getItem(Nameusername);
      document.getElementById("username").innerHTML = "GREETINGS " + Player  + "!!! "  + "WELCOME TO CESIARA!";
    } else {
      alert("Please enter a valid username (only letters and numbers).");
    }
  }
  window.onload = greetUser;
