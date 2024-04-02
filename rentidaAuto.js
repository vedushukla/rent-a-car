var tempCarObj={};
var tempUserObj={};
var resultCars=[];
var locations=['','jaipur','delhi','kota','bangalore'];
var uniqueId;
validationPatterns = {
	name: /^[A-za-z ]{3,}$/,
	mobile: /^[0-9]{10}$/,
	password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/

};

$("document").ready(function(){
	if(localStorage.getItem("rentidaAutoUsers")==null){
		localStorage["rentidaAutoUsers"]=JSON.stringify({});
	}
	if(localStorage.getItem("rentidaAutoCars")==null){
		localStorage['rentidaAutoCars']=JSON.stringify([]);
	}
	users=JSON.parse(localStorage['rentidaAutoUsers']);
	cars=JSON.parse(localStorage['rentidaAutoCars']);
	if(sessionStorage.getItem('rentidaAutoUser')!=null){
		$("#topNav").find("li").html(signOutNav);
	}
	if(localStorage.getItem("rentidaLocations")==null){
		localStorage['rentidaLocations']=JSON.stringify(locations);
	}
	locations=JSON.parse(localStorage['rentidaLocations']);
	if(localStorage.getItem('uniqueId')==null){
		localStorage['uniqueId']='0';
	}
	uniqueId = Number(localStorage['uniqueId']);
	updateLocationList();
});


var defaultPage = "home";
var signInNav=`<a class="link" href="#" onclick="displayForm('signInPage')">Sign In</a>`;
var signOutNav=`<a class="link" href="#" onclick="signOutUser()">Sign Out</a>`
var presentPage;
presentPage=defaultPage;
var validationFlag=true;
var carTileLayout=`<div class="carTile">
	<div class="carType indicator"><span class="label"></span></div>
	<div class="carSymbol">
		<img src="images/hatchback.jpg" class="carIcon">
	</div>
	<div class="carDetails">
		<div class="tileHeader">
			<span class="carDetail modelName"></span>
		</div>
		<div class="tileBody">
			<div>
				<span class="label">Fuel Type:</span>
				<span class="carDetail fuelType"></span>
			</div>
			<div>
				<span class="label">Transition:</span>
				<span class="carDetail transition"></span>
			</div>
			<div>
				<span class="label">Capacity:</span>
				<span class="carDetail capacity"></span>
			</div>
		</div>
	</div>
</div>`

function updateLocationList(){
	var fchild;
		$fchild=$("#locationSelect :first-child");
	$("#locationSelect").empty();
	$("#locationSelect").append($fchild);
	for(let i=0;i<locations.length;i++){
		$("#locationSelect").append(`<option value="`+locations[i]+`">`+locations[i]+`</option>`);
	}
}

function addLocation(location){

	locations.push(location);
	localStorage['rentidaLocations']=JSON.stringify(locations);
	updateLocationList();
}

function setTempUserObj(values){
	tempUserObj={};
	for(let i=0;i<values.length;i++){
		let key = values[i].name;
		tempUserObj[key] = values[i].value;
	}
}

function setTempCarObj(values){
	tempCarObj={};
	for(let i=0;i<values.length;i++){
		let key = values[i].name;
		tempCarObj[key] = values[i].value;
	}
}

function fieldValidation(element){
	let input = $(element)[0].value;
	let name=$(element)[0].name;
	let temp = $(element)[0];
	let label = $(temp).parent().find(".formLabel").text();
	if(!(input.match(validationPatterns[name]))){
		validationFlag = false;
		if(input==""){
			setErrorMsg(temp,label+" is required");
		}
		else{
			setErrorMsg(temp,"Invalid "+label);
		}
	}
	else{
		resetErrorMsg(temp);
	}
}

function setErrorMsg(element,msg){
	$(element).parent().find(".errorMsg").text(msg);
}

function resetErrorMsg(element){
	$(element).parent().find(".errorMsg").text("");
}


function matchPassword(id1,id2){
	pwd1=$("#"+id1).val();
	pwd2=$("#"+id2).val();
	if(pwd1!=pwd2){
		$("#"+id1).parent().find(".errorMsg").html("Password doesn't match!");
	}
	else{
		$("#"+id1).parent().find(".errorMsg").html("");
	}
}

//JS for managing main navigation
function changePage(This, calledPage = '') {
	document.getElementsByClassName("active")[0].classList.remove("active");
	This.parentNode.classList.add("active");
	document.getElementById(presentPage).classList.add("hide");
	if(calledPage!=''){
		document.getElementById(calledPage).classList.remove("hide");
		presentPage=calledPage;
	}

}

//JS for managing side navigation  of home page
function handleSideNavigation(This, calledPagePart=''){
	$("#homeBodyNavigation").find(".active").removeClass("active");
	$("#"+This).addClass("active");
	$(".pagePart").addClass("hide");
	$("#"+calledPagePart).removeClass("hide");
}

