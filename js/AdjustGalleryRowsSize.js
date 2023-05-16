
window.addEventListener('load', AdjustRowHeights);
window.addEventListener('resize', AdjustRowHeightsAgain);

var twoElements = 0;
var threeElements = 0;
var fourElements = 0;

var minTwoImageHeight = 0;
var minThreeImageHeight = 0;
var minFourImageHeight = 0;


function AdjustRowHeights() {

    twoElements = Array.from(document.querySelectorAll('.ImageGridRowTwo#AdjustHeight'));

    twoElements.forEach(row => {
      
      const images = Array.from(row.querySelectorAll('img'));
      minTwoImageHeight = Math.min(...images.map(img => img.offsetHeight));

      images.forEach(image => {
        image.style.height = 'auto';
        image.style.maxHeight = minTwoImageHeight + 'px';
      });

    });

    threeElements = Array.from(document.querySelectorAll('.ImageGridRowThree#AdjustHeight'));

    threeElements.forEach(row => {
      
      const images = Array.from(row.querySelectorAll('img'));
      minThreeImageHeight = Math.min(...images.map(img => img.offsetHeight));

      images.forEach(image => {
        image.style.height = 'auto';
        image.style.maxHeight = minThreeImageHeight + 'px';
      });

    });

    fourElements = Array.from(document.querySelectorAll('.ImageGridRowFour#AdjustHeight'));

    fourElements.forEach(row => {
      
      const images = Array.from(row.querySelectorAll('img'));
      minFourImageHeight = Math.min(...images.map(img => img.offsetHeight));

      images.forEach(image => {
        image.style.height = 'auto';
        image.style.maxHeight = minFourImageHeight + 'px';
      });

    });    


}

function AdjustRowHeightsAgain() {


    twoElements.forEach(row => {
      
      const images = Array.from(row.querySelectorAll('img'));

      images.forEach(image => {
        image.style.maxHeight = minTwoImageHeight + 'px';
      });

    });

    threeElements.forEach(row => {
      
      const images = Array.from(row.querySelectorAll('img'));

      images.forEach(image => {
        image.style.maxHeight = minThreeImageHeight + 'px';
      });

    });

    fourElements.forEach(row => {
      
      const images = Array.from(row.querySelectorAll('img'));

      images.forEach(image => {
        image.style.maxHeight = minFourImageHeight + 'px';
      });

    });
    console.log('Resolution changed!');

}