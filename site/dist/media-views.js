// Media printables and Read, Draw & Talk, following the Plants blueprint.
// renderStandardHub asks TransportMedia.render first; false means "show the placeholder".
(() => {
  // Same layout labels as Plants.
  const layouts = [[1, 'A4 · 1 large card'], [2, 'A4 · 2 horizontal A5 cards'], [4, 'A4 · 4 cards'], [8, 'A4 landscape · 8 cards']];
  const sections = () => TransportStandard.hubs.media.groups.map(([id, label]) => [id, label]);
  let cardsPerSheet = 4, mediaSection = 'printables', readingIndex = 0;
  const exploredKey = 'transport-reading-explored';
  const el = (tag, className, text) => { const node = document.createElement(tag); if (className) node.className = className; if (text != null) node.textContent = text; return node; };
  const fileSize = bytes => bytes < 1048576 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1048576).toFixed(1)} MB`;
  function readExplored() { try { return new Set(JSON.parse(localStorage.getItem(exploredKey) || '[]')); } catch { return new Set(); } }
  function saveExplored(set) { try { localStorage.setItem(exploredKey, JSON.stringify([...set])); } catch {} }

  function mediaLibrary(root) {
    els.helper.textContent = '';
    els.round.textContent = 'Media library';
    const nav = el('nav', 'media-sections'); nav.setAttribute('aria-label', 'Media type');
    for (const [id, label] of sections()) {
      const button = el('button', 'media-tab', label); button.type = 'button'; button.dataset.mediaSection = id;
      button.setAttribute('aria-pressed', String(id === mediaSection));
      button.onclick = () => { mediaSection = id; renderStandardHub('media'); document.querySelector(`[data-media-section="${id}"]`)?.focus(); };
      nav.append(button);
    }
    root.append(nav);
    if (mediaSection === 'printables') printables(root);
    else { const empty = el('section', 'media-empty'); empty.setAttribute('aria-live', 'polite'); empty.append(el('p', '', `No ${mediaSection} yet.`)); root.append(empty); }
  }

  function printables(root) {
    const packs = globalThis.TransportFlashcards;
    const library = el('section', 'printables-library');
    const toolbar = el('div', 'printables-toolbar');
    const label = el('label', '', 'Print layout ');
    const select = el('select'); select.dataset.mediaPrintLayout = '';
    for (const [count, text] of layouts) select.add(new Option(text, String(count)));
    select.value = String(cardsPerSheet);
    select.onchange = () => { cardsPerSheet = Number(select.value); renderStandardHub('media'); document.querySelector('[data-media-print-layout]')?.focus(); };
    label.append(select); toolbar.append(el('h3', '', 'Vocabulary flashcards'), label); library.append(toolbar);
    if (!Array.isArray(packs) || !packs.length) { library.append(el('p', 'printables-hint', 'Printable cards are being prepared. Check back soon.')); root.append(library); return; }
    library.append(el('p', 'printables-hint', `Print on A4${cardsPerSheet === 8 ? ' in landscape' : ''} at actual size (100%). ${cardsPerSheet === 2 ? 'Cut along the centre guide.' : cardsPerSheet >= 4 ? 'Trim along the dashed card edges.' : ''}`));
    // Each row shows its group's picture; the full pack uses the menu bus.
    const art = new Map([...TransportStandard.categories, ...TransportStandard.teachingCategories].map(group => [group.id, group.image]));
    const grid = el('div', 'printables-grid');
    for (const pack of packs.filter(p => p.cardsPerSheet === cardsPerSheet)) {
      const row = el('article', 'printable-card' + (pack.scopeId === 'all' ? ' printable-card--complete' : ''));
      const picture = el('img'); picture.src = art.get(pack.scopeId) || art.get('all'); picture.alt = ''; picture.loading = 'lazy';
      const details = el('div', 'printable-details');
      details.append(el('h4', '', pack.title), el('p', '', `${pack.wordCount} words · ${pack.pageCount} ${pack.pageCount === 1 ? 'page' : 'pages'} · ${fileSize(pack.bytes)}`));
      const actions = el('div', 'printable-actions');
      const open = el('a', '', 'Open'); open.href = pack.path; open.target = '_blank'; open.rel = 'noopener';
      const save = el('a', '', 'Download'); save.href = pack.path; save.download = pack.path.split('/').pop();
      open.setAttribute('aria-label', `Open ${pack.title} PDF (A4), new tab`); save.setAttribute('aria-label', `Download ${pack.title} PDF (A4)`);
      actions.append(open, save); row.append(picture, details, actions); grid.append(row);
    }
    library.append(grid); root.append(library);
  }

  function readingCards() {
    const words = new Map(classroom.pool('learn').map(word => [word.id, word]));
    return TransportStandard.readingCards.filter(card => words.has(card.itemId)).map(card => ({...card, word: words.get(card.itemId)}));
  }

  function reading(root) {
    const cards = readingCards(), explored = readExplored();
    if (!cards.length) { root.append(el('h3', '', 'Reading cards'), el('p', '', 'No reading cards match the words chosen in Teacher. Widen the word choice to see more cards.')); return; }
    readingIndex = Math.min(readingIndex, cards.length - 1);
    // Plants Read, Draw & Talk: picture and sentence beside the Draw and Talk prompts, explored count as the score.
    const card = cards[readingIndex], done = explored.has(card.id), last = readingIndex === cards.length - 1;
    const count = () => cards.filter(c => explored.has(c.id)).length;
    els.question.textContent = 'Read, Draw & Talk'; els.helper.textContent = '';
    els.round.textContent = `Reading card ${readingIndex + 1}/${cards.length}`;
    document.querySelector('.progress-track').hidden = false; els.progress.style.width = `${readingIndex / cards.length * 100}%`;
    els.scorePill.hidden = false; els.score.textContent = count();
    const view = el('div', 'reading-workspace'), figure = el('figure');
    const picture = el('img', 'reading-picture'); picture.src = card.word.image; picture.alt = card.word.alt || card.word.name;
    figure.append(picture, el('figcaption', '', card.sentence));
    const prompts = el('div', 'reading-prompts');
    for (const [title, text] of [['Draw', card.draw], ['Talk', card.talk]]) { const part = el('section'); part.append(el('h3', '', title), el('p', '', text)); prompts.append(part); }
    view.append(figure, prompts);
    const go = step => { readingIndex += step; renderStandardHub('create'); };
    const actions = el('div', 'learn-actions reading-actions');
    const previous = standardButton('Previous', () => go(-1)); previous.disabled = readingIndex === 0;
    const mark = standardButton(done ? 'Explored' : 'Mark as explored', () => {
      explored.add(card.id); saveExplored(explored); renderStandardHub('create');
      els.feedback.replaceChildren(el('p', '', 'Card explored. Share your idea when you are ready.')); els.feedback.className = 'feedback is-correct';
    });
    mark.disabled = done;
    const next = standardButton(last ? 'See results' : 'Next', () => {
      if (!last) { go(1); return; }
      readingIndex = 0; state.questions = cards; state.score = count(); state.practice = true; finishGame();
    }, 'standard-action learn-next');
    actions.append(previous, standardButton('Hear sentence', () => speak(card.sentence)), mark, next);
    root.append(view, actions);
  }

  function phonics(root, section) {
    const group = TransportStandard.hubs.phonics.groups.find(g => g[0] === section);
    root.append(el('h3', '', group ? group[1] : 'Phonics'));
    const area = el('div', 'phonics-mount'); root.append(area);
    const mount = () => globalThis.TransportPhonics.mount(area, section, {
      words: classroom.pool('learn'),
      readingCards: TransportStandard.readingCards,
      categories: [...TransportStandard.categories.filter(c => c.id !== 'all'), ...TransportStandard.teachingCategories],
      settings: { get muted() { return state.muted; } }
    });
    if (globalThis.TransportPhonics) { mount(); return; }
    area.textContent = 'Loading letter sounds…';
    window.addEventListener('transport-phonics-ready', () => { if (area.isConnected) { area.replaceChildren(); mount(); } }, { once: true });
  }

  globalThis.TransportMedia = {
    render(mode, groupId, root) {
      if (mode === 'media') { mediaLibrary(root); return true; }
      if (mode === 'create') { reading(root); return true; }
      if (mode === 'phonics' && groupId) { phonics(root, groupId); return true; }
      if (mode === 'games' && groupId === 'dispatch' && globalThis.TransportDispatch) { TransportDispatch.mount(root); return true; }
      return false;
    }
  };
})();
