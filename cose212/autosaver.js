class AutoSaverSwalError extends Error {
  constructor(title, message, level, callback) {
    super();
    this.title = title;
    this.message = message;
    this.level = level;
    this.callback = callback; // 인자로 넘길 때 scope binding 해줘야 의도한 대로 동작함.
  }
}

class AutoSaver {
  constructor(sleepMs) {
    this.timer = -1;
    this.sleepMs = (sleepMs && sleepMs > 0) ? sleepMs : 500;
  }

  /** 
   * 제출 날짜가 지났는지 확인함.
   */
  isOutOfDue (dueString) {
    /** format: 2111-01-10 24:00 */
    const [, year, month, day, hours, minutes] = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/.exec(dueString);
    const dueDate = new Date(year, month - 1, day, hours, minutes);
    return Date.now() > dueDate;
  }


  async validateLogin () {
    const loginRes = await fetch(`/php/validate-login.php`, {
      method: "POST",
    });
    if (!loginRes.ok) throw new AutoSaverSwalError(`Error on /php/validate-login.php`, JSON.stringify(loginRes.status), "error");
    const userName = await loginRes.text();
    if (userName.length === 0) throw new AutoSaverSwalError(`Error on login`, `Name is null??`, "error", alert_login.bind(window));
  }

  async saveValue (problemName, editorValue, dueDate) {
    const saveRes = await fetch(`/php/save.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        problem: problemName,
        contents: editorValue,
        due: dueDate,
      }),
    });

    if (!saveRes.ok) throw new AutoSaverSwalError(`Error on /php/save.php`, JSON.stringify(saveRes.status), "error");
    const saveResData = await saveRes.text();
    switch (saveResData) {
      case "success": return; // 성공 값 명시
      case "abuse": 
        throw new AutoSaverSwalError(`Catch system library`, `The program includes system call. Check your code and delete the usage of system modules`, `error`, editor.focus.bind(editor));
      case "length": 
        throw new AutoSaverSwalError(`Limited length`, `Your code is too large. please reduce it`, `error`, editor.focus.bind(editor));
      case "over": 
        throw new AutoSaverSwalError(`Over due date`, `Since the due date is over, submit function is closed.`, `error`, editor.focus.bind(editor));
      default: 
        throw new AutoSaverSwalError(`Fail to save`, `Try again to submit your code. If the error is continuously occured, please contact us.`, `error`, editor.focus.bind(editor));
    }
  }

  /**
   * 메인 함수
   */
  async runner () {
    const hw_selected = vm.hw_selected;
    const problem_selected = vm.problem_selected;
    if (problem_selected === -1 || hw_selected === -1) return;
    if (!("name" in problemSet[problem_selected]) || !("term" in problemSet[problem_selected])) return;
    const problemName = problemSet[problem_selected].name;
    const dueDate = problemSet[problem_selected].term;
    if (this.isOutOfDue(dueDate)) return;
    /**
     * 저장 요청은 this.sleepMs 이후에 보내는데 그 값은
     * this.sleepMs 이전에 미리 할당해 놓는다. 
     * 요청을 보내기 전에 사용자가 메뉴 이동을 하면 값이 꼬일 수 있기 때문.
     */
    const editorValue = editor.getValue();
    /**
     * 메뉴에서 문제 불러올 때 빈 값으로 호출되는 경우가 있음.
     * 제일 위험한 경우이므로 입력 값이 없으면 저장하지 않도록 함.
     */
    if(editorValue.trim().length === 0) return;

    clearInterval(this.timer);
    this.timer = setTimeout(async () => {
      this.validateLogin()
      .then(() => this.saveValue(problemName, editorValue, dueDate))
      .catch(err => {
        if(err instanceof AutoSaverSwalError)
        {
          swal(err.title, err.message, err.level)
          .then(() => {
            if(err.callback) err.callback();
          });
        }
        else // Handle uncaught errors
        {
          swal("Error on AutoSaver", JSON.stringify(err, Object.getOwnPropertyNames(err)), "error");
        }
      });
    }, this.sleepMs);
  }
}

/**
 * 함수가 동작하는데 필수적인 값이 로드될 때까지
 * 비동기적으로 계속 확인함.
 */
const dependencyCheckAndRun = () => {
  if(window.autoSaver) return;
  if(
    window.editor === undefined || window.editor === null ||
    window.vm === undefined || window.vm === null ||
    window.problemSet === undefined || window.problemSet === null ||
    window.alert_login === undefined || window.alert_login === null ||
    window.swal === undefined || window.swal === null
  )
  {
    return setTimeout(dependencyCheckAndRun, 100);
  }

  window.autoSaver = new AutoSaver();
  editor.on("change", window.autoSaver.runner.bind(window.autoSaver));
  console.log(`[AUTOSAVER] script loaded!`);
}
dependencyCheckAndRun();
