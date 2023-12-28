// ==UserScript==
// @name         steambackgroundchanger
// @namespace    https://github.com/yea
// @version      1.0
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

        function handleEnterKeyPress() {
            var inputValue = inputElement.value;
            console.log('Submitted:', inputValue);

            var elementsWithClass = document.getElementsByClassName('no_header profile_page has_profile_background full_width_background');

            if (elementsWithClass.length > 0) {
                elementsWithClass[0].style.backgroundImage = `url('${inputValue}')`;
            }

            inputElement.value = '';
        }
    }

})();