import { SupportedLanguageCode, LanguageOption, TranslationKeyItem } from '../types';
import { DESTINATION_PAGES_TRANSLATION_KEYS } from './translations/destinationPages';
import { SUBPAGES_EXTRA_TRANSLATION_KEYS } from './translations/subpagesExtra';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English (US)', flag: '🇺🇸', regionCode: 'US', displayCode: 'EN' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', regionCode: 'ID', displayCode: 'ID' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', regionCode: 'VN', displayCode: 'VN' },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳', regionCode: 'CN', displayCode: 'CN' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', regionCode: 'JP', displayCode: 'JP' },
  { code: 'th', name: 'Thai', nativeName: 'ภาษาไทย', flag: '🇹🇭', regionCode: 'TH', displayCode: 'TH' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', regionCode: 'KR', displayCode: 'KR' }
];

export const INITIAL_TRANSLATION_KEYS: TranslationKeyItem[] = [
  // --- COMMON ---
  {
    id: 'key-com-1',
    key: 'common.save',
    category: 'common',
    description: 'Save action button label',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Save',
      id: 'Simpan',
      vi: 'Lưu',
      zh: '保存',
      ja: '保存',
      th: 'บันทึก',
      ko: '저장'
    }
  },
  {
    id: 'key-com-2',
    key: 'common.cancel',
    category: 'common',
    description: 'Cancel button label',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Cancel',
      id: 'Batal',
      vi: 'Hủy',
      zh: '取消',
      ja: 'キャンセル',
      th: 'ยกเลิก',
      ko: '취소'
    }
  },
  {
    id: 'key-com-3',
    key: 'common.loading',
    category: 'common',
    description: 'Generic loading text',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Loading...',
      id: 'Memuat...',
      vi: 'Đang tải...',
      zh: '加载中...',
      ja: '読み込み中...',
      th: 'กำลังโหลด...',
      ko: '로딩 중...'
    }
  },
  {
    id: 'key-com-4',
    key: 'common.language',
    category: 'common',
    description: 'Language label',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Language',
      id: 'Bahasa',
      vi: 'Ngôn ngữ',
      zh: '语言',
      ja: '言語',
      th: 'ภาษา',
      ko: '언어'
    }
  },
  {
    id: 'key-com-5',
    key: 'common.search',
    category: 'common',
    description: 'Search input placeholder or button',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Search...',
      id: 'Cari...',
      vi: 'Tìm kiếm...',
      zh: '搜索...',
      ja: '検索...',
      th: 'ค้นหา...',
      ko: '검색...'
    }
  },

  // --- NAVIGATION ---
  {
    id: 'key-nav-1',
    key: 'nav.how_it_works',
    category: 'nav',
    description: 'Header link to How It Works section',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'How it Works',
      id: 'Cara Kerja',
      vi: 'Cách hoạt động',
      zh: '工作原理',
      ja: '使い方',
      th: 'วิธีใช้งาน',
      ko: '작동 방식'
    }
  },
  {
    id: 'key-nav-2',
    key: 'nav.capsule_types',
    category: 'nav',
    description: 'Header link to Capsule Types section',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Capsule Types',
      id: 'Tipe Kapsul',
      vi: 'Loại Capsule',
      zh: '胶囊类型',
      ja: 'カプセルタイプ',
      th: 'ประเภทแคปซูล',
      ko: '캡슐 유형'
    }
  },
  {
    id: 'key-nav-3',
    key: 'nav.pricing',
    category: 'nav',
    description: 'Header link to Pricing section',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Pricing',
      id: 'Harga',
      vi: 'Bảng giá',
      zh: '价格',
      ja: '料金プラン',
      th: 'ราคา',
      ko: '요금제'
    }
  },
  {
    id: 'key-nav-4',
    key: 'nav.faq',
    category: 'nav',
    description: 'Header link to FAQ section',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'FAQ',
      id: 'Tanya Jawab',
      vi: 'Hỏi đáp',
      zh: '常见问题',
      ja: 'よくある質問',
      th: 'คำถามที่พบบ่อย',
      ko: '자주 묻는 질문'
    }
  },
  {
    id: 'key-nav-5',
    key: 'nav.contact_support',
    category: 'nav',
    description: 'Header contact support link',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Contact Support',
      id: 'Hubungi Bantuan',
      vi: 'Liên hệ hỗ trợ',
      zh: '联系支持',
      ja: 'サポートにお問い合わせ',
      th: 'ติดต่อฝ่ายซัพพอร์ต',
      ko: '고객 지원'
    }
  },
  {
    id: 'key-nav-6',
    key: 'nav.explore_demo',
    category: 'nav',
    description: 'Header button to launch interactive demo',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Explore Demo',
      id: 'Jelajahi Demo',
      vi: 'Khám phá Demo',
      zh: '探索演示',
      ja: 'デモを見る',
      th: 'ลองใช้งานเดโม',
      ko: 'เดโม 체험하기'
    }
  },
  {
    id: 'key-nav-7',
    key: 'nav.create_capsule',
    category: 'nav',
    description: 'Header primary CTA button',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Create Capsule',
      id: 'Buat Kapsul',
      vi: 'Tạo Capsule',
      zh: '创建胶囊',
      ja: 'カプセルを作成',
      th: 'สร้างแคปซูล',
      ko: '캡슐 만들기'
    }
  },
  {
    id: 'key-nav-8',
    key: 'nav.features',
    category: 'nav',
    description: 'Header features dropdown title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Features',
      id: 'Fitur',
      vi: 'Tính năng',
      zh: '功能',
      ja: '機能',
      th: 'ฟีเจอร์',
      ko: '기능'
    }
  },
  {
    id: 'key-nav-9',
    key: 'nav.for_events',
    category: 'nav',
    description: 'Header for events dropdown title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'For Events',
      id: 'Untuk Acara',
      vi: 'Dành cho sự kiện',
      zh: '适用活动',
      ja: 'イベント向け',
      th: 'สำหรับงานอีเวนต์',
      ko: '이벤트용'
    }
  },
  {
    id: 'key-nav-10',
    key: 'nav.templates',
    category: 'nav',
    description: 'Header templates link',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Templates',
      id: 'Templat',
      vi: 'Mẫu',
      zh: '模板',
      ja: 'テンプレート',
      th: 'เทมเพลต',
      ko: '템플릿'
    }
  },
  {
    id: 'key-nav-11',
    key: 'nav.resources',
    category: 'nav',
    description: 'Header resources dropdown title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Resources',
      id: 'Sumber Daya',
      vi: 'Tài nguyên',
      zh: '资源',
      ja: 'リソース',
      th: 'ทรัพยากร',
      ko: '리소스'
    }
  },
  {
    id: 'key-nav-12',
    key: 'nav.get_started_free',
    category: 'nav',
    description: 'Header CTA button get started free',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Get Started Free',
      id: 'Mulai Gratis',
      vi: 'Bắt đầu miễn phí',
      zh: '免费开始使用',
      ja: '無料で始める',
      th: 'เริ่มต้นใช้งานฟรี',
      ko: '무료로 시작하기'
    }
  },
  {
    id: 'key-nav-13',
    key: 'nav.workspace',
    category: 'nav',
    description: 'User profile workspace label',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Workspace',
      id: 'Ruang Kerja',
      vi: 'Không gian làm việc',
      zh: '工作区',
      ja: 'ワークスペース',
      th: 'พื้นที่ทำงาน',
      ko: '워크스페이스'
    }
  },
  {
    id: 'key-nav-14',
    key: 'nav.navigation_menu',
    category: 'nav',
    description: 'Mobile menu header',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Navigation Menu',
      id: 'Menu Navigasi',
      vi: 'Menu điều hướng',
      zh: '导航菜单',
      ja: 'ナビゲーションメニュー',
      th: 'เมนูนำทาง',
      ko: '탐색 메뉴'
    }
  },
  {
    id: 'key-nav-15',
    key: 'nav.create',
    category: 'nav',
    description: 'Mobile menu compact create button',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Create',
      id: 'Buat',
      vi: 'Tạo',
      zh: '创建',
      ja: '作成',
      th: 'สร้าง',
      ko: '만들기'
    }
  },
  {
    id: 'key-auth-1',
    key: 'auth.login',
    category: 'auth',
    description: 'Log in button title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Log in',
      id: 'Masuk',
      vi: 'Đăng nhập',
      zh: '登录',
      ja: 'ログイン',
      th: 'เข้าสู่ระบบ',
      ko: '로그인'
    }
  },

  // --- MEGA MENU TRANSLATIONS ---
  {
    id: 'key-mm-1',
    key: 'megamenu.how_it_works',
    category: 'megamenu',
    description: 'Mega menu how it works header',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'How KAVA Preserves Memories',
      id: 'Cara KAVA Melestarikan Kenangan',
      vi: 'Cách KAVA lưu giữ ký ức',
      zh: 'KAVA 如何珍藏记忆',
      ja: 'KAVAが思い出を残す方法',
      th: 'KAVA บันทึกความทรงจำอย่างไร',
      ko: 'KAVA가 추억을 보존하는 방법'
    }
  },
  {
    id: 'key-mm-2',
    key: 'megamenu.capsule_types',
    category: 'megamenu',
    description: 'Mega menu capsule types header',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Memory Capsule Collections',
      id: 'Koleksi Kapsul Kenangan',
      vi: 'Bộ sưu tập Capsule Ký Ức',
      zh: '记忆胶囊系列',
      ja: 'メモリーカプセルコレクション',
      th: 'คลังแคปซูลความทรงจำ',
      ko: '메모리 캡슐 컬렉션'
    }
  },
  {
    id: 'key-mm-3',
    key: 'megamenu.pricing',
    category: 'megamenu',
    description: 'Mega menu pricing header',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Plans & Regional Pricing',
      id: 'Paket & Harga Regional',
      vi: 'Gói & Giá theo khu vực',
      zh: '套餐与区域价格',
      ja: 'プラン＆地域別料金',
      th: 'แพ็กเกจและราคาในภูมิภาค',
      ko: '요금제 및 지역별 가격'
    }
  },
  {
    id: 'key-mm-4',
    key: 'megamenu.resources',
    category: 'megamenu',
    description: 'Mega menu resources header',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Resources & Support',
      id: 'Sumber Daya & Bantuan',
      vi: 'Tài nguyên & Hỗ trợ',
      zh: '资源与支持',
      ja: 'リソース＆サポート',
      th: 'ทรัพยากรและการซัพพอร์ต',
      ko: '리소스 및 지원'
    }
  },
  {
    id: 'key-mm-5',
    key: 'megamenu.navigation',
    category: 'megamenu',
    description: 'Mega menu navigation label',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Navigation',
      id: 'Navigasi',
      vi: 'Điều hướng',
      zh: '导航',
      ja: 'ナビゲーション',
      th: 'การนำทาง',
      ko: '탐색'
    }
  },
  {
    id: 'key-mm-6',
    key: 'megamenu.spotlight_campaign',
    category: 'megamenu',
    description: 'Spotlight campaign banner title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Spotlight Campaign',
      id: 'Kampanye Sorotan',
      vi: 'Chiến dịch nổi bật',
      zh: '精选活动',
      ja: 'スポットライトキャンペーン',
      th: 'แคมเปญไฮไลต์',
      ko: '스포트라이트 캠페인'
    }
  },
  {
    id: 'key-mm-7',
    key: 'megamenu.limited_season',
    category: 'megamenu',
    description: 'Limited season badge',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Limited Season',
      id: 'Musim Terbatas',
      vi: 'Mùa giới hạn',
      zh: '限时季节',
      ja: '期間限定',
      th: 'ข้อเสนอมีจำนวนจำกัด',
      ko: '한정 시즌'
    }
  },
  {
    id: 'key-mm-8',
    key: 'megamenu.ends_soon',
    category: 'megamenu',
    description: 'Ends soon countdown badge',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Ends Soon',
      id: 'Segera Berakhir',
      vi: 'Sắp kết thúc',
      zh: '即将结束',
      ja: 'まもなく終了',
      th: 'จะสิ้นสุดเร็วๆ นี้',
      ko: '곧 종료'
    }
  },
  {
    id: 'key-mm-9',
    key: 'megamenu.explore_campaign',
    category: 'megamenu',
    description: 'Explore campaign button',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Explore Campaign',
      id: 'Jelajahi Kampanye',
      vi: 'Khám phá chiến dịch',
      zh: '探索活动',
      ja: 'キャンペーンを見る',
      th: 'สำรวจแคมเปญ',
      ko: '캠페인 탐색'
    }
  },
  {
    id: 'key-mm-10',
    key: 'megamenu.how_qr_title',
    category: 'megamenu',
    description: 'Instant QR item title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Instant QR Guest Access',
      id: 'Akses Kode QR Tamu Instan',
      vi: 'Truy cập QR tức thì cho khách',
      zh: '宾客扫码即入',
      ja: 'インスタントQRアクセス',
      th: 'สแกน QR Code เข้างานทันที',
      ko: '게스트 즉시 QR 접속'
    }
  },
  {
    id: 'key-mm-11',
    key: 'megamenu.how_qr_desc',
    category: 'megamenu',
    description: 'Instant QR item description',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Zero app downloads required — guests point camera & share.',
      id: 'Tanpa unduh aplikasi — tamu cukup arahkan kamera & bagikan.',
      vi: 'Không cần tải ứng dụng — khách chỉ cần quét camera & chia sẻ.',
      zh: '无需下载 App — 宾客使用相机即可随时分享。',
      ja: 'アプリダウンロード不要 — カメラをかざすだけで共有完了。',
      th: 'ไม่ต้องโหลดแอปพลิเคชัน — เพียงยกกล้องสแกนก็ร่วมแชร์ได้ทันที',
      ko: '앱 다운로드 필요 없음 — 카메라로 스캔하여 바로 공유.'
    }
  },
  {
    id: 'key-mm-12',
    key: 'megamenu.how_proj_title',
    category: 'megamenu',
    description: 'Real-Time 4K Projection Stream title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Real-Time 4K Projection Stream',
      id: 'Streaming Proyeksi 4K Real-Time',
      vi: 'Phát chiếu 4K thời gian thực',
      zh: '4K 现场实时投影',
      ja: 'リアルタイム4Kプロジェクション',
      th: 'ระบบสตรีมฉายจอ 4K แบบเรียลไทม์',
      ko: '실시간 4K 프로젝션 스트림'
    }
  },
  {
    id: 'key-mm-13',
    key: 'megamenu.how_proj_desc',
    category: 'megamenu',
    description: 'Real-Time 4K Projection Stream description',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Watch memories compile live on venue projection displays.',
      id: 'Saksikan kenangan terkumpul secara langsung di layar lokasi acara.',
      vi: 'Xem ký ức được tổng hợp trực tiếp trên màn hình sự kiện.',
      zh: '在现场大屏上实时观看全员回忆的精彩汇聚。',
      ja: '会場のスクリーンで思い出がリアルタイムに上映されます。',
      th: 'รับชมภาพความทรงจำแสดงผลสดบนจอภาพในงาน',
      ko: '행사장 대형 화면에 추억이 실시간으로 상영됩니다.'
    }
  },
  {
    id: 'key-mm-14',
    key: 'megamenu.how_mod_title',
    category: 'megamenu',
    description: 'Host Moderation title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Host Moderation & Privacy Controls',
      id: 'Moderasi Tuan Rumah & Kontrol Privasi',
      vi: 'Kiểm duyệt của chủ tiệc & BẢO MẬT',
      zh: '主办方审核与隐私控制',
      ja: 'ホストモデレーション＆プライバシー管理',
      th: 'ระบบอนุมัติเนื้อหาและความเป็นส่วนตัว',
      ko: '호스트 승인 및 개인정보 관리'
    }
  },
  {
    id: 'key-mm-15',
    key: 'megamenu.how_mod_desc',
    category: 'megamenu',
    description: 'Host Moderation description',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Full approval workflows, guest codes, and privacy levels.',
      id: 'Alur persetujuan lengkap, kode tamu, dan tingkat privasi.',
      vi: 'Quy trình phê duyệt đầy đủ, mã khách và các cấp độ bảo mật.',
      zh: '完整的审核流程、专属宾客码与多级隐私设置。',
      ja: '完全な承認フロー、ゲストコード、プライバシーレベル設定。',
      th: 'กระบวนการอนุมัติสื่อ รหัสเข้างาน และระดับความเป็นส่วนตัว',
      ko: '완벽한 승인 워크플로우, 게스트 코드 및 보안 설정.'
    }
  },
  {
    id: 'key-mm-16',
    key: 'megamenu.how_vault_title',
    category: 'megamenu',
    description: '4K Vault Lossless Archiving title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: '4K Vault Lossless Archiving',
      id: 'Pengarsipan Vault 4K Tanpa Penurunan Kualitas',
      vi: 'Lưu trữ kho 4K không nén',
      zh: '4K 无损画质记忆宝库',
      ja: '4K無損アーカイブストレージ',
      th: 'คลังเก็บบันทึกไฟล์ 4K ไม่บีบอัด',
      ko: '4K 무손실 보관소 아카이빙'
    }
  },
  {
    id: 'key-mm-17',
    key: 'megamenu.how_vault_desc',
    category: 'megamenu',
    description: '4K Vault Lossless Archiving description',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Export high-res photos, 4K videos, and spoken audio wishes.',
      id: 'Ekspor foto resolusi tinggi, video 4K, dan ucapan suara.',
      vi: 'Xuất ảnh độ phân giải cao, video 4K và lời chúc bằng giọng nói.',
      zh: '完整导出高清照片、4K 视频与珍贵语音祝福。',
      ja: '高解像度写真、4K動画、音声メッセージを一括ダウンロード。',
      th: 'ส่งออกรูปภาพความละเอียดสูง วิดีโอ 4K และคลิปเสียงอวยพร',
      ko: '고해상도 사진, 4K 비디오 및 음성 메시지 내보내기.'
    }
  },
  {
    id: 'key-mm-18',
    key: 'megamenu.cap_wedding_title',
    category: 'megamenu',
    description: 'Weddings title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Weddings & Anniversaries',
      id: 'Pernikahan & Ulang Tahun Pernikahan',
      vi: 'Đám cưới & Kỷ niệm',
      zh: '婚礼与周年纪念',
      ja: '結婚式＆アニバーサリー',
      th: 'งานแต่งงานและงานครบรอบ',
      ko: '웨딩 및 기념일'
    }
  },
  {
    id: 'key-mm-19',
    key: 'megamenu.cap_wedding_desc',
    category: 'megamenu',
    description: 'Weddings description',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Digital guestbook with audio wishes, photo stream & QR cards.',
      id: 'Buku tamu digital dengan ucapan suara, galeri foto & kartu QR.',
      vi: 'Sổ lưu niệm kỹ thuật số với lời chúc âm thanh, ảnh & thẻ QR.',
      zh: '含语音祝福、实时相册与 QR 引导卡的数字签到簿。',
      ja: '音声メッセージ、写真ストリーム、QRカード付きデジタルゲストブック。',
      th: 'สมุดเซ็นเยี่ยมดิจิทัลพร้อมคลิปเสียง อัลบั้มรูป และการ์ด QR',
      ko: '음성 메시지, 사진 스트림 및 QR 카드가 포함된 디지털 방명록.'
    }
  },
  {
    id: 'key-mm-20',
    key: 'megamenu.cap_bday_title',
    category: 'megamenu',
    description: 'Birthdays title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Birthdays & Milestone Galas',
      id: 'Ulang Tahun & Pesta Peringatan Milestone',
      vi: 'Sinh nhật & Tiệc cột mốc',
      zh: '生日与里程碑派对',
      ja: '誕生日＆マイルストーンパーティー',
      th: 'งานวันเกิดและงานฉลองสำคัญ',
      ko: '생일 및 특별 기념 파티'
    }
  },
  {
    id: 'key-mm-21',
    key: 'megamenu.cap_bday_desc',
    category: 'megamenu',
    description: 'Birthdays description',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Interactive countdowns, party voice notes & photo challenges.',
      id: 'Hitung mundur interaktif, catatan suara pesta & tantangan foto.',
      vi: 'Đếm ngược tương tác, ghi âm cuộc gọi & thử thách chụp ảnh.',
      zh: '倒计时互动、派对语音留声与有趣拍照挑战。',
      ja: 'カウントダウン、ボイスメモ、フォトチャレンジ機能。',
      th: 'ระบบนับถอยหลัง บันทึกเสียงในงาน และกิจกรรมชาเลนจ์ถ่ายภาพ',
      ko: '카운트다운, 파티 음성 메모 및 사진 챌린지 기능.'
    }
  },
  {
    id: 'key-mm-22',
    key: 'megamenu.cap_corp_title',
    category: 'megamenu',
    description: 'Corporate title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Corporate & Event Galas',
      id: 'Acara Perusahaan & Gala Event',
      vi: 'Sự kiện doanh nghiệp & Gala',
      zh: '企业年终与大型盛典',
      ja: ' corporate ＆ イベントガラ',
      th: 'งานองค์กรและงานกาล่า',
      ko: '기업 행사 및 이벤트 Gala'
    }
  },
  {
    id: 'key-mm-23',
    key: 'megamenu.cap_corp_desc',
    category: 'megamenu',
    description: 'Corporate description',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Branded event spaces, QR check-in & presenter screens.',
      id: 'Ruang acara kustom merek, check-in QR & layar presentasi.',
      vi: 'Không gian sự kiện thương hiệu, check-in QR & màn hình trình chiếu.',
      zh: '定制品牌活动空间、QR 签到与大屏呈现。',
      ja: 'ブランドデザイン、QRチェックイン、プレゼンテーション画面。',
      th: 'หน้าตาอินเทอร์เฟซติดแบรนด์ ระบบเช็กอิน QR และจอสตรีมบนเวที',
      ko: '맞춤 브랜드 공간, QR 체크인 및 대형 화면 상영.'
    }
  },
  {
    id: 'key-mm-24',
    key: 'megamenu.cap_family_title',
    category: 'megamenu',
    description: 'Family title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Private Family Circles',
      id: 'Lingkaran Keluarga Privat',
      vi: 'Vòng tròn gia đình riêng tư',
      zh: '私密家庭圈',
      ja: 'プライベートファミリーサークル',
      th: 'คลังความทรงจำครอบครัว',
      ko: '프라이빗 패밀리 서클'
    }
  },
  {
    id: 'key-mm-25',
    key: 'megamenu.cap_family_desc',
    category: 'megamenu',
    description: 'Family description',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Encrypted memory vaults for reunions & intimate gatherings.',
      id: 'Vault kenangan terenkripsi untuk reuni & acara keluarga.',
      vi: 'Kho ký ức mã hóa cho các buổi họp mặt & sum họp thân mật.',
      zh: '加密记忆宝库，适用于家庭聚会与温馨时光。',
      ja: '親しい集まりや同窓会のための暗号化メモリー vault。',
      th: 'คลังเก็บความทรงจำเข้ารหัสสำหรับงานเลี้ยงสังสรรค์และครอบครัว',
      ko: '가족 모임 및 친목을 위한 암호화 추억 보관소.'
    }
  },
  {
    id: 'key-mm-26',
    key: 'megamenu.price_starter_title',
    category: 'megamenu',
    description: 'Starter Free title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Starter Free Tier',
      id: 'Paket Pemula Gratis',
      vi: 'Gói miễn phí Starter',
      zh: 'Starter 免费体验版',
      ja: 'Starer フリープラン',
      th: 'แพ็กเกจเริ่มต้นใช้งานฟรี',
      ko: '스타터 무료 플랜'
    }
  },
  {
    id: 'key-mm-27',
    key: 'megamenu.price_starter_desc',
    category: 'megamenu',
    description: 'Starter Free description',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: '1 Event, 50 Guests, HD Photos, Unlimited Downloads.',
      id: '1 Acara, 50 Tamu, Foto HD, Unduhan Tanpa Batas.',
      vi: '1 Sự kiện, 50 Khách, Ảnh HD, Tải xuống không giới hạn.',
      zh: '1 个活动、50 位宾客、高清照片与无限制下载。',
      ja: '1イベント、50ゲスト、HD写真、無制限ダウンロード。',
      th: '1 งานอีเวนต์ รองรับ 50 แขก ภาพ HD ดาวน์โหลดไม่จำกัด',
      ko: '이벤트 1개, 게스트 50명, HD 사진, 무제한 다운로드.'
    }
  },
  {
    id: 'key-mm-28',
    key: 'megamenu.price_prem_title',
    category: 'megamenu',
    description: 'Premium title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Premium Celebration',
      id: 'Paket Perayaan Premium',
      vi: 'Gói Premium Celebration',
      zh: 'Premium 尊享盛典版',
      ja: 'Premium セレブレーション',
      th: 'แพ็กเกจพรีเมียมสำหรับงานฉลอง',
      ko: '프리미엄 셀러브레이션'
    }
  },
  {
    id: 'key-mm-29',
    key: 'megamenu.price_prem_desc',
    category: 'megamenu',
    description: 'Premium description',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Unlimited Guests, 4K Video, Live Screen Display & Audio.',
      id: 'Tamu Tanpa Batas, Video 4K, Tampilan Layar Langsung & Suara.',
      vi: 'Khách không giới hạn, Video 4K, Màn hình trực tiếp & Âm thanh.',
      zh: '无限制宾客、4K 视频、现场大屏投影与语音留声。',
      ja: '無制限ゲスト、4K動画、ライブスクリーン＆音声メッセージ。',
      th: 'แขกไม่จำกัด วิดีโอ 4K สตรีมขึ้นจอสด และบันทึกเสียง',
      ko: '무제한 게스트, 4K 비디오, 라이브 스크린 및 음성 기능.'
    }
  },
  {
    id: 'key-mm-30',
    key: 'megamenu.price_ent_title',
    category: 'megamenu',
    description: 'Enterprise title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Enterprise Guild',
      id: 'Paket Enterprise Guild',
      vi: 'Gói Enterprise Guild',
      zh: 'Enterprise 旗舰定制版',
      ja: 'Enterprise ギルド',
      th: 'แพ็กเกจระดับองค์กร Enterprise',
      ko: '엔터프라이즈 길드'
    }
  },
  {
    id: 'key-mm-31',
    key: 'megamenu.price_ent_desc',
    category: 'megamenu',
    description: 'Enterprise description',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Custom domain, custom branding, dedicated manager.',
      id: 'Domain kustom, branding kustom, manajer khusus.',
      vi: 'Tên miền tùy chỉnh, thương hiệu riêng, quản lý riêng.',
      zh: '独立域名、专属品牌定制与专职客户经理。',
      ja: 'カスタムドメイン、独自ブランディング、専任マネージャー。',
      th: 'โดเมนส่วนตัว ตกแต่งแบรนด์เต็มรูปแบบ ผู้จัดการดูแลส่วนตัว',
      ko: '맞춤 도메인, 브랜드 커스텀, 전담 매니저.'
    }
  },
  {
    id: 'key-mm-32',
    key: 'megamenu.price_calc_title',
    category: 'megamenu',
    description: 'Price Calculator title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Currency & Regional Calculator',
      id: 'Kalkulator Mata Uang & Regional',
      vi: 'Bảng tính tiền tệ & Khu vực',
      zh: '多币种与区域价格计算器',
      ja: '通貨＆地域別料金計算',
      th: 'เครื่องคำนวณสกุลเงินและราคาตามภูมิภาค',
      ko: '통화 및 지역별 요금 계산기'
    }
  },
  {
    id: 'key-mm-33',
    key: 'megamenu.price_calc_desc',
    category: 'megamenu',
    description: 'Price Calculator description',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Compare rates in USD, EUR, GBP, JPY, IDR, VND, TWD.',
      id: 'Bandingkan tarif dalam USD, EUR, GBP, JPY, IDR, VND, TWD.',
      vi: 'So sánh giá theo USD, EUR, GBP, JPY, IDR, VND, TWD.',
      zh: '对比 USD、EUR、GBP、JPY、IDR、VND、TWD 等币种。',
      ja: 'USD, EUR, GBP, JPY, IDR, VND, TWD などの換算レート比較。',
      th: 'เปรียบเทียบราคาในสกุลเงิน USD, EUR, GBP, JPY, IDR, VND, TWD',
      ko: 'USD, EUR, GBP, JPY, IDR, VND, TWD 요금 비교.'
    }
  },
  {
    id: 'key-mm-34',
    key: 'megamenu.res_help_title',
    category: 'megamenu',
    description: 'Help center title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Help Center & Setup Guides',
      id: 'Pusat Bantuan & Panduan Pengaturan',
      vi: 'Trung tâm trợ giúp & Hướng dẫn',
      zh: '帮助中心与设置指南',
      ja: 'ヘルプセンター＆セットアップガイド',
      th: 'ศูนย์ช่วยเหลือและคู่มือการตั้งค่า',
      ko: '도움말 센터 및 설정 가이드'
    }
  },
  {
    id: 'key-mm-35',
    key: 'megamenu.res_help_desc',
    category: 'megamenu',
    description: 'Help center description',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Step-by-step setup guides, QR printing & host tips.',
      id: 'Panduan langkah demi langkah, cetak QR & tips tuan rumah.',
      vi: 'Hướng dẫn từng bước, in ấn QR & mẹo dành cho chủ tiệc.',
      zh: '分步设置指南、QR 码打印与主办方技巧。',
      ja: 'ステップバイステップのガイド、QR印刷＆ホストのアドバイス。',
      th: 'คู่มือตั้งค่าทีละขั้นตอน พิมพ์ QR Code และเคล็ดลับสำหรับเจ้าภาพ',
      ko: '단계별 설정 가이드, QR 인쇄 및 호스트 팁.'
    }
  },
  {
    id: 'key-mm-36',
    key: 'megamenu.res_demo_title',
    category: 'megamenu',
    description: 'Live Demo title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Live Demo Gallery',
      id: 'Galeri Demo Langsung',
      vi: 'Thư viện Demo trực tiếp',
      zh: 'Live 演示体验馆',
      ja: 'ライブデモギャラリー',
      th: 'แกลเลอรีเดโมทดลองใช้งานสด',
      ko: '실시간 데모 갤러리'
    }
  },
  {
    id: 'key-mm-37',
    key: 'megamenu.res_demo_desc',
    category: 'megamenu',
    description: 'Live Demo description',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Experience guest contribution & host controls in real time.',
      id: 'Rasakan kontribusi tamu & kontrol tuan rumah secara real-time.',
      vi: 'Trải nghiệm đóng góp của khách & quyền kiểm soát thời gian thực.',
      zh: '亲身体验宾客上传与主办方实时管理。',
      ja: 'ゲスト投稿とホスト管理をリアルタイムで体験。',
      th: 'ทดลองส่งสื่อของแขกและควบคุมระบบของเจ้าภาพได้ทันที',
      ko: '게스트 참여 및 호스트 컨트롤을 실시간으로 체험.'
    }
  },
  {
    id: 'key-mm-38',
    key: 'megamenu.res_supp_title',
    category: 'megamenu',
    description: 'Contact Support title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Contact Dedicated Support',
      id: 'Hubungi Dukungan Khusus',
      vi: 'Liên hệ hỗ trợ chuyên trách',
      zh: '联系 24/7 专属客服',
      ja: '専任サポートにお問い合わせ',
      th: 'ติดต่อทีมซัพพอร์ตผู้ดูแลเฉพาะ',
      ko: '전담 고객 지원 문의'
    }
  },
  {
    id: 'key-mm-39',
    key: 'megamenu.res_supp_desc',
    category: 'megamenu',
    description: 'Contact Support description',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: '24/7 dedicated support for peace of mind at your event.',
      id: 'Dukungan khusus 24/7 untuk ketenangan acara Anda.',
      vi: 'Hỗ trợ chuyên trách 24/7 mang lại sự yên tâm cho sự kiện.',
      zh: '24/7 专属全天候支持，确保活动万无一失。',
      ja: '24時間365日の専任サポートで安心のイベント運営。',
      th: 'ทีมงานดูแลตลอด 24 ชั่วโมงเพื่อความเรียบร้อยของงานคุณ',
      ko: '이벤트를 위한 24/7 전담 지원으로 안심하고 진행하세요.'
    }
  },
  {
    id: 'key-mm-40',
    key: 'megamenu.res_rel_title',
    category: 'megamenu',
    description: 'Release Notes title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'System Release Notes v2.4',
      id: 'Catatan Rilis Sistem v2.4',
      vi: 'Ghi chú phát hành v2.4',
      zh: '系统更新日志 v2.4',
      ja: 'リリースノート v2.4',
      th: 'บันทึกการอัปเดตระบบ v2.4',
      ko: '시스템 릴리스 노트 v2.4'
    }
  },
  {
    id: 'key-mm-41',
    key: 'megamenu.res_rel_desc',
    category: 'megamenu',
    description: 'Release Notes description',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Discover what is new in KAVA 2026 memory capsules.',
      id: 'Temukan hal baru di kapsul kenangan KAVA 2026.',
      vi: 'Khám phá các tính năng mới trong KAVA 2026.',
      zh: '探索 KAVA 2026 记忆胶囊的全新功能。',
      ja: 'KAVA 2026メモリーカプセルの新機能を見る。',
      th: 'ค้นพบฟีเจอร์ใหม่ล่าสุดใน KAVA 2026',
      ko: 'KAVA 2026 메모리 캡슐의 최신 기능을 확인하세요.'
    }
  },

  // --- HERO ---
  {
    id: 'key-hero-1',
    key: 'hero.badge',
    category: 'hero',
    description: 'Top announcement badge',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Preserving moments as they happen. Introducing KAVA 2026.',
      id: 'Abadikan Momen Secara Langsung. Memperkenalkan KAVA 2026.',
      vi: 'Lưu giữ khoảnh khắc ngay khi diễn ra. Giới thiệu KAVA 2026.',
      zh: '即时留住美好瞬间。全新推出 KAVA 2026。',
      ja: '瞬間をリアルタイムで保存。KAVA 2026 登場。',
      th: 'บันทึกทุกช่วงเวลาแบบเรียลไทม์ ขอแนะนำ KAVA 2026',
      ko: '순간을 실시간으로 기록하세요. KAVA 2026을 소개합니다.'
    }
  },
  {
    id: 'key-hero-2',
    key: 'hero.title_line1',
    category: 'hero',
    description: 'Hero heading first line',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Every smile, toast & wish.',
      id: 'Setiap senyuman, ucapan & doa.',
      vi: 'Mọi nụ cười, lời chúc & niềm vui.',
      zh: '每一个微笑、祝酒与祝福。',
      ja: 'すべての笑顔、乾杯、そして祝福。',
      th: 'ทุกรอยยิ้ม คำอวยพร และความประทับใจ',
      ko: '모든 미소, 축배, 그리고 미소.'
    }
  },
  {
    id: 'key-hero-3',
    key: 'hero.title_line2',
    category: 'hero',
    description: 'Hero heading second line (highlighted)',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Collected in real-time.',
      id: 'Terkumpul secara real-time.',
      vi: 'Được thu thập theo thời gian thực.',
      zh: '实时在线收集。',
      ja: 'リアルタイムでひとつに集まる。',
      th: 'รวบรวมได้ในเวลาจริงแบบเรียลไทม์',
      ko: '실시간으로 소중하게 모입니다.'
    }
  },
  {
    id: 'key-hero-4',
    key: 'hero.subtitle',
    category: 'hero',
    description: 'Hero paragraph explanation',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'KAVA transforms event memories into an interactive live wall. Guests scan a QR code to drop high-res photos, voice notes, and video greetings instantly — zero app downloads required.',
      id: 'KAVA mengubah kenangan acara menjadi dinding kenangan interaktif. Tamu cukup pemindai kode QR untuk mengunggah foto HD, pesan suara, dan video selamat — tanpa unduh aplikasi.',
      vi: 'KAVA biến ký ức sự kiện thành bức tường trực tiếp tương tác. Khách mời chỉ cần quét mã QR để tải ảnh chất lượng cao, ghi âm giọng nói và video chúc mừng — không cần tải ứng dụng.',
      zh: 'KAVA 将活动回忆转化为互动实时墙。宾客只需扫描二维码即可即时上传高清照片、语音留言与视频祝福 — 无需下载任何应用。',
      ja: 'KAVAはイベントの思い出をインタラクティブなライブウォールに変えます。ゲストはQRコードを読み取るだけで高画質写真、音声メモ、動画メッセージをその場で共有できます（アプリダウンロード不要）。',
      th: 'KAVA เปลี่ยนความทรงจำในงานอีเวนต์ให้เป็นวอลล์แบบโต้ตอบได้ แขกเพียงสแกน QR Code เพื่อส่งรูปถ่ายความละเอียดสูง ข้อความเสียง และวิดีโออวยพรได้ทันที — ไม่ต้องดาวน์โหลดแอป',
      ko: 'KAVA는 이벤트의 추억을 실시간 라이브월로 변환합니다. 게스트는 QR 코드 스캔만으로 고화질 사진, 음성 메시지, 축하 비디오를 즉시 공유할 수 있습니다 (앱 설치 불필요).'
    }
  },

  // --- FEATURES & CAPSULE TYPES ---
  {
    id: 'key-feat-1',
    key: 'features.photo_capsule',
    category: 'features',
    description: 'Photo capsule feature title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Instant Photo Drops',
      id: 'Unggah Foto Instan',
      vi: 'Tải ảnh tức thì',
      zh: '即时照片上传',
      ja: 'インスタント写真ドロップ',
      th: 'อัปโหลดรูปถ่ายทันที',
      ko: '즉시 사진 업로드'
    }
  },
  {
    id: 'key-feat-2',
    key: 'features.video_capsule',
    category: 'features',
    description: 'Video capsule feature title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Video Greetings',
      id: 'Ucapan Video HD',
      vi: 'Lời chúc Video HD',
      zh: '高清视频祝福',
      ja: 'HD動画メッセージ',
      th: 'วิดีโออวยพรความละเอียดสูง',
      ko: 'HD 비디오 축하 메시지'
    }
  },
  {
    id: 'key-feat-3',
    key: 'features.voice_capsule',
    category: 'features',
    description: 'Voice note feature title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Voice Notes & Audio Wishes',
      id: 'Pesan Suara & Doa Audio',
      vi: 'Ghi âm giọng nói & Lời chúc âm thanh',
      zh: '语音留言与声音祝福',
      ja: 'ボイスメモ＆音声メッセージ',
      th: 'ข้อความเสียงและคำอวยพรแบบเสียง',
      ko: '음성 메모 및 오디오 축하'
    }
  },

  // --- DASHBOARD ---
  {
    id: 'key-dash-1',
    key: 'dashboard.welcome',
    category: 'dashboard',
    description: 'Host dashboard welcome header',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Memory Capsules Management',
      id: 'Manajemen Kapsul Kenangan',
      vi: 'Quản lý Capsule Ký Ức',
      zh: '回忆胶囊管理',
      ja: 'メモリーカプセル管理',
      th: 'การจัดการแคปซูลความทรงจำ',
      ko: '추억 캡슐 관리'
    }
  },
  {
    id: 'key-dash-2',
    key: 'dashboard.live_screen',
    category: 'dashboard',
    description: 'Launch live screen button',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Launch Live Wall',
      id: 'Buka Dinding Live',
      vi: 'Mở Màn Hình Live',
      zh: '开启实时展示墙',
      ja: 'ライブウォールを起動',
      th: 'เปิดไลฟ์วอลล์',
      ko: '라이브월 시작하기'
    }
  },

  // --- GUEST EXPERIENCE ---
  {
    id: 'key-guest-1',
    key: 'guest.welcome_title',
    category: 'guest',
    description: 'Welcome header for event guest',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Share your moment with us!',
      id: 'Bagikan momen bahagiamu!',
      vi: 'Chia sẻ khoảnh khắc của bạn!',
      zh: '与我们分享您的精彩瞬间！',
      ja: '素敵な瞬間をシェアしよう！',
      th: 'ร่วมแบ่งปันช่วงเวลาพิเศษของคุณ!',
      ko: '소중한 순간을 공유해 주세요!'
    }
  },
  {
    id: 'key-guest-2',
    key: 'guest.upload_button',
    category: 'guest',
    description: 'Submit memory button for guest',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Send Memory to Live Wall',
      id: 'Kirim Kenangan ke Dinding Live',
      vi: 'Gửi Ký Ức Lên Bức Tường Live',
      zh: '发送回忆至实时展示墙',
      ja: 'ライブウォールに思い出を送信',
      th: 'ส่งความทรงจำไปยังไลฟ์วอลล์',
      ko: '라이브월로 추억 보내기'
    }
  },

  // --- AUTHENTICATION ---
  {
    id: 'key-auth-1',
    key: 'auth.sign_in',
    category: 'auth',
    description: 'Sign in heading / button',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Sign In to KAVA',
      id: 'Masuk ke KAVA',
      vi: 'Đăng nhập vào KAVA',
      zh: '登录 KAVA',
      ja: 'KAVA にログイン',
      th: 'เข้าสู่ระบบ KAVA',
      ko: 'KAVA 로그인'
    }
  },
  {
    id: 'key-auth-2',
    key: 'auth.email',
    category: 'auth',
    description: 'Email label',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Email Address',
      id: 'Alamat Email',
      vi: 'Địa chỉ Email',
      zh: '电子邮箱',
      ja: 'メールアドレス',
      th: 'อีเมล',
      ko: '이메일 주소'
    }
  },

  // --- BILLING & PRICING ---
  {
    id: 'key-price-1',
    key: 'pricing.monthly',
    category: 'pricing',
    description: 'Monthly billing toggle label',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Monthly Billing',
      id: 'Tagihan Bulanan',
      vi: 'Thanh toán hàng tháng',
      zh: '按月计费',
      ja: '月払い',
      th: 'ชำระรายเดือน',
      ko: '월간 결제'
    }
  },
  {
    id: 'key-price-2',
    key: 'pricing.yearly',
    category: 'pricing',
    description: 'Yearly billing toggle label',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Yearly (Save 20%)',
      id: 'Tahunan (Hemat 20%)',
      vi: 'Hàng năm (Tiết kiệm 20%)',
      zh: '按年（省 20%）',
      ja: '年払い（20%お得）',
      th: 'รายปี (ประหยัด 20%)',
      ko: '연간 (20% 할인)'
    }
  },

  // --- SUPPORT & ADMIN ---
  {
    id: 'key-admin-1',
    key: 'admin.localization_title',
    category: 'admin',
    description: 'Super admin localization section header',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Platform Localization & Multi-Language Studio',
      id: 'Studio Lokalisasi & Multi-Bahasa Platform',
      vi: 'Trung tâm Địa phương hóa & Đa ngôn ngữ',
      zh: '平台多语言与本地化工作台',
      ja: 'プラットフォーム多言語・ローカリゼーションスタジオ',
      th: 'สตูดิโอการแปลภาษาและระบบหลายภาษา',
      ko: '다국어 및 로컬라이제이션 스튜디오'
    }
  },
  {
    id: 'key-admin-2',
    key: 'admin.super_admin_console',
    category: 'admin',
    description: 'Super admin console badge/title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'KAVA Super Administrator Console',
      id: 'Konsol Super Administrator KAVA',
      vi: 'Bảng điều khiển Quản trị viên KAVA',
      zh: 'KAVA 超级管理员控制台',
      ja: 'KAVA スーパー管理者コンソール',
      th: 'คอนโซลผู้ดูแลระบบระดับสูง KAVA',
      ko: 'KAVA 최고 관리자 콘솔'
    }
  },

  // --- ONBOARDING ---
  {
    id: 'key-onboarding-1',
    key: 'onboarding.welcome_title',
    category: 'onboarding',
    description: 'Onboarding guide modal welcome title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Welcome to KAVA Event Studio',
      id: 'Selamat Datang di KAVA Event Studio',
      vi: 'Chào mừng đến với KAVA Event Studio',
      zh: '欢迎使用 KAVA 活动工作台',
      ja: 'KAVA イベントスタジオへようこそ',
      th: 'ยินดีต้อนรับสู่ KAVA Event Studio',
      ko: 'KAVA 이벤트 스튜디오에 오신 것을 환영합니다'
    }
  },
  {
    id: 'key-onboarding-2',
    key: 'onboarding.next_step',
    category: 'onboarding',
    description: 'Next step button in onboarding guide',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Next Step',
      id: 'Langkah Berikutnya',
      vi: 'Bước tiếp theo',
      zh: '下一步',
      ja: '次へ',
      th: 'ขั้นตอนถัดไป',
      ko: '다음 단계'
    }
  },
  {
    id: 'key-onboarding-cancel',
    key: 'onboarding.cancel',
    category: 'onboarding',
    description: 'Cancel button in Create Capsule flow',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Cancel',
      id: 'Batal',
      vi: 'Hủy',
      zh: '取消',
      ja: 'キャンセル',
      th: 'ยกเลิก',
      ko: '취소'
    }
  },
  {
    id: 'key-onboarding-back',
    key: 'onboarding.back',
    category: 'onboarding',
    description: 'Back button in Create Capsule flow',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Back',
      id: 'Kembali',
      vi: 'Quay lại',
      zh: '返回',
      ja: '戻る',
      th: 'ย้อนกลับ',
      ko: '뒤로'
    }
  },
  {
    id: 'key-onboarding-progress',
    key: 'onboarding.step_progress',
    category: 'onboarding',
    description: 'Step progress indicator in header',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Step {step} of 7 • {percent}%',
      id: 'Langkah {step} dari 7 • {percent}%',
      vi: 'Bước {step} trên 7 • {percent}%',
      zh: '第 {step} 步（共 7 步）• {percent}%',
      ja: 'ステップ {step} / 7 • {percent}%',
      th: 'ขั้นตอนที่ {step} จาก 7 • {percent}%',
      ko: '7단계 중 {step}단계 • {percent}%'
    }
  },
  {
    id: 'key-onboarding-continue',
    key: 'onboarding.continue',
    category: 'onboarding',
    description: 'Continue footer button in onboarding flow',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Continue',
      id: 'Lanjutkan',
      vi: 'Tiếp tục',
      zh: '继续',
      ja: '次へ進む',
      th: 'ดำเนินการต่อ',
      ko: '계속'
    }
  },
  {
    id: 'key-onboarding-reveal-dash',
    key: 'onboarding.reveal_dashboard',
    category: 'onboarding',
    description: 'Final step CTA button to reveal dashboard',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Reveal Capsule Dashboard',
      id: 'Buka Dashboard Kapsul',
      vi: 'Mở Dashboard Capsule',
      zh: '打开胶囊仪表板',
      ja: 'カプセルダッシュボードを表示',
      th: 'เปิดแดชบอร์ดแคปซูล',
      ko: '캡슐 대시보드 열기'
    }
  },
  {
    id: 'key-onboarding-val-name',
    key: 'onboarding.validation_name_required',
    category: 'onboarding',
    description: 'Validation error when capsule title is empty',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Please enter a name for your memory capsule.',
      id: 'Harap masukkan nama untuk kapsul kenangan Anda.',
      vi: 'Vui lòng nhập tên cho capsule kỷ niệm của bạn.',
      zh: '请为您的记忆胶囊输入名称。',
      ja: 'メモリカプセルの名前を入力してください。',
      th: 'กรุณากรอกชื่อสำหรับแคปซูลความทรงจำของคุณ',
      ko: '메모리 캡슐의 이름을 입력해 주세요.'
    }
  },
  {
    id: 'key-onboarding-step1-tag',
    key: 'onboarding.step1_tag',
    category: 'onboarding',
    description: 'Step 1 category eyebrow label',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'The Canvas',
      id: 'Kanvas',
      vi: 'Khung Cảnh',
      zh: '画布',
      ja: 'キャンバス',
      th: 'ผืนผ้าใบ',
      ko: '캔버스'
    }
  },
  {
    id: 'key-onboarding-step1-title',
    key: 'onboarding.step1_title',
    category: 'onboarding',
    description: 'Step 1 main heading',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'What type of celebration is this?',
      id: 'Perayaan jenis apa ini?',
      vi: 'Đây là loại lễ kỷ niệm nào?',
      zh: '这是什么类型的庆祝活动？',
      ja: 'どのようなお祝いですか？',
      th: 'นี่คือการเฉลิมฉลองประเภทใด?',
      ko: '어떤 유형의 축하 행사인가요?'
    }
  },
  {
    id: 'key-onboarding-step1-desc',
    key: 'onboarding.step1_desc',
    category: 'onboarding',
    description: 'Step 1 description subtext',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Choose a category to set the tone for your collaborative memory capsule.',
      id: 'Pilih kategori untuk menentukan suasana kapsul kenangan kolaboratif Anda.',
      vi: 'Chọn một danh mục để đặt giai điệu cho capsule kỷ niệm cộng tác của bạn.',
      zh: '选择一个类别，为您的协同记忆胶囊奠定基调。',
      ja: 'カテゴリを選択して、コラボレーションメモリカプセルのトーンを設定します。',
      th: 'เลือกหมวดหมู่เพื่อกำหนดโทนสำหรับแคปซูลความทรงจำร่วมกันของคุณ',
      ko: '협업 메모리 캡슐의 분위기를 설정할 카테고리를 선택하세요.'
    }
  },
  {
    id: 'key-onboarding-type-wedding-name',
    key: 'onboarding.type_wedding_name',
    category: 'onboarding',
    description: 'Wedding type name',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Wedding',
      id: 'Pernikahan',
      vi: 'Đám cưới',
      zh: '婚礼',
      ja: '結婚式',
      th: 'งานแต่งงาน',
      ko: '결혼식'
    }
  },
  {
    id: 'key-onboarding-type-wedding-desc',
    key: 'onboarding.type_wedding_desc',
    category: 'onboarding',
    description: 'Wedding type description',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Preserve vows, speech audios, and beautiful raw photos.',
      id: 'Abadikan janji suci, rekaman pidato, dan foto-foto indah.',
      vi: 'Lưu giữ lời thề, âm thanh phát biểu và những bức ảnh đẹp.',
      zh: '保存誓言、致辞音频和美丽的原图。',
      ja: '誓い、スピーチ音声、美しい写真を保存します。',
      th: 'เก็บภาพคำสาบาน เสียงอวยพร และภาพถ่ายสวยงาม',
      ko: '서약, 축사 음성, 아름다운 원본 사진을 보존하세요.'
    }
  },
  {
    id: 'key-onboarding-type-wedding-default-name',
    key: 'onboarding.type_wedding_default_name',
    category: 'onboarding',
    description: 'Default suggested name for wedding capsule',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: "Sofia & Leo's Wedding",
      id: "Pernikahan Sofia & Leo",
      vi: "Đám cưới Sofia & Leo",
      zh: "Sofia 与 Leo 的婚礼",
      ja: "ソフィア＆レオの結婚式",
      th: "งานแต่งงาน Sofia & Leo",
      ko: "소피아 & 레오의 결혼식"
    }
  },
  {
    id: 'key-onboarding-type-reunion-name',
    key: 'onboarding.type_reunion_name',
    category: 'onboarding',
    description: 'Reunion type name',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Family Reunion',
      id: 'Reuni Keluarga',
      vi: 'Họp mặt gia đình',
      zh: '家庭聚会',
      ja: '家族の再会',
      th: 'งานเลี้ยงรุ่น/รวมญาติ',
      ko: '가족 리유니온'
    }
  },
  {
    id: 'key-onboarding-type-reunion-desc',
    key: 'onboarding.type_reunion_desc',
    category: 'onboarding',
    description: 'Reunion type description',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Bridge generations with memories, stories, and wishes.',
      id: 'Hubungkan antar generasi dengan kenangan, cerita, dan harapan.',
      vi: 'Kết nối các thế hệ bằng kỷ niệm, câu chuyện và lời chúc.',
      zh: '用回忆、故事和祝愿贯穿几代人。',
      ja: '思い出、故事、願いで世代をつなぎます。',
      th: 'เชื่อมโยงทุกรุ่นด้วยความทรงจำ เรื่องราว และคำอวยพร',
      ko: '추억, 이야기, 축원으로 세대를 이어주세요.'
    }
  },
  {
    id: 'key-onboarding-type-reunion-default-name',
    key: 'onboarding.type_reunion_default_name',
    category: 'onboarding',
    description: 'Default suggested name for reunion capsule',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'The Miller Family Reunion',
      id: 'Reuni Keluarga Besar Miller',
      vi: 'Họp mặt gia đình Miller',
      zh: '米勒家族聚会',
      ja: 'ミラー家ファミリーリユニオン',
      th: 'งานรวมญาติครอบครัวมิลเลอร์',
      ko: '밀러 가문 리유니온'
    }
  },
  {
    id: 'key-onboarding-type-birthday-name',
    key: 'onboarding.type_birthday_name',
    category: 'onboarding',
    description: 'Birthday type name',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Birthday Celebration',
      id: 'Perayaan Ulang Tahun',
      vi: 'Tiệc sinh nhật',
      zh: '生日庆祝',
      ja: '誕生日のお祝い',
      th: 'งานฉลองวันเกิด',
      ko: '생일 축하'
    }
  },
  {
    id: 'key-onboarding-type-birthday-desc',
    key: 'onboarding.type_birthday_desc',
    category: 'onboarding',
    description: 'Birthday type description',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Capture active party clips, sparkler videos, and wishes.',
      id: 'Abadikan momen pesta, video kembang api, dan ucapan.',
      vi: 'Ghi lại các đoạn clip bữa tiệc, video pháo hoa và lời chúc.',
      zh: '捕捉热闹的派对片段、烟花视频和祝福。',
      ja: '活気あふれるパーティー、花火の動画、願いをキャプチャします。',
      th: 'บันทึกคลิปงานปาร์ตี้ วิดีโอพลุ และคำอวยพร',
      ko: '활기찬 파티 클립, 불꽃 놀이 영상, 축하 메시지를 담아보세요.'
    }
  },
  {
    id: 'key-onboarding-type-birthday-default-name',
    key: 'onboarding.type_birthday_default_name',
    category: 'onboarding',
    description: 'Default suggested name for birthday capsule',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: "Marcus' 30th Birthday",
      id: 'Ulang Tahun Marcus ke-30',
      vi: 'Sinh nhật lần thứ 30 của Marcus',
      zh: 'Marcus 30 岁生日庆祝',
      ja: 'マーカス30歳の誕生日',
      th: 'งานฉลองวันเกิดครบรอบ 30 ปีของ Marcus',
      ko: '마커스의 30번째 생일'
    }
  },
  {
    id: 'key-onboarding-type-anniversary-name',
    key: 'onboarding.type_anniversary_name',
    category: 'onboarding',
    description: 'Anniversary type name',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Anniversary',
      id: 'Ulang Tahun Pernikahan',
      vi: 'Kỷ niệm',
      zh: '纪念日',
      ja: '記念日',
      th: 'งานครบรอบ',
      ko: '기념일'
    }
  },
  {
    id: 'key-onboarding-type-anniversary-desc',
    key: 'onboarding.type_anniversary_desc',
    category: 'onboarding',
    description: 'Anniversary type description',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Celebrate beautiful continuous years of shared laughter.',
      id: 'Rayakan tahun-tahun indah penuh tawa bersama.',
      vi: 'Tôn vinh những năm tháng đẹp đẽ tràn ngập tiếng cười.',
      zh: '庆祝多年来美好的共同欢笑。',
      ja: '共有された笑い声の美しい歳月を祝います。',
      th: 'เฉลิมฉลองปีอันสวยงามแห่งเสียงหัวเราร่วมกัน',
      ko: '함께 웃었던 아름다운 시간을 축하하세요.'
    }
  },
  {
    id: 'key-onboarding-type-anniversary-default-name',
    key: 'onboarding.type_anniversary_default_name',
    category: 'onboarding',
    description: 'Default suggested name for anniversary capsule',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Golden Wedding Anniversary',
      id: 'Ulang Tahun Pernikahan Emas',
      vi: 'Kỷ niệm ngày cưới vàng',
      zh: '金婚纪念日',
      ja: '金婚式記念',
      th: 'งานครบรอบแต่งงานสมรสทองคำ',
      ko: '금혼식 기념일'
    }
  },
  {
    id: 'key-onboarding-type-graduation-name',
    key: 'onboarding.type_graduation_name',
    category: 'onboarding',
    description: 'Graduation type name',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Graduation',
      id: 'Kelulusan',
      vi: 'Lễ tốt nghiệp',
      zh: '毕业典礼',
      ja: '卒業式',
      th: 'งานรับปริญญา',
      ko: '졸업식'
    }
  },
  {
    id: 'key-onboarding-type-graduation-desc',
    key: 'onboarding.type_graduation_desc',
    category: 'onboarding',
    description: 'Graduation type description',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Share final caps-off moments and advice from guests.',
      id: 'Bagikan momen kelulusan dan nasihat dari para tamu.',
      vi: 'Chia sẻ khoảnh khắc tung mũ và lời khuyên từ khách mời.',
      zh: '分享定格瞬间和宾客的寄语。',
      ja: '卒業の瞬間やゲストからのアドバイスを共有します。',
      th: 'แบ่งปันช่วงเวลาสำเร็จการศึกษาและคำแนะนำจากแขก',
      ko: '학사모를 던지는 순간과 게스트의 조언을 공유하세요.'
    }
  },
  {
    id: 'key-onboarding-type-graduation-default-name',
    key: 'onboarding.type_graduation_default_name',
    category: 'onboarding',
    description: 'Default suggested name for graduation capsule',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Stanford Class of 2026',
      id: 'Kelulusan Stanford Angkatan 2026',
      vi: 'Lễ tốt nghiệp Stanford Khóa 2026',
      zh: '斯坦福大学 2026 届毕业典礼',
      ja: 'スタンフォード大学 2026年組卒業生',
      th: 'สแตนฟอร์ด รุ่นปี 2026',
      ko: '스탠퍼드 2026 졸업반'
    }
  },
  {
    id: 'key-onboarding-type-other-name',
    key: 'onboarding.type_other_name',
    category: 'onboarding',
    description: 'Custom occasion type name',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Custom Occasion',
      id: 'Acara Khusus',
      vi: 'Dịp đặc biệt',
      zh: '自定义活动',
      ja: 'カスタムイベント',
      th: 'โอกาสพิเศษ',
      ko: '커스텀 행사'
    }
  },
  {
    id: 'key-onboarding-type-other-desc',
    key: 'onboarding.type_other_desc',
    category: 'onboarding',
    description: 'Custom occasion type description',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Any intimate gathering of souls who share moments.',
      id: 'Momen berkumpul hangat bagi siapa saja yang berbagi kenangan.',
      vi: 'Bất kỳ cuộc tụ họp thân mật nào chia sẻ khoảnh khắc.',
      zh: '任何分享美好时刻的温馨聚会。',
      ja: '思い出を共有するあらゆる温かい集まり。',
      th: 'การรวมตัวกันอย่างใกล้ชิดของผู้ที่แบ่งปันช่วงเวลา',
      ko: '추억을 공유하는 소중한 사람들의 모임.'
    }
  },
  {
    id: 'key-onboarding-type-other-default-name',
    key: 'onboarding.type_other_default_name',
    category: 'onboarding',
    description: 'Default suggested name for custom capsule',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'A Special Memory Capsule',
      id: 'Kapsul Kenangan Spesial',
      vi: 'Một Capsule Kỷ niệm Đặc biệt',
      zh: '特别的记忆胶囊',
      ja: '特別なメモリカプセル',
      th: 'แคปซูลความทรงจำพิเศษ',
      ko: '특별한 메모리 캡슐'
    }
  },
  {
    id: 'key-onboarding-step2-tag',
    key: 'onboarding.step2_tag',
    category: 'onboarding',
    description: 'Step 2 category eyebrow label',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'The Details',
      id: 'Detail',
      vi: 'Chi tiết',
      zh: '详细信息',
      ja: '詳細',
      th: 'รายละเอียด',
      ko: '상세 정보'
    }
  },
  {
    id: 'key-onboarding-step2-title',
    key: 'onboarding.step2_title',
    category: 'onboarding',
    description: 'Step 2 main heading',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Tell us about the occasion',
      id: 'Ceritakan tentang acara Anda',
      vi: 'Hãy kể cho chúng tôi về dịp này',
      zh: '告诉我这次活动的信息',
      ja: 'イベントについて教えてください',
      th: 'บอกเราเกี่ยวกับโอกาสนี้',
      ko: '행사에 대해 알려주세요'
    }
  },
  {
    id: 'key-onboarding-step2-desc',
    key: 'onboarding.step2_desc',
    category: 'onboarding',
    description: 'Step 2 description subtext',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'These details appear at the top of your guest invitation page.',
      id: 'Detail ini akan muncul di bagian atas halaman undangan tamu Anda.',
      vi: 'Những chi tiết này xuất hiện ở đầu trang thiệp mời của bạn.',
      zh: '这些详细信息将显示在您的宾客邀请页面的顶部。',
      ja: '精神的な詳細がゲスト招待ページの上部に表示されます。',
      th: 'รายละเอียดเหล่านี้จะปรากฏที่ด้านบนของหน้าบัตรเชิญแขกของคุณ',
      ko: '이 상세 정보는 게스트 초대장 페이지 상단에 표시됩니다.'
    }
  },
  {
    id: 'key-onboarding-capsule-title-label',
    key: 'onboarding.capsule_title_label',
    category: 'onboarding',
    description: 'Capsule title label',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Capsule Title',
      id: 'Judul Kapsul',
      vi: 'Tiêu đề Capsule',
      zh: '胶囊标题',
      ja: 'カプセルタイトル',
      th: 'ชื่อแคปซูล',
      ko: '캡슐 제목'
    }
  },
  {
    id: 'key-onboarding-capsule-title-ph',
    key: 'onboarding.capsule_title_placeholder',
    category: 'onboarding',
    description: 'Capsule title placeholder text',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: "e.g. Sofia & Leo's Wedding",
      id: 'contoh: Pernikahan Sofia & Leo',
      vi: 'ví dụ: Đám cưới Sofia & Leo',
      zh: '例如：Sofia 与 Leo 的婚礼',
      ja: '例：ソフィア＆レオの結婚式',
      th: 'เช่น งานแต่งงาน Sofia & Leo',
      ko: '예: 소피아 & 레오의 결혼식'
    }
  },
  {
    id: 'key-onboarding-date-label',
    key: 'onboarding.date_label',
    category: 'onboarding',
    description: 'Date field label',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Date',
      id: 'Tanggal',
      vi: 'Ngày',
      zh: '日期',
      ja: '日付',
      th: 'วันที่',
      ko: '날짜'
    }
  },
  {
    id: 'key-onboarding-venue-label',
    key: 'onboarding.venue_label',
    category: 'onboarding',
    description: 'Venue field label',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Venue / Location',
      id: 'Lokasi / Tempat',
      vi: 'Địa điểm / Vị trí',
      zh: '场地 / 位置',
      ja: '会場・場所',
      th: 'สถานที่ / เลเคชัน',
      ko: '장소 / 위치'
    }
  },
  {
    id: 'key-onboarding-venue-ph',
    key: 'onboarding.venue_placeholder',
    category: 'onboarding',
    description: 'Venue field placeholder text',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'e.g. The Glasshouse, Big Sur',
      id: 'contoh: Gedung Pertemuan, Jakarta',
      vi: 'ví dụ: The Glasshouse, Big Sur',
      zh: '例如：大索尔玻璃屋',
      ja: '例：ザ・グラスハウス、ビッグサー',
      th: 'เช่น The Glasshouse, Big Sur',
      ko: '예: 빅서 글래스하우스'
    }
  },
  {
    id: 'key-onboarding-step3-tag',
    key: 'onboarding.step3_tag',
    category: 'onboarding',
    description: 'Step 3 category eyebrow label',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'The Aesthetic',
      id: 'Estetika',
      vi: 'Thẩm mỹ',
      zh: '美学视觉',
      ja: 'エステティック',
      th: 'ความสวยงาม',
      ko: '에스테틱'
    }
  },
  {
    id: 'key-onboarding-step3-title',
    key: 'onboarding.step3_title',
    category: 'onboarding',
    description: 'Step 3 main heading',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Select capsule cover',
      id: 'Pilih sampul kapsul',
      vi: 'Chọn ảnh bìa capsule',
      zh: '选择胶囊封面',
      ja: 'カプセルカバーを選択',
      th: 'เลือกปกแคปซูล',
      ko: '캡슐 커버 선택'
    }
  },
  {
    id: 'key-onboarding-step3-desc',
    key: 'onboarding.step3_desc',
    category: 'onboarding',
    description: 'Step 3 description subtext',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'This visual sets the backdrop for your event invite & digital photo album.',
      id: 'Visual ini menjadi latar belakang undangan & album foto digital Anda.',
      vi: 'Hình ảnh này làm nền cho thiệp mời & album ảnh kỹ thuật số của bạn.',
      zh: '此视觉效果为您的活动邀请函和数字相册奠定背景。',
      ja: 'このビジュアルは、イベント招待状とデジタルフォトアルバムの背景となります。',
      th: 'ภาพนี้จะเป็นพื้นหลังสำหรับบัตรเชิญและอัลบั้มภาพดิจิทัลของคุณ',
      ko: '이 비주얼은 이벤트 초대장 및 디지털 사진 앨범의 배경이 됩니다.'
    }
  },
  {
    id: 'key-onboarding-cover-live-preview',
    key: 'onboarding.cover_live_preview',
    category: 'onboarding',
    description: 'Cover live preview section title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Live Cover Preview',
      id: 'Pratinjau Sampul',
      vi: 'Xem trước ảnh bìa',
      zh: '实时封面预览',
      ja: 'リアルタイムカバープレビュー',
      th: 'ตัวอย่างปกสด',
      ko: '실시간 커버 미리보기'
    }
  },
  {
    id: 'key-onboarding-cover-none-sel',
    key: 'onboarding.cover_none_selected',
    category: 'onboarding',
    description: 'Empty cover image title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'No cover image selected',
      id: 'Belum ada gambar sampul',
      vi: 'Chưa chọn ảnh bìa',
      zh: '未选择封面图片',
      ja: 'カバー画像が未選択です',
      th: 'ยังไม่ได้เลือกภาพปก',
      ko: '선택된 커버 이미지가 없습니다'
    }
  },
  {
    id: 'key-onboarding-cover-none-sub',
    key: 'onboarding.cover_none_subtext',
    category: 'onboarding',
    description: 'Empty cover image description',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Capsule will display a neutral solid backdrop',
      id: 'Kapsul akan menampilkan latar belakang netral',
      vi: 'Capsule sẽ hiển thị phông nền trung tính',
      zh: '胶囊将显示中性纯色背景',
      ja: 'カプセルはニュートラルな単色背景を表示します',
      th: 'แคปซูลจะแสดงพื้นหลังสีเรียบ',
      ko: '캡슐에 단색 배경이 표시됩니다'
    }
  },
  {
    id: 'key-onboarding-cover-repos-lbl',
    key: 'onboarding.cover_reposition_label',
    category: 'onboarding',
    description: 'Reposition slider label',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Reposition Image (Vertical Y-Offset)',
      id: 'Atur Posisi Gambar (Vertikal)',
      vi: 'Điều chỉnh vị trí ảnh (Theo chiều dọc)',
      zh: '调整图片位置（垂直偏移）',
      ja: '画像の位置調整（垂直Yオフセット）',
      th: 'ปรับตำแหน่งภาพ (แนวตั้ง)',
      ko: '이미지 위치 조정 (수직 Y-오프셋)'
    }
  },
  {
    id: 'key-onboarding-cover-repos-sub',
    key: 'onboarding.cover_reposition_subtext',
    category: 'onboarding',
    description: 'Reposition slider hint',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Drag to frame the most beautiful portion of the image.',
      id: 'Geser untuk menampilkan bagian gambar paling indah.',
      vi: 'Kéo để căn chỉnh phần đẹp nhất của bức ảnh.',
      zh: '拖动以剪裁图片最美丽的部分。',
      ja: 'ドラッグして画像の最も美しい部分をフレームに収めます。',
      th: 'ลากเพื่อจัดกรอบส่วนที่สวยที่สุดของภาพ',
      ko: '이미지에서 가장 아름다운 부분을 구도에 맞게 드래그하세요.'
    }
  },
  {
    id: 'key-onboarding-cover-preset-lbl',
    key: 'onboarding.cover_preset_label',
    category: 'onboarding',
    description: 'Select preset cover label',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Select Preset Cover',
      id: 'Pilih Sampul Bawaan',
      vi: 'Chọn ảnh bìa mẫu',
      zh: '选择预设封面',
      ja: 'プリセットカバーを選択',
      th: 'เลือกปกสำเร็จรูป',
      ko: '프리셋 커버 선택'
    }
  },
  {
    id: 'key-onboarding-cover-remove',
    key: 'onboarding.cover_remove',
    category: 'onboarding',
    description: 'Remove cover image button text',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Remove Cover Image',
      id: 'Hapus Gambar Sampul',
      vi: 'Xóa ảnh bìa',
      zh: '移除封面图片',
      ja: 'カバー画像を削除',
      th: 'ลบภาพปก',
      ko: '커버 이미지 제거'
    }
  },
  {
    id: 'key-onboarding-cover-url-lbl',
    key: 'onboarding.cover_url_label',
    category: 'onboarding',
    description: 'Paste custom image URL label',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Or paste custom image URL',
      id: 'Atau tempel URL gambar',
      vi: 'Hoặc dán URL hình ảnh',
      zh: '或粘贴自定义图片 URL',
      ja: 'またはカスタム画像URLを貼り付け',
      th: 'หรือวาง URL ภาพ',
      ko: '또는 커스텀 이미지 URL 붙여넣기'
    }
  },
  {
    id: 'key-onboarding-cover-file-lbl',
    key: 'onboarding.cover_file_label',
    category: 'onboarding',
    description: 'Upload image file label',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Or upload image file',
      id: 'Atau unggah berkas gambar',
      vi: 'Hoặc tải lên tệp hình ảnh',
      zh: '或上传图片文件',
      ja: 'または画像ファイルをアップロード',
      th: 'หรืออัปโหลดไฟล์ภาพ',
      ko: '또는 이미지 파일 업로드'
    }
  },
  {
    id: 'key-onboarding-cover-file-choose',
    key: 'onboarding.cover_file_choose',
    category: 'onboarding',
    description: 'Choose cover file button text',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Choose Cover File',
      id: 'Pilih Berkas Sampul',
      vi: 'Chọn tệp ảnh bìa',
      zh: '选择封面文件',
      ja: 'カバーファイルを選択',
      th: 'เลือกไฟล์ปก',
      ko: '커버 파일 선택'
    }
  },
  {
    id: 'key-onboarding-cover-file-replace',
    key: 'onboarding.cover_file_replace',
    category: 'onboarding',
    description: 'Replace local cover file button text',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Replace Local File',
      id: 'Ganti Berkas',
      vi: 'Thay thế tệp',
      zh: '替换本地文件',
      ja: 'ローカルファイルを差し替え',
      th: 'เปลี่ยนไฟล์',
      ko: '파일 교체'
    }
  },
  {
    id: 'key-onboarding-step4-tag',
    key: 'onboarding.step4_tag',
    category: 'onboarding',
    description: 'Step 4 category eyebrow label',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'The Circle',
      id: 'Lingkaran Tamu',
      vi: 'Vòng tròn',
      zh: '圈子与隐私',
      ja: 'サークル',
      th: 'วงสังคม',
      ko: '가디언 서클'
    }
  },
  {
    id: 'key-onboarding-step4-title',
    key: 'onboarding.step4_title',
    category: 'onboarding',
    description: 'Step 4 main heading',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Guest Permissions & Privacy',
      id: 'Izin Tamu & Privasi',
      vi: 'Quyền truy cập & Quyền riêng tư',
      zh: '宾客权限与隐私',
      ja: 'ゲストの権限とプライバシー',
      th: 'สิทธิ์ของแขกและความเป็นส่วนตัว',
      ko: '게스트 권한 및 개인정보 보호'
    }
  },
  {
    id: 'key-onboarding-step4-desc',
    key: 'onboarding.step4_desc',
    category: 'onboarding',
    description: 'Step 4 description subtext',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Control how family & friends contribute to and view the memory timeline.',
      id: 'Atur cara keluarga & teman berkontribusi dan melihat lini masa kenangan.',
      vi: 'Kiểm soát cách gia đình & bạn bè đóng góp và xem mốc thời gian kỷ niệm.',
      zh: '控制家人和朋友如何贡献和查看记忆时间线。',
      ja: '家族や友人が思い出のタイムラインに投稿・閲覧する方法を管理します。',
      th: 'ควบคุมวิธีที่ครอบครัวและเพื่อนๆ ร่วมแบ่งปันและดูไทม์ไลน์ความทรงจำ',
      ko: '가족과 친구가 추억 타임라인에 기여하고 보는 방식을 제어하세요.'
    }
  },
  {
    id: 'key-onboarding-perm-contrib-title',
    key: 'onboarding.perm_contributions_title',
    category: 'onboarding',
    description: 'Allow guest contributions title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Allow Guest Contributions',
      id: 'Izinkan Kontribusi Tamu',
      vi: 'Cho phép khách đóng góp',
      zh: '允许宾客贡献',
      ja: 'ゲストの投稿を許可',
      th: 'อนุญาตให้แขกแบ่งปัน',
      ko: '게스트 기여 허용'
    }
  },
  {
    id: 'key-onboarding-perm-contrib-desc',
    key: 'onboarding.perm_contributions_desc',
    category: 'onboarding',
    description: 'Allow guest contributions description',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Anyone with the invitation link or QR code can upload and write wishes.',
      id: 'Siapa saja yang memiliki tautan undangan atau kode QR dapat mengunggah dan menulis ucapan.',
      vi: 'Bất kỳ ai có liên kết mời hoặc mã QR đều có thể tải lên và viết lời chúc.',
      zh: '任何拥有邀请链接或二维码的人都可以上传和撰写祝福。',
      ja: '招待リンクまたはQRコードを持つ人は誰でもアップロードやメッセージの記入ができます。',
      th: 'ทุกคนที่มีลิงก์คำเชิญหรือ QR Code สามารถอัปโหลดและเขียนคำอวยพรได้',
      ko: '초대 링크나 QR 코드가 있는 사람은 누구나 업로드하고 축하 메시지를 작성할 수 있습니다.'
    }
  },
  {
    id: 'key-onboarding-perm-mod-title',
    key: 'onboarding.perm_moderation_title',
    category: 'onboarding',
    description: 'Host moderation title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Host Moderation Required',
      id: 'Moderasi Tuan Rumah Diperlukan',
      vi: 'Yêu cầu chủ nhà duyệt',
      zh: '需要主持人审核',
      ja: 'ホストによる承認を必須にする',
      th: 'ต้องได้รับการอนุมัติจากผู้จัด',
      ko: '호스트 승인 필요'
    }
  },
  {
    id: 'key-onboarding-perm-mod-desc',
    key: 'onboarding.perm_moderation_desc',
    category: 'onboarding',
    description: 'Host moderation description',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Contributions remain secret until you approve them in the Host Dashboard.',
      id: 'Kontribusi tetap tersembunyi hingga Anda menyetujuinya di Dashboard Tuan Rumah.',
      vi: 'Các đóng góp sẽ được giữ bí mật cho đến khi bạn phê duyệt trong Dashboard.',
      zh: '贡献将保持隐蔽，直到您在主持人仪表板中批准它们。',
      ja: 'ホストダッシュボードで承認するまで投稿は公開されません。',
      th: 'ผลงานจะถูกเก็บเป็นความลับจนกว่าคุณจะอนุมัติในแดชบอร์ด',
      ko: '호스트 대시보드에서 승인할 때까지 기여 내용은 공개되지 않습니다.'
    }
  },
  {
    id: 'key-onboarding-priv-hdr',
    key: 'onboarding.privacy_settings_header',
    category: 'onboarding',
    description: 'Privacy settings header text',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Privacy Settings',
      id: 'Pengaturan Privasi',
      vi: 'Cài đặt riêng tư',
      zh: '隐私设置',
      ja: 'プライバシー設定',
      th: 'การตั้งค่าความเป็นส่วนตัว',
      ko: '개인정보 설정'
    }
  },
  {
    id: 'key-onboarding-priv-anon-title',
    key: 'onboarding.privacy_anonymize_title',
    category: 'onboarding',
    description: 'Anonymize for guests title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Anonymize for Guests',
      id: 'Anonimkan untuk Tamu',
      vi: 'Ẩn danh đối với khách',
      zh: '对宾客匿名',
      ja: 'ゲストに対して匿名化',
      th: 'ไม่แสดงชื่อสำหรับแขก',
      ko: '게스트 대상 익명화'
    }
  },
  {
    id: 'key-onboarding-priv-anon-desc',
    key: 'onboarding.privacy_anonymize_desc',
    category: 'onboarding',
    description: 'Anonymize for guests description',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Hide contributor names from other guests (displayed anonymously on guest feeds while preserving owner visibility in Host Dashboard).',
      id: 'Sembunyikan nama kontributor dari tamu lain (ditampilkan secara anonim di umpan tamu namun tetap terlihat di Dashboard Tuan Rumah).',
      vi: 'Ẩn tên người đóng góp đối với các khách khác (hiển thị ẩn danh trên trang khách nhưng vẫn hiển thị với chủ nhà).',
      zh: '对其他宾客隐藏贡献者姓名（在宾客动态中匿名显示，但在主持人仪表板中保持可见）。',
      ja: '他のゲストに対して投稿者名を非表示にします（ホストには表示されます）。',
      th: 'ซ่อนชื่อผู้แบ่งปันจากแขกคนอื่น (แสดงแบบไม่ระบุตัวตนในหน้าแขก)',
      ko: '다른 게스트에게 기여자의 이름을 숨깁니다 (호스트 대시보드에서는 확인 가능).'
    }
  },
  {
    id: 'key-onboarding-priv-anonw-title',
    key: 'onboarding.privacy_anon_wishes_title',
    category: 'onboarding',
    description: 'Allow anonymous wishes title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Allow Anonymous Wishes',
      id: 'Izinkan Ucapan Anonim',
      vi: 'Cho phép lời chúc ẩn danh',
      zh: '允许匿名祝福',
      ja: '匿名メッセージを許可',
      th: 'อนุญาตให้ส่งคำอวยพรแบบไม่ระบุชื่อ',
      ko: '익명 축하 메시지 허용'
    }
  },
  {
    id: 'key-onboarding-priv-anonw-desc',
    key: 'onboarding.privacy_anon_wishes_desc',
    category: 'onboarding',
    description: 'Allow anonymous wishes description',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Guests can write wishes and greetings anonymously without entering their name.',
      id: 'Tamu dapat menulis ucapan tanpa memasukkan nama mereka.',
      vi: 'Khách có thể viết lời chúc và lời chào ẩn danh mà không cần nhập tên.',
      zh: '宾客可以匿名撰写祝福和问候，无需输入姓名。',
      ja: 'ゲストは名前を入力せずに匿名でメッセージを記入できます。',
      th: 'แขกสามารถเขียนคำอวยพรได้โดยไม่ต้องระบุชื่อ',
      ko: '게스트가 이름을 입력하지 않고 익명으로 축하 메시지를 작성할 수 있습니다.'
    }
  },
  {
    id: 'key-onboarding-priv-vis-title',
    key: 'onboarding.privacy_visibility_title',
    category: 'onboarding',
    description: 'Guest visibility control title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Guest Visibility Control',
      id: 'Kontrol Visibilitas Tamu',
      vi: 'Kiểm soát quyền xem của khách',
      zh: '宾客可见性控制',
      ja: 'ゲストの表示制御',
      th: 'การควบคุมการมองเห็นของแขก',
      ko: '게스트 공개 범위 제어'
    }
  },
  {
    id: 'key-onboarding-priv-vis-desc',
    key: 'onboarding.privacy_visibility_desc',
    category: 'onboarding',
    description: 'Guest visibility control description',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Choose what guests can see when browsing the compiled digital capsule.',
      id: 'Pilih apa yang dapat dilihat tamu saat menjelajahi kapsul digital.',
      vi: 'Chọn những gì khách có thể xem khi duyệt capsule kỹ thuật số.',
      zh: '选择宾客在浏览合并的数字胶囊时可以看到的内容。',
      ja: 'デジタルカプセルを閲覧する際にゲストが見ることができる内容を選択します。',
      th: 'เลือกสิ่งที่แขกสามารถมองเห็นได้เมื่อดูแคปซูลดิจิทัล',
      ko: '컴파일된 디지털 캡슐을 둘러볼 때 게스트가 볼 수 있는 항목을 선택하세요.'
    }
  },
  {
    id: 'key-onboarding-vis-all',
    key: 'onboarding.visibility_all',
    category: 'onboarding',
    description: 'Show all option',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Show All',
      id: 'Tampilkan Semua',
      vi: 'Hiển thị tất cả',
      zh: '显示全部',
      ja: 'すべて表示',
      th: 'แสดงทั้งหมด',
      ko: '모두 표시'
    }
  },
  {
    id: 'key-onboarding-vis-own',
    key: 'onboarding.visibility_own',
    category: 'onboarding',
    description: 'Own only option',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Own Only',
      id: 'Hanya Milik Sendiri',
      vi: 'Chỉ của chính mình',
      zh: '仅限自己',
      ja: '自分のみ',
      th: 'เฉพาะของตัวเอง',
      ko: '본인 것만'
    }
  },
  {
    id: 'key-onboarding-vis-none',
    key: 'onboarding.visibility_none',
    category: 'onboarding',
    description: 'Vault (None) option',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Vault (None)',
      id: 'Brankas (Tidak Ada)',
      vi: 'Kho lưu trữ (Không có)',
      zh: '保管库（无）',
      ja: '金庫（表示なし）',
      th: 'คลังเก็บ (ไม่แสดง)',
      ko: '금고 (비공개)'
    }
  },
  {
    id: 'key-onboarding-step5-tag',
    key: 'onboarding.step5_tag',
    category: 'onboarding',
    description: 'Step 5 category eyebrow label',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'The Reveal',
      id: 'Penyingkapan',
      vi: 'Mở Màn',
      zh: '揭晓方式',
      ja: 'リビール（公開）',
      th: 'การเปิดเผย',
      ko: '리빌(공개)'
    }
  },
  {
    id: 'key-onboarding-step5-title',
    key: 'onboarding.step5_title',
    category: 'onboarding',
    description: 'Step 5 main heading',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'How do guests see memories?',
      id: 'Bagaimana tamu melihat kenangan?',
      vi: 'Làm thế nào để khách xem kỷ niệm?',
      zh: '宾客如何查看回忆？',
      ja: 'ゲストはどのように思い出を見ますか？',
      th: 'แขกจะเห็นความทรงจำได้อย่างไร?',
      ko: '게스트가 추억을 어떻게 보게 되나요?'
    }
  },
  {
    id: 'key-onboarding-step5-desc',
    key: 'onboarding.step5_desc',
    category: 'onboarding',
    description: 'Step 5 description subtext',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Determine when guests can view the compiled memories of others, and when they can upload.',
      id: 'Tentukan kapan tamu dapat melihat kenangan yang dikumpulkan, dan kapan mereka dapat mengunggah.',
      vi: 'Xác định thời điểm khách có thể xem kỷ niệm của người khác và thời điểm họ có thể tải lên.',
      zh: '确定宾客何时可以查看他人汇集的记忆，以及何时可以上传。',
      ja: '他の人の思い出をゲストがいつ閲覧・アップロードできるかを決定します。',
      th: 'กำหนดเวลาที่แขกสามารถดูความทรงจำของคนอื่นและเวลาที่สามารถอัปโหลดได้',
      ko: '게스트가 다른 사람의 추억을 볼 수 있는 시점과 업로드 가능 시점을 설정하세요.'
    }
  },
  {
    id: 'key-onboarding-reveal-mode-hdr',
    key: 'onboarding.reveal_mode_header',
    category: 'onboarding',
    description: 'Reveal mode section label',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Reveal Mode',
      id: 'Mode Penyingkapan',
      vi: 'Chế độ hiển thị',
      zh: '揭晓模式',
      ja: '公開モード',
      th: 'โหมดการเปิดเผย',
      ko: '공개 모드'
    }
  },
  {
    id: 'key-onboarding-rev-live-title',
    key: 'onboarding.reveal_live_title',
    category: 'onboarding',
    description: 'Live reveal title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Live Reveal',
      id: 'Langsung (Live)',
      vi: 'Hiển thị trực tiếp',
      zh: '实时揭晓',
      ja: 'ライブ公開',
      th: 'เปิดเผยสด',
      ko: '실시간 공개'
    }
  },
  {
    id: 'key-onboarding-rev-live-desc',
    key: 'onboarding.reveal_live_desc',
    category: 'onboarding',
    description: 'Live reveal description',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Photos appear instantly on shared feeds.',
      id: 'Foto langsung muncul di umpan bersama.',
      vi: 'Ảnh xuất hiện tức thì trên trang chia sẻ.',
      zh: '照片会立即出现在共享动态中。',
      ja: '写真は共有フィードに即座に表示されます。',
      th: 'ภาพถ่ายจะปรากฏทันทีบนฟีดที่ shared',
      ko: '사진이 공유 피드에 즉시 표시됩니다.'
    }
  },
  {
    id: 'key-onboarding-rev-after-title',
    key: 'onboarding.reveal_after_title',
    category: 'onboarding',
    description: 'After event reveal title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'After Event',
      id: 'Setelah Acara',
      vi: 'Sau sự kiện',
      zh: '活动结束后',
      ja: 'イベント終了後',
      th: 'หลังจบงาน',
      ko: '행사 종료 후'
    }
  },
  {
    id: 'key-onboarding-rev-after-desc',
    key: 'onboarding.reveal_after_desc',
    category: 'onboarding',
    description: 'After event reveal description',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Memories stay secret until you reveal them.',
      id: 'Kenangan tetap tersembunyi hingga Anda membukanya.',
      vi: 'Kỷ niệm được giữ bí mật cho đến khi bạn tiết lộ.',
      zh: '在您揭晓之前，回忆将保持保密。',
      ja: 'ホストが公開するまで思い出は非公開となります。',
      th: 'ความทรงจำจะถูกเก็บเป็นความลับจนกว่าคุณจะเปิดเผย',
      ko: '호스트가 공개할 때까지 추억은 비밀로 유지됩니다.'
    }
  },
  {
    id: 'key-onboarding-rev-sched-title',
    key: 'onboarding.reveal_scheduled_title',
    category: 'onboarding',
    description: 'Scheduled reveal title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Scheduled',
      id: 'Terjadwal',
      vi: 'Lên lịch',
      zh: '定时揭晓',
      ja: 'スケジュール公開',
      th: 'ตั้งเวลา',
      ko: '예약 공개'
    }
  },
  {
    id: 'key-onboarding-rev-sched-desc',
    key: 'onboarding.reveal_scheduled_desc',
    category: 'onboarding',
    description: 'Scheduled reveal description',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Feeds unlock automatically at a set time.',
      id: 'Umpan terbuka secara otomatis pada waktu yang ditentukan.',
      vi: 'Trang sẽ tự động mở vào thời gian đã đặt.',
      zh: '动态在设定时间自动解锁。',
      ja: '定刻になるとフィードが自動的に公開されます。',
      th: 'ฟีดจะเปิดโดยอัตโนมัติตามเวลาที่กำหนด',
      ko: '설정된 시간에 피드가 자동으로 열립니다.'
    }
  },
  {
    id: 'key-onboarding-rev-sched-lbl',
    key: 'onboarding.reveal_scheduled_label',
    category: 'onboarding',
    description: 'Scheduled reveal datetime label',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Specify Scheduled Reveal Date & Time',
      id: 'Tentukan Tanggal & Waktu Penyingkapan',
      vi: 'Chỉ định ngày & giờ mở',
      zh: '指定定时揭晓日期与时间',
      ja: 'スケジュール公開日時を指定',
      th: 'ระบุวันที่และเวลาที่จะเปิดเผย',
      ko: '예약 공개 날짜 및 시간 지정'
    }
  },
  {
    id: 'key-onboarding-rev-sched-sub',
    key: 'onboarding.reveal_scheduled_subtext',
    category: 'onboarding',
    description: 'Scheduled reveal countdown hint',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Guests will see a countdown until this exact timestamp is reached.',
      id: 'Tamu akan melihat hitung mundur hingga waktu ini tercapai.',
      vi: 'Khách sẽ thấy đếm ngược cho đến thời điểm này.',
      zh: '在达到该精准时间戳之前，宾客将看到倒计时。',
      ja: 'この時間に達するまで、ゲストにはカウントダウンが表示されます。',
      th: 'แขกจะเห็นตัวนับถอยหลังจนกว่าจะถึงเวลานี้',
      ko: '지정된 시간에 도달할 때까지 게스트에게 카운트다운이 표시됩니다.'
    }
  },
  {
    id: 'key-onboarding-up-constraints-hdr',
    key: 'onboarding.upload_constraints_header',
    category: 'onboarding',
    description: 'Upload time constraints section header',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Upload Time Constraints',
      id: 'Batasan Waktu Unggah',
      vi: 'Giới hạn thời gian tải lên',
      zh: '上传时间限制',
      ja: 'アップロード時間制限',
      th: 'ข้อจำกัดเวลาในการอัปโหลด',
      ko: '업로드 시간 제한'
    }
  },
  {
    id: 'key-onboarding-up-start-lbl',
    key: 'onboarding.upload_start_label',
    category: 'onboarding',
    description: 'Upload start time label',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Upload Start Time',
      id: 'Waktu Mulai Unggah',
      vi: 'Thời gian bắt đầu tải lên',
      zh: '上传开始时间',
      ja: 'アップロード開始日時',
      th: 'เวลาเริ่มต้นอัปโหลด',
      ko: '업로드 시작 시간'
    }
  },
  {
    id: 'key-onboarding-up-start-sub',
    key: 'onboarding.upload_start_subtext',
    category: 'onboarding',
    description: 'Upload start time hint',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Leave blank to start accepting contributions immediately.',
      id: 'Biarkan kosong untuk langsung menerima kontribusi.',
      vi: 'Để trống để bắt đầu nhận đóng góp ngay lập tức.',
      zh: '留空则立即开始接受贡献。',
      ja: '空白のままにすると、すぐに受付を開始します。',
      th: 'เว้นว่างไว้หากต้องการเริ่มรับข้อมูลทันที',
      ko: '즉시 기여를 시작하려면 비워두세요.'
    }
  },
  {
    id: 'key-onboarding-up-dl-lbl',
    key: 'onboarding.upload_deadline_label',
    category: 'onboarding',
    description: 'Upload deadline label',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Upload Deadline',
      id: 'Batas Akhir Unggah',
      vi: 'Hạn chót tải lên',
      zh: '上传截止时间',
      ja: 'アップロード締切日時',
      th: 'กำหนดเวลาสิ้นสุดการอัปโหลด',
      ko: '업로드 마감 시간'
    }
  },
  {
    id: 'key-onboarding-up-dl-sub',
    key: 'onboarding.upload_deadline_subtext',
    category: 'onboarding',
    description: 'Upload deadline hint',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Leave blank to keep uploads open indefinitely.',
      id: 'Biarkan kosong untuk membuka unggahan tanpa batas.',
      vi: 'Để trống để mở tải lên vô thời hạn.',
      zh: '留空则无期限开放上传。',
      ja: '空白のままにすると、無期限で開放されます。',
      th: 'เว้นว่างไว้เพื่อเปิดรับอัปโหลดอย่างไม่จำกัด',
      ko: '기한 없이 열어두려면 비워두세요.'
    }
  },
  {
    id: 'key-onboarding-step6-tag',
    key: 'onboarding.step6_tag',
    category: 'onboarding',
    description: 'Step 6 category eyebrow label',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'The Formats',
      id: 'Format Kontribusi',
      vi: 'Định dạng',
      zh: '允许格式',
      ja: 'フォーマット',
      th: 'รูปแบบ',
      ko: '기여 형식'
    }
  },
  {
    id: 'key-onboarding-step6-title',
    key: 'onboarding.step6_title',
    category: 'onboarding',
    description: 'Step 6 main heading',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Allowed contribution types & limits',
      id: 'Jenis & batasan kontribusi yang diizinkan',
      vi: 'Loại & giới hạn đóng góp được phép',
      zh: '允许的贡献类型与限制',
      ja: '許可する投稿タイプと制限',
      th: 'ประเภทและข้อจำกัดการแบ่งปันที่อนุญาต',
      ko: '허용되는 기여 유형 및 제한'
    }
  },
  {
    id: 'key-onboarding-step6-desc',
    key: 'onboarding.step6_desc',
    category: 'onboarding',
    description: 'Step 6 description subtext',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Guests can upload or record these formats. You can set contribution limits per guest (0 = unlimited).',
      id: 'Tamu dapat mengunggah atau merekam format ini. Anda dapat mengatur batasan per tamu (0 = tanpa batas).',
      vi: 'Khách có thể tải lên hoặc ghi lại các định dạng này. Bạn có thể đặt giới hạn cho mỗi khách (0 = không giới hạn).',
      zh: '宾客可以上传或录制这些格式。您可以设置每位宾客的贡献限制（0 = 不限制）。',
      ja: 'ゲストは破れらの形式で投稿・録音できます。ゲストごとの制限を設定できます（0 = 無制限）。',
      th: 'แขกสามารถอัปโหลดหรือบันทึกในรูปแบบเหล่านี้ได้ คุณสามารถตั้งข้อจำกัดต่อคนได้ (0 = ไม่จำกัด)',
      ko: '게스트는 이 형식들을 업로드하거나 녹음할 수 있습니다. 게스트당 기여 제한을 설정할 수 있습니다 (0 = 무제한).'
    }
  },
  {
    id: 'key-onboarding-fmt-photos-t',
    key: 'onboarding.fmt_photos_title',
    category: 'onboarding',
    description: 'Photos contribution type title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Photos & Polaroids',
      id: 'Foto & Polaroid',
      vi: 'Ảnh & Polaroid',
      zh: '照片与拍立得',
      ja: '写真＆ポラロイド',
      th: 'รูปภาพ & โพลารอยด์',
      ko: '사진 및 폴라로이드'
    }
  },
  {
    id: 'key-onboarding-fmt-photos-s',
    key: 'onboarding.fmt_photos_subtext',
    category: 'onboarding',
    description: 'Photos contribution type format details',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'JPEG, PNG, HEIC formats',
      id: 'Format JPEG, PNG, HEIC',
      vi: 'Định dạng JPEG, PNG, HEIC',
      zh: 'JPEG, PNG, HEIC 格式',
      ja: 'JPEG, PNG, HEIC 形式',
      th: 'รูปแบบ JPEG, PNG, HEIC',
      ko: 'JPEG, PNG, HEIC 형식'
    }
  },
  {
    id: 'key-onboarding-fmt-videos-t',
    key: 'onboarding.fmt_videos_title',
    category: 'onboarding',
    description: 'Videos contribution type title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Landscape Videos',
      id: 'Video',
      vi: 'Video nằm ngang',
      zh: '横屏视频',
      ja: '横向動画',
      th: 'วิดีโอแนวนอน',
      ko: '가로 영상'
    }
  },
  {
    id: 'key-onboarding-fmt-videos-s',
    key: 'onboarding.fmt_videos_subtext',
    category: 'onboarding',
    description: 'Videos contribution type details',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'MP4/MOV up to 100MB',
      id: 'MP4/MOV hingga 100MB',
      vi: 'MP4/MOV lên đến 100MB',
      zh: 'MP4/MOV 最高 100MB',
      ja: 'MP4/MOV 最大100MB',
      th: 'MP4/MOV สูงสุด 100MB',
      ko: 'MP4/MOV 최대 100MB'
    }
  },
  {
    id: 'key-onboarding-fmt-voice-t',
    key: 'onboarding.fmt_voice_title',
    category: 'onboarding',
    description: 'Voice messages contribution type title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Voice Messages',
      id: 'Pesan Suara',
      vi: 'Tin nhắn thoại',
      zh: '语音留言',
      ja: '音声メッセージ',
      th: 'ข้อความเสียง',
      ko: '음성 메시지'
    }
  },
  {
    id: 'key-onboarding-fmt-voice-s',
    key: 'onboarding.fmt_voice_subtext',
    category: 'onboarding',
    description: 'Voice messages details',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Record voicemail wishes',
      id: 'Rekam ucapan suara',
      vi: 'Ghi lại Lời chúc thoại',
      zh: '录制语音祝福',
      ja: 'ボイスメッセージの録音',
      th: 'บันทึกคำอวยพรด้วยเสียง',
      ko: '음성 축하 메시지 녹음'
    }
  },
  {
    id: 'key-onboarding-fmt-wishes-t',
    key: 'onboarding.fmt_wishes_title',
    category: 'onboarding',
    description: 'Written wishes contribution type title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Written Wishes',
      id: 'Ucapan Tertulis',
      vi: 'Lời chúc viết tay',
      zh: '书面祝福',
      ja: 'テキストメッセージ',
      th: 'คำอวยพรแบบข้อความ',
      ko: '텍스트 축하 메시지'
    }
  },
  {
    id: 'key-onboarding-fmt-wishes-s',
    key: 'onboarding.fmt_wishes_subtext',
    category: 'onboarding',
    description: 'Written wishes details',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Intimate guestbook',
      id: 'Buku tamu digital',
      vi: 'Sổ lưu niệm',
      zh: '亲密留言薄',
      ja: 'ゲストブック',
      th: 'สมุดเยี่ยมดิจิทัล',
      ko: '디지털 방명록'
    }
  },
  {
    id: 'key-onboarding-limit-per-guest',
    key: 'onboarding.limit_per_guest',
    category: 'onboarding',
    description: 'Limit per guest label',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Limit / guest',
      id: 'Batas / tamu',
      vi: 'Giới hạn / khách',
      zh: '限制 / 位宾客',
      ja: '制限 / ゲスト',
      th: 'ข้อจำกัด / คน',
      ko: '제한 / 게스트'
    }
  },
  {
    id: 'key-onboarding-limit-unlimited',
    key: 'onboarding.limit_unlimited',
    category: 'onboarding',
    description: 'Unlimited limit placeholder',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Unlimited',
      id: 'Tanpa Batas',
      vi: 'Không giới hạn',
      zh: '无限制',
      ja: '無制限',
      th: 'ไม่จำกัด',
      ko: '무제한'
    }
  },
  {
    id: 'key-onboarding-step7-tag',
    key: 'onboarding.step7_tag',
    category: 'onboarding',
    description: 'Step 7 category eyebrow label',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Capsule Confirmed',
      id: 'Kapsul Dikonfirmasi',
      vi: 'Capsule đã xác nhận',
      zh: '胶囊已确认',
      ja: 'カプセル作成完了',
      th: 'ยืนยันแคปซูลเรียบร้อย',
      ko: '캡슐 생성 완료'
    }
  },
  {
    id: 'key-onboarding-step7-title',
    key: 'onboarding.step7_title',
    category: 'onboarding',
    description: 'Step 7 main heading',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Your memory capsule is ready!',
      id: 'Kapsul kenangan Anda telah siap!',
      vi: 'Capsule kỷ niệm của bạn đã sẵn sàng!',
      zh: '您的记忆胶囊准备就绪！',
      ja: 'メモリカプセルの準備が完了しました！',
      th: 'แคปซูลความทรงจำของคุณพร้อมแล้ว!',
      ko: '메모리 캡슐이 준비되었습니다!'
    }
  },
  {
    id: 'key-onboarding-step7-desc',
    key: 'onboarding.step7_desc',
    category: 'onboarding',
    description: 'Step 7 success message text',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: '{eventName} has been beautifully initialized. You can now download the table QR code and share the link with guests.',
      id: '{eventName} telah berhasil dibuat. Anda sekarang dapat mengunduh kode QR meja dan membagikan tautannya ke para tamu.',
      vi: '{eventName} đã được khởi tạo thành công. Bây giờ bạn có thể tải xuống mã QR bàn và chia sẻ liên kết với khách.',
      zh: '{eventName} 已成功初始化。您现在可以下载桌卡二维码并将链接分享给宾客。',
      ja: '{eventName} が正常に作成されました。卓上QRコードをダウンロードしてゲストと共有できます。',
      th: '{eventName} ถูกสร้างเรียบร้อยแล้ว คุณสามารถดาวน์โหลด QR Code และแชร์ลิงก์ให้แขกได้ทันที',
      ko: '{eventName} 이(가) 생성되었습니다. 이제 테이블 QR 코드를 다운로드하고 게스트와 링크를 공유할 수 있습니다.'
    }
  },
  {
    id: 'key-onboarding-access-code-lbl',
    key: 'onboarding.access_code_label',
    category: 'onboarding',
    description: 'Event access code box title',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'EVENT ACCESS CODE',
      id: 'KODE AKSES ACARA',
      vi: 'MÃ TRUY CẬP SỰ KIỆN',
      zh: '活动访问代码',
      ja: 'イベントアクセスコード',
      th: 'รหัสเข้าใช้งานงาน',
      ko: '이벤트 액세스 코드'
    }
  },
  {
    id: 'key-onboarding-access-code-sub',
    key: 'onboarding.access_code_subtext',
    category: 'onboarding',
    description: 'Event access code hint text',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Guests simply scan the code, enter their name, and instantly record memories.',
      id: 'Tamu cukup memindai kode, memasukkan nama mereka, dan langsung mengabadikan kenangan.',
      vi: 'Khách chỉ cần quét mã, nhập tên và ghi lại kỷ niệm ngay lập tức.',
      zh: '宾客只需扫描二维码、输入姓名，即可立即记录回忆。',
      ja: 'ゲストはコードをスキャンして名前を入力するだけで、すぐに思い出を記録できます。',
      th: 'แขกเพียงสแกนรหัส กรอกชื่อ และบันทึกความทรงจำได้ทันที',
      ko: '게스트는 코드를 스캔하고 이름을 입력하기만 하면 즉시 추억을 기록할 수 있습니다.'
    }
  },
  {
    id: 'key-onboarding-footer-quote',
    key: 'onboarding.footer_quote',
    category: 'onboarding',
    description: 'Bottom quiet quote footer text',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: '"We don\'t store files. We preserve memories."',
      id: '"Kami tidak menyimpan berkas. Kami mengabadikan kenangan."',
      vi: '"Chúng tôi không lưu trữ tệp. Chúng tôi bảo tồn kỷ niệm."',
      zh: '“我们不只是存储文件，我们是在永恒珍藏回忆。”',
      ja: '「ファイルを保存するのではなく、思い出を永遠に刻みます。」',
      th: '"เราไม่ได้เก็บเพียงไฟล์ แต่เราปกป้องความทรงจำ"',
      ko: '"우리는 단순한 파일을 저장하지 않습니다. 추억을 영원히 보존합니다."'
    }
  },
  {
    id: 'key-onboarding-quick-presets-lbl',
    key: 'onboarding.quick_presets_label',
    category: 'onboarding',
    description: 'Quick time presets label',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Quick Time Presets',
      id: 'Preset Waktu Cepat',
      vi: 'Cài đặt thời gian nhanh',
      zh: '快速时间预设',
      ja: 'クイック時間プリセット',
      th: 'ค่าเวลาที่ตั้งไว้ล่วงหน้า',
      ko: '빠른 시간 프리셋'
    }
  },
  {
    id: 'key-onboarding-preset-active-bdg',
    key: 'onboarding.preset_active_badge',
    category: 'onboarding',
    description: 'Preset active badge text',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Preset synced',
      id: 'Preset tersinkronisasi',
      vi: 'Đã đồng bộ cài đặt',
      zh: '预设已同步',
      ja: 'プリセット同期済み',
      th: 'ซิงค์ค่าล่วงหน้าแล้ว',
      ko: '프리셋 동기화됨'
    }
  },
  {
    id: 'key-onboarding-preset-same-day',
    key: 'onboarding.preset_same_day',
    category: 'onboarding',
    description: 'Same day preset label',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Same Day',
      id: 'Hari yang Sama',
      vi: 'Cùng ngày',
      zh: '当天',
      ja: '当日',
      th: 'วันเดียวกัน',
      ko: '당일'
    }
  },
  {
    id: 'key-onboarding-preset-same-day-bdg',
    key: 'onboarding.preset_same_day_badge',
    category: 'onboarding',
    description: 'Same day preset badge label',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Event Day',
      id: 'Hari H',
      vi: 'Ngày sự kiện',
      zh: '活动当天',
      ja: 'イベント当日',
      th: 'วันงาน',
      ko: '행사 당일'
    }
  },
  {
    id: 'key-onboarding-preset-h1',
    key: 'onboarding.preset_h1',
    category: 'onboarding',
    description: 'Plus 1 day preset label',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'H+1 Day',
      id: 'H+1 Hari',
      vi: 'H+1 Ngày',
      zh: 'H+1 天',
      ja: 'H+1 日',
      th: 'H+1 วัน',
      ko: 'H+1 일'
    }
  },
  {
    id: 'key-onboarding-preset-h3',
    key: 'onboarding.preset_h3',
    category: 'onboarding',
    description: 'Plus 3 days preset label',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'H+3 Days',
      id: 'H+3 Hari',
      vi: 'H+3 Ngày',
      zh: 'H+3 天',
      ja: 'H+3 日',
      th: 'H+3 วัน',
      ko: 'H+3 일'
    }
  },
  {
    id: 'key-onboarding-preset-h7',
    key: 'onboarding.preset_h7',
    category: 'onboarding',
    description: 'Plus 1 week preset label',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'H+1 Week',
      id: 'H+1 Minggu',
      vi: 'H+1 Tuần',
      zh: 'H+1 周',
      ja: 'H+1 週間',
      th: 'H+1 สัปดาห์',
      ko: 'H+1 주'
    }
  },
  {
    id: 'key-onboarding-preset-custom',
    key: 'onboarding.preset_custom',
    category: 'onboarding',
    description: 'Custom preset label',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Custom',
      id: 'Kustom',
      vi: 'Tùy chỉnh',
      zh: '自定义',
      ja: 'カスタム',
      th: 'กำหนดเอง',
      ko: '사용자 지정'
    }
  },
  {
    id: 'key-onboarding-preset-manual',
    key: 'onboarding.preset_manual',
    category: 'onboarding',
    description: 'Manual preset badge label',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Manual',
      id: 'Manual',
      vi: 'Thủ công',
      zh: '手动',
      ja: '手動',
      th: 'ด้วยตนเอง',
      ko: '수동'
    }
  },
  {
    id: 'key-onboarding-preset-calculated-hint',
    key: 'onboarding.preset_calculated_hint',
    category: 'onboarding',
    description: 'Calculated preset deadline hint',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Calculated from event date ({date}). Click input to customize.',
      id: 'Dihitung dari tanggal acara ({date}). Klik input untuk menyesuaikan.',
      vi: 'Được tính từ ngày diễn ra sự kiện ({date}). Nhấp vào ô nhập để tùy chỉnh.',
      zh: '根据活动日期 ({date}) 计算。点击输入框可自定义。',
      ja: 'イベント日付 ({date}) から計算。クリックして編集。',
      th: 'คำนวณจากวันที่จัดงาน ({date}) คลิกช่องกรอกเพื่อปรับแต่ง',
      ko: '행사 날짜({date}) 기준으로 계산됨. 사용자 지정하려면 클릭하세요.'
    }
  },
  {
    id: 'key-onboarding-err-dl-start',
    key: 'onboarding.err_deadline_before_start',
    category: 'onboarding',
    description: 'Error when deadline is earlier than start time',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Upload deadline cannot be earlier than upload start time.',
      id: 'Batas akhir unggah tidak boleh lebih awal dari waktu mulai unggah.',
      vi: 'Hạn chót tải lên không thể sớm hơn thời gian bắt đầu tải lên.',
      zh: '上传截止时间不能早于上传开始时间。',
      ja: 'アップロード締切日時は開始日時より前に設定できません。',
      th: 'กำหนดเวลาสิ้นสุดการอัปโหลดต้องไม่เร็วกว่าเวลาเริ่มต้น',
      ko: '업로드 마감 시간은 업로드 시작 시간보다 빠를 수 없습니다.'
    }
  },
  {
    id: 'key-onboarding-err-name-req',
    key: 'onboarding.err_name_required',
    category: 'onboarding',
    description: 'Error when capsule name is empty',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Please enter a name for your memory capsule.',
      id: 'Harap masukkan nama untuk kapsul kenangan Anda.',
      vi: 'Vui lòng nhập tên cho capsule kỷ niệm của bạn.',
      zh: '请为您的记忆胶囊输入名称。',
      ja: 'メモリカプセルの名前を入力してください。',
      th: 'กรุณากรอกชื่อสำหรับแคปซูลความทรงจำของคุณ',
      ko: '메모리 캡슐의 이름을 입력해 주세요.'
    }
  },
  {
    id: 'key-onboarding-event-date-ref',
    key: 'onboarding.event_date_ref',
    category: 'onboarding',
    description: 'Reference event date indicator label',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Event Date: {date}',
      id: 'Tanggal Acara: {date}',
      vi: 'Ngày sự kiện: {date}',
      zh: '活动日期：{date}',
      ja: 'イベント日: {date}',
      th: 'วันที่จัดงาน: {date}',
      ko: '행사 날짜: {date}'
    }
  },
  {
    id: 'key-onboarding-default-event-name',
    key: 'onboarding.default_event_name',
    category: 'onboarding',
    description: 'Fallback celebration name',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Your celebration',
      id: 'Perayaan Anda',
      vi: 'Buổi lễ của bạn',
      zh: '您的庆祝活动',
      ja: 'あなたのお祝い',
      th: 'งานเฉลิมฉลองของคุณ',
      ko: '귀하의 축하 행사'
    }
  },
  {
    id: 'key-onboarding-preset-alt',
    key: 'onboarding.preset_alt',
    category: 'onboarding',
    description: 'Alt text for preset cover image',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Preset {index}',
      id: 'Preset {index}',
      vi: 'Mẫu {index}',
      zh: '预设 {index}',
      ja: 'プリセット {index}',
      th: 'เทมเพลต {index}',
      ko: '프리셋 {index}'
    }
  },

  // --- TOOLTIPS ---
  {
    id: 'key-tooltip-1',
    key: 'tooltip.qr_help',
    category: 'tooltips',
    description: 'QR code scanning help tooltip text',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Guests scan this QR code with any smartphone camera to drop photos instantly.',
      id: 'Tamu memindai kode QR ini dengan kamera ponsel untuk mengunggah foto secara instan.',
      vi: 'Khách hàng quét mã QR này bằng camera điện thoại để gửi ảnh tức thì.',
      zh: '宾客通过手机相机扫描此二维码即可立即发送照片。',
      ja: 'ゲストはスマートフォンカメラでこのQRコードを読み取るだけで、その場で写真を投稿できます。',
      th: 'แขกสแกน QR Code นี้ด้วยกล้องสมาร์ทโฟนเพื่อส่งรูปถ่ายได้ทันที',
      ko: '게스트는 스마트폰 카메라로 QR 코드를 스캔하여 즉시 사진을 전송할 수 있습니다.'
    }
  },

  // --- NOTIFICATIONS & EMAILS ---
  {
    id: 'key-notif-1',
    key: 'notif.saved_success',
    category: 'notifications',
    description: 'Success toast text after saving',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'Changes saved successfully across all devices.',
      id: 'Perubahan berhasil disimpan di semua perangkat.',
      vi: 'Đã lưu thay đổi thành công trên tất cả thiết bị.',
      zh: '更改已在所有设备上成功保存。',
      ja: 'すべてのデバイスで変更が正常に保存されました。',
      th: 'บันทึกการเปลี่ยนแปลงสำเร็จเรียบร้อยแล้วในทุกอุปกรณ์',
      ko: '모든 기기에서 변경 사항이 성공적으로 저장되었습니다.'
    }
  },
  {
    id: 'key-email-1',
    key: 'emails.invite_heading',
    category: 'emails',
    description: 'Email invitation main heading',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      en: 'You are invited to contribute memories!',
      id: 'Anda diundang untuk membagikan kenangan!',
      vi: 'Bạn được mời đóng góp ký ức!',
      zh: '诚挚邀请您分享精彩回忆！',
      ja: '思い出の共有に招待されました！',
      th: 'คุณได้รับเชิญให้ร่วมแบ่งปันความทรงจำ!',
      ko: '소중한 추억을 함께 공유하도록 초대되었습니다!'
    }
  },
  {
    id: 'key-gen-200',
    key: 'nav.how_it_works',
    category: 'nav',
    description: 'nav.how_it_works landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "How It Works",
      "id": "Cara Kerja",
      "vi": "Cách hoạt động",
      "zh": "工作原理",
      "ja": "使い方",
      "th": "วิธีใช้งาน",
      "ko": "작동 방식"
}
  },
  {
    id: 'key-gen-201',
    key: 'nav.capsule_types',
    category: 'nav',
    description: 'nav.capsule_types landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Capsule Types",
      "id": "Tipe Kapsul",
      "vi": "Loại viên nén",
      "zh": "胶囊类型",
      "ja": "カプセルタイプ",
      "th": "ประเภทแคปซูล",
      "ko": "캡슐 유형"
}
  },
  {
    id: 'key-gen-202',
    key: 'nav.pricing',
    category: 'nav',
    description: 'nav.pricing landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Pricing",
      "id": "Harga",
      "vi": "Bảng giá",
      "zh": "价格",
      "ja": "料金",
      "th": "ราคา",
      "ko": "요금"
}
  },
  {
    id: 'key-gen-203',
    key: 'nav.resources',
    category: 'nav',
    description: 'nav.resources landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Resources",
      "id": "Sumber Daya",
      "vi": "Tài nguyên",
      "zh": "资源",
      "ja": "リソース",
      "th": "ทรัพยากร",
      "ko": "리소스"
}
  },
  {
    id: 'key-gen-204',
    key: 'nav.contact_support',
    category: 'nav',
    description: 'nav.contact_support landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Support",
      "id": "Bantuan",
      "vi": "Hỗ trợ",
      "zh": "支持",
      "ja": "サポート",
      "th": "สนับสนุน",
      "ko": "지원"
}
  },
  {
    id: 'key-gen-205',
    key: 'nav.create_capsule',
    category: 'nav',
    description: 'nav.create_capsule landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Create Capsule",
      "id": "Buat Kapsul",
      "vi": "Tạo viên nén",
      "zh": "创建胶囊",
      "ja": "カプセルを作成",
      "th": "สร้างแคปซูล",
      "ko": "캡슐 만들기"
}
  },
  {
    id: 'key-gen-206',
    key: 'nav.create',
    category: 'nav',
    description: 'nav.create landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Create",
      "id": "Buat",
      "vi": "Tạo",
      "zh": "创建",
      "ja": "作成",
      "th": "สร้าง",
      "ko": "만들기"
}
  },
  {
    id: 'key-gen-207',
    key: 'nav.explore_demo',
    category: 'nav',
    description: 'nav.explore_demo landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Explore Demo",
      "id": "Jelajahi Demo",
      "vi": "Khám phá Demo",
      "zh": "探索演示",
      "ja": "デモを見る",
      "th": "ลองเดโม",
      "ko": "เดโม 체험"
}
  },
  {
    id: 'key-gen-208',
    key: 'auth.signin_nav',
    category: 'auth',
    description: 'auth.signin_nav landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Log In",
      "id": "Masuk",
      "vi": "Đăng nhập",
      "zh": "登录",
      "ja": "ログイン",
      "th": "เข้าสู่ระบบ",
      "ko": "로그인"
}
  },
  {
    id: 'key-gen-209',
    key: 'hero.badge',
    category: 'hero',
    description: 'hero.badge landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Preserving moments as they happen. Introducing KAVA 2026.",
      "id": "Merekam momen saat terjadi. Memperkenalkan KAVA 2026.",
      "vi": "Lưu giữ khoảnh khắc ngay khi diễn ra. Giới thiệu KAVA 2026.",
      "zh": "记录发生的每一个瞬间。为您呈现 KAVA 2026。",
      "ja": "瞬間の思い出をそのまま保存。KAVA 2026 登場。",
      "th": "บันทึกทุกช่วงเวลาสำคัญ แนะนำ KAVA 2026",
      "ko": "순간의 추억을 그대로 보존합니다. KAVA 2026을 소개합니다."
}
  },
  {
    id: 'key-gen-210',
    key: 'hero.title_line1',
    category: 'hero',
    description: 'hero.title_line1 landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "We don’t just store files.",
      "id": "Kami tidak sekadar menyimpan file.",
      "vi": "Chúng tôi không chỉ lưu trữ tệp.",
      "zh": "我们不仅仅是存储文件。",
      "ja": "単にファイルを保存するだけではありません。",
      "th": "เราไม่ได้เป็นเพียงที่เก็บไฟล์",
      "ko": "단순히 파일을 저장하는 것이 아닙니다."
}
  },
  {
    id: 'key-gen-211',
    key: 'hero.title_line2',
    category: 'hero',
    description: 'hero.title_line2 landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "We preserve lifetime memories.",
      "id": "Kami mengabadikan kenangan seumur hidup.",
      "vi": "Chúng tôi lưu giữ ký ức đời người.",
      "zh": "我们珍惜保存您一生的记忆。",
      "ja": "生涯の思い出を永久に保存します。",
      "th": "เราบันทึกความทรงจำตลอดชีวิตของคุณ",
      "ko": "평생의 추억을 간직합니다."
}
  },
  {
    id: 'key-gen-212',
    key: 'hero.subtitle',
    category: 'hero',
    description: 'hero.subtitle landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "KAVA brings wedding guests, family circles, and event communities together inside one real-time memory capsule with instant QR access.",
      "id": "KAVA menyatukan tamu pernikahan, lingkaran keluarga, dan komunitas acara dalam satu kapsul kenangan real-time dengan akses QR instan.",
      "vi": "KAVA kết nối khách mời đám cưới, gia đình và cộng đồng sự kiện trong một viên nén ký ức thời gian thực bằng truy cập QR tức thì.",
      "zh": "KAVA 通过即时 QR 码访问，将婚礼宾客、家庭圈和活动社区聚集在一个实时记忆胶囊中。",
      "ja": "KAVAは結婚式のゲストや家族、イベントのコミュニティをQRアクセスによるリアルタイムのタイムカプセルに集結させます。",
      "th": "KAVA รวบรวมแขกผู้มีเกียรติ ครอบครัว และผู้มาร่วมงานไว้ในแคปซูลความทรงจำแบบเรียลไทม์ด้วย QR สแกนทันที",
      "ko": "KAVA는 간편한 QR 스캔으로 결혼식 하객, 가족, 이벤트 참석자들을 하나의 실시간 추억 캡슐로 연결합니다."
}
  },
  {
    id: 'key-gen-213',
    key: 'hero.guest_code_placeholder',
    category: 'hero',
    description: 'hero.guest_code_placeholder landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Enter guest code (e.g. SOFIA-LEO)",
      "id": "Masukkan kode tamu (contoh: SOFIA-LEO)",
      "vi": "Nhập mã khách (ví dụ: SOFIA-LEO)",
      "zh": "输入宾客代码 (如 SOFIA-LEO)",
      "ja": "ゲストコードを入力 (例: SOFIA-LEO)",
      "th": "กรอกรหัสแขก (เช่น SOFIA-LEO)",
      "ko": "게스트 코드 입력 (예: SOFIA-LEO)"
}
  },
  {
    id: 'key-gen-214',
    key: 'hero.join_event',
    category: 'hero',
    description: 'hero.join_event landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Join Event",
      "id": "Gabung Acara",
      "vi": "Tham gia sự kiện",
      "zh": "加入活动",
      "ja": "イベントに参加",
      "th": "เข้าร่วมงาน",
      "ko": "이벤트 참여"
}
  },
  {
    id: 'key-gen-215',
    key: 'hero.capsule_active',
    category: 'hero',
    description: 'hero.capsule_active landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Capsule Active",
      "id": "Kapsul Aktif",
      "vi": "Viên nén hoạt động",
      "zh": "胶囊运行中",
      "ja": "カプセルアクティブ",
      "th": "แคปซูลทำงานอยู่",
      "ko": "캡슐 활성화됨"
}
  },
  {
    id: 'key-gen-216',
    key: 'hero.live_contributions',
    category: 'hero',
    description: 'hero.live_contributions landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "LIVE CONTRIBUTIONS",
      "id": "KONTRIBUSI LANGSUNG",
      "vi": "ĐÓNG GÓP TRỰC TIẾP",
      "zh": "实时贡献",
      "ja": "ライブ投稿",
      "th": "การแชร์แบบเรียลไทม์",
      "ko": "실시간 참여"
}
  },
  {
    id: 'key-gen-217',
    key: 'hero.enter_live_demo',
    category: 'hero',
    description: 'hero.enter_live_demo landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Enter Live Demo",
      "id": "Masuk Demo Langsung",
      "vi": "Vào Demo trực tiếp",
      "zh": "进入实时演示",
      "ja": "ライブデモに入る",
      "th": "เข้าสู่เดโมสด",
      "ko": "실시간 데모 진입"
}
  },
  {
    id: 'key-gen-218',
    key: 'how_it_works.problem_label',
    category: 'features',
    description: 'how_it_works.problem_label landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "The Memory Crisis",
      "id": "Krisis Kenangan",
      "vi": "Khủng hoảng ký ức",
      "zh": "记忆保存危机",
      "ja": "思い出の危機",
      "th": "วิกฤตความทรงจำ",
      "ko": "추억 저장의 위기"
}
  },
  {
    id: 'key-gen-219',
    key: 'how_it_works.problem_title',
    category: 'features',
    description: 'how_it_works.problem_title landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Why traditional folders destroy human stories.",
      "id": "Mengapa folder tradisional merusak cerita manusia.",
      "vi": "Tại sao thư mục truyền thống làm mất đi câu chuyện con người.",
      "zh": "为什么传统文件夹会破坏人类的故事。",
      "ja": "なぜ従来のフォルダは感情を失わせるのか。",
      "th": "ทำไมโฟลเดอร์แบบเดิมถึงทำลายเรื่องราวที่มีความหมาย",
      "ko": "왜 전통적인 폴더 방식은 소중한 이야기를 파괴할까요?"
}
  },
  {
    id: 'key-gen-220',
    key: 'how_it_works.problem_subtitle',
    category: 'features',
    description: 'how_it_works.problem_subtitle landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Group chat compression and corporate storage links turn authentic human laughter into silent, forgotten files.",
      "id": "Kompresi chat grup dan link penyimpanan korporat mengubah tawa autentik menjadi file bisu yang terlupakan.",
      "vi": "Nén ảnh trong nhóm chat và liên kết lưu trữ làm biến mất tiếng cười thành các tệp im lặng bị lãng quên.",
      "zh": "群聊压缩和企业云盘链接将真实欢笑变成沉寂遗忘的文件。",
      "ja": "チャットアプリの画像圧縮やクラウドリンクは、感動の瞬間を忘れ去られた静寂のファイルに変えてしまいます。",
      "th": "การบีบอัดไฟล์ในแชทกลุ่มและลิงก์เก็บข้อมูลทำให้เสียงหัวเราะกลายเป็นเพียงไฟล์เงียบๆ ที่ถูกลืม",
      "ko": "단체톡방의 이미지 압축과 파일 링크는 생생한 웃음과 감동을 잊혀진 파일로 만들어 버립니다."
}
  },
  {
    id: 'key-gen-221',
    key: 'how_it_works.traditional_way',
    category: 'features',
    description: 'how_it_works.traditional_way landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Traditional Way",
      "id": "Cara Tradisional",
      "vi": "Cách truyền thống",
      "zh": "传统方式",
      "ja": "従来の方法",
      "th": "วิธีแบบเดิม",
      "ko": "기존 방식"
}
  },
  {
    id: 'key-gen-222',
    key: 'how_it_works.old_way_title',
    category: 'features',
    description: 'how_it_works.old_way_title landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "The Old Way: Cold storage",
      "id": "Cara Lama: Penyimpanan Dingin",
      "vi": "Cách cũ: Lưu trữ lạnh",
      "zh": "老方法：冷冰冰的存储",
      "ja": "従来の方法: 冷たいストレージ",
      "th": "วิธีเก่า: ที่เก็บไฟล์อันอ้างว้าง",
      "ko": "기존 방식: 차가운 파일 저장"
}
  },
  {
    id: 'key-gen-223',
    key: 'how_it_works.old_way_desc',
    category: 'features',
    description: 'how_it_works.old_way_desc landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Nameless file directories where authentic moments turn into digital dust.",
      "id": "Direktori file tanpa nama tempat momen autentik menjadi debu digital.",
      "vi": "Các thư mục tệp vô danh nơi khoảnh khắc biến thành bụi kỹ thuật số.",
      "zh": "无名文件目录，真实瞬间变成了数字尘埃。",
      "ja": "名前のないファイルフォルダで、感動の瞬間がデジタル数字の埃と化します。",
      "th": "โฟลเดอร์ไร้ชื่อที่ปล่อยให้ช่วงเวลาอันมีค่ากลายเป็นเพียงขยะดิจิทัล",
      "ko": "اسم 없는 파일 폴더에서 소중한 순간들이 디지털 먼지로 사라집니다."
}
  },
  {
    id: 'key-gen-224',
    key: 'how_it_works.old_way_bullet1',
    category: 'features',
    description: 'how_it_works.old_way_bullet1 landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Frustrating app downloads & account sign-ins",
      "id": "Unduh aplikasi & pendaftaran akun yang merepotkan",
      "vi": "Tải ứng dụng & đăng ký tài khoản phức tạp",
      "zh": "繁琐的应用下载和账号注册",
      "ja": "面倒なアプリダウンロードとアカウント登録",
      "th": "ต้องดาวน์โหลดแอปและสมัครบัญชีให้ยุ่งยาก",
      "ko": "번거로운 앱 다운로드 및 회원가입"
}
  },
  {
    id: 'key-gen-225',
    key: 'how_it_works.old_way_bullet2',
    category: 'features',
    description: 'how_it_works.old_way_bullet2 landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Cold file names devoid of laughter or written emotion",
      "id": "Nama file dingin tanpa tawa atau emosi tertulis",
      "vi": "Tên tệp lạnh lẽo không mang cảm xúc hay lời chúc",
      "zh": "冷冰冰的文件名，毫无欢笑与情感",
      "ja": "感情やメッセージのない冷たいファイル名",
      "th": "ชื่อไฟล์เย็นชาที่ไม่มีเสียงหัวเราะหรือความรู้สึก",
      "ko": "웃음과 감정이 없는 차가운 파일 이름"
}
  },
  {
    id: 'key-gen-226',
    key: 'how_it_works.old_way_bullet3',
    category: 'features',
    description: 'how_it_works.old_way_bullet3 landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Grainy compression destroys original photo & video resolution",
      "id": "Kompresi pecah merusak resolusi foto & video asli",
      "vi": "Nén làm mờ hỏng độ phân giải ảnh & video gốc",
      "zh": "模糊的压缩破坏了原始照片和视频分辨率",
      "ja": "画質劣化により元の写真や動画の解像度が破壊される",
      "th": "การบีบอัดไฟล์ทำลายความละเอียดของภาพและวิดีโอ",
      "ko": "저화질 압축으로 원본 사진과 동영상 화질 손상"
}
  },
  {
    id: 'key-gen-227',
    key: 'how_it_works.kava_standard',
    category: 'features',
    description: 'how_it_works.kava_standard landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "The KAVA Standard",
      "id": "Standar KAVA",
      "vi": "Tiêu chuẩn KAVA",
      "zh": "KAVA 标准",
      "ja": "KAVA スタンダード",
      "th": "มาตรฐาน KAVA",
      "ko": "KAVA 표준"
}
  },
  {
    id: 'key-gen-228',
    key: 'how_it_works.kava_way_title',
    category: 'features',
    description: 'how_it_works.kava_way_title landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "The KAVA Way: Active Preservation",
      "id": "Cara KAVA: Preservasi Aktif",
      "vi": "Cách KAVA: Lưu giữ sống động",
      "zh": "KAVA 方式：动态永恒保存",
      "ja": "KAVAの方式: アクティブ保存",
      "th": "วิถี KAVA: การบันทึกอย่างทรงพลัง",
      "ko": "KAVA 방식: 생생한 추억 보존"
}
  },
  {
    id: 'key-gen-229',
    key: 'how_it_works.kava_way_desc',
    category: 'features',
    description: 'how_it_works.kava_way_desc landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "An interactive memory capsule where photos, voice wishes, and heartfelt notes live together.",
      "id": "Kapsul kenangan interaktif tempat foto, ucapan suara, dan catatan hati hidup bersama.",
      "vi": "Viên nén ký ức tương tác nơi ảnh, lời chúc giọng nói và ghi chú sống cùng nhau.",
      "zh": "一个集照片、语音祝福和真挚留言于一体的互动记忆胶囊。",
      "ja": "写真、音声メッセージ、心温まる手纸が共存するインタラクティブなカプセル。",
      "th": "แคปซูลความทรงจำแบบโต้ตอบที่รวมภาพถ่าย เสียงอวยพร และข้อความซาบซึ้งไว้ด้วยกัน",
      "ko": "사진, 목소리 축하 메시지, 감동적인 편지가 함께 살아있는 인터랙ティブ 추억 캡슐."
}
  },
  {
    id: 'key-gen-230',
    key: 'how_it_works.zero_downloads',
    category: 'features',
    description: 'how_it_works.zero_downloads landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Zero Downloads",
      "id": "Tanpa Unduhan",
      "vi": "Không cần tải",
      "zh": "无需下载",
      "ja": "ダウンロード不要",
      "th": "ไม่ต้องโหลดแอป",
      "ko": "다운로드 불필요"
}
  },
  {
    id: 'key-gen-231',
    key: 'how_it_works.kava_bullet1',
    category: 'features',
    description: 'how_it_works.kava_bullet1 landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Zero download mobile web flow (iOS & Android)",
      "id": "Alur web seluler tanpa unduhan (iOS & Android)",
      "vi": "Quy trình web di động không cần tải (iOS & Android)",
      "zh": "无需下载的移动网页体验 (iOS & Android)",
      "ja": "アプリ不要のモバイルWebフロー (iOS & Android)",
      "th": "ใช้งานผ่านเว็บมือถือได้ทันที ไม่ต้องโหลดแอป (iOS & Android)",
      "ko": "앱 다운로드 없는 모바일 웹 방식 (iOS 및 Android)"
}
  },
  {
    id: 'key-gen-232',
    key: 'how_it_works.kava_bullet2',
    category: 'features',
    description: 'how_it_works.kava_bullet2 landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Photos, HD Videos, Spoken Voicemails & Heartfelt Wishes",
      "id": "Foto, Video HD, Pesan Suara & Ucapan Tulus",
      "vi": "Ảnh, Video HD, Lời nhắn giọng nói & Lời chúc",
      "zh": "照片、高清视频、语音留言与真挚祝福",
      "ja": "写真、HD動画、音声ボイスメール、心温まるメッセージ",
      "th": "ภาพถ่าย วิดีโอ HD ข้อความเสียง และคำอวยพรจากใจ",
      "ko": "사진, HD 동영상, 음성 메시지 및 따뜻한 축하 편지"
}
  },
  {
    id: 'key-gen-233',
    key: 'how_it_works.kava_bullet3',
    category: 'features',
    description: 'how_it_works.kava_bullet3 landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Live venue screen presentation for TVs and Projectors",
      "id": "Presentasi layar lokasi langsung untuk TV & Proyektor",
      "vi": "Trình chiếu màn hình sự kiện cho TV & Máy chiếu",
      "zh": "适用于电视和投影仪的现场大屏展示",
      "ja": "TVやプロジェクター用のライブ会場スクリーン表示",
      "th": "ฉายขึ้นจอทีวีและโปรเจกเตอร์ในงานได้แบบเรียลไทม์",
      "ko": "TV 및 프로젝터용 실시간 라이브 스크린 연동"
}
  },
  {
    id: 'key-gen-234',
    key: 'how_it_works.see_live_demo',
    category: 'features',
    description: 'how_it_works.see_live_demo landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "See Live Demo",
      "id": "Lihat Demo Langsung",
      "vi": "Xem Demo trực tiếp",
      "zh": "查看实时演示",
      "ja": "ライブデモを見る",
      "th": "ชมเดโมสด",
      "ko": "실시간 데โม 보기"
}
  },
  {
    id: 'key-gen-235',
    key: 'how_it_works.blueprint_label',
    category: 'features',
    description: 'how_it_works.blueprint_label landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "THE GUEST BLUEPRINT",
      "id": "PANDUAN TAMU",
      "vi": "HƯỚNG DẪN KHÁCH",
      "zh": "宾客使用指南",
      "ja": "ゲストガイド",
      "th": "ขั้นตอนสำหรับแขก",
      "ko": "게스트 이용 안내"
}
  },
  {
    id: 'key-gen-236',
    key: 'how_it_works.blueprint_title',
    category: 'features',
    description: 'how_it_works.blueprint_title landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "How simple it actually is.",
      "id": "Betapa mudahnya ini.",
      "vi": "Đơn giản đến mức kinh ngạc.",
      "zh": "使用竟是如此简单。",
      "ja": "実にシンプルな使い方。",
      "th": "ง่ายดายอย่างแท้จริง",
      "ko": "얼마나 간단한지 확인해보세요."
}
  },
  {
    id: 'key-gen-237',
    key: 'how_it_works.blueprint_desc',
    category: 'features',
    description: 'how_it_works.blueprint_desc landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Three effortless steps from venue setup to preserving raw memories forever.",
      "id": "Tiga langkah mudah dari pengaturan lokasi hingga mengabadikan kenangan selamanya.",
      "vi": "Ba bước dễ dàng từ chuẩn bị sự kiện đến lưu giữ ký ức mãi mãi.",
      "zh": "从场馆设置到永久保存原汁原味记忆，只需轻松三步。",
      "ja": "会場の準備から永久保存まで、わずか3つのステップ。",
      "th": "เพียง 3 ขั้นตอนง่ายๆ จากการเตรียมงานสู่การบันทึกความทรงจำตลอดกาล",
      "ko": "장소 준비부터 추억의 영구 보존까지 단 3단계."
}
  },
  {
    id: 'key-gen-238',
    key: 'how_it_works.step1_title',
    category: 'features',
    description: 'how_it_works.step1_title landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Host Creates Capsule",
      "id": "Tuan Rumah Membuat Kapsul",
      "vi": "Chủ nhà tạo viên nén",
      "zh": "主办方创建胶囊",
      "ja": "ホストがカプセルを作成",
      "th": "เจ้าภาพสร้างแคปซูล",
      "ko": "호스트의 캡슐 생성"
}
  },
  {
    id: 'key-gen-239',
    key: 'how_it_works.step1_desc',
    category: 'features',
    description: 'how_it_works.step1_desc landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Set up your event in 60 seconds and generate your custom venue QR poster.",
      "id": "Atur acara Anda dalam 60 detik dan buat poster QR lokasi kustom Anda.",
      "vi": "Thiết lập sự kiện trong 60 giây và tạo áp phích QR sự kiện tùy chỉnh.",
      "zh": "在 60 秒内设置您的活动并生成专属的大厅 QR 海报。",
      "ja": "60秒でイベントを設定し、専用のQRポスターを生成。",
      "th": "ตั้งค่างานใน 60 วินาที พร้อมสร้างโปสเตอร์ QR สำหรับตั้งในงาน",
      "ko": "60초 만에 이벤트를 설정하고 맞춤형 QR 포스터를 생성합니다."
}
  },
  {
    id: 'key-gen-240',
    key: 'how_it_works.step2_title',
    category: 'features',
    description: 'how_it_works.step2_title landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Guests Scan & Contribute",
      "id": "Tamu Pindai & Berkontribusi",
      "vi": "Khách quét QR & chia sẻ",
      "zh": "宾客扫码并分享",
      "ja": "ゲストがQRをスキャンして投稿",
      "th": "แขกสแกนและร่วมแชร์",
      "ko": "게스트의 스캔 및 사진 공유"
}
  },
  {
    id: 'key-gen-241',
    key: 'how_it_works.step2_desc',
    category: 'features',
    description: 'how_it_works.step2_desc landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Guests point their phone camera, take photos, or speak voice wishes with zero app downloads.",
      "id": "Tamu mengarahkan kamera HP, mengambil foto, atau merekam suara tanpa unduh aplikasi.",
      "vi": "Khách chỉ cần giơ máy ảnh, chụp hình hoặc gửi lời chúc giọng nói mà không cần tải ứng dụng.",
      "zh": "宾客只需对准手机摄像头，即可拍照或录制语音祝福，无需下载任何应用。",
      "ja": "スマホのカメラをかざすだけで、アプリ不要で写真や音声メッセージを投稿。",
      "th": "แขกเพียงใช้กล้องมือถือสแกน ถ่ายภาพ หรืออัดเสียงอวยพรได้ทันทีโดยไม่ต้องโหลดแอป",
      "ko": "하객들은 스마트폰 카메라를 비추기만 하면 앱 없이 사진과 음성 메시지를 업로드합니다."
}
  },
  {
    id: 'key-gen-242',
    key: 'how_it_works.step3_title',
    category: 'features',
    description: 'how_it_works.step3_title landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Relive Forever Together",
      "id": "Kenang Bersama Selamanya",
      "vi": "Sống lại khoảnh khắc cùng nhau",
      "zh": "共同重温永恒记忆",
      "ja": "いつでも思い出を再体験",
      "th": "ย้อนความทรงจำร่วมกันตลอดไป",
      "ko": "영원히 함께 추억하기"
}
  },
  {
    id: 'key-gen-243',
    key: 'how_it_works.step3_desc',
    category: 'features',
    description: 'how_it_works.step3_desc landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Contributions appear live on venue screens and save automatically in original quality.",
      "id": "Kontribusi muncul langsung di layar lokasi dan tersimpan otomatis dalam kualitas asli.",
      "vi": "Đóng góp xuất hiện trực tiếp trên màn hình sự kiện và tự động lưu với chất lượng gốc.",
      "zh": "所有投稿均实时呈现在现场大屏幕上，并自动以原始品质保存。",
      "ja": "投稿された写真はライブ画面に即座に反映され、オリジナル高画質で自動保存されます。",
      "th": "ภาพและข้อความจะขึ้นโชว์บนหน้าจอในงานทันที และบันทึกไว้ในความละเอียดสูงสุดอัตโนมัติ",
      "ko": "공유된 사진은 현장 스크린에 즉시 노출되며 원본 화질로 자동 저장됩니다."
}
  },
  {
    id: 'key-gen-244',
    key: 'how_it_works.print_qr_stand',
    category: 'features',
    description: 'how_it_works.print_qr_stand landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Print QR Table Stand",
      "id": "Cetak Stand Tabel QR",
      "vi": "In bảng QR để bàn",
      "zh": "打印桌立式 QR 码",
      "ja": "QR卓上スタンドを印刷",
      "th": "พิมพ์ป้าย QR วางบนโต๊ะ",
      "ko": "탁상용 QR 스탠드 인쇄"
}
  },
  {
    id: 'key-gen-245',
    key: 'how_it_works.take_photo',
    category: 'features',
    description: 'how_it_works.take_photo landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Take Photo",
      "id": "Ambil Foto",
      "vi": "Chụp ảnh",
      "zh": "拍摄照片",
      "ja": "写真を撮影",
      "th": "ถ่ายภาพ",
      "ko": "사진 촬영"
}
  },
  {
    id: 'key-gen-246',
    key: 'how_it_works.voice_wish',
    category: 'features',
    description: 'how_it_works.voice_wish landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Voice Wish",
      "id": "Ucapan Suara",
      "vi": "Lời chúc giọng nói",
      "zh": "语音祝福",
      "ja": "音声メッセージ",
      "th": "อัดเสียงอวยพร",
      "ko": "음성 메시지"
}
  },
  {
    id: 'key-gen-247',
    key: 'how_it_works.instant_upload_desc',
    category: 'features',
    description: 'how_it_works.instant_upload_desc landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Instant upload in full original resolution",
      "id": "Unggah instan dalam resolusi asli penuh",
      "vi": "Tải lên tức thì với độ phân giải gốc",
      "zh": "即时上传完整原始分辨率",
      "ja": "オリジナル解像度で即座にアップロード",
      "th": "อัปโหลดทันทีด้วยความละเอียดต้นฉบับ",
      "ko": "원본 해상도 그대로 즉시 업로드"
}
  },
  {
    id: 'key-gen-248',
    key: 'how_it_works.enter_memory_vault',
    category: 'features',
    description: 'how_it_works.enter_memory_vault landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Enter Interactive Memory Vault",
      "id": "Masuk Vault Kenangan Interaktif",
      "vi": "Vào kho lưu trữ ký ức tương tác",
      "zh": "进入互动记忆金库",
      "ja": "インタラクティブ・メモリバルトに入る",
      "th": "เข้าสู่คลังความทรงจำแบบโต้ตอบ",
      "ko": "인터랙티브 추억 금고 입장"
}
  },
  {
    id: 'key-gen-249',
    key: 'memory_types.badge',
    category: 'features',
    description: 'memory_types.badge landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "No More Silent Images",
      "id": "Tidak Ada Lagi Foto Bisu",
      "vi": "Không còn những bức ảnh im lặng",
      "zh": "告别沉寂无声的照片",
      "ja": "静寂な写真はもういらない",
      "th": "ก้าวข้ามภาพถ่ายที่ไร้เสียง",
      "ko": "더 이상 조용한 사진은 그만"
}
  },
  {
    id: 'key-gen-250',
    key: 'memory_types.title',
    category: 'features',
    description: 'memory_types.title landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Preserve the full sensory spectrum.",
      "id": "Abadikan seluruh spektrum panca indera.",
      "vi": "Lưu giữ trọn vẹn mọi cảm quan.",
      "zh": "保留全方位的感官体验。",
      "ja": "五感で感じる思い出を保存。",
      "th": "บันทึกทุกความรู้สึกอย่างสมบูรณ์แบบ",
      "ko": "모든 감각을 담아 추억을 보존합니다."
}
  },
  {
    id: 'key-gen-251',
    key: 'memory_types.desc',
    category: 'features',
    description: 'memory_types.desc landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "A wedding isn't just photos. It's the crackle of laughter, the heavy sigh of deep emotion, the written confessions of friends, and the high-energy video dancing.",
      "id": "Pernikahan bukan cuma foto. Ada gelak tawa, helaan napas emosional, ucapan jujur dari teman, dan dansa video berenergi tinggi.",
      "vi": "Đám cưới không chỉ là ảnh. Đó là tiếng cười, tiếng thở dài xúc động, lời thổ lộ của bạn bè và những điệu nhảy sôi động trong video.",
      "zh": "婚礼不仅仅是照片。它是清脆的欢笑声、深情的叹息、朋友真挚的留言，以及充满活力的现场舞蹈视频。",
      "ja": "結婚式は写真だけではありません。笑い声、感動の息遣い、 friendからの祝福の手纸、沸き立つダンス動画。",
      "th": "งานแต่งงานไม่ได้มีแค่ภาพถ่าย แต่คือเสียงหัวเราะ ห้วงอารมณ์ซาบซึ้ง คำอวยพรจากเพื่อน และวิดีโอเต้นรำสุดเหวี่ยง",
      "ko": "결혼식은 사진만이 전부가 아닙니다. 웃음소리, 깊은 감동의 한숨, 친구들의 편지, 그리고 신나는 댄스 동영상까지 모두 담깁니다."
}
  },
  {
    id: 'key-gen-252',
    key: 'memory_types.photos_title',
    category: 'features',
    description: 'memory_types.photos_title landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Photos & Polaroids",
      "id": "Foto & Polaroid",
      "vi": "Ảnh & Ảnh Polaroid",
      "zh": "照片与拍立得",
      "ja": "写真 & ポラロイド",
      "th": "ภาพถ่ายและโพลารอยด์",
      "ko": "사진 및 폴라로이드"
}
  },
  {
    id: 'key-gen-253',
    key: 'memory_types.photos_desc',
    category: 'features',
    description: 'memory_types.photos_desc landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Original quality raw pictures, without social media filters or compression.",
      "id": "Foto mentah kualitas asli, tanpa filter media sosial atau kompresi.",
      "vi": "Ảnh gốc chất lượng nguyên bản, không qua bộ lọc hay nén mạng xã hội.",
      "zh": "原始画质的真实照片，无社交媒体滤镜与压缩损耗。",
      "ja": "SNSのフィルターや画質圧縮のない、オリジナル高画質の生写真。",
      "th": "ภาพถ่ายความละเอียดต้นฉบับ ไม่ผ่านฟิลเตอร์หรือการบีบอัด",
      "ko": "소셜 미디어 필터나 압축 없는 원본 화질의 사진."
}
  },
  {
    id: 'key-gen-254',
    key: 'memory_types.videos_title',
    category: 'features',
    description: 'memory_types.videos_title landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "High-Resolution Videos",
      "id": "Video Resolusi Tinggi",
      "vi": "Video độ phân giải cao",
      "zh": "高清视频记录",
      "ja": "高解像度動画",
      "th": "วิดีโอความละเอียดสูง",
      "ko": "고해상도 동영상"
}
  },
  {
    id: 'key-gen-255',
    key: 'memory_types.videos_desc',
    category: 'features',
    description: 'memory_types.videos_desc landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Candid moments in motion. Ideal for toast snippets, sparklers, and dances.",
      "id": "Momen spontan bergerak. Sangat cocok untuk tos, kembang api, dan dansa.",
      "vi": "Khoảnh khắc tự nhiên sống động. Tuyệt vời cho lời chúc, pháo hoa và điệu nhảy.",
      "zh": "抓拍精彩动感瞬间。非常适合干杯、烟花与点燃全场的舞蹈。",
      "ja": "感動の動作や表情。乾杯のスピーチや花火、ダンスの瞬間に最適。",
      "th": "บันทึกช่วงเวลาธรรมชาติ เหมาะสำหรับช่วงชนแก้ว จุดพลุ และเต้นรำ",
      "ko": "생생한 순간의 이동. 건배사, 폭죽, 댄스 타임에 최적화."
}
  },
  {
    id: 'key-gen-256',
    key: 'memory_types.voice_title',
    category: 'features',
    description: 'memory_types.voice_title landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Spoken Voice Messages",
      "id": "Pesan Ucapan Suara",
      "vi": "Lời nhắn giọng nói",
      "zh": "语音留言祝福",
      "ja": "音声ボイスメッセージ",
      "th": "ข้อความเสียงอวยพร",
      "ko": "음성 축하 메시지"
}
  },
  {
    id: 'key-gen-257',
    key: 'memory_types.voice_desc',
    category: 'features',
    description: 'memory_types.voice_desc landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "A voicemail for the couple, recorded via the mobile browser. Kept forever.",
      "id": "Pesan suara untuk pasangan, direkam via browser seluler. Disimpan selamanya.",
      "vi": "Thư thoại gửi cặp đôi, ghi âm qua trình duyệt di động. Lưu giữ vĩnh viễn.",
      "zh": "通过手机浏览器录制的语音留言，将永远被珍藏。",
      "ja": "スマホのブラウザで録音された新郎新婦へのボイスメッセージ。永久保存。",
      "th": "ข้อความเสียงถึงคู่รัก อัดผ่านเบราว์เซอร์มือถือ เก็บไว้ตลอดไป",
      "ko": "모바일 브라우저로 녹음되는 음성 메시지. 영원히 보존됩니다."
}
  },
  {
    id: 'key-gen-258',
    key: 'memory_types.wishes_title',
    category: 'features',
    description: 'memory_types.wishes_title landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Heartfelt Wishes",
      "id": "Ucapan Tulus Hati",
      "vi": "Lời chúc từ trái tim",
      "zh": "真挚字句祝福",
      "ja": "心温まるメッセージ",
      "th": "คำอวยพรจากใจ",
      "ko": "마음을 담은 축하 편지"
}
  },
  {
    id: 'key-gen-259',
    key: 'memory_types.wishes_desc',
    category: 'features',
    description: 'memory_types.wishes_desc landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "A modern, elegant digital guestbook where friends write real long stories.",
      "id": "Buku tamu digital modern & elegan tempat teman menulis cerita berkesan.",
      "vi": "Sổ lưu niệm kỹ thuật số hiện đại nơi bạn bè viết nên những câu chuyện chân thành.",
      "zh": "现代而优雅的数字嘉宾册，在这里朋友们可以写下长长的真挚故事。",
      "ja": "友人たちが心温まるエピソードを書き込めるモダンでエレガントなデジタル芳名帳。",
      "th": "สมุดเซ็นเยี่ยมดิจิทัลดีไซน์หรูหรา ที่แขกสามารถพิมพ์ข้อความความยาวไม่จำกัด",
      "ko": "친구들이 진심 어린 이야기를 남길 수 있는 현대적이고 우아한 방명록."
}
  },
  {
    id: 'key-gen-260',
    key: 'live_wall.workspace_label',
    category: 'features',
    description: 'live_wall.workspace_label landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "LIVE EXPERIENCE WORKSPACE",
      "id": "RUANG KERJA PENGALAMAN LANGSUNG",
      "vi": "KHÔNG GIAN TRẢI NGHIỆM TRỰC TIẾP",
      "zh": "现场体验工作台",
      "ja": "ライブエクスペリエンス ワークスペース",
      "th": "พื้นที่แสดงผลประสบการณ์สด",
      "ko": "실시간 경험 워크스페이스"
}
  },
  {
    id: 'key-gen-261',
    key: 'live_wall.scan_to_contribute',
    category: 'features',
    description: 'live_wall.scan_to_contribute landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Scan to Contribute",
      "id": "Pindai untuk Berkontribusi",
      "vi": "Quét để đóng góp",
      "zh": "扫码即刻参与",
      "ja": "スキャンして投稿",
      "th": "สแกนเพื่อร่วมแชร์",
      "ko": "스캔하여 사진 공유"
}
  },
  {
    id: 'key-gen-262',
    key: 'live_wall.no_apps_needed',
    category: 'features',
    description: 'live_wall.no_apps_needed landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "No apps needed • Join SOFIA-LEO",
      "id": "Tanpa aplikasi • Gabung SOFIA-LEO",
      "vi": "Không cần tải app • Tham gia SOFIA-LEO",
      "zh": "无需下载 App • 加入 SOFIA-LEO",
      "ja": "アプリ不要 • SOFIA-LEO に参加",
      "th": "ไม่ต้องใช้แอป • เข้าร่วม SOFIA-LEO",
      "ko": "앱 설치 필요 없음 • SOFIA-LEO 참여"
}
  },
  {
    id: 'key-gen-263',
    key: 'live_wall.stage_mode',
    category: 'features',
    description: 'live_wall.stage_mode landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Live Stage Mode",
      "id": "Mode Panggung Langsung",
      "vi": "Chế độ sân khấu trực tiếp",
      "zh": "现场大屏幕模式",
      "ja": "ライブステージモード",
      "th": "โหมดหน้าจอเวทีสด",
      "ko": "실시간 무대 스크린 모드"
}
  },
  {
    id: 'key-gen-264',
    key: 'live_wall.title',
    category: 'features',
    description: 'live_wall.title landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "An interactive wall for TVs and Projectors.",
      "id": "Dinding interaktif untuk TV dan Proyektor.",
      "vi": "Màn hình tương tác cho TV và Máy chiếu.",
      "zh": "专为电视和投影仪打造的互动大屏 Wall。",
      "ja": "TVやプロジェクターのためのインタラクティブウォール。",
      "th": "จอโต้ตอบเรียลไทม์สำหรับ TV และโปรเจกเตอร์",
      "ko": "TV 및 프로젝터를 위한 인터랙티브 라이브월."
}
  },
  {
    id: 'key-gen-265',
    key: 'live_wall.desc',
    category: 'features',
    description: 'live_wall.desc landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Open the Live Screen on any smart TV or projector during your wedding or birthday. Watch guest photos and heartwarming messages fill the room in real-time, sparking conversation and warmth among the crowd.",
      "id": "Buka Layar Langsung di TV pintar atau proyektor selama pernikahan atau ulang tahun Anda. Saksikan foto tamu dan pesan hangat memenuhi ruangan secara real-time.",
      "vi": "Mở Màn hình trực tiếp trên bất kỳ Smart TV hoặc máy chiếu nào trong đám cưới hay sinh nhật. Ngắm nhìn ảnh khách và lời chúc ngập tràn không gian.",
      "zh": "在婚礼或生日期间在 Smart TV 或投影仪上打开 Live Screen。看着宾客的照片和温馨留言实时填满房间，点燃全场气氛。",
      "ja": "結婚式や誕生日会でスマートTVやプロジェクターにライブ画面を表示。ゲストの写真や心温まるメッセージがリアルタイムで会場を彩ります。",
      "th": "เปิดหน้าจอสดบนสมาร์ททีวีหรือโปรเจกเตอร์ระหว่างงาน ดูรูปภาพและคำอวยพรของแขกไหลขึ้นจอแบบเรียลไทม์",
      "ko": "결혼식이나 생일 파티 중 스마트 TV나 프로젝터에 라이브 스크린을 띄워보세요. 하객들의 사진과 따뜻한 메시지가 실시간으로 화면을 채웁니다."
}
  },
  {
    id: 'key-gen-266',
    key: 'live_wall.wish_wall_label',
    category: 'features',
    description: 'live_wall.wish_wall_label landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Wish Wall:",
      "id": "Dinding Ucapan:",
      "vi": "Màn hình lời chúc:",
      "zh": "祝福墙：",
      "ja": "ウィッシュウォール:",
      "th": "กระดานคำอวยพร:",
      "ko": "축하 메시지 월:"
}
  },
  {
    id: 'key-gen-267',
    key: 'live_wall.wish_wall_desc',
    category: 'features',
    description: 'live_wall.wish_wall_desc landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Alternates rotating wishes with stunning guest captures.",
      "id": "Bergantian menayangkan ucapan dan tangkapan foto tamu yang memukau.",
      "vi": "Luân phiên hiển thị lời chúc và hình ảnh đẹp từ khách.",
      "zh": "轮播精彩的宾客照片与感动人心的祝福。",
      "ja": "ゲストの素晴らしい写真と感動のメッセージを交互に表示。",
      "th": "สลับแสดงคำอวยพรและรูปถ่ายสวยๆ จากแขกในงาน",
      "ko": "하객들의 멋진 사진과 감동적인 축하 글을 순차적으로 전환 연출."
}
  },
  {
    id: 'key-gen-268',
    key: 'live_wall.qr_overlay_label',
    category: 'features',
    description: 'live_wall.qr_overlay_label landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Live QR Join Overlay:",
      "id": "Overlay QR Gabung Langsung:",
      "vi": "Lớp phủ QR tham gia trực tiếp:",
      "zh": "扫码加入 QR 浮层：",
      "ja": "ライブQR参加オーバーレイ:",
      "th": "ป้าย QR สำหรับสแกนร่วมงาน:",
      "ko": "실시간 QR 참여 오버레이:"
}
  },
  {
    id: 'key-gen-269',
    key: 'live_wall.qr_overlay_desc',
    category: 'features',
    description: 'live_wall.qr_overlay_desc landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Always keeps the QR code readable and docked.",
      "id": "Selalu menampilkan kode QR yang mudah dipindai di sudut layar.",
      "vi": "Luôn giữ mã QR rõ ràng ở góc màn hình.",
      "zh": "将 QR 码固定悬浮在大屏一角，方便随时扫码。",
      "ja": "画面の隅に常に読み取りやすいQRコードを表示。",
      "th": "แสดง QR Code ค้างไว้ที่มุมจอให้แขกสแกนได้ตลอดเวลา",
      "ko": "스크린 한구석에 항상 스캔 가능한 QR 코드를 유지."
}
  },
  {
    id: 'key-gen-270',
    key: 'live_wall.host_moderation_label',
    category: 'features',
    description: 'live_wall.host_moderation_label landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Host Moderation:",
      "id": "Moderasi Tuan Rumah:",
      "vi": "Kiểm duyệt chủ nhà:",
      "zh": "主办方审核控制：",
      "ja": "ホストモデレーション:",
      "th": "ระบบคัดกรองโดยเจ้าภาพ:",
      "ko": "호스트의 승인/검수:"
}
  },
  {
    id: 'key-gen-271',
    key: 'live_wall.host_moderation_desc',
    category: 'features',
    description: 'live_wall.host_moderation_desc landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Approve memories from your phone before they hit the big screen.",
      "id": "Setujui foto/pesan dari HP Anda sebelum tampil di layar besar.",
      "vi": "Duyệt ảnh/lời chúc từ điện thoại trước khi chiếu lên màn hình lớn.",
      "zh": "在投屏到大屏幕之前，直接在手机上审核并批准内容。",
      "ja": "大画面に表示される前に、スマホで内容を確認・承認可能。",
      "th": "อนุมัติภาพและข้อความผ่านมือถือของคุณก่อนแสดงขึ้นจอใหญ่",
      "ko": "대형 스크린에 노출되기 전 스마트폰으로 사진을 사전에 승인."
}
  },
  {
    id: 'key-gen-272',
    key: 'live_wall.launch_demo',
    category: 'features',
    description: 'live_wall.launch_demo landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Launch Live Experience Demo",
      "id": "Mulai Demo Pengalaman Langsung",
      "vi": "Mở Demo trải nghiệm trực tiếp",
      "zh": "启动现场体验演示",
      "ja": "ライブエクスペリエンスデモを起動",
      "th": "เปิดเดโมประสบการณ์สด",
      "ko": "실시간 라이브 체험 데모 실행"
}
  },
  {
    id: 'key-gen-273',
    key: 'features.section_label',
    category: 'features',
    description: 'features.section_label landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Fine Crafted Features",
      "id": "Fitur Dirancang Halus",
      "vi": "Tính năng được chế tác tinh xảo",
      "zh": "精心打造的卓越功能",
      "ja": "洗練された機能",
      "th": "ฟีเจอร์ระดับพรีเมียม",
      "ko": "섬세하게 설계된 기능"
}
  },
  {
    id: 'key-gen-274',
    key: 'features.section_title',
    category: 'features',
    description: 'features.section_title landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Everything is built premium.",
      "id": "Semuanya dibuat berkualitas premium.",
      "vi": "Tất cả đều được xây dựng cao cấp.",
      "zh": "一切皆为高端体验而生。",
      "ja": "すべての機能がプレミアムに設計。",
      "th": "ทุกอย่างถูกสร้างขึ้นอย่างประณีต",
      "ko": "모든 기능이 프리미엄으로 완성되었습니다."
}
  },
  {
    id: 'key-gen-275',
    key: 'features.moderation_title',
    category: 'features',
    description: 'features.moderation_title landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Full Moderation Control",
      "id": "Kontrol Moderasi Penuh",
      "vi": "Quyền kiểm duyệt hoàn toàn",
      "zh": "全方位的审核控制",
      "ja": "完全なモデレーション機能",
      "th": "ระบบคัดกรองเนื้อหาเต็มรูปแบบ",
      "ko": "완벽한 콘텐츠 승인 및 관리"
}
  },
  {
    id: 'key-gen-276',
    key: 'features.moderation_desc',
    category: 'features',
    description: 'features.moderation_desc landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Approve or reject guest photos, messages, and voice recordings on the fly from your host phone before showing them on the TV projector wall.",
      "id": "Setujui atau tolak foto, pesan, dan rekaman suara tamu dari HP Anda sebelum tampil di TV proyektor.",
      "vi": "Chấp nhận hoặc từ chối ảnh, tin nhắn và ghi âm giọng nói của khách ngay trên điện thoại chủ nhà.",
      "zh": "在电视投影墙播放前，可在主办方手机上即时批准或拒绝宾客的照片、留言和语音。",
      "ja": "TVプロジェクターに表示される前に、ホストのスマホから写真やメッセージを承認・削除可能。",
      "th": "อนุมัติหรือปฏิเสธรูปภาพ ข้อความ และเสียงอวยพรได้ทันทีจากมือถือของคุณ",
      "ko": "TV 및 프로젝터 화면 노출 전 호스트의 스마트폰에서 사진, 메시지, 음성을 즉시 승인/거절."
}
  },
  {
    id: 'key-gen-277',
    key: 'features.downloads_title',
    category: 'features',
    description: 'features.downloads_title landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Original Quality Downloads",
      "id": "Unduhan Kualitas Asli",
      "vi": "Tải xuống chất lượng gốc",
      "zh": "原始无损画质下载",
      "ja": "オリジナル高画質ダウンロード",
      "th": "ดาวน์โหลดไฟล์ความละเอียดต้นฉบับ",
      "ko": "원본 화질 그대로 다운로드"
}
  },
  {
    id: 'key-gen-278',
    key: 'features.downloads_desc',
    category: 'features',
    description: 'features.downloads_desc landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "No downscaled images. Download your entire Memory Capsule in original uncompressed, high-fidelity files anytime in one massive ZIP archive.",
      "id": "Tanpa kompresi pecah. Unduh seluruh Kapsul Kenangan Anda dalam file berkualitas tinggi kapan saja dalam satu arsip ZIP.",
      "vi": "Không giảm chất lượng ảnh. Tải xuống toàn bộ Viên nén ký ức dưới dạng tệp nén ZIP gốc bất kỳ lúc nào.",
      "zh": "拒绝无故压缩。随时可以通过一个大型 ZIP 压缩包下载整个记忆胶囊中的无损原始文件。",
      "ja": "画質低下なし。タイムカプセル全体のファイルを無圧縮のまま1つのZIPアーカイブで一括ダウンロード可能。",
      "th": "ภาพไม่ถูกบีบอัด ดาวน์โหลดคลังความทรงจำทั้งหมดเป็นไฟล์ ZIP ความละเอียดสูงได้ทุกเมื่อ",
      "ko": "화질 저하 없음. 추억 캡슐 전체를 무압축 원본 화质의 대용量 ZIP 파일로 언제든 일괄 다운로드."
}
  },
  {
    id: 'key-gen-279',
    key: 'features.poster_title',
    category: 'features',
    description: 'features.poster_title landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Automatic Custom Poster",
      "id": "Poster Kustom Otomatis",
      "vi": "Tự động tạo áp phích tùy chỉnh",
      "zh": "自动生成专属台卡海报",
      "ja": "自動カスタムポスター作成",
      "th": "สร้างโปสเตอร์ QR อัตโนมัติ",
      "ko": "자동 맞춤형 포สเตอร์ 생성"
}
  },
  {
    id: 'key-gen-280',
    key: 'features.poster_desc',
    category: 'features',
    description: 'features.poster_desc landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Instantly download ready-to-print luxury tabletop posters embedded with your Capsule's unique QR code, styled for minimal wedding tables.",
      "id": "Unduh langsung poster meja mewah siap cetak yang dilengkapi kode QR unik Kapsul Anda.",
      "vi": "Tải xuống ngay áp phích để bàn sang trọng có gắn mã QR độc bản của Viên nén ký ức.",
      "zh": "即刻下载印有胶囊专属 QR 码的高端桌面海报，完美融入简约高雅的婚礼餐桌。",
      "ja": "カプセル固有のQRコードが埋め込まれた、印刷可能な高品質卓上ポスターを即座にダウンロード。",
      "th": "ดาวน์โหลดโปสเตอร์ตั้งโต๊ะดีไซน์หรูหราพร้อม QR Code ของงาน สำหรับวางบนโต๊ะอาหารได้ทันที",
      "ko": "캡슐 고유 QR 코드가 적용된 고품격 탁상용 인쇄 포스터를 즉시 다운로드."
}
  },
  {
    id: 'key-gen-281',
    key: 'testimonials.badge',
    category: 'common',
    description: 'testimonials.badge landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Host Stories",
      "id": "Kisah Tuan Rumah",
      "vi": "Câu chuyện chủ nhà",
      "zh": "主办方真实故事",
      "ja": "ホストのストーリー",
      "th": "เรื่องราวจากเจ้าภาพ",
      "ko": "호스트 실제 후기"
}
  },
  {
    id: 'key-gen-282',
    key: 'testimonials.title',
    category: 'common',
    description: 'testimonials.title landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Preserved in Their Own Words.",
      "id": "Diabadikan dalam Kata-Kata Mereka.",
      "vi": "Lưu giữ qua chính lời kể của họ.",
      "zh": "用他们自己的话语珍藏感动。",
      "ja": "彼ら自身の言葉で刻まれた記憶。",
      "th": "บันทึกจากความรู้สึกจริงของพวกเขา",
      "ko": "그들의 언어로 영원히 간직된 이야기."
}
  },
  {
    id: 'key-gen-283',
    key: 'testimonials.subtitle',
    category: 'common',
    description: 'testimonials.subtitle landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Real hosts and wedding couples share how KAVA captured candid unscripted moments seamlessly.",
      "id": "Tuan rumah dan pasangan pengantin menceritakan bagaimana KAVA menangkap momen spontan dengan sempurna.",
      "vi": "Các chủ nhà và cặp đôi chia sẻ cách KAVA ghi lại khoảnh khắc chân thực một cách mượt mà.",
      "zh": "真实的主办方与新人分享 KAVA 如何无缝捕捉现场最真挚自然的瞬间。",
      "ja": "KAVAがどのように自然で感動的な瞬間を捉えたか、実際のホストや新郎新婦の声をご紹介。",
      "th": "เจ้าภาพและคู่บ่าวสาวจริงร่วมแบ่งปันประสบการณ์ที่ KAVA ช่วยบันทึกช่วงเวลาธรรมชาติได้อย่างสมบูรณ์แบบ",
      "ko": "실제 호스트와 신랑신부들이 전하는 KAVA의 생생한 순간 포착 경험."
}
  },
  {
    id: 'key-gen-284',
    key: 'testimonials.featured_story',
    category: 'common',
    description: 'testimonials.featured_story landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Featured Story",
      "id": "Kisah Unggulan",
      "vi": "Câu chuyện nổi bật",
      "zh": "精选故事",
      "ja": "注目のストーリー",
      "th": "เรื่องราวแนะนำ",
      "ko": "주요 추천 스토리"
}
  },
  {
    id: 'key-gen-285',
    key: 'testimonials.events_hosted',
    category: 'common',
    description: 'testimonials.events_hosted landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Events Hosted",
      "id": "Acara Diselenggarakan",
      "vi": "Sự kiện đã tổ chức",
      "zh": "已举办的活动",
      "ja": "開催されたイベント",
      "th": "งานที่จัดแล้ว",
      "ko": "주최된 이벤트"
}
  },
  {
    id: 'key-gen-286',
    key: 'testimonials.photos_preserved',
    category: 'common',
    description: 'testimonials.photos_preserved landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Photos Preserved",
      "id": "Foto Diabadikan",
      "vi": "Bức ảnh được lưu giữ",
      "zh": "已保存的照片",
      "ja": "保存された写真",
      "th": "รูปภาพที่ถูกบันทึก",
      "ko": "보존된 사진"
}
  },
  {
    id: 'key-gen-287',
    key: 'testimonials.host_rating',
    category: 'common',
    description: 'testimonials.host_rating landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Host Rating",
      "id": "Penilaian Tuan Rumah",
      "vi": "Đánh giá từ chủ nhà",
      "zh": "主办方评分",
      "ja": "ホスト評価",
      "th": "คะแนนรีวิวจากเจ้าภาพ",
      "ko": "호스트 평점"
}
  },
  {
    id: 'key-gen-288',
    key: 'pricing.label',
    category: 'pricing',
    description: 'pricing.label landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Transparent Pricing",
      "id": "Harga Transparan",
      "vi": "Bảng giá minh bạch",
      "zh": "透明合理的定价",
      "ja": "明朗な料金体系",
      "th": "ราคาโปร่งใส",
      "ko": "투명한 요금제"
}
  },
  {
    id: 'key-gen-289',
    key: 'pricing.title',
    category: 'pricing',
    description: 'pricing.title landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Simple, Transparent Pricing\nfor Every Memory",
      "id": "Harga Sederhana & Transparan\nuntuk Setiap Kenangan",
      "vi": "Bảng giá đơn giản & minh bạch\ncho mọi ký ức",
      "zh": "为每一份珍贵记忆提供\n简单透明的价格方案",
      "ja": "すべての思い出に寄り添う\nシンプルで透明な料金プラン",
      "th": "ราคาง่ายๆ และโปร่งใส\nสำหรับทุกความทรงจำ",
      "ko": "모든 추억을 위한\n투명하고 합리적인 요금제"
}
  },
  {
    id: 'key-gen-290',
    key: 'pricing.subtitle',
    category: 'pricing',
    description: 'pricing.subtitle landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Zero hidden fees. Unlimited guest uploads and lifetime memory hosting included across all plans.",
      "id": "Tanpa biaya tersembunyi. Unggahan tamu tanpa batas dan hosting kenangan seumur hidup disertakan di semua paket.",
      "vi": "Không chi phí ẩn. Tải lên không giới hạn từ khách và lưu trữ ký ức trọn đời trong mọi gói.",
      "zh": "无任何隐形费用。所有方案均包含无限制宾客上传与永久记忆托管。",
      "ja": "隠れた費用は一切なし。すべてのプランでゲストの無制限アップロードと永久保存を保証。",
      "th": "ไม่มีค่าธรรมเนียมแอบแฝง อัปโหลดได้ไม่จำกัดและโฮสติ้งความทรงจำตลอดชีพรวมอยู่ในทุกแพ็กเกจ",
      "ko": "숨겨진 수수료 없음. 모든 요금제에 무제한 게스트 업로드 및 평생 추억 보존 포함."
}
  },
  {
    id: 'key-gen-291',
    key: 'pricing.promo_badge',
    category: 'pricing',
    description: 'pricing.promo_badge landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "SPECIAL PROMOTION ACTIVE",
      "id": "PROMOSI SPESIAL AKTIF",
      "vi": "KHUYẾN MÃI ĐẶC BIỆT DÀNH CHO BẠN",
      "zh": "限时特别优惠活动进行中",
      "ja": "特別プロモーション適用中",
      "th": "โปรโมชั่นพิเศษกำลังใช้งาน",
      "ko": "특별 프로โม션 적용 중"
}
  },
  {
    id: 'key-gen-292',
    key: 'pricing.use_code',
    category: 'pricing',
    description: 'pricing.use_code landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Use code",
      "id": "Gunakan kode",
      "vi": "Nhập mã",
      "zh": "使用代码",
      "ja": "コードを使用",
      "th": "ใช้โค้ด",
      "ko": "프로โม션 코드"
}
  },
  {
    id: 'key-gen-293',
    key: 'pricing.at_checkout',
    category: 'pricing',
    description: 'pricing.at_checkout landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "at checkout for instant savings!",
      "id": "saat checkout untuk diskon instan!",
      "vi": "khi thanh toán để nhận ưu đãi ngay!",
      "zh": "结账时使用即可享受即时优惠！",
      "ja": "チェックアウト時に入力で即座に割引！",
      "th": "ตอนชำระเงินเพื่อรับส่วนลดทันที!",
      "ko": "결제 시 입력하고 즉시 할인 받으세요!"
}
  },
  {
    id: 'key-gen-294',
    key: 'pricing.claim_discount',
    category: 'pricing',
    description: 'pricing.claim_discount landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Claim Discount",
      "id": "Klaim Diskon",
      "vi": "Nhận ưu đãi",
      "zh": "领取折扣",
      "ja": "割引を適用",
      "th": "รับส่วนลด",
      "ko": "할인 적용"
}
  },
  {
    id: 'key-gen-295',
    key: 'pricing.monthly',
    category: 'pricing',
    description: 'pricing.monthly landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Monthly Billing",
      "id": "Pembayaran Bulanan",
      "vi": "Thanh toán hàng tháng",
      "zh": "按月按需付费",
      "ja": "月払い",
      "th": "ชำระรายเดือน",
      "ko": "월간 결제"
}
  },
  {
    id: 'key-gen-296',
    key: 'pricing.yearly',
    category: 'pricing',
    description: 'pricing.yearly landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Yearly Billing",
      "id": "Pembayaran Tahunan",
      "vi": "Thanh toán hàng năm",
      "zh": "按年按需付费",
      "ja": "年払い",
      "th": "ชำระรายปี",
      "ko": "연간 결제"
}
  },
  {
    id: 'key-gen-297',
    key: 'pricing.get_started',
    category: 'pricing',
    description: 'pricing.get_started landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Get Started",
      "id": "Mulai Sekarang",
      "vi": "Bắt đầu ngay",
      "zh": "立即开始",
      "ja": "今すぐ始める",
      "th": "เริ่มต้นใช้งาน",
      "ko": "시작하기"
}
  },
  {
    id: 'key-gen-298',
    key: 'pricing.instant_setup_no_cc',
    category: 'pricing',
    description: 'pricing.instant_setup_no_cc landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Instant Setup • No Credit Card Required",
      "id": "Pengaturan Instan • Tanpa Kartu Kredit",
      "vi": "Thiết lập tức thì • Không cần thẻ tín dụng",
      "zh": "即时完成设置 • 无需信用卡",
      "ja": "即座にセットアップ完了 • クレジットカード不要",
      "th": "ตั้งค่าได้ทันที • ไม่ต้องใช้บัตรเครดิต",
      "ko": "즉시 설정 가능 • 신용카드 필요 없음"
}
  },
  {
    id: 'key-gen-299',
    key: 'faq.label',
    category: 'faq',
    description: 'faq.label landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Frequently Asked Questions",
      "id": "Pertanyaan yang Sering Diajukan",
      "vi": "Câu hỏi thường gặp",
      "zh": "常见问题解答",
      "ja": "よくある質問",
      "th": "คำถามที่พบบ่อย",
      "ko": "자주 묻는 질문"
}
  },
  {
    id: 'key-gen-300',
    key: 'faq.title',
    category: 'faq',
    description: 'faq.title landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Got a question?",
      "id": "Punya pertanyaan?",
      "vi": "Bạn có thắc mắc?",
      "zh": "有什么疑问吗？",
      "ja": "ご質問がありますか？",
      "th": "มีข้อสงสัยหรือไม่?",
      "ko": "궁금한 점이 있으신가요?"
}
  },
  {
    id: 'key-gen-301',
    key: 'faq.subtitle',
    category: 'faq',
    description: 'faq.subtitle landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Find answers to common questions about guest access, media quality, live display setup, and storage security.",
      "id": "Temukan jawaban atas pertanyaan umum tentang akses tamu, kualitas media, pengaturan layar langsung, dan keamanan penyimpanan.",
      "vi": "Tìm câu trả lời về truy cập của khách, chất lượng phương tiện, trình chiếu trực tiếp và bảo mật lưu trữ.",
      "zh": "查找关于宾客访问、媒体画质、大屏投屏设置和存储安全性的解答。",
      "ja": "ゲストの access、画質、ライブ画面設定、ストレージの meian 全性に関する質問の回答はこちら。",
      "th": "ค้นหาคำตอบเกี่ยวกับสิทธิ์การใช้งานของแขก ความละเอียดไฟล์ การตั้งค่าหน้าจอสด และความปลอดภัยของข้อมูล",
      "ko": "게스트 접속, 미디어 화질, 라이브 스크린 설정, 데이터 보안에 관한 질문 답변을 확인하세요."
}
  },
  {
    id: 'key-gen-302',
    key: 'faq.search_placeholder',
    category: 'faq',
    description: 'faq.search_placeholder landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Search questions (e.g. app download, voice notes, live display)...",
      "id": "Cari pertanyaan (contoh: unduh aplikasi, pesan suara, layar langsung)...",
      "vi": "Tìm kiếm câu hỏi (ví dụ: tải ứng dụng, ghi âm, màn hình trực tiếp)...",
      "zh": "搜索问题 (例如：App 下载、语音留言、现场大屏)...",
      "ja": "質問を検索 (例: アプリダウンロード、音声メッセージ、ライブ表示)...",
      "th": "ค้นหาคำถาม (เช่น โหลดแอป, ข้อความเสียง, จอแสดงผลสด)...",
      "ko": "질문 검색 (예: 앱 다운로드, 음성 메시지, 라이브 스크린)..."
}
  },
  {
    id: 'key-gen-303',
    key: 'faq.all_topics',
    category: 'faq',
    description: 'faq.all_topics landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "All Topics",
      "id": "Semua Topik",
      "vi": "Tất cả chủ đề",
      "zh": "所有主题",
      "ja": "すべてのトピック",
      "th": "ทุกหัวข้อ",
      "ko": "전체 주제"
}
  },
  {
    id: 'key-gen-304',
    key: 'faq.lang_all',
    category: 'faq',
    description: 'faq.lang_all landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Language: All",
      "id": "Bahasa: Semua",
      "vi": "Ngôn ngữ: Tất cả",
      "zh": "语言：全部",
      "ja": "言語: すべて",
      "th": "ภาษา: ทั้งหมด",
      "ko": "언어: 전체"
}
  },
  {
    id: 'key-gen-305',
    key: 'faq.no_answers',
    category: 'faq',
    description: 'faq.no_answers landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "No answers found",
      "id": "Tidak ada jawaban ditemukan",
      "vi": "Không tìm thấy câu trả lời",
      "zh": "未找到解答",
      "ja": "回答が見つかりませんでした",
      "th": "ไม่พบคำตอบ",
      "ko": "검색 결과가 없습니다"
}
  },
  {
    id: 'key-gen-306',
    key: 'faq.logged_support',
    category: 'faq',
    description: 'faq.logged_support landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Your query has been logged for our support team to create an answer soon!",
      "id": "Pertanyaan Anda telah dicatat agar tim bantuan kami membuat jawabannya segera!",
      "vi": "Thắc mắc của bạn đã được ghi nhận để đội ngũ hỗ trợ sớm trả lời!",
      "zh": "您的查询已被记录，我们的支持团队将尽快为您解答！",
      "ja": "ご質問を記録しました。サポートチームが追って回答を作成します。",
      "th": "เราได้บันทึกคำถามของคุณไว้เพื่อให้ทีมงานสร้างคำตอบเพิ่มเติมเร็วๆ นี้!",
      "ko": "문의하신 내용이 등록되었으며 담당 팀에서 조속히 답변을 안내해 드리겠습니다!"
}
  },
  {
    id: 'key-gen-307',
    key: 'faq.helpful_question',
    category: 'faq',
    description: 'faq.helpful_question landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Was this answer helpful?",
      "id": "Apakah jawaban ini membantu?",
      "vi": "Câu trả lời này có hữu ích không?",
      "zh": "这个回答对您有帮助吗？",
      "ja": "この回答は役に立ちましたか？",
      "th": "คำตอบนี้เป็นประโยชน์หรือไม่?",
      "ko": "이 답변이 도움이 되었나요?"
}
  },
  {
    id: 'key-gen-308',
    key: 'faq.yes',
    category: 'faq',
    description: 'faq.yes landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Yes",
      "id": "Ya",
      "vi": "Có",
      "zh": "有帮助",
      "ja": "はい",
      "th": "ใช่",
      "ko": "예"
}
  },
  {
    id: 'key-gen-309',
    key: 'faq.no',
    category: 'faq',
    description: 'faq.no landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "No",
      "id": "Tidak",
      "vi": "Không",
      "zh": "没帮助",
      "ja": "いいえ",
      "th": "ไม่",
      "ko": "아니오"
}
  },
  {
    id: 'key-gen-310',
    key: 'faq.thanks',
    category: 'faq',
    description: 'faq.thanks landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Thanks!",
      "id": "Terima kasih!",
      "vi": "Cảm ơn!",
      "zh": "感谢反馈！",
      "ja": "ありがとうございます！",
      "th": "ขอบคุณ!",
      "ko": "감사합니다!"
}
  },
  {
    id: 'key-gen-311',
    key: 'cta.trust_indicator',
    category: 'common',
    description: 'cta.trust_indicator landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "No app required • Free to start • Setup in under 60 seconds",
      "id": "Tanpa aplikasi • Gratis untuk mulai • Pengaturan < 60 detik",
      "vi": "Không cần tải app • Miễn phí bắt đầu • Thiết lập < 60 giây",
      "zh": "无需下载 App • 免费体验 • 60 秒内完成设置",
      "ja": "アプリ不要 • 無料で開始 • 60秒でセットアップ",
      "th": "ไม่ต้องใช้แอป • เริ่มต้นฟรี • ตั้งค่าใน 60 วินาที",
      "ko": "앱 설치 필요 없음 • 무료 시작 • 60초 이내 설정"
}
  },
  {
    id: 'key-gen-312',
    key: 'cta.headline',
    category: 'common',
    description: 'cta.headline landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Create a timeless memory capsule for your special event.",
      "id": "Buat kapsul kenangan tak lekang oleh waktu untuk acara spesial Anda.",
      "vi": "Tạo viên nén ký ức vượt thời gian cho sự kiện đặc biệt của bạn.",
      "zh": "为您的特殊盛事打造永恒的记忆胶囊。",
      "ja": "特別なイベントのために、永久保存のタイムカプセルを作成。",
      "th": "สร้างแคปซูลความทรงจำอันทรงคุณค่าสำหรับงานสำคัญของคุณ",
      "ko": "소중한 이벤트를 위한 영원한 추억 캡슐을 생성하세요."
}
  },
  {
    id: 'key-gen-313',
    key: 'cta.description',
    category: 'common',
    description: 'cta.description landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Give your wedding, graduation, or family gathering the emotional storage it deserves. Setting up takes less than 60 seconds.",
      "id": "Berikan pernikahan, kelulusan, atau reuni keluarga Anda penyimpanan emosional yang layak.",
      "vi": "Mang đến cho đám cưới, lễ tốt nghiệp hay buổi họp mặt gia đình không gian lưu giữ xứng đáng.",
      "zh": "让您的婚礼、毕业典礼或家庭聚会拥有深情感动的珍藏空间。设置只需不到 60 秒。",
      "ja": "結婚式や卒業式、家族の集まりにふさわしい思い出の保存空間を。60秒未満で準備完了。",
      "th": "มอบพื้นที่บันทึกความทรงจำอันลึกซึ้งให้กับงานแต่งงาน งานรับปริญญา หรืองานเลี้ยงครอบครัว",
      "ko": "결혼식, 졸업식, 가족 모임에 감동을 간직할 고품격 공간을 선물하세요. 설정은 60초면 충분합니다."
}
  },
  {
    id: 'key-gen-314',
    key: 'cta.primary_btn',
    category: 'common',
    description: 'cta.primary_btn landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Create Your Capsule",
      "id": "Buat Kapsul Anda",
      "vi": "Tạo viên nén của bạn",
      "zh": "创建您的专属胶囊",
      "ja": "カプセルを作成",
      "th": "สร้างแคปซูลของคุณ",
      "ko": "나만의 캡슐 만들기"
}
  },
  {
    id: 'key-gen-315',
    key: 'cta.secondary_btn',
    category: 'common',
    description: 'cta.secondary_btn landing page localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Explore Demo",
      "id": "Jelajahi Demo",
      "vi": "Khám phá Demo",
      "zh": "探索演示",
      "ja": "デモを試す",
      "th": "ลองเดโม",
      "ko": "เดโม 둘러보기"
    }
  },
  {
    id: 'key-gen-316',
    key: 'common.back_to_home',
    category: 'common',
    description: 'common.back_to_home localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Back to Home",
      "id": "Kembali ke Beranda",
      "vi": "Quay lại trang chủ",
      "zh": "返回首页",
      "ja": "ホームに戻る",
      "th": "กลับสู่หน้าหลัก",
      "ko": "홈으로 돌아가기"
    }
  },
  {
    id: 'key-gen-317',
    key: 'common.verifying',
    category: 'common',
    description: 'common.verifying localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Verifying...",
      "id": "Memverifikasi...",
      "vi": "Đang xác minh...",
      "zh": "验证中...",
      "ja": "検証中...",
      "th": "กำลังตรวจสอบ...",
      "ko": "확인 중..."
    }
  },
  {
    id: 'key-gen-318',
    key: 'megamenu.spotlight_campaign',
    category: 'megamenu',
    description: 'megamenu.spotlight_campaign localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Spotlight Campaign",
      "id": "Kampanye Sorotan",
      "vi": "Chiến dịch tiêu điểm",
      "zh": "焦点活动",
      "ja": "スポットライトキャンペーン",
      "th": "แคมเปญไฮไลท์",
      "ko": "스포트라이트 캠페인"
    }
  },
  {
    id: 'key-gen-319',
    key: 'megamenu.limited_season',
    category: 'megamenu',
    description: 'megamenu.limited_season localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Limited Season",
      "id": "Musim Terbatas",
      "vi": "Mùa giới hạn",
      "zh": "限时季",
      "ja": "期間限定",
      "th": "ซีซั่นจำกัด",
      "ko": "한정 시즌"
    }
  },
  {
    id: 'key-gen-320',
    key: 'megamenu.ends_soon',
    category: 'megamenu',
    description: 'megamenu.ends_soon localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Ends Soon",
      "id": "Segera Berakhir",
      "vi": "Sắp kết thúc",
      "zh": "即将结束",
      "ja": "まもなく終了",
      "th": "สิ้นสุดเร็วๆ นี้",
      "ko": "곧 종료"
    }
  },
  {
    id: 'key-gen-321',
    key: 'megamenu.explore_campaign',
    category: 'megamenu',
    description: 'megamenu.explore_campaign localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Explore Campaign",
      "id": "Jelajahi Kampanye",
      "vi": "Khám phá chiến dịch",
      "zh": "探索活动",
      "ja": "キャンペーンを見る",
      "th": "สำรวจแคมเปญ",
      "ko": "캠페인 탐색"
    }
  },
  {
    id: 'key-gen-322',
    key: 'hero.sample_guest_marcus',
    category: 'hero',
    description: 'hero.sample_guest_marcus localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Uncle Marcus",
      "id": "Paman Marcus",
      "vi": "Chú Marcus",
      "zh": "马库斯叔叔",
      "ja": "マーカス叔父さん",
      "th": "คุณลุงมาร์คัส",
      "ko": "마커스 삼촌"
    }
  },
  {
    id: 'key-gen-323',
    key: 'live_wall.sample_sarah',
    category: 'live_wall',
    description: 'live_wall.sample_sarah localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "- Sarah J.",
      "id": "- Sarah J.",
      "vi": "- Sarah J.",
      "zh": "- 莎拉 J.",
      "ja": "- サラ J.",
      "th": "- ซาร่าห์ J.",
      "ko": "- 사라 J."
    }
  },
  {
    id: 'key-gen-324',
    key: 'testimonials.memory_vaults_count',
    category: 'testimonials',
    description: 'testimonials.memory_vaults_count localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Host Memory Vaults ({count})",
      "id": "Kubah Kenangan Penyelenggara ({count})",
      "vi": "Kho ký ức của chủ nhà ({count})",
      "zh": "主办方记忆库 ({count})",
      "ja": "ホストメモリ保管庫 ({count})",
      "th": "คลังความทรงจำของผู้จัด ({count})",
      "ko": "호스트 추억 보관소 ({count})"
    }
  },
  {
    id: 'key-gen-325',
    key: 'pricing.special_promotion',
    category: 'pricing',
    description: 'pricing.special_promotion localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "SPECIAL PROMOTION",
      "id": "PROMOSI SPESIAL",
      "vi": "KHUYẾN MÃI ĐẶC BIỆT",
      "zh": "特别优惠",
      "ja": "特別プロモーション",
      "th": "โปรโมชั่นพิเศษ",
      "ko": "특별 프로모션"
    }
  },
  {
    id: 'key-gen-326',
    key: 'pricing.view_offer',
    category: 'pricing',
    description: 'pricing.view_offer localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "View offer",
      "id": "Lihat penawaran",
      "vi": "Xem ưu đãi",
      "zh": "查看优惠",
      "ja": "オファーを見る",
      "th": "ดูข้อเสนอ",
      "ko": "혜택 보기"
    }
  },
  {
    id: 'key-gen-327',
    key: 'pricing.save_20',
    category: 'pricing',
    description: 'pricing.save_20 localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Save 20%",
      "id": "Hemat 20%",
      "vi": "Tiết kiệm 20%",
      "zh": "省 20%",
      "ja": "20%割引",
      "th": "ประหยัด 20%",
      "ko": "20% 할인"
    }
  },
  {
    id: 'key-gen-328',
    key: 'pricing.most_popular',
    category: 'pricing',
    description: 'pricing.most_popular localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "MOST POPULAR",
      "id": "PALING POPULER",
      "vi": "PHỔ BIẾN NHẤT",
      "zh": "最受欢迎",
      "ja": "一番人気",
      "th": "ยอดนิยมที่สุด",
      "ko": "최고 인기"
    }
  },
  {
    id: 'key-gen-329',
    key: 'pricing.free',
    category: 'pricing',
    description: 'pricing.free localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "FREE",
      "id": "GRATIS",
      "vi": "MIỄN PHÍ",
      "zh": "免费",
      "ja": "無料",
      "th": "ฟรี",
      "ko": "무료"
    }
  },
  {
    id: 'key-gen-330',
    key: 'pricing.free_trial_days',
    category: 'pricing',
    description: 'pricing.free_trial_days localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "{days}-Day Free Trial Included",
      "id": "Termasuk Uji Coba Gratis {days} Hari",
      "vi": "Bao gồm dùng thử miễn phí {days} ngày",
      "zh": "包含 {days} 天免费试用",
      "ja": "{days}日間の無料トライアル付き",
      "th": "รวมทดลองใช้ฟรี {days} วัน",
      "ko": "{days}일 무료 체험 포함"
    }
  },
  {
    id: 'key-gen-331',
    key: 'footer.tagline',
    category: 'footer',
    description: 'footer.tagline localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "\"We don't store files. We preserve memories.\"",
      "id": "\"Kami tidak sekadar menyimpan file. Kami mengabadikan kenangan.\"",
      "vi": "\"Chúng tôi không chỉ lưu trữ tệp. Chúng tôi bảo tồn ký ức.\"",
      "zh": "“我们不只存储文件，我们珍藏记忆。”",
      "ja": "「ファイルを保存するのではなく、思い出を永久に残します。」",
      "th": "\"เราไม่ได้แค่เก็บไฟล์ แต่เราบันทึกความทรงจำ\"",
      "ko": "\"우리는 파일을 저장하지 않습니다. 추억을 보존합니다.\""
    }
  },
  {
    id: 'key-gen-332',
    key: 'footer.description',
    category: 'footer',
    description: 'footer.description localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "KAVA is the collaborative memory capsule platform for life's unforgettable milestones. Preserve raw, authentic moments together.",
      "id": "KAVA adalah platform kapsul kenangan kolaboratif untuk momen penting hidup Anda. Abadikan momen otentik bersama.",
      "vi": "KAVA là nền tảng viên nén ký ức cộng tác cho các cột mốc đáng nhớ. Bảo tồn các khoảnh khắc chân thực cùng nhau.",
      "zh": "KAVA 是面向人生难忘里程碑的协作记忆胶囊平台，共同珍藏真实而深沉的珍贵时刻。",
      "ja": "KAVAは人生の忘れられないマイルストーンのための思い出共有プラットフォーム。本物の瞬間をみんなで残しましょう。",
      "th": "KAVA คือแพลตฟอร์มแคปซูลความทรงจำร่วมกันสำหรับช่วงเวลาสำคัญที่ไม่เคยลืม ร่วมบันทึกความทรงจำแท้จริงไปด้วยกัน",
      "ko": "KAVA는 잊지 못할 인생의 순간을 함께 기록하는 추억 캡슐 플랫폼입니다. 소중한 순간을 함께 보존하세요."
    }
  },
  {
    id: 'key-gen-333',
    key: 'how_it_works_page.engine_label',
    category: 'how_it_works',
    description: 'how_it_works_page.engine_label localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "4-Pillar Memory Preservation Engine",
      "id": "Mesin Pelestarian Kenangan 4 Pilar",
      "vi": "Công cụ bảo tồn ký ức 4 trụ cột",
      "zh": "四维记忆珍藏引擎",
      "ja": "4つの柱による思い出保存エンジン",
      "th": "ระบบบันทึกความทรงจำ 4 เสาหลัก",
      "ko": "4대 추억 보존 엔진"
    }
  },
  {
    id: 'key-gen-334',
    key: 'how_it_works_page.hero_title',
    category: 'how_it_works',
    description: 'how_it_works_page.hero_title localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "How KAVA Preserves Raw, Unfiltered Event Memories",
      "id": "Bagaimana KAVA Melestarikan Kenangan Acara yang Murni dan Otentik",
      "vi": "Cách KAVA bảo tồn ký ức sự kiện chân thực nhất",
      "zh": "KAVA 如何完美珍藏真实无损的活动记忆",
      "ja": "KAVAがリアルで無加工な思い出を永久に残す仕組み",
      "th": "KAVA บันทึกความทรงจำอันจริงแท้ในงานของคุณอย่างไร",
      "ko": "KAVA가 가공되지 않은 소중한 이벤트 추억을 보존하는 방법"
    }
  },
  {
    id: 'key-gen-335',
    key: 'how_it_works_page.hero_desc',
    category: 'how_it_works',
    description: 'how_it_works_page.hero_desc localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "From instant guest QR code access to 60fps venue projection streams and lossless 4K vault archiving — explore the zero-friction architecture built for weddings, galas, and milestones.",
      "id": "Dari akses kode QR tamu instan hingga streaming proyeksi lokasi 60fps dan pengarsipan kubah 4K tanpa penurunan kualitas.",
      "vi": "Từ truy cập mã QR tức thì cho khách đến phát chiếu 60fps và lưu trữ kho 4K không nén.",
      "zh": "从宾客扫码即入到 60fps 现场投影及无损 4K 归档，探索专为婚礼与盛典打造的零阻碍架构。",
      "ja": "ゲストの即座QRアクセスから60fps会場プロジェクション、4K無損保存まで。",
      "th": "จากการสแกน QR Code เข้างานได้ทันที ไปจนถึงระบบสตรีมฉายบนจอ 60fps และการเก็บบันทึกไฟล์ 4K ไม่บีบอัด",
      "ko": "즉각적인 게스트 QR 코드 접속부터 60fps 대형 화면 스트리밍, 4K 무손실 보관까지."
    }
  },
  {
    id: 'key-gen-336',
    key: 'modal.support_title',
    category: 'support',
    description: 'modal.support_title localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Contact KAVA Support & Live Channels",
      "id": "Hubungi Dukungan KAVA & Saluran Langsung",
      "vi": "Liên hệ hỗ trợ KAVA & Kênh trực tiếp",
      "zh": "联系 KAVA 支持与在线通道",
      "ja": "KAVAサポート＆ライブチャネルにお問い合わせ",
      "th": "ติดต่อฝ่ายซัพพอร์ต KAVA และช่องทางไลฟ์",
      "ko": "KAVA 고객 지원 및 실시간 채널 문의"
    }
  },
  {
    id: 'key-gen-337',
    key: 'modal.support_subtitle',
    category: 'support',
    description: 'modal.support_subtitle localization',
    status: 'Published',
    version: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'System Admin',
    translations: {
      "en": "Reach our support concierge directly via your preferred channel or submit a help request ticket.",
      "id": "Hubungi concierge dukungan kami langsung melalui saluran pilihan Anda atau kirimkan tiket bantuan.",
      "vi": "Liên hệ trực tiếp với bộ phận hỗ trợ qua kênh ưa thích của bạn hoặc gửi yêu cầu hỗ trợ.",
      "zh": "通过您首选的通道直接联系我们的支持顾问，或提交帮助工单。",
      "ja": "お好みのチャネルでサポートチームに直接連絡するか、お問い合わせチケットを送信してください。",
      "th": "ติดต่อทีมงานซัพพอร์ตของเราได้โดยตรงผ่านช่องทางที่คุณสะดวก หรือส่งตั๋วแจ้งปัญหา",
      "ko": "원하시는 채널을 통해 지원 팀에 직접 문의하시거나 지원 요청 티켓을 제출해 주세요."
    }
  },
  ...DESTINATION_PAGES_TRANSLATION_KEYS,
  ...SUBPAGES_EXTRA_TRANSLATION_KEYS
];

