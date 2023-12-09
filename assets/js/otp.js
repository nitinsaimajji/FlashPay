
function sendOTP(){
    const email = document.getElementById('email');
    const otpverify = document.getElementsByClassName('otpverify')[0];

    // Create a SMTP crendentials that I showed u in my previous video

    // Generating random number as OTP;

    let otp_val = Math.floor(Math.random()*10000);

    let emailbody = `
        <h1>Flash Pay - </h1> <br>
        <h2>Your OTP is </h2>${otp_val}
    `;

    Email.send({
        SecureToken : "40019ffc-4025-4d2d-bd43-4dcf1e9c3048",
        To : email.value,
        From : "deeplr51@gmail.com",
        Subject : "This is the from flash pay, Please Subscribe",
        Body : emailbody
    }).then(
        //if success it returns "OK";
      message => {
        if(message === "OK"){
            alert("OTP sent to your email "+email.value);

            // now making otp input visible
            otpverify.style.display = "block";
            const otp_inp = document.getElementById('otp_inp');
            const otp_btn = document.getElementById('otp-btn');

            otp_btn.addEventListener('click',()=>{
                if(otp_inp.value == otp_val){
                    alert("verified...")
                    window.location.href = 'http://localhost:5000/order/order_choose';
                }
                else{
                    alert("Invalid OTP");
                    window.location.href = 'http://localhost:5000/cart';
                }
            })
        }
      }
    );

}