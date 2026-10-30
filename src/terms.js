import * as U from './demos/ui'
import * as M from './demos/motion'

const t = (id, en, ko, Demo, desc, prompt, extra = {}) => ({ id, en, ko, Demo, desc, prompt, ...extra })

export const GROUPS = [
  {
    id: 'ui',
    title: 'UI 필수 용어',
    en: 'UI TERMS',
    intro: '화면을 이루는 부품과 배치 이름이에요. AI에게 "이런 거"라고 말하는 대신 이름으로 부르세요.',
    sections: [
      {
        id: 'layout',
        title: '레이아웃',
        en: 'Layout',
        items: [
          t('hero-section', 'Hero Section', '첫 화면의 대표 영역', U.HeroSection, '사이트에 들어오자마자 보이는 첫 화면이에요. 큰 제목, 짧은 설명, 행동 버튼(CTA)이 들어가요.', '랜딩 페이지 맨 위에 히어로 섹션을 만들어줘. 큰 제목, 한 줄 설명, "시작하기" 버튼을 넣고 화면 높이의 80%를 차지하게 해줘.'),
          t('responsive-layout', 'Responsive Layout', '화면 폭에 맞춘 배치', U.ResponsiveLayout, '화면 크기에 따라 배치가 바뀌는 방식이에요. PC에서는 3열, 모바일에서는 1열처럼요.', '카드 목록을 반응형으로 만들어줘. 데스크톱 3열, 태블릿 2열, 모바일(768px 이하)은 1열로.'),
          t('card-layout', 'Card Layout', '정보를 카드로 나누기', U.CardLayout, '정보를 네모난 카드 단위로 나눠 보여줘요. 상품 목록, 블로그 글 목록에 자주 써요.', '상품을 카드 레이아웃으로 보여줘. 각 카드에 이미지, 이름, 가격이 있고 모서리는 둥글게 해줘.'),
          t('bento-grid', 'Bento Grid', '크기 다른 카드 격자', U.BentoGrid, '도시락(벤토)처럼 크기가 다른 칸을 격자로 배치해요. 제품 기능 소개 페이지에서 자주 보여요.', '기능 소개를 벤토 그리드로 만들어줘. 4열 격자에 첫 카드는 2x2 크기, 나머지는 1x1과 2x1을 섞어서.'),
          t('sidebar-layout', 'Sidebar Layout', '옆에 고정된 메뉴', U.SidebarLayout, '한쪽에 메뉴가 고정되고 다른 쪽 내용만 바뀌어요. 관리자 화면, 대시보드의 기본 구조예요.', '대시보드를 사이드바 레이아웃으로 만들어줘. 왼쪽 240px 고정 메뉴, 현재 메뉴는 강조 표시, 오른쪽은 콘텐츠 영역.'),
          t('sticky-header', 'Sticky Header', '스크롤해도 남는 헤더', U.StickyHeader, '스크롤을 내려도 상단 메뉴가 화면 위에 붙어 있어요.', '헤더를 sticky로 만들어줘. 스크롤해도 상단에 고정되고, 스크롤이 시작되면 아래쪽에 그림자가 생기게.'),
          t('split-layout', 'Split Layout', '좌우 분할 배치', U.SplitLayout, '화면을 둘로 나눠 한쪽엔 글, 한쪽엔 이미지를 둬요. 로그인 화면, 소개 섹션에 많이 써요.', '소개 섹션을 좌우 분할 레이아웃으로 만들어줘. 왼쪽은 제목·설명·버튼, 오른쪽은 이미지. 모바일에서는 위아래로 쌓이게.'),
        ],
      },
      {
        id: 'component',
        title: '컴포넌트',
        en: 'Component',
        items: [
          t('tabs', 'Tabs', '같은 자리 내용 전환', U.Tabs, '버튼을 누르면 같은 자리의 내용이 바뀌어요. 공간을 아끼면서 여러 정보를 보여줄 때 써요.', '상품 상세에 탭을 만들어줘. "상세정보 / 리뷰 / 문의" 3개 탭, 선택된 탭 아래 밑줄이 미끄러지듯 이동하게.'),
          t('accordion', 'Accordion', '펼치고 접는 목록', U.Accordion, '제목을 누르면 아래 내용이 펼쳐지고, 다시 누르면 접혀요. FAQ(자주 묻는 질문)에 거의 항상 쓰여요.', '', { playground: 'accordion' }),
          t('modal', 'Modal / Dialog', '화면 위 확인 창', U.Modal, '화면 위에 창이 뜨고 뒤는 어두워져요. 삭제 확인, 로그인 창 등에 써요.', '삭제 버튼을 누르면 확인 모달을 띄워줘. 배경은 반투명 검정으로 어둡게, 창은 살짝 커지며 나타나고 ESC나 바깥 클릭으로 닫히게.'),
          t('drawer', 'Drawer', '옆에서 열리는 패널', U.Drawer, '화면 옆에서 서랍처럼 패널이 미끄러져 나와요. 모바일 메뉴, 장바구니, 필터에 자주 써요.', '햄버거 버튼을 누르면 오른쪽에서 드로어 메뉴가 슬라이드로 열리게 해줘. 너비 300px, 바깥을 누르면 닫히게.'),
          t('dropdown', 'Dropdown', '아래로 펼치는 목록', U.Dropdown, '버튼을 누르면 아래로 선택지 목록이 펼쳐져요.', '카테고리 선택용 드롭다운을 만들어줘. 클릭하면 아래로 목록이 펼쳐지고, 항목에 마우스를 올리면 배경이 강조되게.'),
          t('tooltip', 'Tooltip', '작은 설명 말풍선', U.Tooltip, '아이콘이나 버튼에 마우스를 올리면 작은 설명 말풍선이 떠요.', '물음표 아이콘에 마우스를 올리면 툴팁으로 "비밀번호는 8자 이상" 설명이 위쪽에 뜨게 해줘.'),
          t('toast', 'Toast / Snackbar', '잠깐 나타나는 알림', U.Toast, '작업 결과를 잠깐 띄웠다가 저절로 사라지는 알림이에요.', '저장하면 화면 아래 가운데에 "저장되었어요" 토스트가 올라왔다가 3초 뒤 사라지게 해줘.'),
          t('carousel', 'Carousel', '옆으로 넘기는 카드', U.Carousel, '여러 장을 옆으로 넘겨 보는 슬라이드예요. 배너, 후기 목록에 써요.', '후기 카드를 캐러셀로 만들어줘. 좌우 화살표와 아래 점(인디케이터)을 넣고 3초마다 자동으로 넘어가게.'),
          t('skeleton-loading', 'Skeleton Loading', '로딩 중 윤곽 먼저', U.SkeletonLoading, '데이터가 오기 전에 회색 윤곽을 먼저 보여줘서 덜 기다리는 느낌을 줘요.', '목록을 불러오는 동안 스켈레톤 로딩을 보여줘. 실제 카드와 같은 모양의 회색 박스에 반짝이는(shimmer) 효과를 넣어서.'),
        ],
      },
      {
        id: 'effect',
        title: '효과',
        en: 'Effect',
        items: [
          t('hover-effect', 'Hover Effect', '마우스를 올리면 반응', U.HoverEffect, '마우스를 올렸을 때 카드가 떠오르거나 색이 바뀌는 반응이에요.', '카드에 호버 효과를 넣어줘. 마우스를 올리면 위로 4px 떠오르고 그림자가 진해지게, 0.2초 동안.'),
          t('scroll-reveal', 'Scroll Reveal', '스크롤하며 등장', U.ScrollReveal, '스크롤해서 요소가 화면에 들어올 때 스르륵 나타나요.', '섹션들이 스크롤로 화면에 들어올 때 아래에서 20px 올라오며 페이드인 되게 해줘. 한 번만 실행되게.'),
          t('stagger', 'Stagger Animation', '시간차 순차 등장', U.StaggerAnimation, '여러 요소가 한꺼번에가 아니라, 조금씩 시간차를 두고 차례로 나타나요.', '', { playground: 'stagger' }),
          t('smooth-transition', 'Smooth Transition', '부드러운 상태 전환', U.SmoothTransition, '상태가 바뀔 때 뚝 끊기지 않고 부드럽게 바뀌어요. 색, 크기, 위치 모두요.', '토글 스위치를 켜고 끌 때 동그라미가 부드럽게 이동하고 배경색이 0.3초 동안 자연스럽게 바뀌게 transition을 넣어줘.'),
          t('glassmorphism', 'Glassmorphism', '반투명 유리 스타일', U.Glassmorphism, '뒤가 흐릿하게 비치는 반투명 유리 같은 스타일이에요.', '카드를 글래스모피즘 스타일로 만들어줘. 반투명 흰 배경, backdrop-filter blur 16px, 얇은 흰 테두리.'),
          t('parallax', 'Parallax Scrolling', '깊이감 있는 시차', U.ParallaxScrolling, '스크롤할 때 배경과 앞쪽이 다른 속도로 움직여서 깊이감이 생겨요. 멀리 있는 건 느리게, 가까운 건 빠르게.', '히어로 배경에 패럴랙스 스크롤을 넣어줘. 산 이미지 3겹이 스크롤할 때 뒤쪽일수록 느리게 움직이게.'),
          t('scroll-snap', 'Scroll Snap', '섹션 단위로 착 정렬', U.ScrollSnap, '스크롤을 멈추면 섹션 단위로 딱 맞춰 정렬돼요. 한 화면에 한 섹션씩 넘길 때 써요.', '전체 페이지를 섹션 단위 스크롤 스냅으로 만들어줘. 스크롤하면 한 섹션씩 화면에 딱 맞게 멈추게 (scroll-snap-type: y mandatory).'),
          t('micro-interaction', 'Micro-interaction', '작은 반응 애니메이션', U.MicroInteraction, '좋아요 하트가 톡 튀는 것처럼, 작은 행동에 돌아오는 작은 반응이에요.', '좋아요 버튼을 누르면 하트가 분홍색으로 채워지며 통 튀고, 주변에 작은 입자가 터지고, 숫자가 위로 올라가며 바뀌는 마이크로 인터랙션을 넣어줘.'),
        ],
      },
    ],
  },
  {
    id: 'motion',
    title: '애니메이션 필수 용어',
    en: 'MOTION TERMS',
    intro: '움직임을 부르는 이름이에요. 어떻게 움직일지 정확히 말할수록 AI가 원하는 대로 만들어요.',
    sections: [
      {
        id: 'basics',
        title: '기본',
        en: 'Basics',
        items: [
          t('fade', 'Fade', '스르륵', M.Fade, '투명도(opacity)를 0에서 1로 바꿔 나타나거나 사라지게 해요. 가장 기본적인 애니메이션이에요.', '모달이 나타날 때 0.3초 동안 페이드인 되게 해줘 (opacity 0 → 1).'),
          t('slide', 'Slide', '슈욱', M.Slide, '위치를 옮기며 들어오거나 나가요. 보통 페이드와 함께 써요.', '알림 카드가 오른쪽에서 슬라이드로 들어오게 해줘. x 100% → 0, 페이드와 함께.'),
          t('scale', 'Scale', '뿅', M.Scale, '크기를 키우거나 줄여요. 배지 숫자가 바뀔 때 뿅 하고 커지는 식이에요.', '장바구니 숫자 배지가 바뀔 때 scale 0에서 1로 뿅 튀어나오게 해줘.'),
          t('easing', 'Easing', '사뿐', M.Easing, '같은 시간 동안 움직여도 처음과 끝의 속도 변화를 정해요. 자연스러움의 대부분이 여기서 결정돼요.', '모든 애니메이션의 easing을 ease-out(cubic-bezier(0.22, 1, 0.36, 1))으로 통일해줘.'),
          t('spring', 'Spring', '띠용', M.Spring, '시간 대신 탄성(용수철)으로 움직여요. 목표를 살짝 지나쳤다 돌아오며 살아있는 느낌을 줘요.', '', { playground: 'spring' }),
          t('bounce', 'Bounce', '통통', M.Bounce, '공이 바닥에 튀듯 여러 번 튕기다가 멈춰요.', '완료 체크 아이콘이 위에서 떨어져 바닥에 2~3번 통통 튀며 멈추게 해줘.'),
          t('duration-delay', 'Duration·Delay', '휙 / 느릿', M.DurationDelay, 'duration은 "얼마나 오래" 움직이는지, delay는 "언제 시작할지"예요.', '제목은 바로 0.6초 동안, 부제목은 0.2초 늦게(delay) 시작해서 0.6초 동안 나타나게 해줘.'),
          t('loop', 'Loop', '둥실둥실', M.Loop, '애니메이션이 끝나면 처음부터 계속 반복해요. 둥둥 떠 있는 장식에 자주 써요.', '히어로의 장식 도형이 위아래로 둥실둥실 무한 반복(loop)으로 떠 있게 해줘. 3초 주기로.'),
        ],
      },
      {
        id: 'text',
        title: '글자와 그림',
        en: 'Text · Shapes',
        items: [
          t('typewriter', 'Typewriter', '타닥타닥', M.Typewriter, '글자가 타자 치듯 한 글자씩 나타나요.', '메인 문구가 한 글자씩 나타나는 타이프라이터 효과를 넣어줘. 커서가 깜빡이고, 다 쓰면 지우고 다음 문구로 넘어가게.'),
          t('text-scramble', 'Text Scramble', '촤르륵', M.TextScramble, '글자가 무작위로 뒤섞이다가 원래 글자로 맞춰져요.', '제목이 나타날 때 랜덤 문자로 뒤섞이다가 왼쪽부터 원래 글자로 맞춰지는 텍스트 스크램블 효과를 넣어줘.'),
          t('split-text', 'Split Text', '차르르', M.SplitText, '문장을 글자(또는 단어) 단위로 쪼개서 하나씩 따로 움직여요.', '제목을 글자 단위로 쪼개서(split text) 흩어진 위치에서 0.05초 간격으로 제자리에 모이게 해줘.'),
          t('count-up', 'Count-up', '촤라락', M.CountUp, '숫자가 0부터 목표값까지 빠르게 올라가요. 실적, 통계 숫자에 써요.', '"함께 쓰는 팀 10,475+" 숫자가 화면에 보이면 0부터 카운트업 되게 해줘. 2초 동안, 끝에서 느려지게.'),
          t('line-drawing', 'Line Drawing', '쓱쓱', M.LineDrawing, '선이 펜으로 그리듯 나타나요. SVG 선, 아이콘, 서명에 써요.', 'SVG 서명 선이 왼쪽부터 쓱 그려지는 라인 드로잉 애니메이션을 넣어줘 (pathLength 0 → 1).'),
          t('morphing', 'Morphing', '스르르', M.Morphing, '한 모양이 다른 모양으로 자연스럽게 변해요. 햄버거 아이콘 → X가 대표적이에요.', '햄버거 메뉴 아이콘을 누르면 세 줄이 X 모양으로 모핑되게 해줘.'),
          t('marquee', 'Marquee', '줄줄', M.Marquee, '글자나 로고가 띠처럼 끊임없이 옆으로 흘러가요.', '협력사 로고들을 마퀴로 만들어줘. 오른쪽에서 왼쪽으로 끊김 없이 무한히 흐르고, 마우스를 올리면 멈추게.'),
          t('motion-path', 'Motion Path', '슝', M.MotionPath, '정해진 곡선 경로를 따라 움직여요.', '"담기"를 누르면 상품 이미지가 곡선 경로를 따라 장바구니 아이콘으로 날아가게(motion path) 해줘.'),
        ],
      },
      {
        id: 'screen',
        title: '화면과 마우스',
        en: 'Screen · Mouse',
        items: [
          t('page-transition', 'Page Transition', '휘릭', M.PageTransition, '페이지를 이동할 때 화면이 바뀌는 연출이에요.', '페이지를 이동할 때 색 패널이 화면을 왼쪽에서 오른쪽으로 덮었다가 지나가는 페이지 전환 효과를 넣어줘.'),
          t('shared-element', 'Shared Element', '쭈욱', M.SharedElement, '목록의 썸네일이 그대로 커지면서 상세 화면이 돼요. 같은 요소가 이어지는 느낌을 줘요.', '갤러리 썸네일을 누르면 그 이미지가 그대로 커지며 상세 화면이 되는 shared element 전환을 만들어줘 (Motion layoutId 사용).'),
          t('pin-scrollytelling', 'Pin·Scrollytelling', '착착', M.PinScrollytelling, '스크롤하는 동안 한 요소가 화면에 고정(pin)되고, 스크롤에 따라 내용이 단계별로 바뀌어요.', '기능 소개 섹션에 스크롤텔링을 넣어줘. 왼쪽 휴대폰 이미지는 고정(pin)되고, 스크롤할 때마다 1→2→3 단계 화면으로 바뀌게. GSAP ScrollTrigger 사용.'),
          t('horizontal-scroll', 'Horizontal Scroll', '옆으로 스르륵', M.HorizontalScroll, '마우스로 세로 스크롤을 하는데 내용은 가로로 움직여요.', '포트폴리오 섹션에서 세로로 스크롤하면 카드들이 가로로 이동하는 horizontal scroll을 만들어줘. GSAP ScrollTrigger pin 사용.'),
          t('magnetic-button', 'Magnetic Button', '착', M.MagneticButton, '마우스가 가까이 오면 버튼이 자석처럼 살짝 끌려와요.', 'CTA 버튼에 마그네틱 효과를 넣어줘. 마우스가 80px 안으로 오면 버튼이 마우스 쪽으로 살짝 끌려오고, 벗어나면 스프링으로 제자리에 돌아가게.'),
          t('custom-cursor', 'Custom Cursor', '졸졸', M.CustomCursor, '기본 화살표 대신 직접 만든 커서가 마우스를 따라다녀요.', '기본 커서를 숨기고 작은 원형 커스텀 커서가 마우스를 부드럽게 따라오게 해줘. 이미지 위에서는 커지면서 "보기" 글자가 나오게.'),
          t('3d-tilt', '3D Tilt', '갸우뚱', M.Tilt3D, '마우스 위치에 따라 카드가 입체적으로 기울어져요.', '상품 카드에 3D 틸트 효과를 넣어줘. 마우스 위치에 따라 최대 12도 기울고, 빛 반사가 따라 움직이게.'),
          t('confetti', 'Confetti', '빵', M.Confetti, '축하할 때 색종이가 터져요. 결제 완료, 목표 달성 화면에 써요.', '결제가 완료되면 화면 가운데에서 컨페티(색종이)가 터지게 해줘. canvas-confetti 라이브러리 사용.'),
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