export const STORAGE_KEY_LANG = 'kava_user_language';
export const STORAGE_KEY_TRANSLATIONS = 'kava_custom_translations';

export function detectBrowserLanguage(): SupportedLanguageCode {
  if (typeof window === 'undefined' || !navigator) return 'en';
  
  const navLangs = navigator.languages || [navigator.language || 'en'];
  for (const rawLang of navLangs) {
    const code = rawLang.toLowerCase();
    if (code.startsWith('id')) return 'id';
    if (code.startsWith('vi')) return 'vi';
    if (code.startsWith('zh')) return 'zh';
    if (code.startsWith('ja')) return 'ja';
    if (code.startsWith('th')) return 'th';
    if (code.startsWith('ko')) return 'ko';
    if (code.startsWith('en')) return 'en';
  }
  return 'en';
}

export function getStoredLanguage(): SupportedLanguageCode {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = localStorage.getItem(STORAGE_KEY_LANG);
    if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
      return saved as SupportedLanguageCode;
    }
  } catch (err) {
    console.warn('Unable to read language from localStorage:', err);
  }
  return detectBrowserLanguage();
}

export function setStoredLanguage(lang: SupportedLanguageCode): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_LANG, lang);
    window.dispatchEvent(new CustomEvent('kava_language_changed', { detail: { lang } }));
  } catch (err) {
    console.warn('Unable to save language to localStorage:', err);
  }
}

