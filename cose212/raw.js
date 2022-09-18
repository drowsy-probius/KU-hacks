class AutoSaver {
  constructor() {
    this.timer = -1;
    this.sleepMs = 500;
  }

  isOutOfDue (dueString) {
    /** format: 2111-01-10 24:00 */
    const [, year, month, day, hours, minutes] = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/.exec(dueString);
    const dueDate = new Date(year, month - 1, day, hours, minutes);
    return Date.now() > dueDate;
  }

  async validateLogin () {
    const loginRes = await fetch(`/php/validate-login.php`, {
      method: "POST",
      cache: "no-cache"
    });
    if (!loginRes.ok) return swal("Error on /php/validate-login.php", JSON.stringify(loginRes.status), "error");
    const userName = await loginRes.text();
    if (userName.length === 0) return alert_login();
  }

  async saveValue (problemName, editorValue, dueDate) {
    const params = {
      problem: problemName,
      contents: editorValue,
      due: dueDate,
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

    if (!saveRes.ok) return swal("Error on /php/save.php", JSON.stringify(saveRes.status), "error");
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

  async runner () {
    const hw_selected = vm.hw_selected;
    const problem_selected = vm.problem_selected;
    if (problem_selected === -1 || hw_selected === -1) return;
    if (!("name" in problemSet[problem_selected]) || !("term" in problemSet[problem_selected])) return;
    const problemName = problemSet[problem_selected].name;
    const dueDate = problemSet[problem_selected].term;
    if (this.isOutOfDue(dueDate)) return;
    const editorValue = editor.getValue();
    if(editorValue.trim().length === 0) return;

    clearInterval(this.timer);
    this.timer = setTimeout(async () => {
      this.validateLogin()
      .then(() => this.saveValue(problemName, editorValue, dueDate))
      .catch(err => { // Handle uncaughted errors
        swal("Error on AutoSaver", JSON.stringify(err), "error");
      });
    }, this.sleepMs);
  }
}

if(window.autoSaver) return;
window.autoSaver = new AutoSaver();
editor.on("change", window.autoSaver.runner.bind(window.autoSaver));
console.log(`[AUTOSAVER] script loaded!`);