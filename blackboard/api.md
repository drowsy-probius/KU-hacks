고려대학교에 국한된 것이 아니라 블랙보드 플랫폼 자체에는 여러 api가 존재한다.

대부분의 중요/민감한 데이터를 다루는 api는 관리자만 접근이 가능하지만 소소한 것들은 일반 유저의 권한으로도 접근이 가능하다.

여기서는 몇가지 api만 소개하고 전체 목록은 [공식 사이트](https://developer.blackboard.com/portal/displayApi) 를 확인하자.

일단 블랙보드에 로그인 된 상태를 전제한다.

- 블랙보드의 버전 확인
```
https://kulms.korea.ac.kr/learn/api/public/v1/system/version

{"learn":{"major":3900,"minor":34,"patch":0,"build":"rel.51+f0d11c8"}}
```

- 블랙보드에 등록된 전체 유저 목록
```
https://kulms.korea.ac.kr/learn/api/public/v1/users?offset=100
```

- 블랙보드에 등록된 유저 검색 (id 또는 학번)
```
유저_id는 _000000_0의 형태임. 학번으로 우선 검색하면 리턴 데이터 중에 있음.

https://kulms.korea.ac.kr/learn/api/public/v1/users/{유저_id}
https://kulms.korea.ac.kr/learn/api/public/v1/users/userName:{학번}
```

- 본인이 수강 중인 과목 목록. 타인 것은 열람할 수 없다.
```
https://kulms.korea.ac.kr/learn/api/public/v1/users/userName:{내 학번}/courses
https://kulms.korea.ac.kr/learn/api/public/v1/users/_000000_0/courses
```

- 전체 강의 목록
```
https://kulms.korea.ac.kr/learn/api/public/v3/courses/?offset=130000
```

- 전체 학기 목록
```
https://kulms.korea.ac.kr/learn/api/public/v1/terms
```

- 강의 정보 확인
```
courseId:20201RKUOE00105 또는 id: _196473_1
courseId로 접근했을 때는 권한 에러가 발생하는 경우가 있음.

https://kulms.korea.ac.kr/learn/api/public/v1/courses/courseId:20201RKUOE00105
https://kulms.korea.ac.kr/learn/api/public/v1/courses/_196473_1
```

- 강의 수강 중인 사용자 목록. 수강 중이 아니어도 가능
```
https://kulms.korea.ac.kr/learn/api/public/v1/courses/courseId:20201RKUOE00105/users
https://kulms.korea.ac.kr/learn/api/public/v1/courses/_196473_1/users
```

- 강의 컨텐츠 열람. 수강 중이 아니어도 가능
```
https://kulms.korea.ac.kr/learn/api/public/v1/courses/courseId:20201RKUOE00105/contents
https://kulms.korea.ac.kr/learn/api/public/v1/courses/_196473_1/contents
```

- 일정 확인
```
https://kulms.korea.ac.kr/learn/api/public/v1/calendars/items
```

- 블랙보드 활동 스트림 (불확실)
```
https://kulms.korea.ac.kr/learn/api/v1/streams/ultra

세션키 필요한 것으로 생각됨. 2번 요청으로 이루어져 있음

payload 1
{"providers":{},"forOverview":false,"retrieveOnly":false,"flushCache":false}

response 1
{"sv_moreData":true,"sv_streamEntries":[],"sv_providers":[{"sp_newest":-1,"sp_oldest":9007199254740992,"sp_refreshDate":1647402616913,"sp_provider":"bb_deployment"}],"sv_deletedIds":[],"sv_extras":{"sx_users":[],"sx_filters":[],"sx_filter_links":[],"sx_courses":[]},"sv_autoDisplayGracePeriodSeconds":5,"sv_now":1647402616922}


payload 2
{"providers":{"bb_deployment":{"sp_provider":"bb_deployment","sp_newest":-1,"sp_oldest":9007199254740992,"sp_refreshDate":1647402616913}},"forOverview":false,"retrieveOnly":true,"flushCache":false}

response 2
-> 여기에 활동 스트림 목록 담김.
```

- 강의 세부 정보 확인
```
https://kulms.korea.ac.kr/learn/api/v1/courses/_{course_pk}_1
?expand=instructorsMembership,+instructorsMembership.courseRole,+effectiveAvailability,+isChild
```