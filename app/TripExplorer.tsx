"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

type PlotlyApi = {
  newPlot: (
    element: HTMLElement,
    data: unknown[],
    layout: Record<string, unknown>,
    config: Record<string, unknown>,
  ) => void;
  purge: (element: HTMLElement) => void;
  Plots: { resize: (element: HTMLElement) => void };
};

declare global {
  interface Window {
    Plotly?: PlotlyApi;
  }
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const asset = (path: string) => `${basePath}${path}`;

const images = {
  tokyo: asset("/images/tokyo-hero.jpg"),
  kyoto: asset("/images/kyoto-hero.jpg"),
  osaka: asset("/images/osaka-hero.jpg"),
  shanghai: asset("/images/shanghai-hero.jpg"),
  zhangjiajie: asset("/images/zhangjiajie-hero.jpg"),
  chongqing: asset("/images/chongqing-hero.jpg"),
};

const japanCities = [
  {
    id: "tokyo",
    eyebrow: "DAYS 01—04 / 東京",
    name: "Токио",
    promise: "Будущее, которое научилось жить рядом с храмами и садами.",
    image: images.tokyo,
    alt: "Ночной перекресток Сибуя в Токио",
    plan: [
      {
        day: "День 1",
        title: "Тишина → неон",
        text: "Синдзюку Гёэн утром, Харадзюку и Мэйдзи-дзингу днем, Шибуя на закате и ночной Синдзюку.",
      },
      {
        day: "День 2",
        title: "Старый Эдо → башня",
        text: "Асакуса, Сэнсо-дзи, торговая Накамисэ, набережная Сумида и Tokyo Skytree после синего часа.",
      },
      {
        day: "День 3",
        title: "Камакура",
        text: "Большой Будда, Хасэ-дэра и берег океана. День, когда мегаполис отпускает хватку.",
      },
      {
        day: "День 4",
        title: "Фудзи или Никко",
        text: "Фудзи — за открыточным масштабом. Никко — за храмами в кедровом лесу. Оба сразу — только с лишним днем.",
      },
    ],
    reasons: [
      "Шибуя дает концентрат токийской энергии за один вечер",
      "Асакуса и Skytree показывают старый и новый город в одном кадре",
      "Камакура добавляет океан и спокойный ритм без смены отеля",
    ],
    gallery: [
      { image: asset("/images/tokyo-asakusa.jpg"), alt: "Храм Сэнсо-дзи в Асакусе ночью", caption: "Асакуса после темноты" },
      { image: asset("/images/tokyo-shibuya.jpg"), alt: "Неоновые улицы Сибуи", caption: "Сибуя без паузы" },
    ],
  },
  {
    id: "kyoto",
    eyebrow: "DAYS 05—07 / 京都",
    name: "Киото",
    promise: "Город, где кадр уже выстроен до того, как вы достали камеру.",
    image: images.kyoto,
    alt: "Храм Киёмидзу-дэра среди красных кленов в Киото",
    plan: [
      {
        day: "День 5",
        title: "Тысяча ворот",
        text: "Фусими Инари до 08:00, затем рынок Нисики. Вечером — Гион, Ханами-кодзи и Ясака.",
      },
      {
        day: "День 6",
        title: "Золото и дзен",
        text: "Кинкаку-дзи, сад Рёан-дзи и спокойная северо-западная часть города без гонки по десяти храмам.",
      },
      {
        day: "День 7",
        title: "Хигасияма пешком",
        text: "Киёмидзу-дэра → Нинэнзака → Кодай-дзи с небольшой бамбуковой рощей → Кэннин-дзи → Гион.",
      },
    ],
    reasons: [
      "Фусими Инари на рассвете — редкий шанс услышать место, а не толпу",
      "Кодай-дзи дает бамбук прямо рядом с Гионом; Арасияма не нужна ради одной фотографии",
      "Маршрут по Хигасияме раскрывается прогулкой, а не транспортом",
    ],
    gallery: [
      { image: asset("/images/kyoto-kinkakuji.jpg"), alt: "Золотой павильон Кинкаку-дзи в Киото", caption: "Золотой павильон" },
      { image: asset("/images/kyoto-gion.jpg"), alt: "Тихая улица района Гион вечером", caption: "Гион вечером" },
    ],
  },
  {
    id: "osaka",
    eyebrow: "DAYS 08—10 / 大阪",
    name: "Осака",
    promise: "Еда, вода, неон и чувство, что город подмигивает вам первым.",
    image: images.osaka,
    alt: "Неоновые вывески вдоль канала Дотонбори в Осаке",
    plan: [
      {
        day: "День 8",
        title: "Тихий океан",
        text: "Kaiyukan, китовые акулы, порт Тэмподзан. На закате — Umeda Sky Building и город сверху.",
      },
      {
        day: "День 9",
        title: "Замок → Дотонбори",
        text: "Замок Осаки и парк утром, Накамдзаки-тё днем, гастрономический хаос Дотонбори вечером.",
      },
      {
        day: "День 10",
        title: "Нара + Синсэкай",
        text: "Олени и Тодай-дзи до обеда; после возвращения — башня Цутэнкаку и ретро-улицы Синсэкая.",
      },
    ],
    reasons: [
      "Kaiyukan — не пауза от города, а отдельный вау-день",
      "Нара естественно ложится в маршрут без нового отеля",
      "Дотонбори — финальный выброс неона, такояки и энергии",
    ],
    gallery: [
      { image: asset("/images/osaka-nara.jpg"), alt: "Олень в парке Нары", caption: "Утро в Наре" },
      { image: asset("/images/osaka-castle.jpg"), alt: "Замок Осаки ночью", caption: "Замок после заката" },
    ],
  },
];

const chinaCities = [
  {
    id: "shanghai",
    eyebrow: "DAYS 01—04 / 上海",
    name: "Шанхай",
    promise: "Ар-деко, старый Китай и Blade Runner на противоположных берегах одной реки.",
    image: images.shanghai,
    alt: "Ночной горизонт Шанхая с видом на Пудун",
    plan: [
      {
        day: "День 1",
        title: "Северный Бунд",
        text: "Прогулка от North Bund к классическому Бунду, паром через Хуанпу и вечер среди башен Луцзяцзуй.",
      },
      {
        day: "День 2",
        title: "Французский квартал",
        text: "Укан-роуд, Фусин-парк, бывшая Французская концессия и Starbucks Reserve Roastery на West Nanjing Road.",
      },
      {
        day: "День 3",
        title: "Сад → неон",
        text: "Юйюань и старый квартал утром, пешеходная Нанкинская улица днем, Бунд после заката.",
      },
      {
        day: "День 4",
        title: "Цибао + высота",
        text: "Близкий водный городок Цибао: каналы, мостики и закусочная улица. Финал — Shanghai Tower или арт-квартал M50.",
      },
    ],
    reasons: [
      "Контраст Бунда и Пудуна работает лучше любого музея города",
      "Цибао дает каналы без длинного выезда в Чжуцзяцзяо",
      "Четвертый день нужен, чтобы Шанхай не превратился в чек-лист; за три дня его можно ужать",
    ],
    gallery: [
      { image: asset("/images/shanghai-yuyuan.jpg"), alt: "Китайские павильоны сада Юй в Шанхае", caption: "Сад Юй" },
      { image: asset("/images/shanghai-bund.jpg"), alt: "Огни небоскребов Шанхая с набережной Бунд", caption: "Бунд ночью" },
    ],
  },
  {
    id: "zhangjiajie",
    eyebrow: "DAYS 05—07 / 张家界",
    name: "Чжанцзяцзе",
    promise: "Тот редкий случай, когда “как в кино” — занижение масштаба.",
    image: images.zhangjiajie,
    alt: "Покрытые лесом каменные столбы Чжанцзяцзе в тумане",
    plan: [
      {
        day: "День 5",
        title: "Тяньмэнь",
        text: "Одна из самых длинных канатных дорог, 99 поворотов, Небесные врата и стеклянные тропы над облаками.",
      },
      {
        day: "День 6",
        title: "Горы Аватара",
        text: "Юаньцзяцзе, лифт Байлун и каменные столбы Улинъюаня. Это главный природный день всего маршрута.",
      },
      {
        day: "День 7",
        title: "Каньон + 72楼",
        text: "Стеклянный мост над Большим каньоном; вечером — подсвеченный комплекс “72 странных здания” в городе.",
      },
    ],
    reasons: [
      "Более 3 000 кварцитовых столбов создают ландшафт, которого нет больше нигде в маршруте",
      "Тяньмэнь и парк — разные зоны: пытаться объединить их в день не стоит",
      "Туман здесь не всегда помеха: он делает горы визуально “плавающими”",
    ],
    gallery: [
      { image: asset("/images/zhangjiajie-tianmen.jpg"), alt: "Гора Тяньмэнь над облаками", caption: "Тяньмэнь" },
      { image: asset("/images/zhangjiajie-cableway.jpg"), alt: "Канатная дорога в горах Тяньмэнь", caption: "Дорога над облаками" },
    ],
  },
  {
    id: "chongqing",
    eyebrow: "DAYS 08—10 / 重庆",
    name: "Чунцин",
    promise: "Вертикальный мегаполис, где станция метро может оказаться на двадцатом этаже вашей прогулки.",
    image: images.chongqing,
    alt: "Подсвеченный комплекс Хунъядун в Чунцине ночью",
    plan: [
      {
        day: "День 8",
        title: "Город без уровня земли",
        text: "Цзефанбэй, Куйсинлоу и вечерний Хунъядун. Один маршрут — десятки этажей перепада высот.",
      },
      {
        day: "День 9",
        title: "Монорельс → река",
        text: "Лицзыба, Шибати, Лунмэньхао и канатная дорога через Янцзы. На ужин — фирменный хот-пот.",
      },
      {
        day: "День 10",
        title: "Улун или медленный город",
        text: "Большой финал — Три природных моста Улун. Если сил мало: Цыцикоу, Raffles City и речной круиз.",
      },
    ],
    reasons: [
      "Хунъядун красив именно с противоположной стороны улицы или с реки, а не внутри толпы",
      "Лицзыба и Куйсинлоу превращают городскую инфраструктуру в аттракцион",
      "Улун добавляет эпическую природу, но требует очень раннего старта",
    ],
    gallery: [
      { image: asset("/images/chongqing-liziba.jpg"), alt: "Поезд монорельса входит в жилой дом на станции Лицзыба", caption: "Лицзыба" },
      { image: asset("/images/chongqing-hall.jpg"), alt: "Ночной вид на Большой зал народных собраний Чунцина", caption: "Ночной Чунцин" },
    ],
  },
];

function PlotlyComparison() {
  const profileRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  const drawCharts = useCallback(() => {
    const Plotly = window.Plotly;
    if (!Plotly || !profileRef.current || !mapRef.current) return;

    const text = "#e9e2d3";
    const grid = "rgba(233,226,211,.12)";
    const sharedConfig = {
      responsive: true,
      displaylogo: false,
      modeBarButtonsToRemove: ["lasso2d", "select2d", "autoScale2d"],
    };

    Plotly.newPlot(
      profileRef.current,
      [
        {
          type: "bar",
          orientation: "h",
          name: "Япония",
          y: ["Атмосфера", "Вау-природа", "Ночной город", "Культурный контраст", "Комфорт без языка"],
          x: [10, 7, 8, 9, 7],
          marker: { color: "#d9463e", line: { color: "#f4b0a7", width: 1 } },
          hovertemplate: "Япония: %{x}/10<extra></extra>",
        },
        {
          type: "bar",
          orientation: "h",
          name: "Китай",
          y: ["Атмосфера", "Вау-природа", "Ночной город", "Культурный контраст", "Комфорт без языка"],
          x: [8, 10, 10, 9, 4],
          marker: { color: "#d8aa62", line: { color: "#f7d596", width: 1 } },
          hovertemplate: "Китай: %{x}/10<extra></extra>",
        },
      ],
      {
        barmode: "group",
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        font: { family: "Arial, sans-serif", color: text, size: 12 },
        margin: { l: 142, r: 18, t: 8, b: 42 },
        xaxis: {
          range: [0, 10],
          dtick: 2,
          gridcolor: grid,
          zeroline: false,
          title: { text: "редакционная оценка / 10", font: { size: 11 } },
        },
        yaxis: { automargin: true },
        legend: { orientation: "h", y: -0.22, x: 0 },
        height: 360,
      },
      sharedConfig,
    );

    Plotly.newPlot(
      mapRef.current,
      [
        {
          type: "scattergeo",
          mode: "lines+markers+text",
          name: "Япония",
          lon: [139.6917, 135.7681, 135.5023],
          lat: [35.6895, 35.0116, 34.6937],
          text: ["Токио", "Киото", "Осака"],
          textposition: ["top right", "top left", "bottom left"],
          line: { width: 3, color: "#d9463e" },
          marker: { size: 10, color: "#f0d2c7", line: { color: "#d9463e", width: 2 } },
          hovertemplate: "%{text}<extra>Япония</extra>",
        },
        {
          type: "scattergeo",
          mode: "lines+markers+text",
          name: "Китай",
          lon: [121.4737, 110.4792, 106.5516],
          lat: [31.2304, 29.1171, 29.563],
          text: ["Шанхай", "Чжанцзяцзе", "Чунцин"],
          textposition: ["top right", "top center", "bottom left"],
          line: { width: 3, color: "#d8aa62" },
          marker: { size: 10, color: "#f5dfb9", line: { color: "#9f271f", width: 2 } },
          hovertemplate: "%{text}<extra>Китай</extra>",
        },
      ],
      {
        paper_bgcolor: "rgba(0,0,0,0)",
        font: { family: "Arial, sans-serif", color: text, size: 11 },
        margin: { l: 0, r: 0, t: 0, b: 0 },
        height: 360,
        showlegend: false,
        geo: {
          scope: "asia",
          projection: { type: "natural earth" },
          bgcolor: "rgba(0,0,0,0)",
          showland: true,
          landcolor: "#252a28",
          showocean: true,
          oceancolor: "#101513",
          showcountries: true,
          countrycolor: "rgba(233,226,211,.18)",
          coastlinecolor: "rgba(233,226,211,.25)",
          lonaxis: { range: [96, 151] },
          lataxis: { range: [20, 48] },
        },
      },
      sharedConfig,
    );
  }, []);

  useEffect(() => {
    if (!ready) return;
    const profileElement = profileRef.current;
    const mapElement = mapRef.current;
    if (!profileElement || !mapElement) return;
    drawCharts();

    const handleResize = () => {
      if (window.Plotly) {
        window.Plotly.Plots.resize(profileElement);
        window.Plotly.Plots.resize(mapElement);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (window.Plotly) {
        window.Plotly.purge(profileElement);
        window.Plotly.purge(mapElement);
      }
    };
  }, [drawCharts, ready]);

  return (
    <>
      <Script
        src="https://cdn.plot.ly/plotly-3.6.0.min.js"
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
      />
      <div className="viz-grid">
        <article className="viz-card">
          <div className="viz-card__head">
            <span>01 / ПРОФИЛЬ</span>
            <h3>Как ощущаются маршруты</h3>
          </div>
          <div ref={profileRef} className="plot" aria-label="Сравнение Японии и Китая по пяти впечатлениям" />
          <p className="viz-note">Шкала — редакционная, чтобы показать характер маршрутов, а не выдать субъективность за статистику.</p>
        </article>
        <article className="viz-card">
          <div className="viz-card__head">
            <span>02 / ТРАЕКТОРИЯ</span>
            <h3>Три города, один сюжет</h3>
          </div>
          <div ref={mapRef} className="plot" aria-label="Карта маршрутов по Японии и Китаю" />
          <p className="viz-note">Япония — компактная линия по рельсам. Китай — два больших прыжка между мегаполисом, горами и вертикальным городом.</p>
        </article>
      </div>
    </>
  );
}

function CityStory({ city, index, country }: { city: (typeof japanCities)[number]; index: number; country: "japan" | "china" }) {
  return (
    <article className={`city-story city-story--${country} ${index % 2 ? "city-story--reverse" : ""}`} id={city.id}>
      <div className="city-photo-wrap">
        <img className="city-photo" src={city.image} alt={city.alt} loading="lazy" decoding="async" />
        <div className="city-photo__label">
          <span>0{index + 1}</span>
          <strong>{city.name}</strong>
        </div>
      </div>
      <div className="city-copy">
        <p className="city-eyebrow">{city.eyebrow}</p>
        <h3>{city.name}</h3>
        <p className="city-promise">{city.promise}</p>
        <div className="day-list">
          {city.plan.map((item) => (
            <div className="day-row" key={`${city.id}-${item.day}`}>
              <span>{item.day}</span>
              <div>
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
        <details className="why-card">
          <summary>Почему это действительно круто</summary>
          <ul>
            {city.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </details>
      </div>
      <div className="city-gallery" aria-label={`Атмосфера: ${city.name}`}>
        {city.gallery.map((photo) => (
          <figure key={photo.image}>
            <img src={photo.image} alt={photo.alt} loading="lazy" decoding="async" />
            <figcaption>
              <span>ATMOSPHERE</span>
              <strong>{photo.caption}</strong>
            </figcaption>
          </figure>
        ))}
      </div>
    </article>
  );
}

export default function TripExplorer() {
  return (
    <main>
      <nav className="top-nav" aria-label="Навигация по сайту">
        <a className="brand" href="#top" aria-label="В начало">
          <span>東</span>
          <strong>EAST / 10</strong>
        </a>
        <div className="top-nav__links">
          <a href="#compare">Сравнение</a>
          <a href="#japan">Япония</a>
          <a href="#china">Китай</a>
          <a href="#verdict">Минусы</a>
        </div>
      </nav>

      <header className="hero" id="top">
        <a className="hero-half hero-half--japan" href="#japan" aria-label="Перейти к маршруту по Японии">
          <img src={images.tokyo} alt="Неоновый Токио ночью" />
          <div className="hero-half__shade" />
          <span className="hero-script">日本</span>
          <div className="hero-half__caption">
            <span>JAPAN / 10 DAYS</span>
            <strong>Собранная красота</strong>
            <em>Токио · Киото · Осака</em>
          </div>
        </a>
        <a className="hero-half hero-half--china" href="#china" aria-label="Перейти к маршруту по Китаю">
          <img src={images.zhangjiajie} alt="Горы Чжанцзяцзе в тумане" />
          <div className="hero-half__shade" />
          <span className="hero-script">中国</span>
          <div className="hero-half__caption">
            <span>CHINA / 10 DAYS</span>
            <strong>Невозможный масштаб</strong>
            <em>Шанхай · Чжанцзяцзе · Чунцин</em>
          </div>
        </a>
        <div className="hero-center">
          <p>ОДНА ПОЕЗДКА / ДВА СЦЕНАРИЯ</p>
          <h1>Куда поехать,<br />чтобы потом не заткнуться</h1>
          <div className="hero-center__line" />
          <span>10 дней. 3 города. Совершенно разная Азия.</span>
        </div>
        <a className="scroll-cue" href="#compare">
          <span>СМОТРЕТЬ СРАВНЕНИЕ</span>
          <i>↓</i>
        </a>
      </header>

      <section className="compare-section" id="compare">
        <div className="section-heading section-heading--light">
          <p>БЫСТРЫЙ ВЫБОР / 00</p>
          <h2>Сначала — характер.<br />Потом — расписание.</h2>
          <p className="section-heading__lead">Япония не пытается ошеломить масштабом. Она цепляет тихо: светом в переулке, запахом татами, ночным конбини и тем самым чувством, что сюда хочется вернуться. Китай действует иначе — бьет контрастом, высотой, шумом и пейзажами, которые не помещаются в привычную картинку.</p>
        </div>

        <div className="quick-choice">
          <article className="quick-card quick-card--japan">
            <span className="quick-card__glyph">和</span>
            <p>ВЫБИРАЙ ЯПОНИЮ, ЕСЛИ</p>
            <h3>Хочется поездки, которая потом еще долго не отпускает</h3>
            <ul>
              <li>Тянет к тихим храмам, вечернему неону и маленьким ритуалам</li>
              <li>Нравится городская красота, которую хочется разглядывать</li>
              <li>Хочешь не столько вау-эффект, сколько чувство «я сюда вернусь»</li>
            </ul>
            <a href="#japan">Погрузиться в Японию →</a>
          </article>
          <article className="quick-card quick-card--china">
            <span className="quick-card__glyph">山</span>
            <p>ВЫБИРАЙ КИТАЙ, ЕСЛИ</p>
            <h3>Хочется, чтобы каждый третий вид ломал масштаб</h3>
            <ul>
              <li>Готов к языковому и цифровому квесту</li>
              <li>Хочешь мегаполисы, горы и киберпанк</li>
              <li>Предпочитаешь “ничего себе” вместо “как аккуратно”</li>
            </ul>
            <a href="#china">Погрузиться в Китай →</a>
          </article>
        </div>

        <PlotlyComparison />
      </section>

      <section
        className="country-world japan-world"
        id="japan"
        style={{ "--world-art": `url("${asset("/images/japan-maple-background-v2.jpg")}")` } as CSSProperties}
      >
        <div className="country-hero country-hero--japan">
          <div className="country-hero__stamp">十日</div>
          <div>
            <p>ROUTE 01 / 日本</p>
            <h2>Япония.<br /><em>Красота в дисциплине.</em></h2>
            <p className="country-hero__lead">Утром — сад, в котором слышно гравий. Вечером — перекресток на три тысячи человек. Между ними поезд приходит в минуту, рамэн дымится, а город ни разу не повышает голос.</p>
          </div>
          <aside>
            <span>БАЗОВЫЙ РИТМ</span>
            <strong>4 + 3 + 3</strong>
            <p>Токио → Киото → Осака</p>
            <small>Никко требует +1 дня или замены Фудзи</small>
          </aside>
        </div>

        <div className="route-ribbon route-ribbon--japan">
          <span>東京</span><i>新幹線</i><span>京都</span><i>JR / 30–45 MIN</i><span>大阪</span>
        </div>

        <div className="stories-wrap">
          {japanCities.map((city, index) => (
            <CityStory key={city.id} city={city} index={index} country="japan" />
          ))}
        </div>

        <section className="bonus bonus--japan">
          <div className="bonus-can bonus-can--japan" aria-hidden="true">
            <small>無糖</small>
            <strong>−196</strong>
            <span>ZERO</span>
          </div>
          <div className="bonus-copy">
            <p>ПОСЛЕ ПРОГУЛКИ / コンビニ</p>
            <h3>Трое друзей, полка банок и плохое чувство меры.</h3>
            <p>План простой: после долгого дня зайти в круглосуточный конбини, взять по холодному −196 и еще минут двадцать выбирать вкус. В Японии для этого не нужно искать бар или успевать до закрытия: нормальный вечер собирается в ближайшем магазине.</p>
            <div className="bonus-dialogue">
              <span>— Берем по одной и домой?</span>
              <strong>— Да. А вторую — чисто попробовать другой вкус.</strong>
            </div>
            <small>−196 Zero бывает крепким: смотрите процент на банке. Алкоголь в Японии — с 20 лет.</small>
          </div>
        </section>
      </section>

      <section
        className="country-world china-world"
        id="china"
        style={{ "--world-art": `url("${asset("/images/china-mountain-background-v2.jpg")}")` } as CSSProperties}
      >
        <div className="country-hero country-hero--china">
          <div className="country-hero__stamp">十天</div>
          <div>
            <p>ROUTE 02 / 中国</p>
            <h2>Китай.<br /><em>Масштаб без тормозов.</em></h2>
            <p className="country-hero__lead">Колониальный фасад сменяется башней из будущего. Метро проходит сквозь дом. Каменные пики уходят в облака. Китай не просит нравиться — он просто занимает весь кадр.</p>
          </div>
          <aside>
            <span>БАЗОВЫЙ РИТМ</span>
            <strong>4 + 3 + 3</strong>
            <p>Шанхай → Чжанцзяцзе → Чунцин</p>
            <small>Лучше 11–12 календарных дней с перелетами</small>
          </aside>
        </div>

        <div className="route-ribbon route-ribbon--china">
          <span>上海</span><i>FLIGHT</i><span>张家界</span><i>HIGH-SPEED RAIL</i><span>重庆</span>
        </div>

        <div className="stories-wrap">
          {chinaCities.map((city, index) => (
            <CityStory key={city.id} city={city} index={index} country="china" />
          ))}
        </div>

        <section className="bonus bonus--china">
          <div className="bonus-can bonus-can--china" aria-hidden="true">
            <small>青岛</small>
            <strong>冰</strong>
            <span>LAGER</span>
          </div>
          <div className="bonus-copy">
            <p>ПОСЛЕ ХОТ-ПОТА / 冰镇啤酒</p>
            <h3>Просто холодный лагер. Сейчас это именно то, что нужно.</h3>
            <p>После острого хот-пота втроем не хочется обсуждать хмель, плотность и послевкусие. Хочется открыть три холодные банки, выдохнуть и решить, куда еще идти, хотя ноги уже против.</p>
            <div className="bonus-dialogue">
              <span>— Мы же просили не очень острое.</span>
              <strong>— Мы попросили. Они сделали по-китайски.</strong>
            </div>
            <small>冰镇啤酒 — «охлажденное пиво». Если принесут теплое, пригодится.</small>
          </div>
        </section>
      </section>

      <section className="verdict" id="verdict">
        <div className="section-heading section-heading--dark">
          <p>ЧЕСТНЫЙ ФИНАЛ / 03</p>
          <h2>Что может бесить.<br />И что перевешивает.</h2>
        </div>

        <div className="friction-grid">
          <article className="friction-card friction-card--japan">
            <div className="friction-card__title"><span>日本</span><h3>Япония</h3></div>
            <ul>
              <li><strong>Вежливость ≠ близость.</strong> Контакт корректный, но случайно подружиться сложнее.</li>
              <li><strong>Оплата для россиян.</strong> Карты, выпущенные в РФ, за рубежом обычно не работают; нужен наличный резерв или карта иностранного банка.</li>
              <li><strong>Микрорешения утомляют.</strong> Сложные станции, правила, очереди и бронь популярных мест требуют внимания.</li>
              <li><strong>10 дней — компромисс.</strong> Фудзи и Никко одновременно ломают темп; выбирайте один.</li>
            </ul>
            <p className="friction-card__payoff">ЗАТО / все части маршрута работают как единая, очень красивая система.</p>
          </article>
          <article className="friction-card friction-card--china">
            <div className="friction-card__title"><span>中国</span><h3>Китай</h3></div>
            <ul>
              <li><strong>Громко и людно.</strong> Очереди, объявления, группы и экраны — часть впечатления.</li>
              <li><strong>Английского может не хватить.</strong> Адреса на китайском и офлайн-переводчик нужны даже в больших городах.</li>
              <li><strong>Еда — квест для чувствительного желудка.</strong> Начинайте с мест с большим оборотом и блюд, которые готовят при вас.</li>
              <li><strong>Цифровой барьер.</strong> Alipay удобен, но его, связь, карты и резервный способ оплаты надо настроить до поездки.</li>
            </ul>
            <p className="friction-card__payoff">ЗАТО / такого диапазона от гор до мегаполисов за 10 дней Япония не даст.</p>
          </article>
        </div>

        <div className="final-call">
          <p>ОДНА ФРАЗА ВМЕСТО ВЫВОДА</p>
          <div>
            <h3><span>Япония</span> — если хочешь влюбиться.</h3>
            <h3><span>Китай</span> — если хочешь офигеть.</h3>
          </div>
          <a href="#top">Выбрать еще раз ↑</a>
        </div>
      </section>

      <footer>
        <div>
          <strong>EAST / 10</strong>
          <span>Маршрут-конструктор для первой большой поездки</span>
        </div>
        <details>
          <summary>Источники и фотокредиты</summary>
          <p>
            Фактура: <a href="https://www.japan.travel/en/destinations/kanto/tokyo/" target="_blank" rel="noreferrer">JNTO</a>,{" "}
            <a href="https://kyoto.travel/en/destinations/kodaiji-temple/" target="_blank" rel="noreferrer">Kyoto City</a>,{" "}
            <a href="https://osaka-info.jp/en/osaka/basic/popular-spot/" target="_blank" rel="noreferrer">Osaka Tourism</a>,{" "}
            <a href="https://english.shanghai.gov.cn/en-TravelinShanghai/index.html" target="_blank" rel="noreferrer">Shanghai Government</a>,{" "}
            <a href="https://whc.unesco.org/en/list/640/" target="_blank" rel="noreferrer">UNESCO Wulingyuan</a>,{" "}
            <a href="https://english.www.gov.cn/news/202404/11/content_WS6617c858c6d0868f4e8e5f4d.html" target="_blank" rel="noreferrer">China payment guide</a>.
            Фоны с кленами и горами сгенерированы специально для проекта. Фотографии: Wikimedia Commons — Andre Benz, Guilhem Vellut, Steve Allison, freddie marriage, David Monniaux, lumoplank, Redd Angelo, Carl Flor, Nkns, DvTor8303, Jean-Pierre Dalbéra, Hermann Luyken, xiquinhosilva, GeoffLeng, David290 и Harveychl (CC0, CC BY, CC BY-SA и public domain согласно карточкам файлов).
          </p>
        </details>
        <small>Часы работы, билеты и транспорт меняются. Перепроверьте их перед выездом.</small>
      </footer>
    </main>
  );
}