export function getStoredTranslations(): TranslationKeyItem[] {
  if (typeof window === 'undefined') return INITIAL_TRANSLATION_KEYS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TRANSLATIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge stored overrides with INITIAL_TRANSLATION_KEYS to ensure newly introduced keys are always present
        const map = new Map<string, TranslationKeyItem>();
        INITIAL_TRANSLATION_KEYS.forEach(item => map.set(item.key, item));
        parsed.forEach(item => map.set(item.key, item));
        return Array.from(map.values());
      }
    }
  } catch (err) {
    console.warn('Unable to read custom translations from localStorage:', err);
  }
  return INITIAL_TRANSLATION_KEYS;
}

export function saveStoredTranslations(items: TranslationKeyItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_TRANSLATIONS, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('kava_translations_updated', { detail: { items } }));
  } catch (err) {
    console.warn('Unable to save custom translations to localStorage:', err);
  }
}

// Global Translation Helper
export function translate(
  key: string,
  lang: SupportedLanguageCode = 'en',
  paramsOrFallback?: Record<string, string | number> | string,
  customKeys?: TranslationKeyItem[],
  extraParams?: Record<string, string | number>
): string {
  const dictionary = customKeys || getStoredTranslations();
  
  // Prefer published keys first, or fall back to any matching key
  let item = dictionary.find(i => i.key === key && i.status === 'Published');
  if (!item) {
    item = dictionary.find(i => i.key === key);
  }
  if (!item) {
    item = INITIAL_TRANSLATION_KEYS.find(i => i.key === key);
  }

  const defaultText = typeof paramsOrFallback === 'string' ? paramsOrFallback : key;
  const params = typeof paramsOrFallback === 'object' ? paramsOrFallback : extraParams;

  let result = (item?.translations && item.translations[lang]) || (item?.translations && item.translations['en']) || defaultText;

  // Variable substitution (e.g. "Hello {name}")
  if (params) {
    Object.entries(params).forEach(([pKey, pVal]) => {
      result = result.replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal));
    });
  }

  return result;
}

