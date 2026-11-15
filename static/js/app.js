/* global React, ReactDOM, htm, LEO */
// Layout follows the Nerfies project-page template (Bulma). Content is in data.js.
(function () {
  const { useState, useEffect, useRef } = React;
  const html = htm.bind(React.createElement);
  const D = window.LEO;

  const refNumber = (key) => D.references.findIndex((r) => r.key === key) + 1;
  const taskById = (id) => D.tasks.find((t) => t.id === id);

  const SECTIONS = [
    { id: 'summary', label: 'Summary' },
    { id: 'rollouts', label: 'Rollouts' },
    { id: 'results', label: 'Results' },
    { id: 'method', label: 'Method' },
    { id: 'references', label: 'References' },
  ];

  /* ---------- small pieces ---------- */

  function Cite({ k }) {
    const n = refNumber(k);
    const ref = D.references[n - 1];
    // Carries its own leading space, so write it directly after the word it follows.
    return html`${'\u00a0'}<a className="cite" href=${'#ref-' + k} title=${ref.authors + '. ' + ref.title + '. ' + ref.venue}>[${n}]</a>`;
  }

  function Nav() {
    const [active, setActive] = useState('summary');
    useEffect(() => {
      if (!('IntersectionObserver' in window)) return undefined;
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
        { rootMargin: '-30% 0px -65% 0px' }
      );
      SECTIONS.forEach((s) => {
        const el = document.getElementById(s.id);
        if (el) io.observe(el);
      });
      return () => io.disconnect();
    }, []);
    return html`
      <nav className="topnav" aria-label="Page sections">
        <div className="container is-max-desktop topnav-inner">
          <a className="topnav-brand" href="#summary">LEO</a>
          <div className="topnav-links">
            ${SECTIONS.map(
              (s) => html`<a key=${s.id} href=${'#' + s.id} className=${active === s.id ? 'on' : ''} aria-current=${active === s.id ? 'true' : null}>${s.label}</a>`
            )}
          </div>
        </div>
      </nav>
    `;
  }

  function Tabs({ items, value, onChange, label }) {
    return html`
      <div className="tabs is-centered is-boxed" role="tablist" aria-label=${label}>
        <ul>
          ${items.map(
            (it) => html`
              <li key=${it.id} className=${it.id === value ? 'is-active' : ''}>
                <a role="tab" href="#" aria-selected=${it.id === value} onClick=${(e) => { e.preventDefault(); onChange(it.id); }}>${it.name}</a>
              </li>
            `
          )}
        </ul>
      </div>
    `;
  }

  // One side-by-side clip. The label bar burned into the video is cropped off
  // and replaced by the labels rendered here.
  function Clip({ clip, autoplay }) {
    const ref = useRef(null);
    useEffect(() => {
      const v = ref.current;
      if (!v || !('IntersectionObserver' in window)) return undefined;
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        },
        { threshold: 0.5 }
      );
      io.observe(v);
      return () => io.disconnect();
    }, [clip.file]);
    return html`
      <figure className="clip">
        <div className="clip-labels">
          ${clip.panels.map(
            ([policy, ok, what]) => html`
              <div key=${policy} className="clip-label">
                <span className="clip-policy">${D.policies[policy]}</span>
                <span className=${'outcome ' + (ok ? 'ok' : 'bad')}>
                  <span aria-hidden="true">${ok ? '✓' : '✕'}</span> ${ok ? 'Success' : 'Fail'}<span className="what">: ${what}</span>
                </span>
              </div>
            `
          )}
        </div>
        <div className="clip-frame">
          <video
            key=${clip.file}
            ref=${ref}
            controls
            loop
            muted
            playsInline
            autoPlay=${autoplay}
            preload=${autoplay ? 'auto' : 'none'}
            poster=${'./videos/' + clip.file + '.jpg'}
            src=${'./videos/' + clip.file + '.mp4'}
          ></video>
        </div>
      </figure>
    `;
  }

  /* ---------- sections ---------- */

  function Header() {
    return html`
      <section className="hero" id="summary">
        <div className="hero-body">
          <div className="container is-max-desktop has-text-centered">
            <h1 className="title is-1 publication-title">${D.title}</h1>
            <div className="is-size-5 publication-authors">
              ${D.authors.map(
                (a, i) => html`<span key=${a} className="author-block">${a}<sup>*</sup>${i < D.authors.length - 1 ? ',' : ''}${' '}</span>`
              )}
            </div>
            <div className="is-size-5 publication-authors">
              <span className="author-block">${D.affiliation}</span>
            </div>
            <div className="is-size-6 publication-authors author-note"><sup>*</sup>${D.authorNote}</div>
            <div className="publication-links">
              <span className="link-block">
                <a className="button is-normal is-rounded is-dark" disabled>
                  <span className="icon"><i className="fas fa-file-pdf"></i></span><span>Paper (coming soon)</span>
                </a>
              </span>
              <span className="link-block">
                <a className="button is-normal is-rounded is-dark" disabled>
                  <span className="icon"><i className="fab fa-github"></i></span><span>Code (coming soon)</span>
                </a>
              </span>
              <span className="link-block">
                <a href="https://github.com/RoboTwin-Platform/RMBench" className="external-link button is-normal is-rounded is-dark">
                  <span className="icon"><i className="fas fa-robot"></i></span><span>RMBench</span>
                </a>
              </span>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function Summary() {
    return html`
      <section className="hero teaser">
        <div className="container is-max-desktop">
          <div className="hero-body">
            <h2 className="subtitle is-4 has-text-centered bluf">
              Giving ACT<${Cite} k="act" /> a memory of the episode raises its success rate on RMBench<${Cite} k="rmbench" /> Rearrange Blocks from <b>0%</b> to <b>100%</b>.
            </h2>

            <div className="stats">
              <div className="stat">
                <div className="stat-label">Rearrange Blocks</div>
                <div className="stat-value">0 <span className="arrow">→</span> 100%</div>
                <div className="stat-sub">without memory → with memory</div>
              </div>
              <div className="stat">
                <div className="stat-label">Put Back Block</div>
                <div className="stat-value">32 <span className="arrow">→</span> 68%</div>
                <div className="stat-sub">100% with arm-history memory</div>
              </div>
              <div className="stat">
                <div className="stat-label">Observe and Pick Up</div>
                <div className="stat-value">6%</div>
                <div className="stat-sub">our best; unsolved by every policy</div>
              </div>
            </div>

            <${Clip} clip=${D.heroClip} autoplay=${true} />
            <p className="caption has-text-centered">
              Rearrange Blocks, same starting scene for all three policies. Head camera, unedited.
              <a href="#rollouts"> More rollouts ↓</a>
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container is-max-desktop">
          <div className="columns is-centered">
            <div className="column is-four-fifths">
              <h2 className="title is-3 has-text-centered">What we found</h2>
              <div className="content">
                <ol className="findings">
                  <li>
                    <b>Memory fixes the tasks ACT cannot do.</b> Reading a memory of past frames at every step: 0 → 100
                    on Rearrange Blocks, 32 → 68 on Put Back Block.
                  </li>
                  <li>
                    <b>The arm's own history is enough.</b> A memory of past joint positions only, with no images,
                    scores 100 on both tasks. Reported: 89 and 90 for Mem-0<${Cite} k="rmbench" />, 100 and 100 for IMPRINT<${Cite} k="imprint" />.
                  </li>
                  <li>
                    <b>Level with IMPRINT on two tasks, on a far smaller budget.</b> IMPRINT<${Cite} k="imprint" /> fine-tunes a pretrained model of about 3.3B parameters on about 16.6M training samples. Ours is an ACT of about 80M parameters trained from scratch on about 240,000. <a href="#budget">Training budget ↓</a>
                  </li>
                  <li>
                    <b>Gating the memory hurts.</b> Letting the policy decide when to read memory<${Cite} k="gmp" /> drops the scores to 9 and 20.
                  </li>
                  <li>
                    <b>Observe and Pick Up is unsolved.</b> Our best is 6% (ACT-SMT). The best RMBench reports is 9%<${Cite} k="rmbench" />, and IMPRINT also reports 9%<${Cite} k="imprint" />.
                  </li>
                </ol>
                <p className="caveat">
                  <b>Caveat:</b> our numbers are from one training seed. <a href="#seeds">Seed variance ↓</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function Rollouts() {
    const [taskId, setTaskId] = useState(D.tasks[0].id);
    const [index, setIndex] = useState(0);
    const task = taskById(taskId);
    const clips = D.clips[taskId];
    const clip = clips[index];
    const pick = (id) => {
      setTaskId(id);
      setIndex(0);
    };
    return html`
      <section className="section" id="rollouts">
        <div className="container is-max-desktop">
          <h2 className="title is-3 has-text-centered">Rollouts</h2>
          <p className="lede has-text-centered">Pick a task and a starting scene. Each clip runs three policies from the same scene.</p>
          <${Tabs} items=${D.tasks} value=${taskId} onChange=${pick} label="Task" />
          <p className="goal has-text-centered"><b>Task:</b> ${task.goal}</p>
          <div className="buttons is-centered" role="group" aria-label="Scene">
            ${clips.map(
              (c, i) => html`
                <button
                  key=${c.file}
                  aria-pressed=${i === index}
                  className=${'button is-small is-rounded ' + (i === index ? 'is-link' : '')}
                  onClick=${() => setIndex(i)}
                >
                  ${c.label}
                </button>
              `
            )}
          </div>
          <${Clip} clip=${clip} autoplay=${false} />
        </div>
      </section>
    `;
  }

  function Cell({ value, best, source }) {
    if (value === null || value === undefined) {
      return html`<td className="num na" title="Not evaluated">–</td>`;
    }
    return html`
      <td className=${'num' + (best ? ' best' : '')}>
        <span className="val">${value}</span>
        <span className="bar" aria-hidden="true"><span className=${source} style=${{ width: value + '%' }}></span></span>
      </td>
    `;
  }

  function Results() {
    const cols = D.tasks.map((t) => t.id);
    const all = D.results.reduce((acc, g) => acc.concat(g.rows), []);
    const best = {};
    cols.forEach((c) => {
      best[c] = Math.max.apply(null, all.map((r) => (r[c] === null ? -1 : r[c])));
    });
    return html`
      <section className="section" id="results">
        <div className="container is-max-desktop">
          <h2 className="title is-3 has-text-centered">Results</h2>
          <p className="lede has-text-centered">
            Success rate (%) over 100 rollouts: our runs next to the numbers reported in the RMBench<${Cite} k="rmbench" /> and IMPRINT<${Cite} k="imprint" /> papers. Bold is the best in each column.
          </p>
          <p className="legend has-text-centered">
            <span><i className="swatch ours"></i>Ours (training seed 0)</span>
            <span><i className="swatch rmbench"></i>Reported by RMBench<${Cite} k="rmbench" /></span>
            <span><i className="swatch imprint"></i>Reported by IMPRINT<${Cite} k="imprint" /></span>
          </p>
          <div className="table-container">
            <table className="table is-hoverable is-fullwidth results">
              <thead>
                <tr>
                  <th scope="col">Policy</th>
                  <th scope="col">Source</th>
                  ${D.tasks.map((t) => html`<th key=${t.id} scope="col" className="num">${t.name}</th>`)}
                </tr>
              </thead>
              ${D.results.map(
                (g) => html`
                  <tbody key=${g.group}>
                    <tr className="group"><th colSpan="5" scope="colgroup">${g.group}</th></tr>
                    ${g.rows.map(
                      (r) => html`
                        <tr key=${r.policy || r.label}>
                          <th scope="row">
                            ${r.label || D.policies[r.policy]}
                            ${r.note && html`<span className="rownote">${r.note}</span>`}
                          </th>
                          <td className="src">
                            ${r.source === 'ours'
                              ? html`<span className="tag ours">Ours</span>`
                              : html`<span className=${'tag ' + r.source}>${r.source === 'imprint' ? 'IMPRINT' : 'RMBench'}<${Cite} k=${r.source} /></span>`}
                          </td>
                          ${cols.map((c) => html`<${Cell} key=${c} value=${r[c]} source=${r.source} best=${r[c] === best[c]} />`)}
                        </tr>
                      `
                    )}
                  </tbody>
                `
              )}
            </table>
          </div>

          <div className="columns notes">
            <div className="column content">
              <h3 className="title is-6">How to read the rows</h3>
              <ul>
                <li><b>${D.policies.memory}</b> reads the memory at every step. <b>Gated</b> lets a learned gate decide when.</li>
                <li><b>First-frame</b> stores only the first frame. <b>Arm-history</b> stores past joint positions and time, no images.</li>
                <li>On Put Back Block, ${D.policies.ourAct} always returns the block to the back mat, so it succeeds only when the block started there.</li>
                <li>RMBench rows are from Table 1 of that paper (arXiv v4); IMPRINT rows are from its Table 10 (arXiv v1). We did not rerun either.</li>
                <li>IMPRINT adds memory to Pi0.5, a pretrained vision-language-action model; our policies are ACT trained from scratch.</li>
              </ul>
            </div>
            <div className="column content" id="seeds">
              <h3 className="title is-6">Seed variance</h3>
              <ul>
                <li>${D.policies.rmbenchAct} scores 38, 0, 0 on Rearrange Blocks and 0, 49, 0 on Put Back Block for training seeds 0, 1, 2.</li>
                <li>Seeds 1 and 2 for the memory variants are in progress.</li>
                <li>ACT-SMT has been evaluated on Observe and Pick Up only.</li>
              </ul>
            </div>
          </div>
          <h3 className="title is-5" id="budget">Training budget against IMPRINT</h3>
          <p className="lede">
            On Rearrange Blocks and Put Back Block our best policy and IMPRINT<${Cite} k="imprint" /> both score 100%. IMPRINT sees about 70 times more training samples, on a model about 40 times larger that was already pretrained.
          </p>
          <div className="table-container">
            <table className="table is-fullwidth budget">
              <thead>
                <tr>${D.budget.columns.map((c, i) => html`<th key=${i} scope="col">${c}</th>`)}</tr>
              </thead>
              <tbody>
                ${D.budget.rows.map(
                  (r) => html`
                    <tr key=${r[0]}>
                      <th scope="row">${r[0]}</th>
                      <td>${r[1]}</td>
                      <td>${r[2]}</td>
                      <td className="ratio">${r[3]}</td>
                    </tr>
                  `
                )}
              </tbody>
            </table>
          </div>
          <div className="content">
            <ul className="budget-notes">
              <li>Samples seen = gradient updates x batch size. Multiplying by model size gives a rough estimate of about 3,000 times less training compute for ours. IMPRINT's pretraining is not counted.</li>
              <li>IMPRINT's updates and batch size are from Table 3 of its paper. Parameter counts are approximate and are not stated there.</li>
              <li>Not like for like: IMPRINT is evaluated on all nine RMBench tasks; ours is one training seed on three.</li>
              <li>We have not tested whether more training would raise our scores.</li>
            </ul>
          </div>
          <p className="fine">
            Our training follows the RMBench ACT recipe<${Cite} k="rmbench" />: 6,000 epochs, batch size 8, 50
            demonstrations per task with 10 held out. Evaluation uses temporal aggregation.
          </p>
        </div>
      </section>
    `;
  }

  const SMT_DIAGRAM = `
    <text x="0" y="18" class="hd">Stage 1: Supervised Memory Training</text>
    <rect class="step" x="0" y="32" width="150" height="54" rx="6"/>
    <text x="75" y="54" text-anchor="middle">Frames + joints</text>
    <text x="75" y="72" text-anchor="middle" class="sub">x_0 ... x_t</text>
    <line x1="150" y1="59" x2="178" y2="59"/><path d="M172 54 L180 59 L172 64"/>
    <rect class="step new" x="182" y="32" width="170" height="54" rx="6"/>
    <text x="267" y="54" text-anchor="middle">Teacher encoder</text>
    <text x="267" y="72" text-anchor="middle" class="sub">full history, bidirectional</text>
    <line x1="352" y1="59" x2="380" y2="59"/><path d="M374 54 L382 59 L374 64"/>
    <rect class="step" x="384" y="32" width="120" height="54" rx="6"/>
    <text x="444" y="54" text-anchor="middle">Memory z_t</text>
    <text x="444" y="72" text-anchor="middle" class="sub">M tokens, fixed size</text>
    <line x1="504" y1="59" x2="532" y2="59"/><path d="M526 54 L534 59 L526 64"/>
    <rect class="step new" x="536" y="32" width="150" height="54" rx="6"/>
    <text x="611" y="54" text-anchor="middle">Decoder</text>
    <text x="611" y="72" text-anchor="middle" class="sub">predicts future frames</text>
    <line x1="444" y1="86" x2="444" y2="124"/><path d="M439 118 L444 126 L449 118"/>
    <rect class="step new" x="364" y="128" width="160" height="54" rx="6"/>
    <text x="444" y="150" text-anchor="middle">Updater</text>
    <text x="444" y="168" text-anchor="middle" class="sub">(z_t, x_t+1) to z_t+1</text>
    <text x="444" y="202" text-anchor="middle" class="sub">one-step supervision, then DMT on its own rollouts</text>
    <text x="700" y="18" class="hd">Stage 2 and deployment</text>
    <rect class="step" x="700" y="32" width="130" height="54" rx="6"/>
    <text x="765" y="54" text-anchor="middle">New frame</text>
    <text x="765" y="72" text-anchor="middle" class="sub">every control step</text>
    <line x1="765" y1="86" x2="765" y2="124"/><path d="M760 118 L765 126 L770 118"/>
    <rect class="step new" x="700" y="128" width="130" height="54" rx="6"/>
    <text x="765" y="150" text-anchor="middle">Updater</text>
    <text x="765" y="168" text-anchor="middle" class="sub">frozen</text>
    <line x1="830" y1="155" x2="858" y2="155"/><path d="M852 150 L860 155 L852 160"/>
    <rect class="step" x="862" y="128" width="130" height="54" rx="6"/>
    <text x="927" y="150" text-anchor="middle">ACT</text>
    <text x="927" y="168" text-anchor="middle" class="sub">+ z_t tokens</text>
    <line x1="927" y1="182" x2="927" y2="218"/><path d="M922 212 L927 220 L932 212"/>
    <text x="927" y="240" text-anchor="middle">Action chunk</text>`;

  const METHODS = [
    { id: 'gated', name: 'Frame memory' },
    { id: 'smt', name: 'ACT-SMT' },
  ];

  function Method() {
    const [tab, setTab] = useState('gated');
    return html`
      <section className="section" id="method">
        <div className="container is-max-desktop">
          <h2 className="title is-3 has-text-centered">Method</h2>
          <p className="lede has-text-centered">
            ACT<${Cite} k="act" /> sees only the current observation. We add a memory of the episode in two ways.
          </p>
          <${Tabs} items=${METHODS} value=${tab} onChange=${setTab} label="Method" />
          <div className="columns is-centered">
            <div className="column is-four-fifths content">
              ${tab === 'gated'
                ? html`
                    <p>
                      Following Gated Memory Policy<${Cite} k="gmp" />, a cache holds past frames and a cross-attention
                      layer added to ACT's decoder reads from it.
                    </p>
                    <ul>
                      <li><b>Cache:</b> the first frame and every fourth past frame, one token each.</li>
                      <li><b>Gate:</b> predicted from the current observation; decides at each step whether memory is used. With the gate closed the model is the original ACT.</li>
                      <li><b>Variants we test:</b> gate always open, gated, first frame only, and images removed so only past joint positions and time remain.</li>
                    </ul>
                  `
                : html`
                    <p>
                      A fixed-size memory z<sub>t</sub> summarizes the episode, trained with Supervised Memory Training<${Cite} k="smt" />.
                    </p>
                    <ul>
                      <li><b>Teacher encoder:</b> a bidirectional Transformer that sees the full history and produces the memory.</li>
                      <li><b>Decoder:</b> predicts future observations from the memory.</li>
                      <li><b>Updater:</b> a small recurrent network trained with one-step supervision to map the current memory and the next observation to the next memory.</li>
                      <li><b>At test time:</b> the updater is frozen and run online; its memory is given to ACT as extra tokens.</li>
                    </ul>
                  `}
            </div>
          </div>
          ${tab === 'smt' &&
          html`
            <div className="pipe-wrap">
              <svg
                className="pipe"
                viewBox="0 0 1000 250"
                role="img"
                aria-label="ACT-SMT pipeline: SMT pretraining of encoder, decoder and updater, then ACT training and deployment with the frozen updater."
                dangerouslySetInnerHTML=${{ __html: SMT_DIAGRAM }}
              ></svg>
            </div>
            <p className="fine has-text-centered">The encoder and decoder are used only during pretraining. The frozen updater runs at test time.</p>
          `}
        </div>
      </section>
    `;
  }

  function References() {
    const bib = `@misc{leo2026,
  author = {Firozi, Ammaar and Browning, Jake D. and Chen, Bo-Hung and Chou, Yu-Lun and Jacobs, Aaron and Bui, Linh-Co},
  title  = {LEO: Latent Episodic Overview for Action Chunking Transformers},
  year   = {2026},
  note   = {Course project, CMU 16-831 Introduction to Robot Learning}
}`;
    return html`
      <section className="section" id="references">
        <div className="container is-max-desktop content">
          <h2 className="title is-3">References</h2>
          <ol className="refs">
            ${D.references.map(
              (r) => html`
                <li key=${r.key} id=${'ref-' + r.key}>
                  ${r.authors.replace(/\.$/, '')}. <a href=${r.url}>${r.title}</a>. ${r.venue}.
                </li>
              `
            )}
          </ol>
          <h2 className="title is-3" id="BibTeX">BibTeX</h2>
          <pre><code>${bib}</code></pre>
          <h2 className="title is-3">Acknowledgements</h2>
          <p>
            RMBench<${Cite} k="rmbench" /> provides the simulator, tasks, expert demonstrations and evaluation code.
            This project was done for 16-831 Introduction to Robot Learning at Carnegie Mellon University, Fall 2026.
          </p>
        </div>
      </section>
    `;
  }

  function Footer() {
    return html`
      <footer className="footer">
        <div className="container">
          <div className="content has-text-centered">
            <p>Page template borrowed from <a href="https://nerfies.github.io/">Nerfies</a>.</p>
          </div>
        </div>
      </footer>
    `;
  }

  function App() {
    return html`
      <${React.Fragment}>
        <${Nav} />
        <${Header} />
        <${Summary} />
        <${Rollouts} />
        <${Results} />
        <${Method} />
        <${References} />
        <${Footer} />
      <//>
    `;
  }

  ReactDOM.createRoot(document.getElementById('root')).render(html`<${App} />`);
})();
