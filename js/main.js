let burgerBtn = document.querySelector(".BurgerMenuButton");
let burgerMenu = document.querySelector(".MobileNavMenu");
let masthead = document.querySelector(".MastheadImage");
let navbar = document.querySelector(".NavBarHeader");

let isBurgerOpen = false;

burgerBtn.onclick = function ()
{
    if (!isBurgerOpen)
    {
        burgerMenu.style.display = "block";
        burgerBtn.style.backgroundPosition = "center left 50px, center";
        navbar.style.position = "fixed";
        //navbar.style.top = "240px";
        //masthead.style.position = "fixed";
        //masthead.style.top = "0px";
        isBurgerOpen = true;
    }
    else if (isBurgerOpen)
    {
        burgerMenu.style.display = "none";
        burgerBtn.style.backgroundPosition = "center, center left 50px";
        navbar.style.position = "sticky";
        //navbar.style.top = "0px";
        //masthead.style.position = "static";
        //masthead.style.top = "0px";
        isBurgerOpen = false;
    }
}