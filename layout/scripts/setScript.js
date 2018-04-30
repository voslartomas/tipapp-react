
//  Navig slide anim --------------------------------

$(document).ready(function () {
    $(".menu").click(function () {
        $("nav").slideToggle(500);
    })

    $(".league-menu").click(function () {
        $(".league-bar").slideToggle(500);
    })

    $(".actual-games").click(function () {
        document.getElementById("pageBox").data = "actualgames.html";
        document.getElementById("ap-text").innerHTML = "ACTUAL GAMES";
        $(".league-bar").slideToggle(500);
    })

    $(".my-bets").click(function () {
        document.getElementById("pageBox").data = "mybets.html";
        document.getElementById("ap-text").innerHTML = "MY BETS";
        $(".league-bar").slideToggle(500);
    })

    $(".table").click(function () {
        document.getElementById("pageBox").data = "table.html";
        document.getElementById("ap-text").innerHTML = "TABLE";
        $(".league-bar").slideToggle(500);
    })

    $(".all-bets").click(function () {
        document.getElementById("pageBox").data = "allbets.html";
        document.getElementById("ap-text").innerHTML = "ALL BETS";
        $(".league-bar").slideToggle(500);
    })

    $(".rules").click(function () {
        document.getElementById("pageBox").data = "rules.html";
        document.getElementById("ap-text").innerHTML = "RULES";
        $(".league-bar").slideToggle(500);
    })

    $(".settings").click(function () {
        document.getElementById("pageBox").data = "settings.html";
        document.getElementById("ap-text").innerHTML = "SETTINGS";
        $(".league-bar").slideToggle(500);
    })
})