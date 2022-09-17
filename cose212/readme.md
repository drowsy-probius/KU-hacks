# tryml 자동저장 스크립트

VSCode에서 autoSave - afterDelay와 비슷하게 동작합니다.

사용자 입력 이후 500ms 이후에 자동으로 저장합니다. 만약 그 시간 이내에 새로운 입력이 들어오면 이전 요청은 취소됩니다.

Tampermonkey 등으로 로드하면 됩니다.

서버 관리자라면 
```html
<script src="https://cdn.jsdelivr.net/gh/drowsy-probius/KU-hacks@main/cose212/raw.js"></script>
```
또는
```javascript
const script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/gh/drowsy-probius/KU-hacks@main/cose212/raw.js";
document.body.appendChild(script);
```
으로 추가해주면 됩니다.

스크립트 사용으로 인한 책임은 사용자 본인에게 있습니다.
