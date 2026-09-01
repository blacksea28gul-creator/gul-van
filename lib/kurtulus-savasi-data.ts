export interface TimelineEvent {
  id: string;
  date: string;
  year: number;
  title: string;
  category: "kongre" | "meclis" | "savas" | "diplomasi" | "seferberlik";
  description: string;
  suggestedQuestion: string;
  quote?: string;
  keyFigure?: string;
}

export interface QuestionCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  questions: string[];
}

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: "samsun",
    date: "19 Mayıs 1919",
    year: 1919,
    title: "Samsun'a Çıkış ve Millî Mücadelenin Başlangıcı",
    category: "kongre",
    description: "Bandırma Vapuru ile Samsun'a ayak basarak Türk milletinin bağımsızlık meşalesini yaktığımız gün.",
    suggestedQuestion: "19 Mayıs 1919'da Samsun'a çıktığınızda aklınızdaki kurtuluş planı neydi?",
    quote: "Ben 1919 yılı mayısının 19'uncu günü Samsun'a çıktım. Genel durum ve görünüş şöyleydi...",
    keyFigure: "Mustafa Kemal Paşa ve Bandırma Vapuru Heyeti"
  },
  {
    id: "amasya",
    date: "22 Haziran 1919",
    year: 1919,
    title: "Amasya Genelgesi",
    category: "kongre",
    description: "Kurtuluş Savaşı'nın amacı, gerekçesi ve yönteminin tüm dünyaya ilan edildiği tarihi belge.",
    suggestedQuestion: "Amasya Genelgesi'nde 'Milletin bağımsızlığını yine milletin azim ve kararı kurtaracaktır' maddesini neden en temel ilke yaptınız?",
    quote: "Vatanın bütünlüğü, milletin bağımsızlığı tehlikededir.",
    keyFigure: "Mustafa Kemal Paşa, Rauf Bey, Refet Bey, Ali Fuat Paşa"
  },
  {
    id: "erzurum",
    date: "23 Temmuz - 7 Ağustos 1919",
    year: 1919,
    title: "Erzurum Kongresi",
    category: "kongre",
    description: "Manda ve himayenin kesinlikle reddedildiği, millî sınırlar içinde vatanın bölünmezliğinin kararlaştırıldığı kongre.",
    suggestedQuestion: "Askerlik görevinden istifa ettikten hemen sonra Erzurum Kongresi'ni nasıl yönettiniz?",
    quote: "Millî sınırlar içinde vatan bir bütündür, parçalanamaz.",
    keyFigure: "Mustafa Kemal Paşa, Kâzım Karabekir Paşa"
  },
  {
    id: "sivas",
    date: "4 - 11 Eylül 1919",
    year: 1919,
    title: "Sivas Kongresi",
    category: "kongre",
    description: "Tüm cemiyetlerin 'Anadolu ve Rumeli Müdafaa-i Hukuk Cemiyeti' çatısı altında birleştirildiği ulusal kongre.",
    suggestedQuestion: "Sivas Kongresi'nde manda isteyenlere karşı nasıl bir duruş sergilediniz?",
    quote: "Ya istiklâl ya ölüm!",
    keyFigure: "Mustafa Kemal Paşa ve Temsil Heyeti"
  },
  {
    id: "tbmm",
    date: "23 Nisan 1920",
    year: 1920,
    title: "Türkiye Büyük Millet Meclisi'nin Açılışı",
    category: "meclis",
    description: "Millet iradesinin tecelli ettiği, Ankara'da kurulan yeni Türk devletinin yönetim merkezi.",
    suggestedQuestion: "Ankara'da TBMM'yi açarken karşılaştığınız en büyük zorluklar nelerdi?",
    quote: "Hâkimiyet kayıtsız şartsız milletindir.",
    keyFigure: "TBMM Mebusları"
  },
  {
    id: "inonu1",
    date: "6 - 10 Ocak 1921",
    year: 1921,
    title: "I. İnönü Muharebesi",
    category: "savas",
    description: "Düzenli ordumuzun Batı Cephesi'nde kazandığı ilk büyük askeri ve moral zaferi.",
    suggestedQuestion: "Kuvâ-yı Milliye'den düzenli orduya geçiş sürecini ve I. İnönü Zaferi'nin önemini anlatır mısınız?",
    keyFigure: "İsmet Paşa (İnönü)"
  },
  {
    id: "inonu2",
    date: "23 Mart - 1 Nisan 1921",
    year: 1921,
    title: "II. İnönü Muharebesi",
    category: "savas",
    description: "Düşmanın taarruzunun ikinci kez kırıldığı, milletin makûs talihinin yenildiği muharebe.",
    suggestedQuestion: "İsmet Paşa'ya gönderdiğiniz 'Siz orada yalnız düşmanı değil, milletin makûs talihini de yendiniz' telgrafının hikâyesi nedir?",
    quote: "Siz orada yalnız düşmanı değil, milletin makûs talihini de yendiniz.",
    keyFigure: "İsmet Paşa"
  },
  {
    id: "tekalif",
    date: "7 - 8 Ağustos 1921",
    year: 1921,
    title: "Tekâlif-i Milliye Emirleri",
    category: "seferberlik",
    description: "Ordunun silah, cephane, giyecek ve yiyecek ihtiyacını karşılamak için milletin topyekûn seferberliği.",
    suggestedQuestion: "Tekâlif-i Milliye Emirleri'ni yayımlarken Türk milletinin fedakarlığına nasıl güvendiniz?",
    quote: "Harp yalnız iki ordunun değil, iki milletin bütün varlıklarıyla karşı karşıya gelmesidir.",
    keyFigure: "Türk Milleti ve Kadın Kahramanlarımız"
  },
  {
    id: "sakarya",
    date: "23 Ağustos - 13 Eylül 1921",
    year: 1921,
    title: "Sakarya Meydan Muharebesi",
    category: "savas",
    description: "22 gün 22 gece süren, Türk ordusunun 1683 Viyana bozgunundan beri süren geri çekilişini durduran dönüm noktası.",
    suggestedQuestion: "Sakarya'da kaburga kemikleriniz kırıkken ordunun başında verdiniz o meşhur 'Hattı müdafaa yoktur' emrinin stratejisi neydi?",
    quote: "Hattı müdafaa yoktur, sathı müdafaa vardır. O satıh bütün vatandır.",
    keyFigure: "Mustafa Kemal Paşa, Fevzi Paşa, İsmet Paşa"
  },
  {
    id: "buyuktaarruz",
    date: "26 Ağustos - 9 Eylül 1922",
    year: 1922,
    title: "Büyük Taarruz ve Başkomutanlık Meydan Muharebesi",
    category: "savas",
    description: "Afyon Kocatepe'den başlayan, Dumlupınar'da kesin zafere ulaşan ve 9 Eylül'de İzmir'de düşmanı denize döken nihai taarruz.",
    suggestedQuestion: "Büyük Taarruz öncesinde gizliliği nasıl korudunuz ve 'Ordular! İlk hedefiniz Akdeniz'dir, ileri!' emrini verirken neler hissettiniz?",
    quote: "Ordular! İlk hedefiniz Akdeniz'dir, ileri!",
    keyFigure: "Mustafa Kemal Paşa, Fevzi Paşa, İsmet Paşa ve Mehmetçik"
  },
  {
    id: "mudanya",
    date: "11 Ekim 1922",
    year: 1922,
    title: "Mudanya Ateşkes Antlaşması",
    category: "diplomasi",
    description: "Doğu Trakya, İstanbul ve Boğazlar'ın savaşsız olarak teslim alınmasını sağlayan diplomatik zafer.",
    suggestedQuestion: "Mudanya görüşmelerinde İsmet Paşa'ya verdiğiniz talimatlar ve askeri zaferin diplomasiye etkisi nasıldı?",
    keyFigure: "İsmet Paşa"
  },
  {
    id: "lozan",
    date: "24 Temmuz 1923",
    year: 1923,
    title: "Lozan Barış Antlaşması",
    category: "diplomasi",
    description: "Yeni Türk Devleti'nin bağımsızlığının ve sınırlarının tüm dünya tarafından resmen tanındığı tapu senedi.",
    suggestedQuestion: "Lozan Barış Konferansı'nda kapitülasyonlar ve tam bağımsızlık konusunda neden hiç taviz vermediniz?",
    quote: "Bu antlaşma, Türk milleti aleyhine asırlardan beri hazırlanmış büyük bir suikastın çöküşünü ifade eder.",
    keyFigure: "İsmet Paşa ve Türk Delegasyonu"
  }
];

