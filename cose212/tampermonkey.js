// ==UserScript==
// @name         오프언 자동저장
// @version      1.0
// @description  tryml.korea.ac.kr 사이트에서 편집 내용을 자동 저장합니다.
// @match        https://tryml.korea.ac.kr/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/gh/drowsy-probius/KU-hacks@main/cose212/autosaver.min.js";
  script.setAttribute("data-sourcecode", "https://github.com/drowsy-probius/KU-hacks/blob/main/cose212/autosaver.js");
  document.body.appendChild(script);
})();