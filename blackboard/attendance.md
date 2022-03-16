출석체크 자율화가 적용된 수업은 고대 인 클래스 앱에서만 출석체크(입실, 퇴실)가 가능했다.

2022년 1학기부터 블랙보드 웹 내에서 출석체크(퇴실은 자동체크)가 가능하도록 기능이 추가되었다.

웹에서 출석을 요청하는 주소를 따서 수동으로 요청을 날려보니 제대로 작동한다.

url만 가지고 있으면 블랙보드에 로그인 하지 않고도 출석처리가 가능하다.

출석 기한이 지난 이전 강의나 미래 강의도 출석처리가 가능하다. 

그렇지만 퇴실시간은 제대로 나오나 입실 시간은 무조건 요청을 날린 시점으로 입력되기에 악용 하면 걸릴 확률이 매우 크다.

악용 목적으로 사용하지 않기를 바란다.

```
- Request URL: 
https://kulms.korea.ac.kr/webapps/bbgs-AttendantManagementSystem-BB5d3914f35b4ad/onlineAttendance
bbgs-AttendantManagementSystem-{BB5d3914f35b4ad} 이 부분은 버전이 업그레이드되면 변경될 것으로 예상됨.

- Request Method: 
POST 또는 GET

- payload: 
course_id: {년도}{학기1|2}R{0136?}{학수번호}{분반} // 코스 목록에서 과목 이름 위에 표시되는 문자열
course_pk: {6자리 숫자} // 과목 세부 페이지의 주소에서 https://kulms.korea.ac.kr/ultra/courses/_{이부분}_1/cl/outline
firstname: 김철수
course_name: 221R [서울-학부]과목이름(영어 과목이름))-00분반 // 코스 목록에서 표시되는 과목 이름.
campus_nm: 안암 // 아마 안암 또는 세종 일 것
class_st: yyyy-mm-dd HH:MM:00 // 시작 날짜.시간만 확인해서 항목을 확인하는 것으로 추정됨.
class_en: yyyy-mm-dd HH:MM:00 // 끝 시간은 자동으로 정해지는 것 같은데 자세히 확인은 못했음. 그냥 제대로 채워넣는 것을 추천
faculty: 학부
user_id: {학번} // yyyyddnnnn
department: {한글로 된 학과명} // eg. 컴퓨터학과
```

리턴 값
```
- 성공 시: 
{"nowTime":"yyyy-mm-dd HH:MM:SS","success_code":"success"}

- 이미 출석한 상태:
{"atdTime":"yyyy-mm-dd HH:MM:SS","error_code":"103"}
```