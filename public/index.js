const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

document.getElementById("checkbox").addEventListener("click", function() {
    
    document.querySelector("select").classList.toggle("active");
    document.getElementById("price").classList.toggle("hidden");
    document.querySelector(".container").style.animation = "muncitor 2s";
    setTimeout(function() {
        document.querySelector(".container").style.minHeight = "800px";
    }, 2000)
})