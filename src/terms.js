import * as U from './demos/ui'
import * as B from './demos/ui2'
import * as M from './demos/motion'
import * as D from './demos/dev'
import * as D2 from './demos/dev2'
import * as A from './demos/ai'
import { DESC } from './descriptions'

// 설명(desc)은 descriptions.js에 따로 모아둔다.
// extra: { aka: 다른 이름들, adv: '알면 좋음' 단계, playground: 체험 화면 id }
const t = (id, en, ko, Demo, prompt, extra = {}) => ({ id, en, ko, Demo, desc: DESC[id], prompt, aka: [], adv: false, ...extra })

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
          t('hero-section', 'Hero Section', '첫 화면의 대표 영역', U.HeroSection, '랜딩 페이지 맨 위에 히어로 섹션을 만들어줘. 큰 제목, 한 줄 설명, "시작하기" 버튼을 넣고 화면 높이의 80%를 차지하게 해줘.', { aka: ['히어로 배너', 'Hero Banner', '메인 비주얼', '첫 화면'] }),
          t('responsive-layout', 'Responsive Layout', '화면 폭에 맞춘 배치', U.ResponsiveLayout, '카드 목록을 반응형으로 만들어줘. 데스크톱 3열, 태블릿 2열, 모바일(768px 이하)은 1열로.', { aka: ['반응형', '반응형 웹', '모바일 대응'] }),
          t('card-layout', 'Card Layout', '정보를 카드로 나누기', U.CardLayout, '상품을 카드 레이아웃으로 보여줘. 각 카드에 이미지, 이름, 가격이 있고 모서리는 둥글게 해줘.', { aka: ['카드', '그리드'] }),
          t('bento-grid', 'Bento Grid', '크기 다른 카드 격자', U.BentoGrid, '기능 소개를 벤토 그리드로 만들어줘. 4열 격자에 첫 카드는 2x2 크기, 나머지는 1x1과 2x1을 섞어서.', { aka: ['벤토', '격자'], adv: true }),
          t('sidebar-layout', 'Sidebar Layout', '옆에 고정된 메뉴', U.SidebarLayout, '대시보드를 사이드바 레이아웃으로 만들어줘. 왼쪽 240px 고정 메뉴, 현재 메뉴는 강조 표시, 오른쪽은 콘텐츠 영역.', { aka: ['사이드바', 'LNB', '왼쪽 메뉴', '대시보드'] }),
          t('sticky-header', 'Sticky Header', '스크롤해도 남는 헤더', U.StickyHeader, '헤더를 sticky로 만들어줘. 스크롤해도 상단에 고정되고, 스크롤이 시작되면 아래쪽에 그림자가 생기게.', { aka: ['고정 헤더', 'fixed header', '상단 고정'] }),
          t('split-layout', 'Split Layout', '좌우 분할 배치', U.SplitLayout, '소개 섹션을 좌우 분할 레이아웃으로 만들어줘. 왼쪽은 제목·설명·버튼, 오른쪽은 이미지. 모바일에서는 위아래로 쌓이게.', { aka: ['2단', '좌우 분할', '스플릿'] }),
        ],
      },
      {
        id: 'navigation',
        title: '내비게이션',
        en: 'Navigation',
        items: [
          t('navigation-bar', 'Navigation Bar', '맨 위 메뉴 줄', B.NavigationBar, '상단 내비게이션 바를 만들어줘. 왼쪽에 로고, 가운데에 홈/소개/작업/문의 메뉴, 현재 페이지 메뉴는 강조 표시.', { aka: ['내비게이션 바', 'Navbar', 'GNB', '헤더', '상단 메뉴', '네비게이션'] }),
          t('hamburger-menu', 'Hamburger Menu', '세 줄 메뉴 버튼', B.HamburgerMenu, '모바일에서는 상단 메뉴를 햄버거 아이콘으로 바꿔줘. 누르면 전체 화면 메뉴가 위에서 내려오고, 아이콘은 X로 바뀌게.', { aka: ['햄버거', '햄버거 버튼', '모바일 메뉴', '☰'] }),
          t('bottom-navigation', 'Bottom Navigation', '하단 탭 바', B.BottomNavigation, '모바일 화면 하단에 바텀 내비게이션을 만들어줘. 홈/검색/찜/MY 4개 탭, 아이콘과 이름, 선택된 탭은 주황색으로.', { aka: ['바텀바', '바텀 탭', '탭바', 'Tab Bar', '하단 메뉴'] }),
          t('breadcrumb', 'Breadcrumb', '지금 위치 경로', B.Breadcrumb, '상품 상세 페이지 위에 브레드크럼을 넣어줘. "홈 › 카테고리 › 상품명" 형식, 각 단계는 클릭하면 그 페이지로 이동.', { aka: ['빵부스러기', '경로', '현재 위치'] }),
          t('pagination', 'Pagination', '페이지 번호', B.Pagination, '게시글 목록에 페이지네이션을 넣어줘. 한 페이지에 10개씩, 아래에 이전/다음 화살표와 페이지 번호, 현재 페이지는 강조.', { aka: ['페이지네이션', '페이징', '페이지 번호'] }),
          t('footer', 'Footer', '맨 아래 정보 영역', B.Footer, '사이트 맨 아래에 푸터를 만들어줘. 어두운 배경에 3열 링크 목록, 맨 아래에 저작권 문구와 이용약관·개인정보처리방침 링크.', { aka: ['푸터', '하단 정보', '바닥글'] }),
        ],
      },
      {
        id: 'input',
        title: '입력',
        en: 'Input',
        items: [
          t('toggle-switch', 'Toggle Switch', '켜고 끄는 스위치', B.ToggleSwitch, '설정 화면에 토글 스위치를 만들어줘. "알림 받기", "다크 모드" 두 개, 켜면 주황색으로 바뀌고 동그라미가 부드럽게 이동.', { aka: ['토글', '스위치', 'on/off'] }),
          t('checkbox-radio', 'Checkbox / Radio', '여러 개 vs 하나만 선택', B.CheckboxRadio, '설문 폼을 만들어줘. "관심 분야"는 체크박스로 여러 개 선택, "연령대"는 라디오 버튼으로 하나만 선택하게.', { aka: ['체크박스', '라디오 버튼', '선택지'] }),
          t('text-field', 'Text Field', '글자 입력 칸', B.TextField, '회원가입 폼에 이메일 입력 칸을 만들어줘. 위에 "이메일" 라벨, 입력 중엔 테두리가 주황색, 아래에 도움말 문구.', { aka: ['인풋', 'Input', '입력창', '텍스트 박스', '폼'] }),
          t('placeholder', 'Placeholder', '비어 있을 때 안내 문구', B.Placeholder, '이름 입력 칸에 "이름을 입력하세요" 플레이스홀더를 넣어줘. 연한 회색으로.', { aka: ['플레이스홀더', '안내 문구', '힌트 텍스트'] }),
          t('select', 'Select', '목록에서 고르는 칸', B.Select, '주소 입력 폼에 지역 선택(select)을 넣어줘. 서울/부산/대구/광주 중 하나, 기본값은 "선택해주세요".', { aka: ['셀렉트', '셀렉트 박스', '선택 상자', '콤보박스'] }),
          t('search-bar', 'Search Bar', '검색창', B.SearchBar, '상단에 둥근 검색창을 만들어줘. 왼쪽에 돋보기 아이콘, 입력하는 동안 아래에 추천 검색어를 보여주고 일치하는 글자는 굵게.', { aka: ['검색창', '서치바', '자동완성', 'Autocomplete'] }),
        ],
      },
      {
        id: 'action',
        title: '버튼·행동',
        en: 'Button · Action',
        items: [
          t('cta-button', 'CTA Button', '행동을 부르는 버튼', B.CTAButton, '히어로 섹션의 "무료로 시작하기" CTA 버튼을 가장 눈에 띄게 만들어줘. 주황색 배경, 둥근 모양, 은은하게 퍼지는 빛 효과.', { aka: ['CTA', '콜투액션', '행동 버튼', '메인 버튼'] }),
          t('button-hierarchy', 'Primary / Secondary', '버튼의 중요도', B.ButtonHierarchy, '폼 하단 버튼을 정리해줘. "저장"은 Primary(주황 배경), "미리보기"는 Secondary(주황 테두리), "취소"는 Text 버튼으로.', { aka: ['프라이머리 버튼', '세컨더리 버튼', '고스트 버튼', '버튼 종류'] }),
          t('fab', 'FAB', '떠 있는 동그란 버튼', B.FAB, '모바일 화면 오른쪽 아래에 FAB(플로팅 액션 버튼)를 만들어줘. + 아이콘, 누르면 45도 회전하며 "글쓰기", "사진" 버튼이 위로 펼쳐지게.', { aka: ['플로팅 버튼', 'Floating Action Button', '플러스 버튼'] }),
          t('pull-to-refresh', 'Pull to Refresh', '당겨서 새로고침', B.PullToRefresh, '피드 목록에 pull to refresh를 넣어줘. 맨 위에서 아래로 당기면 로딩 스피너가 돌고, 새 글을 불러와 맨 위에 추가.', { aka: ['당겨서 새로고침', '풀 투 리프레시'] }),
          t('infinite-scroll', 'Infinite Scroll', '끝없이 이어지는 목록', B.InfiniteScroll, '상품 목록을 무한 스크롤로 만들어줘. 맨 아래에 닿으면 로딩 스피너를 보여주고 20개씩 더 불러오게.', { aka: ['무한 스크롤', '더보기', 'Load More'] }),
        ],
      },
      {
        id: 'display',
        title: '표시',
        en: 'Display',
        items: [
          t('badge', 'Badge', '숫자·점 알림 표시', B.Badge, '종 아이콘 오른쪽 위에 안 읽은 알림 개수 배지를 붙여줘. 빨간 동그라미에 흰 숫자, 9개가 넘으면 "9+".', { aka: ['배지', '뱃지', '알림 숫자', '빨간 점', 'NEW 표시'] }),
          t('avatar', 'Avatar', '프로필 사진 동그라미', B.Avatar, '댓글 옆에 아바타를 보여줘. 프로필 사진이 없으면 이름 첫 글자를 색 동그라미 안에 넣고, 접속 중이면 초록 점 표시.', { aka: ['아바타', '프로필 사진', '프로필 이미지'] }),
          t('chip-tag', 'Chip / Tag', '작은 꼬리표', B.ChipTag, '검색 결과 위에 카테고리 필터 칩을 만들어줘. 디자인/개발/기획/마케팅, 여러 개 선택 가능, 선택하면 검정 배경.', { aka: ['칩', '태그', '필터', '해시태그', 'Pill'] }),
          t('progress-bar', 'Progress Bar', '진행률 막대', B.ProgressBar, '파일 업로드 중에 진행률 막대를 보여줘. 주황색 막대가 차오르고 오른쪽에 퍼센트 숫자 표시.', { aka: ['프로그레스 바', '진행률', '로딩 바', '게이지'] }),
          t('spinner', 'Spinner', '빙글빙글 로딩', B.Spinner, '저장 버튼을 누르면 버튼 안에 작은 로딩 스피너가 돌고 "저장 중"으로 바뀌게 해줘. 끝나면 원래대로.', { aka: ['스피너', '로딩', '로더', 'Loading'] }),
          t('empty-state', 'Empty State', '비어 있을 때 화면', B.EmptyState, '찜 목록이 비어 있을 때 빈 상태 화면을 보여줘. 가운데에 상자 아이콘, "아직 찜한 상품이 없어요" 문구, "둘러보기" 버튼.', { aka: ['빈 화면', '엠티 스테이트', '결과 없음'] }),
        ],
      },
      {
        id: 'component',
        title: '컴포넌트',
        en: 'Component',
        items: [
          t('tabs', 'Tabs', '같은 자리 내용 전환', U.Tabs, '상품 상세에 탭을 만들어줘. "상세정보 / 리뷰 / 문의" 3개 탭, 선택된 탭 아래 밑줄이 미끄러지듯 이동하게.', { aka: ['탭', '탭 메뉴'] }),
          t('accordion', 'Accordion', '펼치고 접는 목록', U.Accordion, '', { playground: 'accordion', aka: ['아코디언', '접는 메뉴', 'FAQ', '펼치기', 'Collapse'] }),
          t('modal', 'Modal / Dialog', '화면 위 확인 창', U.Modal, '삭제 버튼을 누르면 확인 모달을 띄워줘. 배경은 반투명 검정으로 어둡게, 창은 살짝 커지며 나타나고 ESC나 바깥 클릭으로 닫히게.', { aka: ['모달', '팝업', 'Popup', '다이얼로그', '레이어 팝업', '확인 창'] }),
          t('drawer', 'Drawer', '옆에서 열리는 패널', U.Drawer, '햄버거 버튼을 누르면 오른쪽에서 드로어 메뉴가 슬라이드로 열리게 해줘. 너비 300px, 바깥을 누르면 닫히게.', { aka: ['드로어', '사이드 패널', '오프캔버스', 'Sheet', '바텀 시트'] }),
          t('dropdown', 'Dropdown', '아래로 펼치는 목록', U.Dropdown, '카테고리 선택용 드롭다운을 만들어줘. 클릭하면 아래로 목록이 펼쳐지고, 항목에 마우스를 올리면 배경이 강조되게.', { aka: ['드롭다운', '드롭다운 메뉴', '펼침 메뉴'] }),
          t('tooltip', 'Tooltip', '작은 설명 말풍선', U.Tooltip, '물음표 아이콘에 마우스를 올리면 툴팁으로 "비밀번호는 8자 이상" 설명이 위쪽에 뜨게 해줘.', { aka: ['툴팁', '말풍선', '도움말'] }),
          t('toast', 'Toast / Snackbar', '잠깐 나타나는 알림', U.Toast, '저장하면 화면 아래 가운데에 "저장되었어요" 토스트가 올라왔다가 3초 뒤 사라지게 해줘.', { aka: ['토스트', '스낵바', '알림 메시지', '토스트 메시지'] }),
          t('carousel', 'Carousel', '옆으로 넘기는 카드', U.Carousel, '후기 카드를 캐러셀로 만들어줘. 좌우 화살표와 아래 점(인디케이터)을 넣고 3초마다 자동으로 넘어가게.', { aka: ['캐러셀', '슬라이더', 'Slider', '배너 슬라이드', '스와이퍼'] }),
          t('skeleton-loading', 'Skeleton Loading', '로딩 중 윤곽 먼저', U.SkeletonLoading, '목록을 불러오는 동안 스켈레톤 로딩을 보여줘. 실제 카드와 같은 모양의 회색 박스에 반짝이는(shimmer) 효과를 넣어서.', { aka: ['스켈레톤', '스켈레톤 UI', '로딩 화면', 'Shimmer'] }),
        ],
      },
      {
        id: 'effect',
        title: '효과',
        en: 'Effect',
        items: [
          t('hover-effect', 'Hover Effect', '마우스를 올리면 반응', U.HoverEffect, '카드에 호버 효과를 넣어줘. 마우스를 올리면 위로 4px 떠오르고 그림자가 진해지게, 0.2초 동안.', { aka: ['호버', '마우스 오버', 'mouseover'] }),
          t('scroll-reveal', 'Scroll Reveal', '스크롤하며 등장', U.ScrollReveal, '섹션들이 스크롤로 화면에 들어올 때 아래에서 20px 올라오며 페이드인 되게 해줘. 한 번만 실행되게.', { aka: ['스크롤 애니메이션', '등장 효과', 'AOS'] }),
          t('stagger', 'Stagger Animation', '시간차 순차 등장', U.StaggerAnimation, '', { playground: 'stagger', aka: ['스태거', '순차 등장', '시간차'], adv: true }),
          t('smooth-transition', 'Smooth Transition', '부드러운 상태 전환', U.SmoothTransition, '토글 스위치를 켜고 끌 때 동그라미가 부드럽게 이동하고 배경색이 0.3초 동안 자연스럽게 바뀌게 transition을 넣어줘.', { aka: ['트랜지션', 'transition', '부드럽게'] }),
          t('glassmorphism', 'Glassmorphism', '반투명 유리 스타일', U.Glassmorphism, '카드를 글래스모피즘 스타일로 만들어줘. 반투명 흰 배경, backdrop-filter blur 16px, 얇은 흰 테두리.', { aka: ['글래스모피즘', '유리 효과', '블러', 'blur'], adv: true }),
          t('parallax', 'Parallax Scrolling', '깊이감 있는 시차', U.ParallaxScrolling, '히어로 배경에 패럴랙스 스크롤을 넣어줘. 산 이미지 3겹이 스크롤할 때 뒤쪽일수록 느리게 움직이게.', { aka: ['패럴랙스', '시차 스크롤'], adv: true }),
          t('scroll-snap', 'Scroll Snap', '섹션 단위로 착 정렬', U.ScrollSnap, '전체 페이지를 섹션 단위 스크롤 스냅으로 만들어줘. 스크롤하면 한 섹션씩 화면에 딱 맞게 멈추게 (scroll-snap-type: y mandatory).', { aka: ['스크롤 스냅', '풀페이지', 'fullpage'], adv: true }),
          t('micro-interaction', 'Micro-interaction', '작은 반응 애니메이션', U.MicroInteraction, '좋아요 버튼을 누르면 하트가 분홍색으로 채워지며 통 튀고, 주변에 작은 입자가 터지고, 숫자가 위로 올라가며 바뀌는 마이크로 인터랙션을 넣어줘.', { aka: ['마이크로 인터랙션', '인터랙션', '좋아요 효과'] }),
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
          t('fade', 'Fade', '스르륵', M.Fade, '모달이 나타날 때 0.3초 동안 페이드인 되게 해줘 (opacity 0 → 1).', { aka: ['페이드', '페이드인', '페이드아웃', 'opacity', '투명도'] }),
          t('slide', 'Slide', '슈욱', M.Slide, '알림 카드가 오른쪽에서 슬라이드로 들어오게 해줘. x 100% → 0, 페이드와 함께.', { aka: ['슬라이드', '슬라이드인', 'translate'] }),
          t('scale', 'Scale', '뿅', M.Scale, '장바구니 숫자 배지가 바뀔 때 scale 0에서 1로 뿅 튀어나오게 해줘.', { aka: ['스케일', '확대', '축소', 'zoom'] }),
          t('easing', 'Easing', '사뿐', M.Easing, '모든 애니메이션의 easing을 ease-out(cubic-bezier(0.22, 1, 0.36, 1))으로 통일해줘.', { aka: ['이징', 'ease', 'ease-in-out', 'cubic-bezier', '가속도'] }),
          t('spring', 'Spring', '띠용', M.Spring, '', { playground: 'spring', aka: ['스프링', '탄성', '용수철'] }),
          t('bounce', 'Bounce', '통통', M.Bounce, '완료 체크 아이콘이 위에서 떨어져 바닥에 2~3번 통통 튀며 멈추게 해줘.', { aka: ['바운스', '튕김'] }),
          t('duration-delay', 'Duration·Delay', '휙 / 느릿', M.DurationDelay, '제목은 바로 0.6초 동안, 부제목은 0.2초 늦게(delay) 시작해서 0.6초 동안 나타나게 해줘.', { aka: ['듀레이션', '딜레이', '지연', '속도', '시간'] }),
          t('loop', 'Loop', '둥실둥실', M.Loop, '히어로의 장식 도형이 위아래로 둥실둥실 무한 반복(loop)으로 떠 있게 해줘. 3초 주기로.', { aka: ['루프', '무한 반복', 'infinite', '반복'] }),
          t('ripple', 'Ripple', '눌린 곳에서 퍼지는 물결', M.Ripple, '버튼을 클릭하면 클릭한 위치에서 흰색 원이 퍼지며 사라지는 리플 효과를 넣어줘.', { aka: ['리플', '물결 효과', '클릭 효과'] }),
          t('shake', 'Shake', '도리도리 흔들림', M.Shake, '로그인 실패하면 비밀번호 입력 칸이 좌우로 흔들리고(shake) 테두리가 빨갛게, 아래에 오류 문구가 나오게 해줘.', { aka: ['셰이크', '흔들림', '오류 효과', '진동'] }),
          t('pulse', 'Pulse', '두근두근 깜빡임', M.Pulse, '알림 아이콘 뒤로 원이 퍼져 나가는 펄스 효과를 무한 반복으로 넣어줘. 새 알림이 있을 때만.', { aka: ['펄스', '깜빡임', '두근거림', 'LIVE'] }),
        ],
      },
      {
        id: 'text',
        title: '글자와 그림',
        en: 'Text · Shapes',
        items: [
          t('typewriter', 'Typewriter', '타닥타닥', M.Typewriter, '메인 문구가 한 글자씩 나타나는 타이프라이터 효과를 넣어줘. 커서가 깜빡이고, 다 쓰면 지우고 다음 문구로 넘어가게.', { aka: ['타이핑 효과', '타자 효과', '타이프라이터'] }),
          t('text-scramble', 'Text Scramble', '촤르륵', M.TextScramble, '제목이 나타날 때 랜덤 문자로 뒤섞이다가 왼쪽부터 원래 글자로 맞춰지는 텍스트 스크램블 효과를 넣어줘.', { aka: ['스크램블', '해커 효과', '글자 섞기'], adv: true }),
          t('split-text', 'Split Text', '차르르', M.SplitText, '제목을 글자 단위로 쪼개서(split text) 흩어진 위치에서 0.05초 간격으로 제자리에 모이게 해줘.', { aka: ['스플릿 텍스트', '글자 쪼개기'], adv: true }),
          t('count-up', 'Count-up', '촤라락', M.CountUp, '"함께 쓰는 팀 10,475+" 숫자가 화면에 보이면 0부터 카운트업 되게 해줘. 2초 동안, 끝에서 느려지게.', { aka: ['카운트업', '숫자 올라가기', '카운터'] }),
          t('line-drawing', 'Line Drawing', '쓱쓱', M.LineDrawing, 'SVG 서명 선이 왼쪽부터 쓱 그려지는 라인 드로잉 애니메이션을 넣어줘 (pathLength 0 → 1).', { aka: ['선 그리기', 'SVG 애니메이션', 'path'], adv: true }),
          t('morphing', 'Morphing', '스르르', M.Morphing, '햄버거 메뉴 아이콘을 누르면 세 줄이 X 모양으로 모핑되게 해줘.', { aka: ['모핑', '모양 변형'], adv: true }),
          t('marquee', 'Marquee', '줄줄', M.Marquee, '협력사 로고들을 마퀴로 만들어줘. 오른쪽에서 왼쪽으로 끊김 없이 무한히 흐르고, 마우스를 올리면 멈추게.', { aka: ['마퀴', '흐르는 글자', '롤링 배너', '티커'] }),
          t('motion-path', 'Motion Path', '슝', M.MotionPath, '"담기"를 누르면 상품 이미지가 곡선 경로를 따라 장바구니 아이콘으로 날아가게(motion path) 해줘.', { aka: ['모션 패스', '경로 애니메이션', '장바구니 날아가기'], adv: true }),
        ],
      },
      {
        id: 'screen',
        title: '화면과 마우스',
        en: 'Screen · Mouse',
        items: [
          t('page-transition', 'Page Transition', '휘릭', M.PageTransition, '페이지를 이동할 때 색 패널이 화면을 왼쪽에서 오른쪽으로 덮었다가 지나가는 페이지 전환 효과를 넣어줘.', { aka: ['페이지 전환', '화면 전환', '라우트 전환'], adv: true }),
          t('shared-element', 'Shared Element', '쭈욱', M.SharedElement, '갤러리 썸네일을 누르면 그 이미지가 그대로 커지며 상세 화면이 되는 shared element 전환을 만들어줘 (Motion layoutId 사용).', { aka: ['공유 요소 전환', 'layoutId', 'Hero 애니메이션'], adv: true }),
          t('pin-scrollytelling', 'Pin·Scrollytelling', '착착', M.PinScrollytelling, '기능 소개 섹션에 스크롤텔링을 넣어줘. 왼쪽 휴대폰 이미지는 고정(pin)되고, 스크롤할 때마다 1→2→3 단계 화면으로 바뀌게. GSAP ScrollTrigger 사용.', { aka: ['스크롤텔링', '핀', 'ScrollTrigger', '스크롤 고정'], adv: true }),
          t('horizontal-scroll', 'Horizontal Scroll', '옆으로 스르륵', M.HorizontalScroll, '포트폴리오 섹션에서 세로로 스크롤하면 카드들이 가로로 이동하는 horizontal scroll을 만들어줘. GSAP ScrollTrigger pin 사용.', { aka: ['가로 스크롤', '수평 스크롤'], adv: true }),
          t('magnetic-button', 'Magnetic Button', '착', M.MagneticButton, 'CTA 버튼에 마그네틱 효과를 넣어줘. 마우스가 80px 안으로 오면 버튼이 마우스 쪽으로 살짝 끌려오고, 벗어나면 스프링으로 제자리에 돌아가게.', { aka: ['마그네틱', '자석 버튼'], adv: true }),
          t('custom-cursor', 'Custom Cursor', '졸졸', M.CustomCursor, '기본 커서를 숨기고 작은 원형 커스텀 커서가 마우스를 부드럽게 따라오게 해줘. 이미지 위에서는 커지면서 "보기" 글자가 나오게.', { aka: ['커스텀 커서', '마우스 커서', '커서 효과'], adv: true }),
          t('3d-tilt', '3D Tilt', '갸우뚱', M.Tilt3D, '상품 카드에 3D 틸트 효과를 넣어줘. 마우스 위치에 따라 최대 12도 기울고, 빛 반사가 따라 움직이게.', { aka: ['틸트', '3D 카드', '기울기'], adv: true }),
          t('confetti', 'Confetti', '빵', M.Confetti, '결제가 완료되면 화면 가운데에서 컨페티(색종이)가 터지게 해줘. canvas-confetti 라이브러리 사용.', { aka: ['컨페티', '폭죽', '색종이', '축하 효과'] }),
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
          t('markdown', 'Markdown', '.md 글쓰기 형식', D.Markdown, '프로젝트 기획을 마크다운(.md) 파일로 정리해줘. # 제목, ## 섹션별 소제목, 할 일은 - [ ] 체크리스트로.', { aka: ['마크다운', '.md', 'md 파일'] }),
          t('readme', 'README', '프로젝트 설명서', D.Readme, 'README.md를 만들어줘. 프로젝트 소개 한 줄, 주요 기능, 설치 방법(npm install), 실행 방법(npm run dev)을 넣어서.', { aka: ['리드미', 'README.md', '설명서'] }),
          t('json', 'JSON', '데이터를 담는 형식', D.Json, '상품 목록 데이터를 JSON 파일로 따로 빼줘. 각 상품은 id, name, price, image 필드를 갖게.', { aka: ['제이슨', '.json', '데이터 형식'] }),
          t('env', '.env', '비밀 설정 파일', D.Env, 'API 키를 코드에 직접 쓰지 말고 .env 파일로 옮겨줘. 그리고 .env는 .gitignore에 추가하고, 예시용 .env.example도 만들어줘.', { aka: ['환경변수', '환경 변수', 'env 파일', 'API 키', '.gitignore'] }),
          t('package-json', 'package.json', '프로젝트 명세서', D.PackageJson, 'package.json의 scripts에 "dev", "build", "preview" 명령이 있는지 확인하고, 없으면 Vite 기준으로 추가해줘.', { aka: ['패키지 제이슨', 'dependencies', 'scripts', '의존성'], adv: true }),
        ],
      },
      {
        id: 'concept',
        title: '개념',
        en: 'Concepts',
        items: [
          t('frontend-backend', 'Frontend / Backend', '보이는 쪽 / 안 보이는 쪽', D.FrontendBackend, '지금은 프론트엔드만 있으니까, 로그인과 게시글 저장을 위한 간단한 백엔드를 추가해줘. 프론트와 백엔드 폴더를 나눠서.', { aka: ['프론트엔드', '백엔드', '프론트', '서버', '클라이언트'] }),
          t('api', 'API', '프로그램끼리의 주문 창구', D.Api, '무료 날씨 API를 연결해서 메인 화면에 오늘 날씨와 기온을 보여줘. API 키는 .env에 넣고, 실패하면 "날씨를 불러오지 못했어요" 표시.', { aka: ['에이피아이', 'REST API', '엔드포인트', 'endpoint', 'fetch'] }),
          t('database', 'Database', '데이터 저장 창고', D.Database, '게시글을 새로고침해도 남아 있도록 데이터베이스에 저장해줘. Supabase를 쓰고, posts 테이블에 id, title, content, created_at 컬럼으로.', { aka: ['데이터베이스', 'DB', '디비', '테이블', 'Supabase', 'Firebase'] }),
          t('component', 'Component', '재사용하는 화면 부품', D.Component, '페이지마다 반복되는 버튼을 Button 컴포넌트로 분리해줘. 글자, 색상(primary/secondary), 크기를 props로 바꿀 수 있게.', { aka: ['컴포넌트', 'props', '프롭스', '부품'] }),
          t('state', 'State', '화면이 기억하는 값', D.State, '장바구니 개수를 state로 관리해줘. 담기 버튼을 누르면 1씩 늘고, 헤더의 장바구니 배지 숫자도 같이 바뀌게.', { aka: ['상태', '스테이트', 'useState', '상태 관리'] }),
        ],
      },
      {
        id: 'tools',
        title: '도구·작업',
        en: 'Tools',
        items: [
          t('localhost-port', 'localhost · Port', '내 컴퓨터 주소와 문 번호', D.LocalhostPort, '개발 서버를 4000번 포트로 띄워줘. 이미 쓰고 있으면 다른 번호로 바꾸지 말고 알려줘.', { aka: ['로컬호스트', '포트', 'port', '127.0.0.1', '개발 서버', '로컬'] }),
          t('terminal', 'Terminal', '명령어 입력 창', D.Terminal, '이 프로젝트를 실행하려면 터미널에 어떤 명령어를 순서대로 입력해야 하는지 알려줘.', { aka: ['터미널', 'CLI', '명령 프롬프트', '콘솔', '쉘', 'Shell'] }),
          t('git-commit', 'Commit', '저장 지점 찍기', D.Commit, '지금까지 작업한 걸 커밋해줘. 커밋 메시지는 무엇을 바꿨는지 한 줄로.', { aka: ['커밋', 'Git', '깃', '저장', '버전 관리'] }),
          t('git-branch', 'Branch', '갈라진 작업 줄기', D.Branch, '로그인 기능은 feature/login 브랜치를 만들어서 작업하고, 다 되면 main에 merge해줘.', { aka: ['브랜치', 'main', 'merge', '머지', '병합'], adv: true }),
          t('git-push', 'Push', '온라인에 올리기', D.Push, '커밋한 내용을 GitHub에 push해줘.', { aka: ['푸시', 'Pull', '풀', '업로드', 'GitHub', '깃허브', '원격 저장소'] }),
          t('npm-install', 'npm install', '부품 설치하기', D.NpmInstall, '애니메이션에 motion 라이브러리를 쓰고 싶어. npm install로 설치하고 사용 예시를 하나 넣어줘.', { aka: ['npm', '엔피엠', '라이브러리', '패키지', 'node_modules', 'yarn', 'pnpm'] }),
          t('build', 'Build', '배포용으로 묶기', D.Build, 'npm run build로 빌드해보고, 에러가 나면 원인을 찾아서 고쳐줘.', { aka: ['빌드', 'dist', '번들', 'bundle'], adv: true }),
          t('deploy', 'Deploy', '인터넷에 공개하기', D.Deploy, '이 사이트를 Vercel에 배포하는 방법을 단계별로 알려줘. GitHub 저장소와 연결해서 push하면 자동 배포되게.', { aka: ['배포', '디플로이', '호스팅', 'Vercel', 'Netlify', '출시'] }),
          t('domain', 'Domain', '사이트 주소', D.Domain, '구매한 도메인 myapp.site를 Vercel에 배포한 사이트에 연결하려면 DNS 설정을 어떻게 해야 하는지 알려줘.', { aka: ['도메인', 'DNS', 'IP', 'URL', '주소', '웹 주소'] }),
        ],
      },
      {
        id: 'github',
        title: 'GitHub',
        en: 'GitHub',
        items: [
          t('github-repo', 'GitHub / Repository', '코드를 올려두는 온라인 보관소', D2.GithubRepo, '이 프로젝트를 GitHub에 새 저장소(repository)로 올려줘. 저장소 이름은 my-app, README도 같이.', { aka: ['깃허브', '레포', '레포지토리', '저장소', 'repo'] }),
          t('git-clone', 'Clone', '저장소 통째로 내려받기', D2.Clone, '이 GitHub 저장소를 내 컴퓨터에 clone해서 실행할 수 있게 해줘: (저장소 주소 붙여넣기)', { aka: ['클론', 'git clone', '내려받기', '복제'] }),
          t('pull-request', 'Pull Request', '내 수정을 합쳐달라는 요청', D2.PullRequest, '지금 브랜치의 변경 사항으로 Pull Request를 만들어줘. 제목과 설명에 무엇을 왜 바꿨는지 정리해서.', { aka: ['PR', '풀 리퀘스트', '풀리퀘', '코드 리뷰', 'Merge Request'], adv: true }),
          t('merge-conflict', 'Merge Conflict', '같은 줄을 고쳐서 생긴 충돌', D2.MergeConflict, 'merge하다가 충돌(conflict)이 났어. 충돌난 파일을 보여주고, 두 수정 중 어떤 걸 살릴지 설명해준 다음 해결해줘.', { aka: ['머지 충돌', '병합 충돌', '컨플릭트', 'conflict'], adv: true }),
          t('fork', 'Fork', '남의 저장소를 내 계정으로 복사', D2.Fork, '이 오픈소스 저장소를 fork해서 내 계정에서 수정하고 싶어. fork한 다음 내 컴퓨터로 가져오는 순서를 알려줘.', { aka: ['포크', '복사', '내 계정으로 가져오기'], adv: true }),
          t('gitignore', '.gitignore', 'GitHub에 안 올릴 파일 목록', D2.Gitignore, '.gitignore 파일을 만들어줘. .env, node_modules, dist, .DS_Store는 GitHub에 올라가지 않게.', { aka: ['깃이그노어', 'gitignore', '무시 목록', '제외 파일'] }),
          t('github-actions', 'GitHub Actions', 'push하면 자동으로 돌아가는 작업', D2.GithubActions, 'main에 push할 때마다 자동으로 테스트하고 빌드하는 GitHub Actions 워크플로를 만들어줘.', { aka: ['깃허브 액션', '액션', 'CI/CD', 'CI', '워크플로', '자동화'], adv: true }),
        ],
      },
      {
        id: 'tech',
        title: '기술 이름',
        en: 'Tech Names',
        items: [
          t('html-css-js', 'HTML / CSS / JavaScript', '웹의 뼈대·옷·움직임', D2.HtmlCssJs, '간단한 소개 페이지를 HTML, CSS, JavaScript 파일 세 개로 나눠서 만들어줘. 버튼을 누르면 인사말이 바뀌게.', { aka: ['HTML', 'CSS', 'JavaScript', '자바스크립트', 'JS', '웹 기초'] }),
          t('library-framework', 'Library / Framework', '골라 쓰는 도구 vs 정해진 틀', D2.LibraryFramework, '이 프로젝트에 라이브러리를 쓰는 게 나을지, Next.js 같은 프레임워크를 쓰는 게 나을지 장단점을 비교해서 추천해줘.', { aka: ['라이브러리', '프레임워크', 'React', '리액트', 'Next.js', '넥스트'] }),
          t('typescript', 'TypeScript', '실수를 미리 잡아주는 JavaScript', D2.TypeScript, '이 프로젝트를 TypeScript로 바꿔줘. 타입 에러가 나는 곳은 하나씩 고쳐주고 무엇이 문제였는지 설명해줘.', { aka: ['타입스크립트', 'TS', '.ts', '타입'], adv: true }),
          t('tailwind', 'Tailwind CSS', '이름표로 꾸미는 스타일', D2.Tailwind, '이 버튼 스타일을 Tailwind CSS 클래스로 바꿔줘. 주황 배경, 흰 글씨, 둥근 모양, 그림자.', { aka: ['테일윈드', 'Tailwind', '유틸리티 CSS', 'className'] }),
          t('nodejs', 'Node.js', '내 컴퓨터에서 JS를 돌리는 엔진', D2.NodeJs, '이 프로젝트를 실행하려면 Node.js가 필요하다는데, 맥에 설치하는 방법과 설치됐는지 확인하는 명령어를 알려줘.', { aka: ['노드', '노드제이에스', 'node', 'nvm', '런타임'] }),
          t('auth', 'Login / Auth', '로그인과 본인 확인', D2.LoginAuth, '이메일 로그인과 구글 소셜 로그인을 추가해줘. Supabase Auth를 쓰고, 로그인하면 헤더에 내 이름과 아바타가 보이게.', { aka: ['로그인', '회원가입', '인증', '소셜 로그인', 'OAuth', '세션'] }),
          t('dev-production', 'Dev / Production', '연습용 환경 vs 실제 서비스', D2.DevProd, '개발 환경과 운영 환경을 나눠줘. API 주소와 키는 환경마다 다르게 .env.development, .env.production으로 관리하고.', { aka: ['개발 환경', '운영 환경', '프로덕션', '스테이징', '로컬', '배포 환경'], adv: true }),
        ],
      },
      {
        id: 'problems',
        title: '문제 상황',
        en: 'Troubleshooting',
        items: [
          t('console-error', 'Console · Error', '에러 메시지 확인하는 곳', D.ConsoleError, '화면이 하얗게 나와. 콘솔에 이런 에러가 떠: (에러 메시지 붙여넣기). 원인을 찾아서 고쳐줘.', { aka: ['콘솔', '에러', '오류', '개발자 도구', 'DevTools', 'F12', '디버깅'] }),
          t('cache', 'Cache', '한 번 받은 걸 저장해 두기', D.Cache, '코드를 고쳤는데 화면이 안 바뀌어. 캐시 문제인지 확인하는 방법과 강력 새로고침 방법을 알려줘.', { aka: ['캐시', '캐싱', '강력 새로고침', '새로고침'] }),
          t('cors', 'CORS', '다른 주소 요청 차단', D.Cors, '프론트에서 API를 부르면 CORS 에러가 나. 백엔드에서 내 사이트 주소(localhost:4000)를 허용하도록 고쳐줘.', { aka: ['코스', 'CORS 에러', 'CORS 오류', '교차 출처'], adv: true }),
          t('bug-debugging', 'Bug / Debugging', '오류와 오류 찾기', D2.BugDebugging, '버튼을 눌러도 아무 반응이 없어. 디버깅해서 원인을 찾고, 무엇이 문제였는지 쉽게 설명한 다음 고쳐줘.', { aka: ['버그', '디버깅', '디버그', '오류 수정', '고장'] }),
          t('refactoring', 'Refactoring', '동작은 그대로, 코드만 정리', D2.Refactoring, '화면 동작은 그대로 두고 코드만 리팩토링해줘. 중복된 부분은 컴포넌트로 빼고, 파일이 너무 길면 나눠서.', { aka: ['리팩토링', '리팩터링', '코드 정리', '클린 코드'], adv: true }),
          t('dependency-conflict', 'Dependency Conflict', '부품끼리 버전이 안 맞음', D2.DependencyConflict, 'npm install 하면 버전 충돌(ERESOLVE) 에러가 나. 어떤 라이브러리끼리 부딪히는지 찾아서 맞는 버전으로 정리해줘.', { aka: ['의존성 충돌', '버전 충돌', 'ERESOLVE', 'peer dependency', '호환성'], adv: true }),
          t('error-404-500', '404 / 500', '페이지 없음 vs 서버 고장', D2.ErrorPages, '없는 주소로 들어오면 보여줄 404 페이지를 만들어줘. "페이지를 찾을 수 없어요" 문구와 홈으로 가는 버튼을 넣어서.', { aka: ['404', '500', '에러 페이지', 'Not Found', '서버 오류', '상태 코드'] }),
        ],
      },
    ],
  },
  {
    id: 'ai',
    short: 'AI',
    title: 'AI 필수 용어',
    intro: 'AI와 함께 만들 때 매일 듣지만 아무도 설명해주지 않는 말이에요. 알고 쓰면 AI를 훨씬 잘 다룰 수 있어요.',
    sections: [
      {
        id: 'ai-basics',
        title: 'AI 기초',
        en: 'AI Basics',
        items: [
          t('llm', 'LLM', '말을 이어 쓰는 거대한 AI', A.Llm, 'LLM이 어떻게 답을 만드는지 비전공자도 알 수 있게 예시를 들어 설명해줘.', { aka: ['엘엘엠', '대규모 언어 모델', '언어 모델', 'ChatGPT', 'Claude', '챗봇'] }),
          t('ai-model', 'Model', 'AI의 종류와 등급', A.Model, '간단한 문구 수정은 빠른 모델로, 복잡한 기능 개발은 가장 똑똑한 모델로 나눠 쓰고 싶어. 어떤 기준으로 고르면 될까?', { aka: ['모델', 'AI 모델', 'GPT', 'Opus', 'Sonnet', 'Haiku'] }),
          t('prompt', 'Prompt', 'AI에게 하는 요청 문장', A.Prompt, '내가 쓴 요청을 더 구체적인 프롬프트로 다듬어줘: "버튼 예쁘게 만들어줘"', { aka: ['프롬프트', '프롬프트 엔지니어링', '지시문', '요청'] }),
          t('token', 'Token', 'AI가 글을 세는 단위', A.Token, '지금 대화가 길어져서 토큰을 많이 쓰는 것 같아. 지금까지 결정한 내용을 짧게 요약해줘. 새 대화에 붙여넣을 수 있게.', { aka: ['토큰', '토큰 수', '사용량', '요금'], adv: true }),
          t('context-window', 'Context Window', 'AI가 한 번에 기억하는 양', A.ContextWindow, '대화가 너무 길어져서 앞 내용을 잊는 것 같아. 지금까지 정한 규칙과 진행 상황을 요약해서 다시 기억해줘.', { aka: ['컨텍스트', '컨텍스트 윈도우', '문맥', '기억력', '대화 길이'], adv: true }),
          t('hallucination', 'Hallucination', 'AI가 그럴듯하게 지어낸 말', A.Hallucination, '방금 알려준 라이브러리 함수가 실제로 있는 건지 공식 문서 기준으로 다시 확인해줘. 확실하지 않으면 모른다고 말해줘.', { aka: ['할루시네이션', '환각', '거짓 답변', '지어내기'] }),
        ],
      },
      {
        id: 'ai-tools',
        title: 'AI 도구',
        en: 'AI Tools',
        items: [
          t('vibe-coding', 'Vibe Coding', '말로 설명하며 만드는 개발', A.VibeCoding, '코딩을 몰라도 돼. 내가 원하는 걸 말하면 하나씩 만들어주고, 매 단계 무엇을 했는지 쉽게 설명해줘.', { aka: ['바이브코딩', '바이브 코딩', 'AI 코딩', '노코드'] }),
          t('ai-agent', 'AI Agent', '스스로 일을 처리하는 AI', A.AiAgent, '로그인 버그를 고쳐줘. 관련 파일을 찾아보고, 고친 다음 직접 실행해서 확인하고, 무엇을 바꿨는지 보고해줘.', { aka: ['에이전트', 'AI 에이전트', '에이전틱', '자동 실행'] }),
          t('ai-coding-tool', 'AI Coding Tool', 'AI가 들어간 코딩 프로그램', A.AiCodingTool, '이 프로젝트 구조를 먼저 훑어보고, 버튼 색을 주황색으로 바꾸는 데 어떤 파일을 고쳐야 하는지 알려준 다음 수정해줘.', { aka: ['Claude Code', '클로드 코드', 'Cursor', '커서', 'Copilot', 'AI 에디터'] }),
          t('mcp', 'MCP', 'AI에 도구를 꽂는 표준 콘센트', A.Mcp, '노션 MCP를 연결해서, 노션에 정리된 기획 문서를 읽고 그대로 화면을 만들어줘.', { aka: ['엠씨피', 'Model Context Protocol', '커넥터', '도구 연결', '플러그인'], adv: true }),
          t('rules-file', 'Rules 파일', 'AI에게 미리 주는 작업 규칙', A.RulesFile, '이 프로젝트용 CLAUDE.md를 만들어줘. 항상 한국어로 답하기, 커밋 전에 빌드 확인, 색은 주황색 계열만 쓰기 규칙을 넣어서.', { aka: ['CLAUDE.md', '.cursorrules', 'AGENTS.md', '규칙 파일', '시스템 프롬프트', '메모리'] }),
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
