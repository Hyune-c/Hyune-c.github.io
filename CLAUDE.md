# CLAUDE.md

최병현 이력서/포트폴리오 사이트 (Astro 정적 사이트, GitHub Pages).

## 언어 정책 (필수)

이 사이트는 **한국어(기본)와 영어를 항상 함께** 제공한다.
앞으로 추가/수정하는 **모든 콘텐츠는 글이든 그림이든 영어 버전을 반드시 포함**한다.

- **글(텍스트)**: 한국어 콘텐츠를 추가하면 동일 내용의 영어 버전을 같은 PR에서 함께 만든다.
- **그림(다이어그램/스크린샷)**: 이미지 안에 텍스트가 들어가면 영어를 포함한다.
  - 가능하면 영어 라벨/캡션을 넣고, 한·영 화면이 다르면 영어 이미지도 함께 제공한다.
  - 최소한 마크다운 이미지의 `alt` 텍스트는 해당 언어(한글 파일=한글, `.en.md`=영어)로 작성한다.

한쪽 언어만 갱신하고 다른 쪽을 빠뜨리지 않는다. 둘은 항상 동기화 상태를 유지한다.

## 구조

- 한국어가 기본 경로(`/`, `/portfolio/...`), 영어는 `/en/` 프리픽스 경로.
- 콘텐츠 컬렉션 (`src/content.config.ts`)
  - `portfolio` — 한국어. 패턴 `**/*.md` (단 `*.en.md` 제외).
  - `portfolioEn` — 영어. 패턴 `**/*.en.md`. `generateId`로 `.en` 을 제거해 slug 를 한글과 일치시킴.
- 포트폴리오 글: 한국어 `X.md` 와 영어 `X.en.md` 를 **같은 폴더**에 둔다.
  - `./assets/...` 이미지를 공유하므로 에셋을 중복 생성하지 않는다.
- 페이지
  - 한국어: `src/pages/index.astro`, `src/pages/portfolio/...`
  - 영어: `src/pages/en/index.astro`, `src/pages/en/portfolio/...`
- `Base.astro`/`Sidebar.astro` 는 경로로 언어를 감지해 `lang` 속성·링크 프리픽스·회사명·언어 토글을 분기한다.
- 좌하단 컨트롤: 다크모드 → 언어 토글(KO/EN) → 인쇄 순서. 토글은 현재 페이지의 반대 언어 경로로 이동한다.

## `.en.md` 작성 규칙

- frontmatter 키는 그대로 두고 `title`·`summary` 값만 영어로 번역.
- `company` 는 영어 표기로: `Sionic AI`, `Wrtn`, `Kurly Pay`, `Marketboro`, `Essays`.
- `companySlug`·`order`·`tags`·`group`·`period` 는 변경하지 않는다 (`tags` 는 기술 용어이므로 번역 금지).
- 본문 내부 링크는 `/en/portfolio/...` 로 작성한다.
- 이미지 경로·코드 블록·URL·마크다운 구조는 한글 원본과 동일하게 유지한다.

## 빌드

- 개발: `npm run dev`
- 빌드: `npm run build` (한·영 페이지가 모두 생성되는지 확인)