function filterCarsAPLocation(location){
	let temp=Object.keys(cars);
	resultCars=[];
	for(let i=0;i<temp.length;i++){
		let loc=JSON.parse(cars[temp[i]]).location;
		if( loc== location){
			resultCars.push(JSON.parse(cars[temp[i]]));
		}
	}
}

$("#carTilesPart").on("click",".carTile",function(){
	if(sessionStorage["rentidaAutoUser"]==null){
		signInUser();
	}
	var id=$(this).attr("id");
	for(let i=0;i<cars.length;i++){
		if(JSON.parse(cars[i]).id == id){
			var car=JSON.parse(cars[i]);
		}
	}
	$("#carDetailsPage").find(".modelName").find(".value").text(car.modelName);
	$("#carDetailsPage").find(".location").find(".value").text(car.location);
	$("#carDetailsPage").find(".carType").find(".value").text(car.carType);
	$("#carDetailsPage").find(".transition").find(".value").text(car.transition);
	$("#carDetailsPage").find(".fuel").find(".value").text(car.fuel);
	$("#carDetailsPage").find(".kms").find(".value").text(car.kms);
	$("#carDetailsPage").find(".capacity").find(".value").text(car.capacity);
	var user=JSON.parse(localStorage["rentidaAutoUsers"])[car.mobile];
	$("#ownerDetails").find(".name").find(".value").text(user.name);
	$("#ownerDetails").find(".mobile").find(".value").text(car.mobile)
	$(".pagePart").addClass("hide");
	$("#carDetailsPage").removeClass("hide");
});

function showCars(calledPagePart){
	let location=$("#locationSelect").val();
	if(location==""){
		alert("Please select a location to continue!");
	}
	else{
		$("#locationLabel").text(location);
		$("#carTilesPart").empty();
		filterCarsAPLocation(location);
		for(let i=0;i<resultCars.length;i++){
			$("#carTilesPart").append(
				`<div class="carTile" id="`+resultCars[i].id+`">
					<div class="carType indicator `+resultCars[i].carType+`"><span class="label">`+resultCars[i].carType+`</span></div>
					<div class="carSymbol">
						<img src="images/`+resultCars[i].carType+`.png" class="carIcon">
					</div>
					<div class="carDetails">
						<div class="tileHeader">
							<span class="carDetail modelName">`+resultCars[i].modelName+`</span>
						</div>
						<div class="tileBody">
							<div>
								<span class="label">Fuel Type:</span>
								<span class="carDetail fuelType">`+resultCars[i].fuel+`</span>
							</div>
							<div>
								<span class="label">Transition:</span>
								<span class="carDetail transition">`+resultCars[i].transition+`</span>
							</div>
							<div>
								<span class="label">Capacity:</span>
								<span class="carDetail capacity">`+resultCars[i].capacity+`</span>
							</div>
						</div>
					</div>
				</div>`
			);
		}
		$(".pagePart").addClass("hide");
		$("#"+calledPagePart).removeClass("hide");
	}
}
//JS for displaying form
function displayForm(formPage){
	$("#outterContainer").addClass("hide");
	$("#formPagesContainer").removeClass("hide");
	$("#formPagesContainer>*").addClass("hide");
	$("#"+formPage).find('form').trigger('reset');
	$("#"+formPage).removeClass("hide");

}
function hideForm(){
	$("#formPagesContainer").addClass("hide");
	$("#formPagesContainer>*").addClass("hide");
	$("#outterContainer").removeClass("hide");
	
}
function cancelForm(form){
	$("#"+form).trigger('reset');
	hideForm();
}

//JS for sign up
function addUser(){
	var values = $("#signUpForm :input").serializeArray();
	setTempUserObj(values);
	users[tempUserObj.mobile] = {
		name: tempUserObj.name,
		password: tempUserObj.password
	}
	//update database
	localStorage["rentidaAutoUsers"]=JSON.stringify(users);
	alert("Sign Up successful! Please Sign in to continue.");
	displayForm("signInPage");
}

//JS for sign in
function signInUser(){
	alert("Please Sign In to continue!");
	displayForm('signInPage');
}
function checkDatabase(mobile){
	if(!(mobile in users)){
		$("#signInForm").trigger('reset');
		if(confirm("Entered mobile number is not registered!\nClick Ok to continue to SignUp page")){
			displayForm('signUpPage');
		}
		return false;
	}
	else{
		return true;
	}
}
function authenticateUser(form){
	let values = $("#"+form).serializeArray();
	setTempUserObj(values);
	let number = tempUserObj['mobile'];
	let password = tempUserObj['password'];
	if(checkDatabase(number)){
		var pwd=users[number].password;
		if(password!=pwd){
			alert("Invalid credentials!\nYou have entered invalid mobile number or password.\nPlease try again.");
			$("#"+form).trigger('reset');
		}
		else{
			sessionStorage['rentidaAutoUser']=JSON.stringify({mobile:number,name:users[number].name});
			$("#topNav").find("li").html(signOutNav);
			cancelForm(form);
		}
	}
	
}

