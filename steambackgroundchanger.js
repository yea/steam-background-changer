// ==UserScript==
// @name         steambackgroundchanger
// @namespace    https://github.com/yea/steam-background-changer
// @version      1.1
// @description  easily preview steam backgrounds on any profile, including yours or anyone else's, before purchasing
// @author       neversince
// @match        https://steamcommunity.com/id/*
// @match        https://steamcommunity.com/profiles/*
// @icon         https://steamcommunity.com/favicon.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var existingElement = document.querySelector('.responsive_status_info');

    if (existingElement) {
        var inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.placeholder = 'enter new background url';

        inputElement.style.width = '260px';

        inputElement.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                handleEnterKeyPress();
            }
        });

        existingElement.appendChild(inputElement);

        function hasFileExtension(filename, extension) {
            return filename.endsWith(`.${extension}`);
        }

        function doesClassExist(className) {
            var elementsWithClass = document.getElementsByClassName(className);
            return elementsWithClass.length > 0;
        }

        function getCurrentBackgroundType() {
            if (doesClassExist('profile_animated_background')) {
                return 'animated';
            } else if (doesClassExist('no_header profile_page ')) {
                var elementsWithClass = document.getElementsByClassName('no_header profile_page ');

                if (elementsWithClass[0].style.cssText.trim() !== '') {
                    return 'static';
                } else {
                    return 'none';
                }
            } else {
                return 'none';
            }
            
        }

        function handleStaticBackround(inputValue, currentBackgroundType) {
            if (currentBackgroundType == 'animated') {
                var elementsToRemove = document.getElementsByClassName('profile_animated_background');
                elementsToRemove[0].remove();
            }

            var elementsWithClass = document.getElementsByClassName('no_header profile_page ');

            if (elementsWithClass.length > 0) {
                elementsWithClass[0].classList.add('has_profile_background');
                elementsWithClass[0].classList.add('full_width_background');
                elementsWithClass[0].style.backgroundImage = `url( '${inputValue}' )`;
            }
        }

        function handleAnimatedBackround(inputValue, currentBackgroundType) {
            if (currentBackgroundType == 'static' || currentBackgroundType == 'none') {
                var targetElement = document.querySelector('.no_header.profile_page');

                if (targetElement) {
                    targetElement.classList.add('has_profile_background');
                    targetElement.classList.add('full_width_background');

                    var animatedBackgroundDiv = document.createElement('div');
                    animatedBackgroundDiv.classList.add('profile_animated_background');

                    var videoElement = document.createElement('video');
                    videoElement.setAttribute('playsinline', '');
                    videoElement.setAttribute('autoplay', '');
                    videoElement.setAttribute('muted', '');
                    videoElement.setAttribute('loop', '');

                    var sourceMp4 = document.createElement('source');
                    sourceMp4.setAttribute('src', inputValue);
                    sourceMp4.setAttribute('type', 'video/mp4');

                    videoElement.appendChild(sourceMp4);

                    animatedBackgroundDiv.appendChild(videoElement);

                    targetElement.appendChild(animatedBackgroundDiv);

                    targetElement.insertBefore(animatedBackgroundDiv, targetElement.firstChild);
                }
            } else {
                var elementsWithClass = document.getElementsByClassName('profile_animated_background');

                if (elementsWithClass.length > 0) {
                    var videos = document.querySelectorAll('video');
                    videos.forEach(function(video) {
                        var sources = video.getElementsByTagName('source');
                        for (var i = 0; i < sources.length; i++) {
                            if (sources[i].type === 'video/mp4') {
                                sources[i].src = inputValue;
                            }
                        }
                        video.load();
                    });
                }
            }
        }

        function handleEnterKeyPress() {
            var inputValue = inputElement.value;
            console.log(`Submitted: ${inputValue}`);

            var currentBackgroundType = getCurrentBackgroundType();

            if (hasFileExtension(inputValue, 'webm') == true || hasFileExtension(inputValue, 'mp4') == true) {
                handleAnimatedBackround(inputValue, currentBackgroundType);
            } else if (hasFileExtension(inputValue, 'jpg') == true) {
                handleStaticBackround(inputValue, currentBackgroundType);
            }

            inputElement.value = '';
        }
    }

})();