// Localized Formatting Helpers
export function formatDate(date: string | Date | number, lang: SupportedLanguageCode = 'en', options?: Intl.DateTimeFormatOptions): string {
  try {
    const d = new Date(date);
    const localeMap: Record<SupportedLanguageCode, string> = {
      en: 'en-US',
      id: 'id-ID',
      vi: 'vi-VN',
      zh: 'zh-CN',
      ja: 'ja-JP',
      th: 'th-TH',
      ko: 'ko-KR'
    };
    return new Intl.DateTimeFormat(localeMap[lang] || 'en-US', options || {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(d);
  } catch {
    return String(date);
  }
}

export function formatTime(date: string | Date | number, lang: SupportedLanguageCode = 'en'): string {
  try {
    const d = new Date(date);
    const localeMap: Record<SupportedLanguageCode, string> = {
      en: 'en-US',
      id: 'id-ID',
      vi: 'vi-VN',
      zh: 'zh-CN',
      ja: 'ja-JP',
      th: 'th-TH',
      ko: 'ko-KR'
    };
    return new Intl.DateTimeFormat(localeMap[lang] || 'en-US', {
      hour: 'numeric',
      minute: 'numeric'
    }).format(d);
  } catch {
    return String(date);
  }
}

export function formatNumber(num: number, lang: SupportedLanguageCode = 'en'): string {
  try {
    const localeMap: Record<SupportedLanguageCode, string> = {
      en: 'en-US',
      id: 'id-ID',
      vi: 'vi-VN',
      zh: 'zh-CN',
      ja: 'ja-JP',
      th: 'th-TH',
      ko: 'ko-KR'
    };
    return new Intl.NumberFormat(localeMap[lang] || 'en-US').format(num);
  } catch {
    return String(num);
  }
}

export function formatCurrency(amount: number, currency: string = 'USD', lang: SupportedLanguageCode = 'en'): string {
  try {
    const localeMap: Record<SupportedLanguageCode, string> = {
      en: 'en-US',
      id: 'id-ID',
      vi: 'vi-VN',
      zh: 'zh-CN',
      ja: 'ja-JP',
      th: 'th-TH',
      ko: 'ko-KR'
    };
    return new Intl.NumberFormat(localeMap[lang] || 'en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}
