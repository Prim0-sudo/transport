// Media printables and Read, Draw & Talk, following the Plants blueprint.
// renderStandardHub asks TransportMedia.render first; false means "show the placeholder".
(() => {
  const layouts = [[1, 'One card', 'Full A4 sheet'], [2, 'Two cards', 'Cut on the dashed midline'], [4, 'Four cards', 'Trim on the dashed edges'], [8, 'Eight cards', 'Landscape, trim on the dashed edges']];
  let cardsPerSheet = 1, readingIndex = 0;
  const exploredKey = 'transport-reading-explored';
  const el = (tag, className, text) => { const node = document.createElement(tag); if (className) node.className = className; if (text != null) node.textContent = text; return node; };
  const megabytes = bytes => `${(bytes / 1048576).toFixed(bytes < 10485760 ? 1 : 0)} MB`;
  function readExplored() { try { return new Set(JSON.parse(localStorage.getItem(exploredKey) || '[]')); } catch { return new Set(); } }
  function saveExplored(set) { try { localStorage.setItem(exploredKey, JSON.stringify([...set])); } catch {} }

  function printables(root) {
    const packs = globalThis.TransportFlashcards;
    root.append(el('h3', '', 'Printable flashcards'));
    if (!Array.isArray(packs) || !packs.length) { root.append(el('p', '', 'Printable cards are being prepared. Check back soon.')); return; }
    root.append(el('p', '', 'Choose how many cards go on each A4 sheet, then open or download a pack. Print at actual size.'));
    const picker = el('div', 'print-layouts'); picker.setAttribute('role', 'group'); picker.setAttribute('aria-label', 'Cards per sheet');
    for (const [count, label, hint] of layouts) {
      const button = el('button', 'print-layout'); button.type = 'button'; button.setAttribute('aria-pressed', String(count === cardsPerSheet));
      button.append(el('strong', '', label), el('span', '', hint));
      button.onclick = () => { cardsPerSheet = count; renderStandardHub('media', 'printables'); document.querySelector(`.print-layout[aria-pressed="true"]`)?.focus(); };
      picker.append(button);
    }
    const list = el('div', 'print-packs');
    for (const pack of packs.filter(p => p.cardsPerSheet === cardsPerSheet)) {
      const card = el('article', 'print-pack');
      card.append(el('h4', '', pack.title), el('p', '', `${pack.wordCount} words · ${pack.pageCount} ${pack.pageCount === 1 ? 'page' : 'pages'} · ${megabytes(pack.bytes)}`));
      const links = el('div', 'print-links');
      const open = el('a', 'standard-action', 'Open'); open.href = pack.path; open.target = '_blank'; open.rel = 'noopener';
      const save = el('a', 'standard-action', 'Download'); save.href = pack.path; save.download = pack.path.split('/').pop();
      open.setAttribute('aria-label', `Open ${pack.title}, ${cardsPerSheet} per sheet`); save.setAttribute('aria-label', `Download ${pack.title}, ${cardsPerSheet} per sheet`);
      links.append(open, save); card.append(links); list.append(card);
    }
    root.append(picker, list);
  }

  function readingCards() {
    const words = new Map(classroom.pool('learn').map(word => [word.id, word]));
    return TransportStandard.readingCards.filter(card => words.has(card.itemId)).map(card => ({...card, word: words.get(card.itemId)}));
  }

  function reading(root) {
    const cards = readingCards(), explored = readExplored();
    if (!cards.length) { root.append(el('h3', '', 'Reading cards'), el('p', '', 'No reading cards match the words chosen in Teacher. Widen the word choice to see more cards.')); return; }
    readingIndex = Math.min(readingIndex, cards.length - 1);
    const card = cards[readingIndex], done = explored.has(card.id);
    els.round.textContent = `Card ${readingIndex + 1} of ${cards.length}`;
    const view = el('article', 'reading-card');
    const picture = el('img', 'reading-picture'); picture.src = card.word.image; picture.alt = card.word.name;
    const sentence = el('p', 'reading-sentence', card.sentence);
    const prompts = el('div', 'reading-prompts');
    const draw = el('section', 'reading-prompt'); draw.append(el('h4', '', 'Draw'), el('p', '', card.draw));
    const talk = el('section', 'reading-prompt'); talk.append(el('h4', '', 'Talk'), el('p', '', card.talk));
    prompts.append(draw, talk);
    view.append(el('p', 'reading-word', card.word.name), picture, sentence, prompts);
    if (done) view.append(el('p', 'reading-done', 'Explored'));
    const go = step => { readingIndex = (readingIndex + step + cards.length) % cards.length; renderStandardHub('create'); };
    const actions = el('div', 'standard-actions reading-actions');
    actions.append(
      standardButton('Previous', () => go(-1)),
      standardButton('Hear sentence', () => speak(card.sentence)),
      standardButton(done ? 'Explored' : 'Mark as explored', () => { explored.add(card.id); saveExplored(explored); renderStandardHub('create'); }),
      standardButton('Next', () => go(1)));
    if (done) actions.children[2].disabled = true;
    root.append(view, actions);
  }

  globalThis.TransportMedia = {
    render(mode, groupId, root) {
      if (mode === 'media' && groupId === 'printables') { printables(root); return true; }
      if (mode === 'create') { reading(root); return true; }
      return false;
    }
  };
})();
