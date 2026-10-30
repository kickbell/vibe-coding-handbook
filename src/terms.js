import * as U from './demos/ui'
import * as B from './demos/ui2'
import * as M from './demos/motion'
import * as D from './demos/dev'

// extra: { aka: 다른 이름들, adv: '알면 좋음' 단계, playground: 체험 화면 id }
const t = (id, en, ko, Demo, desc, prompt, extra = {}) => ({ id, en, ko, Demo, desc, prompt, aka: [], adv: false, ...extra })

export const GROUPS = [
  {
    id: 'ui',
    short: 'UI',
    title: 'UI 필수 용어',
    intro: '화면을 이루는 부품과 배치 이름이에요. AI에게 "이런 거"라고 말하는 대신 이름으로 부르세요.',
    sections: [
      {
        id: 'layout',
        title: '레이아웃',
        en: 'Layout',
        items: [
          t('hero-section', 'Hero Section', '첫 화면의 대표 영역', U.HeroSection, '사이트에 들어오자마자 보이는 첫 화면이에요. 큰 제목, 짧은 설명, 행동 버튼(CTA)이 들어가요.', '랜딩 페이지 맨 위에 히어로 섹션을 만들어줘. 큰 제목, 한 줄 설명, "시작하기" 버튼을 넣고 화면 높이의 80%를 차지하게 해줘.', { aka: ['히어로 배너', 'Hero Banner', '메인 비주얼', '첫 화면'] }),
          t('responsive-layout', 'Responsive Layout', '화면 폭에 맞춘 배치', U.ResponsiveLayout, '화면 크기에 따라 배치가 바뀌는 방식이에요. PC에서는 3열, 모바일에서는 1열처럼요.', '카드 목록을 반응형으로 만들어줘. 데스크톱 3열, 태블릿 2열, 모바일(768px 이하)은 1열로.', { aka: ['반응형', '반응형 웹', '모바일 대응'] }),
          t('card-layout', 'Card Layout', '정보를 카드로 나누기', U.CardLayout, '정보를 네모난 카드 단위로 나눠 보여줘요. 상품 목록, 블로그 글 목록에 자주 써요.', '상품을 카드 레이아웃으로 보여줘. 각 카드에 이미지, 이름, 가격이 있고 모서리는 둥글게 해줘.', { aka: ['카드', '그리드'] }),
          t('bento-grid', 'Bento Grid', '크기 다른 카드 격자', U.BentoGrid, '도시락(벤토)처럼 크기가 다른 칸을 격자로 배치해요. 제품 기능 소개 페이지에서 자주 보여요.', '기능 소개를 벤토 그리드로 만들어줘. 4열 격자에 첫 카드는 2x2 크기, 나머지는 1x1과 2x1을 섞어서.', { aka: ['벤토', '격자'], adv: true }),
          t('sidebar-layout', 'Sidebar Layout', '옆에 고정된 메뉴', U.SidebarLayout, '한쪽에 메뉴가 고정되고 다른 쪽 내용만 바뀌어요. 관리자 화면, 대시보드의 기본 구조예요.', '대시보드를 사이드바 레이아웃으로 만들어줘. 왼쪽 240px 고정 메뉴, 현재 메뉴는 강조 표시, 오른쪽은 콘텐츠 영역.', { aka: ['사이드바', 'LNB', '왼쪽 메뉴', '대시보드'] }),
          t('sticky-header', 'Sticky Header', '스크롤해도 남는 헤더', U.StickyHeader, '스크롤을 내려도 상단 메뉴가 화면 위에 붙어 있어요.', '헤더를 sticky로 만들어줘. 스크롤해도 상단에 고정되고, 스크롤이 시작되면 아래쪽에 그림자가 생기게.', { aka: ['고정 헤더', 'fixed header', '상단 고정'] }),
          t('split-layout', 'Split Layout', '좌우 분할 배치', U.SplitLayout, '화면을 둘로 나눠 한쪽엔 글, 한쪽엔 이미지를 둬요. 로그인 화면, 소개 섹션에 많이 써요.', '소개 섹션을 좌우 분할 레이아웃으로 만들어줘. 왼쪽은 제목·설명·버튼, 오른쪽은 이미지. 모바일에서는 위아래로 쌓이게.', { aka: ['2단', '좌우 분할', '스플릿'] }),
        ],
      },
      {
        id: 'navigation',
        title: '내비게이션',
        en: 'Navigation',
        items: [
          t('navigation-bar', 'Navigation Bar', '맨 위 메뉴 줄', B.NavigationBar, '사이트 맨 위에서 페이지를 이동하는 메뉴 줄이에요. 로고, 메뉴, 버튼이 들어가요.', '상단 내비게이션 바를 만들어줘. 왼쪽에 로고, 가운데에 홈/소개/작업/문의 메뉴, 현재 페이지 메뉴는 강조 표시.', { aka: ['내비게이션 바', 'Navbar', 'GNB', '헤더', '상단 메뉴', '네비게이션'] }),
          t('hamburger-menu', 'Hamburger Menu', '세 줄 메뉴 버튼', B.HamburgerMenu, '줄 세 개(☰) 아이콘이에요. 누르면 숨어 있던 메뉴가 열려요. 화면이 좁은 모바일에서 거의 항상 써요.', '모바일에서는 상단 메뉴를 햄버거 아이콘으로 바꿔줘. 누르면 전체 화면 메뉴가 위에서 내려오고, 아이콘은 X로 바뀌게.', { aka: ['햄버거', '햄버거 버튼', '모바일 메뉴', '☰'] }),
          t('bottom-navigation', 'Bottom Navigation', '하단 탭 바', B.BottomNavigation, '앱 화면 맨 아래에 고정된 아이콘 메뉴예요. 엄지로 누르기 쉬워서 모바일 앱의 기본이에요.', '모바일 화면 하단에 바텀 내비게이션을 만들어줘. 홈/검색/찜/MY 4개 탭, 아이콘과 이름, 선택된 탭은 주황색으로.', { aka: ['바텀바', '바텀 탭', '탭바', 'Tab Bar', '하단 메뉴'] }),
          t('breadcrumb', 'Breadcrumb', '지금 위치 경로', B.Breadcrumb, '"홈 › 상품 › 신발"처럼 지금 어디에 있는지 보여주는 경로예요. 앞쪽을 누르면 상위로 돌아가요.', '상품 상세 페이지 위에 브레드크럼을 넣어줘. "홈 › 카테고리 › 상품명" 형식, 각 단계는 클릭하면 그 페이지로 이동.', { aka: ['빵부스러기', '경로', '현재 위치'] }),
          t('pagination', 'Pagination', '페이지 번호', B.Pagination, '목록이 길 때 "1 2 3 4 5"처럼 페이지를 나눠서 보여줘요.', '게시글 목록에 페이지네이션을 넣어줘. 한 페이지에 10개씩, 아래에 이전/다음 화살표와 페이지 번호, 현재 페이지는 강조.', { aka: ['페이지네이션', '페이징', '페이지 번호'] }),
          t('footer', 'Footer', '맨 아래 정보 영역', B.Footer, '페이지 맨 아래에 있는 영역이에요. 회사 정보, 약관, SNS 링크 같은 걸 넣어요.', '사이트 맨 아래에 푸터를 만들어줘. 어두운 배경에 3열 링크 목록, 맨 아래에 저작권 문구와 이용약관·개인정보처리방침 링크.', { aka: ['푸터', '하단 정보', '바닥글'] }),
        ],
      },
      {
        id: 'input',
        title: '입력',
        en: 'Input',
        items: [
          t('toggle-switch', 'Toggle Switch', '켜고 끄는 스위치', B.ToggleSwitch, '누를 때마다 켜짐/꺼짐이 바뀌는 스위치예요. 알림 설정, 다크 모드에 써요.', '설정 화면에 토글 스위치를 만들어줘. "알림 받기", "다크 모드" 두 개, 켜면 주황색으로 바뀌고 동그라미가 부드럽게 이동.', { aka: ['토글', '스위치', 'on/off'] }),
          t('checkbox-radio', 'Checkbox / Radio', '여러 개 vs 하나만 선택', B.CheckboxRadio, '체크박스(네모)는 여러 개를 고를 수 있고, 라디오(동그라미)는 하나만 고를 수 있어요.', '설문 폼을 만들어줘. "관심 분야"는 체크박스로 여러 개 선택, "연령대"는 라디오 버튼으로 하나만 선택하게.', { aka: ['체크박스', '라디오 버튼', '선택지'] }),
          t('text-field', 'Text Field', '글자 입력 칸', B.TextField, '글자를 입력하는 칸이에요. 위에는 이름표(Label), 아래에는 도움말(Helper text)이 붙어요.', '회원가입 폼에 이메일 입력 칸을 만들어줘. 위에 "이메일" 라벨, 입력 중엔 테두리가 주황색, 아래에 도움말 문구.', { aka: ['인풋', 'Input', '입력창', '텍스트 박스', '폼'] }),
          t('placeholder', 'Placeholder', '비어 있을 때 안내 문구', B.Placeholder, '입력 칸이 비어 있을 때 흐리게 보이는 안내 문구예요. 글자를 치면 사라져요.', '이름 입력 칸에 "이름을 입력하세요" 플레이스홀더를 넣어줘. 연한 회색으로.', { aka: ['플레이스홀더', '안내 문구', '힌트 텍스트'] }),
          t('select', 'Select', '목록에서 고르는 칸', B.Select, '폼 안에서 정해진 목록 중 하나를 고르는 칸이에요. 드롭다운과 비슷하지만 "입력 칸"의 한 종류예요.', '주소 입력 폼에 지역 선택(select)을 넣어줘. 서울/부산/대구/광주 중 하나, 기본값은 "선택해주세요".', { aka: ['셀렉트', '셀렉트 박스', '선택 상자', '콤보박스'] }),
          t('search-bar', 'Search Bar', '검색창', B.SearchBar, '돋보기 아이콘이 있는 검색 입력 칸이에요. 치는 동안 추천 검색어가 뜨기도 해요(자동완성).', '상단에 둥근 검색창을 만들어줘. 왼쪽에 돋보기 아이콘, 입력하는 동안 아래에 추천 검색어를 보여주고 일치하는 글자는 굵게.', { aka: ['검색창', '서치바', '자동완성', 'Autocomplete'] }),
        ],
      },
      {
        id: 'action',
        title: '버튼·행동',
        en: 'Button · Action',
        items: [
          t('cta-button', 'CTA Button', '행동을 부르는 버튼', B.CTAButton, 'Call To Action. "지금 시작하기", "구매하기"처럼 사용자가 꼭 눌렀으면 하는 가장 눈에 띄는 버튼이에요.', '히어로 섹션의 "무료로 시작하기" CTA 버튼을 가장 눈에 띄게 만들어줘. 주황색 배경, 둥근 모양, 은은하게 퍼지는 빛 효과.', { aka: ['CTA', '콜투액션', '행동 버튼', '메인 버튼'] }),
          t('button-hierarchy', 'Primary / Secondary', '버튼의 중요도', B.ButtonHierarchy, '버튼에도 순서가 있어요. Primary(가장 중요, 색 채움), Secondary(보조, 테두리), Text(덜 중요, 글자만).', '폼 하단 버튼을 정리해줘. "저장"은 Primary(주황 배경), "미리보기"는 Secondary(주황 테두리), "취소"는 Text 버튼으로.', { aka: ['프라이머리 버튼', '세컨더리 버튼', '고스트 버튼', '버튼 종류'] }),
          t('fab', 'FAB', '떠 있는 동그란 버튼', B.FAB, 'Floating Action Button. 화면 구석에 떠 있는 동그란 버튼이에요. 누르면 글쓰기 같은 주요 행동이 펼쳐져요.', '모바일 화면 오른쪽 아래에 FAB(플로팅 액션 버튼)를 만들어줘. + 아이콘, 누르면 45도 회전하며 "글쓰기", "사진" 버튼이 위로 펼쳐지게.', { aka: ['플로팅 버튼', 'Floating Action Button', '플러스 버튼'] }),
          t('pull-to-refresh', 'Pull to Refresh', '당겨서 새로고침', B.PullToRefresh, '목록 맨 위에서 아래로 끌어당기면 새로고침되는 동작이에요.', '피드 목록에 pull to refresh를 넣어줘. 맨 위에서 아래로 당기면 로딩 스피너가 돌고, 새 글을 불러와 맨 위에 추가.', { aka: ['당겨서 새로고침', '풀 투 리프레시'] }),
          t('infinite-scroll', 'Infinite Scroll', '끝없이 이어지는 목록', B.InfiniteScroll, '스크롤이 끝에 닿으면 다음 내용을 자동으로 불러와 이어 붙여요. SNS 피드가 대표적이에요.', '상품 목록을 무한 스크롤로 만들어줘. 맨 아래에 닿으면 로딩 스피너를 보여주고 20개씩 더 불러오게.', { aka: ['무한 스크롤', '더보기', 'Load More'] }),
        ],
      },
      {
        id: 'display',
        title: '표시',
        en: 'Display',
        items: [
          t('badge', 'Badge', '숫자·점 알림 표시', B.Badge, '아이콘 모서리에 붙는 작은 숫자나 빨간 점이에요. "새 알림 3개"처럼 확인할 게 있다고 알려줘요.', '종 아이콘 오른쪽 위에 안 읽은 알림 개수 배지를 붙여줘. 빨간 동그라미에 흰 숫자, 9개가 넘으면 "9+".', { aka: ['배지', '뱃지', '알림 숫자', '빨간 점', 'NEW 표시'] }),
          t('avatar', 'Avatar', '프로필 사진 동그라미', B.Avatar, '사용자를 나타내는 동그란 프로필 이미지예요. 사진이 없으면 이니셜이나 기본 아이콘을 보여줘요.', '댓글 옆에 아바타를 보여줘. 프로필 사진이 없으면 이름 첫 글자를 색 동그라미 안에 넣고, 접속 중이면 초록 점 표시.', { aka: ['아바타', '프로필 사진', '프로필 이미지'] }),
          t('chip-tag', 'Chip / Tag', '작은 꼬리표', B.ChipTag, '알약 모양의 작은 꼬리표예요. 누르면 필터가 되기도 하고(Chip), ×로 지울 수 있는 태그도 있어요.', '검색 결과 위에 카테고리 필터 칩을 만들어줘. 디자인/개발/기획/마케팅, 여러 개 선택 가능, 선택하면 검정 배경.', { aka: ['칩', '태그', '필터', '해시태그', 'Pill'] }),
          t('progress-bar', 'Progress Bar', '진행률 막대', B.ProgressBar, '얼마나 진행됐는지 막대나 원으로 보여줘요. 업로드, 회원가입 단계 등에 써요.', '파일 업로드 중에 진행률 막대를 보여줘. 주황색 막대가 차오르고 오른쪽에 퍼센트 숫자 표시.', { aka: ['프로그레스 바', '진행률', '로딩 바', '게이지'] }),
          t('spinner', 'Spinner', '빙글빙글 로딩', B.Spinner, '기다리는 중이라는 걸 알려주는 빙글빙글 아이콘이에요. 얼마나 남았는지 모를 때 써요.', '저장 버튼을 누르면 버튼 안에 작은 로딩 스피너가 돌고 "저장 중"으로 바뀌게 해줘. 끝나면 원래대로.', { aka: ['스피너', '로딩', '로더', 'Loading'] }),
          t('empty-state', 'Empty State', '비어 있을 때 화면', B.EmptyState, '보여줄 내용이 하나도 없을 때의 화면이에요. 그냥 비워두지 않고 안내와 다음 행동 버튼을 보여줘요.', '찜 목록이 비어 있을 때 빈 상태 화면을 보여줘. 가운데에 상자 아이콘, "아직 찜한 상품이 없어요" 문구, "둘러보기" 버튼.', { aka: ['빈 화면', '엠티 스테이트', '결과 없음'] }),
        ],
      },
      {
        id: 'component',
        title: '컴포넌트',
        en: 'Component',
        items: [
          t('tabs', 'Tabs', '같은 자리 내용 전환', U.Tabs, '버튼을 누르면 같은 자리의 내용이 바뀌어요. 공간을 아끼면서 여러 정보를 보여줄 때 써요.', '상품 상세에 탭을 만들어줘. "상세정보 / 리뷰 / 문의" 3개 탭, 선택된 탭 아래 밑줄이 미끄러지듯 이동하게.', { aka: ['탭', '탭 메뉴'] }),
          t('accordion', 'Accordion', '펼치고 접는 목록', U.Accordion, '제목을 누르면 아래 내용이 펼쳐지고, 다시 누르면 접혀요. FAQ(자주 묻는 질문)에 거의 항상 쓰여요.', '', { playground: 'accordion', aka: ['아코디언', '접는 메뉴', 'FAQ', '펼치기', 'Collapse'] }),
          t('modal', 'Modal / Dialog', '화면 위 확인 창', U.Modal, '화면 위에 창이 뜨고 뒤는 어두워져요. 삭제 확인, 로그인 창 등에 써요.', '삭제 버튼을 누르면 확인 모달을 띄워줘. 배경은 반투명 검정으로 어둡게, 창은 살짝 커지며 나타나고 ESC나 바깥 클릭으로 닫히게.', { aka: ['모달', '팝업', 'Popup', '다이얼로그', '레이어 팝업', '확인 창'] }),
          t('drawer', 'Drawer', '옆에서 열리는 패널', U.Drawer, '화면 옆에서 서랍처럼 패널이 미끄러져 나와요. 모바일 메뉴, 장바구니, 필터에 자주 써요.', '햄버거 버튼을 누르면 오른쪽에서 드로어 메뉴가 슬라이드로 열리게 해줘. 너비 300px, 바깥을 누르면 닫히게.', { aka: ['드로어', '사이드 패널', '오프캔버스', 'Sheet', '바텀 시트'] }),
          t('dropdown', 'Dropdown', '아래로 펼치는 목록', U.Dropdown, '버튼을 누르면 아래로 선택지 목록이 펼쳐져요.', '카테고리 선택용 드롭다운을 만들어줘. 클릭하면 아래로 목록이 펼쳐지고, 항목에 마우스를 올리면 배경이 강조되게.', { aka: ['드롭다운', '드롭다운 메뉴', '펼침 메뉴'] }),
          t('tooltip', 'Tooltip', '작은 설명 말풍선', U.Tooltip, '아이콘이나 버튼에 마우스를 올리면 작은 설명 말풍선이 떠요.', '물음표 아이콘에 마우스를 올리면 툴팁으로 "비밀번호는 8자 이상" 설명이 위쪽에 뜨게 해줘.', { aka: ['툴팁', '말풍선', '도움말'] }),
          t('toast', 'Toast / Snackbar', '잠깐 나타나는 알림', U.Toast, '작업 결과를 잠깐 띄웠다가 저절로 사라지는 알림이에요.', '저장하면 화면 아래 가운데에 "저장되었어요" 토스트가 올라왔다가 3초 뒤 사라지게 해줘.', { aka: ['토스트', '스낵바', '알림 메시지', '토스트 메시지'] }),
          t('carousel', 'Carousel', '옆으로 넘기는 카드', U.Carousel, '여러 장을 옆으로 넘겨 보는 슬라이드예요. 배너, 후기 목록에 써요.', '후기 카드를 캐러셀로 만들어줘. 좌우 화살표와 아래 점(인디케이터)을 넣고 3초마다 자동으로 넘어가게.', { aka: ['캐러셀', '슬라이더', 'Slider', '배너 슬라이드', '스와이퍼'] }),
          t('skeleton-loading', 'Skeleton Loading', '로딩 중 윤곽 먼저', U.SkeletonLoading, '데이터가 오기 전에 회색 윤곽을 먼저 보여줘서 덜 기다리는 느낌을 줘요.', '목록을 불러오는 동안 스켈레톤 로딩을 보여줘. 실제 카드와 같은 모양의 회색 박스에 반짝이는(shimmer) 효과를 넣어서.', { aka: ['스켈레톤', '스켈레톤 UI', '로딩 화면', 'Shimmer'] }),
        ],
      },
      {
        id: 'effect',
        title: '효과',
        en: 'Effect',
        items: [
          t('hover-effect', 'Hover Effect', '마우스를 올리면 반응', U.HoverEffect, '마우스를 올렸을 때 카드가 떠오르거나 색이 바뀌는 반응이에요.', '카드에 호버 효과를 넣어줘. 마우스를 올리면 위로 4px 떠오르고 그림자가 진해지게, 0.2초 동안.', { aka: ['호버', '마우스 오버', 'mouseover'] }),
          t('scroll-reveal', 'Scroll Reveal', '스크롤하며 등장', U.ScrollReveal, '스크롤해서 요소가 화면에 들어올 때 스르륵 나타나요.', '섹션들이 스크롤로 화면에 들어올 때 아래에서 20px 올라오며 페이드인 되게 해줘. 한 번만 실행되게.', { aka: ['스크롤 애니메이션', '등장 효과', 'AOS'] }),
          t('stagger', 'Stagger Animation', '시간차 순차 등장', U.StaggerAnimation, '여러 요소가 한꺼번에가 아니라, 조금씩 시간차를 두고 차례로 나타나요.', '', { playground: 'stagger', aka: ['스태거', '순차 등장', '시간차'], adv: true }),
          t('smooth-transition', 'Smooth Transition', '부드러운 상태 전환', U.SmoothTransition, '상태가 바뀔 때 뚝 끊기지 않고 부드럽게 바뀌어요. 색, 크기, 위치 모두요.', '토글 스위치를 켜고 끌 때 동그라미가 부드럽게 이동하고 배경색이 0.3초 동안 자연스럽게 바뀌게 transition을 넣어줘.', { aka: ['트랜지션', 'transition', '부드럽게'] }),
          t('glassmorphism', 'Glassmorphism', '반투명 유리 스타일', U.Glassmorphism, '뒤가 흐릿하게 비치는 반투명 유리 같은 스타일이에요.', '카드를 글래스모피즘 스타일로 만들어줘. 반투명 흰 배경, backdrop-filter blur 16px, 얇은 흰 테두리.', { aka: ['글래스모피즘', '유리 효과', '블러', 'blur'], adv: true }),
          t('parallax', 'Parallax Scrolling', '깊이감 있는 시차', U.ParallaxScrolling, '스크롤할 때 배경과 앞쪽이 다른 속도로 움직여서 깊이감이 생겨요. 멀리 있는 건 느리게, 가까운 건 빠르게.', '히어로 배경에 패럴랙스 스크롤을 넣어줘. 산 이미지 3겹이 스크롤할 때 뒤쪽일수록 느리게 움직이게.', { aka: ['패럴랙스', '시차 스크롤'], adv: true }),
          t('scroll-snap', 'Scroll Snap', '섹션 단위로 착 정렬', U.ScrollSnap, '스크롤을 멈추면 섹션 단위로 딱 맞춰 정렬돼요. 한 화면에 한 섹션씩 넘길 때 써요.', '전체 페이지를 섹션 단위 스크롤 스냅으로 만들어줘. 스크롤하면 한 섹션씩 화면에 딱 맞게 멈추게 (scroll-snap-type: y mandatory).', { aka: ['스크롤 스냅', '풀페이지', 'fullpage'], adv: true }),
          t('micro-interaction', 'Micro-interaction', '작은 반응 애니메이션', U.MicroInteraction, '좋아요 하트가 톡 튀는 것처럼, 작은 행동에 돌아오는 작은 반응이에요.', '좋아요 버튼을 누르면 하트가 분홍색으로 채워지며 통 튀고, 주변에 작은 입자가 터지고, 숫자가 위로 올라가며 바뀌는 마이크로 인터랙션을 넣어줘.', { aka: ['마이크로 인터랙션', '인터랙션', '좋아요 효과'] }),
        ],
      },
    ],
  },
  {
    id: 'motion',
    short: '애니메이션',
    title: '애니메이션 필수 용어',
    intro: '움직임을 부르는 이름이에요. 어떻게 움직일지 정확히 말할수록 AI가 원하는 대로 만들어요.',
    sections: [
      {
        id: 'basics',
        title: '기본',
        en: 'Basics',
        items: [
          t('fade', 'Fade', '스르륵', M.Fade, '투명도(opacity)를 0에서 1로 바꿔 나타나거나 사라지게 해요. 가장 기본적인 애니메이션이에요.', '모달이 나타날 때 0.3초 동안 페이드인 되게 해줘 (opacity 0 → 1).', { aka: ['페이드', '페이드인', '페이드아웃', 'opacity', '투명도'] }),
          t('slide', 'Slide', '슈욱', M.Slide, '위치를 옮기며 들어오거나 나가요. 보통 페이드와 함께 써요.', '알림 카드가 오른쪽에서 슬라이드로 들어오게 해줘. x 100% → 0, 페이드와 함께.', { aka: ['슬라이드', '슬라이드인', 'translate'] }),
          t('scale', 'Scale', '뿅', M.Scale, '크기를 키우거나 줄여요. 배지 숫자가 바뀔 때 뿅 하고 커지는 식이에요.', '장바구니 숫자 배지가 바뀔 때 scale 0에서 1로 뿅 튀어나오게 해줘.', { aka: ['스케일', '확대', '축소', 'zoom'] }),
          t('easing', 'Easing', '사뿐', M.Easing, '같은 시간 동안 움직여도 처음과 끝의 속도 변화를 정해요. 자연스러움의 대부분이 여기서 결정돼요.', '모든 애니메이션의 easing을 ease-out(cubic-bezier(0.22, 1, 0.36, 1))으로 통일해줘.', { aka: ['이징', 'ease', 'ease-in-out', 'cubic-bezier', '가속도'] }),
          t('spring', 'Spring', '띠용', M.Spring, '시간 대신 탄성(용수철)으로 움직여요. 목표를 살짝 지나쳤다 돌아오며 살아있는 느낌을 줘요.', '', { playground: 'spring', aka: ['스프링', '탄성', '용수철'] }),
          t('bounce', 'Bounce', '통통', M.Bounce, '공이 바닥에 튀듯 여러 번 튕기다가 멈춰요.', '완료 체크 아이콘이 위에서 떨어져 바닥에 2~3번 통통 튀며 멈추게 해줘.', { aka: ['바운스', '튕김'] }),
          t('duration-delay', 'Duration·Delay', '휙 / 느릿', M.DurationDelay, 'duration은 "얼마나 오래" 움직이는지, delay는 "언제 시작할지"예요.', '제목은 바로 0.6초 동안, 부제목은 0.2초 늦게(delay) 시작해서 0.6초 동안 나타나게 해줘.', { aka: ['듀레이션', '딜레이', '지연', '속도', '시간'] }),
          t('loop', 'Loop', '둥실둥실', M.Loop, '애니메이션이 끝나면 처음부터 계속 반복해요. 둥둥 떠 있는 장식에 자주 써요.', '히어로의 장식 도형이 위아래로 둥실둥실 무한 반복(loop)으로 떠 있게 해줘. 3초 주기로.', { aka: ['루프', '무한 반복', 'infinite', '반복'] }),
          t('ripple', 'Ripple', '눌린 곳에서 퍼지는 물결', M.Ripple, '버튼을 누른 자리에서 동그란 물결이 퍼져요. "눌렸다"는 느낌을 확실하게 줘요.', '버튼을 클릭하면 클릭한 위치에서 흰색 원이 퍼지며 사라지는 리플 효과를 넣어줘.', { aka: ['리플', '물결 효과', '클릭 효과'] }),
          t('shake', 'Shake', '도리도리 흔들림', M.Shake, '좌우로 빠르게 흔들려요. 비밀번호가 틀렸을 때처럼 "잘못됐어요"를 알릴 때 써요.', '로그인 실패하면 비밀번호 입력 칸이 좌우로 흔들리고(shake) 테두리가 빨갛게, 아래에 오류 문구가 나오게 해줘.', { aka: ['셰이크', '흔들림', '오류 효과', '진동'] }),
          t('pulse', 'Pulse', '두근두근 깜빡임', M.Pulse, '심장 박동처럼 커졌다 작아지거나 빛이 퍼지기를 반복해요. 새 알림, 라이브 표시처럼 눈길을 끌 때 써요.', '알림 아이콘 뒤로 원이 퍼져 나가는 펄스 효과를 무한 반복으로 넣어줘. 새 알림이 있을 때만.', { aka: ['펄스', '깜빡임', '두근거림', 'LIVE'] }),
        ],
      },
      {
        id: 'text',
        title: '글자와 그림',
        en: 'Text · Shapes',
        items: [
          t('typewriter', 'Typewriter', '타닥타닥', M.Typewriter, '글자가 타자 치듯 한 글자씩 나타나요.', '메인 문구가 한 글자씩 나타나는 타이프라이터 효과를 넣어줘. 커서가 깜빡이고, 다 쓰면 지우고 다음 문구로 넘어가게.', { aka: ['타이핑 효과', '타자 효과', '타이프라이터'] }),
          t('text-scramble', 'Text Scramble', '촤르륵', M.TextScramble, '글자가 무작위로 뒤섞이다가 원래 글자로 맞춰져요.', '제목이 나타날 때 랜덤 문자로 뒤섞이다가 왼쪽부터 원래 글자로 맞춰지는 텍스트 스크램블 효과를 넣어줘.', { aka: ['스크램블', '해커 효과', '글자 섞기'], adv: true }),
          t('split-text', 'Split Text', '차르르', M.SplitText, '문장을 글자(또는 단어) 단위로 쪼개서 하나씩 따로 움직여요.', '제목을 글자 단위로 쪼개서(split text) 흩어진 위치에서 0.05초 간격으로 제자리에 모이게 해줘.', { aka: ['스플릿 텍스트', '글자 쪼개기'], adv: true }),
          t('count-up', 'Count-up', '촤라락', M.CountUp, '숫자가 0부터 목표값까지 빠르게 올라가요. 실적, 통계 숫자에 써요.', '"함께 쓰는 팀 10,475+" 숫자가 화면에 보이면 0부터 카운트업 되게 해줘. 2초 동안, 끝에서 느려지게.', { aka: ['카운트업', '숫자 올라가기', '카운터'] }),
          t('line-drawing', 'Line Drawing', '쓱쓱', M.LineDrawing, '선이 펜으로 그리듯 나타나요. SVG 선, 아이콘, 서명에 써요.', 'SVG 서명 선이 왼쪽부터 쓱 그려지는 라인 드로잉 애니메이션을 넣어줘 (pathLength 0 → 1).', { aka: ['선 그리기', 'SVG 애니메이션', 'path'], adv: true }),
          t('morphing', 'Morphing', '스르르', M.Morphing, '한 모양이 다른 모양으로 자연스럽게 변해요. 햄버거 아이콘 → X가 대표적이에요.', '햄버거 메뉴 아이콘을 누르면 세 줄이 X 모양으로 모핑되게 해줘.', { aka: ['모핑', '모양 변형'], adv: true }),
          t('marquee', 'Marquee', '줄줄', M.Marquee, '글자나 로고가 띠처럼 끊임없이 옆으로 흘러가요.', '협력사 로고들을 마퀴로 만들어줘. 오른쪽에서 왼쪽으로 끊김 없이 무한히 흐르고, 마우스를 올리면 멈추게.', { aka: ['마퀴', '흐르는 글자', '롤링 배너', '티커'] }),
          t('motion-path', 'Motion Path', '슝', M.MotionPath, '정해진 곡선 경로를 따라 움직여요.', '"담기"를 누르면 상품 이미지가 곡선 경로를 따라 장바구니 아이콘으로 날아가게(motion path) 해줘.', { aka: ['모션 패스', '경로 애니메이션', '장바구니 날아가기'], adv: true }),
        ],
      },
      {
        id: 'screen',
        title: '화면과 마우스',
        en: 'Screen · Mouse',
        items: [
          t('page-transition', 'Page Transition', '휘릭', M.PageTransition, '페이지를 이동할 때 화면이 바뀌는 연출이에요.', '페이지를 이동할 때 색 패널이 화면을 왼쪽에서 오른쪽으로 덮었다가 지나가는 페이지 전환 효과를 넣어줘.', { aka: ['페이지 전환', '화면 전환', '라우트 전환'], adv: true }),
          t('shared-element', 'Shared Element', '쭈욱', M.SharedElement, '목록의 썸네일이 그대로 커지면서 상세 화면이 돼요. 같은 요소가 이어지는 느낌을 줘요.', '갤러리 썸네일을 누르면 그 이미지가 그대로 커지며 상세 화면이 되는 shared element 전환을 만들어줘 (Motion layoutId 사용).', { aka: ['공유 요소 전환', 'layoutId', 'Hero 애니메이션'], adv: true }),
          t('pin-scrollytelling', 'Pin·Scrollytelling', '착착', M.PinScrollytelling, '스크롤하는 동안 한 요소가 화면에 고정(pin)되고, 스크롤에 따라 내용이 단계별로 바뀌어요.', '기능 소개 섹션에 스크롤텔링을 넣어줘. 왼쪽 휴대폰 이미지는 고정(pin)되고, 스크롤할 때마다 1→2→3 단계 화면으로 바뀌게. GSAP ScrollTrigger 사용.', { aka: ['스크롤텔링', '핀', 'ScrollTrigger', '스크롤 고정'], adv: true }),
          t('horizontal-scroll', 'Horizontal Scroll', '옆으로 스르륵', M.HorizontalScroll, '마우스로 세로 스크롤을 하는데 내용은 가로로 움직여요.', '포트폴리오 섹션에서 세로로 스크롤하면 카드들이 가로로 이동하는 horizontal scroll을 만들어줘. GSAP ScrollTrigger pin 사용.', { aka: ['가로 스크롤', '수평 스크롤'], adv: true }),
          t('magnetic-button', 'Magnetic Button', '착', M.MagneticButton, '마우스가 가까이 오면 버튼이 자석처럼 살짝 끌려와요.', 'CTA 버튼에 마그네틱 효과를 넣어줘. 마우스가 80px 안으로 오면 버튼이 마우스 쪽으로 살짝 끌려오고, 벗어나면 스프링으로 제자리에 돌아가게.', { aka: ['마그네틱', '자석 버튼'], adv: true }),
          t('custom-cursor', 'Custom Cursor', '졸졸', M.CustomCursor, '기본 화살표 대신 직접 만든 커서가 마우스를 따라다녀요.', '기본 커서를 숨기고 작은 원형 커스텀 커서가 마우스를 부드럽게 따라오게 해줘. 이미지 위에서는 커지면서 "보기" 글자가 나오게.', { aka: ['커스텀 커서', '마우스 커서', '커서 효과'], adv: true }),
          t('3d-tilt', '3D Tilt', '갸우뚱', M.Tilt3D, '마우스 위치에 따라 카드가 입체적으로 기울어져요.', '상품 카드에 3D 틸트 효과를 넣어줘. 마우스 위치에 따라 최대 12도 기울고, 빛 반사가 따라 움직이게.', { aka: ['틸트', '3D 카드', '기울기'], adv: true }),
          t('confetti', 'Confetti', '빵', M.Confetti, '축하할 때 색종이가 터져요. 결제 완료, 목표 달성 화면에 써요.', '결제가 완료되면 화면 가운데에서 컨페티(색종이)가 터지게 해줘. canvas-confetti 라이브러리 사용.', { aka: ['컨페티', '폭죽', '색종이', '축하 효과'] }),
        ],
      },
    ],
  },
  {
    id: 'dev',
    short: '개발 상식',
    title: '개발 필수 상식',
    intro: '화면 밖에서 자주 듣는 말이에요. AI가 "이 파일을 만들게요", "배포하세요"라고 할 때 무슨 뜻인지 알 수 있어요.',
    sections: [
      {
        id: 'files',
        title: '파일·형식',
        en: 'Files',
        items: [
          t('markdown', 'Markdown', '.md 글쓰기 형식', D.Markdown, '# 이나 - 같은 기호로 제목과 목록을 쓰는 간단한 글 형식이에요. 파일 이름이 .md로 끝나요. AI와 주고받는 문서 대부분이 이 형식이에요.', '프로젝트 기획을 마크다운(.md) 파일로 정리해줘. # 제목, ## 섹션별 소제목, 할 일은 - [ ] 체크리스트로.', { aka: ['마크다운', '.md', 'md 파일'] }),
          t('readme', 'README', '프로젝트 설명서', D.Readme, '프로젝트 폴더 맨 위에 두는 설명서 파일(README.md)이에요. 무엇인지, 어떻게 실행하는지 적어요. GitHub에 들어가면 가장 먼저 보여요.', 'README.md를 만들어줘. 프로젝트 소개 한 줄, 주요 기능, 설치 방법(npm install), 실행 방법(npm run dev)을 넣어서.', { aka: ['리드미', 'README.md', '설명서'] }),
          t('json', 'JSON', '데이터를 담는 형식', D.Json, '{ "이름": "값" } 모양으로 데이터를 적는 형식이에요. 프로그램끼리 데이터를 주고받을 때 거의 항상 이걸 써요.', '상품 목록 데이터를 JSON 파일로 따로 빼줘. 각 상품은 id, name, price, image 필드를 갖게.', { aka: ['제이슨', '.json', '데이터 형식'] }),
          t('env', '.env', '비밀 설정 파일', D.Env, 'API 키, 비밀번호 같은 비밀 값을 코드와 따로 보관하는 파일이에요. 절대 GitHub에 올리면 안 돼서 .gitignore에 넣어요.', 'API 키를 코드에 직접 쓰지 말고 .env 파일로 옮겨줘. 그리고 .env는 .gitignore에 추가하고, 예시용 .env.example도 만들어줘.', { aka: ['환경변수', '환경 변수', 'env 파일', 'API 키', '.gitignore'] }),
          t('package-json', 'package.json', '프로젝트 명세서', D.PackageJson, '프로젝트 이름, 실행 명령어(scripts), 필요한 부품 목록(dependencies)이 적힌 파일이에요. npm이 이걸 보고 일해요.', 'package.json의 scripts에 "dev", "build", "preview" 명령이 있는지 확인하고, 없으면 Vite 기준으로 추가해줘.', { aka: ['패키지 제이슨', 'dependencies', 'scripts', '의존성'], adv: true }),
        ],
      },
      {
        id: 'concept',
        title: '개념',
        en: 'Concepts',
        items: [
          t('frontend-backend', 'Frontend / Backend', '보이는 쪽 / 안 보이는 쪽', D.FrontendBackend, '프론트엔드는 사용자 눈에 보이는 화면, 백엔드는 뒤에서 데이터를 저장하고 처리하는 서버예요. 화면이 요청하면 서버가 응답해요.', '지금은 프론트엔드만 있으니까, 로그인과 게시글 저장을 위한 간단한 백엔드를 추가해줘. 프론트와 백엔드 폴더를 나눠서.', { aka: ['프론트엔드', '백엔드', '프론트', '서버', '클라이언트'] }),
          t('api', 'API', '프로그램끼리의 주문 창구', D.Api, '다른 프로그램에 "이거 줘"라고 요청하는 정해진 창구예요. 날씨 API에 요청하면 날씨 데이터가 돌아와요.', '무료 날씨 API를 연결해서 메인 화면에 오늘 날씨와 기온을 보여줘. API 키는 .env에 넣고, 실패하면 "날씨를 불러오지 못했어요" 표시.', { aka: ['에이피아이', 'REST API', '엔드포인트', 'endpoint', 'fetch'] }),
          t('database', 'Database', '데이터 저장 창고', D.Database, '회원 정보, 게시글 같은 데이터를 표처럼 저장해 두는 곳이에요. 새로고침해도 데이터가 남아 있으려면 필요해요.', '게시글을 새로고침해도 남아 있도록 데이터베이스에 저장해줘. Supabase를 쓰고, posts 테이블에 id, title, content, created_at 컬럼으로.', { aka: ['데이터베이스', 'DB', '디비', '테이블', 'Supabase', 'Firebase'] }),
          t('component', 'Component', '재사용하는 화면 부품', D.Component, '버튼, 카드처럼 한 번 만들어두고 여러 곳에 가져다 쓰는 화면 조각이에요. 글자만 바꿔서(props) 재사용해요.', '페이지마다 반복되는 버튼을 Button 컴포넌트로 분리해줘. 글자, 색상(primary/secondary), 크기를 props로 바꿀 수 있게.', { aka: ['컴포넌트', 'props', '프롭스', '부품'] }),
          t('state', 'State', '화면이 기억하는 값', D.State, '화면이 지금 기억하고 있는 값이에요. state가 바뀌면 화면이 자동으로 다시 그려져요. 장바구니 개수, 로그인 여부 같은 거요.', '장바구니 개수를 state로 관리해줘. 담기 버튼을 누르면 1씩 늘고, 헤더의 장바구니 배지 숫자도 같이 바뀌게.', { aka: ['상태', '스테이트', 'useState', '상태 관리'] }),
        ],
      },
      {
        id: 'tools',
        title: '도구·작업',
        en: 'Tools',
        items: [
          t('localhost-port', 'localhost · Port', '내 컴퓨터 주소와 문 번호', D.LocalhostPort, 'localhost는 "내 컴퓨터"라는 뜻의 주소예요. 포트(3000, 4000 등)는 그 안의 문 번호라서, 여러 앱을 동시에 띄울 수 있어요.', '개발 서버를 4000번 포트로 띄워줘. 이미 쓰고 있으면 다른 번호로 바꾸지 말고 알려줘.', { aka: ['로컬호스트', '포트', 'port', '127.0.0.1', '개발 서버', '로컬'] }),
          t('terminal', 'Terminal', '명령어 입력 창', D.Terminal, '글자로 컴퓨터에 명령하는 검은 창이에요. npm run dev 같은 명령을 여기서 실행해요.', '이 프로젝트를 실행하려면 터미널에 어떤 명령어를 순서대로 입력해야 하는지 알려줘.', { aka: ['터미널', 'CLI', '명령 프롬프트', '콘솔', '쉘', 'Shell'] }),
          t('git-commit', 'Commit', '저장 지점 찍기', D.Commit, '지금까지 작업한 상태를 메시지와 함께 저장해 두는 거예요. 게임 세이브처럼, 나중에 이 지점으로 돌아올 수 있어요.', '지금까지 작업한 걸 커밋해줘. 커밋 메시지는 무엇을 바꿨는지 한 줄로.', { aka: ['커밋', 'Git', '깃', '저장', '버전 관리'] }),
          t('git-branch', 'Branch', '갈라진 작업 줄기', D.Branch, '원본(main)은 그대로 두고, 옆으로 갈라져서 새 기능을 작업하는 줄기예요. 다 되면 다시 합쳐요(merge).', '로그인 기능은 feature/login 브랜치를 만들어서 작업하고, 다 되면 main에 merge해줘.', { aka: ['브랜치', 'main', 'merge', '머지', '병합'], adv: true }),
          t('git-push', 'Push', '온라인에 올리기', D.Push, '내 컴퓨터의 커밋을 GitHub 같은 원격 저장소로 올리는 거예요. 반대로 받아오는 건 Pull이에요.', '커밋한 내용을 GitHub에 push해줘.', { aka: ['푸시', 'Pull', '풀', '업로드', 'GitHub', '깃허브', '원격 저장소'] }),
          t('npm-install', 'npm install', '부품 설치하기', D.NpmInstall, 'package.json에 적힌 부품(라이브러리)들을 인터넷에서 받아 node_modules 폴더에 설치하는 명령이에요.', '애니메이션에 motion 라이브러리를 쓰고 싶어. npm install로 설치하고 사용 예시를 하나 넣어줘.', { aka: ['npm', '엔피엠', '라이브러리', '패키지', 'node_modules', 'yarn', 'pnpm'] }),
          t('build', 'Build', '배포용으로 묶기', D.Build, '개발할 때 쓰던 여러 파일을 실제 서비스용으로 작고 빠르게 묶는 과정이에요. 결과물은 보통 dist 폴더에 생겨요.', 'npm run build로 빌드해보고, 에러가 나면 원인을 찾아서 고쳐줘.', { aka: ['빌드', 'dist', '번들', 'bundle'], adv: true }),
          t('deploy', 'Deploy', '인터넷에 공개하기', D.Deploy, '내 컴퓨터에서만 보이던 사이트를 인터넷에 올려서 누구나 주소로 들어올 수 있게 하는 거예요.', '이 사이트를 Vercel에 배포하는 방법을 단계별로 알려줘. GitHub 저장소와 연결해서 push하면 자동 배포되게.', { aka: ['배포', '디플로이', '호스팅', 'Vercel', 'Netlify', '출시'] }),
          t('domain', 'Domain', '사이트 주소', D.Domain, 'myapp.site 같은 사이트 주소예요. 실제로는 숫자 주소(IP)가 있고, DNS가 전화번호부처럼 이름을 숫자로 바꿔줘요.', '구매한 도메인 myapp.site를 Vercel에 배포한 사이트에 연결하려면 DNS 설정을 어떻게 해야 하는지 알려줘.', { aka: ['도메인', 'DNS', 'IP', 'URL', '주소', '웹 주소'] }),
        ],
      },
      {
        id: 'problems',
        title: '문제 상황',
        en: 'Troubleshooting',
        items: [
          t('console-error', 'Console · Error', '에러 메시지 확인하는 곳', D.ConsoleError, '브라우저 개발자 도구의 Console 탭이에요. 빨간 줄이 에러예요. 이 메시지를 그대로 복사해서 AI에게 주면 가장 빨리 고쳐요.', '화면이 하얗게 나와. 콘솔에 이런 에러가 떠: (에러 메시지 붙여넣기). 원인을 찾아서 고쳐줘.', { aka: ['콘솔', '에러', '오류', '개발자 도구', 'DevTools', 'F12', '디버깅'] }),
          t('cache', 'Cache', '한 번 받은 걸 저장해 두기', D.Cache, '한 번 받은 이미지나 파일을 브라우저가 저장해 두고 다음에 바로 꺼내 써요. 그래서 고쳤는데 안 바뀌어 보이면 캐시 때문일 때가 많아요.', '코드를 고쳤는데 화면이 안 바뀌어. 캐시 문제인지 확인하는 방법과 강력 새로고침 방법을 알려줘.', { aka: ['캐시', '캐싱', '강력 새로고침', '새로고침'] }),
          t('cors', 'CORS', '다른 주소 요청 차단', D.Cors, '브라우저가 보안 때문에 "허락받지 않은 다른 주소"로의 요청을 막는 규칙이에요. 서버 쪽에서 내 주소를 허용해줘야 풀려요.', '프론트에서 API를 부르면 CORS 에러가 나. 백엔드에서 내 사이트 주소(localhost:4000)를 허용하도록 고쳐줘.', { aka: ['코스', 'CORS 에러', 'CORS 오류', '교차 출처'], adv: true }),
        ],
      },
    ],
  },
]

// 평탄화 + 소속 정보와 번호
export const TERMS = []
GROUPS.forEach((g) => {
  let n = 0
  g.sections.forEach((s) =>
    s.items.forEach((item) => {
      n++
      Object.assign(item, { group: g, section: s, no: String(n).padStart(2, '0') })
      TERMS.push(item)
    }),
  )
})

export const getTerm = (id) => TERMS.find((x) => x.id === id)

const norm = (s) => s.toLowerCase().replace(/[\s·/._-]/g, '')

// 검색: 영어 이름, 한글 설명, 다른 이름, 설명까지. 별칭으로 찾았으면 그 별칭을 돌려준다.
export function searchTerms(q) {
  const k = norm(q)
  if (!k) return []
  const hits = []
  for (const term of TERMS) {
    const alias = term.aka.find((a) => norm(a).includes(k))
    if (norm(term.en).includes(k) || norm(term.ko).includes(k)) hits.push({ term, score: 0 })
    else if (alias) hits.push({ term, alias, score: 1 })
    else if (norm(term.desc).includes(k)) hits.push({ term, score: 2 })
  }
  return hits.sort((a, b) => a.score - b.score)
}
