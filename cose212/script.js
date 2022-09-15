// ==UserScript==
// @name         오프언 자동저장
// @version      1.0
// @description  tryml.korea.ac.kr 사이트에서 편집 내용을 자동 저장합니다.
// @match        https://tryml.korea.ac.kr/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  window.autoSaverLastTime = 0;
  window.autoSaverSleepMs = 500;
  const autoSaver = async () => {
    const isOutOfDue = (dueString) => {
      /** format: 2111-01-10 24:00 */
      const [, year, month, day, hours, minutes] = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/.exec(dueString);
      const dueDate = new Date(year, month - 1, day, hours, minutes);
      return Date.now() > dueDate;
    }

    const hw_selected = vm.hw_selected;
    const problem_selected = vm.problem_selected;
    if (problem_selected === -1 || hw_selected === -1) return;
    if (!("name" in problemSet[problem_selected]) || !("term" in problemSet[problem_selected])) return;
    const Problemname = problemSet[problem_selected].name;
    const due_date = problemSet[problem_selected].term;
    if (isOutOfDue(due_date)) return;
    const editorValue = editor.getValue();

    if (Date.now() - window.autoSaverLastTime < window.autoSaverSleepMs)
      return console.log(`[AUTOSAVER] sleep for a while due to too many requests.`);

    const loginRes = await fetch(`/php/validate-login.php`, {
      method: "POST",
      cache: "no-cache"
    });
    if (!loginRes.ok) return alert_login();
    const userName = await loginRes.text();
    if (userName.length === 0) return alert_login();

    const params = {
      problem: Problemname,
      contents: editorValue,
      due: due_date,
    }
    const formBody = Object.keys(params).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join("&");

    const saveRes = await fetch(`/php/save.php`, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formBody,
    });
    window.autoSaverLastTime = Date.now();

    if (!saveRes.ok) {
      return swal("Submit Error", JSON.stringify(await saveRes.text()), "error");
    }
    const saveResData = await saveRes.text();
    switch (saveResData) {
      case "success":
        return;
      case "abuse":
        await swal("Catch system library", "The program includes system call. Check your code and delete the usage of system modules", "error")
        return editor.focus();
      case "length":
        await swal("Limited length", "Your code is too large. please reduce it", "error");
        return editor.focus();
      case "over":
        await swal("Over due date", "Since the due date is over, submit function is closed.", "error");
        return editor.focus();
      default:
        await swal("Fail to save", "Try again to submit your code. If the error is continuously occured, please contact us.", "error");
        return editor.focus();
    }
  }

  // editor.on("input", autoSaver)
  editor.on("change", autoSaver);
  console.log(`[AUTOSAVER] script loaded!`);
})();