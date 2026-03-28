browser.commands.onCommand.addListener(async (command) => {
  if (command !== "focus-search") return;

  const [tab] = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (!tab?.id) return;

  try {
    const results = await browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: focusSearchBar,
    });

    console.log("Focus result:", results[0]?.result);
  } catch (error) {
    console.error("Injection failed:", error);
  }
});

function focusSearchBar() {
  const hostSpecificSelectors = {
    "www.youtube.com": ["input#search"],
    "m.youtube.com": ["input#search"],
    "www.google.com": ['textarea[name="q"]', 'input[name="q"]'],
    "www.bing.com": ['textarea[name="q"]', 'input[name="q"]'],
  };

  const genericSelectors = [
    '[role="searchbox"]',
    'input[role="searchbox"]',
    '[role="search"] input',
    'form[role="search"] input',
    'input[type="search"]',
    'input[aria-label*="search" i]',
    'textarea[aria-label*="search" i]',
    'input[placeholder*="search" i]',
    'textarea[placeholder*="search" i]',
    'input[name*="search" i]',
    'input[id*="search" i]',
    'form[action*="search" i] input',
  ];

  const selectors = [
    ...(hostSpecificSelectors[location.hostname] || []),
    ...genericSelectors,
  ];

  function isVisible(el) {
    if (!el || !el.isConnected) return false;
    if (el.disabled || el.readOnly) return false;
    if (el.tagName === "INPUT" && el.type === "hidden") return false;

    const style = window.getComputedStyle(el);
    if (style.display === "none") return false;
    if (style.visibility === "hidden") return false;
    if (style.opacity === "0") return false;

    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return false;

    return true;
  }

  function tryFocus(el, selector) {
    if (!isVisible(el)) return false;

    el.scrollIntoView({
      block: "center",
      inline: "center",
      behavior: "smooth",
    });

    el.focus({ preventScroll: true });

    if (typeof el.select === "function") {
      el.select();
    }

    return {
      ok: true,
      selector,
      tag: el.tagName,
      id: el.id || null,
      name: el.getAttribute("name") || null,
      placeholder: el.getAttribute("placeholder") || null,
    };
  }

  for (const selector of selectors) {
    const matches = document.querySelectorAll(selector);

    for (const el of matches) {
      const result = tryFocus(el, selector);
      if (result) return result;
    }
  }

  return {
    ok: false,
    reason: "No visible search field found",
  };
}