//JS for sign out
function signOutUser(){
	if(confirm('Are you sure to sign out as ' + JSON.parse(sessionStorage['rentidaAutoUser']).name+' ?')){
		sessionStorage.removeItem('rentidaAutoUser');
		$("#topNav").find("li").html(signInNav);
		$("#rent").trigger('click');

	}
}

//JS for addCar Page
function addCarPage(){
	if(sessionStorage.getItem('rentidaAutoUser')==null){
		signInUser();
	}
	else{
		displayForm('addCarPage');
	}
}
function validation(form){
	let fields = $("#"+form+" :input");
	let flag=true;
	for(let i=0;i<fields.length;i++){
		if(fields[0].value==""){
			$(fields[0]).parent().find(".errorMsg").text(fields[0].name+" is required");
			flag=false;
		}
		else{
			$(fields[0]).parent().find(".errorMsg").text("");
		}
	}
	return flag;
}
function addCar(){
	let values=$('#addCarForm :input').serializeArray();
	setTempCarObj(values);
	if(validation('addCarForm')){
		displayLendCars();
		let locFlag=0;
		let loc = tempCarObj['location'];
		for(let i=0;i<locations.length;i++){
			if(locations[i]==loc){
				locFlag = 1;
				break;
			}
		}
		if(!(locFlag)){
			addLocation(tempCarObj['location']);
		}
		tempCarObj['mobile']=JSON.parse(sessionStorage['rentidaAutoUser'])['mobile'];
		tempCarObj['id']=String(++uniqueId);
		localStorage.uniqueId = String(uniqueId);
		cars.push(JSON.stringify(tempCarObj));
		localStorage['rentidaAutoCars']=JSON.stringify(cars);
		cancelForm('addCarForm');
		displayLendCars('lend');
	}
	else{
		alert("Please fill all the details");
	}
	
}

$("#lendedCars").on("click",".carTile",function(){
	var id=$(this).attr("id");
	for(let i=0;i<cars.length;i++){
		if(JSON.parse(cars[i]).id == id){
			var car=JSON.parse(cars[i]);
		}
	}
	$("#carDetailsPage").find(".modelName").find(".value").text(car.modelName);
	$("#carDetailsPage").find(".location").find(".value").text(car.location);
	$("#carDetailsPage").find(".carType").find(".value").text(car.carType);
	$("#carDetailsPage").find(".transition").find(".value").text(car.transition);
	$("#carDetailsPage").find(".fuel").find(".value").text(car.fuel);
	$("#carDetailsPage").find(".kms").find(".value").text(car.kms);
	$("#carDetailsPage").find(".capacity").find(".value").text(car.capacity);
	
	$(".pagePart").addClass("hide");
	$("#carDetailsPage").removeClass("hide");
});
function displayOwnerDetails(){
	$("#ownerDetailsPage").removeClass("hide");
}
function hideOwnerDetails(){
	
}
function displayLendCars(id){
	let temp=Object.keys(cars);
	resultCars=[];
	if(sessionStorage.getItem('rentidaAutoUser')==null){
		signInUser();
	}
	else{
		for(let i=0;i<temp.length;i++){
			let number=JSON.parse(cars[temp[i]]).mobile;
			let mobile=JSON.parse(sessionStorage['rentidaAutoUser']).mobile;
			if(number==mobile){
				resultCars.push(JSON.parse(cars[temp[i]]));
			}
		}
		if(resultCars.length==0){
			if($("#empty").hasClass("hide"))
			$("#empty").removeClass("hide");
			$("#lendedCars").empty();
		}
		else{
			if(!($("#empty").hasClass("hide"))){
				$("#empty").addClass("hide");
			}
			$("#locationLabel").text(location);
			$("#lendedCars").empty();
			for(let i=0;i<resultCars.length;i++){
				$("#lendedCars").append(
					`<div class="carTile" id="`+resultCars[i].id+`" onclick="showLendedCarDetails(this.id)">
						<div class="carType indicator `+resultCars[i].carType+`"><span class="label">`+resultCars[i].carType+`</span></div>
						<div class="carSymbol">
							<img src="images/`+resultCars[i].carType+`.png" class="carIcon">
						</div>
						<div class="carDetails">
							<div class="tileHeader">
								<span class="carDetail modelName">`+resultCars[i].modelName+`</span>
							</div>
							<div class="tileBody">
								<div>
									<span class="label">Fuel Type:</span>
									<span class="carDetail fuelType">`+resultCars[i].fuel+`</span>
								</div>
								<div>
									<span class="label">Transition:</span>
									<span class="carDetail transition">`+resultCars[i].transition+`</span>
								</div>
								<div>
									<span class="label">Capacity:</span>
									<span class="carDetail capacity">`+resultCars[i].capacity+`</span>
								</div>
							</div>
						</div>
					</div>`
				);
			}
			
		}
		handleSideNavigation(id,'lenderPage');
	}
	
}
