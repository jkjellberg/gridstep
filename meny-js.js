/* Open the sidenav */
function openNav() {
  document.getElementById("mySidenav").style.width = "100%";
  document.getElementById("mySidenav").style.opacity = "1";
}

/* Close/hide the sidenav */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("mySidenav").style.opacity = "0";
}

// Paints a link/button for each layout in the list "grids" and connects it to a funciton
grids.forEach((grid, i) => {
  $(".menu-categories")
    .eq(0)
    .append("<a class= 'layout-link' href='#'>Layout " + (i + 1) + "</a>");
  $(".layout-link")
    .eq(i)
    .click(function (e) {
      $(".layout-link").eq(activeGrid).removeClass("active");
      $(this).addClass("active");
      ChangeGrid(grids[i] + ".html");
      activeGrid = i;
      closeNav();
    });
});

// Paints a link/button for each drumkit in the list "drumkits" and connects it to a funciton
drumkits.forEach((drumkit, i) => {
  $(".menu-categories")
    .eq(1)
    .append("<a class= 'drumkit-link' href='#'>" + drumkits[i] + "</a>");
  $(".drumkit-link")
    .eq(i)
    .click(function (e) {
      $(".drumkit-link").eq(activeDrumkitIndex).removeClass("active");
      $(this).addClass("active");
      changeDrumKit(i);
      activeDrumkitIndex = i;
      closeNav();
    });
});

// Sets the first links as active
$(".layout-link").eq(activeGrid).addClass("active");
$(".drumkit-link").eq(activeDrumkitIndex).addClass("active");
