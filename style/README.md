# mkdocs-material 테마 커스터마이징 scss

해당 폴더에 있는 리소스는 mkdocs-material 테마의 scss 파일을 커스터마이징하기 위한 파일들입니다.

[mkdocs-material](https://github.com/squidfunk/mkdocs-material/tree/master/src/templates/assets/stylesheets) 저장소의 원본 테마 scss 파일을 참고하여 scss 파일 컴파일한뒤 svg 추출 등을 위해 postcss로 컴파일하여 사용합니다.

## 컴파일 방법

1.최초 1회 패키지 파일을 설치합니다. (nodejs가 설치되어 있어야 합니다.)

```bash
npm install
```

2.해당 스크립트를 실행합니다

```bash
npm run build
```

3.테마 템플릿 스타일시트 경로에 컴파일 된 파일이 위치됩니다.

```bash
template
├── assets
│   └── stylesheets
│       ├── main.min.css
│       └── palette.min.css
```

## css 추가 시

해당 테마 파일은 커스텀시에 기존 테마 파일을 직접 수정하는 방법보다 덮어쓰기 방식으로 커스텀하는 것을 권장합니다.
style/scss/_custom.scss 에서 추가하여 사용 가능합니다.
