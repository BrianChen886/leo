/* global React, ReactDOM, htm, LEO */
// Layout follows the Nerfies project-page template (Bulma). Content is in data.js.
(function () {
  const { useState, useEffect, useRef } = React;
  const html = htm.bind(React.createElement);
  const D = window.LEO;

  const refNumber = (key) => D.references.findIndex((r) => r.key === key) + 1;
  const taskById = (id) => D.tasks.find((t) => t.id === id);

  /* ---------- small pieces ---------- */

  function Cite({ k }) {
    const n = refNumber(k);
    const ref = D.references[n - 1];
    // Carries its own leading space, so write it directly after the word it follows.
    return html`${'\u00a0'}<a className="cite" href=${'#ref-' + k} title=${ref.authors + '. ' + ref.title + '. ' + ref.venue}>[${n}]</a>`;
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
                <span className=${'outcome ' + (ok ? 'ok' : 'bad')}>${ok ? 'Success' : 'Failure'}<span className="what">: ${what}</span></span>
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
      <section className="hero">
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
                <a href="#results" className="button is-normal is-rounded is-dark">
                  <span className="icon"><i className="fas fa-table"></i></span><span>Results</span>
                </a>
              </span>
              <span className="link-block">
                <a href="#videos" className="button is-normal is-rounded is-dark">
                  <span className="icon"><i className="fas fa-video"></i></span><span>Videos</span>
                </a>
              </span>
              <span className="link-block">
                <a href="https://github.com/RoboTwin-Platform/RMBench" className="external-link button is-normal is-rounded is-dark">
                  <span className="icon"><i className="fab fa-github"></i></span><span>RMBench</span>
                </a>
              </span>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function Teaser() {
    return html`
      <section className="hero teaser">
        <div className="container is-max-desktop">
          <div className="hero-body">
            <${Clip} clip=${D.heroClip} autoplay=${true} />
            <h2 className="subtitle has-text-centered teaser-caption">
              Rearrange Blocks from the same initial scene. ACT without memory fails; ACT with a memory of the
              episode completes the task.
            </h2>
          </div>
        </div>
      </section>
    `;
  }

  function Abstract() {
    return html`
      <section className="section">
        <div className="container is-max-desktop">
          <div className="columns is-centered has-text-centered">
            <div className="column is-four-fifths">
              <h2 className="title is-3">Abstract</h2>
              <div className="content has-text-justified">
                <p>
                  Action Chunking with Transformers (ACT)<${Cite} k="act" /> is a strong and lightweight baseline
                  for imitation-based robotic manipulation, but the policy conditions only on the current
                  observation and has no mechanism for retaining information from earlier in an episode. This
                  limits its performance on tasks where the correct action depends on events that are no longer
                  visible, such as which object was moved, which steps have been completed, or what a previous
                  state looked like. Current policies often use vision-language models to provide an overview of
                  the history through selected frames and text descriptions, which is compute heavy at inference
                  time and loses information by compressing spatio-temporal features into natural language.
                </p>
                <p>
                  We augment ACT with two memory mechanisms, a frame memory read through cross-attention
                  following Gated Memory Policy<${Cite} k="gmp" /> and a recurrent latent memory trained with
                  Supervised Memory Training<${Cite} k="smt" />, and evaluate them on three tasks from
                  RMBench<${Cite} k="rmbench" />, a benchmark of memory-dependent bimanual manipulation. With
                  the frame memory, the success rate of ACT rises from 0% to 100% on Rearrange Blocks and from
                  32% to 68% on Put Back Block. A memory that stores only past joint positions reaches 100% on
                  both tasks, which matches the results reported for IMPRINT<${Cite} k="imprint" /> with a
                  policy of about 80M parameters trained from scratch. Gating the memory lowers the success
                  rate, and no policy we tested solves Observe and Pick Up. All of our results are from a
                  single training seed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  const FRAME_DIAGRAM = `
    <rect class="step new" x="0" y="20" width="210" height="54" rx="6"/>
    <text x="105" y="42" text-anchor="middle">Stored frames</text>
    <text x="105" y="60" text-anchor="middle" class="sub">first frame + every 4th past frame</text>
    <line x1="210" y1="47" x2="246" y2="47"/><path d="M240 42 L248 47 L240 52"/>
    <rect class="step new" x="250" y="20" width="170" height="54" rx="6"/>
    <text x="335" y="42" text-anchor="middle">Memory tokens</text>
    <text x="335" y="60" text-anchor="middle" class="sub">one token per stored frame</text>
    <line x1="420" y1="47" x2="456" y2="47"/><path d="M450 42 L458 47 L450 52"/>
    <rect class="step new" x="460" y="20" width="230" height="54" rx="6"/>
    <text x="575" y="42" text-anchor="middle">Memory cross-attention</text>
    <text x="575" y="60" text-anchor="middle" class="sub">output multiplied by the gate</text>
    <rect class="step new" x="770" y="20" width="150" height="54" rx="6"/>
    <text x="845" y="42" text-anchor="middle">Gate</text>
    <text x="845" y="60" text-anchor="middle" class="sub">from current observation</text>
    <line x1="770" y1="47" x2="694" y2="47"/><path d="M700 42 L692 47 L700 52"/>
    <line x1="575" y1="74" x2="575" y2="126"/><path d="M570 120 L575 128 L580 120"/>
    <text x="587" y="105" class="sub">added to the action queries</text>
    <rect class="step" x="0" y="130" width="210" height="54" rx="6"/>
    <text x="105" y="152" text-anchor="middle">Current observation</text>
    <text x="105" y="170" text-anchor="middle" class="sub">images + joint positions</text>
    <line x1="210" y1="157" x2="246" y2="157"/><path d="M240 152 L248 157 L240 162"/>
    <rect class="step" x="250" y="130" width="170" height="54" rx="6"/>
    <text x="335" y="162" text-anchor="middle">ACT encoder</text>
    <line x1="420" y1="157" x2="456" y2="157"/><path d="M450 152 L458 157 L450 162"/>
    <rect class="step" x="460" y="130" width="230" height="54" rx="6"/>
    <text x="575" y="162" text-anchor="middle">ACT decoder</text>
    <line x1="690" y1="157" x2="766" y2="157"/><path d="M760 152 L768 157 L760 162"/>
    <rect class="step" x="770" y="130" width="150" height="54" rx="6"/>
    <text x="845" y="162" text-anchor="middle">Action chunk</text>`;

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

  function Figure({ svg, viewBox, label, caption }) {
    return html`
      <figure className="method-figure">
        <div className="pipe-wrap">
          <svg className="pipe" viewBox=${viewBox} role="img" aria-label=${label} dangerouslySetInnerHTML=${{ __html: svg }}></svg>
        </div>
        <figcaption className="is-size-6 has-text-centered">${caption}</figcaption>
      </figure>
    `;
  }

  function Method() {
    return html`
      <section className="section" id="method">
        <div className="container is-max-desktop">
          <div className="columns is-centered">
            <div className="column is-four-fifths">
              <h2 className="title is-3 has-text-centered">Method</h2>
              <div className="content has-text-justified">
                <p>
                  ACT<${Cite} k="act" /> predicts a chunk of future actions from the current camera images and
                  joint positions. We keep the policy and its training recipe unchanged and add a memory of the
                  episode in two ways. The two variants are trained and evaluated separately.
                </p>
                <h3 className="title is-5">Frame memory</h3>
                <p>
                  Following Gated Memory Policy<${Cite} k="gmp" />, the first frame and every fourth past frame
                  of the episode are stored as one token each. A token encodes the camera images, the joint
                  positions and the time step of its frame. A cross-attention sublayer added to the ACT decoder
                  reads these tokens, and its output is added to the action queries. A gate computed from the
                  current observation multiplies this output, so that with the gate closed the model reduces to
                  the original ACT.
                </p>
                <p>We evaluate four versions of this memory:</p>
                <ul>
                  <li>${D.policies.memory}: the gate is fixed open, so the memory is read at every step.</li>
                  <li>${D.policies.gated}: the gate is calibrated as in Gated Memory Policy and then frozen; it decides at each step whether the memory is read.</li>
                  <li>${D.policies.firstFrame}: only the first frame is stored.</li>
                  <li>${D.policies.armHistory}: the image features are removed from every token, so the memory holds only past joint positions and time steps.</li>
                </ul>
              </div>
            </div>
          </div>
          <${Figure}
            svg=${FRAME_DIAGRAM}
            viewBox="0 0 1000 195"
            label="Frame memory: stored frames become memory tokens, which a gated cross-attention sublayer adds to the ACT decoder."
            caption="Figure 1. Frame memory. Shaded blocks are added to ACT."
          />
          <div className="columns is-centered">
            <div className="column is-four-fifths">
              <div className="content has-text-justified">
                <h3 className="title is-5">Latent memory (ACT-SMT)</h3>
                <p>
                  The second variant summarizes the episode in a fixed-size latent memory z<sub>t</sub>.
                  Following Supervised Memory Training<${Cite} k="smt" />, a bidirectional Transformer encoder
                  that sees the full history produces the memory, a causal decoder predicts future observations
                  from it, and a small recurrent updater is trained with one-step supervision to map the
                  current memory and the next observation to the next memory. The updater is then frozen and
                  run online, and its memory is given to ACT as additional input tokens.
                </p>
              </div>
            </div>
          </div>
          <${Figure}
            svg=${SMT_DIAGRAM}
            viewBox="0 0 1000 250"
            label="ACT-SMT pipeline: SMT pretraining of encoder, decoder and updater, then ACT training and deployment with the frozen updater."
            caption="Figure 2. ACT-SMT. The encoder and decoder are used only during pretraining; the frozen updater runs at test time."
          />
        </div>
      </section>
    `;
  }

  function Cell({ value, best }) {
    if (value === null || value === undefined) {
      return html`<td className="num na" title="Not evaluated">-</td>`;
    }
    return html`<td className="num">${best ? html`<b>${value}</b>` : value}</td>`;
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
          <div className="columns is-centered">
            <div className="column is-four-fifths">
              <h2 className="title is-3 has-text-centered">Results</h2>
              <div className="content has-text-justified">
                <p>
                  We use three RMBench tasks. In Rearrange Blocks the policy must remember which steps it has
                  already completed, in Put Back Block the mat a block started on, and in Observe and Pick Up
                  an object that was shown and then hidden. All of our policies are trained from scratch with
                  the RMBench ACT recipe<${Cite} k="rmbench" /> (6,000 epochs, batch size 8, 50 demonstrations
                  per task with 10 held out) and evaluated over 100 rollouts with temporal aggregation.
                </p>
              </div>
              <div className="table-container">
                <table className="table is-fullwidth results">
                  <caption>
                    Table 1. Success rate (%) over 100 rollouts. The best result in each column is in bold.
                    ACT-SMT was evaluated on Observe and Pick Up only.
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Policy</th>
                      ${D.tasks.map((t) => html`<th key=${t.id} scope="col" className="num">${t.name}</th>`)}
                    </tr>
                  </thead>
                  ${D.results.map(
                    (g) => html`
                      <tbody key=${g.group}>
                        <tr className="group">
                          <th colSpan="4" scope="colgroup">${g.group}${g.cite && html`<${Cite} k=${g.cite} />`}</th>
                        </tr>
                        ${g.rows.map(
                          (r) => html`
                            <tr key=${r.policy || r.label}>
                              <th scope="row">${r.label || D.policies[r.policy]}</th>
                              ${cols.map((c) => html`<${Cell} key=${c} value=${r[c]} best=${r[c] === best[c]} />`)}
                            </tr>
                          `
                        )}
                      </tbody>
                    `
                  )}
                </table>
              </div>
              <div className="content has-text-justified">
                <p>
                  ${D.policies.rmbenchAct} is the ACT implementation released with RMBench, trained by us. ${D.policies.ourAct} is
                  our own code with the memory removed, and is the baseline for the memory variants. The
                  RMBench and IMPRINT rows are taken from Table 1 of<${Cite} k="rmbench" /> and Table 10
                  of<${Cite} k="imprint" />; we did not rerun them.
                </p>
                <p>
                  Reading the frame memory at every step raises ACT from 0% to 100% on Rearrange Blocks and
                  from 32% to 68% on Put Back Block. With the gate, these fall to 9% and 20%. The arm-history
                  memory, which stores no images, reaches 100% on both tasks, so on these two tasks the
                  improvement comes from the history of the arm rather than from past images. On Put Back
                  Block, ACT without memory returns the block to the back mat in every rollout and succeeds
                  only when the block started there. Observe and Pick Up remains unsolved: our best result is
                  6% with ACT-SMT, and the best reported result is 9%<${Cite} k="rmbench" /><${Cite} k="imprint" />.
                </p>
                <p>
                  Results vary across training seeds. ${D.policies.rmbenchAct} scores 38%, 0% and 0% on
                  Rearrange Blocks and 0%, 49% and 0% on Put Back Block for seeds 0, 1 and 2. The memory
                  variants have been trained with seed 0 only.
                </p>
                <h3 className="title is-5">Comparison with IMPRINT</h3>
                <p>
                  IMPRINT<${Cite} k="imprint" /> adds memory to Pi0.5, a pretrained vision-language-action
                  model, and reports 100% on Rearrange Blocks and Put Back Block. ACT with arm-history memory
                  reaches the same success rate on these two tasks with a smaller model and less training
                  (Table 2). The comparison is limited: IMPRINT is evaluated on all nine RMBench tasks, while
                  our results cover three tasks and one training seed, and we have not tested whether longer
                  training changes our results.
                </p>
              </div>
              <div className="table-container">
                <table className="table is-fullwidth budget">
                  <caption>
                    Table 2. Model size and training budget. Training samples seen is gradient updates times
                    batch size. IMPRINT figures are from Tables 3 and 10 of<${Cite} k="imprint" />; its
                    pretraining is not counted. Parameter counts are approximate.
                  </caption>
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
                        </tr>
                      `
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function Videos() {
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
      <section className="section" id="videos">
        <div className="container is-max-desktop">
          <h2 className="title is-3 has-text-centered">Rollout Videos</h2>
          <div className="columns is-centered">
            <div className="column is-four-fifths content has-text-justified">
              <p>
                Each video shows three policies on the same evaluation seed, so all three start from the same
                scene. Videos are recorded from the head camera during evaluation and are not edited.
              </p>
            </div>
          </div>
          <${Tabs} items=${D.tasks} value=${taskId} onChange=${pick} label="Task" />
          <p className="goal has-text-centered">${task.goal}</p>
          <div className="buttons is-centered" role="group" aria-label="Evaluation scene">
            ${clips.map(
              (c, i) => html`
                <button
                  key=${c.file}
                  aria-pressed=${i === index}
                  className=${'button is-small ' + (i === index ? 'is-dark' : '')}
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

  function References() {
    const bib = `@misc{leo2026,
  author = {Firozi, Ammaar and Browning, Jake D. and Chen, Bo-Hung and Chou, Yu-Lun and Jacobs, Aaron and Bui, Linh-Co},
  title  = {LEO: Latent Episodic Overview for Action Chunking Transformers},
  year   = {2026},
  note   = {Course project, CMU 16-831 Introduction to Robot Learning}
}`;
    return html`
      <section className="section" id="BibTeX">
        <div className="container is-max-desktop content">
          <h2 className="title is-3">BibTeX</h2>
          <pre><code>${bib}</code></pre>
          <h2 className="title is-3" id="references">References</h2>
          <ol className="refs">
            ${D.references.map(
              (r) => html`
                <li key=${r.key} id=${'ref-' + r.key}>
                  ${r.authors.replace(/\.$/, '')}. <a href=${r.url}>${r.title}</a>. ${r.venue}.
                </li>
              `
            )}
          </ol>
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
        <${Header} />
        <${Teaser} />
        <${Abstract} />
        <${Method} />
        <${Results} />
        <${Videos} />
        <${References} />
        <${Footer} />
      <//>
    `;
  }

  ReactDOM.createRoot(document.getElementById('root')).render(html`<${App} />`);
})();