export const QUESTION_CATEGORIES: QuestionCategory[] = [
  {
    id: "samsun-kongreler",
    name: "Samsun & Kongreler (1919)",
    icon: "Ship",
    description: "Millî Mücadele'nin ilk kıvılcımı ve milletin örgütlenmesi",
    questions: [
      "19 Mayıs 1919'da Samsun'a ayak bastığınızda halkın ve memleketin durumu nasıldı?",
      "Amasya Genelgesi'nde 'Milletin bağımsızlığını yine milletin azim ve kararı kurtaracaktır' sözüyle neyi amaçladınız?",
      "Erzurum ve Sivas Kongrelerinde manda ve himaye fikrine neden bu kadar sert karşı çıktınız?",
      "Geldikleri gibi giderler sözünü İstanbul'da düşman zırhlılarını gördüğünüzde nasıl bir inançla söylediniz?"
    ]
  },
  {
    id: "meclis-orgutlenme",
    name: "TBMM & Meclis Yönetimi (1920)",
    icon: "Building2",
    description: "Ankara'da millet iradesinin kurulması ve Sevr'in reddi",
    questions: [
      "23 Nisan 1920'de Ankara'da TBMM'yi kurarken nasıl bir yönetim hayal ediyordunuz?",
      "Sevr Antlaşması'nı imzalayanlara ve antlaşmanın şartlarına karşı TBMM'nin tepkisi ne oldu?",
      "İç isyanlar ve zorluklar karşısında Meclis birliğini nasıl sağladınız?",
      "Düzenli ordunun kurulması kararı neden ertelenemez bir zorunluluktu?"
    ]
  },
  {
    id: "cepheler-savaslar",
    name: "Savaşlar & Askeri Deha (1921-1922)",
    icon: "Swords",
    description: "İnönü, Sakarya ve Büyük Taarruz stratejileri",
    questions: [
      "Sakarya Meydan Muharebesi'ndeki 'Hattı müdafaa yoktur, sathı müdafaa vardır' emrinin askeri stratejisi nedir?",
      "Kütahya-Eskişehir muharebeleri sonrasında ordumuzu Sakarya'nın doğusuna çekme kararını nasıl aldınız?",
      "Büyük Taarruz hazırlıklarını düşmandan ve basından nasıl gizlediniz?",
      "26 Ağustos sabahı Kocatepe'de taarruz emrini verirken hissettikleriniz nelerdi?"
    ]
  },
  {
    id: "halk-seferberlik",
    name: "Halkın Fedakarlığı & Tekâlif-i Milliye",
    icon: "HeartHandshake",
    description: "Milletin ve kadın kahramanların topyekûn mücadelesi",
    questions: [
      "Tekâlif-i Milliye Emirleri ile halkımız orduya nasıl destek oldu?",
      "Şerife Bacı, Halide Edib ve cepheye mermi taşıyan kadınlarımızın rolünü nasıl anlatırsınız?",
      "Ordunun cephane, çorap ve çarık ihtiyacı yokluklar içinde nasıl karşılandı?",
      "Kuvâ-yı Milliye ruhu nedir ve Kurtuluş Savaşı'nı millet nasıl kazandı?"
    ]
  },
  {
    id: "diplomasi-baris",
    name: "Diplomasi, Lozan & Barış (1922-1923)",
    icon: "Scroll",
    description: "Mudanya, Lozan ve tam bağımsızlığın kabulü",
    questions: [
      "Mudanya Ateşkesi ile Doğu Trakya ve İstanbul savaşsız nasıl kurtarıldı?",
      "Lozan Barış Konferansı'nda kapitülasyonların kaldırılması neden en kritik şartınızdı?",
      "Askeri zaferlerin ardından iktisadi ve siyasi zaferlerin önemini nasıl vurguladınız?",
      "Lozan Antlaşması Türkiye Cumhuriyeti için ne ifade etmektedir?"
    ]
  },
  {
    id: "genclik-gelecek",
    name: "Gençlik & Cumhuriyet Vizyonu",
    icon: "Sparkles",
    description: "Gelecek nesillere miras ve tarih dersi öğütleri",
    questions: [
      "Bugünün öğrencilerine ve gençlerine Kurtuluş Savaşı'ndan çıkaracakları en önemli ders nedir?",
      "Nutuk'u kaleme alırken gençliğe hitabenizde neden 'Bütün bu şeraitten daha elim ve daha vahim olmak üzere...' dediniz?",
      "Cumhuriyeti neden gençlere emanet ettiniz?",
      "Bir milletin geleceğinde tarih bilincinin yeri nedir?"
    ]
  }
];
