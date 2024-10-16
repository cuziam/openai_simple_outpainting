# OpenAI Simple Outpainting 도구

이 도구는 OpenAI의 API를 사용하여 이미지를 원래 경계 너머로 확장하는 간단한 아웃페인팅 도구입니다. 기존 이미지를 매끄럽게 확장해야 하는 창의적인 프로젝트에 적합합니다.

## 주요 기능
- **자동 이미지 확장**: OpenAI의 아웃페인팅 모델을 사용하여 기존 이미지를 매끄럽게 확장합니다.
- **사용자 지정 프롬프트**: 사용자가 직접 설명을 입력하여 아웃페인팅 과정을 안내하고, 더 맥락에 맞는 결과를 얻을 수 있습니다.
- **다중 이미지 생성**: 아웃페인팅된 이미지의 다양한 버전을 몇 개나 생성할지 지정할 수 있습니다.
- **간편한 워크플로우**: 최소한의 수동 개입으로 쉽게 설정할 수 있습니다. 이미지와 마스크만 제공하면 나머지는 도구가 처리합니다.

## 요구 사항

이 도구를 실행하기 전에 다음 항목이 준비되어 있어야 합니다:
- 시스템에 Node.js가 설치되어 있어야 합니다.
- 유효한 OpenAI API 키. 이 키를 `.env` 파일에 `OPENAI_API_KEY`로 추가해야 합니다.
- 사용할 이미지는 `src` 폴더에 있어야 하며, 소스 이미지와 마스크 이미지의 해상도가 일치해야 합니다.

## 설치 방법

1. **레포지토리 클론**:
    ```sh
    git clone https://github.com/cuziam/openai_simple_outpainting.git
    cd openai_simple_outpainting
    ```

2. **필요한 의존성 설치**:
    ```sh
    npm install
    ```

3. **환경 변수 설정**:
    루트 디렉토리에 `.env` 파일을 생성하고 OpenAI API 키를 추가합니다:
    ```
    OPENAI_API_KEY=your_openai_api_key_here
    ```

## 블로그 링크

이 도구와 코드에 대한 자세한 설명은 [여기](https://cuziam.tistory.com/entry/openAI-api%EB%A1%9C-%EC%95%84%EC%9B%83%ED%8E%98%EC%9D%B8%ED%8C%85%EC%9D%84-%EC%95%BC%EB%A7%A4%EB%A1%9C-%EC%8B%B8%EA%B2%8C-%EC%9D%B4%EC%9A%A9%ED%95%98%EA%B3%A0-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0)에서 확인할 수 있습니다.

1. **이미지 준비**:
   - 소스 이미지(`src.png`)와 마스크 이미지(`mask.png`)를 `src` 폴더에 넣습니다.
   - 두 이미지의 해상도가 동일한지 확인합니다.

2. **도구 실행**:
    ```sh
    node app.js
    ```

3. **사용자 입력**: 스크립트가 이미지를 처리할지 묻는 메시지를 표시합니다. `y`를 입력하여 진행합니다.

4. **결과물**: 결과 이미지는 `dest` 폴더에 저장됩니다.

## 설정 방법
`app.js`의 `config` 객체를 수정하여 일부 설정을 변경할 수 있습니다:
- `srcImageName`: 소스 이미지 파일의 이름.
- `maskImageName`: 마스크 이미지 파일의 이름.
- `theNumberOfImages`: 생성하고자 하는 이미지의 버전 수.
- `yourPrompt`: 아웃페인팅 과정을 안내할 설명.

## 주의사항
- 마스크 이미지와 소스 이미지의 해상도가 동일해야 오류가 발생하지 않습니다.
- 필요한 폴더(`src`, `rgba`, `dest`)가 없을 경우 자동으로 생성됩니다.
- 이 도구는 이미지 변환을 위해 Sharp, HTTP 요청 처리를 위해 Axios, 이미지 생성을 위해 OpenAI API를 사용합니다.

## 예시
달빛 아래 춤추는 사람들의 실루엣 이미지를 확장하고 싶다면 `app.js`의 `yourPrompt`를 다음과 같이 설정할 수 있습니다:
```js
  yourPrompt: "the illustration of the silhouettes of men and women dancing under the moon at night"
```
스크립트를 실행한 후, 주어진 설명을 바탕으로 주변 장면을 채워넣은 확장된 이미지를 얻을 수 있습니다.

## 라이선스
이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 LICENSE 파일을 참조하세요.

## 기여
프로젝트를 포크하고 풀 리퀘스트를 제출하여 기여할 수 있습니다. 제안이나 개선 사항은 언제든지 환영합니다!
