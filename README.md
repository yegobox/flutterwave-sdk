##
# Yegobox Payment SDK
##
Yegobox Payment SDK

Properties
````
enablemomo - Should be true or false - Allow mobile money feature
showbutton - Should be true or false - Allow user to use popup modal.
amount     - Amount use can pay!
action     - it should be button name example: Pay or Donation.
currency   - Accept RWF AND USD
is_creator_account - 
account_id - it should be string(you should request from Yegobox) 
enableredirect - when you enabled redirect you should add redirect url also
redirecturl - you should provide redirect url, when payment is done will redirect to that url you provided. 
class - css class name when you want to change the button color, background or font
````
ELEMENT

````
  <payment-sdk  
  enablemomo='true'
  showbutton='false' modal="md" 
  amount='100' 
  action='Donate' 
  timeout="1000"
  currency="RWF",
  is_creator_account="false",
  account_id=""
  enableredirect="true"
  redirecturl="https://yegobox/successful"
  ></payment-sdk>
````
How to use it.
````
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title></title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link rel="stylesheet" href="https://yegobox.com/sdk/styles.css">
<style>
  .button1{
    background-color: brown;
  }
</style>
</head>
<body class="mat-typography" style="margin:200px">
 <payment-sdk  
  enablemomo='true' 
  showbutton='false' modal="md" 
  amount='100' 
  action='Pay!' 
  timeout="1000"
  currency="RWF",
  is_creator_account="false",
  account_id=""
  enableredirect="true"
  class="btn"
  redirecturl="https://yegobox.com/"
  ></payment-sdk>
<script src="https://yegobox.com/sdk/payment-sdk.js" type="text/javascript"></script>
</body>

<script>
const el = document.querySelector('payment-sdk');

el.addEventListener('response', (event) => console.log("html",event.detail));
</script>

</html>
````