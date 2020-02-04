// window.onload = function() {
//     var simple = document.querySelector('.lory_slider');
//     var slides = simple.querySelectorAll('.js_slide');
//     var dotCount = slides.length;
//     var dotContainer = simple.querySelector('.js_dots');
//
//     var stop = false;
//     var fpsInterval, startTime, now, then, elapsed;
//
//     function handleDotEvent(e) {
//         var max = 0,
//             i = 0;
//
//         if (e.type === 'before.lory.init') {
//             var dotListItem = document.createElement('li');
//             max = dotCount;
//             for (i = 0; i < max; i++) {
//                 var clone = dotListItem.cloneNode();
//                 var text = slides[i].getElementsByClassName("park-opener__kicker");
//                 clone.innerHTML = '<span class="bar"></span>' +
//                     '<span class="dot"></span>' +
//                     '<span class="info">'+text[0].textContent+'</span>';
//                 dotContainer.appendChild(clone);
//             }
//             dotContainer.childNodes[0].classList.add('active');
//         }
//         if (e.type === 'after.lory.init') {
//             simple.classList.add("loaded");
//             max = dotCount;
//             for (i = 0; i < max; i++) {
//                 dotContainer.childNodes[i].addEventListener('click', function(e) {
//                     var _target;
//                     if(e.target.nodeName !== "LI"){
//                         _target = e.target.parentNode;
//                     } else {
//                         _target = e.target;
//                     }
//                     var _child = dotContainer.childNodes;
//                     var _slideTo = Array.prototype.indexOf.call(_child, _target);
//                     lory_slider.slideTo(_slideTo);
//                 });
//             }
//         }
//         if (e.type === 'after.lory.slide') {
//             max = dotContainer.childNodes.length;
//             for (i = 0; i < max; i++) {
//                 dotContainer.childNodes[i].classList.remove('active');
//             }
//             dotContainer.childNodes[e.detail.currentSlide - 1].classList.add('active');
//         }
//         if (e.type === 'on.lory.resize') {
//             max = dotContainer.childNodes.length;
//             for (i = 0; i < max; i++) {
//                 dotContainer.childNodes[i].classList.remove('active');
//             }
//             dotContainer.childNodes[0].classList.add('active');
//         }
//     }
//
//     function setSliderHeights(_reset){
//         var reset = typeof _reset !== 'undefined' ? _reset : false;
//         var setHeightSlides = calcHeight(slides,reset),
//             setHeightDot = calcHeight(dotContainer.childNodes,reset);
//
//         slides.forEach(function(node) {
//             node.getElementsByClassName('park-opener')[0].style.height = setHeightSlides + "px";
//         });
//         dotContainer.querySelectorAll('li').forEach(function(node) {
//             node.style.height = setHeightDot + "px";
//         });
//     }
//     function calcHeight(nodes,reset){
//         var curHeight = 0;
//         nodes.forEach(function(node) {
//             if(reset){
//                 var node1 = node.getElementsByClassName('park-opener');
//                 if(node1.length>0) {
//                     node1[0].style.height = null;
//                 } else {
//                     node.style.height = null;
//                 }
//             }
//
//             if(node.offsetHeight > curHeight)
//                 curHeight = node.offsetHeight;
//         });
//
//         return curHeight;
//     }
//
//     // begin animation (autoplay)
//     function startAnimating(fps) {
//         fpsInterval = 1000 / fps;
//         then = Date.now();
//         startTime = then;
//         animate();
//     }
//
//     // animate (autoplay)
//     function animate() {
//         requestAnimationFrame(animate);
//
//         now = Date.now();
//         elapsed = now - then;
//         then = now - (elapsed % fpsInterval);
//
//         if(!stop){
//             setBar(elapsed / 5 / 10);
//         } else {
//             setBar(0);
//         }
//
//         if (elapsed > fpsInterval && !stop) {
//             setBar(0);
//             lory_slider.next();
//         }
//     }
//
//     function setBar(width){
//         dotContainer.querySelectorAll('.active span')[0].style.width = width + "%";
//     }
//
//     // reset timer
//     function resetTimer() {
//         now = Date.now();
//         elapsed = now - then;
//         then = now - (elapsed % fpsInterval);
//     }
//
//     // mouseover
//     simple.addEventListener('mouseover', function(e) {
//         stop = true;
//     });
//
//     // mouseout
//     simple.addEventListener('mouseout', function(e) {
//         resetTimer();
//         stop = false;
//     });
//
//     simple.addEventListener('before.lory.init', handleDotEvent);
//     simple.addEventListener('after.lory.init', handleDotEvent);
//     simple.addEventListener('after.lory.slide', handleDotEvent);
//     simple.addEventListener('on.lory.resize', function(e){
//         handleDotEvent(e);
//         setSliderHeights(true);
//     });
//
//     var lory_slider;
//     setTimeout(function(){
//         setSliderHeights();
//
//         lory_slider = window.lory(simple, {
//             infinite: 1,
//             rewind: true,
//             ease: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
//             enableMouseEvents: true
//         });
//         setSliderHeights();
//         startAnimating(.2); // every five seconds
//     },400);
// };
