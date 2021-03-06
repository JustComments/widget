import './auth';

import {
  onReady,
  findWidgetElement,
  scrollIntoView,
  onceVisible,
  getPageData,
  isBot,
} from './bootstrap';

import { mapping } from './locales';

let { jumpToComment } = getPageData();

let loaded = false;
function loadCoreOnce(bundleLocale) {
  if (!loaded) {
    loaded = true;
    let s = document.createElement('script');
    s.setAttribute('src', CORE_URL.replace('.js', `.${bundleLocale}.js`));
    document.body.appendChild(s);
  }
}

function forceWidgetSize(widget) {
  widget.setAttribute('style', 'min-height: 1px; min-width: 1px;');
}

function bootstrap() {
  const widget = findWidgetElement();
  if (!widget) {
    console.log('JustComments warning: widget is not loading.');
    return;
  }

  forceWidgetSize(widget);
  if (jumpToComment) {
    scrollIntoView(widget);
  }

  const preload = widget.dataset.preload === 'true';
  const locale = widget.dataset.locale || 'en';
  const loadImmediately = preload || isBot();
  const lang = locale.split('_').shift();
  const bundleLocale = mapping[locale] || mapping[lang] || 'en';

  if (loadImmediately === true) {
    // LOAD core.js
    loadCoreOnce(bundleLocale);
  } else {
    onceVisible(widget, () => {
      loadCoreOnce(bundleLocale);
    });
  }
}

onReady(() => {
  bootstrap();
});
