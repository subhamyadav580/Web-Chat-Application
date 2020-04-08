// function to search users lists
let email_id;
function myFunction() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("h2")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}




//function to create a users list

function users() {
    console.log('users() function called');
    document.getElementById('chat_user').style.display = "block";
    document.getElementById('chat').style.display = "block";
    user_email = document.getElementById('inp_mesg').value;
    if (user_email) {
        console.log(user_email);
        db.collection("Users").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.id);
                email_id = doc.data().Email;
                user_name = doc.id;

                var sentence = user_name.toLowerCase().split(" ");
                for (var i = 0; i < sentence.length; i++) {
                    sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
                }
                user_name = sentence.join(" ");
                var lists = [email_id, user_name]
                console.log(user_name+"---")
                if (user_email != email_id) {
                    console.log(user_name);
                    document.querySelector('#myUL').innerHTML += `<li title = ` + user_name + `>
                    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_01.jpg" alt=""/><div><h2 class = "open-button" id="`+ lists + `" onclick = "openForm(this.id)" style="cursor: pointer;">` + user_name + `</h2><h3><span class  = "status orange"></span>offline</h3></div></li>`;
                    console.log(doc.data().Email)
                }

            });
        });
    }

}


//function to open a private chat box


let to_user;
function openForm(button_id) {
    var words = button_id.split(",");
    var word1 = words[0];
    var word2 = words[1];
    to_user = word1
    document.getElementById('chat_user').innerHTML = "";
    document.getElementById('chat').innerHTML = "";
    head_user(word2);
    message_(word1);
    console.log('history');

}

//function to display chat box header
function head_user(button_id) {
    function settingClock() {
        var today = new Date();
        var hour = today.getHours();
        var minute = today.getMinutes();
        var second = today.getSeconds();


        if (hour < 10) {
            hour = "0" + hour;
        }
        if (minute < 10) {
            minute = "0" + minute;
        }
        if (second < 10) {
            second = "0" + second;
        }
        var frame = document.getElementById("real_time");
        frame.innerHTML = hour + ":" + minute + ":" + second;
    }

    setInterval(settingClock, 500);
    document.getElementById('chat_user').style.display = "block";
    document.querySelector('#chat_user').innerHTML += `<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_01.jpg" alt=""><div><h2>` + button_id + `</h2><h3 id = "real_time" style = "color:black;">` + +`</h3></div>`
}

// function to display chat messages

function message_(button_id) {
    document.getElementById("chat").style.display = "block";
    console.log(user_email + ":" + button_id)
    db.collection("messages").orderBy('time').onSnapshot(function (snapshot) {
        snapshot.docChanges().forEach(function (change) {
            if (change.type === "added") {
                if (change.doc.data().from == user_email && change.doc.data().to == button_id) {
                    console.log("true");
                    console.log(user_email + ":" + button_id)
                    document.querySelector('#chat').innerHTML += `<li class="me"><div class="entete"><h3 style="color:black;">` + change.doc.data().time + `</h3><span class="status blue"></span><div class="triangle"></div><div class="message">` + change.doc.data().mesg + `</div></li>`;
                    console.log("message displayed succesfully")
                }
                else if (change.doc.data().from == button_id && change.doc.data().to == user_email) {
                    document.querySelector('#chat').innerHTML += `<li class="you"><div class="entete"><h3 style="color:black;">` + change.doc.data().time + `</h3><span class="status green"></span></div><div class="triangle"></div><div class="message">` + change.doc.data().mesg + `</div></li>`;
                    console.log("message displayed succesfully")
                }
            }
            if (change.type === "modified") {
                console.log("Modified city: ", change.doc.data());
            }
            if (change.type === "removed") {
                console.log("Removed city: ", change.doc.data());
            }
        });
    });
}

// function to add data in firebase 

var message;
var from_user;
function send_messg() {
    console.log(user_email);
    message = document.getElementById('msg').value;
    from_user = document.getElementById('inp_mesg').value;
    console.log(message);
    var today = new Date();
    var date = today.getFullYear() + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' + ("0" + today.getDate()).slice(-2);
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;
    db.collection('messages').doc(dateTime).set({
        mesg: message,
        from: user_email,
        to: to_user,
        time: dateTime
    });
    console.log('message sent!');
    console.log('new_message_sent!');

}







